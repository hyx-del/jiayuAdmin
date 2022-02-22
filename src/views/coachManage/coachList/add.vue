<template>
	<div class="formPage">
		<div class="formBody">
			<formList
				ref="formList"
				:loading.sync="loading"
				:config="config"
				:formObj="formObj"
				:list="list"
				@button="formButton"
			/>
		</div>
	</div>
</template>
<script>
/* coachList/add 添加修改教练 Course
 * */
import formList from '@/components/FormList/index';
import simpleTable from '@/components/simpleTable/index';
import { addCoach, editCoach, getCoach, getCoachLevelList } from '@/api/coach';
import { getSalesRoomList, getSalesRoomTree } from '@/api/admin';
import { getScreenList } from '@/api/yogaManage';

export default {
	components: {
		formList,
		simpleTable,
	},
	data() {
		return {
			loading: false,
			edit: false,
			list: [
				{
					code: 'name',
					label: '教练名称',
					maxlength: 20,
				},
				{
					code: 'sort',
					label: '置顶顺序',
					type: 'number',
					required: false,
					maxlength: 10,
				},
				{
					el: 'radio',
					code: 'sex',
					label: '性别',
					list: [
						{
							label: '男',
							value: 1,
						},
						{
							label: '女',
							value: 2,
						},
					],
				},
				{
					el: 'img',
					code: 'headUrl',
					label: '头像',
          ratio:'1080/1080'
				},
				{
					code: 'slogan',
					label: 'Slogan',
					required: false,
					maxlength: 24,
				},
				{
					el: 'select',
					back: true,
					code: 'coachLevelId',
					label: '教练等级',
					labelCode: 'levelName',
					valueCode: 'id',
					fun: getCoachLevelList,
				},
				{
					code: 'teachingTime',
					label: '累计教学时长',
					// type: 'number',
					maxlength: 7,
				},
				{
					el: 'cascaderTags',
					back: true,
					code: 'saleRoomId',
					label: '所属门店',
					labelCode: 'name',
					valueCode: 'id',
					searchCode: 'name',
					fun: getSalesRoomTree,
					funMode: 3,
					cascaderValue: 'end',
					firstCode: 'cityName',
				},
				{
					el: 'img',
					code: 'introducePicture',
					label: '介绍',
          ImgType: ["png", "jpg", "jpeg", "gif"],
          size:1024,
					limit: 10,
				},
				{
					el: 'checkbox',
					back: true,
					code: 'yogaSchool',
					label: '擅长瑜伽流派',
					labelCode: 'name',
					valueCode: 'id',
					fun: getScreenList,
					funMode: 2,
					postData: {
						id: 1,
					},
				},
				{
					el: 'checkbox',
					back: true,
					code: 'yogaEffect',
					label: '擅长瑜伽功效',
					labelCode: 'name',
					valueCode: 'id',
					fun: getScreenList,
					funMode: 2,
					postData: {
						id: 2,
					},
				},
			],
			formObj: {
				sex: 1,
			},
			config: {
				buttonsArea: 'popButtom',
				inline: false,
				mainStyle: {
					width: '80%',
					marginLeft: '10%',
				},
				buttons: [
					{
						funType: 'confirm',
						type: 'primary',
						name: '确定',
					},
					{
						funType: 'cancel',
						type: 'primary',
						name: '取消',
					},
				],
			},
		};
	},
	mounted() {
		if (this.$route.query.id) {
			this.edit = true;
			getCoach({ id: this.$route.query.id }).then(res => {
				this.formObj = res.data;
			});
		}
	},
	computed: {},
	methods: {
		handleChange(val) {
			console.log(val);
		},
		// 填写课程信息的表单按钮
		formButton(val) {
			if (val.name == 'confirm' && val.valid) {
				let data = val.value;
				this.loading = true;
				if (this.edit) {
					editCoach(data)
						.then(res => {
							this.$alert('编辑成功，跳转到列表', '编辑成功', {
								confirmButtonText: '确定',
								callback: action => {
									this.$router.push({
										path: '/content/coach/index',
									});
								},
							});
						})
						.finally(() => {
							this.loading = false;
						});
				} else {
					addCoach(data)
						.then(res => {
							this.loading = false;
							this.$alert('添加成功，跳转到列表', '添加成功', {
								confirmButtonText: '确定',
								callback: action => {
									this.$router.push({
										path: '/content/coach/index'
									});
								},
							});
						})
						.finally(() => {
							this.loading = false;
						});
				}
			} else {
				this.$confirm('是否返回到列表?确定将放弃编辑内容！', '警告', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.$router.push({
						path: '/content/coach/index'
					});
				});
			}
		},
	},
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
