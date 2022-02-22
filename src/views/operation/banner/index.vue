<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 16:02:02
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2022-01-05 11:12:56
 * @Descripttion: 首页弹窗管理
-->
<template>
   <div class="toastModal">
      <!-- 头部查询 -->
      <formList ref="formListTop"
                :config="configTop"
                :formObj="formObjTop"
                :list="listTop"
                @button="formButtonTop" />
      <!-- 表格 -->
      <Table :loadData="getList"
             ref="table"
             refHead="formListTop"
             :column="column"
             :showSortIndex="{ show: true, lable: '序号' }"></Table>
      <!-- 新增/编辑 -->
      <el-dialog @close="handleClose"
                 :title="isAdd ? '新增' : '编辑'"
                 :visible.sync="dialogVisible"
                 width="70%"
                 custom-class="dialog_content"
                 :close-on-click-modal="false">
         <div class="popBody">
            <formList ref="formList"
                      :loading.sync="loading"
                      :config="config"
                      :formObj="ruleForm"
                      :list="list"
                      @button="formButton" />
            <el-form ref="popBeforeForm"
                     :inline="false"
                     :model="ruleForm"
                     labelWidth="8em">
               <el-form-item label="关联类型："
                             prop="tabId">
                  <el-radio-group @change="changeRadio"
                                  size="small"
                                  v-model="ruleForm.tabId">
                     <el-radio-button v-for="item in courseList"
                                      :key="item.value"
                                      :label="item.value"
                                      border>
                        {{ item.label }}
                     </el-radio-button>
                  </el-radio-group>
               </el-form-item>
               <el-form-item v-if="ruleForm.tabId != 9"
                             label="选择关联数据：">
                  <el-button type="primary"
                             size="small"
                             @click="targe">关联数据</el-button>
               </el-form-item>
               <el-form-item size="small"
                             v-if="ruleForm.tabId == 9"
                             label="h5网址：">
                  <el-input style="width: 360px; "
                            v-model="ruleForm.h5"></el-input>
               </el-form-item>
            </el-form>
            <simpleTable v-if="simpleObj.column.length && ruleForm.tabId != 9"
                         :style="{ height: '180px' }"
                         :table-data="simpleObj.chose"
                         :table-label="simpleObj.column" />
         </div>
         <div slot="footer"
              class="popButton">
            <el-button size="small"
                       type="danger"
                       @click="handleClose">取 消</el-button>
            <el-button size="small"
                       type="primary"
                       @click="handleOK()">确 定</el-button>
         </div>
      </el-dialog>

      <!--关联数据弹窗-->
      <el-dialog :title="tablePop.title"
                 center
                 :visible.sync="tablePopShow"
                 v-if="tablePopShow"
                 width="800px"
                 custom-class="role_dialog"
                 :close-on-click-modal="false">
         <formList ref="tablePopForm"
                   :config="tablePopConfig"
                   :formObj="tablePop.formObj"
                   :list="tablePop.list"
                   @button="tablePopButton" />
         <Table :select="tablePopChoose"
                :loadData="tablePop.fun"
                :headHight="400"
                :single="true"
                :column="tablePop.column"
                :params="{ enable: 1 }"
                ref="tablePopTable"
                :chenckNone="true"></Table>
         <div class="popButton">
            <el-button @click="tablePopShow = false"
                       type="danger"
                       size="small">取消</el-button>
            <el-button @click="tablePopAdd"
                       type="primary"
                       size="small">确定</el-button>
         </div>
      </el-dialog>
   </div>
</template>

<script>
import formList from '@/components/FormList/index';

import Table from '@/components/Table/index';
import UploadVideo from '@/components/uploadVideo';
import UploadImgDrag from '@/components/uploadDrag';
import UploadAudio from '@/components/uploadAudio';
import CropperImg from '@/components/cropperImg/index';
import { parseTime } from '@/utils';
import { stateList, typeEnum } from '@/utils/systemEnum';
const _typeEnum = [{ label: '全部', val: '' }];
const _typeEnum2 = [];

