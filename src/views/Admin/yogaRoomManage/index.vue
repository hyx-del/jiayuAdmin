<!--
 * @Author: wei.chen
 * @Date: 2020-08-13 16:28:12
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 16:45:11
 * @Descripttion:
-->
<!---->
<template>
	<div class="versionManage">
		<!-- 搜索查询 -->
		<el-form :inline="true" :model="searchfrom" ref="searchfrom" class="demo-form-inline">
			<el-form-item prop="name" label="名店名称:">
				<el-input
					v-model.trim="searchfrom.name"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>
			<el-form-item prop="cityName" label="所属城市:">
				<el-input
					v-model.trim="searchfrom.cityName"
					size="small"
					placeholder="请输入"
					prefix-icon="el-icon-search"
				></el-input>
			</el-form-item>

			<el-form-item label="门店状态：" prop="state">
				<el-select size="small" v-model="searchfrom.state" placeholder="选择状态">
					<el-option label="全部" value=""></el-option>
					<el-option label="启用" value="1"></el-option>
					<el-option label="禁用" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="onClickSearch('searchfrom')">
					查询
				</el-button>
				<el-button type="primary" size="small" @click="resetForm('searchfrom')">
					重置
				</el-button>
        <!-- 表格 -->
        <el-button type="primary" icon="el-icon-plus" @click="addVers" size="small">
          新增门店
        </el-button>
			</el-form-item>
		</el-form>

		<Table :loadData="getList" :column="column" ref="TableList" refHead="searchfrom" :showSortIndex="{ show: true, lable: '序号'}">
			<template v-slot:state="{ scope }">
				<el-switch
					v-model.trim="scope.state"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="'1'"
					:inactive-value="'0'"
					@change="bannedChange(scope)"
				></el-switch>
			</template>
		</Table>
		<!-- 新增/编辑门店模态窗 -->
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
				<el-form-item label="门店名称:" prop="name" size="small" class="item">
					<el-input v-model.trim="form.name" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="顺序:" prop="orders" size="small" class="item">
					<el-input v-model.trim="form.orders" placeholder="请输入"></el-input>
				</el-form-item>

				<el-form-item label="地址" prop="addressList" size="small" class="item">
					<el-cascader
						v-if="form.addressList.length > 1 || title == '新增门店'"
						v-model="form.addressList"
						:options="optionsList"
						@change="addressHandleChange"
					></el-cascader>
				</el-form-item>
				<!-- class="width_item" -->
				<el-form-item label="详细地址" prop="address" class="item">
					<el-input
						type="textarea"
						v-model.trim="form.address"
						placeholder="请输入"
						rows="3"
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
//cdn已全局引入 在config.js里
// import { regionData, CodeToText } from 'element-china-area-data';
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';
import {delSalesRoom, editSalesRoom, addSalesRoom, getSalesRoomList, salesroomState} from '@/api/admin';
export default {
	name: 'versionManage',
	components: {
		Table,
	},
	data() {
		const versionCode = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('顺序号不能为空'));
			} else if (!/^[1-9][0-9]{0,3}$/.test(value)) {
				return callback(new Error('请输入大于1小于9999的整数'));
			} else {
				callback();
			}
		};

		return {
			// 搜索查询数据
			searchfrom: {
				name: null, // 平台
				cityName: null, // 提示状态
				state: null, //  状态
			},
			optionsList: regionData,
			// 表头
			column: [
				{
					prop: 'name',
					label: '门店名称',
				},
				{
					prop: 'cityName',
					label: '所属城市',
				},
				{
					prop: 'address',
					label: '地址',
				},
				{
					prop: 'orders',
					label: '顺序',
				},
				{
				  prop: 'state',
          label: '启用/禁用',
          // render:true
          switch: true,
          fun:salesroomState
        },

				{
					prop: 'action',
					label: '操作',
					actives: [
						{
							name: '编辑',
							method: val => {
								this.id = val.id;
								this.title = '编辑门店';
								this.dialogFormVisible = true;

								const _par = {
									// addressList: [val.province, val.city, val.county],
									addressList: [
										val.provinceId + '',
										val.cityId + '',
										val.countyId + '',
									],
									...val,
								};
								this.form = _par;
								// console.log(this.form);
							},
						},
						// {
						// 	name: '删除',
						// 	method: val => {
						// 		this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						// 			confirmButtonText: '确定',
						// 			cancelButtonText: '取消',
						// 			type: 'warning',
						// 		}).then(() => {
						// 			delSalesRoom({ id: val.id }).then(res => {
						// 				if (res.code === 200) {
						// 					this.$message.success('操作成功');
						// 					this.$refs.TableList.reset();
						// 				} else {
						// 					this.$$message.error(res.msg);
						// 				}
						// 			});
						// 		});
						// 	},
						// },
					],
				},
			],
			// 模态窗数据
			dialogFormVisible: false,
			regionData: null,
			form: {
				name: null, // 门店
				cityName: null, //所属城市
				addressList: [], // 省市区
				address: null, // 详细地址
				orders: null, // 排序
			},
			id: null,
			rules: {
				name: [{ required: true, message: '请输入', trigger: 'blur' }],
				orders: [{ required: true, validator: versionCode, trigger: 'blur' }],
				address: [{ required: true, message: '请输入', trigger: 'blur' }],
				addressList: [{ required: true, message: '请选择', trigger: 'change' }],
			},
			title: '', // 模态窗标题
		};
	},
	computed: {
		getList() {
			return getSalesRoomList;
		},
	},
	methods: {
		// 搜索查询
		onClickSearch() {
			this.$refs.TableList.update({ ...this.searchfrom });
		},
		// 新增门店 Btu 事件
		addVers() {
			this.dialogFormVisible = true;
			this.form = {
				name: null, // 门店
				cityName: null, //所属城市
				addressList: [], // 省市区
				address: null, // 详细地址
				orders: null, // 排序
			};
			this.title = '新增门店';
		},
		// 模态窗确认保存事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {


					if (this.title === '新增门店') {
						const _par = {...this.form};
						addSalesRoom(_par).then(res => {
							if (res.code === 200) {
								this.dialogFormVisible = false;
								Message.success('新增门店成功！！！');
								this.$refs.TableList.reset();
							}
						});
					} else {
            const _parEdit = {...this.form};
						editSalesRoom(_parEdit).then(res => {
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
		// 禁用状态切换
		bannedChange(item) {
			editSalesRoom({ ...item, state: item.state })
				.then(res => {
					if (res.success) {
						Message.success('操作成功！');
						this.$refs.activityList.reset();
					}
				})
				.catch(err => {
					this.$refs.activityList.reset();
				});
		},
		// 地址管理
		addressHandleChange(selectedList) {
			console.log('selectedList', selectedList);
			const _proList = [];
			selectedList.forEach((item, index) => {
				console.log(item, index);
				if (index == 1 && CodeToText[item] === '市辖区') {
					_proList.push({ code: item, name: _proList[0].name });
				} else {
					_proList.push({ code: item, name: CodeToText[item] });
				}
			});
			this.regionData = [..._proList];
      this.form.cityName= this.regionData[1].name
      this.form.provinceId= this.regionData[0].code
      this.form.province= this.regionData[0].name
      this.form.cityId= this.regionData[1].code
      this.form.city= this.regionData[1].name
      this.form.countyId= this.regionData[2].code
      this.form.county= this.regionData[2].name
    //   console.log('this.form regionData',this.form)
			// console.log(this.regionData);
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
		.el-select,
		.el-cascader {
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
