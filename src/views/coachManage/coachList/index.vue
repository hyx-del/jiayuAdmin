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
			refHead="formList"
			:showSortIndex="{ show: true, lable: '序号' }"
			:column="column"
			ref="TableList"
		>
			<template v-slot:roomName="{ scope }">
				<div v-for="item in scope.roomName">
					<div
						v-if="item.roomName && item.roomName.length > 0"
						:key="item.id"
						class="likeButton"
					>
						{{ item.roomName }}
					</div>
				</div>
			</template>
		</Table>
		      <v-dialog title="修改顺序值"
                :model="columnForm"
                :visible="dialogFormVisible"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogFormVisible.bl"></v-dialog>
	</div>
</template>
<script>
/*
 * course 教练管理
 * */
import Table from '@/components/Table/index';
import formList from '@/components/FormList';
import { getSalesRoomCity, getSalesRoomList } from '@/api/admin';
import { changeCoach, delCoach, getCoachesList,sortAssistant } from '@/api/coach';
import vDialog from "@/components/dialog/index.vue";

export default {
	components: {
		Table,
		formList,
		vDialog
	},
	data() {
		return {
			columnForm: {},
         dialogFormVisible: { bl: false },
         dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number", width: "130px" }],
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
						name: '添加教练',
						icon: 'el-icon-plus',
					},
				],
			},
			formObj: {},
			list: [
				{
					code: 'name',
					label: '教练名称',
					maxlength: 20,
				},
				{
					el: 'select',
					back: true,
					code: 'city',
					label: '所属城市',
					labelCode: 'city',
					valueCode: 'id',
					fun: getSalesRoomCity,
					funMode: 4,
				},
				{
					el: 'select',
					code: 'saleRoomId',
					back: true,
					label: '所属门店',
					labelCode: 'name',
					valueCode: 'id',
					fun: getSalesRoomList,
				},
			],
			// 表头
			column: [
				{
					prop: 'name',
					label: '教练名称',
				},
				{
					prop: 'headUrl',
					label: '头像',
					img: true,
					// render:true,
				},
				{
					prop: 'sex',
					label: '性别',
					formatter: (row, column) => (row.sex > 1 ? '女' : '男'),
				},
				   {
               prop: "recommendOrder",
               label: "顺序值",
               actives: [
                  {
                     name: (row, index) => (row.sort && row.sort? row.sort : "未填写"),
                     method: (val) => {
                        this.columnForm = {
                           sort: val.sort?val.sort: "",
                           id: val.id,
                        };
                        this.dialogFormVisible = { bl: true };
                     },
                  },
               ],
            },
				{
					prop: 'teachingTime',
					label: '累计教学时长',
				},
				{
					prop: 'levelName',
					label: '教练等级',
				},
				{
					width: 150,
					prop: 'roomName',
					label: '所在门店',
					render: true,
				},
				{
					prop: 'createTime',
					label: '添加日期',
				},
				{
					prop: 'enable',
					label: '启用/禁用',
					switch: true,
					fun: changeCoach,
				},
				{
					prop: 'action',
					label: '操作',
					width: 140,
					fixed: 'right',
					actives: [
						{
							name: '编辑',
							method: val => {
								console.log(val);
								this.$router.push({
									path: '/content/coach/add',
									query: { id: val.id },
								});
							},
						},
						{
							name: '详情',
							method: val => {
								this.$router.push({
									path: '/content/coach/detail',
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
						//       delCoach({id:val.id}).then(res=>{
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
			return getCoachesList;
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
					path: '/content/coach/add',
				});
			}
		},
		 changePasswords(e) {
			sortAssistant(e).then(res=>{
				res.code==200?this.$message.success("修改成功"):this.$message.error("修改失败")
					this.$refs.TableList.reset()
			})
      },
	},
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
