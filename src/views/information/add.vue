<template>
	<div class="commonPage">
		<div class="formBody">
			<formList
				ref="formList"
				:loading.sync="loading"
				:config="config"
				:formObj="formObj"
				:list="list"
				:searchObj="searchObj"
				@searchVal="searchVal"
				@button="formButton"
			/>
		</div>
	</div>
</template>
<script>
import formList from '@/components/FormList/index';
import { newsAdd,getNews,newsUpdate } from '@/api/news';
import { getCoachesList } from "@/api/coach";
export default {
	components: {
		formList,
	},
	data() {
		return {
			loading: false,
			searchObj: {
				list: []
			},
			edit: false,
			list: [
				{
					code: 'title',
					label: '新闻标题',
					maxlength: 30,
				},
				{
					code: 'sort',
					label: '置顶顺序',
					type: 'number',
					required: false,
				},
				{
					code: 'readintRandom',
					label: '虚拟浏览量',
					type: 'number',
					required: false,
				},
				{
					el: 'date',
					code: 'startTime',
					label: '开始时间',
					endCode: 'endTime',
					timeError: '开始时间要小于结束时间',
					required: false
				},
				{
					el: 'date',
					code: 'endTime',
					label: '结束时间',
					required: false,
					timeError: '开始时间要小于结束时间',
					starCode: 'startTime',
					minTime: new Date(),

				},
				{
					el: 'searchTags',
					code: 'coaches',
					label: '关联教练',
					required: false,
					labelCode: 'name',
					valueCode: 'id',
					searchCode: 'name',
					fun: getCoachesList,
				},
				{
					el: 'img',
					code: 'coverListUrl',
					label: '列表封面',
					ratio: '750/390'
				},
				{
					el: 'img',
					code: 'coverUrl',
					label: '内容封面',
					ratio: '750/390'
				},
				{
					el: 'img',
					code: 'previewUrl',
					label: '视频封面图',
					ratio: '530/300',
					required: false
				},
				{
					el: 'video',
					code: 'videoUrl',
					label: '视频',
					required: false
				},
				{
					el: 'img',
					code: 'previewUrl2',
					label: '视频封面图2',
					ratio: '530/300',
					required: false
				},
				{
					el: 'video',
					code: 'videoUrl2',
					label: '视频2',
					required: false
				},
				{
					el: 'editer',
					code: 'contents',
					label: '详细内容',
				}
			],
			formObj: {},
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
						name: '确认提交'
					},
					{
						funType: 'cancle',
						type: 'primary',
						name: '取消'
					}
				]
			}
		};
	},
	mounted() {
		if(this.$route.params.id) {
			this.edit=true
			getNews(this.$route.params).then(res => {
				// console.log(res)
				let _data=res.data;
				if(_data.contents) {
					// _data.contents=JSON.parse(_data.contents);
				}
				if(_data.previewUrl&&_data.previewUrl.includes(",")) {
					const _tempPreview=_data.previewUrl;
					_data.previewUrl=_tempPreview.split(",")[0];
					_data.previewUrl2=_tempPreview.split(",")[1];
				}
				if(_data.videoUrl&&_data.videoUrl.includes(",")) {
					const _tempVidoe=_data.videoUrl;
					_data.videoUrl=_tempVidoe.split(",")[0];
					_data.videoUrl2=_tempVidoe.split(",")[1];
				}

				this.formObj=_data;
			})
		}
		// console.log( this.$route.params)
	},
	computed: {
	},
	methods: {
		toTime(str) {
			str=str.substring(0,19);
			str=str.replace(/-/g,'/');
			var timestamp=new Date(str).getTime();
			console.log(new Date(timestamp))
			return new Date(timestamp);
		},
		formButton(val) {
			if(val.name=='confirm'&&val.valid) {
				let data={ ...val.value };
				// 合并视频地址
				if(data.videoUrl2) {
					if(data.videoUrl) {
						data.videoUrl=data.videoUrl+","+data.videoUrl2;
					} else {
						data.videoUrl=data.videoUrl2;
					}
				}
				// 合并视频封面地址
				if(data.previewUrl2) {
					if(data.previewUrl) {
						data.previewUrl=data.previewUrl+","+data.previewUrl2;
					} else {
						data.previewUrl=data.previewUrl2;
					}
				}
				this.loading=true;
				// console.log("data",data);
				// return false;

				if(this.edit) {
					newsUpdate(data).then(res => {
						this.loading=false
						this.$router.push({
							path: '/content/information',
						});
					}).finally(() => {
						this.loading=false
					})
				} else {
					newsAdd(data).then(res => {
						this.loading=false
						this.$router.push({
							path: '/content/information',
						});
					}).finally(() => {
						this.loading=false
					})
				}
			}
			if(val.name=='cancle') {
				this.$router.push({
					path: '/content/information',
				});
			}
		},
		// 搜索值
		searchVal(val) {
			if(val.value=='') {
				this.searchObj={
					code: val.code,
					list: []
				}
			} else {
				setTimeout(() => {
					this.searchObj={
						code: val.code,
						selectType: 'Object',
						list: [
						]
					}
				},200)
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.commonPage {
	padding-bottom: 50px;
}
.formBody {
	height: calc(100vh - 170px);
}
</style>
