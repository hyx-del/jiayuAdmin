<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 16:02:02
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-07-15 11:13:21
 * @Descripttion: 首页弹窗管理
-->
<template>
  <div class="toastModal">
    <!-- 头部查询 -->
    <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
      <el-form-item label="开始时间:" prop="searchStartTime">
        <el-date-picker
            v-model.trim="formInline.searchStartTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="timestamp"
            @change="onChangTime"
            size="small"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态:" prop="state">
        <el-select v-model.trim="formInline.state" placeholder="请选择" size="small">
          <el-option
              v-for="item in stateOption"
              :key="item.val"
              :label="item.label"
              :value="item.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型:" prop="tabId">
        <el-select v-model.trim="formInline.tabId" placeholder="请选择" size="small">
          <el-option
              v-for="item in tabIdList"
              :key="item.val"
              :label="item.lab"
              :value="item.val"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="primary" size="small" @click="resetForm('formInline')">
          重置
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <Table
        :loadData="getList"
        ref="table"
        :column="column"
        :showSortIndex="{ show: true, lable: '序号' }"
    >
      <template v-slot:pictureUrl="{ scope }">
        <!-- <img :src="scope.pictureUrl" /> -->
        <el-image
            style="width: 100px;"
            :lazy="true"
            :src="scope.pictureUrl"
            :preview-src-list="[scope.pictureUrl]"
        ></el-image>
      </template>
    </Table>
    <!-- 新增/编辑 -->
    <el-dialog
        @close="handleClose"
        :title="isAdd ? '新增' : '编辑'"
        :visible.sync="dialogVisible"
        width="640px"
        custom-class="dialog_content"
        :close-on-click-modal="false"
    >
      <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="dialog_form"
      >
        <el-form-item label="封面图" prop="pictureUrl">
          <!-- <UploadVideo v-model.trim="ruleForm.pictureUrl"></UploadVideo> -->
          <UploadImgDrag
              v-model.trim="ruleForm.pictureUrl"
              :size="10000"
              :limit="1"
          ></UploadImgDrag>
          <!-- <CropperImg :ratio="ratio" v-model="ruleForm.pictureUrl"></CropperImg> -->
        </el-form-item>

        <div>
          <el-form-item label="选择时间" prop="time">
            <el-date-picker
                size="small"
                v-model="ruleForm.time"
                type="datetimerange"
                :default-time="['00:00:00', '23:59:59']"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="关联类型" prop="courseId">
          <el-radio-group @change="changeRadio" size="small" v-model="ruleForm.courseId">
            <el-radio-button label="1" border>瑜伽</el-radio-button>
            <el-radio-button label="2" border>普拉提</el-radio-button>
            <el-radio-button label="3" border>冥想</el-radio-button>
            <el-radio-button label="4" border>智慧</el-radio-button>
            <el-radio-button label="5" border>音乐</el-radio-button>
            <el-radio-button label="6" border>教练</el-radio-button>
            <el-radio-button label="7" border>百科</el-radio-button>
            <el-radio-button label="8" border>新闻</el-radio-button>
            <el-radio-button label="9" border>H5</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- 点击商品后显示按钮 -->
        <div style="padding-left: 100px;" v-if="ruleForm.courseId != 9">
          <el-button @click="chooseShop" size="small" type="primary">
            选择关联数据
          </el-button>
          <el-form-item>
            <!-- 显示模型   id ,name,img,info -->
            <div class="relation_val">
              <span>{{ chooseItem.id }}</span>
              <span>{{ chooseItem.name }}</span>
              <span>{{ chooseItem.img }}</span>
              <span>{{ chooseItem.info }}</span>
            </div>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item label class="item_with_auto">
            <el-input
                placeholder="访问地址"
                v-model.trim="ruleForm.relevanceValue"
                maxlength="200"
                size="small"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注" prop="remark" class="item_with_auto">
          <el-input
              placeholder="备注"
              prefix-icon="el-icon-search"
              v-model.trim="ruleForm.remark"
              maxlength="200"
              size="small"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="handleOK('ruleForm')">确 定</el-button>
			</span>
    </el-dialog>
    <!-- 选择教练 -->
    <el-dialog
        title="选择教练"
        @close="shopClose"
        :visible.sync="shopDialogVisible"
        width="68%"
        :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="chooseForm" class="demo-form-inline" ref="chooseForm">
        <el-form-item label="教练名称">
          <el-input
              v-model.trim="chooseForm.name"
              prefix-icon="el-icon-search"
              size="small"
              placeholder="请输入教练名称"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="searchGoods" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- :params="{ putOn: true }"  查询额外参数 -->
      <Table
          :select="getCoachChoose"
          :loadData="getCoachList"
          ref="goodsTable"
          :column="coachColumn"
          :single="true"
          style="height: 490px; overflow-y: auto"
      ></Table>
      <span slot="footer" class="dialog-footer">
				<el-button @click="shopClose">取 消</el-button>
				<el-button type="primary" @click="chooseCoachOk">确 定</el-button>
			</span>
    </el-dialog>
    <!-- 选择专区 -->
    <el-dialog
        title="选择专区"
        @close="areaModalClose"
        :visible.sync="areaDialogVisible"
        width="75%"
        :close-on-click-modal="false"
    >
      <Table
          :select="getAreaChoose"
          :loadData="getSpecialAreaList"
          ref="areaTable"
          :column="areaColumn"
          :single="true"
          style="height: 490px; overflow-y: auto"
      ></Table>
      <span slot="footer" class="dialog-footer">
				<el-button @click="areaModalClose">取 消</el-button>
				<el-button type="primary" @click="chooseAreaOK">确 定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import Table from '@/components/Table/index';