for (let key in typeEnum) {
   _typeEnum.push({ label: typeEnum[key], value: key });
   _typeEnum2.push({ label: typeEnum[key], value: key });
}
import {
   getPopupWinList,
   addPopupWin,
   delPopupWin,
   editPopupWin,
   popup,
   bannerGetList,
   bannerPut,
   bannerPost,
   banner,
   bannerDelete,
   bannerShowLocation,
   bannerSavePost,
   bannerStateChange,
   bannerUpdatePut,
} from '@/api/operation';
import { getCoachesList } from '@/api/coach';
import { listCourse } from '@/api/course';
import simpleTable from '@/components/simpleTable';
import { mediationList } from '@/api/meditation';
import { jnanaList } from '@/api/wisdom';
import { wikiList } from '@/api/wiki';
import { newslist } from '@/api/news';
import { getColumnList } from '@/api/course';
import { backType } from '@/components/FormList/utils';
export default {
   components: {
      Table,
      UploadVideo,
      CropperImg,
      UploadImgDrag,
      UploadAudio,
      formList,
      simpleTable,
   },
   data() {
      return {
         configTop: {
            inline: true,
            allRequired: false,
            size: "mini",
            inputStyle: {
               width: '200px',
            },
            buttons: [
               {
                  funType: 'confirm',
                  type: 'primary',
                  name: '查询',
               },
               {
                  funType: 'reset',
                  type: 'primary',
                  name: '重置',
               },
               {
                  funType: 'add',
                  type: 'primary',
                  name: '添加',
                  icon: 'el-icon-plus',
               },
            ],
         },
         formObjTop: {},
         listTop: [
            {
               el: 'date',
               code: 'startTime',
               label: '开始时间',
               endCode: 'endTime',
               timeError: '开始时间要小于结束时间',
            },
            {
               el: 'date',
               code: 'endTime',
               label: '结束时间',
               timeError: '结束时间要大于开始时间',
               starCode: 'startTime',
               defaultTime: "23:59:59",
            },
            {
               el: 'select',
               label: '状态',
               code: 'state',
               list: stateList,
            },
            {
               el: 'select',
               label: '类型',
               code: 'tabId',
               list: _typeEnum,
            },
         ],
         loading: false,
         tablePopShow: false,
         dialogVisible: false,
         tablePopConfig: {
            inline: true,
            allRequired: false,
            inputStyle: {
               width: '200px',
            },
            buttons: [
               {
                  funType: 'confirm',
                  type: 'primary',
                  name: '查询',
               },
               {
                  funType: 'reset',
                  type: 'primary',
                  name: '重置',
               },
            ],
         },
         simpleObj: {
            column: [
               {
                  prop: 'name',
                  label: '名字',
               },
               {
                  prop: 'createTime',
                  label: '时间',
               },
               {
                  prop: 'coverUrl',
                  label: '封面图片',
               },
            ],
            chose: [],
         },
         simplEputy: {
            column: [
               {
                  prop: 'name',
                  label: '名字',
               },
               {
                  prop: 'createTime',
                  label: '时间',
               },
               {
                  prop: 'coverUrl',
                  label: '封面图片',
               },
            ],
            chose: [],
         },
         tablePop: {
            title: '标题',
            formObj: {},
            list: [],
            column: [],
            fun: listCourse,
            chose: [],
         },
         tablePopList: {
            1: {
               title: '瑜伽课程选择',
               formObj: {},
               list: [
                  {
                     label: '课程名',
                     code: 'name',
                  },
               ],
               column: [
                  {
                     prop: 'name',
                     label: '课程名称',
                  },
                  // {
                  //   prop:'coachNameStr',
                  //   label:'教练名',
                  // },
                  {
                     prop: 'createTime',
                     label: '创建时间',
                  },
                  {
                     prop: 'coverUrl',
                     label: '封面图片',
                  },
               ],
               fun: listCourse,
               chose: [],
            },
            3: {
               title: '冥想',
               formObj: {},
               list: [
                  {
                     label: '冥想',
                     code: 'name',
                  },
               ],
               column: [
                  {
                     prop: 'name',
                     label: '冥想标题',
                  },
                  // {
                  //   prop:'author',
                  //   label:'作者',
                  // },
                  {
                     prop: 'updateTime',
                     label: '发布时间',
                  },
                  {
                     prop: 'coverUrl',
                     label: '封面图片',
                  },
               ],
               fun: mediationList,
               chose: [],
            },
            4: {
               title: '智慧',
               formObj: {},
               list: [
                  {
                     label: '智慧',
                     code: 'name',
                  },
               ],
               column: [
                  {
                     prop: 'name',
                     label: '智慧标题',
                  },
                  // {
                  //   prop:'author',
                  //   label:'作者',
                  // },
                  {
                     prop: 'updateTime',
                     label: '发布时间',
                  },
                  {
                     prop: 'coverUrl',
                     label: '封面图片',
                  },
               ],
               fun: jnanaList,
               chose: [],
            },
            6: {
               title: '教练',
               formObj: {},
               list: [
                  {
                     label: '教练',
                     code: 'name',
                  },
               ],
               column: [
                  {
                     prop: 'name',
                     label: '教练名称',
                  },
                  {
                     prop: 'headUrl',
                     label: '头像',
                     render: true,
                  },
                  // {
                  //   prop: 'sex',
                  //   label: '性别',
                  //   formatter: (row, column) => row.sex >1?'女':'男',
                  // },
                  // {
                  //   prop: 'teachingTime',
                  //   label: '累计教学时长',
                  // },
                  // {
                  //   prop: 'levelName',
                  //   label: '教练等级',
                  // },
               ],
               fun: getCoachesList,
               chose: [],
            },
            7: {
               title: '百科',
               formObj: {},
               list: [
                  {
                     label: '百科',
                     code: 'title',
                  },
               ],
               column: [
                  {
                     prop: 'title',
                     label: '百科标题',
                  },
                  {
                     prop: 'createTime',
                     label: '添加时间',
                  },
                  {
                     prop: 'coverUrl',
                     label: '封面图片',
                  },
               ],
               fun: wikiList,
               chose: [],
            },
            8: {
               title: '新闻',
               formObj: {},
               list: [
                  {
                     label: '新闻',
                     code: 'title',
                  },
               ],
               column: [
                  {
                     prop: 'title',
                     label: '新闻标题',
                  },
                  {
                     prop: 'createTime',
                     label: '添加时间',
                  },
                  {
                     prop: 'coverUrl',
                     label: '封面图片',
                  },
                  // {
                  //   prop: 'praise',
                  //   label: '点赞数',
                  //   formatter: (row, column) =>row.praise||0
                  // },
                  // {
                  //   prop: 'reading',
                  //   label: '真实浏览量',
                  //   formatter: (row, column) =>row.reading||0
                  // },
                  // {
                  //   prop: 'sort',
                  //   label: '置顶顺序',
                  //   type:'number',
                  //   formatter: (row, column) =>row.sort||'未填写'
                  // },
               ],
               fun: newslist,
               chose: [],
            },
            11: {
               title: '瑜伽栏目',
               formObj: {},
               list: [
                  {
                     label: '瑜伽栏目',
                     code: 'name',
                  },
               ],
               column: [
                  {
                     prop: 'name',
                     label: '栏目名称',
                  },
                  {
                     prop: 'introductionUrl',
                     label: '封面图片',
                  },
                  // {
                  //   prop: 'praise',
                  //   label: '点赞数',
                  //   formatter: (row, column) =>row.praise||0
                  // },
                  // {
                  //   prop: 'reading',
                  //   label: '真实浏览量',
                  //   formatter: (row, column) =>row.reading||0
                  // },
                  // {
                  //   prop: 'sort',
                  //   label: '置顶顺序',
                  //   type:'number',
                  //   formatter: (row, column) =>row.sort||'未填写'
                  // },
               ],
               fun: getColumnList,
               chose: [],
            },
         },
         courseList: _typeEnum2,
         list: [
            {
               el: 'img',
               code: 'pictureUrl',
               label: '图片地址',
               ratio: '690/240',
            },
            {
               el: 'select',
               code: 'showLocation',
               back: true,
               funMode: 2,
               labelCode: 'label',
               valueCode: 'value',
               label: '展示位置',
               fun: bannerShowLocation,
            },
            {
               code: 'sort',
               label: '排序',
               type: 'number',
               required: false,
            },
            {
               el: 'textArea',
               code: 'remark',
               label: '备注',
               required: false,
            },
            {
               el: 'date',
               code: 'startTime',
               label: '开始时间',
               endCode: 'endTime',
               timeError: '开始时间要小于结束时间',
               required: false,
            },
            {
               el: 'date',
               code: 'endTime',
               label: '结束时间',
               required: false,
               timeError: '开始时间要小于结束时间',
               starCode: 'startTime',
               defaultTime: "23:59:59",
            },
         ],
         config: {
            labelWidth: '8em',
            inline: false,
            buttonsArea: 'popButtom',
            buttons: [],
         },
         tabIdList: [],
         chooseItem: {},
         stateOption: [
            { label: '全部', val: '' },
            { label: '未上线', val: '0' },
            { label: '已上线', val: '1' },
            { label: '已下线', val: '2' },
         ],
         formInline: {
            banned: null,
            tabId: '',
            state: '',
         },
         ruleForm: {
            tabId: '1',
            relevanceId: null,
            sortIndex: '',
            h5: '',
         },
         ruleFormEm: {
            tabId: '1',
            relevanceId: null,
            sortIndex: '',
            h5: '',
         },
         showShopBtn: false,
         showAREABtn: false,
         showTwoPageBtn: false,
         isAdd: false,
         column: [
            { prop: 'createTime', label: '添加时间' },
            {
               prop: 'pictureUrl',
               label: '图片',
               img: true,
            },
            {
               prop: 'clickNumber',
               label: '点击次数',
               formatter: (row, column) => {
                  return row.clickNumber || 0;
               },
            },

            {
               prop: 'tabId',
               label: '类型',
               formatter: (row, column) => {
                  return typeEnum[row.tabId] || row.tabId;
               },
            },
            {
               prop: 'relevanceName',
               label: '关联目标',
            },
            {
               prop: 'startTime',
               label: '开始时间',
               time: true,
            },
            {
               prop: 'endTime',
               label: '结束时间',
               time: true,
            },
            { prop: 'remark', label: '备注' },
            {
               prop: 'state',
               label: '显示状态',
               state: true,
            },
            {
               prop: 'enable',
               label: '启用状态',
               switch: true,
               fun: bannerStateChange,
            },

            {
               prop: 'action',
               label: '操作',
               fixed: 'right',
               actives: [
                  {
                     name: '修改',
                     method: val => {
                        let tempObj = { ...val, time: '' }; //time必须初始化才能绑定成功
                        let str =val.enable? `此banner已启用，请酌情修改`:`确定修改吗？`;
                        this.$confirm(str, "提示", {
                           type: "warning",
                        }).then(() => {
                           banner({ id: val.id }).then(res => {
                              let data = res.data;
                              tempObj = { ...tempObj, ...res.data };
                              if (data.startTime && data.endTime) {
                                 let startTime = new Date(data.startTime);
                                 let endTime = new Date(data.endTime);
                                 tempObj.time = [startTime, endTime];
                              } else {
                                 tempObj.time = [];
                              }
                              if (tempObj.tabId) {
                                 tempObj.tabId = tempObj.tabId * 1;
                              }
                              if (data.tabId == 9) {
                                 tempObj.h5 = data.hfiveUrl;
                              } else {
                                 this.simpleObj = this.getColumn(this.simpleObj);
                                 this.simpleObj.chose = [data.bannerResourceVO];
                              }
                              console.log('tempObj', tempObj);

                              this.ruleForm = tempObj;
                              this.isAdd = false;
                              this.dialogVisible = true;
                           });
                        });
                        // if (val.enable) {
                        //    this.$message.error('请先关闭启用');
                        //    return;
                        // }
                     },
                  },
               ],
            },
         ],
      };
   },
   computed: {
      getList() {
         return bannerGetList;
      },
   },
   created() {
      const _tempArray = [{ lab: '全部', val: '' }];
      for (let key in typeEnum) {
         _tempArray.push({ lab: typeEnum[key], val: key });
      }
      this.tabIdList = _tempArray;
   },
   mounted() { },
   methods: {
      handleOK() {
         this.$refs.formList.confirm();
      },
      // 新加，编辑
      formButton(val) {
         if (val.name == 'confirm' && val.valid) {
            const urlReg = /^(http|https):\/\/([\w.]+\/?)\S*/;
            let { tabId, h5 } = this.ruleForm;
            let data = { ...this.ruleForm, ...val.value, ...{ tabId, h5 } };
            if (
               data.tabId != 9 &&
               (this.simpleObj.chose.length == 0 || this.simpleObj.chose[0].id == '')
            ) {
               this.$message.error('没有选关联数据');
               return;
            }
            if (data.tabId == 9) {
               data.relevanceId = '';
               data.hfiveUrl = this.ruleForm.h5;
            } else {
               data.relevanceId = this.simpleObj.chose[0].id || '';
               data.hfiveUrl = '';
            }
            if (data.tabId == 9 && !urlReg.test(data.hfiveUrl)) {
               this.$message.error('无效的网络地址!');
               this.ruleForm.h5 = '';
               return false;
            }
            data.pictureUrl = backType(data.pictureUrl, 'String')
               ? data.pictureUrl
               : data.pictureUrl.join(',');
            if (this.isAdd) {
               // 新增
               bannerSavePost(data).then(res => {
                  this.$refs.table.update();
                  if (res.code === 200) {
                     this.tablePopShow = false;
                     this.handleClose();
                     this.$message.success('操作成功');
                  } else {
                     this.$message.error(res.msg);
                  }
               });
            } else {
               // 编辑
               bannerUpdatePut(data).then(res => {
                  this.$refs.table.update();
                  if (res.code === 200) {
                     this.tablePopShow = false;
                     this.handleClose();
                     this.$message.success('操作成功');
                  } else {
                     this.$message.error(res.msg);
                  }
               });
            }
         }
      },
      // tabel 弹窗确认
      tablePopAdd() {
         this.tablePopShow = false;
         this.simpleObj = this.getColumn(this.tablePop);
         console.log(this.tablePop);
      },
      // tabel 表单按钮，获取结果
      tablePopButton(val) {
         console.log('tablePopButton', val);
         if (val.name == 'confirm' && val.valid) {
            let data = val.value;
            this.$refs.tablePopTable.update({ ...data });
         }
      },
      // table单选
      tablePopChoose(val) {
         this.tablePop.chose = val;
      },
      // 关联
      targe() {
         let { tabId } = this.ruleForm;
         if (!tabId) {
            this.$message.error('请选择关联数据');
         }
         if (tabId != 9) {
            console.log(this.tablePopList);
            this.tablePop = this.getColumn(this.tablePopList[tabId], false);
            this.tablePopShow = true;
         }
      },
      // 切换
      changeRadio() {
         this.simpleObj = { ...this.simplEputy };
         if (this.ruleForm.tabId != 9) {
            this.showShopBtn = false;
            this.showAREABtn = false;
            this.showTwoPageBtn = false;
         }
      },
      // 获取clume
      getColumn(obj, simple = true) {
         let { column } = obj;
         column.map(val => {
            if (val.label.includes('图') || val.label.includes('头像')) {
               let prop = val.prop;
               val.render = simple
                  ? vals => `<img style="width: 100px;height: 100px;" src="${vals[prop]}">`
                  : '';
               val.img = true;
            }
            val.param = val.prop;
            val.align = 'center';
            return val;
         });
         obj = { ...obj, ...{ column } };
         console.log(obj, "你说嘛");
         return obj;
      },
      // 关闭弹窗
      handleClose() {
         this.$refs.formList.reset();
         this.ruleForm = {};
         this.dialogVisible = false;
         this.$refs['popBeforeForm'].resetFields();
         this.simpleObj = { ...this.simplEputy };
         this.ruleForm = { ...this.ruleFormEm };
      },
      formButtonTop(val) {
         if (val.name == 'confirm' && val.valid) {
            let data = val.value;
            this.$refs.table.update(data);
         } else if (val.name == 'add') {
            this.isAdd = true;
            this.dialogVisible = true;
         }
      },
   },
};
</script>

<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.popBody {
   height: 60vh;
   overflow: auto;
   width: 100%;
}
.toastModal {
   padding: 20px;
}
>>> .el-dialog__body {
   display: block;
}
</style>
