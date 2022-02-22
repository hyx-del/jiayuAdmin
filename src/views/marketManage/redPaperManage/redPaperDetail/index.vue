<!--
 * @Author: wei.chen
 * @Date: 2020-09-29 10:48:06
 * @LastEditTime: 2020-10-15 11:08:56
 * @LastEditors: wei.chen
 * @Description:
-->
<template>
	<div class="redPaperDetail">
		<el-card>
			<p class="name">红包名称</p>
			<p>内容：{{ redPackBean.money }}元红包</p>
			<p>
				<span>创建时间:{{ parseTime(redPackBean.createTime) }}</span>
				<span>创建人:{{ redPackBean.creator }}</span>
			</p>
			<p>
				<span>适用渠道:{{ formatSoure(redPackBean.source) }}</span>
				<span>类型:拉新红包</span>
			</p>
			<p>
				<span>开始时间:{{ parseTime(redPackBean.startTime) }}</span>
				<span>结束时间:{{ parseTime(redPackBean.endTime) }}</span>
			</p>
		</el-card>
		<el-card>
			<h3>领取记录</h3>
			<Table :loadData="getList" :column="column" :params="{ id: id }"></Table>
		</el-card>
	</div>
</template>

<script>
import { getReceiveLogList, getRedPackDetail } from '@/api/redPack';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import Table from '@/components/Table/index';
export default {
	components: {
		Table,
	},

	data() {
		return {
			id: this.$route.query.id || -1,
			redPackBean: {
				createTime: '-',
				creator: 'wenjie',
				endTime: '-',
				money: '-',
				name: '-',
				source: '-',
				startTime: '-',
				termination: '-',
			},
			column: [
				{
					prop: 'createTime',
					label: '领取时间',
					formatter: (row, column) => {
						return parseTime(row.createTime);
					},
				},
				{
					prop: 'platform',
					label: '适用渠道',
					formatter: (row, column) => {
						let _str = '';
						switch (row.source) {
							case 'MINI_APP':
								_str = '微信小程序、APP';
								break;
							case 'MINI':
								_str = '微信、小程序';
								break;
							case 'APP':
								_str = 'APP';
								break;

							default:
								_str = '';
								break;
						}
						return _str;
					},
				},
				{
					prop: 'nickName',
					label: '用户昵称',
					formatter: row => {
						return (
							<a
								class="nickName"
								target="_blank"
								href={`#/operation/userDetail?userId=${row.id}`}
							>
								{row.nickName}
							</a>
						);
					},
				},
				{ prop: 'phone', label: '手机号' },
			],
		};
	},
	computed: {
		getList() {
			return getReceiveLogList;
		},
	},
	mounted() {
		getRedPackDetail({ id: this.id }).then(res => {
			if (res.success) {
				this.redPackBean = res.data;
			}
		});
	},
	methods: {
		parseTime(item) {
			return parseTime(item);
		},
		formatSoure(source) {
			let _str = '';
			switch (source) {
				case 'MINI_APP':
					_str = '微信小程序、APP';
					break;
				case 'MINI':
					_str = '微信、小程序';
					break;
				case 'APP':
					_str = 'APP';
					break;

				default:
					_str = '';
					break;
			}
			return _str;
		},
	},
};
</script>

<style lang="scss" scoped>
.redPaperDetail {
	.name {
		font-size: 40px;
		font-weight: bold;
	}
	span + span {
		margin-left: 20px;
	}
}
</style>
