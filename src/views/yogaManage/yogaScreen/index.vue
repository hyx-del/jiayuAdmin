<!--
 * @Author: wei.chen
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2021-09-18 15:02:49
 * @LastEditors: jiu yin zhen jing
 * @Description: 系统账号管理
-->
<template>
	<el-card :body-style="{ padding: '20px' }">
		<el-table
			border
			:data="categoryData"
			style="max-height: 500px;overflow: hidden;overflow-y: auto;"
		>
			<el-table-column align="center" property="name" label="筛选条件"></el-table-column>

			<el-table-column align="center" property="phone" label="操作">
				<template slot-scope="scope">
					<el-button type="text" @click="gotoPage(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
import xtable from '@/components/Table';
import CropperImg from '@/components/cropperImg/index';
import { getScreenList } from '@/api/yogaManage';
import { Message } from 'element-ui';
export default {
	components: {
		xtable,
		CropperImg,
	},
	data() {
		return {
			categoryData: [],
		};
	},
	computed: {},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			getScreenList({}).then(res => {
				if (res.code === 200) {
					this.categoryData = res.data;
				}
			});
		},
		gotoPage(item) {
			// todo { path: 'refundDetail', query: { id: val.id } }
			this.$router.push({
				path: '/content/course/yogaScreen/yogaScreenVal',
				query: { id: item.type, name: item.name },
			});
		},
		// 禁用
		// bannedChange(item) {
		// 	console.log(item);
		// 	let _state = null;
		// 	if (item.searchEnable == 1) {
		// 		_state = 0;
		// 	} else {
		// 		_state = 1;
		// 	}
		// 	editCategory({ state: _state, id: item.id }).then(res => {
		// 		if (res.code === 200) {
		// 			Message.success('操作成功！');
		// 			this.initData();
		// 		}
		// 	});
		// },
	},
};
</script>

<style lang="scss" scoped>
.admin_avater {
	height: 40px;
	width: 40px;
}
</style>
