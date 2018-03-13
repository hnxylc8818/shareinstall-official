/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global layer */
/* global Handlebars */
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
      _this.tabsFun()
      _this.uploadPackage()
      _this.gotoLink()
      _this.getPackageInfo()
      _this.configApp()
      _this.nextFun()
      _this.prevFun()
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
        $('#upimg').show()
        upfile();
      })

      var xhr = new XMLHttpRequest();
      var fd;
      var des = document.getElementById('load');
      var num = document.getElementById('upimg');
      var file;
      const LENGTH = 5 * 1024 * 1024;
      var start;
      var end;
      var blob;
      var pecent;
      var filename;
      var appKey = $.cookie('appkey');
      // var pending;
      // var clock;
      function upfile() {
        start = 0;
        end = LENGTH + start;
        blob_num = 1;
        //pending=false;

        file = document.getElementsByName('mof')[0].files[0];
        //filename = file.name;
        if (!file) {
          alert('请选择文件');
          return;
        }
        //clock=setInterval('up()',1000);
        up();

      }

      function up() {
        /*
        if(pending){
         return;
        }
        */
        var total_blob_num = Math.ceil(file.size / LENGTH);
        if (start < file.size) {
          xhr.open('POST', 'http://api.shareinstall.com/passage/upload', true);

          // xhr.setRequestHeader('Content-Type','multipart/form-data');

          xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
              console.log(this);
              console.log(this.status);
              if (this.status >= 200 && this.status < 300) {
                console.log(this.responseText);
                console.log(this.responseText['code']);
                tmp = this.responseText;
                resp = eval('(' + tmp + ')');
                console.log(typeof resp);
                console.log(resp['code']);
                if (resp['code'] < 0) {
                  //alert(this.responseText);
                  alert('文件发送失败，请重新发送');
                  des.style.width = '0%';
                  //num.innerHTML='';
                  //clearInterval(clock);
                } else {
                  //alert(this.responseText)
                  // pending=false;
                  start = end;
                  end = start + LENGTH;
                  if (blob_num == total_blob_num) {
                    setTimeout(function () {
                      $.ajax({
                        async: false,
                        'type': 'POST',
                        url: "http://api.shareinstall.com/passage/check",
                        data: {
                          app_key: appKey
                        },
                        success: function (res) {
                          if (res.code === '0') {
                            _this.hasBag = true
                            var date = new Date(res.data.createTime * 1000)
                            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
                            var tpl = $('.pkgInfoTmp').html();
                            var template = Handlebars.compile(tpl);
                            var html = template(res.data);
                            $('.pkgInfoContainer').html(html);
                            $('#configAppId').html(res.data.application_id)
                            $('#configScheme').html(res.data.scheme)
                            $('.btn-upload-back').click()
                            layer.msg('包上传成功')
                          } else {
                            layer.msg(res.message || '文件解析失败')
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
                alert('文件发送失败，请重新发送');
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
              des.innerHTML = parseInt(pecent) + '%'
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
            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
            var tpl = $('.pkgInfoTmp').html();
            var template = Handlebars.compile(tpl);
            var html = template(res.data);
            $('.pkgInfoContainer').html(html);
            $('#configAppId').html(res.data.application_id)
            $('#configScheme').html(res.data.scheme)
            $('input[name="appstoreUrl"]').val(res.data.app_store)
            $('input[name="yybEnabled"]').prop('checked', !!res.data.is_applied)
            $('input[name="yybUrl"]').prop('disabled', !res.data.is_applied).val(res.data.applied_path)
            // $('.file_info').show();
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
          layer.msg(res.message)
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

      $('.btn_submit').on('click', function () {
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