ShareInstall = function (win, doc, xhr) {
  // 全局变量
  var VERSION = '1.0.2'

  /**
   * 对象ReadyObj拥有一个属性（数组）和三个方法：
   * arr,run(),isReady(),ready()
   */
  function ReadyObj() {
    this.arr = [] // 一个存储回调函数的队列
    this.run = function (cb1) {
      this.arr ? this.arr[this.arr.length] = cb1 : cb1()
    }
    this.isReady = function () {
      return null == this.arr
    }
    this.ready = function () {
      if (null != this.arr) {
        for (var i = 0; i < this.arr.length; i++) {
          this.arr[i]()
        }
      }
      this.arr = null
    }
  }

  function parseObj(obj) {
    var tempArr = []
    for (var key in obj) {
      var val = obj[key]
      if ('[object Array]' == Object.prototype.toString.call(val)) {
        for (var i = 0; i < val.length; i++) {
          if (null != val[i] && 'undefined' != typeof val[i]) {
            tempArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val[i]))
          }
        }
      } else if (null != val && 'undefined' != typeof val) {
        tempArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(val))
      }
    }
    return tempArr.join('&')
  }

  function myAjax(opt) {
    var xmlhttp = new xhr() // xhr === XMLHttpRequest
    var data = opt.data
    var url = opt.url
    var method = opt.method
    // url = url.indexOf('?') > -1 ? url + '&v=' + VERSION : url + '?v=' + VERSION
    // data && "string" != typeof data && (data = MyJSON.stringify(data))
    if (data && 'string' != typeof data) {
      data = MyJSON.stringify(data)
    }
    // if (data == '{}') {
    //   data = ''
    // }
    // "POST" != method && data && (url = url + (url.indexOf("?") > -1 ? "&" : "?") + data, data = null)
    if ('POST' != method && data) {
      url = url + (url.indexOf('?') > -1 ? '&' : '?') + data
      data = null
    }
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == ('number' == typeof xhr.DONE ? xhr.DONE : 4)) {
        if (200 == xmlhttp.status) {
          var res = xmlhttp.response || xmlhttp.responseText || {}
          opt.success && opt.success('string' == typeof res ? MyJSON.parse(res) : res)
        } else {
          opt.error && opt.error(xmlhttp, xmlhttp.statusText)
        }
        opt.complete && opt.complete(xmlhttp)
      }
    }
    xmlhttp.open(method, url, true)
    xmlhttp.ontimeout = function () {
      opt.error && opt.error(xmlhttp, xmlhttp.statusText)
    }
    xmlhttp.timeout = opt.timeout || 0
    if (xmlhttp.setRequestHeader) {
      xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    }
    xmlhttp.withCredentials = (opt.xhrFields || {}).withCredentials
    xmlhttp.send(data)
  }

  /**
   * 获取WebGLRenderingContext的一些参数
   * return
   * {
    context: "webgl"
    max_texture_size: 16384
    renderer: "Intel Iris OpenGL Engine"
    sl_version: "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
    vendor: "Intel Inc."
    version: "WebGL 1.0 (OpenGL ES 2.0 Chromium)"
  }
   */
  function getContext() {
    var cvs = doc.createElement('canvas')
    if (cvs && 'function' == typeof cvs.getContext) {
      var strArr = ['webgl', 'webgl2', 'experimental-webgl2', 'experimental-webgl']
      for (var ii = 0; ii < strArr.length; ii++) {
        var str = strArr[ii]
        var ctx = cvs.getContext(str)
        if (ctx) {
          var obj = {}
          obj.context = str
          obj.version = ctx.getParameter(ctx.VERSION)
          obj.vendor = ctx.getParameter(ctx.VENDOR)
          obj.sl_version = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION)
          obj.max_texture_size = ctx.getParameter(ctx.MAX_TEXTURE_SIZE)
          var ext = ctx.getExtension('WEBGL_debug_renderer_info')
          if (ext) {
            obj.vendor = ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL)
            obj.renderer = ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL)
          }
          return obj
        }
      }
    }

    return {}
  }

  function MyShareInstall(opt, customOrUrlParams) {
    function delay(callback, time) {
      var hidden
      var visibilityChange
      // var isAndroidQq = 'android' == ResObj.platform && 'qq' == ResObj.brower // 安卓平台qq浏览器
      // isAndroidQq = false
      // if (isAndroidQq) {
      //   hidden = 'hidden'
      //   visibilityChange = 'qbrowserVisibilityChange'
      // } else {
      //   if ('undefined' != typeof doc.hidden) {
      //     hidden = 'hidden'
      //     visibilityChange = 'visibilitychange'
      //   } else if ('undefined' != typeof doc.msHidden) {
      //     hidden = 'msHidden'
      //     visibilityChange = 'msvisibilitychange'
      //   } else if ('undefined' != typeof doc.webkitHidden) {
      //     hidden = 'webkitHidden'
      //     visibilityChange = 'webkitvisibilitychange'
      //   }
      // }
      if ('undefined' != typeof doc.hidden) {
        hidden = 'hidden'
        visibilityChange = 'visibilitychange'
      } else if ('undefined' != typeof doc.msHidden) {
        hidden = 'msHidden'
        visibilityChange = 'msvisibilitychange'
      } else if ('undefined' != typeof doc.webkitHidden) {
        hidden = 'webkitHidden'
        visibilityChange = 'webkitvisibilitychange'
      }
      var isHidden = function (dc) {
        // if (isAndroidQq && dc && 'undefined' != typeof dc.hidden) {
        //   return dc.hidden
        // } else {
        //   return doc[hidden]
        // }
        return doc[hidden]
      }
      var sto = setTimeout(function () {
        if (null != sto && !isHidden()) {
          callback()
          sto = null
        }
      }, time)
      if (visibilityChange) {
        doc.addEventListener(visibilityChange, function (dc) {
          if (null != sto && isHidden(dc)) {
            clearTimeout(sto)
            sto = null
          }
        }, false)
      }
    }

    function y(method, url, downApk, time) {
      if ('function' == typeof downApk) {
        delay(downApk, time)
      }
      domFuncUtil[method](url)
    }

    function getDiv(htmlStr) {
      var div = doc.createElement('div')
      div.innerHTML = htmlStr
      div = div.children[0]
      div.onclick = function () {
        doc.body.removeChild(div)
      }
      return div
    }

    /**
     <!-- 后台返回的一段与复制有关的内容（一段html字符串）： -->
     qv_78bb_8qu0u_nm8_j_-OXi9_r6u-b0u6OlpqOhpaCiu7S25eT1q7Ty9-L3rP_79_Hzueb48a309-XzoKK6_8DU2cThpt3R8fnX19fX2MXD_tPD8dfX19fT19fX19TV19vX19fX-e_sxaHX19fX16fU28DTwNv3ztDY7q_xoNfX19fXzsTFwvrb18fZ9M_M8dfX19en3MTT0MPz2PnU1_HSr7nh19fX19_X18Db5PjS19fX19fXxcPA2cTdo9XP39-rtLmo
     <!-- 解密后： -->
     <img id="-openinstall-pb-53057364-" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEVMaXFNx9g6AAAAAXRSTlMAQObYZgAAAA1JREFUeNoBAgD9/wAAAAIAAVMrnDAAAAAASUVORK5CYII="/>
     */
    function execCopy(imgDom, ypp, yps) {
      var EXEC_COMMAND = 'execCommand'
      var COPY = 'copy'
      if ('function' != typeof doc[EXEC_COMMAND]) {
        return false
      }
      var div = doc.createElement('div')
      div.innerHTML = imgDom
      var childArr = []
      for (var ii = 0; ii < div.children.length; ii++) {
        childArr[ii] = div.children[ii]
      }
      var childDom
      var selObj
      var copySuccessFlag = false
      var tempCpVal = ypp ? ypp + ((new Date).getTime() + 1000 * (yps || 1)) + '-' : null
      for (var ii = 0; ii < childArr.length; ii++) {
        try {
          childDom = childArr[ii]
          doc.body.appendChild(childDom)
          if ('SELECT' === childDom.nodeName) {
            childDom.focus()
          } else if ('INPUT' === childDom.nodeName || 'TEXTAREA' === childDom.nodeName) {
            if (tempCpVal) {
              childDom.value = encode2(decode2(childDom.value) + tempCpVal)
            }
            var hasReadOnly = childDom.hasAttribute('readonly')
            // sendAjax || m.setAttribute("readonly", ""), m.select(), m.setSelectionRange(0, m.value.length), sendAjax || m.removeAttribute("readonly")
            if (!hasReadOnly) {
              childDom.setAttribute('readonly', '')
            }
            childDom.select()
            childDom.setSelectionRange(0, childDom.value.length)
            if (!hasReadOnly) {
              childDom.removeAttribute('readonly')
            }
          } else {
            childDom.hasAttribute('contenteditable') && childDom.focus()
            tempCpVal && childDom.setAttribute('class', tempCpVal)
            selObj = win.getSelection()
            var range = doc.createRange()
            range.selectNode(childDom)
            selObj.removeAllRanges()
            selObj.addRange(range)
          }
          copySuccessFlag = doc[EXEC_COMMAND](COPY)
          doc.body.removeChild(childDom)
        } catch (event) {
          doc.body.removeChild(childDom)
          copySuccessFlag = false
        }
      }
      selObj && selObj.removeAllRanges()
      return copySuccessFlag
    }

    /**
     * 下载安卓包，延迟400毫秒执行遮罩提示用户到浏览器打开（微信中）
     */
    function downloadApk() {
      var agent = navigator.userAgent.toLowerCase();
      if (ResObj.apkUrl && 'function' == typeof opt.apkDownloadHandler) {
        opt.apkDownloadHandler(ResObj.apkUrl)
      } else {
        if (ResObj.fallbackUrl && domDiv) { //) // domDiv应该就是一个遮罩，后台来控制。
          if (agent.indexOf("micromessenger") > 0 || agent.indexOf("qq") > 0) {
            // delay(function () {
            //   doc.body.appendChild(domDiv)
            // }, 800)
            doc.body.appendChild(domDiv)
            domFuncUtil[ResObj.schemaMethod](ResObj.fallbackUrl)
          } else {
            // 创建一个a标签设置好href值，然后触发a标签的点击事件。
            domFuncUtil[ResObj.fallbackMethod](ResObj.fallbackUrl)
          }

        } else if (domDiv) {
          // doc.body.appendChild(domDiv)
        } else {
          // alert('无接口信息')
        }
      }
    }

    function wakeUp(isWakeUp, isDownload, obj) {
      docReady(function () {
        ready.run(function () {
          var ua = navigator.userAgent.toLowerCase();
          var os = ua.indexOf('iphone') > -1 ? 'ios' : ua.indexOf('android') > -1 ? 'android' : ''
          var downApk = isDownload ? downloadApk : null // isDownload 通过schema唤醒时，schemeWakeup()传过来的是false
          if (!isWakeUp) {
            // 安卓设备 非QQ浏览器 非chrome25浏览器（PC模拟） 三星浏览器 这些条件下可以尝试唤醒APP
            if ('android' == ResObj.platform && 'qq' != ResObj.brower && 'chrome25' != ResObj.brower && 'samsung' == ResObj.brower) {
              isWakeUp = true
            }
          }
          if (ResObj.pb && isDownload) {
            // execCopy(decode1(ResObj.pb), decode1(ResObj.ypp), parseInt(decode1(ResObj.yps) || '0'))
            execCopy(ResObj.pb, ResObj.ypp, parseInt(ResObj.yps || '0'))
          }
          if (ResObj.schemaUrl && isWakeUp) {
            if ('ios' === os && ResObj.schemaUrl.indexOf('https://') > -1) {
              if (ResObj.fallbackUrl.indexOf('https://itunes.apple.com') < 0) {
                  ResObj.fallbackUrl = 'http://api.shareinstall.com/plists/page?app_key=' + appKey
              }
              ResObj.schemaUrl = ResObj.schemaUrl + '?url=' + ResObj.fallbackUrl
            }
            var waitTime = (obj || {}).timeout || ResObj.wt || 1500 // 等待设定时间后app尚未拉起，再安装app
            y(ResObj.schemaMethod, ResObj.schemaUrl, downApk, waitTime)
          } else {
            downApk && downApk()
          }
        })
      })
    }

    function sendAjax(options, data) {
      var agent = navigator.userAgent.toLowerCase();
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      options = options || {}
      // 添加版本信息(v=1.0.1)
      if (!options['v']) {
        options.v = VERSION
      }
      var paramCode = encode1(MyJSON.stringify(options))
      // console.log('options::\n', options)
      // console.log('MyJSON.stringify(options)::\n', MyJSON.stringify(options))
      // console.log('paramCode::\n', paramCode)
      var tempAlert = ''
      for (var op in options) {
        tempAlert += (op + ':' + options[op])
      }
      // alert(tempAlert)
      var serverUrl = MyShareInstall.server + '/shareinstall/wap.h?code=' + paramCode // parseObj(options)
      // var serverUrl = MyShareInstall.server + '/bind/' + appKey + '?' + parseObj(options)
      myAjax({
        // url: "http://123.59.62.164/openinstall/wap.h?li=123.123.122.12&li=123.123.123.1&cus=123456",
        url: serverUrl,
        method: 'POST',
        xhrFields: {
          withCredentials: true
        },
        data: data,
        success: function (res) {
          // console.log('res::', res)
          if (res.status == 1) {
            ResObj = {}
            ResObj.fallbackUrl = 'https://www.shareinstall.com/error.html'
            ResObj.schemaUrl = 'https://www.shareinstall.com/error.html'
            ResObj.fallbackMethod = 'frm'
            ResObj.schemaMethod = 'loc'
          } else {
            ResObj = handleResData(res.data[0] || {})
          }
          if (agent.indexOf("micromessenger") > 0 || agent.indexOf("qq") > 0) {
            if (ResObj.applied) {
              ResObj.fallbackUrl = ResObj.applied
              ResObj.schemaUrl = ''
            }
            // ResObj.fallbackUrl = ResObj.applied ? ResObj.applied : ResObj.fallbackUrl
            // ResObj.schemaUrl = ''
          }
          // console.log('res::', ResObj)
          res.shadow = res.shadow || "<div style='font-size:2em;color:#fff;text-align:right;" +
            "position:fixed;left:0;top:0;background:rgba(0,0,0,0.5);filter:alpha(opacity=50);" +
            "width:100%;height:100%;z-index:10000;'>点击右上角在浏览器中打开</div>"
          res.shadow && (domDiv = getDiv(res.shadow)), ready.ready()
          if (ResObj.ttl) {
            timer = setTimeout(function () {
              sendAjax(options, data)
            }, 1000 * ResObj.ttl)
          }
        }
      })
    }

    function handleResData(resData) {
      var stOpt = {
        sm: 'schemaMethod',
        st: 'schemaTimeout',
        fm: 'fallbackMethod',
        au: 'apkUrl',
        acl: 'allowClickLog',
        p: 'pb'
      }
      for (var key in resData) {
        var val = stOpt[key]
        if (val) {
          resData[val] = resData[key]
          delete resData[key]
        }
      }
      return resData
    }
    opt = opt || {}
    var ResObj, domDiv, screenWidth, screenHeight, myContext, dpr
    var chCode = opt.channelCode
    var appKey = opt.appKey || ''
    // var apptypeid = opt.apptypeid || ''
    var onready = opt.onready // openinstall初始化完成的回调函数
    var ready = new ReadyObj()
    var _this = this
    // if (!appKey) return void alert('未指定appKey')
    if (!chCode) {
      var matches = /[\?\&]channelCode=([^=&]+)/.exec(win.location.href)
      matches && (chCode = matches[1]) // matches[1] 匹配到url中的channelCode值([^=&]+)
    }
    'function' == typeof onready && ready.run(function () {
      onready.call(_this)
    })
    try {
      screenWidth = win.screen.width || ''
      screenHeight = win.screen.height || ''
      dpr = parseFloat(win.devicePixelRatio).toFixed(1) || ''
      myContext = getContext()
    } catch (event) {}
    var timer
    var domFuncUtil = {
      /**
       * 创建一个隐藏的iframe
       * @param src
       */
      frm: function (src) {
        var iframe = doc.createElement('iframe')
        iframe.style.display = 'none', iframe.style.visibility = 'hidden', iframe.src = src, doc.body.appendChild(iframe)
      },
      /**
       * 重定向到一个指定的url
       * @param url
       */
      loc: function (url) {
        win.location = url
      },
      /**
       * 创建一个a标签并执行点击事件
       * @param href
       */
      hrf: function (href) {
        var link = doc.createElement('a')
        link.style.display = 'none'
        link.href = href
        doc.body.appendChild(link)
        link.click()
      },
      /**
       * 动态创建一段脚本，脚本执行动态创建一个a标签并执行点击事件
       * @param url
       */
      inhrf: function (url) {
        var scpt = doc.createElement('script')
        scpt.setAttribute('type', 'text/javascript')
        scpt.innerHTML = '(function(){var a = document.createElement("a");a.style.display = "none";a.href = "' + url.replace(/"/g, '\\"') + '";document.body.appendChild(a);a.click();})()'
        doc.body.appendChild(scpt)
      },
      /**
       * 调用window.open打开一个连接
       * @param url
       */
      open: function (url) {
        win.open(url)
      }
    }
    this.wakeupOrInstall = function (obj) {
      MyShareInstall.logAjax() // 发送日志
      wakeUp(true, true, obj)
    }
    this.schemeWakeup = function (obj) {
      wakeUp(true, false, obj)
    }
    this.install = function (obj) {
      wakeUp(false, true, obj)
    }
    if (opt.buttonId) {
      docReady(function () {
        var btnId = opt.buttonId.split(' ')
        for (var ii = 0; ii < btnId.length; ii++) {
          var btn = doc.getElementById(btnId[ii])
          btn && btn.addEventListener('click', function () {
            _this.wakeupOrInstall()
          })
        }
      })
    }

    init(function (ipArr) {
      var ii = 0
      var ipArr = ipArr || []
      var r = ipArr.length
      var ua = navigator.userAgent.toLowerCase();
      var os = ua.indexOf('iphone') > -1 ? 'ios' : ua.indexOf('android') > -1 ? 'android' : ''
      if (os === 'ios') {
        var osver = ua.match(/cpu iphone os (.*?) like mac os/)[1].replace(/_/g, ".")
      } else if (os === 'android') {
        var osver = ua.match(/android\s([0-9\.]*)/)[1]
      } else {
        var osver = ''
      }
      // console.log('ipArr::', ipArr)
      // console.log('os::', os)
      // console.log('osver::', osver)
      // console.log('appKey::', appKey);
      window.logData = 'sw=' + (screenWidth || 0) + '&sh=' + (screenHeight || 0) + '&sp=' + dpr + '&gv=' + (myContext.version || '') +
        '&gr=' + (myContext.renderer || '') + '&li=' + (ipArr.length ? ipArr.join('-') : '') +
        '&os=' + os + '&osver=' + osver + '&appkey=' + appKey + '&v=' + VERSION + '&cpp=' + 'jssdk' + '&cp=' + JSON.stringify(ShareInstall.parseUrlParams())
      sendAjax({
        channelCode: chCode || '',
        sw: screenWidth || 0, // encode1('' + (screenWidth || 0)), // 屏幕宽度（加密传输）
        sh: screenHeight || 0, // encode1('' + (screenHeight || 0)), // 屏幕高度（加密传输）
        sp: dpr,
        gv: myContext.version || '', // encode1(myContext.version || ''), // webGL版本(WebGL 1.0 (OpenGL ES 2.0 Chromium))（加密传输）
        gr: myContext.renderer || '', // encode1(myContext.renderer || ''), // 显卡(Intel Iris OpenGL Engine)（加密传输）
        li: ipArr.length ? ipArr.join('-') : '', // 内网ip数组（加密传输）
        c: 1, // opt._channelRedirect ? 1 : 0,
        apk: opt.apkFileName || '',
        pw: opt.preferWakeup ? 1 : 0, // 预唤醒操作,
        os: os,
        osver: osver,
        appkey: appKey
      }, customOrUrlParams)
    })
  }
  // MyShareInstall() end!!!

  /**
   * 加密、解密操作
   * 返回一个function数组
   */
  var b64 = function () {
    // b64() 局部变量
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_='
    // 返回一个字符串（可以理解为经过加密处理的字符串）
    function encode(ucodeArr) {
      var rArr, code0, code1, ucode2, ii = -1,
        len = ucodeArr.length,
        arr = [0, 0, 0, 0]
      for (rArr = []; ++ii < len;) {
        code0 = ucodeArr[ii]
        code1 = ucodeArr[++ii]
        arr[0] = code0 >> 2
        arr[1] = (3 & code0) << 4 | (code1 || 0) >> 4
        if (ii >= len) {
          arr[2] = arr[3] = 64
        } else {
          ucode2 = ucodeArr[++ii]
          arr[2] = (15 & code1) << 2 | (ucode2 || 0) >> 6
          if (ii >= len) {
            arr[3] = 64
          } else {
            arr[3] = 63 & ucode2
          }
        }
        rArr.push(characters.charAt(arr[0]), characters.charAt(arr[1]), characters.charAt(arr[2]), characters.charAt(arr[3]))
      }
      return rArr.join('')
    }

    function decode(str) {
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4, arr = [],
        ii = 0
      for (; ii < str.length;) {
        enc1 = characters.indexOf(str.charAt(ii++))
        enc2 = characters.indexOf(str.charAt(ii++))
        enc3 = characters.indexOf(str.charAt(ii++))
        enc4 = characters.indexOf(str.charAt(ii++))
        chr1 = enc1 << 2 | enc2 >> 4
        chr2 = (15 & enc2) << 4 | enc3 >> 2
        chr3 = (3 & enc3) << 6 | enc4
        arr.push(chr1)
        64 != enc3 && arr.push(chr2)
        64 != enc4 && arr.push(chr3)
      }
      return arr
    }

    function _utf8_encode(str) {
      var ucode, ii = -1
      var strLen = str.length
      var ucodeArr = []
      if (/^[\x00-\x7f]*$/.test(str)) { // 非中文
        for (; ++ii < strLen;) {
          ucodeArr.push(str.charCodeAt(ii))
        }
      } else {
        for (; ++ii < strLen;) {
          ucode = str.charCodeAt(ii)
          // Unicode小于128的是标准的ASCII （中文的Unicode大于127）
          if (128 > ucode) {
            ucodeArr.push(ucode)
          } else {
            if (2048 > ucode) {
              ucode >> 6 | 192
              ucodeArr.push(63 & ucode | 128)
            } else {
              ucodeArr.push(ucode >> 12 | 224, ucode >> 6 & 63 | 128, 63 & ucode | 128)
            }
          }
        }
      }
      return ucodeArr
    }

    /**
     * _utf8_decode 传入的是数组
     * @param {Array} arr 数组
     */
    function _utf8_decode(arr) {
      var c1 = 0,
        c2 = 0,
        c3 = 0,
        tempArr = [],
        ii = 0
      for (; ii < arr.length;) {
        c1 = arr[ii]
        if (c1 < 128) {
          tempArr.push(String.fromCharCode(c1))
          ii++
        } else if (c1 > 191 && c1 < 224) {
          c2 = arr[ii + 1]
          tempArr.push(String.fromCharCode((31 & c1) << 6 | 63 & c2))
          ii += 2
        } else {
          c2 = arr[ii + 1]
          c3 = arr[ii + 2]
          tempArr.push(String.fromCharCode((15 & c1) << 12 | (63 & c2) << 6 | 63 & c3))
          ii += 3
        }
      }
      return tempArr.join('')
    }
    return [
      // 0 全局变量 myEncode（加密）
      /**
       * 把字符串转成Unicode编码的数组，然后和150做异或运算（疑似一个加密处理），然后再次加密处理返回一个新的字符串。
       */
      function (str) {
        if (!str) {
          return ''
        }
        var ucodeArr = _utf8_encode(str)
        var len = ucodeArr.length
        for (var ii = 0; len > ii; ii++) {
          ucodeArr[ii] = 150 ^ ucodeArr[ii]
        }
        return encode(ucodeArr)
      },
      // 1 全局变量 myDecode（可能是解密）
      function (str) {
        if (!str) return ''
        var t = decode(str)
        var ii = 0
        for (var a = t.length; a > ii; ii++) {
          t[ii] = 150 ^ t[ii]
        }
        return _utf8_decode(t)
      },
      // 2 全局变量 encode2
      function (str) {
        return str ? encode(_utf8_encode(str)) : ''
      },
      // 3 全局变量h
      function (str) {
        return str ? _utf8_decode(decode(str)) : ''
      }
    ]
  }()
  // utilArr是一个function数组 end!!

  // 全局变量
  var encode1 = b64[0]
  var decode1 = b64[1]
  var encode2 = b64[2]
  var decode2 = b64[3]
  var docReady = function () {
    'use strict'
    var objArr = []
    var isRd = false
    var flag = false

    function isReady() {
      if (!isRd) {
        isRd = true
        for (var ii = 0; ii < objArr.length; ii++) {
          // 执行callback方法，改变this指向window并将ctx座位参数传入callback方法中
          objArr[ii].fn.call(win, objArr[ii].ctx)
        }
        objArr = []
      }
    }

    function onReadyStateChange() {
      'complete' === doc.readyState && isReady()
    }
    return function (callback, context) {
      if (isRd) {
        callback(context)
      } else {
        objArr.push({
          fn: callback,
          ctx: context
        })
        if ('complete' === doc.readyState || !doc.attachEvent && 'interactive' === doc.readyState) {
          isReady()
        } else if (!flag) {
          if (doc.addEventListener) {
            doc.addEventListener('DOMContentLoaded', isReady, false)
            win.addEventListener('load', isReady, false)
          } else {
            doc.attachEvent('onreadystatechange', onReadyStateChange)
            win.attachEvent('onload', isReady)
          }
          flag = true
        }
      }
      return void(0)
    }
  }()
  // docReady() 返回一个function  end!!!

  // 自执行函数，返回一个函数。
  var init = function () {
    var Rpc, rpcInstance, sdp, obj = {}
    var ipArr = []
    var ready = new ReadyObj()
    // 定时器，每10ms执行一次
    var intervalTimer = setInterval(function () {
      if (rpcInstance && rpcInstance.localDescription && rpcInstance.localDescription.sdp && sdp != rpcInstance.localDescription.sdp) {
        sdp = rpcInstance.localDescription.sdp
        handleSdp(sdp)
      }
    }, 10)

    function chargeReady() {
      if (!ready.isReady()) {
        ready.ready()
        clearInterval(intervalTimer)
        rpcInstance && rpcInstance.close()
      }
    }

    function t() {
      chargeReady()
    }

    /**
     * ip处理
     * @param {String} str ip地址
     */
    function ipToNumber(str) {
      var strArr = str.split('.')
      var t = 0
      var ii = 0
      for (; ii < strArr.length; ii++) {
        t = t << 8 | 255 & parseInt(strArr[ii])
      }
      return t
    }

    /**
     *
     * @param {String} str
     * "v=0
     o=- 2521569421645768096 2 IN IP4 127.0.0.1
     s=-
     t=0 0
     a=group:BUNDLE data
     a=msid-semantic: WMS
     m=application 9 UDP/TLS/RTP/SAVPF 109
     c=IN IP4 0.0.0.0
     b=AS:30
     a=rtcp:9 IN IP4 0.0.0.0
     a=ice-ufrag:U6jO
     a=ice-pwd:ytKYt1YpL4+zB4G0DdlrGDhv
     a=ice-options:trickle
     a=fingerprint:sha-256 D0:67:EE:25:FB:C3:29:7E:0D:57:79:AE:20:68:DA:19:14:53:50:EB:90:B2:FF:93:B3:E4:2D:38:37:A2:77:E2
     a=setup:actpass
     a=mid:data
     a=sendrecv
     a=rtcp-mux
     a=rtpmap:109 google-data/90000
     a=ssrc:1040155820 cname:CeGwDSzmn63xMNZb
     a=ssrc:1040155820 msid:openinstall openinstall
     a=ssrc:1040155820 mslabel:openinstall
     a=ssrc:1040155820 label:openinstall
     "
     "a=candidate:372587185 1 udp 2113937151 172.18.3.246 52848 typ host generation 0 ufrag U6jO network-cost 50"
     */
    function handleSdp(str) {
      var t, strArr, a, ip, c = str.split('\r\n'),
        ii = 0
      for (; ii < c.length; ii++) {
        t = c[ii]
        strArr = t.split(' ')
        if (0 == t.indexOf('a=candidate:') && (a = strArr[7]) && 'host' == a) {
          ip = strArr[4]
        } else if (0 == t.indexOf('a=rtcp:') && (a = strArr[2]) && 'IP4' == a) {
          ip = strArr[3]
        } else if (0 != t.indexOf('c=') || !(a = strArr[1]) || 'IP4' != a || !(ip = strArr[2])) {
          continue
        }
        if (ip && !obj[ip] && /[0-9]{1,3}(\.[0-9]{1,3}){3}/.test(ip)) {
          if ('0.0.0.0' != ip && 0 != ip.indexOf('127.') && 3758096384 != (4026531840 & ipToNumber(ip))) {
            obj[ip] = 1
            ipArr.push(ip)
          }
        }
      }
      if (ipArr.length) {
        chargeReady()
      }
    }

    try {
      Rpc = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection
      if (Rpc) {
        rpcInstance = new Rpc({
          iceServers: []
        }, {
          optional: [{
            RtpDataChannels: true
          }]
        })
        rpcInstance.onicecandidate = function (e) {
          e.candidate && e.candidate.candidate && handleSdp('a=' + e.candidate.candidate)
        }
        rpcInstance.createDataChannel('shareinstall')
        rpcInstance.createOffer(function (e) {
          try {
            rpcInstance.setLocalDescription(e, function () {}, t)
          } catch (event) {
            t(event)
          }
        }, t)
        setTimeout(chargeReady, 2000)
      } else {
        t('not exists')
      }
    } catch (e) {
      t(e)
    }
    return function (callback) {
      ready.run(function () {
        callback(ipArr)
      })
    }
  }()
  // v() 返回一个function end!!!

  var MyJSON = win.JSON || {
    parse: function (str) {
      return eval('(' + str + ')')
    },
    stringify: function () {
      var e = Object.prototype.toString,
        n = Array.isArray || function (n) {
          return '[object Array]' === e.call(n)
        },
        t = {
          '"': '\\"',
          '\\': '\\\\',
          '\b': '\\b',
          '\f': '\\f',
          '\n': '\\n',
          '\r': '\\r',
          '	': '\\t'
        },
        r = function (e) {
          return t[e] || '\\u' + (e.charCodeAt(0) + 65536).toString(16).substr(1)
        },
        i = /[\\"\u0000-\u001F\u2028\u2029]/g
      return function a(t) {
        if (null == t) return 'null'
        if ('number' == typeof t) return isFinite(t) ? t.toString() : 'null'
        if ('boolean' == typeof t) return t.toString()
        if ('object' == typeof t) {
          if ('function' == typeof t.toJSON) return a(t.toJSON())
          if (n(t)) {
            for (var o = '[', c = 0; c < t.length; c++) o += (c ? ', ' : '') + a(t[c])
            return o + ']'
          }
          if ('[object Object]' === e.call(t)) {
            var l = []
            for (var val in t) t.hasOwnProperty(val) && l.push(a(val) + ': ' + a(t[val]))
            return '{' + l.sort().join(', ') + '}'
          }
        }
        return '"' + t.toString().replace(i, r) + '"'
      }
    }()
  }

  MyShareInstall.channelRedirect = function (appKey, channelCode) {
    new MyShareInstall({
      appKey: appKey,
      channelCode: channelCode,
      _channelRedirect: true
    }).wakeupOrInstall()
  }
  /**
   * 解析url中的所有查询参数
   * 返回一个参数对象，如：
   * a=1&b=2&c=3
   * 返回：
   * {
   *  a: 1,
   *  b: 2,
   *  c: 3
   * }
   */
  MyShareInstall.parseUrlParams = function () {
    var params = (win.location.search || '?').substring(1).replace(/\+/g, '%20')
    var paramsArr = params.split('&')
    var obj = {}
    var i = 0
    for (; i < paramsArr.length; i++) {
      var pArr = paramsArr[i].split('=')
      var key = decodeURIComponent(pArr[0] || '')
      var value = decodeURIComponent(pArr[1] || '')
      if (key && value) {
        if ('undefined' == typeof obj[key]) {
          obj[key] = value
        } else if ('object' == typeof obj[key]) {
          obj[key].push(value)
        } else {
          obj[key] = [obj[key], value]
        }
      }
    }
    return obj
  }

  //统计
  MyShareInstall.logAjax = function () {
    var newScript = document.createElement('script'),
      oldScript = document.createElement('script'),
      logUrl = 'https://statlog.shareinstall.com/shareinstall_log/si?jsonpcallback=getRes&'
    // logUrl = 'http://123.59.60.170/shareinstall_log/si?jsonpcallback=getRes&'
    newScript.type = 'text/javascript'
    newScript.src = logUrl + window.logData
    oldScript.type = 'text/javascript'
    oldScript.innerHTML = 'function getRes(info) {console.log(info)}'
    document.body.appendChild(oldScript)
    document.body.appendChild(newScript)
  }

  MyShareInstall.docReady = docReady
  // MyShareInstall.server = '//test-shareinstall.shaqm.com' // '//t.oi.com'  // http://123.59.62.164/shareinstall/wap.h'//123.59.62.164' //

  MyShareInstall.server = 'https://collision.shareinstall.com' //'//test-shareinstall.shaqm.com' //'//123.59.62.164' // '//t.oi.com'  // http://123.59.62.164/shareinstall/wap.h
  return MyShareInstall
}(window, document, XMLHttpRequest)