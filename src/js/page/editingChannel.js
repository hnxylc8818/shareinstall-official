/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global layer */
var DfttModule = (function (dm) {
  var Channel = {
    name: 'Channel',
    typed: null,
    pageType: 1,
    init: function () {
      var _this = this
      _this.writeAppkey()
      _this.drawAppicon()
      _this.judgeIsNew()
      _this.changeRadio()
      _this.saveChannel()
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

    // 获取url中的参数
    getQueryString: function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); // 匹配目标参数
      var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
      if (result != null) {
        return decodeURIComponent(result[2]);
      } else {
        return null;
      }
    },

    // url格式判断
    normalizeUrl: function (t, e) {
      if (!t || !(t = $.trim(t))) {
        return null;
      }
      var n = e === !0 ? /^([0-9a-zA-Z_\-]+):\/\/[^\/]+(\/.*)?/i : /^(http|https):\/\/[^\/]+(\/.*)?/i,
        a = n.exec(t);
      return a ? (a[2] || (t += '/'), t) : null
    },

    // 判断是新增还是修改
    judgeIsNew: function () {
      var channelId = this.getQueryString('channelId')
      if (channelId) {
        $('#_title').text('渠道管理-修改渠道')
        this.getChannelInfo(channelId)
        return true
      }
      return false
    },

    // 获取渠道初始信息
    getChannelInfo: function (id) {
      var _this = this
      $.ajax({
        url: 'http://api.shareinstall.com/channel/getone',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          channel_id: id
        },
        success: function (data) {
          if (data.code === '0') {
            $('#link_code').val(data.data.channel_code).prop('disabled', true)
            $('#link_name').val(data.data.channel_name)
            $('input[name="customURL"]').val(data.data.page)
            _this.pageType = data.data.page_type
            $('input[name="defaultLanding"]').each(function (index, item) {
              $(item).prop('checked', false)
              if (index === data.data.page_type - 1) {
                $(item).prop('checked', true)
              }
            })

            _this.showPageUrl()
          }
        }
      })
    },

    // 渠道信息保存
    saveChannel: function () {
      var _this = this
      $('#submit_btn').on('click', function () {
        var channelCode = $('#link_code').val(),
          channelName = $('#link_name').val(),
          channelUrl = $('input[name="customURL"]').val(),
          tag = true,
          url = 'http://api.shareinstall.com/channel/create',
          dataObj = {
            username: $.cookie('userName'),
            token: $.cookie('_token'),
            app_key: $.cookie('appkey'),
            channel_code: channelCode,
            channel_name: channelName,
            page_type: _this.pageType,
            page: channelUrl
          }

        if (!channelCode) {
          layer.tips('必填', $('input[name="channelCode"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          tag = false
        }

        if (!channelName) {
          layer.tips('必填', $('input[name="channelName"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          tag = false
        }

        if (!_this.normalizeUrl(channelUrl) && _this.pageType === 2) {
          layer.tips('请填写合法的url，如：http://www.opeinstall.io/', $('input[name="customURL"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          tag = false
        }

        if (_this.pageType === 1) {
          channelUrl = ''
        }

        if (_this.getQueryString('channelId')) {
          url = 'http://api.shareinstall.com/channel/update'
          dataObj.channel_id = _this.getQueryString('channelId')
        }

        if (!tag) return

        $.ajax({
          url: url,
          type: 'POST',
          data: dataObj,
          success: function (data) {
            if (data.code === '0' || data.code === 0) {
              window.location.href = './management.html'
            } else {
              layer.msg('保存失败')
            }
          },
          error: function () {
            layer.msg('保存失败')
          }
        })
      })
    },

    // 渠道落地页选项
    changeRadio: function () {
      var _this = this
      $('input:radio[name="defaultLanding"]').on('click', function () {
        if ($(this).val() === 'false') {
          $('#zi_url').show()
          _this.pageType = 2
        } else {
          $('#zi_url').hide()
          _this.pageType = 1
        }
      })
    },

    // 渠道落地页url显示
    showPageUrl: function () {
      if (this.pageType === 2) {
        $('#zi_url').show()
      } else {
        $('#zi_url').hide()
      }
    }
  };
  // 给模块单独定义一个命名空间
  dm[Channel.name] = Channel
  return dm
})(DfttModule || {}) // eslint-disable-line