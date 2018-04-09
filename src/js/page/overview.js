/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global echarts */
var DfttModule = (function (dm) {
  var Overview = {
    name: 'Overview',
    typed: null,
    // baseUrl: 'http://123.59.85.60/datacenterapi/',
    baseUrl: 'http://tongji.021.com/datacenterapi/',
    init: function () {
      var _this = this;
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
      _this.getAppInfo()
      _this.getAmountStatistics() // 获取总量统计数据
      _this.amountStatistics()
      _this.growthTrendStatistics()
      _this.increaseStatistics()
      // _this.ipTrend()
      // _this.getSystemVersion()
      // _this.getModel()
      _this.gotoLink()
      _this.valuePicker()
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
        url: 'http://api.shareinstall.com/appliance/getone',
        data: {
          app_key: $.cookie('appkey')
        },
        type: 'POST',
        success: function (data) {
          var overTime = data.data.app_over_time.replace(/-/g, '/');
          var remainTime = parseInt(new Date(overTime) - new Date()) / 1000 / 60 / 60 / 24
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
      data.appkey = $.cookie('appkey') //'AKBKB62BF2F7RF'//'K6BKB62B7BHABH' // 
      data.channel = ''
      $.ajax({
        type: 'get',
        url: this.baseUrl + url,
        data: data,
        dataType: 'jsonp',
        jsonp: 'callbackparam', // 服务端用于接收callback调用的function名的参数
        success: function(res) {
          successCallback(res)
        },
        error: function (res) {
          errorCallback(res)
        }
      });
    },

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
      if (tag) {
        var label = label ? label : '最近七日'
        opt.startDate = moment().subtract('days', 6)
        opt.endDate = moment()
        name.attr('date-value', [moment().subtract('days', 6).format('YYYYMMDD'), moment().format('YYYYMMDD')])
      } else {
        var label = label ? label : '今日'
      }
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
          formatter: "{a} <br/>{b} : {c} ({d}%)"
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
    initEchartsCategory: function (id, dataTypeX, install, register) {
      var myChart = echarts.init(document.getElementById(id));
      // 指定图表的配置项和数据
      var option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [{
              name: '安装量',
              icon: 'bar'
            },
            {
              name: '注册量',
              icon: 'bar'
            },
            '安装量', '注册量'
          ]
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
        series: [{
            name: '安装量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  color: "#62c1fb"
                },
                color: "#62c1fb",
                borderColor: "#62c1fb"
              }
            },
            lineStyle: {
              normal: {
                color: "#62c1fb" //连线颜色
              }
            },
            data: install
          },
          {
            name: '注册量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                areaStyle: {
                  color: "#21e8ee"
                }
              }
            },
            lineStyle: {
              normal: {
                width: 3, //连线粗细
                color: "#21e8ee" //连线颜色
              }
            },
            data: register
          }
        ],
        color: ["#4ad8dc", "#2492e7"]
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
    initEchartsCategoryActive: function (id, dataTypeX, value, type) {
      var myChart = echarts.init(document.getElementById(id));
      var option
      // 指定图表的配置项和数据
      if (type == 0 || !type) {
        option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
                name: '活跃设备数',
                icon: 'bar'
              },
              {
                name: '活跃用户数',
                icon: 'bar'
              },
              '活跃设备数', '活跃用户数'
            ]
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
          series: [{
              name: '活跃设备数',
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    color: "#62c1fb"
                  },
                  color: "#62c1fb",
                  borderColor: "#62c1fb"
                }
              },
              lineStyle: {
                normal: {
                  color: "#62c1fb" //连线颜色
                }
              },
              data: value.actUv
            },
            {
              name: '活跃用户数',
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    color: "#21e8ee"
                  }
                }
              },
              lineStyle: {
                normal: {
                  width: 3, //连线粗细
                  color: "#21e8ee" //连线颜色
                }
              },
              data: value.registerAct
            }
          ],
          color: ["#4ad8dc", "#2492e7"]
        };
      } else if (type == 1) {
        option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
                name: '平均打开次数',
                icon: 'bar'
              }
            ]
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
          series: [{
              name: '平均打开次数',
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    color: "#62c1fb"
                  },
                  color: "#62c1fb",
                  borderColor: "#62c1fb"
                }
              },
              lineStyle: {
                normal: {
                  color: "#62c1fb" //连线颜色
                }
              },
              data: value.actRate
            }
          ],
          color: ["#4ad8dc"]
        };
      } else if (type == 2) {
        option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
                name: '平均在线时长',
                icon: 'bar'
              }
            ]
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
          series: [{
              name: '平均在线时长',
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  areaStyle: {
                    color: "#62c1fb"
                  },
                  color: "#62c1fb",
                  borderColor: "#62c1fb"
                }
              },
              lineStyle: {
                normal: {
                  color: "#62c1fb" //连线颜色
                }
              },
              data: value.actTime
            }
          ],
          color: ["#4ad8dc"]
        };
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
     * 初始化中国地图
     */
    initEchartsMap: function (id, data, type) {
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        title: {
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          show: true,
          formatter: function (params) {
            var value = params.data.value ? params.data.value : 0
            var res = params.data.name + ':' + value
            return res
          },
          backgroundColor: '#000'
        },
        dataRange: {
          min: 0,
          max: 2500,
          x: 'left',
          y: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true
        },

        roamController: {
          show: true,
          x: 'right',
          mapTypeControl: {
            'china': true
          }
        },
        series: [{
            name: 'ip',
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle: {
              normal: {
                label: {
                  show: false

                },
                textStyle: {
                  backgroundColor: "#000"
                }
              },
              emphasis: {
                areaStyle: {
                  color: '#000',
                  backgroundColor: 'blue',
                },
                label: {
                  show: true,
                  color: '#000',
                  textStyle: {
                    // fontWeight:'bold',
                  }
                }
              }
            },

            data: data
          },

        ]
      };

      if (type == 1) {
        option.tooltip.show = false
      }


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
    initEchartsInstallRegister: function (date, exclude) {
      var _this = this
      var obj = {'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': 'all'
      }
      this.ajaxGet('shareinstallgatherdata/shareinstallgather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist[0]
        var registerTotal = 0,
          installTotal = 0,
          registerIos = 0,
          registerAndroid = 0,
          installIos = 0,
          installAndroid = 0,
          idInstall = 'J_install',
          nameInstall = '安装量',
          nameRegister = '注册量',
          idRegister = 'J_register'

        if (data) {
          registerTotal = data.register_total
          installTotal = data.install_total
          registerIos = data.register_ios
          installIos = data.install_ios
          registerAndroid = data.register_android
          installAndroid = data.install_android
        }

        $('.register').html(registerTotal)
        $('.install').html(installTotal)

        var dataInstall = [{
          value: installIos,
          name: 'ios'
        },
        {
          value: installAndroid,
          name: 'Android'
        }]

        var dataRegister = [{
          value: registerIos,
          name: 'ios'
        },
        {
          value: registerAndroid,
          name: 'Android'
        }]
        _this.initEchartsPie(idInstall, nameInstall, dataInstall)
        _this.initEchartsPie(idRegister, nameRegister, dataRegister)
      })
    },
    /**
     *注册量统计饼图数据
     */
    // initEchartsRegister: function () {
    //   var _this = this
    //   $(".register").html('15')
    //   $(".install").html('15')
    //   var id = "J_register"
    //   var name = '注册量'
    //   var data = [{
    //       value: 10,
    //       name: 'ios'
    //     },
    //     {
    //       value: 5,
    //       name: 'Android'
    //     }
    //   ]
    //   _this.initEchartsPie(id, name, data)
    // },
    /***
     * 增长趋势数据
     */
    growthTrend: function (date, exclude, platform) {
      var _this = this
      var id = 'J_trend'
      var obj = {'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform
      }
      var dataTypeX = []
      var install = []
      var register = []

      this.ajaxGet('shareinstallgatherdata/shareinstallgrowgather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist
        if (data.length > 0) {
          $.each(data, function (index, item) {
            // console.log(item)
            install.push(item.install_num)
            register.push(item.register_num)
            // console.log(date)
            if (date[0] === date[1]) {
              dataTypeX.push(item.time)
            } else {
              dataTypeX.push(item.dt)
            }
          })
        }

        _this.initEchartsCategory(id, dataTypeX, install, register)
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
        _this.initEchartsInstallRegister(number, exclude)
        // _this.initEchartsRegister()
        _this.growthTrend(number, exclude, platform)
        _this.increaseTrend([moment().subtract('days', 6).format('YYYYMMDD'), moment().format('YYYYMMDD')], exclude, platform, type)
        _this.ipTrend(number, exclude, platform, type)
        _this.getSystemVersion(number, exclude, platform, type)
        _this.getModel(number, exclude, platform, type)
    } else {
        var id = name.attr("id")
        if (id == "total") { // 总量统计
          _this.initEchartsInstallRegister(number, exclude) //总量统计安装量
          // _this.initEchartsRegister() //总量统计注册量
        } else if (id == "trend") { //增长趋势
          // console.log('增长趋势')
          _this.growthTrend(number, exclude, platform) //折线图
        } else if (id == 'increase') { //活跃趋势
          // console.log('活跃趋势')
          _this.increaseTrend(number, exclude, platform, type) //折线图
        } else if (id == 'ipspread') {  // ip分布
          _this.ipTrend(number, exclude, platform, type)
        } else if (id == 'sys') {
          _this.getSystemVersion(number, exclude, platform)
        } else if (id == 'branddevice') {
          _this.getModel(number, exclude, platform, type)
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
      var _this = this
      var id = 'J_increase'

      var obj = {'startDate': date[0],
        'endDate': date[1],
        'appkey': 'K6BKB62B7BHABH',
        // 'exclude': exclude,
        'platform': platform,
        'type': type
      }

      var value = {}

      var dataTypeX = []
      value.actUv = []
      value.registerAct = []
      value.actTime = []
      value.actRate = []
      // var data = [{
      //   value: 10,
      //   name: 'ios'
      // },
      // {
      //   value: 5,
      //   name: 'Android'
      // }
      // ]

      this.ajaxGet('shareinstallgatherdata/shareinstallactivegather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist
        if (data.length > 0) {
          $.each(data, function (index, item) {
            // console.log(item)
            // var temp = item.act_time.split(':')
            // item.act_time = parseInt(temp[0] * 60 * 60) + parseInt(temp[1] * 60) + parseInt(temp[2])
            value.actUv.push(item.act_uv)
            value.registerAct.push(item.register_act)
            value.actTime.push(item.act_time)
            value.actRate.push(item.act_rate)
            // console.log(date)
            if (type === '1' || type === '2') {
              dataTypeX.push(item.dt)
            } else {
              if (date[0] === date[1]) {
                dataTypeX.push(item.hh)
              } else {
                dataTypeX.push(item.dt)
              }
            } 
          })
        }

        _this.initEchartsCategoryActive(id, dataTypeX, value, type)
      })
    },
    /***
     *  获取IP分布数据
     */
    ipTrend: function (date, exclude, platform, type) {
      var _this = this
      var id = 'J_ipMap'

      var obj = {'startDate': moment().subtract('days', 1).startOf('day').format('YYYYMMDD'),
        'endDate': moment().subtract('days', 1).endOf('day').format('YYYYMMDD'),
        'appkey': 'K6BKB62B7BHABH',
        'exclude': exclude,
        'platform': platform,
        'type': type
      }

      var ipData = []

      this.ajaxGet('shareinstallgatherdata/shareinstallipspreadgather', obj, function (json) {
        if (json.code !== 200) return
        var data = json.datalist
        // console.log(data)
        if (data.length > 0) {
          $.each(data, function (index, item) {
            // console.log(item)
            if (type == 1) {
              item.name = item.cityname
              item.value = parseInt(item.cnt)
            } else {
              item.name = item.provname
              item.value = parseInt(item.cnt)
            }
            ipData.push(item)
          })
        }


        if (type == 1) {
          _this.initEchartsMap(id, [], type)
        } else {
          _this.initEchartsMap(id, ipData)
        }
        _this.ipTrendRendering(ipData)
        

        // _this.initEchartsCategoryActive(id, dataTypeX, value, type)
      })

      // data = [{
      //   name: '北京',
      //   value: 2256
      // }, {
      //   name: '天津',
      //   value: 744
      // }, {
      //   name: '上海',
      //   value: 578
      // }, {
      //   name: '重庆',
      //   value: 806
      // }, {
      //   name: '河北',
      //   value: 432
      // }, {
      //   name: '河南',
      //   value: 590
      // }, {
      //   name: '云南',
      //   value: 132
      // }, {
      //   name: '辽宁',
      //   value: 487
      // }, {
      //   name: '黑龙江',
      //   value: 336
      // }, {
      //   name: '湖南',
      //   value: 295
      // }, {
      //   name: '安徽',
      //   value: 398
      // }, {
      //   name: '山东',
      //   value: 1055
      // }, {
      //   name: '新疆',
      //   value: 201
      // }, {
      //   name: '江苏',
      //   value: 795
      // }, {
      //   name: '浙江',
      //   value: 655
      // }, {
      //   name: '江西',
      //   value: 311
      // }, {
      //   name: '湖北',
      //   value: 993
      // }, {
      //   name: '广西',
      //   value: 261
      // }, {
      //   name: '甘肃',
      //   value: 349
      // }, {
      //   name: '山西',
      //   value: 273
      // }, {
      //   name: '内蒙古',
      //   value: 343
      // }, {
      //   name: '陕西',
      //   value: 319
      // }, {
      //   name: '吉林',
      //   value: 325
      // }, {
      //   name: '福建',
      //   value: 317
      // }, {
      //   name: '贵州',
      //   value: 275
      // }, {
      //   name: '广东',
      //   value: 1000
      // }, {
      //   name: '青海',
      //   value: 97
      // }, {
      //   name: '西藏',
      //   value: 18
      // }, {
      //   name: '四川',
      //   value: 601
      // }, {
      //   name: '宁夏',
      //   value: 126
      // }, {
      //   name: '海南',
      //   value: 186
      // }, {
      //   name: '台湾',
      //   value: 0
      // }, {
      //   name: '香港',
      //   value: 11
      // }, {
      //   name: '澳门',
      //   value: 0
      // }]
    },
    /***
     * 显示省份/城市信息信息
     */
    ipTrendRendering: function (data) {
      var _this = this
      var html = ''
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          if (item.name) {
            html += '<div>' +
            '<span>' + data[i].name + '</span>：' +
            '<span>' + data[i].value + '</span>' +
            '</div>'
          }
        }
        $('.location_city').html(html)
      } else {
        $('.location_city').html('<img src="./img/overview/none.png" alt="没有数据" class="" style="width: 48px; height: 68px; position: absolute; top: 50%; left: 50%; margin-left: -34px; margin-top: -34px;">')
      }
    },
    /***
     * 系统版本获取数据
     */
    getSystemVersion: function (date, exclude, platform, type) {
      var _this = this
      var id = 'J_systemVersion'

      var obj = {'startDate': moment().subtract('days', 1).startOf('day').format('YYYYMMDD'),
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
      var obj = {'startDate': moment().subtract('days', 1).startOf('day').format('YYYYMMDD'),
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
      if (data.length > 20) {
        $.each(data, function(index, item) {
          if(index > 20) {
            data[20]['value'] += parseInt(item.cnt)
          }
        })
        data.length = 21
        data[20]['name'] = '其他'
        // data[20]['osver'] = '其他'
      }
      // console.log(data)
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [{
          name: '系统版本',
          type: 'pie',
          radius: ['0%', '60%'],
          color: ['#ff6484', '#00a3fe', '#4cc0c0', '#ffb957', '#ffbb66', '#cccccc'],
          avoidLabelOverlap: true,
          minAngle: 20,
          label: {
            normal: {
              show: true,
              position: 'outside'
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 15,
              length2: 15
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
