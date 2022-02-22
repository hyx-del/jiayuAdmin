<!--
 * @Author: wei.chen
 * @Date: 2020-06-18 18:56:09
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-15 14:18:07
 * @Descripttion: 专题
-->
<template>
	<div class="specialAreaManage">
		<!-- 头部查询 -->
		<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
			<el-form-item label="专题名称:" size="small" prop="name">
				<el-input v-model="formInline.name" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="状态:" prop="banned">
				<el-select v-model="formInline.banned" placeholder="请选择" size="small">
					<el-option
						v-for="item in states"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" size="small" @click="searchData">查询</el-button>
				<el-button type="primary" size="small" @click="resetForm('formInline')">
					重置
				</el-button>
				<el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
					新建专题
				</el-button>
			</el-form-item>
		</el-form>

		<Table :loadData="getList" :column="column" ref="subjectist">
			<template v-slot:cover="{ scope }">
				<el-image
					:src="scope.cover"
					class="admin_avater"
					:preview-src-list="[scope.cover]"
				/>
			</template>
		</Table>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getSpecialTopic, banSpecialTopic, deleteSpecialTopic } from '@/api/operation';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

export default {
	name: 'specialAreaManage',
	components: {
		Table,
	},
	data() {
		return {
			formInline: {
				banned: null,
				name: '',
			},
			states: [
				{ label: '全部', value: '' },
				{ label: '已停用', value: true },
				{ label: '已启用', value: false },
			],
			shareVisilbe: false,

			// 列表表头数据
			column: [
				{ prop: 'id', label: '序号' },
				{ prop: 'name', label: '专题名称' },
				{ prop: 'itemCount', label: '商品数量' },
				{ prop: 'sortIndex', label: '显示顺序' },
				{ prop: 'creator', label: '创建人' },
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'banned',
					label: '状态',
					formatter: (row, column) => {
						if (row.banned) {
							return '已停用';
						} else {
							return '已启用';
						}
					},
				},
				{
					prop: 'actives',
					label: '操作',
					align: 'left',
					actives: [
						{
							name: '编辑',
							method: val => {
								// console.log(val)
								this.$router.push({
									path: 'addSubject',
									query: { id: val.id, title: '编辑' },
								});
							},
						},
						{
							name: row => {
								return row.banned ? '启用' : '停用';
							},
							method: val => {
								const banned = val.banned ? '启用' : '停用';
								this.$confirm(`确定${banned}专题?`, '提示', {
									type: 'warning',
								}).then(() => {
									banSpecialTopic({ ...val }).then(res => {
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
						{
							name: val => {
								if (val.banned) {
									return '删除';
								}
							},
							method: val => {
								this.$confirm(`确定删除专题?`, '提示', {
									type: 'warning',
								}).then(() => {
									deleteSpecialTopic({ ...val }).then(res => {
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
			return getSpecialTopic;
		},
	},
	methods: {
		// 添加活动
		handleAdd() {
			this.$router.push({ path: 'addSubject', query: { title: '新建' } });
		},
		searchData() {
			this.$refs.subjectist.update({ ...this.formInline });
		},
		// 查询
		onClickSearch() {
			// console.log('======>', this.formInline)
			this.$refs.subjectist.update({ ...this.formInline });
		},
		resetTable() {
			this.$refs.subjectist.reset();
		},
		// 查询的重置事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.searchData();
			// console.log(this.formInline);
		},
		// 停用状态切换
		ban(id) {
			this.fullscreenLoading = true;
			banSpecialTopic({ id: id })
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
.specialAreaManage {
	padding: 20px;
	.admin_avater {
		// height: 50px;
		width: 100px;
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
