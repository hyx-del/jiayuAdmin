<template>
	<div>
		<el-form :model="form" ref="form" label-position="top">
			<el-form-item label="选择精品课程图">
				<UploadImgDrag
					v-model.trim="form.carouselUrls"
					:size="500"
					:limit="1"
					:ratio="ratio"
				></UploadImgDrag>
			</el-form-item>
			<el-form-item label="关联类型">
				<el-select size="small" v-model="form.tabId" placeholder="选择关联类型">
					<el-option
						v-for="item in levelData"
						:key="item.tabId"
						:label="item.tabName"
						:value="item.tabId"
					></el-option>
				</el-select>
				<el-button type="primary" @click="showLog">选择</el-button>
			</el-form-item>
		</el-form>
		<div class="addgoods">
			<div>关联目标</div>
			<el-table :data="form.tableData" style="width: 60%">
				<el-table-column prop="name" label="标题" />
				<el-table-column prop="author" label="教练" />
				<el-table-column prop="createTime" label="创建时间">
					\
					<template slot-scope="scope">
						{{ parseTime(scope.row.createTime) }}
					</template>
				</el-table-column>
				<el-table-column prop="coverUrl" label="规格展示图">
					<template slot-scope="scope">
						<el-image
							:src="scope.row.coverUrl"
							:preview-src-list="[scope.row.coverUrl]"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-dialog
			center
			:visible.sync="productVisible"
			v-if="productVisible"
			@close="productVisible = false"
			custom-class="role_dialog"
			width="50%"
			:close-on-click-modal="false"
		>
			<div class="table">
				<Table
					:single="true"
					:loadData="getList"
					:column="column"
					:headHight="400"
					:select="handleSelectionChange"
					:params="{ tabId: form.tabId }"
					ref="TableList"
				>
					<template v-slot:coverUrl="{ scope }">
						<el-image
							:src="scope.coverUrl"
							:preview-src-list="[scope.coverUrl]"
							style="width:100px"
						/>
					</template>
				</Table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="productVisible = false">取 消</el-button>
				<el-button type="primary" @click="productVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import UploadImgDrag from '@/components/uploadDrag';
import { getCoursesType, getResourceList, getTetails } from '@/api/yogaManage';
import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
export default {
	components: {
		UploadImgDrag,
		Table,
	},
	props: ['level', 'id', 'name', 'data', 'ratio'],
	data() {
		return {
			levelData: [],
			form: {
				tableData: [],
			},
			productVisible: false,
			searchfrom: {},
			column: [
				{
					prop: 'name',
					label: '标题',
				},
				{
					prop: 'author',
					label: '教练',
				},
				{
					prop: 'createTime',
					label: '创建时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'coverUrl',
					label: '封面图片',
					render: true,
				},
			],
			parseTime,
		};
	},
	mounted() {
		if (this.data) {
			this.form = this.data;
		}
		if (this.id) {
			getTetails({ id: this.id }).then(res => {
				if (this.name == 'first') {
					this.form.carouselUrls = res.data.firstCoverUrl;
					this.form.tabId = res.data.firstTabId;
					this.form.id = res.data.firstResourceId;
					this.form.tableData = [res.data.firstResource];
					this.$forceUpdate(); // vue 强制同步数据的方法
				}
				if (this.name == 'second') {
					this.form.carouselUrls = res.data.secondCoverUrl;
					this.form.tabId = res.data.secondTabId;
					this.form.id = res.data.secondResourceId;
					this.form.tableData = [res.data.secondResource];
					this.$forceUpdate(); // vue 强制同步数据的方法
				}
				if (this.name == 'third') {
					this.form.carouselUrls = res.data.thirdCoverUrl;
					this.form.tabId = res.data.thirdTabId;
					this.form.id = res.data.thirdResourceId;
					this.form.tableData = [res.data.thirdResource];
					this.$forceUpdate(); // vue 强制同步数据的方法
				}
			});
		}
		this.getData();
	},
	computed: {
		getList() {
			return getResourceList;
		},
	},
	methods: {
		getData() {
			getCoursesType({
				level: this.level,
			}).then(res => {
				this.levelData = res.data;
			});
		},
		handleSelectionChange(val) {
			this.form.id = val[0].id;
			this.form.tableData = val;
		},
		showLog() {
			if (!this.form.tabId) return this.$message.error('请选择关联类型');
			this.productVisible = true;
		},
	},
};
</script>

<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
