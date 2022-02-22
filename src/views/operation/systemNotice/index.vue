<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 10:43:52
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 15:43:35
 * @Descripttion:
-->
<template>
	<div class="systemNotice">
		<!-- @tab-click="handleClick" -->
		<!-- 新增消息按钮 -->
		<el-button ref="button" type="primary" size="small" icon="el-icon-plus" @click="handleAdd('form')">
			新增系统公告
		</el-button>

		<!-- 消息列表 -->
		<Table
			v-if="activeName === 'system_message'"
			:loadData="getList"
			ref="systemTable"
            refHead="button"
			:showSortIndex="{ show: true, lable: '序号' }"
			:column="column"
		>
			<template v-slot:content="{ scope }">
				<el-tooltip class="tip_item" effect="dark" :content="scope.content" placement="top">
					<span>{{ scope.content }}</span>
				</el-tooltip>
			</template>
			<template v-slot:channelName="{ scope }">
				<span
					style="margin-right:8px"
					v-for="(item, index) in scope.channelName.split('|')"
					:key="'channelName' + index"
				>
					{{ item }}
				</span>
			</template>
			<template v-slot:receiveCrowdName="{ scope }">
				<span
					style="margin-right:8px"
					v-for="(item, index) in scope.receiveCrowdName.split('|')"
					:key="'receiveCrowdName' + index"
				>
					{{ item }}
				</span>
			</template>
		</Table>
		<!-- <el-tabs v-model="activeName">
			<el-tab-pane label="系统公告" name="system_message"></el-tab-pane>
			<el-tab-pane label="用户消息" name="user_message">

				<el-button type="primary" size="small" @click="userHandleAdd('form')">
					新增
				</el-button>


				<Table
					v-if="activeName === 'user_message'"
					:loadData="getUserMessageList"
					ref="userMessageTable"
					:column="userMessageColmn"
				>
					<template v-slot:description="{ scope }">
						<el-tooltip
							class="tip_item"
							effect="dark"
							:content="scope.description"
							placement="top"
						>
							<span>{{ scope.description }}</span>
						</el-tooltip>
					</template>
				</Table>
			</el-tab-pane>
		</el-tabs> -->

		<!-- 新增消息模态窗 -->
		<el-dialog
			title="发送系统消息"
			v-if="dialogFormVisible"
			center
			:visible.sync="dialogFormVisible"
			@close="resetForm('form')"
			:close-on-click-modal="false"
		>
			<el-form :model="form" :rules="rules" label-position="top" ref="form">
				<el-form-item label="消息标题" prop="title">
					<el-input
						style="width:100%"
						v-model.trim="form.title"
						maxlength="20"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="消息内容" prop="content">
					<el-input
						type="textarea"
						v-model.trim="form.content"
						:rows="5"
						maxlength="200"
						show-word-limit
					></el-input>
				</el-form-item>
				<!-- <el-form-item label="" prop="content">
					<el-checkbox v-model="form.pushFlag">勾选将在APP进行PUSH</el-checkbox>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetForm('form')">取 消</el-button>
				<el-button type="primary" @click="submitForm('form')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 新增用户消息模态窗 -->
		<!-- <el-dialog
			title="发送用户消息"
			v-if="dialogUserMessageFormVisible"
			center
			:visible.sync="dialogUserMessageFormVisible"
			@close="userResetForm('userMessageForm')"
			:close-on-click-modal="false"
		>
			<el-form
				:model="userForm"
				:rules="userMessageRules"
				label-position="top"
				ref="userMessageForm"
			>
				<el-form-item label="标题" prop="title">
					<el-input
						style="width:100%"
						v-model.trim="userForm.title"
						maxlength="20"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item
					label="接收用户(输入用户ID,ID使用英文逗号分隔)"
					prop="receiveUserIdStr"
				>
					<el-input
						type="textarea"
						v-model.trim="userForm.receiveUserIdStr"
						:rows="6"
						maxlength="3000"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="内容" prop="description">
					<el-input
						type="textarea"
						v-model.trim="userForm.description"
						:rows="5"
						maxlength="200"
						show-word-limit
					></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-checkbox v-model="userForm.pushFlag">勾选将在APP进行PUSH</el-checkbox>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="userResetForm('userMessageForm')">取 消</el-button>
				<el-button type="primary" @click="userSubmitForm('userMessageForm')">
					确 定
				</el-button>
			</div>
		</el-dialog> -->
		<!-- 错误的用户Id 列表 -->
		<!-- <el-dialog
			title="错误的用户Id 列表"
			:visible.sync="errorUserDialogVisible"
			width="40%"
			:before-close="errorUserHandleClose"
		>
			<div v-text="errorUserId"></div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="errorUserDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="errorUserDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog> -->
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getSystemNoticeList, addSystemNotice, delSystemNotice } from '@/api/operation';
import { parseTime } from '@/utils';
export default {
	name: 'systemNotice',
	components: {
		Table,
	},
	data() {
		const checkedUserId = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入'));
			} else {
				if (!/^[0-9,]{1,}$/.test(value)) {
					callback(new Error('只能输入数字或者英文逗号'));
				} else {
					callback();
				}
			}
		};
		return {
			errorUserId: '',
			errorUserDialogVisible: false,
			activeName: 'system_message',
			column: [
				// { prop: 'id', label: '序号', width: 60 },
				{ prop: 'title', label: '标题', width: '360' },
				{ prop: 'content', label: '内容', render: true },
				{
					prop: 'createTime',
					label: '发送时间',
					width: '160',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'sendName', label: '操作人', width: '120' },

				{
					prop: 'action',
					label: '操作',
					width: '120',
					actives: [
						{
							name: '删除',
							method: val => {
								console.log(val);
								this.$confirm('此操作将永久删除该消息, 是否继续?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning',
								}).then(() => {
									delSystemNotice({ id: val.id }).then(res => {
										if (res.code === 200) {
											this.$message({
												type: 'success',
												message: '删除成功!',
											});
											this.$refs.systemTable.reset();
										}
									});
								});
							},
						},
					],
				},
			],
			userMessageColmn: [
				{ prop: 'id', label: '序号', width: 60 },
				{ prop: 'title', label: '标题' },
				{ prop: 'description', label: '内容', render: true },
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{ prop: 'operator', label: '操作人', width: 100 },
				{ prop: 'receiveUserIdStr', label: '接收用户（ID）', width: 500, align: 'left' },
			],
			form: {
				// title: '', // 标题
				pushFlag: false,
				title: '',
				content: '', // 发送消息的内容
			},
			userForm: {
				description: null,
				pushFlag: false,
				receiveUserIdStr: null,
				title: null,
			},
			rules: {
				title: [
					{ required: true, message: '请输入消息标题', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
				],
				content: [{ required: true, message: '请填写消息内容', trigger: 'blur' }],
			},
			userMessageRules: {
				title: [
					{ required: true, message: '请输入消息标题', trigger: 'blur' },
					{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
				],
				receiveUserIdStr: [{ required: true, validator: checkedUserId, trigger: 'change' }],
				description: [{ required: true, message: '请填写消息内容', trigger: 'blur' }],
			},
			dialogFormVisible: false,
			dialogUserMessageFormVisible: false,
		};
	},
	computed: {
		getList() {
			return getSystemNoticeList;
		},
	},
	methods: {
		errorUserHandleClose(done) {
			this.errorUserId = '';
			done();
			// this.$confirm('确认关闭？')
			// 	.then(_ => {
			// 		this.errorUserId = '';
			// 		done();
			// 	})
			// 	.catch(_ => {
			// 		this.errorUserId = '';
			// 	});
		},

		// 新增消息按钮事件
		handleAdd() {
			this.dialogFormVisible = true;
		},
		// 默态窗确定事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					console.log(this.form);
					addSystemNotice({ ...this.form }).then(res => {
						if (res.code === 200) {
							this.resetForm(formName);
							this.dialogFormVisible = false;
							this.$message({
								type: 'success',
								message: '新增成功!！',
							});

							this.$refs.systemTable.reset();
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 默态窗取消事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible = false;
		},
		// 新增消息按钮事件
		userHandleAdd() {
			this.dialogUserMessageFormVisible = true;
		},
		// 默态窗确定事件
		userSubmitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					addUserMessageInfo({ ...this.userForm }).then(res => {
						if (res.code === 200) {
							this.userResetForm(formName);
							this.dialogUserMessageFormVisible = false;

							this.$message({
								type: 'success',
								message: '成功!！',
							});
							if (res.data && res.data.length > 0) {
								this.errorUserId = res.data;
								this.errorUserDialogVisible = true;
							}

							this.$refs.userMessageTable.reset();
						}
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// 默态窗取消事件
		userResetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogUserMessageFormVisible = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.systemNotice {
	padding: 20px;
}
.tip_item {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
