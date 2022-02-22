<!--
 * @Author: wei.chen
 * @Date: 2020-06-19 10:11:14
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:11:39
 * @Descripttion: 
-->
<template>
	<div class="addGroups">
		<el-form
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-width="150px"
			class="demo-ruleForm"
		>
			<el-row>
				<el-col :span="12">
					<el-form-item label="拼团标题" prop="name">
						<el-input
							v-model.trim="ruleForm.name"
							maxlength="50"
							placeholder="请输入拼团标题"
							size="small"
							class="sameWidth"
						></el-input>
					</el-form-item>

					<el-form-item label="拼团开始时间" prop="startTime">
						<el-date-picker
							v-model.trim="ruleForm.startTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							format="yyyy-MM-dd HH:mm"
							:picker-options="begPickerOptions"
							class="sameWidth"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="拼团结束时间" prop="endTime">
						<el-date-picker
							v-model.trim="ruleForm.endTime"
							type="datetime"
							placeholder="选择日期时间"
							value-format="timestamp"
							format="yyyy-MM-dd HH:mm"
							:picker-options="begPickerOptions"
							class="sameWidth"
						></el-date-picker>
					</el-form-item>
					<el-form-item label="拼团人数" prop="personNum">
						<el-input
							type="text"
							disabled
							v-model.trim="ruleForm.personNum"
							size="small"
							maxlength="4"
							placeholder="请输入抢购人数"
							class="sameWidth"
						>
							<template slot="append">
								/人
							</template>
						</el-input>
					</el-form-item>
					<el-form-item label="拼团时限" prop="limitMinute">
						<el-input
							type="text"
							v-model.trim="ruleForm.limitMinute"
							size="small"
							maxlength="7"
							placeholder="请输入小于等于10080的正整数"
							class="sameWidth"
						>
							<template slot="append">
								/分
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<div>
						<h2>规则说明：</h2>
						<p>1、活动开始时间＜活动结束时间。</p>
						<p>2、拼团活动不允许有时间的交叉。</p>
						<p>
							3、拼团时限：用户发起组团XX分钟以后未成功拼团，系统会自动拼团。
						</p>
						<p>
							4、选择商品规则：不能选择参与其他活动的商品（限时抢购）。不能选择在其他拼团活动中的商品（状态为未开始、进行中的活动）。
						</p>
					</div>
				</el-col>
			</el-row>

			<el-form-item label="拼团商品" prop="groupItemList">
				<el-button type="primary" size="mini" @click="onClickDialog">添加商品</el-button>
				<div>
					<span>请添加需参加拼团的SPU商品</span>
					<div v-for="(spuItem, index) in ruleForm.groupItemList" :key="index">
						<el-card class="box-card" shadow="hover" v-if="goodsInfo">
							<div class="clearfix">
								<div class="block">
									<el-image
										style="width: 100%; height: 100%"
										:src="spuItem.cover ? spuItem.cover : null"
									></el-image>
								</div>
								<div class="goods_info" style="margin-right:20px">
									<el-tooltip
										class="spuName"
										effect="dark"
										:content="spuItem.name"
										placement="top"
									>
										<span>商品名称：{{ spuItem.name }}</span>
									</el-tooltip>

									<el-tooltip
										class="item_tip"
										effect="dark"
										:content="spuItem.summary"
										placement="top"
									>
										<span>商品描述：{{ spuItem.summary }}</span>
									</el-tooltip>
								</div>
								<div class="goodsItem_item">
									<div>新用户专享</div>
									<div>{{ spuItem.newUserOnly ? '是' : '否' }}</div>
								</div>
								<div class="goodsItem_item">
									<div>显示顺序</div>
									<div>{{ spuItem.sortIndex }}</div>
								</div>
								<div>
									<el-button
										type="primary"
										size="mini"
										@click="deleteClick(index)"
									>
										<i class="el-icon-delete"></i>
									</el-button>
								</div>
								<div class="editBtu">
									<el-button
										type="primary"
										size="mini"
										@click="editClick(spuItem, index)"
									>
										修改
									</el-button>
								</div>
							</div>
						</el-card>
						<div>
							<el-button
								type="primary"
								size="mini"
								style="margin-top:10px"
								@click="openFillDialog(spuItem, index)"
							>
								批量填充
							</el-button>
						</div>
						<el-table
							v-if="goodsInfo"
							:data="spuItem.groupItemSkuList"
							border
							style="width: 100%;margin:20px 0"
						>
							<el-table-column align="center" prop="cover" label="规格展示图">
								<template slot-scope="scope">
									<img
										:src="scope.row.cover"
										alt=""
										style="width:60px;height:60px"
									/>
								</template>
							</el-table-column>
							<el-table-column
								align="center"
								prop="name"
								label="规格名称"
							></el-table-column>

							<!-- <el-table-column align="center" prop="originPrice" label="划线价">
								<template slot-scope="scope">
									<span>{{ `${moneyFormat(scope.row.originPrice)}` }}元</span>
								</template>
							</el-table-column> -->
							<el-table-column align="center" prop="originPrice" label="售价">
								<template slot-scope="scope">
									<span>{{ `${moneyFormat(scope.row.originPrice)}` }}元</span>
								</template>
							</el-table-column>

							<!-- <el-table-column
								align="center"
								prop="inventoryNum"
								label="实际剩余库存"
							></el-table-column> -->
							<el-table-column
								align="center"
								prop="inventoryActNum"
								label="拼团库存"
							></el-table-column>
							<el-table-column align="center" prop="price" label="拼团价">
								<template slot-scope="scope">
									<span>
										{{
											scope.row.price
												? `${moneyFormat(scope.row.price)}元`
												: ''
										}}
									</span>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="limitNum" label="每人限购数量">
								<template slot-scope="scope">
									<span>
										{{ scope.row.limitNum }}
									</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="操作">
								<template slot-scope="scope">
									<el-button
										@click="handleClick(scope.row, scope.$index, index)"
										type="text"
										size="small"
									>
										编辑
									</el-button>

									<el-button
										type="text"
										size="small"
										@click.native.prevent="
											deleteSku(
												scope.$index,
												spuItem.groupItemSkuList,
												ruleForm.groupItemList
											)
										"
									>
										删除
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
			</el-form-item>
		</el-form>
		<!-- 选择商品弹窗 -->
		<el-dialog
			center
			title="选择商品"
			:visible.sync="dialogTableVisible"
			width="1150px"
			destroy-on-close
			:close-on-click-modal="false"
		>
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-form-item label="商品名称">
					<el-input
						v-model.trim="formInline.name"
						size="small"
						placeholder="请输入商品名称"
					></el-input>
				</el-form-item>
				<el-form-item label="商品货号">
					<el-input
						v-model.trim="formInline.itemNo"
						prefix-icon="el-icon-search"
						size="small"
						placeholder="请输入商品货号"
					></el-input>
				</el-form-item>
				<el-form-item label="类目">
					<el-cascader
						:props="catProps"
						v-model.trim="formInline.catName"
						clearable
						@change="onChangeValue"
						size="small"
					></el-cascader>
				</el-form-item>
				<el-form-item label="品牌">
					<el-select
						v-model.trim="formInline.brandId"
						placeholder="品牌名称"
						size="small"
					>
						<el-option
							v-for="item in brands"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onClickSearch" size="small">查询</el-button>
				</el-form-item>
			</el-form>
			<div style="display: flex; justify-content: center;">
				<h4>请选择SPU（单选）</h4>
				<h4><span v-if="isShow">请选择SKU（可多选）</span></h4>
			</div>
			<el-row :gutter="12">
				<el-col :span="12">
					<Table
						:loadData="getList"
						:column="column"
						:params="{ putOn: true }"
						ref="goodsList"
						:select="fun"
						:single="true"
					>
						<template v-slot:cover="{ scope }">
							<el-image
								:src="scope.cover"
								class="admin_avater"
								:preview-src-list="[scope.cover]"
							/>
						</template>
					</Table>
				</el-col>
				<el-col :span="12" v-if="isShow" style="margin-top:20px">
					<el-card shadow="never" class="card" v-for="item in skuData" :key="item.id">
						<el-checkbox-group v-model="checkList" @change="onChangeVal">
							<el-checkbox :label="item.id">
								<div class="clearfix">
									<div class="block">
										<el-image
											style="width: 100%; height: 100%"
											:src="item.img ? item.img : ''"
										></el-image>
									</div>
									<div class="goods_info">
										<span>规格名称：{{ item.name }}</span>
										<p>
											<span>剩余库存： {{ item.stock }}</span>
										</p>
										<div>
											<span class="new_price">
												<span class="price_size">
													{{ moneyFormat(item.price) }}元
												</span>
											</span>
											<span class="old_price">
												{{ moneyFormat(item.originPrice) }}元
											</span>
										</div>
									</div>
								</div>
							</el-checkbox>
						</el-checkbox-group>
					</el-card>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="onClickSkuBtu">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改选择的商品spu 拼团信息 -->
		<el-dialog
			center
			title="修改SPU拼团信息"
			:visible.sync="goodsSPKVisible"
			width="600px"
			destroy-on-close
		>
			<div>
				<el-form
					:model="goodsSPUForm"
					:rules="goodsSPURules"
					ref="goodsSPUModal"
					label-width="100px"
					class="demo-ruleForm"
				>
					<el-form-item label="新用户专享" prop="newUserOnly">
						<el-radio v-model="goodsSPUForm.newUserOnly" label="false">否</el-radio>
						<el-radio v-model="goodsSPUForm.newUserOnly" label="true">是</el-radio>
					</el-form-item>
					<el-form-item label="顺序" prop="sortIndex">
						<el-input
							v-model.trim="goodsSPUForm.sortIndex"
							maxlength="50"
							placeholder="请输入顺序号"
							size="small"
							class="sameWidth"
						></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="goodsSPKVisible = false">取 消</el-button>
				<el-button type="primary" @click="updateSPUGroupsInfo">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑SKU模态窗 -->
		<el-dialog
			center
			title=""
			:close-on-click-modal="false"
			:visible.sync="dialogSKUVisible"
			destroy-on-close
			width="500px"
		>
			<el-form
				:model="SkuForm"
				status-icon
				:rules="skuRules"
				ref="SkuForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="拼团价" prop="price">
					<el-input size="small" v-model.trim="SkuForm.price" maxlength="10"></el-input>
				</el-form-item>
				<el-form-item label="拼团库存" prop="inventoryActNum">
					<el-input
						v-model.number="SkuForm.inventoryActNum"
						maxlength="10"
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item prop="limitNum" label="每人限购数量">
					<el-input
						placeholder="请输入每人限购数量"
						v-model.number="SkuForm.limitNum"
						size="small"
						maxlength="3"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetSkuForm('SkuForm')">取消</el-button>
				<el-button type="primary" @click="submitSkuForm('SkuForm')">确定</el-button>
			</div>
		</el-dialog>
		<!-- 批量填充sku 信息 -->
		<el-dialog
			center
			title="批量填充"
			:close-on-click-modal="false"
			:visible.sync="fillFullDialogVisible"
			destroy-on-close
			width="500px"
		>
			<el-form
				:model="fillSpuForm"
				status-icon
				:rules="fillFullSPURules"
				ref="fillSpuForm"
				label-width="120px"
				class="demo-ruleForm"
			>
				<el-form-item label="拼团价" prop="price">
					<el-input
						size="small"
						v-model.trim="fillSpuForm.price"
						maxlength="10"
					></el-input>
				</el-form-item>
				<el-form-item label="拼团库存" prop="inventoryActNum">
					<el-input
						v-model.number="fillSpuForm.inventoryActNum"
						maxlength="10"
						size="small"
					></el-input>
				</el-form-item>
				<el-form-item prop="limitNum" label="每人限购数量">
					<el-input
						placeholder="请输入每人限购数量"
						v-model.number="fillSpuForm.limitNum"
						size="small"
						maxlength="3"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="resetSPUForm('fillSpuForm')">取消</el-button>
				<el-button type="primary" @click="setFillValToSKU('fillSpuForm')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Table from '@/components/Table/index';