import UploadVideo from '@/components/uploadVideo';
import UploadImgDrag from '@/components/uploadDrag';
import CropperImg from '@/components/cropperImg/index';
import { startEndTime } from '@/core/directives/time';
import { parseTime } from '@/utils';
import { moneyFormat } from '@/core/directives/money';
import { isEmpty } from '@/core/directives/empty';
import { typeEnum } from '@/utils/systemEnum';

import {
  getPopupWinList,
  addPopupWin,
  delPopupWin,
  banPick,
  editPopupWin,
  banToastWindow,
  bannerDetail,
} from '@/api/operation';
import { getCoachesList } from '@/api/coach';
// import { getSpecialAreaList } from '@/api/specialArea';
import { Divider } from 'element-ui';
export default {
  components: {
    Table,
    // LTNQupload,
    UploadVideo,
    CropperImg,
    UploadImgDrag,
  },
  data() {
    return {
      twoPageList: [], // 选择二级页面列表
      tabIdList: [],
      chooseItem: {},
      stateOption: [
        { label: '全部', val: '' },
        { label: '未上线', val: '0' },
        { label: '已上线', val: '1' },
        { label: '已下线', val: '2' },
      ],
      actTypeList: [
        { label: '限时抢购', value: 'TIME' },
        { label: '甄选优品', value: 'RECOMMEND' },
      ],
      catProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (!node.data) {
            // getAllCat({ size: 100 }).then(res => {
            // 	const nodes = Array.from(res.data.list).map(item => {
            // 		return {
            // 			value: item.id,
            // 			label: item.name,
            // 			leaf: level >= 1,
            // 		};
            // 	});
            // 	resolve(nodes);
            // });
          } else {
            // getAllCat({ parentId: node.data.value, size: 100 }).then(res => {
            // 	const nodes = Array.from(res.data.list).map(item => {
            // 		return {
            // 			value: item.id,
            // 			label: item.name,
            // 			leaf: level >= 1,
            // 		};
            // 	});
            // 	resolve(nodes);
            // });
          }
        },
      },

      shopDialogVisible: false,
      dialogVisible: false,
      areaDialogVisible: false,

      formInline: {
        banned: null,
        tabId: '',
      },
      checked: false,
      ruleForm: {
        courseId: 1,
        relevanceValue: null,
        time: [],
        sortIndex: '',
        pictureUrl: '',
      },

      showShopBtn: false,
      showAREABtn: false,
      showTwoPageBtn: false,
      isAdd: false,
      chooseForm: {
        // newFlag: false,
      },

      column: [
        { prop: 'createTime', label: '添加时间' },
        {
          prop: 'pictureUrl',
          label: '图片',
          render: true,
        },
        {
          prop: 'clickNumber',
          label: '点击次数',
          formatter: (row, column) => {
            return row.clickNumber || 0;
          },
        },

        {
          prop: 'courseId',
          label: '类型',
          formatter: (row, column) => {
            return typeEnum[row.courseId];
          },
        },
        { prop: 'relevanceValue', label: '关联目标' },
        {
          prop: 'startTime',
          label: '开始时间',
          formatter: (row, column) => {
            return parseTime(row.startTime);
          },
        },
        {
          prop: 'endTime',
          label: '结束时间',
          formatter: (row, column) => {
            return parseTime(row.endTime);
          },
        },
        {
          prop: 'state',
          label: '显示状态',
          formatter: (row, column) => {
            let _str = '';
            let _stateOption = this.stateOption;
            for (let index = 0, len = this.stateOption.length; index < len; index++) {
              if (_stateOption[index].val == row.state) {
                _str = _stateOption[index].label;
                break;
              }
            }
            return _str;
          },
        },
        {
          prop: 'banned',
          label: '状态',
          formatter: (row, column) => {
            if (row.state == 1) {
              return '启用';
            } else {
              return '停用';
            }
          },
        },
        { prop: 'remark', label: '备注' },
        {
          prop: 'action',
          label: '操作',
          fixed: 'right',
          actives: [
            {
              name: '修改',
              method: val => {
                const tempObj = { ...val, time: '' }; //time必须初始化才能绑定成功

                if (val.startTime && val.endTime) {
                  let startTime = new Date(val.startTime);
                  let endTime = new Date(val.endTime);
                  tempObj.time = [startTime, endTime];
                } else {
                  tempObj.time = [];
                }

                if (tempObj.courseId) {
                  tempObj.courseId = tempObj.courseId * 1;
                }

                this.ruleForm = tempObj;

                this.isAdd = false;
                this.dialogVisible = true;
              },
            },
            // {
            // 	name: '删除',
            // 	method: val => {
            // 		this.$confirm('确定删除?', '提示', {
            // 			type: 'warning',
            // 		}).then(() =>
            // 			delPopupWin(val).then(res => {
            // 				if (res.code === 200) {
            // 					this.$message.success('操作成功');
            // 					this.$refs.table.reset();
            // 				} else {
            // 					this.$message.error(res.msg);
            // 				}
            // 			})
            // 		);
            // 	},
            // },
            {
              name: row => {
                return row.enable ? '停用' : '启用';
              },
              method: val => {
                const banned = val.enable ? '停用' : '启用';
                this.$confirm(`确定${banned}?`, '提示', {
                  type: 'warning',
                }).then(() => {
                  const _par = { ...val };
                  console.log(_par);
                  _par.state = _par.state == 1 ? 0 : 1;

                  editPopupWin(_par).then(res => {
                    if (res.success) {
                      this.$message({
                        type: 'success',
                        message: '操作成功！',
                      });
                      this.$refs.table.update({});
                    }
                  });
                });
              },
            },
          ],
        },
      ],
      coachColumn: [
        {
          prop: 'name',
          label: '教练名称',
        },
        {
          prop: 'coachLevelName',
          label: '教练等级',
        },

        {
          prop: 'headUrl',
          label: '教练头像',
          formatter: (row, column) => {
            return <img class="chooseImg" style="height:100px" src={row.headUrl} />;
          },
        },
      ],
      areaColumn: [
        {
          prop: 'createTime',
          label: '创建时间',
          formatter: (row, column) => {
            return parseTime(row.createTime);
          },
        },
        { prop: 'name', label: '专区名称' },
        {
          prop: 'cover',
          label: '封面图片',
          formatter: (row, column) => {
            return <img class="chooseImg" src={row.cover} />;
          },
        },
        {
          prop: 'type',
          label: '专区类型',
          formatter: (row, column) => {
            return row.type === 'SINGLE_ITEM' ? '单商品' : '二级页面';
          },
        },
        // { prop: 'sortIndex', label: '显示顺序' },

        {
          prop: 'startTime',
          label: '开始时间',
          formatter: (row, column) => {
            return parseTime(row.startTime);
          },
        },
        {
          prop: 'banned',
          label: '状态',
          formatter: (row, column) => {
            if (row.banned) {
              return '已停用';
            } else {
              if (row.startTime > new Date().getTime()) {
                return '未开始';
              } else {
                return '进行中';
              }
            }
          },
        },
      ],
      rules: {
        // remark: [{ required: true, message: '请输入标题', trigger: 'blue' }],
        pictureUrl: [{ required: true, message: '请上传封面图', trigger: 'change' }],
        time: [{ required: true, message: '请选择时间', trigger: 'change' }],
        tabId: [{ required: true, message: '请选择类型', trigger: 'change' }],
        courseId: [{ required: true, message: '请选择关联类型', trigger: 'change' }],
      },
      ratio: 4 / 3,
      goodsList: [],
      chooseVal: {},
      chooseAreaVal: {},
    };
  },
  computed: {
    getList() {
      return getPopupWinList;
    },
    getCoachList() {
      return getCoachesList;
    },
    getSpecialAreaList() {
      return null;
    },
  },
  created() {
    const _tempArray = [{ lab: '全部', val: '' }];
    for (let key in typeEnum) {
      _tempArray.push({ lab: typeEnum[key], val: key });
    }
    console.log(_tempArray);
    this.tabIdList = _tempArray;
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      // 获取二级页面启动列表
    },
    // 选择时间
    onChangTime(time) {
      if (time) {
        // this.formInline.startTime = parseTime(time[0]);
        // this.formInline.endTime = parseTime(time[1]);
        this.formInline.startTime = time[0];
        this.formInline.endTime = time[1];
      } else {
        this.formInline.startTime = null;
        this.formInline.endTime = null;
      }
    },
    resetFormFormInline() {
      this.$refs['chooseForm'].resetFields();
      this.chooseForm = {};
    },

    moneyFormat(num) {
      return moneyFormat(num);
    },
    // 是否上新 checkbox
    changeCheckbox(val) {
      if (!val) {
        this.$refs.goodsTable.update();
      }
    },
    onChangeActType(val) {
      console.log(val);
    },
    // 获取二级类目ID
    onChangeValue(val) {
      if (val) {
        this.chooseForm.catId = val[1];
      }
    },
    searchGoods() {
      this.$refs.goodsTable.update(this.chooseForm);
    },
    // 选择教练
    getCoachChoose(val) {
      this.chooseVal = val[0];
      this.chooseItem = {
        id: val[0].id,
        name: val[0].name,
        img: val[0].headUrl,
        info: val[0].coachLevelName,
      };
      this.ruleForm.relevanceValue = val[0].id;
    },
    getAreaChoose(val) {
      this.chooseAreaVal = val[0];
    },
    shopClose() {
      this.shopDialogVisible = false;
      if (!this.chooseVal) {
        this.ruleForm.itemName = '';
        this.ruleForm.itemImg = '';
      }
    },
    areaModalClose() {
      this.areaDialogVisible = false;
      if (!this.chooseAreaVal) {
        this.ruleForm.areaName = '';
        this.ruleForm.areaCover = '';
      }
    },
    // 选择教练弹窗 确定按钮
    chooseCoachOk() {
      if (this.chooseVal) {
        // this.ruleForm.courseId = this.chooseVal.id;
        // this.ruleForm.relationName = this.chooseVal.name;
        // this.ruleForm.itemImg = this.chooseVal.cover;
      }
      this.$refs.goodsTable.clearSelect();
      this.shopDialogVisible = false;
    },
    chooseAreaOK() {
      if (this.chooseAreaVal) {
        this.ruleForm.courseId = this.chooseAreaVal.id;
        this.ruleForm.areaName = this.chooseAreaVal.name;
        this.ruleForm.areaCover = this.chooseAreaVal.cover;
      }
      this.$refs.areaTable.clearSelect();
      this.areaDialogVisible = false;
    },
    // 选择关联的数据
    chooseShop() {
      this.shopDialogVisible = true;
    },
    chooseArea() {
      this.areaDialogVisible = true;
    },

    changeRadio() {
      console.log(this.ruleForm);
      if (this.ruleForm.courseId != 9) {
        this.showShopBtn = false;
        this.showAREABtn = false;
        this.showTwoPageBtn = false;
      }
    },

    handleClose() {
      this.dialogVisible = false;
      this.ratio = 4 / 3;
      this.ruleForm.courseId = '1';
      this.resetForm('ruleForm');
      this.ruleForm = {
        courseId: 'ITEM',
        courseId: '1',
        itemName: '',
        areaName: null,
        areaCover: null,
        itemImg: '',
        time: [],
      };
    },
    resetTableData() {
      this.$refs.table.update();
    },
    search() {
      const _par = { ...this.formInline };
      delete _par.searchStartTime;
      this.$refs.table.update(_par);
    },
    handleOK(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.time) {
            this.ruleForm.startTime = this.ruleForm.time[0];
            this.ruleForm.endTime = this.ruleForm.time[1];
          }

          const urlReg = /^(http|https):\/\/([\w.]+\/?)\S*/;

          if (this.ruleForm.courseId == 9) {
            if (!urlReg.test(this.ruleForm.relevanceValue)) {
              this.$message.error('无效的网络地址!');
              return false;
            }
          }
          // if (this.ruleForm.courseId == 'ITEM' && !this.ruleForm.courseId) {
          // 	this.$message.error('请选择商品');
          // 	return false;
          // }

          // if (this.ruleForm.courseId == 'TWO_PAGE' && !this.ruleForm.courseId) {
          // 	this.$message.error('请选择二级页面');
          // 	return false;
          // }

          // if (this.ruleForm.courseId == 'TWO_PAGE') {
          // 	this.ruleForm.courseId = this.ruleForm.twoPageObj.id;
          // 	this.ruleForm.areaName = this.ruleForm.twoPageObj.name;
          // }

          if (this.isAdd) {
            // 新增
            let _par = { ...this.ruleForm };
            _par.enable = false;
            addPopupWin(_par).then(res => {
              if (res.code === 200) {
                this.handleClose();
                this.$message.success('操作成功');
              } else {
                this.$message.error(res.msg);
              }
            });
          } else {
            // 编辑
            editPopupWin(this.ruleForm).then(res => {
              if (res.code === 200) {
                this.handleClose();
                this.$message.success('操作成功');
              } else {
                this.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onSubmit() {},
    // getUpLoadImgUrl(url) {
    //   this.ruleForm.img = url;
    // },
    handleAdd() {
      this.isAdd = true;
      this.dialogVisible = true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.search();
    },
    deleteChoose() {
      this.ruleForm.courseId = '1';
      this.ruleForm.itemName = '';
      this.ruleForm.itemImg = null;
    },
    deleteAreaChoose() {
      this.ruleForm.courseId = '1';
      this.ruleForm.areaName = null;
      this.ruleForm.areaCover = null;
    },
    ban(id) {
      banPick({ id }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功');
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style>
.item_with_auto .el-input {
  width: 100%;
}
.toastModal {
  padding: 20px;
}
.banner_img {
  width: 100px;
  height: 100px;
}
.radioStyle {
  padding-top: 10px;
}
.areaChooseImg {
  height: 100%;
}
.chooseImg {
  width: 100px;
  /* height: 100px; */
}
.abreast {
  display: flex;
}
.goods {
  height: 100px;
  width: 70%;
  position: relative;
  border: 1px solid #ccc;
}
.icon {
  margin-top: 14px;
  position: absolute;
  right: 5px;
  top: -4px;
}
.price {
  color: red;
  margin: 0;
}
.goods_content {
  padding-left: 5px;
}
.good_detail {
  padding-right: 20px;
  width: 100%;
}
.good_title {
  padding-top: 6px;
  line-height: 24px;
}
</style>
