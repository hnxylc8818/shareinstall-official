/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global echarts */
var DfttModule = (function (dm) {
  var Overview = {
    name: 'Overview',
    typed: null,
    channel: '',
    // baseUrl: 'http://123.59.85.60/datacenterapi/',
    baseUrl: 'http://tongji.021.com/datacenterapi/',
    init: function () {
      var _this = this;
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
      _this.getAppInfo()
      _this.getQidList()      
      _this.getAmountStatistics() // 获取总量统计数据
      _this.amountStatistics()
      _this.growthTrendStatistics()
      _this.increaseStatistics()
      // _this.ipTrend()
      // _this.getSystemVersion()
      // _this.getModel()
      _this.gotoLink()
      _this.valuePicker()
      _this.showQidForm()
    },

    // 获取url中的参数
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
      var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
      if (result != null) {
        return decodeURIComponent(result[2]);
      } else {
        return null;
      }
    },

    // 渲染页面appkey
    writeAppkey: function () {
      var appKey = $.cookie('appkey')
      if (appKey && appKey !== 'null') {
        $("#app_key").text(appKey)
      }
    },

    // 渲染应用icon
    drawAppicon: function () {
      var appIcon = $.cookie('img')
      if (appIcon && appIcon !== 'null') {
        $('#app_icon').attr('src', appIcon)
      }
    },

    // 渲染应用名称
    writeAppName: function () {
      var appName = $.cookie('appName')
      if (appName) {
        $('#app_name').text(appName)
      }
    },

    // 获取应用信息
    getAppInfo: function () {
      var _this = this;
      $.ajax({
        url:Tool.serverIP() + 'appliance/getone',
        data: {
          app_key: $.cookie('appkey')
        },
        type: 'POST',
        success: function (data) {
          var overTime = data.data.app_over_time.replace(/-/g, '/');
          var remainTime = parseInt(new Date(overTime) - new Date()) / 1000 / 60 / 60 / 24
          // console.log(remainTime)
          data.code = parseInt(data.code)
          if (data.code === 0) {
            if (data.data.status == 0) {
              _this.pageInit()
            } else if (remainTime <= 10 && data.data.status == 2) {
              _this.pageInit(remainTime)
            }
          }
        }
      })
    },

    pageInit: function (time) {
      var $dom = $('#paymentInfo')
      var hasClose = 0
      if (time) {
        $dom.find('.pop-status').text('还有' + Math.round(time) + '天服务将过期')
        hasClose = 1
      }
      if (hasClose && !$.cookie('warnshow' + $.cookie('appkey'))) {
        $.cookie('warnshow' + $.cookie('appkey'), 1, {
          expires: 1
        })
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      } else if (!hasClose) {
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      }
    },

    // 左侧链接跳转
    gotoLink: function () {
      var appKey = this.getQueryString('key')
      var appIcon = this.getQueryString('icon')
      $('#my-android').on('click', function () {
        window.location.href = './android.html?key=' + appKey + '&icon=' + appIcon
      })
    },

    // 请求封装
    ajaxGet: function (url, data, successCallback, errorCallback) {
      data.appkey = $.cookie('appkey') //'K6BKB62B7BHABH' // 
      // data.channel = ''
      $.ajax({
        type: 'get',
        url: this.baseUrl + url,
        data: data,
        dataType: 'jsonp',
        jsonp: 'callbackparam', // 服务端用于接收callback调用的function名的参数
        success: function (res) {
          successCallback(res)
        },
        error: function (res) {
          errorCallback(res)
        }
      });
    },

    // 获取渠道列表
    getQidList: function () {
      var _this = this;
      $.ajax({
        url: Tool.serverIP() + 'channel/getlist',
        data: {
          app_key: $.cookie('appkey'),
          username: $.cookie('userName'),
          token: $.cookie('_token'),
          page: 1,
          size: 1000,
          startDate: '20180328',
          endDate: '20180328',
          plantform: 'all',
          exclude: 0,
          sortname: 'createTime',
          sorttype: 'asc',
          search: {'channel_name': ''}
        },
        type: 'POST',
        async: false,
        success: function (data) {
          if (data.code == 0) {
            var datalist = data.data
            var _html = ''
            $.each(datalist, function (index, item) {
              _html += '<li>'
              _html += '<div class="fl w30">'
              if (index < 5) {
                _this.channel += item.channel_code + '|'
                _html += '<input type="checkbox" name="" id="" checked>'
              } else {
                _html += '<input type="checkbox" name="" id="">'
              }

              _html += '</div>'
              _html += '<div class="fl w30 qid-code">' + item.channel_code + '</div>'
              _html += '<div class="fl w30 qid-name">' + item.channel_name + '</div>'
              _html += '</li>'
            })

            $('.qidtable-list').html(_html)
            _this.channel = _this.channel.substr(0, _this.channel.length - 1)
          }
        }
      })
    },

    // 渠道列表弹框
    showQidForm: function () {
      var _this = this;
      var $pop = $('#selectQid')
      $('#select_btn').on('click', function () {
        layer.open({
          title: '选择要对比的渠道',
          type: 1,
          area: '800',
          content: $pop,
          closeBtn: 1,
          btn: ['确定', '取消'],
          yes: function (index) {
            var qidSelect = $('input:checked').parents('.w30').siblings('.qid-code');
            _this.channel = ''
            qidSelect.each(function (index, item) {
              _this.channel += $(item).text()
              if (index === qidSelect.length - 1) return
              _this.channel += '|'
            })
            layer.close(index)
            $('.data_profile .active').click()
          }
        })
      })

      $pop.on('change', 'input', function () {
        if ($('input:checked').length === 0) {
          $(this).prop('checked', true)
        }
        if ($('input:checked').length > 5) {
          $(this).prop('checked', false)
          layer.msg('最多可选择5个渠道')
        }
      })
    },

    // 采集页面数据
    valuePicker: function (ele) {
      var _this = this

      $('.date-container').on('click', function (e) {
        if (e.target.className !== 'date-value') {
          $(this).find('.date-value').click()
        }
        // alert('a')
      })
      $(document).on('click', '.overlay-btn', function () {
        var name = $(this).siblings('.time').find('.date-value')
        var timeRange = name.attr('date-value') ? name.attr('date-value').split(',') : 'undefined'
        var platform = 'all'
        var exclude = false
        var type = 0
        $(this).parents('.title').find('.data_profile li').each(function (index, item) {
          if ($(item).hasClass('active')) {
            platform = $(item).attr('data-value')
          }
        })

        $(this).parents('.title').siblings('.contentER, .btnBox').find('[data-name="type"]').each(function (index, item) {
          if ($(item).hasClass('active')) {
            type = $(item).attr('data-value')
          }
        })

        if ($(this).hasClass('active')) {
          $(this).removeClass('active').attr('data-value', 'false')
        } else {
          $(this).addClass('active').attr('data-value', 'true')
          exclude = true
        }
        _this.getAmountStatistics(timeRange, name, exclude, platform, type)
      })

      $(document).on('click', '.data_profile li', function () {
        var name = $(this).parents('.title').find('.date-value')
        var timeRange = name.attr('date-value') ? name.attr('date-value').split(',') : 'undefined'
        var platform = $(this).attr('data-value')
        var exclude = $(this).parents('.title').find('.overlay-btn').attr('data-value')
        var type = 0

        $(this).parents('.title').siblings('.contentER, .btnBox').find('[data-name="type"]').each(function (index, item) {
          if ($(item).hasClass('active')) {
            type = $(item).attr('data-value')
          }
        })

        $(this).addClass('active').siblings('li').removeClass('active')
        _this.getAmountStatistics(timeRange, name, exclude, platform, type)
      })

      $(document).on('click', '[data-name="type"]', function () {
        var name = $(this).parents('.btnBox, .contentER').siblings('.title').find('.date-value')
        var timeRange = name.attr('date-value') ? name.attr('date-value').split(',') : 'undefined'
        var platform = 'all'
        var type = $(this).attr('data-value')
        var exclude = $(this).parents('.btnBox, .contentER').siblings('.title').find('.overlay-btn').attr('data-value')

        $(this).parents('.btnBox').siblings('.title').find('.data_profile li').each(function (index, item) {
          if ($(item).hasClass('active')) {
            platform = $(item).attr('data-value')
          }
        })

        $(this).addClass('active').siblings().removeClass('active')
        _this.getAmountStatistics(timeRange, name, exclude, platform, type)
      })
    },

    /***
     * 初始化日历插件
     */
    initTime: function (name, tag) {
      var _this = this
      var opt = {
        // startDate: moment().startOf('day'),
        //endDate: moment(),
        //minDate: '01/01/2012',    //最小时间
        maxDate: moment(), //最大时间
        dateLimit: {
          days: 30
        }, //起止时间的最大间隔
        showDropdowns: false,
        showWeekNumbers: false, //是否显示第几周
        timePicker: false, //是否显示小时和分钟
        timePickerIncrement: 60, //时间的增量，单位为分钟
        timePicker12Hour: false, //是否使用12小时制来显示时间
        ranges: {
          '所有': [moment("20160101", "YYYYMMDD"), moment()],
          '今日': [moment().startOf('day'), moment()],
          '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
          '最近7日': [moment().subtract('days', 6), moment()],
          '最近30日': [moment().subtract('days', 29), moment()]
        },
        opens: 'left', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
        format: 'YYYY/MM/DD', //控件中from和to 显示的日期格式
        separator: ' to ',
        locale: {
          applyLabel: '确定',
          cancelLabel: '取消',
          fromLabel: '起始时间',
          toLabel: '结束时间',
          customRangeLabel: '自定义',
          daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
          monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
          ],
          firstDay: 1
        }
      }
      // if (tag) {
      //   var label = label ? label : '最近七日'
      //   opt.startDate = moment().subtract('days', 6)
      //   opt.endDate = moment()
      // } else {
      //   var label = label ? label : '今日'
      // }
      var label = label ? label : '今日'
      name.html(label)
      name.daterangepicker(opt, function (start, end, label) { //格式化日期显示框
        //name.html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
        var label = (label == '自定义' ? start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD') : label)
        name.html(label)
        var timeRangeChange = [start.format('YYYYMMDD'), end.format('YYYYMMDD')]
        name.attr('date-value', timeRangeChange)
        var exclude = name.parents('time').siblings('overlay-btn').attr('data-value')
        var platform = 'all'
        name.parents('.title').find('.data_profile li').each(function (index, item) {
          if ($(item).hasClass('active')) {
            platform = $(item).attr('data-value')
          }
        })

        var type = 0

        name.parents('.title').siblings('.contentER, .btnBox').find('[data-name="type"]').each(function (index, item) {
          if ($(item).hasClass('active')) {
            type = $(item).attr('data-value')
          }
        })
        _this.getAmountStatistics(timeRangeChange, name, exclude, platform, type)
      });
    },

    /***
     * 初始化柱状图
     */
    initEchartsBar: function (id, name, data) {
      // console.log(data)
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        yAxis: {
          type: 'value',
          min: 0,
          minInterval: 1,
          boundaryGap: '10%'
        },
        legend: {
          data: name
        },
        xAxis: {
          type: 'category',
          boundaryGap: !0,
          data: ['访问量', '安装量', '注册量']
        },
        series: data
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.addEventListener('resize', function () {
        setTimeout(function () {
          myChart.resize();
        }, 500)
      });
    },
    /***
     * 初始化饼图
     */
    initEchartsPie: function (id, name, data) {
      var myChart = echarts.init(document.getElementById(id));
      // 指定图表的配置项和数据
      var option = {
        backgroundColor: '#fff',
        title: {
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        calculable: true,
        series: [{
            name: name,
            type: 'pie',
            radius: [20, 50],
            color: ['#00a3fe', '#45dbda'],
            center: ['50%', '50%'],
            label: {
              normal: {
                show: true,

              },
              emphasis: {
                show: true,
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 2,
                borderColor: '#fff',
                label: {
                  show: false,
                },
                labelLine: {
                  show: true,
                  length: 0.001,
                }
              }
            },

            data: data
          },

        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.addEventListener('resize', function () {
        setTimeout(function () {
          myChart.resize();
        }, 500)
      });
    },
    /**
     * 初始化折线图
     */
    initEchartsCategory: function (id, dataTypeX, legendData, data) {
      // console.log(data)
      var myChart = echarts.init(document.getElementById(id));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: dataTypeX
        }],
        yAxis: [{
          type: 'value'
        }],
        series: data
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.addEventListener('resize', function () {
        setTimeout(function () {
          myChart.resize();
        }, 500)
      });
    },

    /**
     * 初始化折线图
     */
    initEchartsCategoryActive: function (id, dataTypeX, legendData, value, type) {
      var myChart = echarts.init(document.getElementById(id));
      console.log(dataTypeX)
      var option
      option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: dataTypeX
        }],
        yAxis: [{
          type: 'value'
        }],
        series: value
      };
      // 指定图表的配置项和数据
      // if (type == 0 || !type || type == 00) {
      //   option = {
      //     tooltip: {
      //       trigger: 'axis'
      //     },
      //     legend: {
      //       data: legendData
      //     },
      //     calculable: true,
      //     xAxis: [{
      //       type: 'category',
      //       boundaryGap: false,
      //       data: dataTypeX
      //     }],
      //     yAxis: [{
      //       type: 'value'
      //     }],
      //     series: value
      //   };
      // } else if (type == 1) {
      //   option = {
      //     tooltip: {
      //       trigger: 'axis'
      //     },
      //     legend: {
      //       data: [{
      //         name: '活跃设备数',
      //         icon: 'bar'
      //       }]
      //     },
      //     calculable: true,
      //     xAxis: [{
      //       type: 'category',
      //       boundaryGap: false,
      //       data: dataTypeX
      //     }],
      //     yAxis: [{
      //       type: 'value'
      //     }],
      //     series: [{
      //       name: '平均打开次数',
      //       type: 'line',
      //       smooth: true,
      //       itemStyle: {
      //         normal: {
      //           areaStyle: {
      //             color: "#62c1fb"
      //           },
      //           color: "#62c1fb",
      //           borderColor: "#62c1fb"
      //         }
      //       },
      //       lineStyle: {
      //         normal: {
      //           color: "#62c1fb" //连线颜色
      //         }
      //       },
      //       data: value.actRate
      //     }],
      //     color: ["#4ad8dc"]
      //   };
      // } else if (type == 2) {
      //   option = {
      //     tooltip: {
      //       trigger: 'axis'
      //     },
      //     legend: {
      //       data: [{
      //         name: '平均在线时长',
      //         icon: 'bar'
      //       }]
      //     },
      //     calculable: true,
      //     xAxis: [{
      //       type: 'category',
      //       boundaryGap: false,
      //       data: dataTypeX
      //     }],
      //     yAxis: [{
      //       type: 'value'
      //     }],
      //     series: [{
      //       name: '平均在线时长',
      //       type: 'line',
      //       smooth: true,
      //       itemStyle: {
      //         normal: {
      //           areaStyle: {
      //             color: "#62c1fb"
      //           },
      //           color: "#62c1fb",
      //           borderColor: "#62c1fb"
      //         }
      //       },
      //       lineStyle: {
      //         normal: {
      //           color: "#62c1fb" //连线颜色
      //         }
      //       },
      //       data: value.actTime
      //     }],
      //     color: ["#4ad8dc"]
      //   };
      // }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.addEventListener('resize', function () {
        setTimeout(function () {
          myChart.resize();
        }, 500)
      });
    },
    /**
     * 安装量统计饼图数据
     */
    initEchartsInstallRegister: function (date, exclude, platform) {
      var channel = this.channel
      var channelList = channel.split('|')
      // console.log(channelList)
      var _this = this
      var obj = {
        'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform,
        'channel': channel
      }
      var idTotal = 'J_total',
        dataTotal = []
      for (var ii = 0; ii < channelList.length; ii++) {
        dataTotal.push({
          name: channelList[ii],
          type: 'bar',
          data: [0, 0, 0],
          barWidth: 20
        })
      }
      this.ajaxGet('shareinstallgatherdata/shareinstallqidmanager', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist

        // console.log(data)

        $.each(data, function (index, item) {
          if (item) {
            // console.log(item)
            $.each(channelList, function (chaIndex, chaItem) {
              if (item.channel === chaItem) {
                dataTotal[chaIndex]['data'][0] = item.visit_cnt
                dataTotal[chaIndex]['data'][1] = item.install_cnt
                dataTotal[chaIndex]['data'][2] = item.register_cnt
              }
            })
          }
        })

        _this.initEchartsBar(idTotal, channelList, dataTotal)
      })
    },
    /***
     * 增长趋势数据
     */
    growthTrend: function (date, exclude, platform, type) {
      var _this = this
      var id = 'J_trend'
      var channel = _this.channel
      var channelList = channel.split('|')
      var obj = {
        'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform,
        'channel': channel
      }
      var dataStyle = {}
      var dataTypeX = []
      var dataInstallGrowth = []
      var dataRegisterGrowth = []
      var dataVisitGrowth = []
      var dataInstall = []
      var dataRegister = []
      var dataVisit = []
      for (var ii = 0; ii < channelList.length; ii++) {
        dataStyle[channelList[ii]] = []
      }

      this.ajaxGet('shareinstallgatherdata/shareinstallqidgrow', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist.reverse()
        // console.log(data)
        if (data.length > 0) {
          $.each(data, function (index, item) {
            if (dataStyle[item.channel]) {
              // console.log(item.channel)
              dataStyle[item.channel].push(item) // 渠道分类
            }
            if (date[0] === date[1]) {
              if (dataTypeX.indexOf(item.hh) < 0) {
                dataTypeX.push(item.hh)
              }
            } else {
              if (dataTypeX.indexOf(item.dt) < 0) {
                dataTypeX.push(item.dt)
              }
            }
          })

          for (var jj = 0; jj < channelList.length; jj++) {
            // console.log(dataStyle[channelList[jj]])
            dataInstall[jj] = []
            dataRegister[jj] = []
            dataVisit[jj] = []
            for (var kk = 0; kk < dataStyle[channelList[jj]].length; kk++) {
              dataInstall[jj].push(dataStyle[channelList[jj]][kk]['install_cnt'])
              dataRegister[jj].push(dataStyle[channelList[jj]][kk]['register_cnt'])
              dataVisit[jj].push(dataStyle[channelList[jj]][kk]['visit_cnt'])
            }
            dataInstallGrowth.push({
              name: channelList[jj],
              type: 'line',
              data: dataInstall[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
            dataRegisterGrowth.push({
              name: channelList[jj],
              type: 'line',
              data: dataRegister[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
            dataVisitGrowth.push({
              name: channelList[jj],
              type: 'line',
              data: dataVisit[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
          }
        } else {
          return
        }

        // dataTypeX = dataTypeX.reverse()

        if (type == 1) {
          _this.initEchartsCategory(id, dataTypeX, channelList, dataInstallGrowth)
        } else if (type == 2) {
          _this.initEchartsCategory(id, dataTypeX, channelList, dataRegisterGrowth)
        } else {
          _this.initEchartsCategory(id, dataTypeX, channelList, dataVisitGrowth)
        }
      })
    },
    /**
     * 初始化总量统计
     */
    amountStatistics: function () {
      var _this = this
      var $name = $('#total')
      _this.initTime($name)
    },
    /***
     * 获取总量统计
     */
    getAmountStatistics: function (number, name, exclude, platform, type) {
      // console.log('name--', name, 'exclude', exclude)
      var _this = this
      if (number == undefined || number == 'undefined') {
        var newNumber = [
          new Date().getFullYear() + '' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '' + (new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()),
          new Date().getFullYear() + '' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '' + (new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate())
        ]
        number = newNumber
      }
      if (exclude == undefined) {
        exclude = false
      }
      // console.log(number)
      if (name == undefined) { // 初始化
        _this.initEchartsInstallRegister(number, exclude, platform)
        _this.growthTrend(number, exclude, platform, type)
        _this.increaseTrend(number, exclude, platform, type)
        // _this.increaseTrend([moment().subtract('days', 6).format('YYYYMMDD'), moment().format('YYYYMMDD')], exclude, platform, type)
        // _this.ipTrend(number, exclude, platform, type)
        // _this.getSystemVersion(number, exclude, platform, type)
        // _this.getModel(number, exclude, platform, type)
      } else {
        var id = name.attr("id")
        if (id == "total") { // 总量统计
          _this.initEchartsInstallRegister(number, exclude, platform) //总量统计安装量
          // _this.initEchartsRegister() //总量统计注册量
        } else if (id == "trend") { //增长趋势
          // console.log('增长趋势')
          _this.growthTrend(number, exclude, platform, type) //折线图
        } else if (id == 'increase') { //活跃趋势
          // console.log('活跃趋势')
          _this.increaseTrend(number, exclude, platform, type) //折线图
        }
      }

    },
    /****
     *  获取增长数据数据
     */
    growthTrendStatistics: function () {
      var _this = this
      var $name = $("#trend")
      _this.initTime($name)
    },
    /***
     * 活跃趋势
     */
    increaseStatistics: function () {
      var _this = this
      var $name = $("#increase")
      _this.initTime($name, true)
    },
    /***
     *  获取活跃趋势数据
     */
    increaseTrend: function (date, exclude, platform, type) {
      // console.log(date)
      var _this = this
      var id = 'J_increase'

      var channel = _this.channel
      var channelList = channel.split('|')

      var obj = {
        'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        // 'exclude': exclude,
        'platform': platform,
        'type': type === '00' ? '0' : type,
        'channel': channel
      }

      var dataChart
      var dataStyle = {}
      var dataTypeX = []
      var dataDeviceActive = []
      var dataUserActive = []
      var dataRateActive = []
      var dataTimeActive = []
      var dataDevice = []
      var dataUser = []
      var dataRate = []
      var dataTime = []
      for (var ii = 0; ii < channelList.length; ii++) {
        dataStyle[channelList[ii]] = []
      }

      this.ajaxGet('shareinstallgatherdata/shareinstallqidactive', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist.reverse()
        if (data.length > 0) {
          $.each(data, function (index, item) {
            if (dataStyle[item.channel]) {
              // console.log(item.channel)
              dataStyle[item.channel].push(item) // 渠道分类
            }
            if (type === '1' || type === '2') {
              if (dataTypeX.indexOf(item.dt) < 0) {
                dataTypeX.push(item.dt)
              }
            } else if (date[0] === date[1]) {
              if (dataTypeX.indexOf(item.hh) < 0) {
                dataTypeX.push(item.hh)
              }
            } else {
              if (dataTypeX.indexOf(item.dt) < 0) {
                dataTypeX.push(item.dt)
              }
            }
          })

          for (var jj = 0; jj < channelList.length; jj++) {
            // console.log(dataStyle[channelList[jj]])
            dataDevice[jj] = []
            dataUser[jj] = []
            dataRate[jj] = []
            dataTime[jj] = []
            for (var kk = 0; kk < dataStyle[channelList[jj]].length; kk++) {
              dataDevice[jj].push(dataStyle[channelList[jj]][kk]['act_cnt'])
              dataUser[jj].push(dataStyle[channelList[jj]][kk]['register_act'])
              dataRate[jj].push(dataStyle[channelList[jj]][kk]['act_rate'])
              dataTime[jj].push(dataStyle[channelList[jj]][kk]['act_time'])
            }
            dataDeviceActive.push({
              name: channelList[jj],
              type: 'line',
              data: dataDevice[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
            dataUserActive.push({
              name: channelList[jj],
              type: 'line',
              data: dataUser[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
            dataRateActive.push({
              name: channelList[jj],
              type: 'line',
              data: dataRate[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
            dataTimeActive.push({
              name: channelList[jj],
              type: 'line',
              data: dataTime[jj],
              animationDuration: 1e3,
              animationDurationUpdate: 1e3,
              smooth: !0,
              symbol: 'none'
            })
          }
        } else {
          return
        }

        if (type === '00') {
          dataChart = dataUserActive
        } else if (type === '1') {
          dataChart = dataRateActive
        } else if (type === '2') {
          dataChart = dataTimeActive
        } else {
          dataChart = dataDeviceActive
        }

        console.log(dataTimeActive)

        _this.initEchartsCategoryActive(id, dataTypeX, channelList, dataChart, type)
      })
    },
    /***
     * 系统版本获取数据
     */
    getSystemVersion: function (date, exclude, platform, type) {
      var _this = this
      var id = 'J_systemVersion'

      var obj = {
        'startDate': moment().subtract('days', 1).startOf('day').format('YYYYMMDD'),
        'endDate': moment().subtract('days', 1).endOf('day').format('YYYYMMDD'),
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform || 'android'
      }

      var osData = []

      this.ajaxGet('shareinstallgatherdata/shareinstallsysvergather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist
        // console.log(data)
        if (data.length > 0) {
          $('.none-sysver').hide()
          $.each(data, function (index, item) {
            // console.log(item)
            item.name = item.osver
            item.value = parseInt(item.cnt)
            osData.push(item)
          })
        } else {
          $('.none-sysver').show()
        }
        _this.SystemVersionPie(id, osData)
        // _this.initEchartsCategoryActive(id, dataTypeX, value, type)
      })

      // var data = [{
      //     value: 335,
      //     name: '5.5.5'
      //   },
      //   {
      //     value: 310,
      //     name: '6.0.0'
      //   },
      //   {
      //     value: 234,
      //     name: '7.0.1'
      //   },
      //   {
      //     value: 135,
      //     name: '7.1.1'
      //   }
      // ]
      // _this.SystemVersionPie(id, data)
    },
    /***
     * 品牌机型获取数据
     */
    getModel: function (date, exclude, platform, type) {
      var _this = this
      var id = 'J_getModel'
      var obj = {
        'startDate': moment().subtract('days', 1).startOf('day').format('YYYYMMDD'),
        'endDate': moment().subtract('days', 1).endOf('day').format('YYYYMMDD'),
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform || 'android'
      }

      var osData = []

      this.ajaxGet('shareinstallgatherdata/shareinstallbranddevicegather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist
        // console.log(data)
        if (data.length > 0) {
          $('.none-device').hide()
          $.each(data, function (index, item) {
            // console.log(item)
            item.name = item.device
            item.value = parseInt(item.cnt)
            osData.push(item)
          })
        } else {
          $('.none-device').show()
        }
        _this.SystemVersionPie(id, osData, 1)
        // _this.initEchartsCategoryActive(id, dataTypeX, value, type)
      })
      // var data = [{
      //     value: 335,
      //     name: '5.5.5'
      //   },
      //   {
      //     value: 310,
      //     name: '6.0.0'
      //   },
      //   {
      //     value: 234,
      //     name: '7.0.1'
      //   },
      //   {
      //     value: 135,
      //     name: '7.1.1'
      //   }
      // ]
      // _this.SystemVersionPie(id, osData)
    },
    /***
     * 系统版本/品牌机型饼图
     */
    SystemVersionPie: function (id, data, opt) {
      // console.log(data)
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
          name: '系统版本',
          type: 'pie',
          radius: ['40%', '80%'],
          color: ['#ff6484', '#00a3fe', '#4cc0c0', '#ffb957'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          label: {
            normal: {
              show: true,

            },
            emphasis: {
              show: true,
            }
          },
          data: data
        }]
      };

      if (opt === 1) {
        option.series[0].name = '品牌/机型:'
      }

      myChart.setOption(option);

      window.addEventListener('resize', function () {
        setTimeout(function () {
          myChart.resize();
        }, 500)
      });
    }
  };
  // 给模块单独定义一个命名空间
  dm[Overview.name] = Overview
  return dm
})(DfttModule || {}) // eslint-disable-line