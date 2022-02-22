<!--
 * @Author: wei.chen
 * @Date: 2020-08-03 10:47:25
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-12-15 09:42:10
 * @Descripttion:上传音频文件
-->
<template>
	<div class="uploadTemp">
		<div slot="tip" v-if="isShowTip" class="el-upload__tip">
			{{ tipText }}
		</div>
		<el-upload
			class="Audio_uploader upload-demo"
			ref="uploadTemp"
			drag
			action=""
			:data="parameters"
			:file-list="fileList"
			:on-preview="handlePictureCardPreview"
			:before-upload="beforeAvatarUpload"
			:http-request="fnUploadRequest"
			:show-file-list="false"
			v-loading.fullscreen.lock="loading"
		>
			<audio
				v-if="AudioForm.Audio != '' && AudioFlag === false"
				:src="AudioForm.Audio"
				id="palyerAudio"
				refsAudio="palyerAudio"
				class="avatar"
				controls="controls"
			>
				您的浏览器不支持音频播放
			</audio>

			<div v-else-if="AudioForm.Audio == '' && AudioFlag === false">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<p>请上传格式为MP3格式的音频</p>
			</div>
			<div
				class="remove_Audio"
				v-if="AudioForm.Audio != '' && AudioFlag === false"
				@click.stop="removeAudio()"
			>
				<i class="el-icon-delete"></i>
			</div>
			<el-progress
				v-if="percentageVal != 0"
				:text-inside="true"
				:stroke-width="24"
				:percentage="percentageVal"
				:status="upLoadStatus"
			></el-progress>
		</el-upload>
	</div>
</template>

