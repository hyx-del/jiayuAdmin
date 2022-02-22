<!--
 * @Author: tianhao
 * @Date: 2020-06-18 19:56:18
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:08:16
 * @Descripttion: 
-->
<template>
	<div class="feedback">
		<el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
			<el-form-item label="发起人ID" prop="createUserId">
				<el-input
					placeholder="请输入用户昵称"
					prefix-icon="el-icon-search"
					v-model.number="formInline.createUserId"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="发起人昵称" prop="createUserName">
				<el-input
					placeholder="请输入用户昵称"
					prefix-icon="el-icon-search"
					v-model.trim="formInline.createUserName"
					size="small"
				></el-input>
			</el-form-item>
			<el-form-item label="发起时间:">
				<el-date-picker
					@change="onChangeDate"
					v-model.trim="formInline.regDate"
					type="daterange"
					size="small"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					:default-time="['00:00:00', '23:59:59']"
					value-format="timestamp"
				></el-date-picker>
			</el-form-item>
			<el-button type="primary" size="small" @click="onSubmit">查询</el-button>
			<el-button type="primary" size="small" @click="resetForm('formInline')">
				重置
			</el-button>
		</el-form>
		<!-- 表格 -->
		<Table
			:loadData="getList"
			:showSortIndex="{ show: true, lable: '序号' }"
			ref="systemTable"
			:column="column"
		>
			<template v-slot:ideaUrl="{ scope }">
				<el-image
					class="banner_img"
					v-bind:src="scope.ideaUrl"
					:preview-src-list="scope.ideaUrl"
				/>
			</template>
			<template v-slot:content="{ scope }">
				<el-tooltip class="tip_item" effect="dark" :content="scope.content" placement="top">
					<span>{{ scope.content }}</span>
				</el-tooltip>
			</template>
			<template v-slot:reply="{ scope }">
				<el-tooltip class="tip_item" effect="dark" :content="scope.reply" placement="top">
					<span>{{ scope.reply }}</span>
				</el-tooltip>
			</template>
		</Table>
		<el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" title="意见反馈图片">
			<div class="demo-image__preview">
				<el-image
					style="width: 100px;margin-right:10px"
					v-for="item in srcs"
					:key="'img_' + item"
					:src="item"
					:preview-src-list="srcs"
				></el-image>
			</div>
		</el-dialog>
		<el-dialog
			title="回复"
			v-if="dialogFormVisible"
			center
			:visible.sync="dialogFormVisible"
			@close="resetForm('formData')"
			:close-on-click-modal="false"
			:destroy-on-close="true"
		>
			<el-form :model="formData" :rules="rules" label-position="top" ref="formData">
				<el-form-item label="回复内容" prop="reply">
					<el-input
						type="textarea"
						v-model.trim="formData.reply"
						:rows="5"
						maxlength="200"
						show-word-limit
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDialog('formData')">取 消</el-button>
				<el-button type="primary" @click="submitForm('formData')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { getFeedBackList, replyFeedback } from '@/api/operation';
import { platform } from '@/utils/systemEnum';
import { Message } from 'element-ui';
export default {
	components: {
		Table,
	},
	data() {
		return {
			dialogFormVisible: false,
			formInline: {
				createUserName: '',
				createUserId: null,
			},
			dialogVisible: false,
			formData: {},
			srcs: [],
			options: [
				{ label: '使用体验', value: 'USE' },
				{ label: '购物流程体验', value: 'SHOPPING' },
				{ label: '其他建议', value: 'OTHER' },
			],
			column: [
				{
					prop: 'content',
					label: '意见内容',
					render: true,
				},
				// {
				// 	prop: 'ideaUrl',
				// 	label: '图片',
				// 	render: true,
				// },
				{ prop: 'title', label: '意见标题' },
				{
					prop: 'createTime',
					label: '发起时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'createUserName',
					label: '发起人昵称',
				},
				{
					prop: 'createUserId',
					label: '发起人ID',
				},

				{
					prop: 'platform',
					label: '平台',
					formatter: row => {
						let _str = '';
						for (const key in platform) {
							if (key == row.platform) {
								// console.log(platform[key]);
								_str = platform[key];
							}
						}
						return _str;
					},
				},
				{
					prop: 'version',
					label: '版本记录',
				},
				{
					prop: 'reply',
					label: '回复内容',
					render: true,
				},
				{
					prop: 'state',
					label: '状态',
					formatter: row => {
						return row.state == 1 ? '已处理' : '未处理';
					},
				},
				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: val => {
								if (val.ideaUrl === '' || val.ideaUrl === null) {
									return false;
								} else {
									return '查看图片';
								}
							},
							method: val => {
								if (val.ideaUrl) {
									console.log(val.ideaUrl);
									let arr = JSON.parse(val.ideaUrl);
									const _tempUrl = [];
									arr.forEach(item => {
										_tempUrl.push(item.url);
									});
									this.srcs = _tempUrl;
									this.dialogVisible = true;
								} else {
									Message.error('用户未上传图片');
								}
							},
						},
						{
							name: val => {
								if (val.state) {
									return '修改回复';
								} else {
									return '回复';
								}
							},
							method: val => {
								this.formData = { ...val };
								if (!val.state) {
									this.formData.reply = null;
								}

								this.dialogFormVisible = true;
							},
						},
					],
				},
			],
			rules: {
				reply: [{ required: true, message: '请填写消息内容', trigger: 'blur' }],
			},
		};
	},
	computed: {
		getList() {
			return getFeedBackList;
		},
	},
	methods: {
		onSubmit() {
			// this.getList()
			// 用户id 的限制
			const _parData = { ...this.formInline };
			const _reg = /[0-9]{1,10}/;
			if (_parData.createUserId != null && !_reg.test(_parData.createUserId)) {
				this.$message({
					type: 'error',
					message: '发起人ID 输入格式不对，只能是纯数字',
				});
				return false;
			}
			delete _parData.regDate;
			this.$refs.systemTable.update(_parData);
		},
		// 默态窗确定事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					const _par = { ...this.formData };

					replyFeedback(_par).then(res => {
						if (res.code === 200) {
							this.resetForm(formName);
							this.dialogFormVisible = false;
							this.$message({
								type: 'success',
								message: '回复成功!！',
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
		// 重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.formInline.regDate = [];
		},
		closeDialog(formName) {
			this.resetForm(formName);
			this.dialogFormVisible = false;
		},
		onChangeDate(value) {
			if (value) {
				this.formInline.startTime = parseTime(value[0]);
				this.formInline.endTime = parseTime(value[1]);
			} else {
				this.formInline.startTime = null;
				this.formInline.endTime = null;
			}
		},
	},
};
</script>

<style lang="scss">
.feedback {
	padding: 20px;
	.imgSrc {
		height: 100px;
		width: 100px;
	}
	.imgSrc + .imgSrc {
		margin-left: 10px;
	}
}
.banner_img {
	width: 100px;
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
.el-tooltip__popper {
	max-width: 500px;
}
</style>
