<!--
 * @Author: wei.chen
 * @Date: 2020-07-17 11:34:49
 * @LastEditors: wei.chen
 * @LastEditTime: 2020-12-17 17:05:12
 * @Descripttion: 
-->
<template>
	<div class="floatingWindowManagement">
		<h4>浮窗信息管理</h4>
		<el-table :data="tableData" border style="width: 100%">
			<el-table-column prop="pid" label="序号" width="150">1</el-table-column>
			<el-table-column prop="name" label="图片" width="160">
				<template slot-scope="scope">
					<img style="width:120px" :src="scope.row.img" />
				</template>
			</el-table-column>
			<el-table-column prop="link" label="跳转链接"></el-table-column>
			<el-table-column prop="editor" label="修改人" width="120"></el-table-column>
			<el-table-column prop="updateTime" label="修改时间" width="280"></el-table-column>
			<el-table-column label="状态" width="100">
				<template slot-scope="scope">
					<div>
						{{ scope.row.openFlag ? '已打开' : '已关闭' }}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" @click="openEditDialog(scope.row)" size="small">
						编辑
					</el-button>
					<el-button type="text" @click="changeFlag(scope)" size="small">
						{{ scope.row.openFlag ? '关闭' : '打开' }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-dialog
			title="编辑"
			:visible.sync="editVisible"
			:before-close="
				() => {
					resetForm('editFormRef');
				}
			"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:destroy-on-close="true"
			width="600px"
		>
			<el-form :model="editForm" :rules="formRules" ref="editFormRef">
				<el-form-item prop="link" label="跳转链接">
					<el-input style="width:396px" v-model="editForm.link"></el-input>
				</el-form-item>
				<el-form-item label="上传图片" prop="img">
					<ImgUpload v-model.trim="editForm.img" :isGif="true" :size="2000"></ImgUpload>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="resetForm('editFormRef')">取 消</el-button>
				<el-button type="primary" @click="editRedPackFun('editFormRef')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
// import { getOrderRule, editOrderRule } from '@/api/order';
import ImgUpload from '@/components/upload/index';
import { getFloatADInfo, editFloatAd } from '@/api/marketManage';
import { Message } from 'element-ui';

export default {
	name: 'floatingWindowManagement',
	components: {
		ImgUpload,
	},
	data() {
		// 正整数校检 validator
		const checkURL = (rule, value, callback) => {
			let _checkVal = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(
				value
			);
			if (value === '') {
				callback(new Error('请输入'));
			} else if (!_checkVal) {
				return callback(new Error('请输入正确的url访问地址'));
			} else {
				callback();
			}
		};
		return {
			editVisible: false,
			tableData: [
				{
					pid: 1,
					img: null,
					link: '',
					editor: '',
					openFlag: false,
					updateTime: '',
				},
			],
			// 订单规则表单数据
			editForm: {
				link: null,
				img: null,
			},
			// 订单规则表单校检
			formRules: {
				link: [{ required: true, validator: checkURL, trigger: 'blur' }],
				img: [{ required: true, message: '图片必传', trigger: 'blur' }],
			},
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			getFloatADInfo().then(res => {
				if (res.success) {
					this.tableData = [res.data || {}];
					// this.editForm = res.data;
				}
			});
		},
		changeFlag(item) {
			let _state = false;
			if (item.row.openFlag) {
				_state = false;
			} else {
				_state = true;
			}

			editFloatAd({ ...item.row, openFlag: _state }).then(res => {
				Message.success('修改成功！！！');

				this.initData();
			});
		},
		// 打开编辑界面
		openEditDialog(item) {
			this.editForm = item;
			this.editVisible = true;
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.editVisible = false;
		},
		editRedPackFun(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					editFloatAd({
						...this.tableData[0],
						...this.editForm,
					}).then(res => {
						Message.success('修改成功！！！');
						this.$refs[formName].resetFields();
						this.editVisible = false;
						this.initData();
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.floatingWindowManagement {
	padding: 20px;
}
</style>
