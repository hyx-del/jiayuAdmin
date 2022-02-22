<!--
 * @Author: wei.chen
 * @Date: 2020-06-18 18:56:09
 * @LastEditors: wei.chen
 * @LastEditTime: 2021-03-12 14:48:11
 * @Descripttion: 底部角标管理
-->
<template>
	<div class="bottomCornerManage">
		<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
			新建
		</el-button>
		<Table :loadData="getList" :column="column" ref="cornerList">
			<template v-slot:itemImg="{ scope }">
				<img :src="scope.iconUrl" class="admin_avater" />
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getSubScriptList, banState } from '@/api/subScript';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

export default {
	name: 'bottomCornerManage',
	components: {
		Table,
	},
	data() {
		return {
			shareVisilbe: false,
			corner: {}, // 优惠券信息

			// 优惠券列表表头数据
			column: [
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'name', label: '活动名称' },
				{
					prop: 'itemImg',
					label: '角标图片',
					render: true,
				},
				{
					prop: 'itemName',
					label: '关联商品数',
					formatter: row => {
						const _temp = row.itemId.split(',');
						return _temp.length - 1;
					},
				},

				{
					prop: 'startTime',
					label: '开始时间',
					formatter: (row, column) => {
						return parseTime(row.startTime);
					},
				},
				{
					prop: 'itemSkuId',
					label: '状态',
					formatter: (row, column) => {
						if (row.banned) {
							return '已停用';
						} else {
							if (row.startTime > new Date().getTime()) {
								return '未开始';
							} else {
								return '进行中';
							}
						}
					},
				},
				{
					prop: 'actives',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								// console.log(val)
								this.$router.push({
									path: 'addScript',
									query: { id: val.id, title: '编辑' },
								});
							},
						},
						{
							name: row => {
								return row.banned ? '启用' : '停用';
							},
							method: val => {
								let banned = val.banned ? '启用' : '禁用';
								this.$confirm(`确定${banned}角标?`, '提示', {
									type: 'warning',
								}).then(() => {
									banState({ ...val }).then(res => {
										if (res.success) {
											this.$message({
												type: 'success',
												message: '操作成功！',
											});
											this.resetTable();
										}
									});
								});
							},
						},
					],
				},
			],

			fullscreenLoading: false, // 加载 loading
		};
	},
	beforeRouteLeave(to, from, next) {
		to.meta.title = to.query.title;
		next();
	},
	computed: {
		getList() {
			return getSubScriptList;
		},
	},
	methods: {
		// 添加活动
		handleAdd() {
			this.$router.push({ path: 'addScript', query: { title: '新建' } });
		},

		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.cornerList.update({ ...this.formInline });
		},
		resetTable() {
			this.$refs.cornerList.reset();
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			console.log(this.formInline);
		},
		// 禁用状态切换
		ban(id) {
			this.fullscreenLoading = true;
			banState({ id: id })
				.then(res => {
					if (res.success) {
						setTimeout(() => {
							this.fullscreenLoading = false;
							Message.success('操作成功！');
						}, 1000);
					}
				})
				.catch(err => {
					setTimeout(() => {
						this.fullscreenLoading = false;
					}, 1000);
				});
		},
		// 图片转换格式的方法
		dataURLToBlob(dataurl) {
			// console.log('======>>dataur', dataurl);
			let arr = dataurl.split(',');
			let mime = arr[0].match(/:(.*?);/)[1];
			let bstr = atob(arr[1]);
			let n = bstr.length;
			let u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], { type: mime });
		},
	},
};
</script>

<style lang="scss" scoped>
.bottomCornerManage {
	padding: 20px;
	.admin_avater {
		height: 50px;
		width: 50px;
	}
	.el-dialog__body {
		text-align: center;
		display: flex;
		flex-direction: column;
		// justify-content: center;
		align-items: center;
		div {
			padding: 10px;
		}
	}
	.qr-code-box {
		display: flex;
		justify-content: center;
	}
	// .qr_code_pic {
	// 	width: 300px;
	// 	height: 300px;
	// }
}
</style>
