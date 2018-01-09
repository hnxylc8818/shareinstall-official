/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global Typed */
var DfttModule = (function (dm) {
    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this;
            _this.addApp()
            _this.closeApp()
            _this.addEdit()
            _this.detailed()
        },
        addApp: function () {
            $("#J_add").on("click", function () {
                $("#J_my-addApp").show()
            })
        },
        closeApp: function () {
            $(".close").on("click", function () {
                $("#J_my-addApp").hide()
            })
            $(".preservation").on("click", function () {
                $("#J_my-addApp").hide()
            })
            $(".cancel").on("click", function () {
                $("#J_my-addApp").hide()
            })
        },
        addEdit:function(){
            $(".edit").on("click",function () {
                window.location.href = './editingApplication.html'
            })
        },
        detailed:function(){
            $(".detailed").on("click",function () {
                window.location.href = './overview.html'
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
                obj.init()
            } else {
                console.error(obj.init + ' is not a Function!')
            }
        } else {
            console.error(obj + ' is not a PlainObject!')
        }
    })
})
