/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global Handlebars */
/* global layer */
var DfttModule = (function (dm) {
  var Index = {
    name: 'Index',
    init: function () {
      var _this = this;
      _this.handlebarsHelp()
      _this.tabsFun()
      _this.writeAppkey()
      _this.drawAppicon()
      _this.writeAppName()
      _this.uploadPackage()
      _this.getPackageInfo()
      _this.configApp()
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

    // url格式判断
    normalizeUrl: function (t, e) {
      if (!t || !(t = $.trim(t))) {
        return null;
      }
      var n = e === !0 ? /^([0-9a-zA-Z_\-]+):\/\/[^\/]+(\/.*)?/i : /^(http|https):\/\/[^\/]+(\/.*)?/i,
        a = n.exec(t);
      return a ? (a[2] || (t += '/'), t) : null
    },

    /**
     * 点击导航切换
     */
    tabsFun: function () {
      var _this = this
      $(".tab-form li").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active")
        var index = $(this).index()
        $(".my-app").eq(index).show().siblings().hide()
      })
    },

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
          xhr.open('POST', 'http://api.shareinstall.com/passage/upload2', true);

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
                        url: "http://api.shareinstall.com/passage/check2",
                        data: {
                          app_key: appKey
                        },
                        success: function (res) {
                          if (res.code === '0') {
                            var date = new Date(res.data.createTime * 1000)
                            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
                            var tpl = $('.pkgInfoTmp').html();
                            var template = Handlebars.compile(tpl);
                            var html = template(res.data);
                            $('.pkgInfoContainer').html(html);
                            $('#configAppBundle').html(res.data.bundle_id)
                            $('#configAppTeam').html(res.data.team_id)
                            $('#configScheme').html(res.data.scheme)

                            $('.btn-upload-back').click()

                            layer.confirm('上传成功,请至“ios应用配置"选项卡填写应用appstore地址”', {
                              btn: ['确定']
                            }, function (index) {
                              layer.close(index)
                              $('.tab-form li').eq(2).click()
                              $('input[name="appstoreUrl"]').focus()
                            })
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

    // 填充包信息
    setIosInfo: function (url) {
      var param = {}
      param.app_store = url || ''
      $.ajax({
        url: 'http://api.shareinstall.com/passage/setinfo',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: $.cookie('appkey'),
          plantform: 'ios',
          para: param
        },
        success: function (res) {
          layer.msg('信息保存成功')
        }
      })
    },

    // 初始化页面获取应用信息
    getPackageInfo: function () {
      var appKey = $.cookie('appkey')
      $.ajax({
        url: 'http://api.shareinstall.com/passage/info',
        type: 'POST',
        data: {
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          app_key: appKey,
          plantform: 'ios'
        },
        success: function (res) {
          if (res.code === '0') {
            var date = new Date(res.data.createTime * 1000)
            res.data.createTime = date.getFullYear() + '/' + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/' + (date.getDate() > 9 ? date.getDate() : '0' + date.getDate())
            var tpl = $('.pkgInfoTmp').html();
            var template = Handlebars.compile(tpl);
            var html = template(res.data);
            $('.pkgInfoContainer').html(html);
            $('#configAppBundle').html(res.data.bundle_id)
            $('#configAppTeam').html(res.data.team_id)
            $('#configScheme').html(res.data.scheme)
            // $('.file_info').show();
          }
        }
      })
    },

    handlebarsHelp: function () {
      function _evalWithContext(context, __eval) {
        return eval('with(context){' + __eval + '}')
      }
      Handlebars.registerHelper('eval', function (t, e) {
        var n = t.fn(e);
        return _evalWithContext(t.data.root, n)
      })

      Handlebars.registerHelper('if_even', function (t, e) {
        return t % 2 == 0 ? e.fn(this) : e.inverse(this)
      })
      Handlebars.registerHelper('loop', function (t, e) {
        var n, a = e.hash.max;
        e.data && (n = Handlebars.createFrame(e.data));
        for (var r = [], o = 0; o < a; o++)
          n.index = o + 1,
          r.push(e.fn(t[o], {
            data: n
          }));
        return r.join('')
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
        var appUrl = $('input[name="appstoreUrl"]').val()
        if (!_this.normalizeUrl(appUrl)) {
          $('input[name="appstoreUrl"]').focus()
          layer.tips('请正确填写appstore地址', $('input[name="appstoreUrl"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })

          return
        }

        _this.setIosInfo(appUrl)
      })
    }
  };
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line