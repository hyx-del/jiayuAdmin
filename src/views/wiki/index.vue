<template>
	<div class="commonPage">
		<formList
			ref="formList"
			:config="config"
			:formObj="formObj"
			:list="list"
			@button="formButton"
		/>
		<Table
			:loadData="getList"
			:showSortIndex="{ show: true, lable: '序号' }"
			refHead="formList"
			:column="column"
			ref="TableList"
		>
			<template v-slot:enable="{ scope }">
				<el-switch
					v-model.trim="scope.enable"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="1"
					:inactive-value="0"
					@change="bannedChange(scope, 'enable')"
				></el-switch>
			</template>
		</Table>
		   <v-dialog title="修改顺序值"
                :model="columnForm"
                :visible="dialogSort"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogSort.bl"></v-dialog>
	</div>
</template>
<script>
/*
 * wiki 百科列表
 * */
import Table from '@/components/Table/index';
import { parseTime, testTimeIn } from '@/utils';
import { Message } from 'element-ui';

import formList from '@/components/FormList';
import { enableWiki, wikiColumnList, wikiDelete, wikiList, wikiUpdate,wikiSort } from '@/api/wiki';
import { stateList, stateObj } from '@/utils/systemEnum';
import vDialog from "@/components/dialog/index.vue";

export default {
	name: 'versionManage',
	components: {
		Table,
		formList,
		vDialog
	},
	data() {
		return {
				columnForm: {},
            dialogSort: { bl: false },
            dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number", width: '120px' }],
			config: {
				hasLoading: false,
				inline: true,
				allRequired: false,
				buttons: [
					{
						funType: 'confirm',
						type: 'primary',
						name: '查询',
					},
					{
						funType: 'reset',
						type: 'primary',
						name: '重置',
					},
					{
						funType: 'add',
						type: 'primary',
						name: '添加百科',
						icon: 'el-icon-plus',
					},
				],
				  inputStyle: {//input框样式，css
               width: '140px',
            },
			},
			formObj: {},
			list: [
				{
					code: 'title',
					label: '百科标题',
					// required:true
				},
				{
					el: 'date',
					code: 'startTime',
					label: '开始时间',
					endCode: 'endTime',
					timeError: '开始时间要小于结束时间',
					required: false,
				},
				{
					el: 'date',
					code: 'endTime',
					label: '结束时间',
					required: false,
					timeError: '开始时间要小于结束时间',
					starCode: 'startTime',
				},
				{
					el: 'select',
					code: 'wikiType',
					label: '栏目',
					back: true,
					labelCode: 'name',
					valueCode: 'id',
					fun: wikiColumnList,
				},
				{
					el: 'select',
					code: 'state',
					label: '显示状态',
					list: stateList,
				},
			],
			// 表头
			column: [
				{
					prop: 'createTime',
					label: '添加时间',
				},
				{
					prop: 'title',
					label: '百科标题',
				},
				{
					prop: 'praise',
					label: '点赞数',
					formatter: (row, column) => row.clickNum || 0,
				},
				// {
				// 	prop: 'reading',
				// 	label: '真实浏览量',
				// 	formatter: (row, column) => row.reading || 0,
				// },
				// {
				// 	prop: 'readintRandom',
				// 	label: '虚拟浏览量',
				// 	formatter: (row, column) => row.readintRandom || 0,
				// },
				{
					prop: 'countReadint',
					label: '总浏览量',
					formatter: (row, column) => row.countReadint || 0,
				},
				{
					prop: 'sort',
					label: '置顶顺序',
					type: 'number',
					     actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val) => {
								this.columnForm.id=val.id
                        this.dialogSort = { bl: true };
                     },
                  }
               ]
				},
					{
					prop: 'colnumName',
					label: '栏目',
				},
				{
					prop: 'startTime',
					label: '开始时间',
					formatter: (row, column) => row.startTime || '未选择',
				},
				{
					prop: 'endTime',
					label: '结束时间',
					formatter: (row, column) => row.endTime || '未选择',
				},
				{
					prop: 'state',
					label: '显示状态',
					state: true,
				},
				{
					prop: 'enable',
					label: '启用/禁用',
					render: true,
				},
				{
					prop: 'action',
					label: '操作',
					width: 140,
					actives: [
						{
							name: '编辑',
							method: val => {
								this.$router.push({
									path: '/content/wiki/add',
									query: { id: val.id },
								});
							},
						},
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: '/content/wiki/detail',
									query: { id: val.id },
								});
							},
						},
						// {
						//   name: '删除',
						//   method: val => {
						//     this.$confirm('是否删除！', '警告', {
						//       confirmButtonText: '确定',
						//       cancelButtonText: '取消',
						//       type: 'warning'
						//     }).then(() => {
						//       wikiDelete({id:val.id}).then(res=>{
						//         Message('删除成功')
						//         this.$refs.TableList.reset();
						//       })
						//     })
						//   },
						// },
					],
				},
			],
		};
	},
	computed: {
		getList() {
			return wikiList;
		},
	},
	methods: {
		// 搜索查询
		formButton(val) {
			if (val.name == 'confirm' && val.valid) {
				let data = val.value;
				this.$refs.TableList.update({ ...data });
			}
			if (val.name == 'add') {
				this.$router.push({
					path: '/content/wiki/add',
				});
			}
		},
		// 禁用状态切换
		bannedChange(item, code) {
			let data = { id: item.id, [code]: item[code] };
			if (code == 'enable') {
				let endTime = new Date(item.endTime || '2300').getTime();
				let newTime = new Date().getTime();
				if (item.enable == 1 && endTime < newTime) {
					this.$message.error('改条百科已过定时展示时间，请重置展示时间后再启用');
					this.$refs.TableList.reset();
				} else {
					enableWiki(data)
						.then(res => {
							this.$message.success('操作成功');
						})
						.finally(() => {
							this.$refs.TableList.reset();
						});
				}
			}
		},
			//修改顺序
      changePasswords(e) {
         console.log(e);
			wikiSort(e).then(res=>{
			if(res.code==200){
				this.$message.success("修改成功")
				this.$refs.TableList.reset()
			}else{
				this.$message.error('修改失败')
			}
			})
      },
	},
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
