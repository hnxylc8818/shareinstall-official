ShareInstall = function (win, doc, xhr) {
    // 全局变量
    var VERSION = '1.0.5'

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

    /* 封装ajax函数
     * @param {string}opt.type http连接的方式，包括POST和GET两种方式，默认使用GET
     * @param {string}opt.url 发送请求的url
     * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
     * @param {object}opt.data 发送的参数，格式为对象类型
     * @param {function}opt.success ajax发送并接收成功调用的回调函数
     */
    function httpAjax(opt) {
        opt = opt || {};
        var type = opt.type || 'GET';
        type = type.toUpperCase() || 'GET';
        var url = opt.url || '';
        var async = opt.async || true;
        var data = opt.data || null;
        var success = opt.success || function () {};
        var fail = opt.fail || function () {};
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        var params = [];
        for (var key in data){
            params.push(key + '=' + data[key]);
        }
        var dataStr = params.join('&');
        if (type === 'POST') {
            xmlHttp.open(type, url, async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(dataStr);
        }
        else {
            xmlHttp.open(type, url + '?' + dataStr, async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
           if(xmlHttp.readyState == 4){
               var status = xmlHttp.status;
               if(status >= 200 && status < 300){
                   success && success(xmlHttp.responseText);
               }else{
                   fail && fail(status);
               }
           }
        };
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
            var isAndroidQq = false
            var agent = navigator.userAgent.toLowerCase();
            if (agent.indexOf("qq") > 0 && agent.indexOf("micromessenger") < 0 && (agent.indexOf('android') > -1)) {
                isAndroidQq = true
            }
            var hidden
            var visibilityChange
            // var isAndroidQq = 'android' == ResObj.platform && 'qq' == ResObj.brower // 安卓平台qq浏览器
            // isAndroidQq = false
            if (isAndroidQq) {
                hidden = 'hidden'
                visibilityChange = 'qbrowserVisibilityChange'
            } else {
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
            }
            // if ('undefined' != typeof doc.hidden) {
            //   hidden = 'hidden'
            //   visibilityChange = 'visibilitychange'
            // } else if ('undefined' != typeof doc.msHidden) {
            //   hidden = 'msHidden'
            //   visibilityChange = 'msvisibilitychange'
            // } else if ('undefined' != typeof doc.webkitHidden) {
            //   hidden = 'webkitHidden'
            //   visibilityChange = 'webkitvisibilitychange'
            // }
            var isHidden = function (dc) {
                if (isAndroidQq && dc && 'undefined' != typeof dc.hidden) {
                    return dc.hidden
                } else {
                    return doc[hidden]
                }
                // return doc[hidden]
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
         * 对后台返回的自定义参数做处理
         */
        function paramParse(imgDom) {
            var param = '',
                _tempJson = '',
                ua = navigator.userAgent.toLowerCase()
            try {
                param = imgDom.match(/\,([^\"]*)\"/)[1] || ''
            } catch(e) {
            }
            _tempJson = MyJSON.parse(decode2(param))
            _tempJson.shareInstallCode = {
                appkey: appKey,
                timestamp: (+new Date()).toString().slice(0, 10)
            }
            if (ua.indexOf('android') > 0) {
                imgDom = '<a value="' + encode2(MyJSON.stringify(_tempJson)) + '">&nbsp;</a>'
                return imgDom

            }
            return imgDom.replace(param, encode2(MyJSON.stringify(_tempJson)))
        }

        /**
         <!-- 后台返回的一段与复制有关的内容（一段html字符串）： -->
         qv_78bb_8qu0u_nm8_j_-OXi9_r6u-b0u6OlpqOhpaCiu7S25eT1q7Ty9-L3rP_79_Hzueb48a309-XzoKK6_8DU2cThpt3R8fnX19fX2MXD_tPD8dfX19fT19fX19TV19vX19fX-e_sxaHX19fX16fU28DTwNv3ztDY7q_xoNfX19fXzsTFwvrb18fZ9M_M8dfX19en3MTT0MPz2PnU1_HSr7nh19fX19_X18Db5PjS19fX19fXxcPA2cTdo9XP39-rtLmo
         <!-- 解密后： -->
         <img id="-openinstall-pb-53057364-" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEVMaXFNx9g6AAAAAXRSTlMAQObYZgAAAA1JREFUeNoBAgD9/wAAAAIAAVMrnDAAAAAASUVORK5CYII="/>
         */
        function execCopy(imgDom, ypp, yps) {
            imgDom = paramParse(imgDom)
            // console.log(imgDom)

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
                if (ResObj.fallbackUrl && domDiv || (agent.indexOf('android') > -1)) { //) // domDiv应该就是一个遮罩，后台来控制。
                    if ((agent.indexOf("micromessenger") > 0 || agent.indexOf("qq") > 0) && (agent.indexOf('android') > -1)) {
                        // delay(function () {
                        //   doc.body.appendChild(domDiv)
                        // }, 800)

                        if (ResObj.fallbackUrl) {
                            domFuncUtil[ResObj.schemaMethod](ResObj.fallbackUrl)
                        } else if (agent.indexOf("micromessenger") > 0) {
                            doc.body.appendChild(domDiv)
                            // ResObj.fallbackUrl = '//test-api.shareinstall.com/test3/test42?janfly=life_struggle&url=' + encodeURIComponent(win.location.href)
                            // domFuncUtil[ResObj.schemaMethod](ResObj.fallbackUrl)
                        }
                        if (agent.indexOf("qq") > 0 && agent.indexOf("micromessenger") < 0 && !ResObj.fallbackUrl) {
                            MyShareInstall.getAPK()
                        }
                    } else if (agent.indexOf('android') > -1 && !ResObj.fallbackUrl) {
                        // 创建一个a标签设置好href值，然后触发a标签的点击事件。
                        MyShareInstall.getAPK()
                        // domFuncUtil[ResObj.fallbackMethod](ResObj.fallbackUrl)
                    } else {
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
                    var tempUrl = ''
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
                            tempUrl = '?url=' + ResObj.fallbackUrl
                            if (ResObj.schemaUrl.indexOf(tempUrl) < 0) {
                                ResObj.schemaUrl = ResObj.schemaUrl + tempUrl
                            }
                        }
                        var waitTime = (obj || {}).timeout || ResObj.wt || 1000 // 等待设定时间后app尚未拉起，再安装app
                        if ((ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) && (ua.indexOf("micromessenger") > 0)) {
                            doc.body.appendChild(domDiv)
                            ResObj.schemaMethod = 'frm'
                        }
                        if ((ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1)) {
                            downApk = null
                        }
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
            // console.log(opt.shadow)
            // console.log(MyJSON.stringify(options))
            var paramCode = encode1(MyJSON.stringify(options))
            var options2 = MyJSON.parse(MyJSON.stringify(options))
            options2.cus = data
            // console.log(MyJSON.stringify(options2))
            window._SHAREINSTALLCODE = encode1(MyJSON.stringify(options2))
            // console.log(decode1('7bT1_vf4-PP61fny87SstLS6tOXhtKy0pa-ltLq05f60rLSgr6-0urTl5rSspLiho7q08eC0rLTB8_TR2qe4pr7Z5vP40drTxaS4ptX-5Pn7_-P7v7S6tPHktKy01_Lk8_j5vsLbv6OnpLS6tPr_tKy0tLq09bSsp7q09-b9tKy0tLq05uG0rKa6tPnltKy09_jy5Pn_8rS6tPnl4PPktKy0obinuKe0urT35ub98--0rLTQoNTd16HX0NDQ1Nfe07S6tOC0rLSnuKa4pbTr'))
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
                    res.shadow = opt.shadow || res.shadow || "<div id='ShareInstallDom' style='font-size:30px;color:#fff;text-align:right;" +
                        "position:fixed;left:0;top:0;background:rgba(0,0,0,0.5);filter:alpha(opacity=50);" +
                        "width:100%;height:100%;z-index:10000;'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeoAAAGKCAMAAAD0R/JSAAADAFBMVEUAAAD////////////25dz///736+X///7///////////////7////////+/v7////////////9+/r////////////kvKX////xw6r29vb////29vb////////////8zLL+/v7////29vb////////8/Pz////////////////////////19PP70Lj////////////////////////////90Lf+/v7+/v78z7b////////7+/v////////5+fn+07q0tLT////w8PD/07r+07r9/f3eo4P/1r7/1Lz+1Lz/1b3Bk3v/1bz/1Lz/1r/X19f/18H/1r7/1b32wKL/////1Lzx8fG0s7L/1r7v7+/m5eTJycrh4eH/07r/1b7/1b7/1b3/1b3/////1r7t7e2wsLG1tLP////+/v6Yl5e9e1j////Nzc30wKTp6en+07r5xKfq6+vLzMy8eVf9y6//0bj/1Lv9/f3SmXqLj5LLy8uoqarfpIW4h23/07nIiGf/07r0vZ/8yq3+0bjFhWP+/v7MzMz5w6X/0rjDgF7JiWj/2cT09PTo6OjKi2rgpYbwuJr/2MKvsbLXm3vxu57/18H/2MK3dFD8y678yq3vtpfZnX3WmXn/2MGxb038yq3bn3/ann77yKr////l5eXQk3Len37+2cXip4i7d1TOkG68elfttZbdooLBiGrlrI7TlHT4wqbIh2X/4dTtuZz0wqfHxsakY0GMj5CWWjr85NTg39//7efm5ub/07r/////2ML/1Lz/1r//0rn/2sT/1b3/2cP/07n/18D8y7D/3cn/0bj8xqj+0LX/2MP7xab8zrT8yq7+0bf/3sr/3Mb9zbH8yKr/3NH6ya75w6X3waP+yav1vqDutZb/38zzu53/4c/wt5jxuZv/5tb/zrH4xan1v6L2v6L/5N3rspPjqYr/5NP1u5z/2czoro7/zK7UmXn/6Nn/3tT/3MjZnn/LjWz/6+b+zrTEhWTPlHT/8PDTkW6paEf6z7+dWzjvw6lfLYYpAAAAvnRSTlMAgL9AAxABIN+fYO/QMAiwcI8G5FDwCeoNJNoO9fi2JhPvC0Y1GNWaaznEJhcT++jJu4ZNZS0qHRjypBvtq1cfG3pGQzQt/sB1UzsUmIdt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' alt='' style='width:60%;margin-top:20px;'></div>"
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
            if (win.devicePixelRatio === parseInt(win.devicePixelRatio)) {
                dpr = parseFloat(win.devicePixelRatio).toFixed(1) || ''
            } else {
                dpr = parseFloat(win.devicePixelRatio).toString() || ''
            }
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
            MyShareInstall.logAjax(wakeUp,obj) // 发送日志
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
            var os = (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) ? 'ios' : ua.indexOf('android') > -1 ? 'android' : ''
            if (os === 'ios') {
                var osver = ua.match(/os (.*?) like mac os/)[1].replace(/_/g, ".")
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
                '&os=' + os + '&osver=' + osver + '&appkey=' + appKey + '&v=' + VERSION + '&cpp=' + 'jssdk' + '&cp=' + JSON.stringify(customOrUrlParams)
            sendAjax({
                channelCode: chCode || '',
                sw: screenWidth.toString() || '0', // encode1('' + (screenWidth || 0)), // 屏幕宽度（加密传输）
                sh: screenHeight.toString() || '0', // encode1('' + (screenHeight || 0)), // 屏幕高度（加密传输）
                sp: dpr,
                gv: myContext.version ? myContext.version.replace(/\s/g, '') : '', // encode1(myContext.version || ''), // webGL版本(WebGL 1.0 (OpenGL ES 2.0 Chromium))（加密传输）
                gr: myContext.renderer ? myContext.renderer.replace(/\s/g, '') : '', // encode1(myContext.renderer || ''), // 显卡(Intel Iris OpenGL Engine)（加密传输）
                li: ipArr.length ? ipArr.join('-') : '', // 内网ip数组（加密传输）
                // li: '',
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
        /* 'use strict'*/
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

    MyShareInstall.setUid = function() {
        return (+new Date()) + Math.random().toString(10).substring(2, 6);
    }
    //设置cookies
    MyShareInstall.setCookie = function(name, value) {
        var Days = 30; //天
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toUTCString() + ";path=/";
    }
    //读取cookies
    MyShareInstall.getCookie = function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return decodeURI(arr[2]);
        } else {
            return null;
        }
    }

    /**
     *将url上的拼接数据转换为对象
     *author:quancifang
     *create:2018-6-29
     */
    MyShareInstall.url2json = function (url){
        var nameValue;
        var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var paraObj = {};
        for (var i = 0; nameValue = paraString[i]; i++) {
            var name = nameValue.substring(0, nameValue.indexOf("=")).toLowerCase();
            var value = nameValue.substring(nameValue.indexOf("=") + 1, nameValue.length);
            if (value.indexOf("#") > -1) {
                value = value.split("#")[0];
            }
            paraObj[name] = value;
        }
        return paraObj;
    };

    // 统计
    MyShareInstall.logAjax = function (callback,obj) {
        var uid = ''
        if (MyShareInstall.getCookie('ShareInstallUid')) {
            uid = MyShareInstall.getCookie('ShareInstallUid')
        } else {
            uid = MyShareInstall.setUid()
            MyShareInstall.setCookie('ShareInstallUid', uid)
        }
        var windowLogData = 'https://statlog.shareinstall.com/shareinstall_log/si?ordernumber=' + uid + '&'+ window.logData
        //var windowLogData = 'http://123.59.60.170/shareinstall_log/si?ordernumber=' + uid + '&'+ window.logData
        var postData =  MyShareInstall.url2json(windowLogData)
        httpAjax({
            url: 'https://statlog.shareinstall.com/shareinstall_log/si',
            type: 'POST',
            data: postData,
            async:false,
            success: function () {
                callback(true,true,obj);
            },
            fail:function () {
                callback(true,true,obj);
            }
        })
    }

    // 获取apk
    MyShareInstall.getAPK = function () {
        var newScript = document.createElement('script'),
            oldScript = document.createElement('script'),
            // logUrl = 'https://statlog.shareinstall.com/shareinstall_log/si?jsonpcallback=getRes&'
            scriptUrl = MyShareInstall.server + '/shareinstall/apk.h?jsonpcallback=getShareApk&code=' + window._SHAREINSTALLCODE
        newScript.type = 'text/javascript'
        newScript.src = scriptUrl
        oldScript.type = 'text/javascript'
        oldScript.innerHTML = 'function getShareApk(info) {var iframe = document.createElement("iframe");iframe.style.display = "none"; iframe.style.visibility = "hidden"; iframe.src = info.data[0]["fallbackUrl"]; document.body.appendChild(iframe);}'
        // oldScript.innerHTML = 'function getShareApk(info) {console.log(info.data[0]["fallbackUrl"])}'
        document.body.appendChild(oldScript)
        document.body.appendChild(newScript)
    }

    MyShareInstall.docReady = docReady
    // MyShareInstall.server = '//123.59.62.164' ////test-shareinstall.shaqm.com' // '//t.oi.com'  // http://123.59.62.164/shareinstall/wap.h'

    // MyShareInstall.server = 'https://collision.shareinstall.com' //'//test-shareinstall.shaqm.com' //'//123.59.62.164' // '//t.oi.com'  // http://123.59.62.164/shareinstall/wap.h
    MyShareInstall.server = 'https://wapcollision.shareinstall.com' //'//test-shareinstall.shaqm.com' //'//123.59.62.164' // '//t.oi.com'  // http://123.59.62.164/shareinstall/wap.h
    return MyShareInstall
}(window, document, XMLHttpRequest)
