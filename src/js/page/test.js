function DatePicker(e, a, r) {
  e = $(e), r = r || "所有";
  var t, s, n = moment("20160101", "YYYYMMDD"),
    i = moment(),
    c = {
      "所有": [n, i],
      "今天": [moment(), moment()],
      "昨天": [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "最近七天": [moment().subtract(6, "days"), moment()],
      "最近30天": [moment().subtract(29, "days"), moment()]
    },
    l = function (a, r, n) {
      t = a, s = r, e.find(".date-value").html("自由选取" == n ? t.format("YYYY/MM/DD") + " - " + s.format("YYYY/MM/DD") : n)
    };
  e.daterangepicker({
    opens: "left",
    ranges: c,
    startDate: c[r][0],
    endDate: c[r][1]
  }, function (e, r, t) {
    l(e, r, t), a()
  }), l(c[r][0], c[r][1], r), this.getRange = function () {
    var e = t.format("YYYY/MM/DD"),
      a = s.format("YYYY/MM/DD"),
      r = e == n.format("YYYY/MM/DD") && a == i.format("YYYY/MM/DD");
    return [r ? null : e, r ? null : a]
  }
}

function ValuePicker(e, a) {
  e = $(e);
  var r = {},
    t = {};
  e.find("[data-name]").each(function (e, a) {
    var a = $(a),
      s = a.attr("data-name");
    (r[s] || (r[s] = [])).push(a), a.is(".active") && (t[s] = a.attr("data-value"))
  }).click(function () {
    var e = $(this),
      s = e.attr("data-name"),
      n = e.attr("data-value");
    if (1 == r[s].length) e.toggleClass("active"), t[s] = e.is(".active") ? n : null;
    else {
      if (e.is("active")) return;
      t[s] = n;
      for (var i = 0; i < r[s].length; i++) r[s][i].removeClass("active");
      e.addClass("active")
    }
    a()
  }), this.getValues = function () {
    return $.extend({}, t)
  }
}

function nextPage(e) {
  e.pageNumber++, refreshPage(e)
}

function prevPage(e) {
  e.pageNumber--, refreshPage(e)
}

function refreshPage() {
  showLoading();
  var e = $("#search_form").find("input[name='search']").val(),
    a = datePicker.getRange(),
    r = $.extend({
      page: request.pageNumber,
      appId: params.appId,
      startTime: a[0],
      endTime: a[1],
      sortField: request.sortField,
      asc: request.asc,
      pageSize: 10,
      search: e
    }, valuePicker.getValues());
  ajaxGet("channel/stats/list", r, function (a) {
    request.pageNumber = a.pageNum, request.channels = {};
    for (var t = 0, s = a.rows.length; t < s; t++)
      a.rows[t].sCreateTime = a.rows[t].createTime ? formatDate(a.rows[t].createTime) : "", request.channels[a.rows[t].id] = a.rows[t];
    a.search = e
    a.pageSize = 10
    $("#channelContainer").html(compiler(a)).find("thead th[data-field] span").each(function (e, a) {
      (a = $(a)).parent().attr("data-field") == request.sortField ? a.addClass(request.asc ? "sort-asc" : "sort-desc").removeClass(request.asc ? "sort-desc" : "sort-asc") : a.removeClass("sort-asc sort-desc").addClass("sort-none")
    }), $("#stats_export").attr("href", "/cgi/channel/export?" + serializeToString(r)), hideLoading()
  }, function (e) {
    hideLoading(), layer.msg("查询失败" + (e.msg ? "：" + e.msg : ""))
  })
}

function removeChannel(e) {
  layer.confirm("渠道被删除后，分发出去的渠道链接将失效，确定要删除吗？", {
    btn: ["确定删除", "取消"]
  }, function () {
    ajaxPost("/channel/delete", {
      channelId: e,
      appId: params.appId
    }, function () {
      refreshPage(request), layer.msg("删除成功")
    })
  })
}

function showApkExport(e) {
  ajaxGet("channel/apk-export-url", {
    appId: params.appId,
    channelId: e
  }, function (e) {
    $("#win_apk_url").text(e.url).attr("href", e.url)
  }), layer.open({
    title: "导出android渠道包",
    type: 1,
    area: "600",
    content: $("#win_apk_export")
  })
}

function selectPage(e, a) {
  e.pageNumber = a, refreshPage(e)
}
var valuePicker = new ValuePicker("#stats_bar", refreshPage),
  datePicker = new DatePicker("#stats_bar .time", refreshPage),
  request = {
    pageNumber: 0,
    sortField: "createTime",
    asc: !1
  },
  compiler = Handlebars.compile($("#channelTmp").html());
$("#channelContainer").delegate("thead th[data-field]", "click", function (e) {
  $(e.target).is(".common-tip") || (request.sortField = $(this).attr("data-field"), request.asc = $(this).find("span").hasClass("sort-desc"), refreshPage(request))
}), refreshPage(request), $("#search_form").submit(function () {
  return request.pageNumber = 0, refreshPage(), !1
}), $("#search_button").click(function () {
  request.pageNumber = 0, refreshPage()
}), Handlebars.registerHelper("list", function (e, a) {
  var r = "<ul class='pagination'>";
  if (e.hasPrev ? r += '<li><a  onclick="prevPage(request)" href="javascript:;">&lt;</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>&lt;</a></li>", e.pageNum < 3)
    for (var t = 0; t < e.pageNum; t++) r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + t + ")'>" + (t + 1) + "</a></li>";
  else r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + (e.pageNum - 2) + ")'>" + (e.pageNum - 1) + "</a></li>", r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + (e.pageNum - 1) + ")'>" + e.pageNum + "</a></li>";
  if (r = r + "<li class=\"active\"><a href='javascript:;'>" + (e.pageNum + 1) + "</a></li>", e.pages - e.pageNum <= 3)
    for (var t = e.pageNum + 1; t < e.pages; t++) r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + t + ")'>" + (t + 1) + "</a></li>";
  else r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + (e.pageNum + 1) + ")'>" + (e.pageNum + 2) + "</a></li>", r = r + "<li><a href='javascript:;' onclick='selectPage(request, " + (e.pageNum + 2) + ")'>" + (e.pageNum + 3) + "</a></li>";
  return e.hasNext ? r += '<li><a onclick="nextPage(request)" href="javascript:;">&gt;</a></li>' : r += "<li><a disabled='disabled' href='javascript:;' class='disabled_pre'>&gt;</a></li>", r + "</ul>"
});
var shareChannel = function () {
  var e, a;
  return $("#share_password_change").click(function () {
      $("#share_password").prop("disabled", !1), $("#share_password_change").hide(), $("#share_password_submit").show()
    }), $("#share_password_submit").click(function () {
      var e = $("#share_password").val();
      e.length > 6 ? layer.tips("分享密码不能超过6位", $("#share_password"), {
        tipsMore: !0,
        tips: [2, "#ff3333"]
      }) : ajaxPost("/channel/change-share-password", {
        appId: params.appId,
        channelId: a,
        sharePassword: e
      }, function () {
        layer.msg("修改成功", {
          time: 1e3
        }, function () {
          $("#share_password").prop("disabled", !0), $("#share_password_change").show(), $("#share_password_submit").hide()
        })
      })
    }),
    function (r) {
      a = r, ajaxGet("/channel/get", {
        channelId: a,
        appId: params.appId
      }, function (a) {
        $("#share_channelCode").text(a.channelCode), $("#share_channelName").text(a.channelName), $("#share_url").text(a.shareUrl).attr("href", a.shareUrl), $("#share_password").val(a.sharePassword), e = layer.open({
          title: ["渠道数据分享", "font-size:18px;padding-left: 261px;"],
          type: 1,
          area: "630",
          content: $("#share_channel")
        }), $("#share_password").prop("disabled", !0), $("#share_password_change").show(), $("#share_password_submit").hide()
      })
    }
}()






function back() {
  window.location = "channel-list.html"
}

function checkboxChanged() {
  $("#zi_url")["false" == $(":checked[name='defaultLanding']").val() ? "show" : "hide"]()
}
getAppInfo(function (n) {
  $("#_code_appKey").text('"' + n.appKey + '"')
}), ajaxGet("/appinfo/banner", {
  appId: params.appId
}, function (n) {
  $("#app_tmp2").text(n.banner.scriptTag)
});
var channelId = params.channelId;
channelId ? ($("#_title").text("修改渠道"), ajaxGet("/channel/get", {
  channelId: channelId,
  appId: params.appId
}, function (n) {
  if (n) {
    var a = $("#channel_form");
    a.find(":input[name='channelCode']").val(n.channelCode).prop("disabled", !0).css({
      backgroundColor: "#ededed"
    }), a.find(":input[name='channelName']").val(n.channelName), a.find(":input[name='customURL']").val(n.customURL), a.find(":input[name='defaultLanding']").each(function (a, e) {
      $(e).prop("checked", "true" == $(e).val() == n.defaultLanding)
    }), checkboxChanged()
  } else;
})) : $("#_title").text("渠道管理-新增渠道"), $("#cancel_btn").click(back), $("#channel_form").submit(function () {
  var n = $(this),
    a = serializeObject(n),
    e = !1;
  return a.channelCode || n.find("input[name='channelCode']").prop("disabled") || (e = !0, layer.tips("必填", n.find("input[name='channelCode']"), {
    tipsMore: !0,
    tips: [2, "#ff3333"]
  })), a.channelName || (e = !0, layer.tips("必填", n.find("input[name='channelName']"), {
    tipsMore: !0,
    tips: [2, "#ff3333"]
  })), "false" != a.defaultLanding || (a.customURL = normalizeUrl(a.customURL)) || (e = !0, layer.tips("请填写合法的url，如：http://www.opeinstall.io/", n.find("input[name='customURL']"), {
    tipsMore: !0,
    tips: [2, "#ff3333"]
  })), e || (a.channelId = channelId, a.appId = params.appId, ajaxPost(channelId ? "/channel/update" : "/channel/add", $.param(a), function () {
    back()
  })), !1
}), $("#submit_btn").click(function () {
  $("#channel_form").submit()
}), $("input[name='defaultLanding']").change(checkboxChanged), $("#app_banner").click(function () {
  $("#app_banner").addClass("app_jicheng"), $("#app_tmp1").css("display", "none"), $("#app_tmp2").css("display", "block"), $("#app_jicheng").removeClass("app_jicheng")
}), $("#app_jicheng").click(function () {
  $("#app_jicheng").addClass("app_jicheng"), $("#app_tmp2").css("display", "none"), $("#app_banner").removeClass("app_jicheng"), $("#app_tmp1").css("display", "block")
}), getAppInfo(function (n) {
  $(".config_appKey").text('"' + n.appKey + '"')
})






var reloadChart = function () {
  function a(a, t, e) {
    a = $(a), e = e || "所有";
    var n, i, r = {
        "所有": [moment("20160101", "YYYYMMDD"), moment()],
        "今天": [moment(), moment()],
        "昨天": [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "最近七天": [moment().subtract(6, "days"), moment()],
        "最近30天": [moment().subtract(29, "days"), moment()]
      },
      o = function (t, e, r) {
        n = t.format("YYYY/MM/DD"), i = e.format("YYYY/MM/DD"), a.find(".date-value").html("自由选取" == r ? n + " - " + i : r)
      };
    a.daterangepicker({
      opens: "left",
      ranges: r,
      startDate: r[e][0],
      endDate: r[e][1]
    }, function (a, e, n) {
      o(a, e, n), t()
    }), o(r[e][0], r[e][1], e), this.getRange = function () {
      return [n, i]
    }
  }

  function t(a, t) {
    a = $(a);
    var e = {},
      n = {};
    a.find("[data-name]").each(function (a, t) {
      var t = $(t),
        i = t.attr("data-name");
      (e[i] || (e[i] = [])).push(t), t.is(".active") && (n[i] = t.attr("data-value"))
    }).click(function () {
      var a = $(this),
        i = a.attr("data-name"),
        r = a.attr("data-value");
      if (1 == e[i].length) a.toggleClass("active"), n[i] = a.is(".active") ? r : null;
      else {
        if (a.is("active")) return;
        n[i] = r;
        for (var o = 0; o < e[i].length; o++) e[i][o].removeClass("active");
        a.addClass("active")
      }
      t()
    }), this.getValues = function () {
      return $.extend({}, n)
    }
  }

  function e(e, n, i, r) {
    function o() {
      l && l.showLoading();
      var a = (new Date).getTime(),
        t = {
          appId: params.appId,
          channelId: params.channelId,
          startTime: s.getRange()[0],
          endTime: s.getRange()[1]
        };
      $.extend(t, c.getValues()), ajaxGet(n, t, function (e) {
        var n = {
            grid: {
              left: 55,
              right: 45,
              top: 40,
              bottom: 20
            }
          },
          r = 500 - ((new Date).getTime() - a);
        setTimeout(function () {
          i(l, e, n, t), l && l.hideLoading()
        }, r > 0 ? r : 0)
      })
    }
    if (e.length) {
      var l = r ? null : echarts.init(e.find(".mainContent")[0]),
        s = new a(e.find(".date-container"), function () {
          o()
        }),
        c = new t(e, function () {
          o()
        });
      o()
    }
  }

  function n(a, t, e) {
    var n = t.data,
      i = [],
      r = [];
    for (var o in n) i.push(o), r.push({
      name: o,
      type: "line",
      data: n[o],
      animationDuration: 1e3,
      animationDurationUpdate: 1e3,
      smooth: !0,
      symbol: "none"
    });
    $.extend(e, {
      tooltip: {
        trigger: "axis"
      },
      yAxis: {
        type: "value",
        min: 0,
        minInterval: 1,
        boundaryGap: "10%"
      },
      legend: {
        data: i
      },
      xAxis: {
        type: "category",
        boundaryGap: !0,
        data: t.time
      },
      series: r,
      color: ["#7Fadff", "#63f1ab", "#F88a87"]
    }), a.setOption(resolveYSplit(e))
  }

  function i(a, t, e) {
    var n = [],
      i = 0;
    for (var r in t) {
      var o = t[r] || 0;
      i += o, n.push({
        name: r,
        value: o,
        label: r
      })
    }
    for (var l = 0; l < n.length; l++) n[l].per = 0 == i ? 0 : 100 * n[l].value / i;
    n.sort(function (a, t) {
      return a.value == t.value ? 0 : a.value > t.value ? -1 : 1
    }), $.extend(e, {
      series: [{
        type: "pie",
        radius: [0, "50%"],
        center: ["50%", "55%"],
        animationDuration: 1e3,
        animationDurationUpdate: 1e3,
        data: n,
        labelLine: {
          normal: {
            length: 20,
            length2: 50
          },
          emphasis: {
            length: 50,
            length2: 20
          }
        },
        label: {
          emphasis: {
            formatter: function (a) {
              return "{a|" + a.data.label + "}{abg|}\n{hr|}\n  {b|" + a.data.value + "}  {per|" + a.data.per.toFixed(2) + "%}  "
            },
            backgroundColor: "#eee",
            borderColor: "#aaa",
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                fontSize: 16,
                align: "center"
              },
              hr: {
                borderColor: "#aaa",
                width: "100%",
                borderWidth: .5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: "#eee",
                backgroundColor: "#334455",
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        }
      }],
      color: ["#ff6f36", "#f6ca4a", "#b6a2de", "#2ec7c9", "#5ab1ef", "#ffb980", "#89c997", "#00bdf2", "#8d98b3", "#d87a80", "#dc69aa", "#95706d"]
    }), a.setOption(e)
  }
  return echarts.__init = echarts.init, echarts.init = function (a) {
      function t() {
        n.resize()
      }
      var e, n = echarts.__init(a);
      return $(window).resize(function () {
        e && clearTimeout(e), e = setTimeout(t, 10)
      }), n
    }, $.get("/js/china.json?v=76478b399f", function (a) {
      echarts.registerMap("china", a)
    }),
    function () {
      e($("#chart_total"), "/stats/app/total", function (a, t) {
        $("#chart_total .item[data-type]").each(function (a, e) {
          e = $(e);
          var n = e.attr("data-type"),
            i = 0,
            r = [{
              name: "Android",
              value: 0
            }, {
              name: "iOS",
              value: 0
            }];
          for (var o in t) {
            var l = t[o][n] || 0;
            i += l, l > 0 && (r["android" == o ? 0 : 1].value = l)
          }
          e.find(".head span").text(i);
          var s = echarts.init(e.find(".neirong")[0]),
            c = {
              tooltip: {
                trigger: "item",
                formatter: "{b} : {c} ({d}%)"
              },
              series: [{
                type: "pie",
                radius: [0, "40%"],
                labelLine: {
                  normal: {
                    length: 10,
                    length2: 10
                  }
                },
                data: r
              }],
              color: ["#7Fadff", "#63f1ab"]
            };
          s.setOption(c)
        })
      }, !0), e($("#chart_add_trend"), "/stats/app/growth", n), e($("#chart_active_trend"), "/stats/app/active", function (a, t, e) {
        a.clear(), n(a, t, e)
      }), e($("#chart_location"), "/stats/app/location", function (a, t, e, n) {
        var i = 0,
          r = [],
          o = {
            v: "访问量",
            i: "安装量",
            r: "注册量"
          }[n.event];
        for (var o in t.values) {
          var l = t.values[o],
            s = {
              name: o,
              value: l
            };
          i > l || (i = l), r.push(s)
        }
        if (r.sort(function (a, t) {
            return a.value > t.value ? -1 : a.value == t.value ? 0 : 1
          }), "1" == n.type) {
          var i, c = ["<p>top 10列表</p>"];
          r.length > 0 && (i = r[0].value);
          for (var d = 0; d < r.length; d++) d < 10 && c.push("<div><span>" + r[d].name + "</span> : <span>" + r[d].value + "</span></div><div class='cityNum'><div class='cityTxt' style='width:" + 1 * r[d].value / i * 100 + "%'></div></div>"), r[d] = function (a) {
            var e = t.cords[a.name];
            return e && (a.value = e.concat(a.value)), a
          }(r[d]);
          1 == c.length && (c = ['<img src="/images/none.png" alt="没有数据" style="width: 48px;height: 68px;position: absolute;top: 50%;left: 50%;margin-left: -34px;margin-top: -34px;">']), $("#chart_location .location_state").hide(), $("#chart_location .location_city").html(c.join("")).show(), $.extend(e, {
            tooltip: {
              trigger: "item",
              formatter: function (a) {
                return a.name + " : " + a.value[2]
              }
            },
            geo: {
              map: "china",
              label: {
                emphasis: {
                  show: !1
                }
              },
              itemStyle: {
                normal: {
                  areaColor: "#323c48",
                  borderColor: "#111"
                },
                emphasis: {
                  areaColor: "#2a333d"
                }
              }
            },
            series: [{
              name: o,
              type: "scatter",
              coordinateSystem: "geo",
              data: r,
              symbolSize: 12,
              label: {
                normal: {
                  show: !1
                },
                emphasis: {
                  show: !1
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: "#fff",
                  borderWidth: 1
                }
              }
            }]
          })
        } else {
          for (var c = [], d = 0; d < r.length; d++) c.push("<div><span>" + r[d].name + "</span> : <span>" + r[d].value + "</span></div>");
          $("#chart_location .location_city").hide(), $("#chart_location .location_state").html(c.join("")).show(), $.extend(e, {
            tooltip: {
              trigger: "item",
              formatter: function (a) {
                return a.name + " : " + a.value
              }
            },
            series: [{
              name: o,
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: !0
                },
                emphasis: {
                  show: !0
                }
              },
              data: r
            }]
          })
        }
        $.extend(e, {
          visualMap: {
            min: 0,
            max: i,
            left: "left",
            top: "bottom",
            text: ["高", "低"],
            calculable: !0,
            inRange: {
              color: ["#e9eeef", "#00bdf2"]
            }
          }
        }), a.setOption(e)
      }), e($("#chart_version"), "/stats/app/system-version", i), e($("#chart_brand"), "/stats/app/brand", i)
    }
}()


var reloadChart = function () {
  function a(a, t, e) {
    a = $(a), e = e || "所有";
    var n, i, r = {
        "所有": [moment("20160101", "YYYYMMDD"), moment()],
        "今天": [moment(), moment()],
        "昨天": [moment().subtract(1, "days"), moment().subtract(1, "days")],
        "最近七天": [moment().subtract(6, "days"), moment()],
        "最近30天": [moment().subtract(29, "days"), moment()]
      },
      o = function (t, e, r) {
        n = t.format("YYYY/MM/DD"), i = e.format("YYYY/MM/DD"), a.find(".date-value").html("自由选取" == r ? n + " - " + i : r)
      };
    a.daterangepicker({
      opens: "left",
      ranges: r,
      startDate: r[e][0],
      endDate: r[e][1]
    }, function (a, e, n) {
      o(a, e, n), t()
    }), o(r[e][0], r[e][1], e), this.getRange = function () {
      return [n, i]
    }
  }

  function t(a, t) {
    a = $(a);
    var e = {},
      n = {};
    a.find("[data-name]").each(function (a, t) {
      var t = $(t),
        i = t.attr("data-name");
      (e[i] || (e[i] = [])).push(t), t.is(".active") && (n[i] = t.attr("data-value"))
    }).click(function () {
      var a = $(this),
        i = a.attr("data-name"),
        r = a.attr("data-value");
      if (1 == e[i].length) a.toggleClass("active"), n[i] = a.is(".active") ? r : null;
      else {
        if (a.is("active")) return;
        n[i] = r;
        for (var o = 0; o < e[i].length; o++) e[i][o].removeClass("active");
        a.addClass("active")
      }
      t()
    }), this.getValues = function () {
      return $.extend({}, n)
    }
  }

  function e(e, n, i, r) {
    function o() {
      l && l.showLoading();
      var a = (new Date).getTime(),
        t = {
          appId: params.appId,
          channelId: params.channelId,
          startTime: s.getRange()[0],
          endTime: s.getRange()[1]
        };
      $.extend(t, c.getValues()), ajaxGet(n, t, function (e) {
        var n = {
            grid: {
              left: 55,
              right: 45,
              top: 40,
              bottom: 20
            }
          },
          r = 500 - ((new Date).getTime() - a);
        setTimeout(function () {
          i(l, e, n, t), l && l.hideLoading()
        }, r > 0 ? r : 0)
      })
    }
    if (e.length) {
      var l = r ? null : echarts.init(e.find(".mainContent")[0]),
        s = new a(e.find(".date-container"), function () {
          o()
        }),
        c = new t(e, function () {
          o()
        });
      o()
    }
  }

  function n(a, t, e) {
    var n = t.data,
      i = [],
      r = [];
    for (var o in n) i.push(o), r.push({
      name: o,
      type: "line",
      data: n[o],
      animationDuration: 1e3,
      animationDurationUpdate: 1e3,
      smooth: !0,
      symbol: "none"
    });
    $.extend(e, {
      tooltip: {
        trigger: "axis"
      },
      yAxis: {
        type: "value",
        min: 0,
        minInterval: 1,
        boundaryGap: "10%"
      },
      legend: {
        data: i
      },
      xAxis: {
        type: "category",
        boundaryGap: !0,
        data: t.time
      },
      series: r,
      color: ["#7Fadff", "#63f1ab", "#F88a87"]
    }), a.setOption(resolveYSplit(e))
  }

  function i(a, t, e) {
    var n = [],
      i = 0;
    for (var r in t) {
      var o = t[r] || 0;
      i += o, n.push({
        name: r,
        value: o,
        label: r
      })
    }
    for (var l = 0; l < n.length; l++) n[l].per = 0 == i ? 0 : 100 * n[l].value / i;
    n.sort(function (a, t) {
      return a.value == t.value ? 0 : a.value > t.value ? -1 : 1
    }), $.extend(e, {
      series: [{
        type: "pie",
        radius: [0, "50%"],
        center: ["50%", "55%"],
        animationDuration: 1e3,
        animationDurationUpdate: 1e3,
        data: n,
        labelLine: {
          normal: {
            length: 20,
            length2: 50
          },
          emphasis: {
            length: 50,
            length2: 20
          }
        },
        label: {
          emphasis: {
            formatter: function (a) {
              return "{a|" + a.data.label + "}{abg|}\n{hr|}\n  {b|" + a.data.value + "}  {per|" + a.data.per.toFixed(2) + "%}  "
            },
            backgroundColor: "#eee",
            borderColor: "#aaa",
            borderWidth: 1,
            borderRadius: 4,
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                fontSize: 16,
                align: "center"
              },
              hr: {
                borderColor: "#aaa",
                width: "100%",
                borderWidth: .5,
                height: 0
              },
              b: {
                fontSize: 16,
                lineHeight: 33
              },
              per: {
                color: "#eee",
                backgroundColor: "#334455",
                padding: [2, 4],
                borderRadius: 2
              }
            }
          }
        }
      }],
      color: ["#ff6f36", "#f6ca4a", "#b6a2de", "#2ec7c9", "#5ab1ef", "#ffb980", "#89c997", "#00bdf2", "#8d98b3", "#d87a80", "#dc69aa", "#95706d"]
    }), a.setOption(e)
  }
  return echarts.__init = echarts.init, echarts.init = function (a) {
      function t() {
        n.resize()
      }
      var e, n = echarts.__init(a);
      return $(window).resize(function () {
        e && clearTimeout(e), e = setTimeout(t, 10)
      }), n
    }, $.get("/js/china.json?v=76478b399f", function (a) {
      echarts.registerMap("china", a)
    }),
    function () {
      e($("#chart_total"), "/stats/app/total", function (a, t) {
        $("#chart_total .item[data-type]").each(function (a, e) {
          e = $(e);
          var n = e.attr("data-type"),
            i = 0,
            r = [{
              name: "Android",
              value: 0
            }, {
              name: "iOS",
              value: 0
            }];
          for (var o in t) {
            var l = t[o][n] || 0;
            i += l, l > 0 && (r["android" == o ? 0 : 1].value = l)
          }
          e.find(".head span").text(i);
          var s = echarts.init(e.find(".neirong")[0]),
            c = {
              tooltip: {
                trigger: "item",
                formatter: "{b} : {c} ({d}%)"
              },
              series: [{
                type: "pie",
                radius: [0, "40%"],
                labelLine: {
                  normal: {
                    length: 10,
                    length2: 10
                  }
                },
                data: r
              }],
              color: ["#7Fadff", "#63f1ab"]
            };
          s.setOption(c)
        })
      }, !0), e($("#chart_add_trend"), "/stats/app/growth", n), e($("#chart_active_trend"), "/stats/app/active", function (a, t, e) {
        a.clear(), n(a, t, e)
      }), e($("#chart_location"), "/stats/app/location", function (a, t, e, n) {
        var i = 0,
          r = [],
          o = {
            v: "访问量",
            i: "安装量",
            r: "注册量"
          }[n.event];
        for (var o in t.values) {
          var l = t.values[o],
            s = {
              name: o,
              value: l
            };
          i > l || (i = l), r.push(s)
        }
        if (r.sort(function (a, t) {
            return a.value > t.value ? -1 : a.value == t.value ? 0 : 1
          }), "1" == n.type) {
          var i, c = ["<p>top 10列表</p>"];
          r.length > 0 && (i = r[0].value);
          for (var d = 0; d < r.length; d++) d < 10 && c.push("<div><span>" + r[d].name + "</span> : <span>" + r[d].value + "</span></div><div class='cityNum'><div class='cityTxt' style='width:" + 1 * r[d].value / i * 100 + "%'></div></div>"), r[d] = function (a) {
            var e = t.cords[a.name];
            return e && (a.value = e.concat(a.value)), a
          }(r[d]);
          1 == c.length && (c = ['<img src="/images/none.png" alt="没有数据" style="width: 48px;height: 68px;position: absolute;top: 50%;left: 50%;margin-left: -34px;margin-top: -34px;">']), $("#chart_location .location_state").hide(), $("#chart_location .location_city").html(c.join("")).show(), $.extend(e, {
            tooltip: {
              trigger: "item",
              formatter: function (a) {
                return a.name + " : " + a.value[2]
              }
            },
            geo: {
              map: "china",
              label: {
                emphasis: {
                  show: !1
                }
              },
              itemStyle: {
                normal: {
                  areaColor: "#323c48",
                  borderColor: "#111"
                },
                emphasis: {
                  areaColor: "#2a333d"
                }
              }
            },
            series: [{
              name: o,
              type: "scatter",
              coordinateSystem: "geo",
              data: r,
              symbolSize: 12,
              label: {
                normal: {
                  show: !1
                },
                emphasis: {
                  show: !1
                }
              },
              itemStyle: {
                emphasis: {
                  borderColor: "#fff",
                  borderWidth: 1
                }
              }
            }]
          })
        } else {
          for (var c = [], d = 0; d < r.length; d++) c.push("<div><span>" + r[d].name + "</span> : <span>" + r[d].value + "</span></div>");
          $("#chart_location .location_city").hide(), $("#chart_location .location_state").html(c.join("")).show(), $.extend(e, {
            tooltip: {
              trigger: "item",
              formatter: function (a) {
                return a.name + " : " + a.value
              }
            },
            series: [{
              name: o,
              type: "map",
              mapType: "china",
              label: {
                normal: {
                  show: !0
                },
                emphasis: {
                  show: !0
                }
              },
              data: r
            }]
          })
        }
        $.extend(e, {
          visualMap: {
            min: 0,
            max: i,
            left: "left",
            top: "bottom",
            text: ["高", "低"],
            calculable: !0,
            inRange: {
              color: ["#e9eeef", "#00bdf2"]
            }
          }
        }), a.setOption(e)
      }), e($("#chart_version"), "/stats/app/system-version", i), e($("#chart_brand"), "/stats/app/brand", i)
    }
}()