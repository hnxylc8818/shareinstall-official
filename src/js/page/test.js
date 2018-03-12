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