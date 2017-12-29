// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function (dm) {
    $JcontactTab = $("#J_contactTab li");
    $JcontactItem = $("#J_contactItem ul")
    $Jswitch = $(".switch")
    var News = {
        name: 'Contacts',
        typed: null,
        _tempData: null,
        init: function () {
            this.clickTab();
            this.clickBtn();
        },
        /*
         点击切换招聘分类
         */
        clickTab: function () {
            $JcontactTab.on("click", function () {
                var index = $(this).index()
                $(this).addClass("active").siblings().removeClass("active");
                $JcontactItem.eq(index).show().siblings().hide()
            })
        },
        /*
         点击按钮展开全文
         */
        clickBtn: function () {
            $Jswitch.on("click", function () {
                if ($(this).attr("data-log") == 0) { //隐藏状态
                    $(this).removeClass("iocnOpen").addClass("iocnClose")
                    $(this).parents('.top').siblings('.bottom').show(500)
                    $(this).parents('.top').siblings('.delivery').show(500)
                    $(this).attr("data-log", "1")
                } else { //显示状态
                    $(this).removeClass("iocnClose").addClass("iocnOpen")
                    $(this).parents('.top').siblings('.bottom').hide(500)
                    $(this).parents('.top').siblings('.delivery').hide(500)
                    $(this).attr("data-log", "0")
                }
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

