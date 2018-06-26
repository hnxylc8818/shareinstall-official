/* global Tool */
var Tool = (function() {
  return {
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

    // url标准格式判断
    normalizeUrl: function (t, e) {
      if (!t || !(t = $.trim(t))) {
        return null;
      }
      var n = e === !0 ? /^([0-9a-zA-Z_\-]+):\/\/[^\/]+(\/.*)?/i : /^(http|https):\/\/[^\/]+(\/.*)?/i,
        a = n.exec(t);
      return a ? (a[2] || (t += '/'), t) : null
    },

    // 获取字符长度
    getLength: function(str) {
      return str.replace(/[\u0391-\uFFE5]/g, 'aa').length; // 先把中文替换成两个字节的英文，在计算长度
    },

    // 时间戳转换
    timetrans: function(date) {
      date = new Date(date * 1000);// 如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    },

    // 地址切换
    serverIP: function() {
      this.flag = true;
      this.productDomain = 'http://api.shareinstall.com/';
      this.testDomain = 'http://test-api.shareinstall.com/';
      return this.flag ? this.productDomain : this.testDomain
    }

  }
})()

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement('script');
  hm.src = 'https://hm.baidu.com/hm.js?7ef8f0ecb40eedaac3ff9cf803cf6ce6';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(hm, s);
})();