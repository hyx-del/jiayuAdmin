<!--
 * @Author: wei.chen
 * @Date: 2020-12-25 15:52:03
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-12-30 16:23:28
 * @Descripttion: 
-->
<template>
	<div ref="content" class="hz-m-wrap">
		<img class="hz-u-img" :src="image" />
		<ul class="hz-m-area" v-add-item>
			<zone
				class="hz-m-item"
				v-for="(zone, index) in zones"
				:key="zone.id || index"
				:index="index"
				:setting="zone"
				@delItem="removeItem($event)"
				@changeInfo="changeInfo($event)"
			></zone>
		</ul>
	</div>
</template>

<script>
import Zone from './Zone';
import addItem from '../directives/addItem';

export default {
	name: 'HotZone',
	data() {
		return {
			zones: [],
		};
	},
	props: {
		image: {
			type: String,
			required: true,
		},
		zonesInit: {
			type: Array,
			default: () => [],
		},
		max: {
			type: Number,
		},
	},
	mounted() {
		this.zones = this.zonesInit.concat();
	},
	methods: {
		// 修改尺寸的 回调方法
		changeInfo(res, a, b) {
			let { info, index, state } = res;
			console.log('changeInfo', info, index, state);

			this.changeItem(info, index, state);
		},
		addItem(setting, state) {
			// if (setting.widthPer == 0) {
			//   //  区域不能交叉
			// } else {

			this.zones.push(setting);
			this.hasChange(this.zones.length - 1);
			this.$emit('add', setting);
			// }
		},
		eraseItem(index = this.zones.length - 1) {
			this.removeItem(index);
			this.$emit('erase', index);
		},
		isOverRange() {
			let { max, zones } = this;

			return max && zones.length > max;
		},
		overRange() {
			const index = this.zones.length - 1;

			this.removeItem(index);
			this.$emit('overRange', index);
		},
		removeItem(index = this.zones.length - 1) {
			this.zones.splice(index, 1);
			// this.hasChange(index);
			this.$emit('remove', { _zones: this.zones, index });
		},
		changeItem(info, index = this.zones.length - 1, type) {
			if (index == null) {
				index = this.zones.length - 1;
			}
			let _oldItem = null;
			if (type === 'changeSize') {
				_oldItem = { ...this.zones[index] };
				// 处理  computed 不更新, 修改主键id ,使其能够被修改
				_oldItem.id = new Date().getTime();
			}
			const _isLap = this.checkOtherRectLap(info, index, type);

			if (!_isLap) {
				Object.assign(this.zones[index], info);
				this.hasChange(index);
			} else {
				if (type === 'changeSize') {
					Object.assign(this.zones[index], _oldItem);
				} else if (type === 'add') {
					this.zones.splice(index, 1);
				}
				this.hasChange(index);
				// this.zones = { ...this.zones };
			}
		},
		hasChange(index) {
			this.$emit('change', this.zones, index);
		},
		checkOtherRectLap(curItem, index, move) {
			const _zones = this.zones;
			const _zonesLen = _zones.length;
			const _curItem = { ..._zones[index], ...curItem };
			let _isNoLap = 1;
			// debugger;
			if (_zonesLen > 1) {
				for (let _mark = 0; _mark < _zonesLen; _mark++) {
					if (index === _mark) {
						continue;
					}
					const _isLap = this.isOverlap(_zones[_mark], _curItem);

					if (_isLap) {
						_isNoLap = 0;
						break;
					}
				}
			}
			if (_isNoLap) {
				return false;
			} else {
				return true;
			}
		},
		isOverlap(rect1, rect2) {
			if (!(rect1 && rect2)) {
				return;
			}

			const l1 = { x: rect1.leftPer, y: rect1.topPer };
			const r1 = {
				x: rect1.leftPer + rect1.widthPer,
				y: rect1.topPer + rect1.heightPer,
			};
			const l2 = { x: rect2.leftPer, y: rect2.topPer };
			const r2 = {
				x: rect2.leftPer + rect2.widthPer,
				y: rect2.topPer + rect2.heightPer,
			};
			if (l1.x > r2.x || l2.x > r1.x || l1.y > r2.y || l2.y > r1.y) {
				return false;
			} else {
				return true;
			}
		},
	},
	directives: {
		addItem,
	},
	components: {
		Zone,
	},
};
</script>

<style scoped>
@import '../assets/styles/main.css';
</style>
