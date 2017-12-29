/* global $ */
/* global Typed */
var DfttModule = (function (dm) {
  var $box7 = $('.box7').children('.box-title')
  // var $typingWrap = $('#J_typing_wrap')
  // var $typing = $('#J_typing')
  var $navbar = $('#J_navbar')
  var $title = $('#J_title')

  var Index = {
    name: 'Index',
    typed: null,
    init: function () {
      this._bannerAnimate()
      this._newsAnimate()
      this._teamAnimate()
      this._clickBtn()
    },
    /**
     *banner动画
     */
    _bannerAnimate: function () {
      var mySwiper = new Swiper('#J_home_banner', {
        // loop: true,
        // autoplay: 5000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        onInit: function (a) {
          swiperAnimateCache(a)
          swiperAnimate(a)
        },
        onSlideChangeEnd: function (a) {
        },
        onTransitionEnd: function (a) {
          swiperAnimate(a)
        }
      })
    },
    /**
     *新闻资讯切换
     */
    _newsAnimate: function () {
      var scope = this
      var mySwiper = new Swiper('#J_news_banner', {
        loop: true,
        autoplay: 5000,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        onSlideChangeStart: function () { //切换成功的回调
          scope._newsTable()
        }
      })
      $('#J_news_banner').mouseenter(function () {//滑过悬停
        mySwiper.stopAutoplay() //mySwiper 为上面你swiper实例化的名称
      }).mouseleave(function () { //离开开启
        mySwiper.startAutoplay()
      })
    },
    /*
     切换新闻详情
     */
    _newsTable: function () {
      var $JnewsItems = $('#J_news_banner .swiper-slide-active .news-items-txt').children()
      var $Jimg = $('#J_news_banner .swiper-slide-active .news-items-img').children()
      $JnewsItems.on('mouseover', function () {
        var index = $(this).index()
        $(this).addClass('active').siblings().removeClass('active')
        $Jimg.eq(index).show().siblings().hide()
      })
      $JnewsItems.on('click', function () {
        window.location.href = 'newDetails.html'
      })
    },
    /*
     团队管理动画(旋转木马效果)
     */
    _teamAnimate: function () {
      var scope = this
      var callback = function () {
        var index = $('#J_carousel1').find('.roundabout-in-focus').index()
        scope.switchTab(index)
      }
      $('#J_carousel1').roundabout({
        // //duration: 600, // 运动速度
        // //autoplay: true,        // 自动播放
        // //autoplayDuration: 1500,// 自动播放的时间
        // //reflect: true,         // 为true时是从左向右移动，为false从右向左移动
        // //autoplayPauseOnHover: true, // 鼠标移入元素内是否自动播放，为true不播放，false还自动播放
        bearing: 0.0,
        startingChild: 1,      // 默认的显示第几张图片
        btnPrev: '.ban_r_btn', // 右按钮
        btnNext: '.ban_l_btn', // 左按钮
        minScale: -1,
        maxScale: 1,
        margin: 0.9,
        minOpacity: 0,         //最小的透明度
        maxOpacity: 1,         //最大的透明度
        clickToFocusCallback: function () {
          callback()
        }
      })
    },
    /**
     * 切换图片显示人名
     */
    switchTab: function (index) {
      $('.team-txt-items').eq(index).show().siblings().hide()
    },
    /**
     * 点击按钮切换图片显示人名
     */
    _clickBtn: function () {
      var scope = this
      var indexAll = $('#J_carousel1 li').length - 1
      var index = $('#J_carousel1').find('.roundabout-in-focus').index()
      $('#team-go').on('click', function () {
        index++
        if (index > indexAll) {
          index = 0
        }
        scope.switchTab(index)
      })
      $('#team-back').on('click', function () {
        index--
        if (index < 0) {
          index = indexAll
        }
        scope.switchTab(index)
      })
    },
    /**
     * 移动访问处理
     */
    _mobileOpts: function () {
      // if ($(window).width() <= 768) {
      //   $('#J_research_area').removeAttr('data-hover')
      //   $('#J_research_area').removeAttr('data-delay')
      // }
    },
    /**
     * 设置banner高度
     */
    _setBannerHeight: function () {
      // $(window).on('resize', function () {
      //   $('#J_home_banner').height($(window).height())
      // })
    },
    /**
     * 注册box7的鼠标hover事件，实现打字机效果。
     */
    _regEvent: function () {
      var _this = this
      $box7.on('mouseover', function () {
        _this._startTyped()
      }).on('mouseout', function () {
        _this._destroyTyped()
      })
      $(window).on('scroll', function () {
        if ($(window).width() > 768) {
          if ($(document).scrollTop() + 81 >= $title.offset().top) {
            $navbar.addClass('fixed')
          } else {
            $navbar.removeClass('fixed')
          }
        }
      })
      // $(window).on('resize', function () {
      //   if ($(window).width() <= 768) {
      //     $navbar.addClass('fixed')
      //   } else {
      //     $navbar.removeClass('fixed')
      //   }
      // })
    },
    /**
     * 初始化typed
     */
    _startTyped: function () {
      this.typed = new Typed('#J_typing', {
        strings: ['Searching...'],
        typeSpeed: 200,
        backSpeed: 50,
        backDelay: 1000,
        loop: true,
        loopCount: Infinity,
        showCursor: false
      })
    },
    /**
     * 销毁typed
     */
    _destroyTyped: function () {
      this.typed.destroy()
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
