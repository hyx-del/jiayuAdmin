<!--
 * @Author: jiu yin
 * @Date: 2021-07-20 15:12:09
 * @LastEditTime: 2021-12-13 17:15:34
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\dataCenter\user\user.vue
 * 
-->
<template>
	<!-- 数据 -->
	<div class="userList">
		<div class="br">
			<ul class="userSum">
				<li class="count">
					<!-- <svg-icon icon-class="backstage_bg_total" /> -->
					<span>总注册用户数</span>
					<p>{{ toLocaleStrings(sum.total) }}</p>
				</li>
				<li class="newly">
					<span>昨日新增总计</span>
					<div :class="daysFroms(sum.yesterdayTotal, sum.beforeYesterdayTotal) ? 'up' : 'down'">{{ daysFrom(sum.yesterdayTotal, sum.beforeYesterdayTotal) }}</div>
					<p>{{ toLocaleStrings(sum.yesterdayTotal) }}</p>
				</li>
				<li class="port">
					<span>APP端</span>
					<!-- 下是   .down -->
					<div :class="daysFroms(sum.yesterdayApp, sum.beforeYesterdayApp) > 0 ? 'up' : 'down'">{{ daysFrom(sum.yesterdayApp, sum.beforeYesterdayApp) }}</div>
					<p>{{ toLocaleStrings(sum.yesterdayApp) }}</p>
				</li>
				<li class="port">
					<span>小程序端</span>
					<div :class="daysFroms(sum.yesterdayMP, sum.beforeYesterdayMP) > 0 ? 'up' : 'down'">{{ daysFrom(sum.yesterdayMP, sum.beforeYesterdayMP) }}</div>
					<p>{{ toLocaleStrings(sum.yesterdayMP) }}</p>
				</li>
				<li class="port">
					<span>邀请H5端</span>
					<div :class="daysFroms(sum.yesterdayH5, sum.beforeYesterdayH5) > 0 ? 'up' : 'down'">{{ daysFrom(sum.yesterdayH5, sum.beforeYesterdayH5) }}</div>
					<p>{{ toLocaleStrings(sum.yesterdayH5) }}</p>
				</li>
				<li class="port">
					<span>门店端</span>
					<div :class="daysFroms(sum.yesterdayStore, sum.beforeYesterdayStore) > 0 ? 'up' : 'down'">{{ daysFrom(sum.yesterdayStore, sum.beforeYesterdayStore) }}</div>
					<p>{{ toLocaleStrings(sum.yesterdayStore) }}</p>
				</li>
			</ul>
		</div>

		<!-- 图表 -->
		<div class="addUser">
			<div class="hd">
				<p>新增用户趋势</p>
				<el-form
					:inline="true"
					:model="ruleForm"
					ref="ruleForm"
					class="demo-form-inline"
				>
					<el-form-item label="时间筛选：">
						<el-date-picker
							@change="onChange"
							v-model="date"
							type="daterange"
							size="small"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="timestamp"
							:picker-options="pickerOptions"
							:default-value="currentDate"
						></el-date-picker>
					</el-form-item>
				</el-form>
			</div>
			<el-menu
				:default-active="activeIndex"
				class="el-menu-demo"
				mode="horizontal"
				@select="handleSelect"
			>
				<el-menu-item index="-1">总计</el-menu-item>
				<el-menu-item index="0">APP端</el-menu-item>
				<el-menu-item index="1">小程序端</el-menu-item>
				<el-menu-item index="2">邀请H5端</el-menu-item>
				<el-menu-item index="3">门店端</el-menu-item>
			</el-menu>
			<!-- 暂时不用 日周月 -->
			<!-- <div class="demo-form-inline">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="0">日</el-menu-item>
          <el-menu-item index="1">周</el-menu-item>
          <el-menu-item index="2">月</el-menu-item>
        </el-menu>
      </div> -->

			<!-- 数据可视 -->
			<!-- https://frappe.io/charts/docs/basic/annotations -->
			<!-- id - 每一个图表必须有一个 id. -->
			<!-- title - 图表上方显示的标题 -->
			<!-- type - 图表的类型 线性图、饼图、条形图、等 -->
			<!-- labels - x 轴上的值 -->
			<!-- height- 可选，图表的高度 -->
			<!-- colors - 将每一个数据集进行颜色区分 -->
			<!-- datasets - 数据集，对象数组 -->
			<!-- lineOptions  regionFill面积体现 spline连续协调-->
			<!-- tooltipOptions 编辑鼠标滑过提示 -->
			<!-- axisOptions X 轴（通常是时间轴）通常是连续的。这意味着我们可以通过只允许几个周期性标签来减少渲染每个 X 标签的冗余。 -->
			<vue-frappe
				id="test"
				:labels="chartsData.labels"
				type="line"
				:height="300"
				:colors="['#1392ff']"
				:dataSets="chartsData.dataSets"
				:lineOptions="{ regionFill: 1, spline: 1 }"
				:axisOptions="{ xIsSeries: true }"
				:tooltipOptions="tooltipOptions"
			> </vue-frappe>
		</div>
	</div>
