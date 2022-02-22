<!--
 * @Author: tianhao
 * @Date: 2020-06-16 14:58:17
 * @LastEditors: aa
 * @LastEditTime: 2021-07-16 14:05:31
 * @Descripttion:
-->
<template>
	<div class="orderList">
		<el-tabs v-model.trim="activeName" @tab-click="handleClick">
			<el-tab-pane currentName="0" label="瑜伽">
				<TabTable v-if="activeName == 0" tabId="1" />
			</el-tab-pane>
			<el-tab-pane currentName="1" label="冥想">
				<TabTable v-if="activeName == 1" tabId="3" />
			</el-tab-pane>
			<el-tab-pane currentName="2" label="幸福智慧">
				<TabTable v-if="activeName == 2" tabId="4" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import TabTable from './tabTable';
export default {
	components: {
		TabTable,
	},
	data() {
		return {
			activeName: '0',
		};
	},
	mounted() {
    let query=this.$route.query
    this.activeName=(query.current||0)+''
  },
	methods: {
		handleClick() {},
	},
};
</script>

<style>
.orderList {
	padding: 20px;
}
</style>
