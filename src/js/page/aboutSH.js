// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function (dm) {

    var News = {
        name: 'News',
        typed: null,
        _tempData: null,
        init: function () {
            this.backTop()
        },
        /***
         * 返回顶部
         */
        backTop: function () {
            $("#J_barBack").on('click', function () {
                $('body,html').animate({scrollTop: 0}, 500);
            })
        }

    }
    // 给模块单独定义一个命名空间
    dm[News.name] = News
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

