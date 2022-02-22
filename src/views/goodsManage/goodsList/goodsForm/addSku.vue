<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 12:23:33
 * @LastEditTime: 2021-08-20 10:36:35
 * @LastEditors: jiu yin zhen jing
 * @Description:
-->
<template>
  <div>
    <el-form label-position="left" label-width="100px" class="goodsForm" ref="infomationForm" :model="infomationForm">
      <el-form-item label="添加SKU" :required="true">
        <div class="goods_attribute">
          <div class="goods_attribute_item">
            <el-form-item label="SKU列表"></el-form-item>
            <div v-for="(skuItem, index) in SKUList" :key="'skuItem_' + index">
              <div>{{ skuItem.name }}</div>
              <el-checkbox-group v-model.trim="chooseSkuItem" @change="handleSku(skuItem.name)">
                <el-checkbox :label="item" v-for="item in skuItem.list" :key="'sku_' + item">
                  {{ item }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <el-button type="primary" size="small" @click="createSku">确认生成</el-button>
        </div>
      </el-form-item>

      <el-form-item label="支付服务" :required="true">
        <el-radio-group v-model="payMode">
          <el-radio :label="0">积分支付</el-radio>
          <el-radio :label="1">积分+现金支付</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :required="true">
        <el-button type="primary" size="small" @click="openFillItem">
          批量填充设置
        </el-button>
        <el-table :data="SKUdata">
          <el-table-column :prop="item.prop" :label="item.label" v-for="item in SKUcolumn" :key="item.prop">
            <template v-slot="scope" v-if="item.prop == 'operation'" width="120px">
              <el-button @click.native.prevent="deleteSku(scope.$index)" type="text" size="small">
                删除
              </el-button>
              <el-button @click.native.prevent="editSku(scope.row, scope.$index)" type="text" size="small">
                编辑
              </el-button>
            </template>
            <template v-slot="scope" v-else-if="item.prop == 'displayUrl'">
              <el-image v-if="scope.row.displayUrl" :src="scope.row.displayUrl" :preview-src-list="[scope.row.displayUrl]" />
            </template>
            <template v-slot="scope" v-else-if="item.prop === 'originPrice'">
              <span>{{ moneyFormat(scope.row.originPrice || 0) }}元</span>
            </template>
            <template v-slot="scope" v-else-if="item.prop === 'price'">
              <span>{{ moneyFormat(scope.row.price || 0) }}元</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="商品详情" :required="true" prop="infoUrls" :rules="{ required: true, message: '商品详情图片不能为空！' }">
        <!-- <CropperImg v-model.trim="infomationForm.infoUrls" :limit="9"></CropperImg> -->
        <UploadImgDrag v-model.trim="infomationForm.infoUrls" :ImgType="ImageType" :size="1000" :limit="10"></UploadImgDrag>
      </el-form-item>
    </el-form>
    <!-- sku表格弹窗 -->
    <el-dialog title="编辑SKU" :visible.sync="skuVisible" :before-close="() => (skuVisible = false)" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true" custom-class="dialogStyle">
      <el-form :model="skuForm" label-width="100px" class="demo-ruleForm" ref="skuForm" :required="true" :rules="addSkuRules">
        <el-row>
          <el-col :span="10">
            <el-form-item label="商品库存" prop="stock" required>
              <el-input v-model.number="skuForm.stock" maxlength="6" placeholder="商品库存" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="库存预警值" prop="stockAlarm" required>
              <el-input v-model.number="skuForm.stockAlarm" maxlength="6" placeholder="库存预警值" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="价格(积分)" prop="amount">
              <el-input v-model.trim="skuForm.amount" maxlength="6" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" v-if="payMode">
            <el-form-item label="价格(现金)" prop="cash">
              <el-input v-model.trim="skuForm.cash" maxlength="9" placeholder="请输入" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="展示图" prop="displayUrl" required>
              <UploadImgDrag v-model.trim="skuForm.displayUrl"></UploadImgDrag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsku">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量填充 -->
    <el-dialog title="批量填充" :visible.sync="fillAllVisible" :before-close="() => (fillAllVisible = false)" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true" custom-class="dialogStyle">
      <el-form ref="fillInfoForm" :model="fillALLModel" :rules="fillAllRules" class="login-form" auto-complete="on" label-position="left" label-width="100px">
        <el-form-item prop="amount" label="价格(积分)">
          <el-input class="input-new-tag" v-model.trim="fillALLModel.amount" size="small" type="number"></el-input>
        </el-form-item>

        <el-form-item prop="cash" label="价格(现金)" v-if="payMode">
          <el-input class="input-new-tag" v-model.trim="fillALLModel.cash" size="small" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="commodityInventory" label="商品库存">
          <el-input class="input-new-tag" v-model.trim="fillALLModel.commodityInventory" size="small" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="minCommodityInventory" label="库存预警值">
          <el-input class="input-new-tag" v-model.trim="fillALLModel.minCommodityInventory" size="small" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fillAllVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFillAllBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import CropperImg from "@/components/cropperImg/index";
import UploadImg from "@/components/upload/index";
import UploadImgDrag from "@/components/uploadDrag";

import { getBrandList, getGoodListApi } from "@/api/mall";
import { getCategoryList, goodsAttrList } from "@/api/cat";
import { getSku } from "@/utils";
import { moneyFormat } from "@/core/directives/money";
import { Message } from "element-ui";
export default {
  components: {
    Table,
    CropperImg,
    UploadImg,
    UploadImgDrag,
  },
  props: ["detailData"],
  data() {
    const checkNumCost = (rule, value, callback) => {
      // console.log('checkNumCost', rule, value, callback);
      if (value) {
        if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value)) {
          return callback(new Error("请输入大于零且最多两位小数的数值"));
        } else {
          return callback();
        }
      } else {
        callback();
      }
    };
    const checkedNumber = (rule, value, callback) => {
      if (!/(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/.test(value)) {
        return callback(new Error("请输入大于零且最多两位小数的数值"));
      } else if (value === "") {
        return callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    const checkCountNum = (rule, value, callback) => {
      if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error("请输入大于零,且最长为6位的正整数"));
      } else if (value === "") {
        return callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    const checkCountFixed = (rule, value, callback) => {
      if (!/(^[1-9][0-9]{0,5}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/.test(value)) {
        return callback(new Error("请输入大于零,且最长为6位的正数或2位小数"));
      } else if (value === "") {
        return callback(new Error("请输入数值"));
      } else {
        callback();
      }
    };
    const checkMinNum = (rule, value, callback) => {
      if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error("请输入大于零,且最长为6位的正整数"));
      } else if (+this.fillALLModel.commodityInventory < +this.fillALLModel.minCommodityInventory) {
        return callback(new Error("预警库存必须小于销量库存"));
      } else {
        callback();
      }
    };
    return {
      brands: [], // 相关商品弹窗的 品牌列表数据
      payMode: 0, //支付服务
      formInline: {},
      clearSKUList: false,
      ImageType: ["png", "jpg", "jpeg", "gif"],
      size:1024,
      // 批量填充
      fillAllVisible: false,
      fillALLModel: {
        amount: null, // 价格(积分)
        cash: null, // 价格(现金)
        commodityInventory: null, //商品库存
        minCommodityInventory: null, //最小库存预警值
      },

      categoryId: 0,
      listQuery: {
        current: 1,
        size: 100,
      },
      SKUList: [], //规格参数  sku列表数据
      catSpecList: [], //属性参数
      skuVisible: false, //sku表格添加/编辑弹窗
      catSpecVisible: false, //参数添加/编辑弹窗
      checkBoxVisible: false, //sku编辑
      chooseSkuItem: [], //用户选择sku数据
      chooseSku: {}, //sku选择后重构数据结构
      SKUdata: [], //用户生成表单时sku数据
      SKUcolumn: [], //生成表头
      apiSKUdata: [], //编辑时保存原始sku数据 该数据不做curd操作 除非用户在表格中手动删除
      apichooseSkuItem: [], //编辑时保存的原始选中项

      prevSkuName: {}, //存储上次skuName
      infomationForm: {
        infoUrls: [], //商品详情
      },
      skuForm: {
        index: "",
        amount: "",
        cash: "",
        originPrice: "",
        price: "",
        stock: "",
        stockAlarm: "",
        displayUrl: "",
      }, //sku弹窗
      catSpec: {
        index: "",
        name: "",
        value: "",
      },
      delKey: [], //清除过的sku属性
      tagValue: "", //sku属性tag
      editcatSpec: "", //编辑当前参数
      data: "",
      fillAllRules: {
        amount: {
          validator: checkCountNum,
          required: true,
        },
        cash: {
          validator: checkCountNum,
          required: true,
        },
        crossedPrice: {
          validator: checkCountNum,
          required: true,
        },
        commodityInventory: {
          validator: checkCountNum,
          required: true,
        },
        minCommodityInventory: {
          validator: checkMinNum,
        },
      },
      addSkuRules: {
        amount: {
          validator: checkCountNum,
          required: true,
        },
        cash: {
          validator: checkCountFixed,
          required: true,
        },
        originPrice: {
          validator: checkCountNum,
          required: true,

          // message: '输入正确的划线价，整数或小数！',
          // pattern: /^\d+(\.\d+)?$/,
        },
        price: {
          validator: checkCountNum,
          required: true,

          // message: '输入正确的未划线价，整数或小数！',
          // pattern: /^\d+(\.\d+)?$/,
        },
        stock: {
          required: true,
          message: "请输入正确的商品库存，1-6位正整数！",
          pattern: /^[0-9]{1,5}$/,
        },
        stockAlarm: {
          required: true,
          message: "请输入正确的库存预警值，1-6位正整数！",
          pattern: /^[0-9]{1,5}$/,
        },
        displayUrl: {
          type: "string",
          required: true,
          message: "展示图不能为空！",
        },
      },
      catSpecRules: {
        value: {
          type: "string",
          required: true,
          message: "描述不能为空！",
        },
      },
    };
  },
  watch: {
    //支付方式 动态显示
    payMode(newValue, oldValue) {
      let indexAmount = null;
      this.SKUcolumn.forEach((item, index) => {
        if (item.prop == "amount") {
          indexAmount = index;
        }
      });
      if (newValue) {
        //表头显示
        this.SKUcolumn.splice(indexAmount + 1, 0, { prop: "cash", label: "价格(现金)" });
      } else {
        this.SKUcolumn.splice(indexAmount + 1, 1);
      }
    },
    //编辑
    detailData(newValue, oldValue) {
      if (newValue === oldValue) {
        return false;
      }
      this.data = newValue;
      console.log(this.data);
      this.payMode = this.data.payMode;

      let { specList, infoUrls } = this.data;

      // let skuObj = getSku(specList) || [];
      let currHeader = []; //表头
      let _tempInfoUrls = infoUrls.split(",");
      if (infoUrls.length > 2) {
        _tempInfoUrls = infoUrls && infoUrls.split(",");
      }

      // for (let i = 0; i < skuObj.handle.length / 2; i++) {
      // 	this.handleSku(skuObj.handle[2 * i], skuObj.handle[2 * i + 1]);
      // 	this.apichooseSkuItem.push(skuObj.handle[2 * i + 1]); //保存一份原始选中项
      // 	this.apichooseSkuItem = Array.from(new Set(this.apichooseSkuItem));
      // }

      this.infomationForm.infoUrls = _tempInfoUrls;

      for (let j = 0; j < specList.length; j++) {
        let arr = specList[j].specAttrList;
        let obj = {};
        for (let i = 0; i < arr.length; i++) {
          //动态表头
          let _tempObj = {};
          _tempObj.attrId = arr[i].attrId;
          _tempObj.prop = `sku${i}`;
          _tempObj.label = arr[i].attrName;

          if (j == 0) {
            currHeader.push(_tempObj);
          }
          // 这里少循环一次 因为最后值为空
          obj[`sku${i}`] = arr[i].attrValue;
        }

        obj.specId = specList[j].specId;
        obj.amount = specList[j].amount;
        obj.cash = specList[j].cash?specList[j].cash:"";
        obj.stock = specList[j].stock;
        obj.stockAlarm = specList[j].stockAlarm;
        obj.displayUrl = specList[j].displayUrl;
        this.SKUdata.push(obj);
        this.apiSKUdata.push(obj); //保存一份原始接口数据
      }
      console.log(this.apiSKUdata);
      // 表头
      this.SKUcolumn = [
        ...currHeader,
        {
          prop: "amount",
          label: "价格(积分)",
        },
        {
          prop: "stock",
          label: "商品库存",
        },
        {
          prop: "stockAlarm",
          label: "库存预警值",
          width: "100",
        },
        {
          prop: "displayUrl",
          label: "展示图",
        },
        {
          prop: "operation",
          label: "操作",
        },
      ];
      this.$forceUpdate();
    },
  },
  compued: {},

  mounted() {
    // console.log('this.data', this.$route.query.eId);
    let _goodsId = this.$route.query.eId;
  },
  methods: {
    //下一步表格
    restoreSKUInfo() {
      this.chooseSkuItem = [];
      this.apiSKUdata = [];
      this.clearSKUList = true;
      this.chooseSku = [];
      this.apichooseSkuItem = [];
      this.SKUdata = [];
      this.SKUcolumn = [
        {
          prop: "amount",
          label: "价格(积分)",
        },
        {
          prop: "stock",
          label: "商品库存",
        },
        {
          prop: "stockAlarm",
          label: "库存预警值",
        },
        {
          prop: "displayUrl",
          label: "展示图",
        },
        {
          prop: "operation",
          label: "操作",
        },
      ];
      this.$forceUpdate();
    },
    //获取sku列表
    goodsAttrListInfo(params) {
      goodsAttrList({ ...this.listQuery, ...params }).then((res) => {
        if (res.code === 200) {
          this.SKUList = res.data.map((item) => {
            return {
              attrId: item.id,
              name: item.attrName,
              list: item.attrVales.split(","),
              // addFlag: item.addFlag || false,
            };
          });
          this.loading = false;
        }
      });
    },

    // sku属性列表添加
    handleInputConfirm() {
      let inputValue = this.tagValue;
      if (inputValue) {
        inputValue = inputValue.replace(/\s+/g, "");
        this.editcatSpec.list.forEach((item) => {
          if (inputValue === item) {
            return Message.warning("该属性值已经存在！");
          }
        });
        this.editcatSpec.list.push(inputValue);
        this.tagValue = "";
      }
    },
    //  sku属性列表删除
    // handleClose(tag) {
    // 	this.editcatSpec.list.splice(this.tagValue.indexOf(tag), 1);
    // },

    setFillAllBtn() {
      this.$refs.fillInfoForm.validate((valid) => {
        if (valid) {
          // 这里循环设置 划线价 未划线价 库存 预警库存
          if (Number(this.fillALLModel.crossedPrice) < Number(this.fillALLModel.unCrossedPrice)) {
            Message.warning("未划线价应小于划线价！");
            return false;
          }
          // console.log(this.fillALLModel);
          // console.log(this.SKUdata);
          const _tempSKUdata = [...this.SKUdata];
          _tempSKUdata.forEach((item) => {
            item.amount = this.fillALLModel.amount;
            item.cash = this.fillALLModel.cash;
            item.stock = this.fillALLModel.commodityInventory;
            item.stockAlarm = this.fillALLModel.minCommodityInventory;
          });
          this.SKUdata = [..._tempSKUdata];
          this.fillAllVisible = false;
          this.$refs.fillInfoForm.resetFields();
        }
      });
    },
    openFillItem() {
      this.fillAllVisible = true;
    },
    // 选择sku
    /**
     * @name:
     * @description:
     * @param {type} skuName 选择时skuname属性 sku编辑时需要同步传递sku值进来
     * @return:
     */
    handleSku(skuName, sku, e) {
      //需要编辑时勾选 则打开此注释
      if (sku) {
        this.chooseSkuItem.push(sku);
      }
      let isNew = true; //是否为已存在属性
      let key; //已存在属性的key
      let arr = Object.keys(this.chooseSku);
      let newItem = this.chooseSkuItem[this.chooseSkuItem.length - 1]; //新加的值
      let prevName = this.prevSkuName.name;
      let prevValues = this.prevSkuName.values || [];
      let isAdd = this.chooseSkuItem.length >= prevValues.length ? true : false; //用户操作类型
      let delItem; //删除的值
      if (!isAdd) {
        // 找出删除value
        prevValues.forEach((item) => {
          if (this.chooseSkuItem.indexOf(item) === -1) {
            delItem = item;
          }
        });
      }
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === skuName) {
          //判断是否是存在属性
          isNew = false;
          key = arr[i];
        }
      }
      if (skuName !== prevName) {
        // 属性名称改变 两次不同属性
        if (isNew) {
          //新的属性
          this.chooseSku[skuName] = [newItem];
        } else {
          // 已存在属性 排除不同的 加上之前的
          let arr = this.chooseSku[key];
          if (isAdd) {
            // 增加
            arr.push(newItem);
          } else {
            //删除
            let arr2 = arr.filter((item) => {
              return item !== delItem;
            });
            arr = arr2;
          }
          arr = Array.from(new Set(arr));
          arr = arr.filter((item) => {
            return item !== undefined;
          });
          if (arr.length) {
            this.chooseSku[key] = arr;
          } else {
            delete this.chooseSku[key];
          }
        }
      } else {
        // 属性名称没有改变 两次同一属性
        if (isNew) {
          if (this.delKey.indexOf(skuName) !== -1) {
            //新的属性且之前没有添加过的
            this.chooseSku[skuName] = this.chooseSkuItem;
          } else {
            // 新属性之前有添加过
            this.chooseSku[skuName] = [newItem];
          }
        } else {
          // 已存在属性 排除不同的 加上之前的
          let arr = this.chooseSku[key];
          if (isAdd) {
            // 增加
            arr.push(newItem);
          } else {
            // 删除
            let arr2 = arr.filter((item) => {
              return item !== delItem;
            });
            arr = arr2;
          }
          // 去重且过滤空
          arr = Array.from(new Set(arr));
          arr = arr.filter((item) => {
            return item !== undefined;
          });
          if (arr.length) {
            this.chooseSku[key] = arr;
          } else {
            delete this.chooseSku[key];
          }
        }
      }
      this.chooseSkuItem = Array.from(new Set(this.chooseSkuItem));
      this.prevSkuName.values = this.chooseSkuItem;
      this.prevSkuName.name = skuName;
    },
    // 生成sku表格
    createSku() {
      // debugger;
      if (!this.chooseSkuItem.length) {
        return Message.warning("请先选择SKU！");
      }

      if (this.apichooseSkuItem.sort().toString() !== this.chooseSkuItem.sort().toString() && this.apichooseSkuItem.length > this.chooseSkuItem.length) {
        if (this.SKUdata.length) {
          Message.warning("修改sku属性后,原表格中的相关数据需要手动删除！");
        }
      }
      let emptyIndex = -1;
      let skuValues = []; //value 值
      let skuKeys = []; //key 值
      let arr = []; //表头
      Object.entries(this.chooseSku).forEach(([key, value]) => {
        skuValues.push(value);
        skuKeys.push(key);
      }); //保证对象遍历出来的值为顺序一定的
      // 找出属性值为空的属性名
      skuValues.forEach((item, index) => {
        if (item.length == 0) {
          emptyIndex = index;
        }
      });
      // 表头 数据生成函数
      /**
       * @name:
       * @description:
       * @param {type} isRecreate 是否需要重新生成表头 将会同时清空数据
       * @return:
       */
      let createDate = (isRecreate) => {
        // 数据处理函数
        /**
         * @name:
         * @description:
         * @param {type} data 表格数据
         * @return:
         */
        // debugger;
        let handleskuData = (data) => {
          return data.map((item, index) => {
            let name = "";
            let skus = [];
            Object.keys(item).forEach((j) => {
              if (/^sku/.test(j)) {
                skus.push(j);
              }
            });
            skus.forEach((y) => {
              name += item[`${y}`] + " ";
            });
            return name;
          });
        };
        let oldData = []; //旧sku组合数据
        let newData = []; //新sku组合数据
        let addData = []; //合并后去重的sku组合数据
        let skuArray = [];
        this.handleData(skuValues).forEach((item) => {
          skuArray.push(item.split(","));
        });
        if (isRecreate) {
          // 创建阶段或用户允许重新生成
          console.log("重新生成新数据++++++++++++++");
          this.SKUcolumn = [
            ...arr,
            {
              prop: "amount",
              label: "价格(积分)",
            },
            {
              prop: "stock",
              label: "商品库存",
            },
            {
              prop: "stockAlarm",
              label: "库存预警值",
            },
            {
              prop: "displayUrl",
              label: "展示图",
            },
            {
              prop: "operation",
              label: "操作",
            },
          ];
          this.SKUdata = [];
          skuArray.forEach((item, index) => {
            let obj = {};
            item.forEach((item, index) => {
              obj["sku" + index] = item;
            });
            this.SKUdata.push(obj);
          });
          //是否为现金需不需要展示
          if (this.detailData.payMode) {
            let indexAmount = null;
            this.SKUcolumn.forEach((item, index) => {
              if (item.prop == "amount") {
                indexAmount = index;
              }
            });
            this.SKUcolumn.splice(indexAmount + 1, 0, { prop: "cash", label: "价格(现金)" });
          }
          this.$forceUpdate();
        } else {
          console.log("合并数据++++++++++++++");
          // 编辑阶段不允许重新生成 新旧数据合并
          let _SKUdata = [...this.apiSKUdata]; //计算新值 用于合并数据
          let _origunSKUdata = [...this.apiSKUdata]; //初始化旧值 用于curd
          skuArray.forEach((item, index) => {
            let obj = {};
            item.forEach((item, index) => {
              obj["sku" + index] = item;
            });
            _SKUdata.push(obj);
          });
          oldData = Array.from(new Set(handleskuData(_origunSKUdata)));
          newData = Array.from(new Set(handleskuData(_SKUdata)));
          // 属性新增
          addData = newData.filter((item) => {
            if (oldData.indexOf(item) == -1) {
              return item;
            }
          });
          for (let j = 0; j < addData.length; j++) {
            let arr = addData[j].split(" ");
            let obj = {};
            for (let i = 0; i < arr.length - 1; i++) {
              // 这里少循环一次 因为最后值为空
              obj[`sku${i}`] = arr[i];
            }
            _origunSKUdata.push(obj);
          }
          this.SKUdata = _origunSKUdata;
          this.$forceUpdate();
        }
      };
      let columnLabel = []; //当前表头label字段
      let _columnLabel = []; //新选中表头label字段
      let isConfirm = false; //是否提示
      skuKeys.forEach((item, index) => {
        if (index !== emptyIndex) {
          arr.push({
            prop: "sku" + index,
            label: item,
          });
          _columnLabel.push(item);
        }
      });
      //动态表头 判断新选中表头和当前表头是否相同
      if (this.data.id) {
        // 编辑阶段
        for (let i = 0; i < this.SKUcolumn.length; i++) {
          let item = this.SKUcolumn[i];
          if (/^sku/.test(item.prop)) {
            columnLabel.push(item.label);
          }
        }
        // 判断 不相同弹出提示 是否允许清空数据 重新生成表头
        if (columnLabel.sort().toString() !== _columnLabel.sort().toString()) {
          if (this.SKUdata.length) {
            this.$confirm("改变sku将会清空现有表格数据, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                createDate(true);
              })
              .catch(() => {});
          } else {
            createDate(true);
          }

          return;
        } else {
          createDate();
          isConfirm = false;
          return;
        }
        // 判断sku是否全部删除完 如果删除完 则允许重新生成表头 否则不允许
        if (this.SKUdata.length) {
          for (let i = 0; i < this.SKUdata.length; i++) {
            if (this.SKUdata[i].id) {
              isConfirm = true;
              break;
            } else {
              if (this.clearSKUList) {
                isConfirm = true;
                this.clearSKUList = false;
                break;
                return;
              } else {
                createDate();
                isConfirm = false;
                return;
              }
            }
          }
        }
      } else {
        // 创建阶段
        createDate(true);
      }
    },
    // sku动态循环
    handleData(arrs) {
      /**
       * eg:[[红，黄，蓝]，[大，中，小]]=> //["红,大", "红,中", "红,小", "黄,大", "黄,中", "黄,小", "蓝,大", "蓝,中", "蓝,小"]
       * 以第一项为基础,循环合并之后的每一项再循环的值
       * @param {*} acc 累计的值
       * @param {*} cur 当前遍历项
       * @param {*} index 当前遍历索引
       */
      let result = arrs.reduce((acc, cur, index) => {
        // 从第二项开始合并值
        if (index > 0) {
          let saveArr = [];
          acc.forEach((item) => {
            cur.forEach((subItem) => {
              saveArr.push(`${item},${subItem}`);
            });
          });
          acc = saveArr;
        }
        return acc;
      }, arrs[0]); // 把数组的第一项传入作为初始值
      return result;
    },
    // 删除表格中sku
    deleteSku(index) {
      this.$confirm("确定删除?", "提示", {
        type: "warning",
      }).then(() => {
        this.SKUdata.splice(index, 1);
        this.apiSKUdata.splice(index, 1);
      });
    },
    // 编辑表格中sku
    editSku(row, index) {
      this.skuVisible = true;
      this.skuForm = { ...row };
      this.skuForm.index = index;
    },
    moneyFormat(num) {
      return moneyFormat(num);
    },

    // 确认表格中sku修改
    addsku() {
      this.$refs.skuForm.validate((valid) => {
        if (valid) {
          let { amount } = this.skuForm;

          this.skuForm.amount = amount;

          this.SKUdata.splice(this.skuForm.index, 1, this.skuForm);
          this.skuVisible = false;
          this.skuForm = {};
        }
      });
    },
  },
};
</script>

<style lang="scss">
.goodsForm {
  padding-top: 50px;
  width: 60%;
  margin: 0 auto;
  .goods_attribute {
    border: 1px solid #f1f1f1;
    padding: 20px;
    width: 80%;
    .goods_attribute_item + .goods_attribute_item {
      margin-top: 20px;
    }
    .title {
      margin-bottom: 10px;
      margin-right: 20px;
    }
  }
  .el-table th {
    padding: 0;
  }
  .el-table th {
    background-color: #fafafa;
  }
  .el-table {
    // width: 80%;
    // max-width: 80%;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .catSpec_table {
    .el-table {
      width: 100%;
      max-width: 100%;
    }
  }
  .chooseImg {
    width: 100px;
    height: 100px;
  }
}
.href {
  color: dodgerblue;
  &:hover {
    color: dodgerblue;
  }
}
</style>
