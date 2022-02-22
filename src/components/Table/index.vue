<template>
	<!-- :max-height="topHead" -->
	<div>
		<el-table
			class="tipleTable"
			:class="{ single: single ? true : false, chenckNone: chenckNone ? true : false }"
			ref="multipleTable"
			:data="tableData"
			style="width: 100%;"
			:max-height="topHead"
			border
			:default-sort="{ prop: 'date', order: 'descending' }"
			row-key="id"
			lazy
			:fit="true"
			:load="childrenLoad"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			:indent="30"
			@selection-change="handleSelectionChange"
			@select="handleSelect"
			@select-all="allSelect"
			@sort-change="sortChange"
		>
			<el-table-column v-if="select" type="selection" width="55" :reserve-selection="true"></el-table-column>
			<!-- v-if="showSortNum"     -->
			<el-table-column :label="showSortIndex.lable" v-if="showSortIndex.show" width="60">
				<template v-slot="scope">
					<span>
						{{ scope.$index + 1 + listQuery.size * (listQuery.current - 1) }}
					</span>
				</template>
			</el-table-column>
			<template v-for="item in column">
				<el-table-column
					:sortable="item.sortable ? 'custom' : false"
					:prop="item.prop ? item.prop : null"
					:label="item.label ? item.label : null"
					:align="item.align ? item.align : 'center'"
					:fixed="item.fixed || item.prop == 'action' ? item.fixed || (item.prop == 'action' ? 'right' : '') : null"
					:width="item.width ? item.width : null"
					:min-width="item.minwidth ? item.minwidth : item.img ? '140px' : null"
					:formatter="item.formatter ? item.formatter : null"
					:key="item.prop"
				>
					<template v-if="item.render" v-slot="scope">
						<slot :scope="scope.row" :name="item.prop"></slot>
					</template>
					<template v-else-if="item.html" v-slot="scope">
						<span :scope="scope.row" v-html="item.html(scope.row,scope.row[item.prop])"></span>
					</template>
					<template v-else-if="item.img" v-slot="scope">
						<el-image
							:scope="scope.row"
							:style="{
								width: item.width || 'auto',
								height: item.height || '80px',
							}"
							class="table_img"
							:src="scope.row[item.prop].split(',')[0]"
							:preview-src-list="scope.row[item.prop].split(',')"
						></el-image>
						<!-- {{scope.row[item.prop]}} -->
					</template>
					<template v-else-if="item.state" v-slot="scope">
						<!--					  {{// (!scope.row.enable||scope.row.enable==0)?'已下线':(testTimeIn(scope.row[item.start||'startTime'],scope.row[item.end||'endTime'])?'已上线':'未上线')}}-->
						{{ scope.row[item.prop] ? '已上线' : '已下线' }}
					</template>
					<template v-else-if="item.time" v-slot="scope">
						{{ scope.row[item.prop] ? parseTime(scope.row[item.prop]) : '未选择' }}
					</template>
					<template v-else-if="item.switch" v-slot="scope">
						<el-switch
							v-if="backType(scope.row[item.prop], 'String')"
							v-model.trim="scope.row[item.prop]"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="'1'"
							:inactive-value="'0'"
							@change="switchFun(item, scope.row)"
						></el-switch>
						<el-switch
							v-if="backType(scope.row[item.prop], 'Number')"
							v-model.trim="scope.row[item.prop]"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="1"
							:inactive-value="0"
							@change="switchFun(item, scope.row)"
						></el-switch>
						<el-switch
							v-if="backType(scope.row[item.prop], 'Boolean')"
							v-model.trim="scope.row[item.prop]"
							active-color="#13ce66"
							inactive-color="#ff4949"
							:active-value="true"
							:inactive-value="false"
							@change="switchFun(item, scope.row)"
						></el-switch>
					</template>
					<template v-else-if="item.actives" v-slot="scope">
						<template v-for="active in item.actives">
							<template v-if="typeof active.name === 'function' ? (active.name(scope.row, scope.$index, scope.row[item.prop]) ? active.name : false) : active.name">
								<!-- 控制样式 -->
								<div
									@click="active.method(scope.row, scope.$index)"
									:key="'' + active.name"
									v-html="typeof active.name === 'function' ? active.name(scope.row) : active.name"
									class="activeDiv"
								></div>
							</template>
						</template>
					</template>
					<template v-if="item.children">
						<div>
							<el-table-column v-for="(i, indexC) in item.children" :key="indexC" :prop="i.prop" :label="i.label" align="center"></el-table-column>
						</div>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div :class="{ hidden: hidden }">
			<el-pagination
				:current-page.sync="listQuery.current"
				:page-size.sync="listQuery.size"
				layout="total, sizes, prev, pager, next, jumper"
				:page-sizes="sizes"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script>
/**
 * @name:
 * @description: 表格二次封装
 * showSortIndex: {
			type: Object,
			// default: { show: false },
			default: () => {
				let _obj = { show: false };
				return _obj;
			},
		},
	例如:	:showSortIndex="{ show: true, lable: '序号' }"
 * headHight 和 refHead: headHight是需要减掉的头部高度优先于refHead相邻头部的ref的高度
 * loadData       fun     一级数据接口函数  二级数据所需id默认会在此获取
 * childrenData   fun     二级数据接口函数  添加此函数默认开启数形结构 并且所有一级数据都会带上childen属性
 * params  obj 初始化的时候需要带的参数
 * column    array   表头数据   ==>
 *   表头参数如下：{
 *     props: string 表头key值
 *     label:string 表头名字
 *     width: number 表头该列的宽度
 *     formatter: fun 自定义格式 Function(row, column, cellValue, index)  row:整条数据实例  column:表头实例  cellValue:该条参数值  index:index
 *     actives: array  操作   {method 事件函数  name 操作名称 }
 *            ==>method：val=>{} val为返回的该行的值
 *            ==>name:string /function  当传入为回调函数时 回调参数返回为该行的值 当返回为false时 该操作按钮默认不显示
 *   }
 * render    boolean  是否需要自定义插槽 父组件插槽：    v-slot:prop值="{scope}" scope为该行值
 * html 函数 直接渲染dom  例如 html:(row)=>`<el-button >取消</el-button>`
 * img boolean渲染成图片
 * eg:
 * <template v-slot:avatar="{scope}">
        <img :src="scope.avatar" class="admin_avater" />
    </template>

 * select    function 开启多选框  传递函数 返回value  绑定函数需要在method中声明  value为选中数组 single为true 多选变成单选  chenckNone为true 隐藏头部全选
 * hidden    boolean  是否显示分页器 不传则默认显示
 * single    boolean  是否开启单选
 * children  Array    是否开启表头嵌套
 *
 *
 * ==================
 * 方法 通过this.$refs.表格名.方法名  调用  eg:this.$refs.table.update({...searchParams}) //搜索并更新表格 searchParams为搜索参数对象
 * reset重置表格  update更新表格  clearSelect清空单选/多选
 * @return:
 */
/*分页器
 * total         number   总条目数
 * current-page.sync      number   当前页数
 * page-size.sync         number   每页限制条数
 * sizes     array    每页显示条目个数，支持 .sync 修饰符
 * layout        string   组件布局，子组件名用逗号分隔
 * hidden        boolean  是否隐藏
 */
import { backType } from '@/components/FormList/utils';
import { parseTime, testTimeIn } from '@/utils';

export default {
	name: 'xtable',
	props: {
		loadData: {
			type: Function,
			required: true,
		},
		showSortIndex: {
			type: Object,
			// default: { show: false },
			default: () => {
				let _obj = { show: false };
				return _obj;
			},
		},
		childrenData: {
			type: Function,
		},
		column: {
			type: Array,
		},

		hidden: {
			type: Boolean,
			default: false,
		},
		params: {
			type: Object,
		},
		select: {
			type: Function,
		},
		single: {
			type: Boolean,
			default: false,
		},
		chenckNone: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Number,
		},
		headHight: {
			type: Number,
			default: () => 0,
		},
		refHead: {
			type: String,
			default: () => '',
		},
		// 额外的高度
		additional: {
			type: [Number, String],
			default: () => 0,
		},
	},
	data() {
		return {
			lastParams: {},
			screenWidth: '',
			topHead: '1000',
			total: 0,
			listQuery: {
				current: 1,
				size: this.params && this.params.size ? this.params.size : 20,
			},
			tableData: [],
			sizes: [5, 10, 20, 30, 50],
			searchParams: {}, //搜索参数,
			activeRow: {}, //选择当前行
			parentId: 0,
			cutId: '',
		};
	},
	mounted() {
		this.getData({ ...this.listQuery, ...this.params });
		this.getHeight();
		window.addEventListener('resize', this.watchWidth);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.watchWidth);
	},
	methods: {
		testTimeIn(start, end) {
			return testTimeIn(start, end);
		},
		parseTime(time) {
			return parseTime(time);
		},
		backType(val, str) {
			return backType(val, str);
		},
		// 获取浏览器宽度
		watchWidth() {
			// const that = this
			window.onresize = () => {
				return (() => {
					this.getHeight();
				})();
			};
		},
		// 获取头部高度
		getHeight() {
			if (this.headHight) {
				this.topHead = this.headHight;
			} else if (this.refHead) {
				let bodyH = this.$root.$children[0].$children[0].$children[2].$el.offsetHeight;
				let headH = (this.topHead = this.$parent.$refs[this.refHead].$el.offsetHeight);
				this.topHead = bodyH - headH - 130 - this.additional;
				// console.log(bodyH,headH, this.topHead)
			} else {
				this.topHead = 500;
			}
		},
		toStr(par) {
			console.log(par);
			return par.toString();
		},
		//切换
		switchFun(item, row) {
			console.log(item);
			let data = { id: row.id, [item.prop]: row[item.prop] };
			item.fun({ ...data })
				.then(res => {
					item.callBack ? item.callBack(res) : this.$message.success('操作成功');
				})
				.finally(() => {
					this.update(this.lastParams);
				});
		},
		getData(params) {
			this.loadData({ ...params }).then(
				res => {
					if (res.code === 200) {
						this.$emit('resData', res.data);
						let list = [];
						if (this.childrenData) {
							list = res.data.records.map(item => {
								item.hasChildren = true;
								return item;
							});
						} else {
							list = res.data.records;
						}
						this.total = res.data.total;
						this.$emit('total', res.data.total);
						// this.tableData = res.data.records;
						this.tableData = res.data.records || res.data;
					}
				},
				err => {
					console.log(err);
				}
			);
		},
		// 修改每页展示条数
		handleSizeChange(val) {
			this.getData({
				current: this.listQuery.current,
				size: val,

				...this.params,
				...this.searchParams,
			});
		},
		// 页数
		handleCurrentChange(val) {
			this.getData({
				size: this.listQuery.size,
				...this.params,
				...this.searchParams,
        current: val,
      });
		},
		// 通过this.$refs.表格名  调用的方法==============
		// 重置表格 刷新
		reset() {
			this.getData({ ...this.params, ...this.listQuery });
		},
		// 更新表格
		update(params) {
			this.searchParams = params;
			this.lastParams = { ...this.params, ...this.listQuery, ...params };
			this.getData({ ...this.params, ...this.listQuery, ...params });
		},
		// 清空选项
		clearSelect() {
			this.$refs.multipleTable.clearSelection();
		},
		//================================================
		// 二级类目
		childrenLoad(row, treeNode, resolve) {
			this.childrenData({ parentId: row.id, size: 100 }).then(res => {
				if (res.success) {
					resolve(res.data.list);
				}
			});
		},
		handleSelect(val, row) {
			if (this.single) {
				if (val.length > 1) {
					this.$refs.multipleTable.clearSelection(); // 清空所有选择
					val.shift();
					this.$refs.multipleTable.toggleRowSelection(row); //  选中当前选择
				}
				let selected = val.length && val.indexOf(row) !== -1;
				// true就是选中，0或者false是取消选中
			}
			let all=val.map(v=>v.id)
      let back=this.tableData.filter(v=>all.includes(v.id)?v:false)
			this.select(back);
		},
		sortChange(val, row) {
			this.$emit('sortChangechild', val);
		},

		handleSelectionChange(val) {
			if (this.single) {
				let posy = val;
				let pos = [];
				posy.forEach(item => {
					pos.push(item.id);
					this.cutId = pos.join(','); //把选中的id已字符串传递出去  例如：'1,3,4,5'
				});
			}
		},

		// 全选按钮
		allSelect(val) {
      let all=val.map(v=>v.id)
      let back=this.tableData.filter(v=>all.includes(v.id)?v:false)
			this.select(back);
		},
	},
};
</script>

