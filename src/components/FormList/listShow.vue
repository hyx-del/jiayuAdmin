<template>
	<div class="listShow">
    <template v-for="item in inList">
      <div class="listShowItem" v-if="item.show||item.show==undefined"  :style="{ display: item.nodate && !inFormObj[item.code]&&item.show ? 'none' : 'block', ...{ paddingLeft: inLabelWidth } }">
        <div class="listShowLabel" :style="{ ...{ width: inLabelWidth } }">{{ item.label }}{{ inConfig.colon }}</div>
        <div class="span" v-if="item.el == 'span'">
				<span v-if="item.type == 'Array'">
					<span v-for="(i, index) in inFormObj[item.code]" :key="index">{{ i[item.labelCode] || i }}</span>
				</span>
          <span v-else>{{ inFormObj[item.code] || item.default || '未选填' }}</span>
          <span v-if="item.unit">{{ item.unit }}</span>
        </div>
        <div class="imgShow" v-if="item.el == 'img'">
          <el-image style="width: 100%;min-height: 100px" :src="inFormObj[item.code][0]" :preview-src-list="inFormObj[item.code]">
            <div slot="error" class="image-slot">
              <!--            <img :src="inFormObj[item.code][0]" alt="">-->
              <el-image
                  :style="{
								width: item.width || '100%',
								minHeight: item.height || '100px',
							}"
                  :src="inFormObj[item.code][0]"
                  :preview-src-list="inFormObj[item.code]"
              ></el-image>
              <!--            <i class="el-icon-picture-outline"></i>-->
            </div>
          </el-image>
          <!--        <img :src="inFormObj[item.code][0]" alt="">-->

          <!--        {{inFormObj[item.code]}}-->
          <!--        <img :src="inFormObj[item.code]">-->
        </div>
        <div class="video" v-if="item.el == 'video'">
          <video v-if="inFormObj[item.code]" class="inVideo" :src="inFormObj[item.code]" controls="controls">您的浏览器不支持视频播放</video>
          <div v-else>没有上传</div>
        </div>
      </div>
    </template>

	</div>
</template>

<script>
/*
 * index组件说明
 *
 * */

import { backType } from '@/components/FormList/utils';

