/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global Typed */
var DfttModule = (function (dm) {
  var Index = {
    name: 'Index',
    typed: null,
    init: function () {
      var _this = this;
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
      _this.getAmountStatistics() // 获取总量统计数据
      _this.amountStatistics()
      _this.initEchartsInstall()
      _this.initEchartsRegister()
      _this.growthTrendStatistics()
      _this.increaseStatistics()
      _this.ipTrend()
      _this.getSystemVersion()
      _this.getModel()
      _this.gotoLink()
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

    // 左侧链接跳转
    gotoLink: function () {
      var appKey = this.getQueryString('key')
      var appIcon = this.getQueryString('icon')
      $('#my-android').on('click', function () {
        window.location.href = './android.html?key=' + appKey + '&icon=' + appIcon
      })
    },

    /***
     * 初始化日历插件
     */
    initTime: function (name) {
      var _this = this
      var label = label ? label : '今日'
      name.html(label)
      name.daterangepicker({
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
        opens: 'right', //日期选择框的弹出位置
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
      }, function (start, end, label) { //格式化日期显示框
        //name.html(start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD'));
        var label = (label == '自定义' ? start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD') : label)
        name.html(label)
        var timeRangeChange = [start.format('YYYY/MM/DD'), end.format('YYYY/MM/DD')]
        _this.getAmountStatistics(timeRangeChange, name)
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
    },
    /***
     * 初始化中国地图
     */
    initEchartsMap: function (id, data) {
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        title: {
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          show: true,
          formatter: "{b} : {c}",
          backgroundColor: "#000",
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


      myChart.setOption(option);
    },
    /**
     * 安装量统计饼图数据
     */
    initEchartsInstall: function () {
      var _this = this
      $(".register").html('15')
      $(".install").html('15')
      var id = "J_install"
      var name = '安装量'
      var data = [{
          value: 10,
          name: 'ios'
        },
        {
          value: 5,
          name: 'Android'
        }
      ]
      _this.initEchartsPie(id, name, data)
    },
    /**
     *注册量统计饼图数据
     */
    initEchartsRegister: function () {
      var _this = this
      $(".register").html('15')
      $(".install").html('15')
      var id = "J_register"
      var name = '注册量'
      var data = [{
          value: 10,
          name: 'ios'
        },
        {
          value: 5,
          name: 'Android'
        }
      ]
      _this.initEchartsPie(id, name, data)
    },
    /***
     * 增长趋势数据
     */
    growthTrend: function () {
      var _this = this
      var id = "J_trend"
      var dataTypeX = ["2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18"]
      var install = [10, 120, 130, 140, 150, 160, 170, 180, 190, 200]
      var register = [210, 220, 230, 240, 250, 260, 270, 280, 290, 3000]
      var data = [{
          value: 10,
          name: 'ios'
        },
        {
          value: 5,
          name: 'Android'
        }
      ]
      _this.initEchartsCategory(id, dataTypeX, install, register)
    },
    /**
     * 初始化总量统计
     */
    amountStatistics: function () {
      var _this = this
      var $name = $("#total")
      _this.initTime($name)
    },
    /***
     * 获取总量统计
     */
    getAmountStatistics: function (number, name) {
      var _this = this
      if (number == undefined) {
        var newNumber = [
          new Date().getFullYear() + '/' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '/' + (new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate()),
          new Date().getFullYear() + '/' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '/' + (new Date().getDate() > 9 ? new Date().getDate() : '0' + new Date().getDate())
        ]
        number = newNumber
      }
      console.log(number)
      if (name == undefined) { //初始化
        _this.initEchartsInstall()
        _this.initEchartsRegister()
        _this.growthTrend()
        _this.increaseTrend()
      } else {
        var id = name.attr("id")
        if (id == "total") { // 总量统计
          _this.initEchartsInstall() //总量统计安装量
          _this.initEchartsRegister() //总量统计注册量
        } else if (id == "trend") { //增长趋势
          console.log('增长趋势')
          _this.growthTrend() //折线图
        } else if (id == 'increase') { //活跃趋势
          console.log('活跃趋势')
          _this.increaseTrend() //折线图
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
     * 增长趋势
     */
    increaseStatistics: function () {
      var _this = this
      var $name = $("#increase")
      _this.initTime($name)
    },
    /***
     *  获取增长趋势数据
     */
    increaseTrend: function () {
      var _this = this
      var id = "J_increase"
      var dataTypeX = ["2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18", "2015-01-18"]
      var install = [10, 120, 130, 140, 150, 160, 170, 180, 190, 200]
      var register = [210, 220, 230, 240, 250, 260, 270, 280, 290, 3000]
      var data = [{
          value: 10,
          name: 'ios'
        },
        {
          value: 5,
          name: 'Android'
        }
      ]
      _this.initEchartsCategory(id, dataTypeX, install, register)
    },
    /***
     *  获取IP分布数据
     */
    ipTrend: function () {
      var _this = this
      var id = 'J_ipMap'
      var data = [{
        name: '北京',
        value: 2256
      }, {
        name: '天津',
        value: 744
      }, {
        name: '上海',
        value: 578
      }, {
        name: '重庆',
        value: 806
      }, {
        name: '河北',
        value: 432
      }, {
        name: '河南',
        value: 590
      }, {
        name: '云南',
        value: 132
      }, {
        name: '辽宁',
        value: 487
      }, {
        name: '黑龙江',
        value: 336
      }, {
        name: '湖南',
        value: 295
      }, {
        name: '安徽',
        value: 398
      }, {
        name: '山东',
        value: 1055
      }, {
        name: '新疆',
        value: 201
      }, {
        name: '江苏',
        value: 795
      }, {
        name: '浙江',
        value: 655
      }, {
        name: '江西',
        value: 311
      }, {
        name: '湖北',
        value: 993
      }, {
        name: '广西',
        value: 261
      }, {
        name: '甘肃',
        value: 349
      }, {
        name: '山西',
        value: 273
      }, {
        name: '内蒙古',
        value: 343
      }, {
        name: '陕西',
        value: 319
      }, {
        name: '吉林',
        value: 325
      }, {
        name: '福建',
        value: 317
      }, {
        name: '贵州',
        value: 275
      }, {
        name: '广东',
        value: 1000
      }, {
        name: '青海',
        value: 97
      }, {
        name: '西藏',
        value: 18
      }, {
        name: '四川',
        value: 601
      }, {
        name: '宁夏',
        value: 126
      }, {
        name: '海南',
        value: 186
      }, {
        name: '台湾',
        value: 0
      }, {
        name: '香港',
        value: 11
      }, {
        name: '澳门',
        value: 0
      }]
      _this.initEchartsMap(id, data)
      _this.ipTrendRendering(data)
    },
    /***
     * 显示省份/城市信息信息
     */
    ipTrendRendering: function (data) {
      var _this = this
      console.log(data)
      var html = ''
      if (data) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          html += '<div>' +
            '<span>' + data[i].name + '</span>：' +
            '<span>' + data[i].value + '</span>' +
            '</div>'
        }
        $('.location_city').html(html)
      }
    },
    /***
     * 系统版本获取数据
     */
    getSystemVersion: function () {
      var _this = this
      var id = 'J_systemVersion'
      var data = [{
          value: 335,
          name: '5.5.5'
        },
        {
          value: 310,
          name: '6.0.0'
        },
        {
          value: 234,
          name: '7.0.1'
        },
        {
          value: 135,
          name: '7.1.1'
        }
      ]
      _this.SystemVersionPie(id, data)
    },
    /***
     * 品牌机型获取数据
     */
    getModel: function () {
      var _this = this
      var id = 'J_getModel'
      var data = [{
          value: 335,
          name: '5.5.5'
        },
        {
          value: 310,
          name: '6.0.0'
        },
        {
          value: 234,
          name: '7.0.1'
        },
        {
          value: 135,
          name: '7.1.1'
        }
      ]
      _this.SystemVersionPie(id, data)
    },
    /***
     * 系统版本/品牌机型饼图
     */
    SystemVersionPie: function (id, data) {
      var myChart = echarts.init(document.getElementById(id));
      var option = {
        series: [{
          name: '访问来源',
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
              show: false
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
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'inner',
                formatter: '{b}-{d}%'
              }
            }
          },
          data: data
        }]
      };

      myChart.setOption(option);
    }
  };
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