</template>

<script>
//可视化
import { VueFrappe } from "vue2-frappe";
import Table from "@/components/Table/index";
import { parseTime,toLocaleString } from "@/utils";
//注册数据 图标数据
import { registerSum,registerCurve } from "@/api/dataCenter.js";
import { Message } from "element-ui";
export default {
	components: {
		Table,
		VueFrappe,
	},
	data() {
		return {
			//可视化提示
			tooltipOptions: {
				formatTooltipX: (d) => (d+"").toUpperCase(),
				formatTooltipY: (d) => d+" 个",
			},
			//时间默认上个月
			currentDate: new Date().getTime()-24*60*60*1000*30,
			//可视化数据
			chartsData: {
				//x轴 默认值 不然要报错
				labels: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				//数据状态  默认值 不然要报错
				dataSets: [
					{
						// name: "User Data",
						chartType: "line",
						values: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					},
				],
			},
			//默认选项卡
			activeIndex: "-1",
			date: [],
			ruleForm: {
				startDay: this.beforeYesterday(), //开始时间
				endDay: this.yesterday(), //结束时间
				type: -1,
			},
			//新增
			sum: {
				beforeYesterdayApp: 0,
				beforeYesterdayH5: 0,
				beforeYesterdayMP: 0,
				beforeYesterdayStore: 0,
				beforeYesterdayTotal: 0,
				total: 0,
				yesterdayApp: 0,
				yesterdayH5: 0,
				yesterdayMP: 0,
				yesterdayStore: 0,
				yesterdayTotal: 0,
			},

      // 图表总数据
      frappe: {},
      //时间周期
      pickerOptions: {
        //禁用今天包括今天之后时间
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 60 * 60 * 1000; //当天之前的时间可选;
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {},
  computed: {},
  mounted() {
    //总数
    registerSum().then((res) => {
      if (res.code == 200) {
        this.sum = {...res.data};
        this.$forceUpdate();
      }
    });
    this.registerCurve();
  },
  methods: {
    //开始结束时间
    onChange(value) {
      //清空
      if (!value) {
        (this.ruleForm = {
          startDay: this.beforeYesterday(), //开始时间
          endDay: this.yesterday(), //结束时间
          type: -1,
        }),
          (this.activeIndex = "-1");
      }
      console.log(value);
      //最大一年 最小7
      //开始时间戳
      let start = value[0];
      //结束时间搓
      let end = value[1];
      if (start && end) {
        let scope = parseInt((end - start) / (24 * 60 * 60 * 1000));
        console.log(scope);
        if (scope < 7) {
          this.$alert("警告哦，最少选择当前日期7天以上,请重新查询", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
          //自定义错误
          return;
        } else if (scope > 90) {
          this.$alert("警告哦，最多选择当前90天以内7天以上,请重新查询", {
            confirmButtonText: "确定",
            callback: (action) => {},
          });
        } else {
          Message({
            message: "当前查询周期为" + scope + "天",
            type: "success",
            duration: 2000,
          });
          this.ruleForm.startDay = parseTime(value[0]).split(" ")[0];
          this.ruleForm.endDay = parseTime(value[1]).split(" ")[0];
          this.registerCurve();
        }
      }
    },

		//图表
		registerCurve() {
			registerCurve(this.ruleForm).then((res) => {
				if(res.code==200) {
					//总数据
					this.frappe=res.data;
					//x轴处理
					this.chartsData.labels=[];
					this.chartsData.dataSets[0].values=[];
					this.frappe.forEach((item) => {
						this.chartsData.labels.push(item.timeUnit);
						this.chartsData.dataSets[0].values.push(item.number);
					});
				}
			});
		},

		//选项卡事件
		handleSelect(key) {
			this.ruleForm.type=key;
			this.registerCurve();
		},

    //日环比 昨日 前日
    daysFrom(yester, beforeYester) {
      let daysFroms;
      if (yester != undefined && beforeYester != undefined) {
        if (beforeYester == 0 || yester - beforeYester == 0) {
          daysFroms = 0;
        } else {
          daysFroms = (yester - beforeYester) / beforeYester;
        }
      } else {
        daysFroms = 0;
      }
      return (daysFroms * 100).toFixed(2) + "%";
    },
    //百分比自正负 防止报错
    daysFroms(yester, beforeYester) {
      if (yester != undefined && beforeYester != undefined) {
        let daysFroms;
        if (beforeYester == 0 || yester - beforeYester == 0) {
          daysFroms = 0;
        } else {
          daysFroms = (yester - beforeYester) / beforeYester;
        }
        return parseInt(daysFroms) > 0 ? true : false;
      }
    },
    //昨天时间 默认
    yesterday() {
      let d = new Date().getTime();
      let yesterday = d - 24 * 60 * 60 * 1000;
      return parseTime(yesterday).split(" ")[0];
    },
    //前天时间 默认
    beforeYesterday() {
      let d = new Date().getTime();
      let yesterday = d - 24 * 60 * 60 * 1000 * 15;
      return parseTime(yesterday).split(" ")[0];
    },
    //千分位
    toLocaleStrings(num) {
      return toLocaleString(num);
    },
  },
};
</script>

<style lang="scss" scope>
* {
	margin: 0;
	padding: 0;
	list-style: none;
}
.userList {
	padding: 0 !important;
	.br {
		width: 100%;
		height: 340px;
		display: flex;
		align-items: center;
		background: #f0f2f5;
		border-radius: 8px 8px 8px 8px;
		overflow: hidden;
		.userSum {
			width: 100%;
			height: 300px;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 20px;
			li {
				margin-right: 20px;
			}
			// :last-child {
			//   margin-right: 20px;
			// }
			.count,
			.newly {
				box-sizing: content-box;
				width: 360px;
				min-width: 297px;
				height: 240px;
				border-radius: 8px 8px 8px 8px;
				box-shadow: 0px 30px 57px 0px rgba(131, 146, 167, 0.1);
				padding-left: 30px;
				span {
					display: block;
					height: 30px;
					font: 20px/30px "微软雅黑";
					color: #ffffff;
					margin-top: 36px;
				}
				p {
					font: 56px/30px "微软雅黑";
					color: #ffffff;
					margin-top: 88px;
				}
			}
			.count {
				background: url("~@/icons/png/backstage_bg_total.png") no-repeat
					left top;
				background-size: 400px 240px;
				span {
					background: url("~@/icons/png/backstage_icon_people1.png")
						no-repeat 260px center;
					background-size: 30px;
				}
			}
			.newly {
				background: url("~@/icons/png/backstage_bg_yesterday.png")
					no-repeat left top;
				background-size: 400px 240px;
				span {
					background: url("~@/icons/png/backstage_icon_people2.png")
						no-repeat 260px center;
					background-size: 30px;
				}
				div {
					color: #fff;
					font: 24px/30px "微软雅黑";
					margin-top: 34px;
					padding-left: 45px;
				}
				.down {
					background: url("~@/icons/png/backstage_icon_up_white.png")
						no-repeat left center;
					background-size: 24px;
				}
				.up {
					background: url("~@/icons/png/backstage_icon_up_white·1.png")
						no-repeat left center;
					background-size: 24px;
				}
				p {
					margin-top: 23px;
				}
			}
			.port {
				width: 199px;
				min-width: 150px;
				height: 200px;
				opacity: 1;
				background: #f0f6fc;
				border-radius: 10px;
				padding-left: 23px;
				span {
					display: block;
					color: #333333;
					font: 20px/30px "微软雅黑";
					padding-left: 26px;
					background: url("~@/icons/png/backstage_icon_circle_blue.png")
						no-repeat left center;
					background-size: 14px;
					margin-top: 25px;
				}
				div {
					font: 24px/30px "微软雅黑";
					margin-top: 34px;
					padding-left: 45px;
				}
				.up {
					background: url("~@/icons/png/backstage_icon_up_green.png")
						no-repeat left center;
					background-size: 24px;
					color: #10cfbd;
				}
				.down {
					background: url("~@/icons/png/backstage_icon_down_red.png")
						no-repeat left center;
					background-size: 24px;
					color: #ff5f57;
				}
				p {
					color: #333333;
					font: 42px/32px "微软雅黑";
					margin-top: 23px;
				}
			}
		}
	}
	.addUser {
		padding: 0 21px;
		.hd {
			// height: 86px;
			border-bottom: 2px solid #dedde2;
			margin-top: 20px;
			p {
				color: #222224;
				font: 20px/43px "微软雅黑";
			}
			.demo-form-inline {
				display: flex;
				justify-content: flex-end;
				margin-top: -30px;
			}
			.el-picker-panel__sidebar {
				background: red !important;
			}
		}
		.el-menu-demo {
			margin-top: 20px;
			border: none;
			:first-child {
				border-radius: 4px 0px 0px 4px;
			}
			:last-child {
				border-radius: 0px 4px 4px 0px;
			}
			.el-menu-item {
				height: 40px;
				opacity: 1;
				background: #ffffff;
				border: 1px solid #dedde2 !important;
				color: #222224;
				font: 16px/40px "微软雅黑";
				margin-left: -1px;
				padding: 0 15px;
			}
			.is-active {
				background: #1890ff;
				color: #ffffff;
			}
		}
		.demo-form-inline {
			display: flex;
			justify-content: flex-end;
			margin-top: -44px;
			.el-menu-demo {
				margin-right: 10px;
				.el-menu-item {
					padding: 0 28px;
				}
			}
		}
		#test {
			margin-top: 24px;
		}
	}
}
</style>
