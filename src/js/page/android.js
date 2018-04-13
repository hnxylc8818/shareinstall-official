/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global layer */
/* global Handlebars */
/* global QRCode */
var DfttModule = (function (dm) {
  var Index = {
    name: 'Index',
    hasBag: false,
    typed: null,
    init: function () {
      var _this = this;
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
      _this.writeScheme()
      _this.getAppInfo()
      _this.tabsFun()
      _this.uploadPackage()
      _this.gotoLink()
      _this.getPackageInfo()
      _this.configApp()
      _this.nextFun()
      _this.prevFun()
      _this.onlineTest()
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

    // 渲染页面appkey
    writeAppkey: function () {
      var appKey = $.cookie('appkey')
      if (appKey) {
        $('#app_key').text(appKey)
        $('#configAppKey').text(appKey)
        $('.doc-appkey').text(appKey)
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

    // 渲染文档scheme
    writeScheme: function () {
      var scheme = $.cookie('scheme')
      if (scheme) {
        $('.doc-scheme').text(scheme)
        $('#configScheme').text(scheme)
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

    // 获取字符数
    getLength: function(str) {
      return str.replace(/[\u0391-\uFFE5]/g, 'aa').length; // 先把中文替换成两个字节的英文，在计算长度
    },

    // 输入限制
    inputLimit: function () {
      var _this = this
      var wordsLen = 0
      $('input[name="key"], input[name="value"]').on('input propertychange', function () {
        var value = $(this).val()
        if (_this.getLength(value) <= 20) {
          wordsLen = value.length
        }
        if (_this.getLength(value) > 20) {
          $(this).val($(this).val().substr(0, wordsLen))
          return false
        }
      })
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

    // 在线测试链接
    onlineTest: function () {
      this.inputLimit()
      $(document).on('click', '.depoly-line-test', function () {
        var testWrap = $('#_win_web_test')
        testWrap.find('.qr_img').empty()
        testWrap.find('.qr_text').text('')
        layer.open({
          title: '  ',
          type: 1,
          area: '800',
          content: testWrap
        })
      })

      $(document).on('click', '.depoly-button', function () {
        var key = $('input[name="key"]').val()
        var value = $('input[name="value"]').val()
        var url = window.location.href.replace('android.html', '') + 'js-test.html?appkey=' + $.cookie('appkey') + '&' + key + '=' + value
        var tag = true
        if (/[\u4e00-\u9fa5]+/.test(key)) {
          tag = false
          layer.tips('输入不能包含中文', $('input[name="key"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
        }
        if (/[\u4e00-\u9fa5]+/.test(value)) {
          tag = false
          layer.tips('输入不能包含中文', $('input[name="value"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
        }
        if (tag) {
          var curCode = new QRCode($('.qr_img').empty()[0], {
            text: url,
            width: 180,
            height: 180,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
        }
        console.log(url)
      })
    },

    // 左侧链接跳转
    gotoLink: function () {
      // var appKey = this.getQueryString('key')
      // var appIcon = this.getQueryString('icon')
      // $('#my-overview').on('click', function () {
      //   window.location.href = './overview.html?key=' + appKey + '&icon=' + appIcon
      // })
    },
    /**
     * 点击导航切换
     */
    tabsFun: function () {
      var _this = this
      $(".tab-form li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active")
        var index = $(this).index()
        $("#tab-panel .my-app").eq(index).show().siblings().hide()
        $(document).scrollTop(0)
      })
    },
    /**
     * 点击上一步
     */
    prevFun: function () {
      var _this = this
      $(".step_prev").on("click", function () {
        var index = parseInt($(this).attr("data-tab-index"))
        $("#tabs li").eq(index).addClass("active").siblings().removeClass("active")
        $(".my-app").eq(index).show().siblings().hide()
        $(document).scrollTop(0)
      })
    },
    /***
     * 点击下一步
     */
    nextFun: function () {
      var _this = this
      $(".step_next").on("click", function () {
        var index = parseInt($(this).attr("data-tab-index"))
        $("#tabs li").eq(index).addClass("active").siblings().removeClass("active")
        $(".my-app").eq(index).show().siblings().hide()
        $(document).scrollTop(0)
      })
    },

    /***
     * 点击上传
     */

    uploadPackage: function () {
      var _this = this
      $('.btn-to-upload').on('click', function () {
        // $(this).parents('.tab-op').hide();
        $('.deposite_upload').show();
        $('.btn-to-upload').hide()
        $('.pkgInfoContainer').hide()
      });

      $('.btn-upload-back').on('click', function () {
        // $('.tab-op').show();
        $('.deposite_upload').hide();
        $('.btn-to-upload').show()
        $('.pkgInfoContainer').show()
      });

      $('.upload-filebtn').on('change', function () {
        var name = $('.upload-filebtn')[0].files[0].name
        if (/.apk$/.test(name)) {
          pending = 0
          $('#upimg').show()
          $('.up_progress').show()
          $('.up_container').hide()
          $('.up_progress .filename').text(name)
          upfile();
        } else {
          layer.msg('请上传.apk文件')
        }
      })

      $('.stop_upload').off('click').on('click', function () {
        xhr.abort()
        pending = 1
        clearTimeout(timer)
        $('.up_progress').hide()
        $('.up_container').show()
      })

      var xhr = new XMLHttpRequest();
      var fd;
      var des = document.getElementById('load');
      var desProcess = document.getElementById('loadProcess');
      var num = document.getElementById('upimg');
      var file;
      const LENGTH = 5 * 1024 * 1024;
      var start;
      var end;
      var blob;
      var pecent;
      var filename;
      var appKey = $.cookie('appkey');
      var timer = null
      var pending = 0;
      // var clock;
      function upfile() {
        start = 0;
        end = LENGTH + start;
        blob_num = 1;
        //pending=false;

        file = document.getElementsByName('mof')[0].files[0];
        //filename = file.name;
        if (!file) {
          // alert('请选择文件');
          return;
        }
        //clock=setInterval('up()',1000);
        up();

      }

      function up() {
        if (pending) {
          return
        }
        var total_blob_num = Math.ceil(file.size / LENGTH);
        if (start < file.size) {
          xhr.open('POST', 'http://api.shareinstall.com/passage/upload', true);

          // xhr.setRequestHeader('Content-Type','multipart/form-data');

          xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
              // console.log(this);
              // console.log(this.status);
              if (this.status >= 200 && this.status < 300) {
                // console.log(this.responseText);
                // console.log(this.responseText['code']);
                tmp = this.responseText;
                resp = eval('(' + tmp + ')');
                console.log(typeof resp);
                console.log(resp['code']);
                if (resp['code'] < 0) {
                  //alert(this.responseText);
                  layer.msg('文件发送失败，请重新发送')
                  des.style.width = '0%';
                  //num.innerHTML='';
                  //clearInterval(clock);
                } else {
                  //alert(this.responseText)
                  // pending=false;
                  start = end;
                  end = start + LENGTH;
                  if (blob_num == total_blob_num) {
                    timer = setTimeout(function () {
                      $.ajax({
                        async: false,
                        'type': 'POST',
                        url: "http://api.shareinstall.com/passage/check",
                        data: {
                          app_key: appKey
                        },
                        success: function (res) {
                          if (res.code === '0') {
                            $('.upload-filebtn').val('')
                            _this.hasBag = true
                            var date = new Date(res.data.createTime * 1000)
                            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
                            var tpl = $('.pkgInfoTmp').html();
                            var template = Handlebars.compile(tpl);
                            var html = template(res.data);
                            $('.pkgInfoContainer').html(html);
                            $('#configAppId').html(res.data.application_id)
                            $('#configScheme').html(res.data.scheme)
                            $('input[name="yybEnabled"]').prop('checked', false)
                            $('input[name="yybUrl"]').prop('disabled', true).val('')
                            $('#load').css('width', '0%').text('0%')
                            $('#upimg').css('display', 'none')
                            $('.upload-filebtn').val('')
                            $('.btn-upload-back').click()
                            $('.depoly-line-test').show()
                            $('.up_progress').hide()
                            $('.up_container').show()
                            $('.depoly-top').hide()
                            layer.msg('包上传成功')
                          } else if (res.code === '88') {
                            layer.msg('登录失效，请重新登录')
                            setTimeout(function () {
                              window.location.href = './login.html'
                            }, 3000)
                          } else {
                            $('.upload-filebtn').val('')
                            layer.msg(res.message || '文件解析失败')
                            $('.up_progress').hide()
                            $('.up_container').show()
                          }
                        }
                      });
                    }, 2000);

                  }

                  blob_num += 1;
                  setTimeout(function () {
                    up();
                  }, 1000);
                }
              } else {
                $('.upload-filebtn').val('')
                layer.msg('已取消文件上传');
                des.style.width = '0%';
              }
            }
          }
          xhr.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
              pecent = 100 * (ev.loaded + start) / file.size;
              if (pecent > 100) {
                pecent = 100;
              }
              //num.innerHTML=parseInt(pecent)+'%';
              des.style.width = pecent + '%';
              // des.innerHTML = parseInt(pecent) + '%'
              desProcess.innerHTML = parseInt(pecent) + '%'
              $('.up_progress .prog_uploaded').text(((ev.loaded + start) / 1024 / 1024).toFixed(2) + 'MB')
            }
          }

          //分割文件核心部分slice
          blob = file.slice(start, end);
          fd = new FormData();
          fd.append('mof', blob);
          fd.append('filename', file.name);
          fd.append('blob_num', blob_num);
          fd.append('total_blob_num', total_blob_num);
          fd.append('app_key', appKey);
          //fd.append('app_key','BEBKBK66R7H72H');
          //console.log(fd);
          //pending=true;
          xhr.send(fd);
        } else {
          //clearInterval(clock);
        }
      }

      function change() {
        des.style.width = '0%';
      }
    },

    // 初始化页面获取应用信息
    getPackageInfo: function () {
      var _this = this
      var appKey = $.cookie('appkey')
      $.ajax({
        url: 'http://api.shareinstall.com/passage/info',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: appKey,
          plantform: 'android'
        },
        success: function (res) {
          if (res.code === '0') {
            _this.hasBag = true
            var date = new Date(res.data.createTime * 1000)
            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + ' ' + (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
            var tpl = $('.pkgInfoTmp').html();
            var template = Handlebars.compile(tpl);
            var html = template(res.data);
            $('.pkgInfoContainer').html(html);
            $('#configAppId').html(res.data.application_id)
            $('#configScheme').html(res.data.scheme)
            $('input[name="appstoreUrl"]').val(res.data.app_store)
            $('input[name="yybEnabled"]').prop('checked', !!res.data.is_applied)
            $('input[name="yybUrl"]').prop('disabled', !res.data.is_applied).val(res.data.applied_path)
            $('.depoly-line-test').show()
            $('.depoly-top').hide()
            // $('.file_info').show();
          } else if (res.code === '88') {
            layer.msg('登录失效，请重新登录')
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          } else {
            // layer.msg(res.message)
          }
        }
      })
    },

    // 填充包信息
    setAndroidInfo: function (allow, yybUrl) {
      var param = {}
      param.is_applied = allow
      param.applied_path = yybUrl || ''
      $.ajax({
        url: 'http://api.shareinstall.com/passage/setinfo',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          plantform: 'android',
          para: param
        },
        success: function (res) {
          if (res.code === '0') {
            layer.msg('信息保存成功')
          } else if (res.code === '88') {
            layer.msg('登录失效，请重新登录')
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          } else {
            layer.msg(res.message)
          }
        }
      })
    },

    // 应用配置
    configApp: function () {
      var _this = this
      $('input[name="yybEnabled"]').on('change', function () {
        if ($(this).prop('checked')) {
          $('input[name="yybUrl"]').prop('disabled', false)
        } else {
          $('input[name="yybUrl"]').prop('disabled', true)
        }
      })

      $('#saveForm').on('click', function () {
        var is_applied = $('input[name="yybEnabled"]').prop('checked') ? 1 : 0
        var applied_path = $('input[name="yybUrl"]').val()

        if (!_this.hasBag) {
          layer.msg('请先上传包')
          return
        }

        if (is_applied && !_this.normalizeUrl(applied_path)) {
          layer.tips('请正确填写应用宝地址', $('input[name="yybUrl"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })

          return
        }

        _this.setAndroidInfo(is_applied, applied_path)
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