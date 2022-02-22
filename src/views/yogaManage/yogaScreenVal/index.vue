<!--
 * @Author: wei.chen
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2021-09-10 15:55:22
 * @LastEditors: jiu yin zhen jing
 * @Description: 系统账号管理
-->
<template>
	<div
		class="commonPage"
		:body-style="{ padding: '20px' }"
	>
		<el-row ref="head">
			<h3>筛选条件名称:{{ itemName }}</h3>
			<div class="header_flow">
				<el-button
					type="primary"
					size="small"
					icon="el-icon-plus"
					@click="handleAdd"
				>
					新增筛选数据
				</el-button>
				<el-button
					type="primary"
					size="small"
					icon="el-icon-arrow-left"
					@click="gotoPageParent()"
				>
					返回
				</el-button>
			</div>
		</el-row>
		<Table
			:loadData="getList"
			refHead="head"
			:params="{id:pid}"
			:column="column"
			ref="TableList"
		></Table>
		<!-- 新增/编辑版本模态窗 -->
		<el-dialog
			:title="title"
			center
			:visible.sync="dialogFormVisible"
			v-if="dialogFormVisible"
			@close="resetForm('form')"
			width="460px"
			custom-class="role_dialog"
			:close-on-click-modal="false"
		>
			<el-form
				:model="form"
				:rules="rules"
				ref="formRef"
				label-position="top"
			>
				<el-form-item
					label="筛选条件名称:"
					prop="parName"
					class="item"
				>
					<el-input
						v-model.trim="form.parName"
						disabled="disabled"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item
					label="筛选条件值:"
					prop="name"
					class="item"
				>
					<el-input
						v-model.trim="form.name"
						placeholder="请输入"
					></el-input>
				</el-form-item>
				<el-form-item
					label=" 顺序:"
					prop="sort"
					class="item"
				>
					<el-input
						v-model.number="form.sort"
						maxlength="3"
						placeholder="请输入"
					></el-input>
				</el-form-item>
			</el-form>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button @click="resetForm('formRef')">取 消</el-button>
				<el-button
					type="primary"
					@click="submitForm('formRef')"
				>确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import xtable from '@/components/Table';
import CropperImg from '@/components/cropperImg/index';
import { getScreenList,editSubScreen,addScreen,editSubState } from '@/api/yogaManage';
import { Message } from 'element-ui';
import Table from "@/components/Table";
export default {
	components: {
		xtable,
		CropperImg,
		Table,
	},
	data() {
		const orderCode=(rule,value,callback) => {
			if(!/^[1-9][0-9]{0,3}$/.test(value)) {
				return callback(new Error('请输入大于1小于9999的整数'));
			} else {
				callback();
			}
		};
		return {
			column: [
				{
					prop: 'name',
					label: '筛选值',
				},
				{
					prop: 'sort',
					label: '顺序',
				},
				{
					prop: 'state',
					label: '启用/禁用',
					switch: true,
					fun: editSubState
				},
				{
					prop: 'action',
					label: '操作',
					fixed: 'right',
					// width:50,
					actives: [
						{
							name: '编辑',
							method: val => {
								this.gotoPage(val)
							},
						},
					],
				},
			],
			pid: '',
			itemName: null,
			categoryData: [],
			// 模态窗数据
			dialogFormVisible: false,
			form: {
				parentId: null,
				parName: null,
				name: null,
				order: null,
				id: ''
			},
			rules: {
				name: [{ required: true,message: '请输入',trigger: 'blur' }],
				sort: [{ required: true,validator: orderCode,trigger: 'blur' }],
			},
			title: '', // 模态窗标题,
			parName: ''
		};
	},
	computed: {
		getList() {
			return getScreenList
		}
	},
	created() {
		this.itemName=this.$route.query.name||'';
		this.form.parName=this.$route.query.name||'';
		this.parName=this.$route.query.name||'';
		this.pid=this.$route.query.id||'';
		this.form.parentId=this.$route.query.id||'';
	},
	mounted() {
	},
	methods: {
		handleAdd() {
			this.dialogFormVisible=true;
			this.title='新增筛选数据';
			this.form={ parName: this.parName,parentId: this.$route.query.id||'' }
		},
		gotoPage(item) {
			this.dialogFormVisible=true;
			this.title='编辑筛选数据';
			this.form={ ...item };
			this.form.parName=this.parName
			// console.log(item);
			// todo
			// this.$router.push();
		},
		gotoPageParent(item) {
			this.$router.push({
				path: '/content/course/yogaScreen',
			});
		},
		// 模态窗取消事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogFormVisible=false;
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if(valid) {
					if(this.title==='新增筛选数据') {
						addScreen({ ...this.form }).then(res => {
							if(res.code===200) {
								this.dialogFormVisible=false;
								Message.success('新增成功！！！');
								this.$refs.TableList.update()
							}
						});
					} else {
						editSubScreen({ ...this.form }).then(res => {
							if(res.code===200) {
								this.dialogFormVisible=false;
								Message.success('修改成功！！！');
									this.$refs.TableList.update()
							}
						});
					}
				} else {
					return false;
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.header_flow {
	display: flex;
	justify-content: space-between;
	padding: 16px 0;
}
.admin_avater {
	height: 40px;
	width: 40px;
}
.yoga_screen_info {
	.item {
		width: 100%;
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