import { getGoods, getGoodsInfo } from '@/api/goods';
import { getAllCat } from '@/api/cat';
import { getBrand } from '@/api/brand';
import { addGroups, groupsInfo, editGroups } from '@/api/marketManage';
import { Message } from 'element-ui';
import { startEndTime } from '@/core/directives/time';
import { moneyFormat } from '@/core/directives/money';
export default {
	name: 'addGroups',
	components: {
		Table,
	},
	data() {
		// 运费校检
		const checkAge = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'));
			} else if (!/^[1-9]\d*|0$/.test(value)) {
				return callback(new Error('请输入大于等于零的整数'));
			} else {
				callback();
			}
		};
		const validatorsortIndex = (rule, value, callback) => {
			if (!/^[1-9][0-9]{0,4}$/.test(value)) {
				return callback(new Error('最多允许输入五位正整数'));
			} else if (value === '') {
				return callback(new Error('请输入数值'));
			} else {
				callback();
			}
		};
		const validatorPriceAchieve = (rule, value, callback) => {
			if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value)) {
				return callback(new Error('只允许输入两位小数的数字'));
			} else if (value === '') {
				return callback(new Error('请输入数值'));
			} else if (value <= 0) {
				return callback(new Error('必须是大于0 的数组'));
			} else {
				callback();
			}
		};
		// 每人限购数量验证
		const validateLimitNum = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入数值'));
			} else {
				if (!/^[1-9]\d*$/.test(value)) {
					callback(new Error('请输入大于零的数值'));
				} else {
					callback();
					// if (value > 10080) {
					// 	callback(new Error('请输入小于10080的正整数'));
					// } else {
					// 	callback();
					// }
				}
			}
		};
		// // 每人限购数量验证
		// const fillValidateLimitNum = (rule, value, callback) => {
		// 	if (value) {
		// 		if (!/^[1-9]\d*$/.test(value)) {
		// 			callback(new Error('请输入大于零的数值'));
		// 		}
		// 	} else {
		// 		callback();
		// 	}
		// };
		const validateRushPrice = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请输入数值'));
			} else if (!/^[0-9]*$/.test(value)) {
				callback(new Error('请输入正确的数值'));
			} else {
				callback();
			}
		};
		return {
			fillSpuItem: null, // 批量填充临时细腻些
			fillFullDialogVisible: false, // 批量填充临时细腻些
			fillSpuForm: {
				price: null, // 活动库存
				inventoryActNum: null, // 限购数量
				limitNum: null, // sku抢购价格
			},
			fillFullSPURules: {
				inventoryActNum: [{ validator: validateLimitNum, trigger: 'blur' }],
				price: [
					{
						validator: validatorPriceAchieve,

						trigger: 'blur',
					},
				],
				limitNum: [{ validator: validateLimitNum, trigger: 'blur' }],
			},
			checkList: [], // 选中的SKU数据列表
			ruleForm: {
				// 拼团信息
				name: null,
				startTime: null,
				limitMinute: null,
				endTime: null,
				personNum: 2,
				// 运费信息
				// fareConfig: {
				// 	freeShip: true,
				// 	notFreeShipInfoList: [
				// 		{
				// 			fare: '',
				// 			name: '',
				// 		},
				// 	],
				// },
				// 商品SPU和SKU信息
				groupItemList: [],
			},
			begPickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
				},
			},

			posts: [],
			checked: true,
			rules: {
				name: [
					{ required: true, message: '请输入拼团标题', trigger: 'blur' },
					{
						min: 2,
						max: 50,
						message: '长度在 2 到 50 个字符',
						trigger: 'blur',
					},
				],
				personNum: [{ required: true, message: '请输入拼团人数', trigger: 'blur' }],
				startTime: [{ required: true, message: '请选择拼团开始时间', trigger: 'blur' }],
				endTime: [{ required: true, message: '请选择拼团结束时间', trigger: 'blur' }],
				limitMinute: [
					{
						validator: validateLimitNum,
						required: true,
						trigger: 'blur',
					},
				],
				fareConfig: {
					fare: [{ validator: checkAge, required: true, trigger: 'blur' }],
					freeShip: [{ required: true, message: '请选择是否包邮', trigger: 'change' }],
					priceAchieve: [
						{
							validator: validatorPriceAchieve,
							required: true,
						},
					],
					farePrice: [
						{
							validator: checkAge,
							required: true,
						},
					],
				},
				groupItemList: [{ required: true, message: '请选择添加拼团商品', trigger: 'blur' }],
			},
			provinces: [
				{ n: '西藏' },
				{ n: '新疆' },
				{ n: '内蒙古' },
				{ n: '青海' },
				{ n: '宁夏' },
				{ n: '海南' },
			],
			brands: [],
			catProps: {
				lazy: true,
				lazyLoad(node, resolve) {
					const { level } = node;
					if (!node.data) {
						getAllCat({ size: 100 }).then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								};
							});
							resolve(nodes);
						});
					} else {
						getAllCat({ parentId: node.data.value, size: 100 }).then(res => {
							const nodes = Array.from(res.data.list).map(item => {
								return {
									value: item.id,
									label: item.name,
									leaf: level >= 1,
								};
							});
							resolve(nodes);
						});
					}
				},
			},
			goodsInfo: false,
			// 弹窗
			dialogTableVisible: false,
			column: [
				{
					prop: 'name',
					label: '商品名称',
					formatter: row => {
						if (row.putOn) {
							return row.name;
						} else {
							return `（已下架）${row.name}`;
						}
					},
				},
				{
					prop: 'itemNo',
					label: '商品货号',
				},
				{ prop: 'stock', label: '剩余库存' },
				{
					prop: 'defaultPrice',
					label: '价格',
					formatter: row => {
						return `${moneyFormat(row.defaultPrice)}元`;
					},
				},
				{ prop: 'cover', label: '商品图片', render: true },
			],
			formInline: {
				name: '',
				brandId: null,
				catId: null,
				parentCatId: null,
			},
			id: this.$route.query.id || null,
			// spu 修改拼团信息
			goodsSPKVisible: false,
			goodsSPUForm: {
				sortIndex: null,
				newUserOnly: null,
			},
			goodsSPURules: {
				newUserOnly: [
					{
						message: '请选择',
						required: true,
					},
				],
				sortIndex: [{ validator: validatorsortIndex, required: true, trigger: 'blur' }],
			},
			// spu 修改拼团信息 end
			isShow: false,
			goodsName: '',
			spuInfo: null,
			skuData: [],
			skuInfoForm: {},
			addGoodsList: [],
			SKUVisible: false, // 修改 SPU 商品的 SKU 信息
			itemsIndex: null, // spu 商品列表的下标
			dialogSKUVisible: false, // 编辑SKU模态窗
			// 编辑SKU 表单数据
			SkuForm: {
				inventoryActNum: null, // 拼团库存
				limitNum: null, // 限购数量
				price: null, // sku现价
				inventoryNum: null, // SKU 库存
			},
			skuRules: {
				inventoryActNum: [{ validator: validateLimitNum, required: true, trigger: 'blur' }],
				price: [
					{
						validator: validatorPriceAchieve,
						required: true,
						trigger: 'blur',
					},
				],
				limitNum: [{ validator: validateLimitNum, required: true, trigger: 'blur' }],
			},
			itemId: null, // SPU 商品id
			skuIndex: null, // SKU 列表下标
		};
	},

	mounted() {
		// 获取拼团信息
		if (this.id) {
			groupsInfo({ id: this.id }).then(res => {
				// console.log(res)
				if (res.success) {
					this.ruleForm = res.data;
					this.ruleForm.personNum = 2;
					this.goodsInfo = true;
				}
			});
		}
	},
	computed: {
		// 获取商品列表
		getList() {
			return getGoods;
		},
	},
	methods: {
		// 批量填充sku 打卡弹窗
		openFillDialog(spuItem, index) {
			this.fillSpuItem = spuItem;
			this.fillFullDialogVisible = true;
			console.log(spuItem, index);
		},
		// SKU 编辑模态窗取消事件
		resetSPUForm(formName) {
			this.$refs[formName].resetFields();
			this.fillFullDialogVisible = false;
		},
		setFillValToSKU(formName) {
			// if (this.fillSpuForm.limitNum === null) {
			// 		Message.error('请输入限购数量');
			// 		return false;
			// 	} else if (!/^[1-9]\d*$/.test(this.fillSpuForm.limitNum)) {
			// 		Message.error('请输入大于零的整数');
			// 		return false;
			// 	}
			if (this.fillSpuForm.inventoryActNum < this.fillSpuForm.limitNum * 2) {
				this.$message.error('拼团库存不能小于单人限购数量的两倍');
				return false;
			}
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.fillSpuItem.groupItemSkuList.forEach(element => {
						// console.log(element);
						element.inventoryActNum = this.fillSpuForm.inventoryActNum;
						element.limitNum = this.fillSpuForm.limitNum;
						element.price = this.fillSpuForm.price;
					});
					Message.success('批量填充成功！！');
					this.resetSPUForm(formName);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		moneyFormat(num) {
			return moneyFormat(num);
		},
		onChangeVal(val) {
			// 循环选中的 SKU 商品id
			this.checkList.forEach((element, index) => {
				// 循环 SKU 列表
				this.skuData.forEach(item => {
					// 如果选中的 SKU 商品的库存为 0 ，给出提示 库存不足
					if (element === item.id && item.stock < 1) {
						Message.error(`该SKU商品库存不足，请重新选择`);
						// 然后把当前选中的 SKU 商品 ID 从选中列表中删除
						this.checkList.splice(index, 1);
					}
					// if (!element.putOn) {
					// 	Message.error('该SPU商品已下架，请重新选择')
					// 	this.checkList.splice(index, 1)
					// }
				});
			});
		},
		// 弹窗
		onClickDialog() {
			this.isShow = false;
			this.formInline = {};
			this.checkList = []; // 重置选中的SKU列表
			this.dialogTableVisible = true;
			// 获取品牌列表
			getBrand().then(res => {
				if (res.success) {
					this.brands = res.data.list;
				}
			});
		},
		// 获取选中商品的Sku信息
		fun(val) {
			console.log(val);
			if (val[0].stock < 1) {
				Message.error('该SPU商品库存不足，请重新选择');
				this.isShow = false;
				return false;
			}
			if (!val[0].putOn) {
				Message.error('该SPU商品已下架，请重新选择');
				this.isShow = false;
				return false;
			}
			this.spuInfo = val[0];
			this.checkList = []; // 重置选中的SKU列表
			this.getSkuData(val[0].id);
		},
		// 传入 SPU 商品的 id 获取该商品的 SKU 信息
		getSkuData(id) {
			getGoodsInfo({ id: id }).then(res => {
				if (res.success) {
					this.skuData = res.data;
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			});
		},
		// 修改 SPU 商品的 SKU 信息
		editClick(item, index) {
			// console.log(val)
			this.goodsSPUForm.sortIndex = item.sortIndex;
			this.goodsSPUForm.newUserOnly = item.newUserOnly + '';
			this.itemsIndex = index;
			this.goodsSPKVisible = true;

			// item.groupItemSkuList.forEach(element => {
			// 	this.checkList.push(element.itemId);
			// });

			// this.getSkuData(item.itemId);
			// console.log(this.checkList);
		},
		updateSPUGroupsInfo() {
			//
			this.$refs.goodsSPUModal.validate(valid => {
				if (valid) {
					console.log(this.goodsSPUForm);
					this.ruleForm.groupItemList[
						this.itemsIndex
					].sortIndex = this.goodsSPUForm.sortIndex;
					this.ruleForm.groupItemList[this.itemsIndex].newUserOnly =
						this.goodsSPUForm.newUserOnly == 'true' ? true : false;

					this.$refs.goodsSPUModal.resetFields();

					this.goodsSPKVisible = false;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		// 确认选择拼团商品
		onClickSkuBtu() {
			let tempInfo = {};
			if (!this.spuInfo) {
				Message.error('主选择SPU商品');
				return false;
			} else {
				tempInfo = {
					cover: this.spuInfo.cover, // 商品封面图
					itemId: this.spuInfo.id, // 商品id
					groupId: this.spuInfo.id, // 商品id
					name: this.spuInfo.name, // 商品名称
					summary: this.spuInfo.summary, // 商品简介
					sortIndex: 1, // 商品顺序默认为1
					newUserOnly: false, // 是否新用户专享
					groupItemSkuList: [],
				};
			}
			if (this.checkList.length < 1) {
				Message.error('请选择SKU规格');
				return false;
			} else {
				let _that = this;
				let sameSpuItemInfo = {
					index: -1,
					spuItem: {},
					skuArray: [],
				};
				// 首选判断当前的skuid，是否在 已经存在
				this.ruleForm.groupItemList.forEach((spuItem, index) => {
					//判断已经勾选的spu 中是否有相同的spu 信息
					if (this.spuInfo.id == spuItem.itemId) {
						sameSpuItemInfo.index = index;
						sameSpuItemInfo.spuItem = spuItem;
						spuItem.groupItemSkuList.forEach(skuItem => {
							if (_that.checkList.includes(skuItem.skuId)) {
								sameSpuItemInfo.skuArray.push(skuItem.skuId);
							}
						});
					}
				});

				// 检查是否有相同的spu 信息
				if (sameSpuItemInfo.index != -1) {
					// 有相同的spu 信息

					// 用户勾选中 sku id 数组
					this.checkList.forEach(element => {
						// 弹窗勾选的sku 信息 当前sku 数组对象
						this.skuData.forEach(skuItem => {
							// 处理用户勾选的 sku Item
							if (element === skuItem.id) {
								// 判断用户勾选的sku Item 之前是否勾选过
								if (sameSpuItemInfo.skuArray.includes(skuItem.id)) {
									// 包含相同的SKUItem，不做覆盖，跳过
								} else {
									//  当前skuItem 没有勾选过，追加到现在的spu 信息里面
									const _tempSkuItem = {
										cover: skuItem.img, // 关联商品 sku 图片
										name: skuItem.name, // 关联商品 sku 规则
										originPrice: skuItem.price, //  sku 原价
										spuId: skuItem.itemId, // spu id
										skuId: skuItem.id, // 关联商品 skuId
										itemId: skuItem.itemId, // 关联商品 skuId
										properties: skuItem.properties, // SKU的属性 【颜色:绿色;内存:64G;版本:公开版】
										inventoryNum: skuItem.stock, // SKU 库存
										price: null, // 拼团价
										limitNum: null, // 单人限购数量，若不限制为-1
										inventoryActNum: null, // 拼团库存
									};
									this.ruleForm.groupItemList[
										sameSpuItemInfo.index
									].groupItemSkuList.push(_tempSkuItem);
								}
							}
						});
					});
					// this.ruleForm.groupItemList[sameSpuItemInfo.index]
				} else {
					// 用户勾选中 sku id 数组
					this.checkList.forEach(element => {
						// 弹窗勾选的sku 信息 当前sku 数组对象
						this.skuData.forEach(item => {
							//  ;
							if (element === item.id) {
								tempInfo.groupItemSkuList.push({
									cover: item.img, // 关联商品 sku 图片
									name: item.name, // 关联商品 sku 规则
									originPrice: item.price, //  sku 原价
									spuId: item.itemId, // spu id
									skuId: item.id, // 关联商品 skuId
									itemId: item.itemId, // 关联商品 skuId
									properties: item.properties, // SKU的属性 【颜色:绿色;内存:64G;版本:公开版】
									inventoryNum: item.stock, // SKU 库存
									price: null, // 拼团价
									limitNum: null, // 单人限购数量，若不限制为-1
									inventoryActNum: null, // 拼团库存
								});
							}
						});
					});
					this.ruleForm.groupItemList.push(tempInfo);
				}

				// console.log(this.ruleForm.groupItemList);
			}
			this.checkList = [];
			this.dialogTableVisible = false;
			this.goodsInfo = true;
		},
		// SKU编辑  打开编辑界面事件
		handleClick(val, index, spuIndex) {
			console.log('handleClick', val);

			// this.$refs.SkuForm.resetFields()
			console.log(val.price);
			this.spuIndex = spuIndex;
			this.itemId = val.skuId;
			this.skuIndex = index;
			this.SkuForm.price = val.price || null;
			this.SkuForm.inventoryNum = val.inventoryNum;
			this.SkuForm.inventoryActNum = val.inventoryActNum;
			this.SkuForm.originPrice = val.originPrice;
			this.SkuForm.limitNum = val.limitNum;
			this.dialogSKUVisible = true;
		},
		// SKU 编辑模态窗确定事件
		submitSkuForm(formName) {
			// if (!this.checked) {
			// 	this.SkuForm.limitNum = -1;
			// } else {
			// 	if (this.SkuForm.limitNum === null) {
			// 		Message.error('请输入限购数量');
			// 		return false;
			// 	} else if (!/^[1-9]\d*$/.test(this.SkuForm.limitNum)) {
			// 		Message.error('每人限购请输入大于零的整数');
			// 		return false;
			// 	}
			// }
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.SkuForm.originPrice < this.SkuForm.price) {
						this.$message.error('拼团价格不能大于等于售价');
						return false;
					}
					// if (this.SkuForm.inventoryNum < this.SkuForm.inventoryActNum) {
					// 	this.$message.error('拼团库存不能大于SKU商品库存');
					// 	return false;
					// }
					if (this.SkuForm.inventoryActNum < this.SkuForm.limitNum * 2) {
						this.$message.error('拼团库存不能小于限购数量的两倍');
						return false;
					}
					this.ruleForm.groupItemList[this.spuIndex].groupItemSkuList.forEach(element => {
						console.log(element, this.itemId);
						if (element.skuId == this.itemId) {
							element.inventoryActNum = this.SkuForm.inventoryActNum;

							element.limitNum = this.SkuForm.limitNum;

							element.price = this.SkuForm.price;

							console.log('element', element);
						}
					});
					Message.success('添加成功！！');
					this.dialogSKUVisible = false;
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		// SKU 编辑模态窗取消事件
		resetSkuForm(formName) {
			this.$refs[formName].resetFields();
			this.dialogSKUVisible = false;
		},
		// 删除 SKU 列表商品
		deleteSku(index, rows, data) {
			// 否则删除 当前的 SKU 商品
			// rows.splice(index, 1);
			if (rows.length < 2) {
				// 如果 SKU 列表的长度小于2，就直接将将当前 SPU 商品删除
				for (let i = 0; i < data.length; i++) {
					if (data[i].itemId === rows[index].spuId) {
						data.splice(i, 1);
						break;
					}
				}
			} else {
				// 否则删除 当前的 SKU 商品
				rows.splice(index, 1);
			}
		},
		// 删除选择的 SPU 商品
		deleteClick(index) {
			this.ruleForm.groupItemList.splice(index, 1);
		},
		// 删除行
		deleteRow(index, rows) {
			// rows.splice(index, 1);
			// this.ruleForm.fareConfig.notFreeShipInfoList.splice(index, 1);
		},
		// 添加行
		handleAdd() {
			// if (
			// 	this.ruleForm.fareConfig.notFreeShipInfoList &&
			// 	this.ruleForm.fareConfig.notFreeShipInfoList.length
			// ) {
			// 	this.ruleForm.fareConfig.notFreeShipInfoList.push({
			// 		fare: '',
			// 		name: '',
			// 	});
			// } else {
			// 	this.ruleForm.fareConfig.notFreeShipInfoList = [{ name: '', fare: '' }];
			// }
		},
		getcity() {},
		// 确定保存
		submitForm(formName) {
			if (this.ruleForm.groupItemList.length > 0) {
				let newItems = this.ruleForm.groupItemList;
				for (let i = 0; i < newItems.length; i++) {
					const groupItemSkuList = newItems[i].groupItemSkuList;
					for (let j = 0; j < groupItemSkuList.length; j++) {
						if (groupItemSkuList[j].price === null) {
							Message.error('请检查SKU列表，编辑填写SKU抢购信息');
							return false;
						} else if (groupItemSkuList[j].inventoryActNum === null) {
							Message.error('请检查SKU列表，编辑填写拼团库存信息');
							return false;
						} else if (groupItemSkuList[j].limitNum === null) {
							Message.error('请检查SKU列表，编辑填写单人限购信息');
							return false;
						}
					}
				}
			}

			this.$refs[formName].validate(valid => {
				if (valid) {
					// const tempArr = this.ruleForm.fareConfig.notFreeShipInfoList;
					// 现在是全平台包邮
					// console.log(tempArr);
					// if (tempArr.length > 0) {
					// 	for (let i = 0; i < tempArr.length; i++) {
					// 		if (tempArr[i].name === '') {
					// 			this.$message.error('请选择不包邮的省份');
					// 			return false;
					// 		} else if (tempArr[i].fare === '') {
					// 			this.$message.error('请输入运费金额');
					// 			return false;
					// 		} else if (!/^[1-9]\d*$/.test(tempArr[i].fare)) {
					// 			this.$message.error('运费请输入大于零的整数');
					// 			return false;
					// 		}
					// 	}
					// } else {
					// 	this.$message.error('请添加不包邮地区信息');
					// 	return false;
					// }
					if (this.ruleForm.startTime >= this.ruleForm.endTime) {
						this.$message.error('拼团结束时间不能小于、等于拼团开始时间');
						return false;
					}

					if (this.id) {
						// 编辑
						editGroups({
							...this.ruleForm,
							id: this.id,
						}).then(res => {
							if (res.success) {
								Message.success('修改成功！！');
								this.$router.go(-1);
							}
						});
					} else {
						// 添加
						// console.log(this.ruleForm);
						addGroups({ ...this.ruleForm }).then(res => {
							if (res.success) {
								Message.success('添加成功！！');
								this.$router.go(-1);
							}
						});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		// 选择类目ID
		onChangeValue(value) {
			this.formInline.catId = value[1];
			this.formInline.parentCatId = value[0];
		},
		// 查询
		onClickSearch() {
			console.log(this.formInline);
			delete this.formInline.catName;
			this.$refs.goodsList.update({ ...this.formInline });
		},
	},
};
</script>

<style lang="scss" scoped>
.addGroups {
	padding: 20px;
	.sameWidth {
		width: 400px;
	}
}
.parallel {
	display: flex;
}
.box-card {
	width: 90%;
	position: relative;
}
.clearfix {
	display: flex;
}
.new_price {
	color: red;
	font-weight: 600;
	margin-right: 10px;
}
.price_size {
	font-size: 18px;
}
.block {
	width: 100px;
	height: 100px;
}
.goods_info {
	flex: 3;
	margin-left: 20px;
}
.goodsItem_item {
	flex: 1;
	margin-left: 20px;
}
.content {
	display: flex;
}
.radioGroup {
	display: flex;
	flex-direction: column;
}
.admin_avater {
	width: 100px;
}
.el-checkbox {
	display: flex;
	align-items: center;
}
.el-col-12 {
	max-height: 500px;
	overflow-y: auto;
}
h4 {
	margin: 0;
	padding-bottom: 10px;
	text-align: center;
	flex: 1;
}
.editBtu {
	position: absolute;
	right: 20px;
	bottom: 10px;
}
.item_tip {
	line-height: 24px;
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.spuName {
	white-space: pre-wrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	-webkit-box-orient: vertical;
}
.el-textarea {
	width: 400px;
}
.el-textarea {
	width: 400px;
}
</style>
