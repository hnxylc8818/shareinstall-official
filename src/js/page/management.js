/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global Handlebars */
/* global layer */
/* global QRCode */
var DfttModule = (function (dm) {
  var Index = {
    name: 'Index',
    typed: null,
    word: '',
    page: 1,
    pageMax: 1,
    init: function () {
      var _this = this
      _this.tpl = $('#channelTmp').html()
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
      _this.handlebarHelp()
      _this.renderList()
      _this.removeChannel()
      _this.searchList()
      _this.selectPage()
      _this.changePlate()
      _this.viewCodeMa()
    },

    // 转换时间戳
    timetrans: function (date) {
      date = new Date(date * 1000); // 如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    },

    // 渲染页面appkey
    writeAppkey: function () {
      var appKey = $.cookie('appkey')
      if (appKey) {
        $('#app_key').text(appKey)
        $('#configAppKey').text(appKey)
      }
    },

    // 渲染应用icon
    drawAppicon: function () {
      var appIcon = $.cookie('img')
      if (appIcon) {
        $('#app_icon').attr('src', appIcon)
      }
    },

    // 渲染应用名称
    writeAppName: function () {
      var appName = $.cookie('appName')
      if (appName) {
        $('#app_name').text(appName)
      }
    },

    // 生成二维码
    generateCodeMa: function (url, name) {
      // var requestUrl = 'http://s.jiathis.com/qrcode.php?url=' + url
      // $.get(requestUrl, function (data) {
      //   callback(data)
      // })
      var codeWrap = $('#_qr_container')
      if (codeWrap.length <= 0) {
        codeWrap = $('<div id="_qr_container"><p class="qr_title"></p><div class="qr_img"></div><p class="qr_url"></p>')
        codeWrap.appendTo(document.body)
        codeWrap.find('.qr_title').html(name);
      }
      var curCode = new QRCode(codeWrap.find('.qr_img').empty()[0], {
        text: url,
        width: 300,
        height: 300,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })

      console.log(curCode)

      layer.open({
        type: 1,
        title: '',
        closeBtn: 0,
        area: '400px',
        skin: 'layui-layer-nobg',
        shadeClose: !0,
        content: codeWrap
      })
    },

    // 查看二维码
    viewCodeMa: function () {
      var _this = this
      $(document).on('click', '.img-link-look', function () {
        var url = $(this).siblings('a').attr('href'),
          name = $(this).parents('td').prev('td').text(),
          text = '渠道名称：<strong style=\'font-size:1.1em;color:green\'>' + name + '</strong>'
        _this.generateCodeMa(url, text)
      })
    },

    // 渲染应用列表
    renderList: function () {
      var _this = this
      $.ajax({
        url: 'http://api.shareinstall.com/channel/getlist',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          page: _this.page || 1,
          size: 10,
          search: {'channel_name': _this.word || ''}
        },
        success: function (data) {
          if (data.code === '0') {
            _this.pageMax = data.data.page.max
            data.data.page.more = (data.data.page.next < data.data.page.max) ? !0 : !1
            $.each(data.data.list, function (index, item) {
              item.createTime = _this.timetrans(item.createTime)
              if (item.page_type === '1') {
                item.page = window.location.href.replace('management.html', '') + 'demo.html?appkey=' + $.cookie('appkey') + '&channel=' + item.channel_code
              }
              item.stats = {
                v: 0,
                i: 0,
                r: 0
              }
            })
            var template = Handlebars.compile(_this.tpl)
            var html = template(data.data)
            $('#channelContainer').html(html)
            console.log(data.data)
          } else if (data.code === '88') {
            layer.msg('登录失效，请重新登录')
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          }
        }
      })
    },

    // 删除频道弹窗事件
    removeChannel: function () {
      var _this = this
      $('body').on('click', '.img-link-lock', function () {
        var channelId = $(this).attr('data-id')
        layer.confirm('渠道被删除后，分发出去的渠道链接将失效，确定要删除吗？', {
          btn: ['确定删除', '取消']
        }, function () {
          _this.requestRemove(channelId)
        })
      })
    },

    // 删除频道接口交互
    requestRemove: function (id) {
      var _this = this
      $.ajax({
        url: 'http://api.shareinstall.com/channel/delete',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          channel_id: id
        },
        success: function (data) {
          if (parseInt(data.code) === 0) {
            _this.renderList()
            layer.msg('删除成功')
          } else {
            layer.msg(data.message)
          }
        },
        error: function () {
          layer.msg('删除失败')
        }
      })
    },

    // 关键字搜索
    searchList: function () {
      var _this = this
      $('#search_button').on('click', function () {
        _this.word = $('input[name="search"]').val()
        _this.renderList()
      })
    },

    // 翻页
    selectPage: function () {
      var _this = this
      $('body').on('click', '.page-change', function () {
        _this.page = $(this).attr('data-page')
        _this.renderList()
      })

      $('body').on('click', '.page-change-start', function () {
        _this.page = 1
        _this.renderList()
      })

      $('body').on('click', '.page-change-end', function () {
        _this.page = _this.pageMax
        _this.renderList()
      })
    },

    // 渠道平台切换
    changePlate: function () {
      $('.data_profile li').on('click', function () {
        $(this).addClass('active').siblings('li').removeClass('active')
      })
    },

    // handlebar辅助
    handlebarHelp: function () {
      Handlebars.registerHelper('pager', function (e, a) {
        console.log(e)
        var r = "<ul class='pagination'>";
        e.prev > 0 ? r += '<li><a href="javascript:;" class="page-change-start">&lt;</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>&lt;</a></li>"
        if (parseInt(e.curr) < 4) {
          for (var t = 0; t < parseInt(e.curr) - 1; t++) {
            r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (t + 1) + "'>" + (t + 1) + "</a></li>";
          }
        } else {
          r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (parseInt(e.curr) - 3) + "'>" + (parseInt(e.curr) - 2) + "</a></li>", r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (parseInt(e.curr) - 1) + "'>" + (parseInt(e.curr) - 1) + "</a></li>";
        }
        r = r + "<li class=\"active\"><a href='javascript:;'>" + (parseInt(e.curr)) + "</a></li>"
        if (e.max - parseInt(e.curr) <= 3) {
          for (var t2 = parseInt(e.curr); t2 < e.max; t2++) {
            r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (t2 + 1) + "'>" + (t2 + 1) + "</a></li>";
          }
        } else {
          r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (parseInt(e.curr) + 1) + "'>" + (parseInt(e.curr) + 1) + "</a></li>", r = r + "<li><a href='javascript:;' class='page-change' data-page='" + (parseInt(e.curr) + 2) + "'>" + (parseInt(e.curr) + 2) + "</a></li>";
        }
        return e.next <= e.max ? r += '<li><a class="page-change-end" href="javascript:;">&gt;</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>&gt;</a></li>", r + "</ul>"
      });

      Handlebars.registerHelper('more', function (page) {
        console.log(!!(page.next > page.max))
        return !!(page.next > page.max)
      })
    }

  };
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line

$(function () {
  // 调用初始化方法
  $.each(DfttModule, function (i, obj) {
    if ($.isPlainObject(obj)) {
      if ($.isFunction(obj.init)) {
        // obj.init()
      } else {
        console.error(obj.init + ' is not a Function!')
      }
    } else {
      console.error(obj + ' is not a PlainObject!')
    }
  })
})
/**
 * Created by admin on 2018/1/12.
 */

function removeChannel(id) {
  console.log('删除')
}