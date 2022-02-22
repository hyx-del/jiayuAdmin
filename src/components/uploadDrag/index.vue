<!--
 * @Author: tianhao
 * @Date: 2020-06-12 12:09:22
 * @LastEditors: aa
 * @LastEditTime: 2021-07-19 13:20:08
 * @Descripttion:
params:
-->

<template>
	<div>
		<el-upload
			class="lt_uploader"
			action=""
			:show-file-list="false"
			:data="parameters"
			:before-upload="beforeAvatarUpload"
			:http-request="fnUploadRequest"
			:file-list="fileList"
			list-type="picture-card"
			:limit="limit"
		>
			<!-- <img v-if="option.imgUrl && limit == 1" :src="option.imgUrl" class="avatar" /> -->

			<div class="upload_comp">
				<draggable
					class="upload_comp_draggable"
					v-model="fileList"
					@start="drag = true"
					@end="dragOnEnd"
				>
					<div class="upload_img_item" v-for="(item, index) in fileList" :key="item.name">
						<img :src="item.url" class="img_item" />
						<span class="img_item_action">
							<i class="el-icon-delete" @click="delUploadImg(index)"></i>
						</span>
					</div>
				</draggable>
			</div>
			<div class="upload_btn" v-if="fileList.length != limit" slot="trigger">
				<i class="el-icon-plus"></i>
			</div>
			<!-- <div slot="file" slot-scope="{ file }">
				{{ file }}
				<img class="el-upload-list__item-thumbnail" :src="file.url" alt="商品详情图片" />
				<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-delete" @click="delUploadImg(file)">
						<i class="el-icon-delete"></i>
					</span>
				</span>
			</div> -->
			<div class="tips">{{ tips || `最多${limit}张,请上传不超过${size}KB的${ImgType.join('、')}格式的图片${ratio!=''?`,上传比例${parseInt(Number(ratio.split('/')[0]/Number(ratio.split('/')[1]))*100)/100},建议尺寸${ratio}`:''}` }}</div>
		</el-upload>
	</div>
</template>
<script>
const OSS = require('ali-oss');
import draggable from 'vuedraggable';
import { url } from '@/config/index';
import { GUID } from '@/utils/guid.js';
import store from '@/store';

