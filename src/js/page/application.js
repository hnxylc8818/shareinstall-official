/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global layer */
var DfttModule = (function(dm) {
  var Index = {
    name: 'Index',
    typed: null,
    init: function() {
      var _this = this;

      _this.url = 'http://api.shareinstall.com/'
      _this.addApp()
      _this.closeApp()
      _this.addEdit()
      _this.detailed()
      _this.getList()
      _this.addAppOk()
    },

    /**
     * 创建应用
     */
    addApp: function() {
      $("#J_add").on("click", function() {
        $("#J_my-addApp").show()
      })
    },

    /**
     * 确认创建
     */
    addAppOk: function() {
      var _this = this;
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      $(".preservation").on("click", function() {
        var name = $("#addApp").val()
        if (name == '') {
          layer.tips('应用名不能为空', $('#addApp'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          // return
        } else if (regEn.test(name) || regCn.test(name)) {
          layer.tips('应用名不能包含特殊符号', $('#addApp'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
        } else {
          var url = _this.url + 'appliance/create'
          $.ajax({
            url: url,
            type: 'post',
            data: {
              username: $.cookie("userName"),
              token: $.cookie("_token"),
              app_name: name
            },
            success: function(data) {
              console.log(data)
              if (data.code == 0) {
                var data = data.data
                $("#addApp").val("")
                $("#J_my-addApp").hide()
                _this.getList()
              } else {
                layer.msg(data.message)
              }
            }
          })
        }
      })
    },
    closeApp: function() {
      $(".close").on("click", function() {
        $("#J_my-addApp").hide()
      })
      $(".cancel").on("click", function() {
        $("#J_my-addApp").hide()
      })
    },
    addEdit: function() {
      $("body").on("click", ".edit", function() {
        var key = $(this).attr("data-key")
        var url = $(this).parent().siblings(".item-icon").children("img").attr("src")
        var name = $(this).parent().siblings(".item-name").html()
        $.cookie('oldImg', url, {
          expires: 7
        });
        $.cookie('oldName', name, {
          expires: 7
        });
        window.location.href = './editingApplication.html?key=' + key
      })
    },
    detailed: function() {
      $('body').on('click', '.detailed', function () {
        var key = $(this).attr('data-key')
        var img = $(this).attr('data-img')
        var name = $(this).attr('data-name')
        var scheme = $(this).attr('data-scheme')
        $.cookie('appkey', key, {
          expires: 7
        });
        $.cookie('img', img, {
          expires: 7
        });
        $.cookie('appName', name, {
          expires: 7
        });
        $.cookie('scheme', scheme, {
          expires: 7
        });
        window.location.href = './overview.html'
      })
    },
    /***
     * 获取应用管理列表
     */
    getList: function() {
      var _this = this
      var url = _this.url + 'appliance/getlist'
      $.ajax({
        url: url,
        type: "post",
        data: {
          username: $.cookie("userName"),
          token: $.cookie("_token"),
          page: 1,
          size: 10000
        },
        success: function(data) {
          console.log(data)
          if (data.code == 0) {
            var data = data.data
            var list = data.list;
            $(".list-ul").html("")
            _this.renderingList(list)
          } else {
            layer.msg('登录已过期，请重新登录');
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          }
        }
      })
    },
    /***
     * 渲染应用列表
     */
    renderingList: function(list) {
      var _this = this
      if (list.length == 0) { //没有数据
        var htmlStr = '<li class="item">' +
          '<div class="nomore">暂无数据</div>' +
          '</li>'
        $(".list-ul").append(htmlStr)
      } else {
        var htmlStr = ''
        for (var i = 0; i < list.length; i++) {
          var item = list[i]
          if (item.name.indexOf('script') > 0) {
            item.name = 'name'
          }
          htmlStr += ' <li class="item">' +
            '<span class="item-appkey">' + item.app_key + '</span>' +
            '<span class="item-name">' + item.name + '</span>' +
            '<span class="item-icon icon">' +
            '<img src="' + item.icon + '" alt="">' +
            '</span>' +
            '<span class="item-pingtai">暂无</span>' +
            '<span class="item-operation">' +
            '<button class="edit" data-key="' + item.app_key + '" data-img="' + item.icon + '">编辑</button>' +
            '<button class="detailed" data-name="' + item.name + '" data-key="' + item.app_key + '" data-img="' + item.icon + '" data-scheme="' + item.scheme + '">详细</button>' +
            '</span>' +
            '</li>'
        }
        $(".list-ul").append(htmlStr)
      }
    }
  };
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line

$(function() {
  // 调用初始化方法
  $.each(DfttModule, function(i, obj) {
    if ($.isPlainObject(obj)) {
      if ($.isFunction(obj.init)) {
        // obj.init()
        // console.log(obj.init)
      } else {
        console.error(obj.init + ' is not a Function!')
      }
    } else {
      console.error(obj + ' is not a PlainObject!')
    }
  })
})
