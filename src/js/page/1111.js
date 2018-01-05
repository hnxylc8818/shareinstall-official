function _evalWithContext(context, __eval) {
    return eval("with(context){" + __eval + "}")
}
!function () {
    window.Handlebars && (window.Handlebars.registerHelper("eval", function (t, e) {
        var n = t.fn(e);
        return _evalWithContext(t.data.root, n)
    }), window.Handlebars.registerHelper("if_even", function (t, e) {
        return t % 2 == 0 ? e.fn(this) : e.inverse(this)
    }), window.Handlebars.registerHelper("loop", function (t, e) {
        var n, a = e.hash.max;
        e.data && (n = Handlebars.createFrame(e.data));
        for (var r = [], o = 0; o < a; o++)n.index = o + 1, r.push(e.fn(t[o], {data: n}));
        return r.join("")
    }))
}(), function () {
    function t(t, e, n, a) {
        var r = $(e);
        "text" == t || "html" == t || "val" == t ? r[t](n) : "attr" == t ? "checked" == a || "disabled" == a || "selected" == a ? r.prop(a, n) : r.attr(a, n) : "prop" == t && r.prop(a, n)
    }

    function e(t, a, r) {
        for (var o = t.attributes, i = 0; i < o.length; i++) {
            var s = o[i];
            if (0 == s.name.indexOf("data-bind-")) {
                var l, c = s.name.substring("data-bind-".length, s.name.length), u = c.indexOf("-");
                if (u > -1 && (l = c.substring(u + 1, c.length), c = c.substring(0, u)), n[c]) {
                    var f = _evalWithContext(a, s.value);
                    n[c](c, t, f, l)
                } else console.error("错误的绑定：", s.name, t)
            }
        }
        if (r !== !1)for (var d = t.children, i = 0; i < d.length; i++)e(d[i], a)
    }

    var n = {text: t, html: t, val: t, attr: t, prop: t};
    window.bind = e
}(), function () {
    function t(t) {
        h();
        var e = $("#login_form"), n = function () {
            var t = e.find("input[type='password']").val(), n = new jsSHA("SHA-512", "TEXT");
            return n.update(t + "MAGIC"), t = n.getHash("HEX"), e.find("input[name='password']").val(t), i(e.attr("action"), e.serialize(), function (t) {
                if (params.appId) {
                    var e = !1;
                    if ($.each(t.apps || [], function (t, n) {
                            if (params.appId == n)return e = !0, !1
                        }), !e)return void(window.location = "/app-list.html")
                }
                location.reload()
            }, function (t) {
                e.find(".login-errorMsg").text(t.msg)
            }), !1
        };
        e.parsley ? e.parsley({}).on("form:submit", n) : e.submit(n), $("#_login").show()
    }

    function e(t) {
        function e(t) {
            $.each(t, function (t, r) {
                if (a.push(t), $.isPlainObject(r) || $.isArray(r)) e(r); else {
                    for (var o = "", i = 0; i < a.length; i++) {
                        var s = a[i];
                        o = "number" == typeof s ? o + "[" + s + "]" : "" == o ? s : o + "." + s
                    }
                    null !== r && void 0 !== r && n.push({name: o, value: r})
                }
                a.pop()
            })
        }

        var n = [], a = [];
        return e(t), n
    }

    function n(t) {
        var n = e(t), a = [];
        return $.each(n, function (t, e) {
            a.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
        }), a.join("&")
    }

    function a(t, e) {
        "number" == typeof t && (t = new Date(t)), e || (e = "yyyy-MM-dd hh:mm:ss"), e = e.replace(/Y/g, "y").replace(/H/g, "h");
        var n = {
            "M+": t.getMonth() + 1,
            "d+": t.getDate(),
            "h+": t.getHours(),
            "m+": t.getMinutes(),
            "s+": t.getSeconds(),
            "q+": Math.floor((t.getMonth() + 3) / 3),
            S: t.getMilliseconds()
        };
        /(y+)/.test(e) && (e = e.replace(RegExp.$1, (t.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var a in n)new RegExp("(" + a + ")").test(e) && (e = e.replace(RegExp.$1, 1 == RegExp.$1.length ? n[a] : ("00" + n[a]).substr(("" + n[a]).length)));
        return e
    }

    function r(e, a) {
        "object" == typeof e ? (a = e, e = a.url) : a = a || {}, a.processData !== !1 && a.data && $.isPlainObject(a.data) && (a.data = n(a.data));
        var r = a.success, o = a.error;
        a.method;
        return a.success = function (e) {
            0 == e.code ? "function" == typeof r && r(e.body) : 1 == e.code ? t(null) : 26 == e.code ? $("#_expire_notice").show() : "function" == typeof o ? o(e) : e.msg && window.layer && window.layer.msg && layer.msg(e.msg)
        }, a.error = null, $.ajax(H + ("/" == e.charAt(0) ? e : "/" + e), a)
    }

    function o(t, e, n, a) {
        return "function" == typeof e && (a = n, n = e, e = null), e = e || {}, e._ = (new Date).getTime(), r(t, {
            method: "GET",
            data: e,
            success: n,
            error: a
        })
    }

    function i(t, e, n, a) {
        return "function" == typeof e && (a = n, n = e, e = null), r(t, {method: "POST", data: e, success: n, error: a})
    }

    function s(t) {
        x || o("/keep-alive", function () {
            "function" == typeof t && t(), x || (x = setInterval(function () {
                o("/keep-alive")
            }, 6e4))
        })
    }

    function l() {
        x && (clearInterval(x), x = null)
    }

    function c(t, e, n) {
        for (var a = 0; a < n.length && t > e;)a++, t /= e;
        return (t % 1 == 0 ? t : t.toFixed(2)) + n[a]
    }

    function u(t) {
        return c(t, 1024, ["B", "K", "M", "G"])
    }

    function f(t) {
        return c(t, 1024, ["B/s", "KB/s", "MB/s", "GB/s"])
    }

    function d(t, e) {
        return e ? "/p-" + t + "/" + e : "/" + t
    }

    function p() {
        $("#_loading_mask").show()
    }

    function h() {
        $("#_loading_mask").hide()
    }

    function v(t) {
        var e = new jsSHA("SHA-512", "TEXT");
        return e.update(t + "MAGIC"), e.getHash("HEX")
    }

    function m(t, e) {
        var n = {};
        return $.each($(t).serializeArray(), function (t, a) {
            var r = a.name, o = a.value;
            e !== !1 && (o = $.trim(o)), void 0 === n[r] ? n[r] = o : n[r] instanceof Array ? n[r].push(o) : (o = [n[r], o], n[r] = o)
        }), n
    }

    function g(t, e) {
        if (!t || !(t = $.trim(t)))return null;
        var n = e === !0 ? /^([0-9a-zA-Z_\-]+):\/\/[^\/]+(\/.*)?/i : /^(http|https):\/\/[^\/]+(\/.*)?/i, a = n.exec(t);
        return a ? (a[2] || (t += "/"), t) : null
    }

    function y(t, e) {
        var n = $("#_qr_container");
        n.length || (n = $('<div id="_qr_container"><p class="qr_title"></p><div class="qr_img"></div><p class="qr_url"></p>'), n.appendTo(document.body)), n.find(".qr_title").html(e);
        new QRCode(n.find(".qr_img").empty()[0], {
            text: t,
            width: 300,
            height: 300,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        layer.open({
            type: 1,
            title: "",
            closeBtn: 0,
            area: "400px",
            skin: "layui-layer-nobg",
            shadeClose: !0,
            content: n
        })
    }

    function w(t, e) {
        var n = 1;
        if (!e) {
            e = [];
            for (var a = 0; a < t.series.length; a++)e[a] = t.series[a].data
        }
        for (var r = 0, o = e || [], i = o.length; r < i; r++)for (var s = 0, l = o[r] || [],
                                                                       c = l.length; s < c; s++)n = l[s] > n ? l[s] : n;
        return n += 5 - n % 5, t.yAxis.splitNumber = 5, t.yAxis.max = n, t
    }

    function b(t, e) {
        function n() {
            c && clearTimeout(c), c = setTimeout(a, 50)
        }

        function a() {
            var t, n = $(document).scrollTop() + e;
            u.each(function () {
                var e = $(this), a = $(e.attr("href"));
                if (a.length) {
                    var r = a.position().top;
                    r <= n && r + a.height() > n && (t = e)
                }
            }), t && r(t)
        }

        function r(t) {
            !t || l && t[0] == l[0] || (t.addClass("active"), l && l.removeClass("active"), l = t)
        }

        function o(t) {
            if (t = $(t), t.length) {
                var a = $(t[0].hash);
                $(document).off("scroll", n), $("html, body").stop().animate({scrollTop: a.offset().top - e}, 300, "swing", function () {
                    r(t), setTimeout(function () {
                        $(document).on("scroll", n)
                    }, 10)
                })
            }
        }

        function i(t) {
            t.preventDefault(), o(this)
        }

        function s(t) {
            (t = !!t) != f && (f = t, $(document)[f ? "on" : "off"]("scroll", n), u[f ? "on" : "off"]("click", i))
        }

        var l, c, u = $(t).find('a[href^="#"]'), f = !1;
        return e = e || 2, {enable: s}
    }

    var x, H = "/cgi";
    !function () {
        function t(t, e) {
            var n = this;
            this.container = $(t), this.options = e;
            for (var a = $("<ul/>").addClass("tab-form"), r = 0; r < e.items.length; r++) {
                var o = e.items[r];
                $("<li/>").data({
                    target: o.target,
                    disabled: o.disabled,
                    name: o.name
                }).append($("<a/>").attr("href", "#" + o.name).text(o.label)).appendTo(a)
            }
            this.container.addClass("tabs").empty().append(a), this.container.delegate("li", "click", function () {
                n.select($(this).data("name"))
            })
        }

        t.prototype.select = function (t) {
            var e;
            if (this.container.find("li").each(function (n, a) {
                    if ($(a).data("name") == t)return e = a, !1
                }), e && this.current != e) {
                this.current && $($(this.current).data("pos", [$(document).scrollLeft(), $(document).scrollTop()]).removeClass("active").data("target")).hide(), $($(e).addClass("active").data("target")).show();
                var n = $(e).data("pos");
                n && $(document).scrollLeft(n[0]).scrollTop(n[1]), this.current = e, window.location.hash = t, "function" == typeof this.options.onShow && this.options.onShow.call(this, t)
            }
        }, $.fn.extend({
            tabs: function (e) {
                var n = location.hash;
                if (!n || n.length < 2) n = e.items[0].name; else {
                    var a = n.indexOf("?");
                    n = n.substring(1, a == -1 ? n.length : a)
                }
                var r = new t(this, e);
                return r.select(n), r
            }
        })
    }();
    var _ = {
        new: "ZIXUN",
        society: "SHEJIAO",
        o2o: "DIANSHANG",
        game: "\tYOUXI",
        direct: "ZHIBO",
        sport: "YUNDONG",
        go: "CHUXING",
        tour: "\tLVYOU",
        tool: "\tGONGJU",
        other: "OTHER"
    }, A = {install: "TRACK", channel: "CHANNEL", link: "WAKEUP"};
    $(function () {
        $(document.body).delegate(".common-tip", "click", function () {
            var t = $(this).attr("data-target");
            (t = t ? $(t).html() : $(this).find(".tip-content").html()) && layer.tips(t, this, {
                tips: [3, "#1bd1ab"],
                time: 0,
                area: "300px",
                shade: .01,
                shadeClose: !0
            })
        })
    }), $.extend(window, {
        formatSize: u,
        formatSpeed: f,
        formatDate: a,
        keepAlive: s,
        stopAlive: l,
        ajaxReq: r,
        ajaxGet: o,
        ajaxPost: i,
        params: function () {
            var t = {}, e = location.href, n = e.lastIndexOf("?"), a = e.lastIndexOf("#");
            e && n < e.length - 1 && n > -1 && (e = e.substring(n + 1, a > n ? a : e.length), e.split("&").forEach(function (e) {
                e = e.split("=");
                var n = e[0], a = e[1];
                if (void 0 === t[n]) t[n] = a; else {
                    var r = t[n];
                    r.length ? r[r.length] = a : t[n] = [r, a]
                }
            }));
            var r = /^\/p-([^\/]*)/.exec(location.pathname);
            if (r) {
                var o = r[1].split("-");
                o.length > 0 && (t.appId = o[0])
            }
            return t
        }(),
        login: t,
        formatHref: d,
        Type: _,
        ServiceType: A,
        serializeToString: n,
        serializeToArray: e,
        encrySHA: v,
        showLoading: p,
        hideLoading: h,
        serializeObject: m,
        normalizeUrl: g,
        showQRCode: y,
        resolveYSplit: w,
        setAjaxBaseUrl: function (t) {
            H = t
        },
        autoScroll: b,
        getUserInfo: function () {
            function t() {
                e = $.Deferred(), o("/account/userinfo", {appId: params.appId}, function (t) {
                    $(e.resolve(t))
                })
            }

            var e;
            return function (n, a) {
                !a && e || t(), "function" == typeof n && e.done(n)
            }
        }(),
        getAppInfo: function () {
            function t() {
                e = $.Deferred(), o("/appinfo/get", {appId: params.appId}, function (t) {
                    $(e.resolve(t))
                })
            }

            var e;
            return function (n, a) {
                !a && e || t(), e.done(n)
            }
        }()
    })
}();