export default {
	name: 'LTQNUpload',
	components: { draggable },
	props: {
		value: {
			// 初始化图片
			type: [String, Array],
		},
		defaultUrl: {
			type: Array,
			default() {
				return [];
			},
		},
		size: {
			// 现在单张图片大小
			type: Number,
			default: 500,
		},
		limit: {
			// 限制数量
			type: Number,
			default: 1,
		},
		ratio: {
			type: String,
			default: '',
		},
		isGif: {
			// 是不是gif
			type: Boolean,
			default: false,
		},
		ImgType: {
			//限制图片格式
			type: Array,
			default() {
				return ['png', 'jpg', 'jpeg'];
			},
		},
		tips: {
			//底部提示
			type: String,
			default() {
				return '';
			},
		},
	},
	data() {
		return {
			ossClient: null,
			parameters: {
				key: '',
			},
			parentVal: this.value, // 同步父节点传递进来的 默认数据
			
			dialogVisible: false,
			option: {
				outputType: '', // 裁剪生成图片的格式
				imgUrl: this.defaultUrl, // 传递进来的默认图片
			},
			fileList: [], //页面显示的数组
			// 防止重复提交
			loading: false,
		};
	},
	computed: {},
	watch: {
		fileList(val) {},
		value(newValue, oldVal) {
			// console.log('value change', newValue, oldVal);
			if (newValue != oldVal) {
				this.parentVal = this.value;
				this.transFormValueToFileList();
			}
		},
		parentVal(newVal, oldVal) {
			if (newVal != oldVal) {
				this.$emit('input', this.parentVal);
				// console.log('this.parentVal:', this.parentVal)
			}
		},
	},
	created() {
		// console.log('========', store.getters.upLoadToken);
		let client = new OSS({
			accessKeyId: store.getters.upLoadToken.accessKeyId,
			accessKeySecret: store.getters.upLoadToken.accessKeySecret,
			stsToken: store.getters.upLoadToken.securityToken,
			bucket: url.OSSBucket,
			region: url.OSSRegion,
			endpoint: url.OSSUrl,
			cname: url.OSSUrl,
		});
		this.ossClient = client;
	},
	mounted() {
		// console.log("value",this.value)
		this.transFormValueToFileList();
	},
	beforeDestroy() {},
	methods: {
		dragOnEnd(info) {
			this.syncFileListToParentVal();
		},
		transFormValueToFileList() {
			let tempStr;
			if (this.value) {
				let _tempArray = [];
				if (Array.isArray(this.value)) {
					this.value.forEach(item => {
						if (item) {
							tempStr = item.split('/');
							_tempArray.push({
								name: tempStr[tempStr.length - 1],
								url: item,
							});
						}
					});
					this.fileList = _tempArray;
				} else {
					tempStr = this.value.split('/');
					this.fileList = [{ name: tempStr[tempStr.length - 1], url: this.value }];
				}
				//
			} else {
				this.fileList = [];
			}

			// if (this.limit == 1) {
			// 	if (this.value) {
			//
			// 		tempStr = this.value.split('/')

			// 		this.fileList = [{ name: tempStr[tempStr.length - 1], url: this.value }]
			// 	} else {
			// 		this.fileList = []
			// 	}
			// } else {
			// 	if (this.value) {
			// 		let _tempArray = []
			// 		if (Array.isArray(this.value)) {
			// 			this.value.forEach(item => {
			// 				if (item) {
			// 					tempStr = item.split('/')
			// 					_tempArray.push({
			// 						name: tempStr[tempStr.length - 1],
			// 						url: item,
			// 					})
			// 				}
			// 			})
			// 		}
			// 		//
			// 		this.fileList = _tempArray
			// 	} else {
			// 		this.fileList = []
			// 	}
			// }
		},
		// 删除 图片上传的图片
		delUploadImg(index) {
			// console.log(index)
			this.fileList.splice(index, 1);
			this.syncFileListToParentVal();
			// this.syncFileListToParentVal()
		},
		// 同步  fileList 到  parentVal 返回给父组件里面
		syncFileListToParentVal() {
			let tempParentVal = [];
			this.fileList.forEach(item => {
				tempParentVal.push(item.url);
			});

			this.parentVal = tempParentVal;
		},
		handleAvatarSuccess(res, file) {
			if (this.limit > 1) {
				this.fileList = [
					...this.fileList,
					{
						name: res.name,
						key: res.name,
						url: file,
					},
				];
				this.syncFileListToParentVal();
			} else {
				this.fileList = [
					{
						name: res.name,
						key: res.name,
						url: file,
					},
				];
				this.parentVal = file;
			}
			// this.fileList = fileList
			this.dialogVisible = true;
		},
		beforeAvatarUpload(file) {
			// const isJPG = file.type == 'image/png' || file.type === 'image/jpeg';
			//  ;
			let _that = this;
			if (file.type === 'image/png') {
				_that.option.outputType = 'png';
			} else if (file.type === 'image/jpeg') {
				_that.option.outputType = 'jpg';
			} else if (file.type === 'image/gif') {
				_that.option.outputType = 'gif';
			}

			// 生成文件名称
			let guid = new GUID();
			_that.parameters.key = `${guid.newGUID()}.${_that.option.outputType}`;
			const isLt = file.size / 1024 > _that.size;

			if (_that.isGif) {
				if (_that.option.outputType !== 'gif') {
					_that.$message.error('上传图片只能是 gif 格式!');
					return false;
				}
			} else {
				// ImgType
				if (file.type) {
					const _tempType = (file.type + '').split('/');
					if (!_that.ImgType.includes(_tempType[1])) {
						_that.$message.error(`上传图片只能是 ${_that.ImgType.join(',')} 格式!`);
						return false;
					}
				}
			}

			if (isLt) {
				_that.$message.error(`上传图片大小不能超过${_that.size}KB!`);
				return false;
			}

			if (_that.width || _that.height || _that.ratio) {
				return new Promise((resolve, reject) => {
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.src = _URL.createObjectURL(file);
					img.onload = () => {
						if (_that.width) {
							if (img.width > _that.width) {
								_that.$message.warning({
									message: `上传文件宽最大为${_that.width}`,
								});
								reject();
							}
						}
						if (_that.height) {
							if (img.height > _that.height) {
								_that.$message.warning({
									message: `上传文件高最大为${_that.height}`,
								});
								reject();
							}
						}
						if (_that.ratio) {
							let wh = parseInt((img.width / img.height) * 100) / 100;
							let ratArr=_that.ratio.split('\/')
							let rat = parseInt(ratArr[0]/ratArr[1] * 100) / 100;
							if (wh != rat) {
								_that.$message.warning({
									message: `图片宽/高 尺寸比例要求为${rat},建议尺寸${_that.ratio}`,
								});
								reject();
							}
						}
						resolve();
					};
				});
			} else {
				return true;
			}
		},

		fnUploadRequest(file) {
			const self = this;
			let guid = new GUID();
			let files = file.file,
				point = files.name.lastIndexOf('.'),
				suffix = files.name.substr(point),
				fileName = files.name.substr(0, point),
				date = parseInt(+new Date() / 1000),
				tempGuid = guid.newGUID().substring(0, 16),
				fileNames = `/img/${tempGuid}_${date}${suffix}`;

			//fileNames上传文件的名称
			//file.file上传文件的内容
			// console.log(fileNames);
			// console.log(point, suffix, fileName);

			self.ossClient
				.multipartUpload(fileNames, file.file, {
					progress: function(p, checkpoint) {
						// console.log(p, checkpoint);
						// 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
					},
					meta: { guid: tempGuid, 'Content-Type': `image/${suffix.split('.')[1]}` },
					'Content-Type': `image/${suffix.split('.')[1]}`,
					mime: `image/${suffix.split('.')[1]}`,
				})
				.then(result => {
					//下面是如果对返回结果再进行处理，根据项目需要
					// const _signUrl = self.ossClient.signatureUrl(result.res.requestUrls[0]);
					// console.log(result, _signUrl);
					// console.log(result.res.requestUrls[0]);
					// const _signUrl = self.ossClient.signatureUrl(fileNames);
					// console.log(result, url.OSSUrl + result.name);
					// result.res.requestUrls[0];
					self.handleAvatarSuccess(result, url.OSSUrl + result.name);
					self.$message({
						message: '上传成功',
						type: 'success',
					});
				})
				.catch(err => {
					self.$message.error('上传失败');
				});
		},
	},
};
</script>
<style lang="scss" scope>
// 覆盖样式
.upload_btn .el-icon-plus {
	text-align: center;
}
.lt_uploader {
	position: relative;
	display: flex;
	padding-bottom: 20px;
	.tips {
		position: absolute;
		bottom: 0;
		left: 0;
		line-height: 20px;
		font-size: 12px;
		color: #aaa;
	}
}
.el-upload--picture-card {
	width: auto;
	border: none;
	height: auto;
	text-align: left;
	.el-icon-plus {
		width: 148px;
		height: 148px;
		line-height: 148px;
		border: 1px dashed #c0ccda;
	}
}
.upload_btn {
	display: inline-block;
	vertical-align: top;
	margin: 0 10px 10px 0 !important;
	// margin-top: 10px;
	// margin-left: 10px;
	.el-icon-plus {
		vertical-align: middle;
	}
}
.upload_comp {
	display: inline;
	vertical-align: top;
	.upload_comp_draggable {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
	}
	.upload_img_item {
		//display: inline-block;
		position: relative;
		display: flex;
		min-width: 148px;
		justify-content: center;
		align-items: center;
		padding: 4px;

		width: 148px;
		height: 148px;
		margin: 0 10px 10px 0 !important;
		border: 1px solid #eee;
		vertical-align: top;
		overflow: hidden;
		.img_item {
			position: absolute;
			top: 50%;
			left: 0;
			width: 100%;
			transform: translate(0, -50%);
		}
		.img_item_action {
			position: absolute;
			top: 0;
			left: 0;
			width: 148px;
			height: 148px;
			line-height: 148px;
			opacity: 0.01;
			font-size: 20px;
			text-align: center;
			&:hover {
				cursor: default;
				color: #fff;
				opacity: 0.7;
				background-color: rgba(0, 0, 0, 0.7);
				transition: opacity 0.3s;
			}
			.el-icon-delete {
				&:hover {
					cursor: pointer;
				}
			}
		}
	}
}
.img_uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		height: 100%;
	}
}
.img_uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	text-align: center;
}
.avatar {
	height: 100%;
	width: 100%;
}
.cropper-content .cropper {
	width: auto;
	height: 300px;
}
.tips {
	line-height: 20px;
	font-size: 12px;
	color: #aaa;
}
</style>