<script>
const OSS = require('ali-oss');
import { url } from '@/config/index';
import { GUID } from '@/utils/guid.js';
import store from '@/store';
import { Loading, Message } from 'element-ui';
 function backType(cc, string) {
	var typeName = Object.prototype.toString.call(cc);
	if (typeName == '[object Object]') {
		typeName = '[object ' + cc.constructor.name;
	}
	typeName = typeName.replace(']', '').slice(8);
	if (string) {
		return typeName == string;
	}
	console.log(typeName);
	return typeName;
}
const diffSame = (list1, list2) => {
    let back;
    if (list1 == list2) {
        if (backType(list1, "Object") || backType(list1, "Array")) {
			  console.log(JSON.stringify(list1) , JSON.stringify(list2));
            back = JSON.stringify(list1) == JSON.stringify(list2);
        }
    } else {
        back = false;
    }
    return back;
};
export default {
	name: 'uploadAudio',
	props: {
		code: {
			type:String,
		},
		value: {
			// 初始化文件
			type: [String, Object, Array],
		},
		// 上传文件大小
		size: {
			type: Number,
			default: 500,
		},
		// 最大允许上传个数
		limit: {
			type: Number,
			default: 1,
		},

		isShowTip: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			ossClient: null,
			upLoadStatus: 'warning',
			percentageVal: 0,
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			// 上传时附带的额外参数
			parameters: {
				token: store.getters.upLoadToken, // 上传时带的 token
				key: '', // 上传的文件名
			},

			fileList: [], // 上传的文件列表
			// 防止重复提交
			loading: false,
			parentVal: this.value, // 同步父节点传递进来的 默认数据
			tipText: '',
			AudioForm: {
				Audio: '',
				len: 0,
				size: 0,
				oldName: '',
				newName: '',
				type: 'audio/mp3',
			},
			AudioFlag: false,
		};
	},
	watch: {
		value(newValue, oldVal) {
			// console.log('value change', newValue, oldVal)
			if (!diffSame(newValue, oldVal)) {
				this.parentVal = this.value;
				this.transFormValueToFileList();
			}
		},
		parentVal(newVal, oldVal) {
			if (!diffSame(newVal, oldVal)) {
				this.$emit('input', this.parentVal);
				this.$emit('change', this.parentVal);
				
				// console.log('this.parentVal:', this.parentVal)
			}
		},
	},
	created() {
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
		this.transFormValueToFileList();
	},
	methods: {
		transFormValueToFileList() {
			if (this.value) {
				if (Array.isArray(this.value)) {
					var _tempArray = this.value.filter(function(s) {
						return s;
					});
					if (_tempArray.length > 0) {
						this.fileList = [..._tempArray];
					} else {
						this.fileList = [];
					}
				} else if (typeof this.value === 'string') {
					let newVal = this.value.split('/');
					this.fileList.push({
						name: newVal[newVal.length - 1],
						key: newVal[newVal.length - 1],
						url: this.value,
					});
					this.AudioFlag = false;
					this.AudioForm.Audio = this.value;
				} else {
					this.fileList = [];
				}
			} else {
				this.fileList = [];
			}
		},
		// 点击文件列表中已上传的文件时的钩子
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},

		// 同步  fileList 到  parentVal 返回给父组件里面
		syncFileListToParentVal() {
			console.log(this.fileList);
			let _url = '';
			if (this.fileList.length > 0) {
				_url = this.fileList[this.fileList.length-1].url;
			}
			this.parentVal = {
				...this.AudioForm,
				url: _url,
			};
		},
		// 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
		beforeAvatarUpload(file) {
			// 上传的文件名
			let _this = this;
			this.parameters.key = file.name;
			let url = URL.createObjectURL(file);
			let audioElement = new Audio(url);
			audioElement.addEventListener('loadedmetadata', function(_event) {
				let duration = audioElement.duration || 0;
				_this.AudioForm.len = parseInt(duration);
				_this.AudioForm.size = file.size;
				_this.AudioForm.oldName = file.name;
				console.log('音频时长：', _this.AudioForm);
			});
			var fileSize = file.size / 1024 / 1024 < 5;

			if (['audio/mpeg'].indexOf(file.type) == -1) {
				Message.error('请上传MP3格式的音频文件');
				return false;
			}
			_this.AudioForm.type = 'audio/mp3';
			this.loading = true;
		},
		async fnUploadRequest(file) {
			const self = this;
			let guid = new GUID();
			let files = file.file,
				point = files.name.lastIndexOf('.'),
				suffix = files.name.substr(point),
				fileName = files.name.substr(0, point),
				date = parseInt(+new Date() / 1000),
				tempGuid = guid.newGUID().substring(0, 16),
				fileNames = `/audio/${tempGuid}_${date}${suffix}`;
			self.AudioForm.newName = `${tempGuid}_${date}${suffix}`;
			//fileNames上传文件的名称
			//file.file上传文件的内容
			// console.log(fileNames);
			// console.log(point, suffix, fileName, fileNames);

			self.ossClient
				.multipartUpload(fileNames, file.file, {
					progress: function(p, checkpoint) {
						// console.log(p, checkpoint);
						// console.log(p, checkpoint);

						if (p >= 1) {
							self.percentageVal = 100;
							self.upLoadStatus = 'success';
						} else {
							self.percentageVal = new Number(p * 100).toFixed(2) * 1;
							self.upLoadStatus = 'warning';
						}
						// 断点记录点。浏览器重启后无法直接继续上传，您需要手动触发上传操作。
					},
					meta: { guid: tempGuid },
					mime: `audio/mp3`,
				})
				.then(result => {
					//下面是如果对返回结果再进行处理，根据项目需要
					console.log('result', result);
					self.handleAvatarSuccess(result, url.OSSUrl + result.name);
					// self.$message({
					// 	message: '上传成功',
					// 	type: 'success',
					// });
				})
				.catch(err => {
					console.log(err);
					self.$message.error('上传失败');
				});
		},
		// 文件上传成功时的钩子
		handleAvatarSuccess(res, file) {
			this.AudioForm.Audio = file;
			this.fileList.push({
				...this.AudioForm,
				url: this.AudioForm.Audio,
			});
			this.syncFileListToParentVal();
			this.$refs.uploadTemp.clearFiles(); // 清除上次上传记录
			this.AudioFlag = false;
			sessionStorage.setItem("AudioForm",JSON.stringify(this.AudioForm))
			setTimeout(() => {
				this.loading = false;
				Message.success('上传成功');
			}, 1000);
		},
		removeAudio() {
			this.$parent.form.model.Audios = '';
			this.AudioForm.Audio = '';
			this.fileList = [];
			this.AudioForm = {
				Audio: '',
				len: 0,
				size: 0,
				oldName: '',
				newName: '',
				type: 'audio/mp3',
			};
			this.upLoadStatus = 'warning';
			this.percentageVal = 0;
			this.$refs.uploadTemp.clearFiles();
			this.syncFileListToParentVal();
		},
	},
};
</script>

<style lang="scss">
// 覆盖样式
.upload_btn .el-icon-plus {
	text-align: center;
}

.Audio_uploader {
	.el-upload {
		height: 200px;
		width: auto;
		background: #fff;
		margin-left: 10px;
	}
	.el-icon-plus {
		width: 148px;
		height: 148px;
		line-height: 148px;
		border: 1px dashed #c0ccda;
	}
	p {
		margin: 0;
	}
	.el-upload-dragger .el-upload__text {
		line-height: 20px;
	}
	.el-upload-dragger {
		&:hover .remove_Audio {
			display: block;
		}
	}
	.remove_Audio {
		position: absolute;
		right: 10px;
		top: 10px;
		width: 30px;
		height: 30px;
		line-height: 30px;
		border-radius: 50%;
		overflow: hidden;
		background: #333333;
		display: none;
		// &:hover {

		// }
		.el-icon-delete {
			font-size: 18px;
			color: #fff;
		}
	}
}

.upload_btn {
	display: inline-block;
	vertical-align: top;
	margin-top: 10px;
	margin-left: 10px;
	.el-icon-plus {
		vertical-align: middle;
	}
}
.upload_comp {
	display: inline;
	vertical-align: top;

	.upload_img_item {
		display: inline-block;
		position: relative;
		width: 148px;
		height: 148px;
		margin-left: 10px;
		margin-top: 10px;
		vertical-align: top;
		overflow: hidden;
		.img_item {
			width: 100%;
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
</style>
