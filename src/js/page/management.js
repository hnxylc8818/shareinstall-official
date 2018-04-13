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
      _this.getAppInfo()
      _this.handlebarHelp()
      _this.renderList()
      _this.removeChannel()
      _this.selectPage()
      _this.viewCodeMa()
      _this.initTime()
      _this.triggerEvent()
      // _this.valuePicker()
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

    setUrlParam: function (location, name, value) {
      if (location.indexOf('?') < 0) {
        return location + '?' + name + '=' + value
      }
      var url = location;
      var splitIndex = url.indexOf('?') + 1;
      var paramStr = url.substr(splitIndex, url.length);

      var newUrl = url.substr(0, splitIndex);

      // - if exist , replace 
      var arr = paramStr.split('&');
      for (var i = 0; i < arr.length; i++) {
        var kv = arr[i].split('=');
        if (kv[0] == name) {
          newUrl += kv[0] + '=' + value;
        } else {
          if (kv[1] != undefined) {
            newUrl += kv[0] + '=' + kv[1];
          }
        }
        if (i != arr.length - 1) {
          newUrl += '&';
        }
      }

      // - if new, add
      if (newUrl.indexOf(name + '=') < 0) {
        newUrl += splitIndex == 0 ? '?' + name + '=' + value : '&' + name + '=' + value;
      }
      return newUrl;
    },

    // 获取应用信息
    getAppInfo: function () {
      var _this = this;
      $.ajax({
        url: 'http://api.shareinstall.com/appliance/getone',
        data: {
          app_key: $.cookie('appkey')
        },
        type: 'POST',
        success: function (data) {
          var overTime = data.data.app_over_time.replace(/-/g, '/');
          var remainTime = parseInt(new Date(overTime) - new Date()) / 1000 / 60 / 60 / 24
          // console.log(remainTime)
          data.code = parseInt(data.code)
          if (data.code === 0) {
            if (data.data.status == 0) {
              _this.pageInit()
            } else if (remainTime <= 10 && data.data.status == 2) {
              _this.pageInit(remainTime)
            }
          }
        }
      })
    },

    pageInit: function (time) {
      var $dom = $('#paymentInfo')
      var hasClose = 0
      if (time) {
        $dom.find('.pop-status').text('还有' + Math.round(time) + '天服务将过期')
        hasClose = 1
      }
      if (hasClose && !$.cookie('warnshow' + $.cookie('appkey'))) {
        $.cookie('warnshow' + $.cookie('appkey'), 1, {
          expires: 1
        })
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      } else if (!hasClose) {
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      }
    },

    // 生成二维码
    generateCodeMa: function (url, name) {
      // console.log(name)
      // var requestUrl = 'http://s.jiathis.com/qrcode.php?url=' + url
      // $.get(requestUrl, function (data) {
      //   callback(data)
      // })
      var codeWrap = $('#_qr_container')
      if (codeWrap.length <= 0) {
        codeWrap = $('<div id="_qr_container"><p class="qr_title"></p><div class="qr_img"></div><p class="qr_url"></p>')
        codeWrap.appendTo(document.body)
      }
      codeWrap.find('.qr_title').html(name);
      var curCode = new QRCode(codeWrap.find('.qr_img').empty()[0], {
        text: url,
        width: 300,
        height: 300,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })

      // console.log(curCode)

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

    // 初始化日期插件
    initTime: function () {
      var _this = this
      var name = $('#qidlistDate')
      name.attr('date-value', [moment().format('YYYYMMDD'), moment().format('YYYYMMDD')])
      var opt = {
        // startDate: moment().startOf('day'),
        //endDate: moment(),
        //minDate: '01/01/2012',    //最小时间
        maxDate: moment(), //最大时间
        dateLimit: {
          days: 30
        }, //起止时间的最大间隔
        showDropdowns: false,
        showWeekNumbers: false, //是否显示第几周
        timePicker: false, //是否显示小时和分钟
        timePickerIncrement: 60, //时间的增量，单位为分钟
        timePicker12Hour: false, //是否使用12小时制来显示时间
        ranges: {
          '所有': [moment("20160101", "YYYYMMDD"), moment()],
          '今日': [moment().startOf('day'), moment()],
          '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
          '最近7日': [moment().subtract('days', 6), moment()],
          '最近30日': [moment().subtract('days', 29), moment()]
        },
        opens: 'left', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
        format: 'YYYY/MM/DD', //控件中from和to 显示的日期格式
        separator: ' to ',
        locale: {
          applyLabel: '确定',
          cancelLabel: '取消',
          fromLabel: '起始时间',
          toLabel: '结束时间',
          customRangeLabel: '自定义',
          daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
          monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
          ],
          firstDay: 1
        }
      }
      var label = label ? label : '今日'

      name.html(label)
      name.daterangepicker(opt, function (start, end, label) { //格式化日期显示框
        var label = (label == '自定义' ? start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD') : label)
        name.html(label)
        var timeRangeChange = [start.format('YYYYMMDD'), end.format('YYYYMMDD')]
        name.attr('date-value', timeRangeChange)
        var exclude = name.parents('time').siblings('overlay-btn').attr('data-value')
        var platform = 'all'
        name.parents('.title').find('.data_profile li').each(function (index, item) {
          if ($(item).hasClass('active')) {
            platform = $(item).attr('data-value')
          }
        })

        var type = 0

        name.parents('.title').siblings('.contentER, .btnBox').find('[data-name="type"]').each(function (index, item) {
          if ($(item).hasClass('active')) {
            type = $(item).attr('data-value')
          }
        })

        _this.valuePicker()
        // _this.getAmountStatistics(timeRangeChange, name, exclude, platform, type)
      });
    },

    // 渲染应用列表
    renderList: function (date, plantform, sortname, sorttype, searchWord) {
      // console.log(date, plantform, sortname, sorttype, searchWord)
      var _this = this
      var sdate = moment().format('YYYYMMDD')
      var edate = moment().format('YYYYMMDD')
      if (date) {
        sdate = date.split(',')[0]
        edate = date.split(',')[1]
      }
      $('#_loading_mask').show()
      $.ajax({
        url: 'http://api.shareinstall.com/channel/getlist',
        type: 'POST',
        // async: false,
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          page: _this.page || 1,
          size: 10,
          startDate: sdate,
          endDate: edate,
          plantform: plantform || 'all',
          exclude: 0,
          sortname: sortname || 'createTime',
          sorttype: sorttype || 'desc',
          search: {
            'channel_name': searchWord || ''
          }
        },
        success: function (data) {
          if (data.code == 0) {
            $('#_loading_mask').hide()
            // _this.pageMax = data.data.page.max
            // data.data.page.more = (data.data.page.next < data.data.page.max) ? !0 : !1
            if (data.data instanceof Array !== true && _this.page === 1 && !searchWord) {
              data.data = []
            }
            $.each(data.data, function (index, item) {
              item.createTime = _this.timetrans(item.createTime)
              if (item.page_type === '1') {
                item.page = window.location.href.replace('management.html', '') + 'demo.html?appkey=' + $.cookie('appkey') + '&channel=' + item.channel_code
              } else if (item.page_type === '2') {
                // console.log(item.page)
                // item.page = item.page + '?channel=' + item.channel_code
                item.page = _this.setUrlParam(item.page, 'channel', item.channel_code)
                // console.log(item.page)
              }
            })

            if (data.data.length === 10) {
              data.pageNext = _this.page + 1
            }

            data.pageCur = _this.page
            data.pagePre = _this.page - 1
            var template = Handlebars.compile(_this.tpl)
            var html = template(data)
            $('#channelContainer').html(html)

            var sortDom = $('.channel-th th[data-field]')


            sortDom.each(function (index, item) {
              $(item).find('>span').removeClass('sort-none sort-asc sort-desc').addClass('sort-none')
              if ($(item).attr('data-field') === sortname) {
                $(item).find('>span').removeClass('sort-none sort-asc sort-desc').addClass('sort-' + sorttype)
              }
            })
            // console.log(data.data)
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
        layer.confirm('渠道被删除后，分发出去的渠道链接将失效，且不能再创建同编号的渠道链接，确定要删除吗？', {
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

    // 翻页
    selectPage: function () {
      var _this = this
      $('body').on('click', '.page-change', function () {
        _this.page = $(this).attr('data-page')
        _this.valuePicker()
      })

      $('body').on('click', '.page-change-start', function () {
        _this.page -= 1
        _this.renderList()
      })

      $('body').on('click', '.page-change-end', function () {
        _this.page += 1
        _this.valuePicker()
      })
    },

    // 页面数据采集
    valuePicker: function () {
      // $('.data_profile li').on('click', function () {
      //   $(this).addClass('active').siblings('li').removeClass('active')
      // })
      var searchWord = $('#search_form input').val()
      var plantform = $('.data_profile').find('.active').attr('data-value')
      var date = $('#qidlistDate').attr('date-value')
      var sortDom = $('.channel-th th[data-field]'),
        sortname = '',
        sorttype = ''

      sortDom.each(function (index, item) {
        if (!$(item).find('>span').hasClass('sort-none')) {
          sortname = $(item).attr('data-field')
          sorttype = $(item).find('>span').attr('class').split('-')[1]
        }
      })


      this.renderList(date, plantform, sortname, sorttype, searchWord)

      // console.log(date, plantform, sortname, sorttype, searchWord)
    },

    // 页面列表重新渲染触发
    triggerEvent: function () {
      var _this = this
      $('.date-container').on('click', function (e) {
        if (e.target.className !== 'date-value') {
          $(this).find('.date-value').click()
        }
        // alert('a')
      })
      $('.data_profile li').on('click', function () {
        $(this).addClass('active').siblings('li').removeClass('active')
        _this.page = 1
        _this.valuePicker()
      })

      $('#search_button').on('click', function () {
        _this.word = $('input[name="search"]').val()
        _this.page = 1
        _this.valuePicker()
      })

      $('#search_form input').bind('keyup', function(event) {
        if (event.keyCode == '13') {
          // 回车执行查询
          $('#search_button').click();
        }
      })

      $(document).on('click', '.channel-th th[data-field]', function (e) {
        if (e.target.className === 'common-tip') {
          return false
        }
        _this.page = 1
        var dom = $(this).find('>span')
        if (dom.hasClass('sort-none')) {
          dom.removeClass('sort-none').addClass('sort-desc')
          $(this).siblings('th[data-field]').find('>span').removeClass('sort-asc sort-desc').addClass('sort-none')
        } else if (dom.hasClass('sort-desc')) {
          dom.removeClass('sort-desc').addClass('sort-asc')
        } else if (dom.hasClass('sort-asc')) {
          dom.removeClass('sort-asc').addClass('sort-desc')
        }
        _this.valuePicker()

      })
    },

    // handlebar辅助
    handlebarHelp: function () {
      Handlebars.registerHelper('pager', function (e, a) {
        var data = e.data.root
        var r = "<ul class='pagination'>";
        data.pagePre > 0 ? r += '<li><a href="javascript:;" class="page-change-start">上一页</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>上一页</a></li>"
        data.pageNext ? r += '<li><a class="page-change-end" href="javascript:;">下一页</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>下一页</a></li>"
        r += '</ul>'
        return r
      });

      Handlebars.registerHelper('more', function (page) {
        // console.log(!!(page.next > page.max))
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