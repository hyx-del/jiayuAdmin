<template>
	<div>
		<el-card class="goods">
			<el-steps :active="active" finish-status="success" :align-center="true">
				<el-step title="填写大图精品课程"></el-step>
				<el-step title="添加小图精品课程"></el-step>
				<el-step title="添加小图精品课程"></el-step>
			</el-steps>
			<el-tabs v-model.trim="tabs" class="goodsTbs">
				<el-tab-pane name="first">
					<curriculum
						ref="fristForm"
						v-if="active == 0"
						:id="this.$route.query.id"
						:level="1"
						name="first"
						:data="firstDatas"
						ratio="630/340"
					/>
				</el-tab-pane>
				<el-tab-pane name="second">
					<curriculum
						ref="secondForm"
						v-if="active == 1"
						:id="this.$route.query.id"
						:level="2"
						name="second"
						:data="secondDatas"
						ratio="306/284"
					/>
				</el-tab-pane>
				<el-tab-pane name="third">
					<curriculum
						ref="thirdForm"
						v-if="active == 2"
						:id="this.$route.query.id"
						:level="2"
						name="third"
						ratio="306/284"
					/>
				</el-tab-pane>
			</el-tabs>
			<div class="opreation">
				<el-button v-if="active !== 0" style="margin-top: 12px;" @click="prev">
					返回上一步
				</el-button>
				<el-button v-if="active !== 2" style="margin-top: 12px;" @click="next">
					下一步
				</el-button>
				<el-button v-if="active === 2" style="margin-top: 12px;" @click="create">
					确定
				</el-button>
			</div>
			<!-- <div v-else class="opreation">
				<el-button style="margin-top: 12px;" @click="() => this.$router.back()">
					取消
				</el-button>
				<el-button style="margin-top: 12px;" @click="next">下一步</el-button>
			</div> -->
		</el-card>
	</div>
</template>

<script>
import curriculum from './curriculum.vue';
import { addCourses, getTetails, updateCourese } from '@/api/yogaManage';
export default {
	components: {
		curriculum,
	},
	data() {
		return {
			active: 0,
			tabs: 'first',
			firstData: {},
			secondData: {},
			thirdData: {},
			data: {},
			firstDatas: {},
			secondDatas: {},
		};
	},
	mounted() {
		if (this.$route.query.id) {
			getTetails({ id: this.$route.query.id }).then(res => {
				if (res.code == 200) {
					this.data = res.data;
				}
			});
		}
	},
	methods: {
		next() {
			if (this.active == 0) {
				this.$refs.fristForm.$refs.form.validate(valid => {
					if (valid) {
						let firstData = this.$refs.fristForm.$refs.form.model;
						this.firstDatas = firstData;
						console.log(this.firstDatas);
						if (!firstData.carouselUrls) return this.$message.error('请选择精品课程图');
						if (!firstData.tabId) return this.$message.error('请选择关联类型');
						if (!firstData.id) return this.$message.error('请选择关联目标');
						this.firstData.firstCoverUrl = firstData.carouselUrls;
						this.firstData.firstResourceId = firstData.id;
						this.firstData.firstTabId = firstData.tabId;
						this.active = 1;
						this.tabs = 'second';
					}
				});
				return;
			}
			if (this.active == 1) {
				this.$refs.secondForm.$refs.form.validate(valid => {
					if (valid) {
						let secondData = this.$refs.secondForm.$refs.form.model;
						this.secondDatas = secondData;
						if (!secondData.carouselUrls)
							return this.$message.error('请选择精品课程图');
						if (!secondData.tabId) return this.$message.error('请选择关联类型');
						if (!secondData.id) return this.$message.error('请选择关联目标');
						this.secondData.secondCoverUrl = secondData.carouselUrls;
						this.secondData.secondResourceId = secondData.id;
						this.secondData.secondTabId = secondData.tabId;
						this.active = 2;
						this.tabs = 'third';
					}
				});
				return;
			}
		},
		prev() {
			if (this.active == 1) {
				this.active = 0;
				this.tabs = 'first';
			}
			if (this.active == 2) {
				this.active = 1;
				this.tabs = 'second';
			}
		},
		create() {
			this.$refs.thirdForm.$refs.form.validate(valid => {
				if (valid) {
					let thirdData = this.$refs.thirdForm.$refs.form.model;
					if (!thirdData.carouselUrls) return this.$message.error('请选择精品课程图');
					if (!thirdData.tabId) return this.$message.error('请选择关联类型');
					if (!thirdData.id) return this.$message.error('请选择关联目标');
					this.thirdData.thirdCoverUrl = thirdData.carouselUrls;
					this.thirdData.thirdResourceId = thirdData.id;
					this.thirdData.thirdTabId = thirdData.tabId;
					if (this.data.id) {
						updateCourese({
							...this.firstData,
							...this.secondData,
							...this.thirdData,
							id: this.data.id,
							createTime: this.data.createTime,
							delFlag: this.data.delFlag,
							enable: this.data.enable,
						}).then(res => {
							const { code } = res;
							if (code == 200) {
								this.$message.success('修改成功');
								this.$router.push('highQualityCourses');
							}
						});
					} else {
						addCourses({
							...this.firstData,
							...this.secondData,
							...this.thirdData,
						}).then(res => {
							const { code } = res;
							if (code == 200) {
								this.$message.success('添加成功');
								this.$router.push('highQualityCourses');
							}
						});
					}
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.goodsTbs .el-tabs__header {
	display: none;
}
.goods .opreation {
	width: 200px;
	margin: 0 auto;
	display: flex;
}
</style>
