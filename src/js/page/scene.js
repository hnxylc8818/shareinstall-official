/* global $ */
/* global Typed */
var DfttModule = (function (dm) {


    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.backTop()
            _this.console()
        },
        /***
         * 返回顶部
         */
        backTop:function () {
            $("#J_barBack").on('click',function(){
                $('body,html').animate({scrollTop:0},500);
            })
        },
        /*
         *点击控制台判断
         */
        console: function() {
          var _this = this
          $("#J_console").on("click", function() {
            var _token = $.cookie("_token")
            if(_token == "null" || _token == undefined){
                window.location.href = './login.html'
            }else{
                window.location.href = './application.html'
            }
          })
        }
    }
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
