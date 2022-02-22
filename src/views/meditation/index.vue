<template>
	<div class="commonPage">
		<formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton" />
		<Table :loadData="getList" refHead="formList" :showSortIndex="{ show: true, lable: '序号' }" :column="column" ref="TableList"></Table>

		<v-dialog title="修改顺序值" :model="columnForm" :visible="dialogFormVisible" :list="dialogList" @submit="changePasswords" type="sort" @cancel="cancel"></v-dialog>
	</div>
</template>
<script>
/*
 * meditation 冥想
 * */
import Table from '@/components/Table/index';
import formList from '@/components/FormList';
import { mediationColumnList, mediationList, mediationStateChange, monitorDetail, monitorUpdatePut, upDataSort } from '@/api/meditation';
import vDialog from '@/components/dialog/index.vue';
export default {
	name: 'versionManage',
	components: {
		Table,
		formList,
		vDialog,
	},
	data() {
		return {
			loading: false,
			columnForm: {},
			dialogFormVisible: { bl: false },
			id: null,
			listPop: [
				{
					el: 'textArea',
					code: 'monitorValue',
					label: '模式说明',
				},
			],
			config: {
				hasLoading: false,
				inline: true,
				allRequired: false,
				size:"mini",
				inputStyle: {
					width: '200px',
				},
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
						name: '添加冥想',
						icon: 'el-icon-plus',
					},
				],
			},
			formObj: {},
			list: [
				{
					code: 'name',
					label: '冥想标题',
					 maxlength: 100,
				},
				{
					code: 'author',
					label: '作者',
				},
				{
					el: 'select',
					code: 'columnId',
					label: '栏目',
					back: true,
					labelCode: 'name',
					valueCode: 'id',
					fun: mediationColumnList,
				},
        {
          el: 'select',
          code: 'type',
          label: '文件类型',
          list:[
            {
              label:'音频',
              value:1
            },
            {
              label:'视频',
              value:2
            }
          ]
        },
        {
          el: 'select',
          code: 'payType',
          label: '付费类型',
          list:[
            {
              label: '免费',
              value: '0',
            },
            {
              label: '积分付费',
              value: '1',
            },
            {
              label: '积分+现金付费',
              value: '2',
            }
          ]
        },
			],
			// 表头
      payObj:{
        0:{
          label: '免费',
          value: '0',
        },
        1:{
          label: '积分付费',
          value: '1',
        },
        2: {
          label: '积分+现金付费',
          value: '2',
        }
      },
			column: [
				{
					prop: 'name',
					label: '冥想标题',
				},
					{
					prop: 'type',
					label: '文件类型',
					formatter:(val)=>val.type==1?'音频':'视频'
				},
				{
					prop: 'author',
					label: '作者',
				},
				{
					prop: 'difficultyLevelName',
					label: '难度等级',
					width: '100',
				},
				{
					prop: 'time',
					label: '时长',
					width: '100',
				},
				{
					prop: 'payType',
					label: '付费方式',
					width: '100',
          formatter:({payType})=>this.payObj[payType]&&this.payObj[payType].label||''
				},
				{
					prop: 'scorePrice',
					label: '积分价格',
					width: '100',
          default:'0'
				},
				{
					prop: 'cashPrice',
					label: '现金价格',
					width: '100',
          default:'0'
				},
				// 	{
				// 	prop: 'collectionsNum',
				// 	label: '收藏次数',
				// 	width: '100',
				// },
				// {
				// 	prop: 'viewNum',
				// 	label: '实际播放次数',
				// 	width: '100',
				// },
				// {
				// 	prop: 'virtualPlay',
				// 	label: '虚拟播放次数',
				// 	width: '100',
				// },
				{
					prop: 'virtualNum',
					label: '总播放次数',
					width: '100',
				},
				{
					prop: 'commentNum',
					label: '评论条数',
					width: '100',
					actives: [
						{
							name: (row, index) => row.commentNum || '0',
							method: val => {
								this.$router.push({
									path: '/operation/comment/index',
									query: { current: 1 },
								});
							},
						},
					],
				},
				{
					prop: 'meditationColumnSmallVO',
					label: '栏目',
					actives: [
						{
							name: (row, index) => {
								let arr = row.meditationColumnSmallVO;
								if (arr.length != 0) {
									let str = '';
									arr.forEach(item => {
										str += `<p style="padding:2px 0;margin:0">${item.name}(${item.sort})</p>`;
									});
									return str;
								}
							},
							method: val => {

								val.meditationColumnSmallVO.forEach(item => {
									item.maxLength = 5;
								});
								this.columnForm = val.meditationColumnSmallVO;
								this.id = val.id;
								this.dialogFormVisible = { bl: true };
							},
						},
					],
				},
				{
					prop: 'updateTime',
					label: '发布时间',
				},
				{ prop: 'enable', label: '启用/禁用', switch: true, fun: mediationStateChange, width: '100' },
				{
					prop: 'action',
					label: '操作',
					fixed: 'right',
					width: 140,
					actives: [
						{
							name: '编辑',
							method: val => {
								this.$router.push({
									path: '/content/meditation/add',
									query: { id: val.id },
								});
							},
						},
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: '/content/meditation/detail',
									query: { id: val.id },
								});
							},
						},
					],
				},
			],
		};
	},
	computed: {
		getList() {
			return mediationList;
		},
	},
	created() {},
	methods: {
		// 搜索查询
		formButton(val) {
			if (val.name == 'confirm' && val.valid) {
				let data = val.value;
				this.$refs.TableList.update({ ...data });
			}
			if (val.name == 'add') {
				this.$router.push({
					path: '/content/meditation/add',
				});
			}
		},
		cancel(){
				this.$refs.TableList.reset()
		},
		changePasswords(e) {
			e.forEach(item => {
				item.id = this.id;
			});
			upDataSort({ meditationColumnSmallDTOList: e }).then(res => {
				res.code == 200 ? this.$message.success('修改成功') : this.$message.error('修改失败');
			});
		},
	},
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
<style lang="scss">
.el-dialog__body {
	display: flex;
	justify-content: center;
}
</style>
