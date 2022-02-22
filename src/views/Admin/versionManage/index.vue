<!--
 * @Author: wei.chen
 * @Date: 2020-08-13 16:28:12
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:46:22
 * @Descripttion:
-->
<!---->
<template>
	<div class="versionManage">
		<el-row ref="topHead">
			<!-- 搜索查询 -->
			<el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
				<el-form-item label="平台：" prop="platform">
					<el-select size="small" v-model="formInline.platform" placeholder="选择平台">
						<el-option label="Android" value="Android"></el-option>
						<el-option label="IOS" value="IOS"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提示状态：" prop="state">
					<el-select size="small" v-model="formInline.state" placeholder="选择状态">
						<el-option label="强制升级" value="1"></el-option>
						<el-option label="提示升级" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="onClickSearch('formInline')">
						查询
					</el-button>
					<el-button type="primary" size="small" @click="resetForm('formInline')">
						重置
					</el-button>
				</el-form-item>
			</el-form>
			<!-- 表格 -->
			<el-button type="primary" icon="el-icon-plus" @click="addVers" size="small">
				新增版本
			</el-button>
		</el-row>
		<Table :loadData="getList" refHead="topHead" :column="column" ref="TableList" :showSortIndex="{ show: true, lable: '序号'}"></Table>
		<!-- 新增/编辑版本模态窗 -->
		<el-dialog
			:title="title"
			center
			:visible.sync="dialogFormVisible"
			v-if="dialogFormVisible"
			@close="resetForm('form')"
			width="860px"
			custom-class="role_dialog"
			:close-on-click-modal="false"
		>
			<el-form :inline="true" :model="form" :rules="rules" ref="form" label-position="top">
				<el-form-item label="平台：" prop="platform" class="item">
					<el-select v-model="form.platform" placeholder="请选择">
						<el-option label="Android" value="Android"></el-option>
						<el-option label="IOS" value="IOS"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="版本号" prop="version" class="item">
					<el-input v-model="form.version" maxlength="8" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="内部版本号" prop="code" class="item">
					<el-input
						v-model.number="form.code"
						maxlength="6"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item label="审核状态" prop="enable" class="item">
					<el-select v-model="form.enable" placeholder="请选择">
						<el-option label="已通过" :value="'1'"></el-option>
						<el-option label="未通过" :value="'0'"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="提示状态" prop="state" class="item">
					<el-select v-model="form.state" placeholder="请选择">
						<el-option label="强制升级" :value="'1'"></el-option>
						<el-option label="提示升级" :value="'0'"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="下载地址" prop="downloadUrl" class="item">
					<el-input v-model.trim="form.downloadUrl" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="更新描述" prop="text" class="width_item">
					<el-input
						type="textarea"
						v-model.trim="form.text"
						placeholder="请输入"
						rows="5"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('form')">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import { deleteVersions, editVersions, addVersions, getVersionsList } from '@/api/admin';
export default {
	name: 'versionManage',
	components: {
		Table,
	},
	data() {
		const code = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('内部版本号不能为空'));
			} else if (!/^[1-9][0-9]{0,5}$/.test(Number(value))) {
				return callback(new Error('请输入1~6位的正数字'));
			} else {
				callback();
			}
		};
		const version = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('版本号不能为空'));
			} else if (!/^[0-9][.0-9]{4,7}$/.test(value)) {
				return callback(new Error('请输入数字和小数点'));
			} else {
				callback();
			}
		};
		const downloadUrl = (rule, value, callback) => {
			// const checkedURL = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\/.?/.test(
			// 	value
			// )
			const checkedURL = /(http|https):\/\/([\w.]+\/?)\S*/.test(value);
			if (!value) {
				return callback(new Error('请输入下载地址'));
			} else if (!checkedURL) {
				return callback(new Error('请输入以http或https协议开头的地址'));
			} else {
				return callback();
			}
		};
		return {
			// 搜索查询数据
			formInline: {
				platform: null, // 平台
				state: null, // 提示状态
			},
			// 表头
			column: [
				{
					prop: 'platform',
					label: '平台',
					formatter: row => {
						if (row.platform === 'IOS') {
							return 'IOS';
						} else {
							return 'Android';
						}
					},
				},
				{
					prop: 'version',
					label: '版本号',
				},
				{width:"100px",
					prop: 'code',
					label: '内部版本号',
				},
				{
					prop: 'enable',
					label: '审核状态',
					formatter: row => {
						if (row.enable == 1) {
							return '已通过';
						} else {
							return '未通过';
						}
					},
				},
				{
					prop: 'state',
					label: '提示状态',
					formatter: row => {
						if (row.state == 1) {
							return '强制升级';
						} else {
							return '提示升级';
						}
					},
				},
				{ prop: 'text', label: '更新描述' ,width:"630px"},
				{ prop: 'downloadUrl', label: '下载地址',width:"200px" },
				{ prop: 'creator', label: '创建人' ,width:"110px"},
				{width:"165px" ,
					prop: 'updateTime',
					label: '更新时间',
					formatter: row => {
						return parseTime(row.updateTime);
					},
				},
				{width:"100px" ,
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.id = val.id;
								this.title = '编辑版本';
								this.dialogFormVisible = true;
								this.form = { ...val };
							},
						},
						{
							name: '删除',
							method: val => {
								this.$confirm('此操作将永久删除, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								}).then(() => {
									deleteVersions({ id: val.id }).then(res => {
										if (res.code === 200) {
											this.$message.success('操作成功');
											this.$refs.TableList.reset();
										} else {
											this.$$message.error(res.msg);
										}
									});
								});
							},
						},
					],
				},
			],
			// 模态窗数据
			dialogFormVisible: false,
			form: {
				// creator: null, //
				text: null, // 更新描述
				downloadUrl: null, // 下载地址
				state: null, // 提示状态
				enable: null, //审核状态
				platform: null, // 平台
				version: null, // 版本号
			},
			id: null,
			rules: {
				text: [{ required: true, message: '请输入更新描述', trigger: 'blur' }],
				platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
				enable: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
				state: [{ required: true, message: '请选择提示状态', trigger: 'change' }],
				downloadUrl: [{ required: true, validator: downloadUrl, trigger: 'blur' }],
				code: [{ required: true, validator: code, trigger: 'blur' }],
				version: [{ required: true, validator: version, trigger: 'blur' }],
			},
			title: '', // 模态窗标题
		};
	},
	computed: {
		getList() {
			return getVersionsList;
		},
	},
	methods: {
		// 搜索查询
		onClickSearch() {
			this.$refs.TableList.update({ ...this.formInline });
		},
		// 新增版本 Btu 事件
		addVers() {
			this.dialogFormVisible = true;
			this.title = '新增版本';
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.title === '新增版本') {
						addVersions({ ...this.form }).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增版本成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
						editVersions({ ...this.form }).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('修改成功！！！');
								this.$refs.TableList.reset();
							}
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 模态窗取消事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
	},
};
</script>
<style lang="scss" scoped>
.versionManage {
	padding: 20px;
	.item {
		width: 45%;
		margin-right: 20px;
		.el-select {
			width: 100%;
		}
	}
	.width_item {
		width: 93%;
		.el-form-item__content {
			width: 100%;
		}
	}
}
</style>