export default {
	name: 'listShow',
	data() {
		return {
			formListObj: {}, //全部对象
			inList: [],
			inLabelWidth: 4,
			inFormObj: {},
			editerReq: false, //editer是否通过验证
			backList: {}, //存放从后台获取到的下拉数据的列表数据
			backListRequst: {}, //存放从后台获取到的下拉数据的列表数据
			splitCodeObj: {}, //需要分割的结果的对象
			buttons: [
				{
					funType: 'confirm',
					type: 'primary',
					name: '确认',
					size: 'small',
				},
				{
					funType: 'cancle',
					type: 'primary',
					name: '取消',
					size: 'small',
				},
				{
					funType: 'reset',
					type: 'primary',
					name: '重置',
					size: 'small',
				},
			],
			inConfig: {
				buttonsArea: '',
				enter: true,
				allRequired: true, // 是否全部必填
				labelShow: true,
				inline: false, //行内
				inputStyle: {
					width: '300px',
				},
				size: 'small',
				colon: '：', // 冒号
				mainStyle: {},
			},
			inSearchVal: {},
			refSeachObj: {},
			// 存放area
			refArea: {},
			// 存放area
			refVideo: {},
			hasEditer: false,
			editerObj: {},
			refDate: {}, // 时间对象
			refCascader: {}, //联级选择的对象
			arrayObj: {}, //记录那些字段是数组的，最后转成字符串，接收结果时转成数组
		};
	},
	props: {
		loading: {
			type: Boolean,
			required: false,
		},
		list: {
			type: Array,
			required: true,
		},
		formObj: {
			type: Object,
			required: true,
		},
		searchObj: {
			type: Object,
			required: false,
			default: () => {
				return {};
			},
		},
		config: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	created() {
		this.setForm();
	},
	mounted() {},
	methods: {
		backType(cc, str) {
			return backType(cc, str);
		},
		upDom() {
			this.inFormObj = { ...this.inFormObj };
		},
		// 初始化组件
		setForm() {
			let defaltLabelWidth = 0;
			this.inConfig = Object.assign(this.inConfig, this.config);
			// 按钮初始化
			if (this.inConfig.buttons && this.inConfig.buttons) {
				this.buttons = this.inConfig.buttons.map(bts => {
					let obj = {
						funType: 'nothing',
						type: 'primary',
						name: 'name',
						size: 'small',
					};
					return Object.assign(obj, bts);
				});
			}
			let hasRequired = false;
      this.inList=this.inList.filter(item=>{
        if (item.show||item.show==undefined) {
          item.show=true
          return item
        }
      })
			this.inList = this.list.map(value => {
				let { el, code, label } = value;
				value.oldLabel = value.oldLabel || label;

				// 基本参数
				let defalt = {
					el: 'span',
					clear: true,
					required: this.inConfig.allRequired,
					minlength: 1,
					maxlength: 120,
					dateType: 'datetime',
					placeholder: '',
				};
				if (value.list) {
					this.getListLabel(value.list, value.code);
				}
				if (el == 'img') {
					if (backType(this.inFormObj[code], 'String')) {
						this.inFormObj[code] = this.inFormObj[code].split(',');
					}

					if (backType(this.inFormObj[code], 'Undefined')) {
						this.inFormObj[code] = [];
					}
					if (backType(this.inFormObj[code], 'Null')) {
						this.inFormObj[code] = [];
					}
					value.label = value.oldLabel + (this.inFormObj[code].length > 0 ? `(${this.inFormObj[code].length})` : '');
				}
				// 从后台获取list的初始化
				if (value.back) {
					this.backList[value.code] = this.backList[value.code] ? this.backList[value.code] : [];
					this.getFunData(value, {});
				}
				defaltLabelWidth = value.label.length > defaltLabelWidth ? value.label.length : defaltLabelWidth;
				value = Object.assign(defalt, value);
				hasRequired = value.required ? true : hasRequired;
        this.formListObj[code]=value
				return value;
			});
			// 根据 配置labelWidth>label最大长度+冒号的长度+是否含有必选项  得到labelWidth
			this.inLabelWidth = this.config.labelWidth ? this.config.labelWidth : defaltLabelWidth + this.inConfig.colon.length + (hasRequired ? 1 : 0) + 1 + 'em';
			this.upDom();
		},
		getListLabel(list, code) {
			if (list.length == 0 ||typeof this.inFormObj[code]=="undefined") return;
			if (typeof this.inFormObj[code] == 'number') {
				this.inFormObj[code] += '';
			}
			let arr = this.inFormObj[code].split(',').map(v =>v+'');
			let mid = [];
      console.log('--------',arr)
			list.forEach(val => {
				if (arr.includes(val.value+'')) {
					mid.push(val.label);
				}
			});
			this.inFormObj[code] = mid.length > 0 ? mid.join(',') : this.inFormObj[code];
		},
		// 获取label格式的数据
		getFunData(obj, parObj = {}) {
			let par = { ...{ size: 1000, current: 1 }, ...obj.postData, ...parObj };
			let code = obj.code;
			let requsetStr = `${code}${JSON.stringify(par)}`;
			if (this.backListRequst[requsetStr]) return;
			this.backListRequst[requsetStr] = true;
			obj.fun(par).then(res => {
				if (obj.funMode == 2) {
					this.backList[code] = this.keyC(obj, res.data);
				} else {
					this.backList[code] = this.keyC(obj, res.data.records);
				}
				if (obj.funMode == 3) {
					this.backList[code] = res.data.map(v => {
						v.label = v.cityName;
						v.value = v.cityName;
						v.children = v.list.map(vv => {
							vv.label = vv.name;
							vv.value = vv.id;
							return vv;
						});
						return v;
					});
				}
				if (this.inFormObj[code]) {
					if (typeof this.inFormObj[code] == 'number') {
						this.inFormObj[code] += '';
					}
					let lt = this.inFormObj[code].split(',').map(v => Number(v));
					let mid = [];
					lt = this.backList[code].forEach(v => {
						if (lt.includes(v[obj.valueCode])) {
							mid.push(v[obj.labelCode]);
						}
					});
					this.inFormObj[code] = mid.length > 0 ? mid.join(',') : this.inFormObj[code];
				}
				this.upDom();
			});
		},
		keyC(obj, mapList) {
			if (!mapList) return [];
			return mapList.map(v => {
				v.label = v[obj.labelCode];
				v.value = v[obj.valueCode];
				return v;
			});
		},
		// 按钮事件
		buttonsClick(bts) {
			this.$emit('button', { name: bts.funType, node: this.$refs['ruleForm'], value: '', valid: false });
		},
    // 改变dom
    changeList(obj){
      if (obj) {
        let list=[]
        if (backType(obj,'Object')) {
          list=obj.list||[]
          if (obj.formObj) {
            this.inFormObj={...this.inFormObj,...obj.formObj}
          }
        }else{
          list=obj
        }
        let codeObj = {};
        let codeList = list.map((item) => {
          codeObj[item.code] = item;
          return item.code;
        });
        codeList = codeList.filter((v) => v);
        this.list = this.list.map((item) => {
          if (codeList.includes(item.code)) {
            item = { ...item, ...codeObj[item.code] };
          }
          return item;
        });
        this.setForm();
      }
    },
	},
	watch: {
		loading: {
			deep: true,
			immediate: true,
			handler: function(newV, oldV) {
				if (newV != oldV) {
					this.inLoading = newV;
				}
			},
		},
		formObj: {
			deep: true,
			immediate: true,
			handler: function(newV, oldV) {
				if (newV != oldV) {
					this.inFormObj = { ...this.inFormObj, ...newV };
          for (const key in newV) {
            let item=this.formListObj[key]
            if (backType(newV[key], 'Number')) {
              newV[key] = newV[key] + '';
            }
            if (item&&item.valueChange) {
              let list=item.valueChange(newV[key],newV)
              console.log('************',list)
              this.changeList(list)
            }
          }
					this.setForm();
					this.$forceUpdate();
				}
			},
		},
		searchObj: {
			deep: true,
			handler: function(val, oldV) {},
		},
		inFormObj: {
			deep: true,
			handler: function(val, oldV) {},
		},
	},
};
</script>

<style lang="scss" scoped>
.listShow {
	$lh: 42px;
	width: 100%;
	.listShowItem {
		position: relative;
		box-sizing: border-box;
		margin-bottom: 20px;
		min-height: 24px;
	}
	.listShowLabel {
		position: absolute;
		left: 0;
		top: 0;
		text-align: right;
	}
	.span {
		word-wrap: break-word;
		word-break: break-all;
	}
	.imgShow {
		width: 100%;
		img {
			width: 100%;
		}
	}
	.video,
	.inVideo {
		width: 100%;
	}
	& >>> .el-image-viewer__close {
		color: #fff;
	}
}
</style>