<style lang="scss" scoped>
>>> .table_img > img.el-image__inner {
	width: auto !important;
}
.tipleTable {
	//height: 50vh;
	& >>> .el-table__body-wrapper {
		height: 100%;
		overflow: auto;
		//padding-bottom: 48px;
		/*滚动条样式*/
		&::-webkit-scrollbar {
			width: 4px;
			height: 14px;
		}
		//滑块
		&::-webkit-scrollbar-thumb {
			border-radius: 10px;
			-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
			background: #ccc;
		}
		//外层轨道
		&::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: #fafafa;
		}
	}
}
.el-pagination {
	text-align: right;
	padding: 10px 10px;
}
.el-table th {
	background-color: #fafafa;
}
.single thead tr .el-checkbox__input {
	display: none;
}
.chenckNone {
	::v-deep .el-table__header-wrapper .el-checkbox {
		display: none;
	}
}
.activeDiv {
	color: #409eff;
	cursor: pointer;
	display: inline-block;
	padding: 0 10px;
	&:hover {
		color: #66b1ff;
	}
	&:active {
		color: #3a8ee6;
	}
}
// .el-table .cell.el-tooltip {
// 	white-space: pre-wrap;
// 	overflow: hidden;
// 	text-overflow: ellipsis;
// 	display: -webkit-box;
// 	-webkit-line-clamp: 2;
// 	line-clamp: 2;
// 	-webkit-box-orient: vertical;
// }
// .el-tooltip__popper {
// 	max-width: 500px;
// 	// left: 230px;
// }
</style>
