<!--
 * @Author: wei.chen
 * @Date: 2020-06-17 16:02:02
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-16 10:17:10
 * @Descripttion: 开屏广告窗管理
-->
<template>
  <div class="toastModal">
    <!-- 头部查询 -->
    <formList ref="formListTop" :config="configTop" :formObj="formObjTop" :list="listTop" @button="formButtonTop" @formChange="formChange" />
    <!-- 表格 -->
    <Table :loadData="getList" ref="table" refHead="formListTop" :column="column" :showSortIndex="{ show: true, lable: '序号' }" :params="{ showLocation: 'TAB_12' }"></Table>
    <!-- 新增/编辑 -->
    <el-dialog @close="handleClose" :title="isAdd ? '新增' : '编辑'" :visible.sync="dialogVisible" width="70%" custom-class="dialog_content" :close-on-click-modal="false">
      <div class="popBody">
        <formList ref="formList" :loading.sync="loading" :config="config" :formObj="ruleForm" :list="list" @button="formButton" />

        <el-form ref="popBeforeForm" :inline="false" :model="ruleForm" labelWidth="8em">
          <el-form-item label="关联类型：" prop="relevanceType" :required="true">
            <el-radio-group @change="changeRadio" size="small" v-model="ruleForm.relevanceType">
              <el-radio-button v-for="item in courseList" :key="item.value" :label="item.value" border>
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.relevanceType != 9 && ruleForm.relevanceType != 11" label="选择关联数据" :required="true">
            <el-button type="primary" size="small" @click="targe">关联数据</el-button>
          </el-form-item>
          <el-form-item size="small" v-if="ruleForm.relevanceType == 9" label="h5网址：">
            <el-input style="width: 360px; " v-model="ruleForm.h5"></el-input>
          </el-form-item>
          <el-form-item size="small" v-if="ruleForm.relevanceType == 11" label="瑜伽栏目" :required="true">
            <el-select v-model="ruleForm.relevanceId" placeholder="请选择栏目">
              <el-option v-for="item in relevanceType11" :key="item.id" :label="item.name" :value="item.id + ''"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <simpleTable v-if="simpleObj.column.length && ruleForm.relevanceType != 9 && ruleForm.relevanceType != 11" :style="{ height: '180px' }" :table-data="simpleObj.chose" :table-label="simpleObj.column" />
      </div>
      <div slot="footer" class="popButton">
        <el-button size="small" type="danger" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOK()">确 定</el-button>
      </div>
    </el-dialog>

    <!--关联数据弹窗-->
    <el-dialog :title="tablePop.title" center :visible.sync="tablePopShow" v-if="tablePopShow" width="800px" custom-class="role_dialog" :close-on-click-modal="false">
      <formList ref="tablePopForm" :config="tablePopConfig" :formObj="tablePop.formObj" :list="tablePop.list" @button="tablePopButton" />
      <Table :select="tablePopChoose" :loadData="tablePop.fun" :headHight="400" :single="true" :chenckNone="true" :column="tablePop.column" :params="{ enable: 1 }" ref="tablePopTable"></Table>
      <div class="popButton">
        <el-button @click="tablePopShow = false" type="danger" size="small">取消</el-button>
        <el-button @click="tablePopAdd" type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import formList from "@/components/FormList/index";

import Table from "@/components/Table/index";
import UploadVideo from "@/components/uploadVideo";
import UploadImgDrag from "@/components/uploadDrag";
import UploadAudio from "@/components/uploadAudio";
import CropperImg from "@/components/cropperImg/index";
import { parseTime } from "@/utils";
import { stateList, typeEnums } from "@/utils/systemEnum";
const _typeEnum = [{ label: "全部", val: "" }];
const _typeEnum2 = [];

for (let key in typeEnums) {
  _typeEnum.push({ label: typeEnums[key], value: key });
  _typeEnum2.push({ label: typeEnums[key], value: key });
}
import { getPopupWinList, addPopupWin, delPopupWin, editPopupWin, popup, managerList, bannerPut, bannerPost, managerDetail, bannerDelete, bannerShowLocation, managerAdd, managerStateChange, managerUpdate, managerQueryColumn } from "@/api/operation";
import { getCoachesList } from "@/api/coach";
import { listCourse } from "@/api/course";
import simpleTable from "@/components/simpleTable";
import { mediationList } from "@/api/meditation";
import { jnanaList } from "@/api/wisdom";
import { wikiList } from "@/api/wiki";
import { newslist } from "@/api/news";
import { backType } from "@/components/FormList/utils";
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
      //瑜伽栏目多选数据
      relevanceType11: {},
      configTop: {
        inline: true,
        allRequired: false,
        size:"mini",
        inputStyle: {
          width: "200px",
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查询",
          },
          {
            funType: "reset",
            type: "primary",
            name: "重置",
          },
          {
            funType: "add",
            type: "primary",
            name: "添加",
            icon: "el-icon-plus",
          },
        ],
      },
      formObjTop: {
        state: "",
      },
      listTop: [
        {
          el: "date",
          code: "startTimeLong",
          label: "开始时间",
          endCode: "endTime",
          timeError: "开始时间要小于结束时间",
          stamp: true,
        },
        {
          el: "date",
          code: "endTimeLong",
          label: "结束时间",
          timeError: "结束时间要大于开始时间",
          starCode: "startTime",
          stamp: true,
          defaultTime: "23:59:59",
        },
        {
          el: "select",
          label: "显示状态",
          code: "state",
          list: stateList,
        },
        {
          el: "select",
          label: "类型",
          code: "relevanceType",
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
          width: "200px",
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "查询",
          },
          {
            funType: "reset",
            type: "primary",
            name: "重置",
          },
        ],
      },
      simpleObj: {
        column: [
          {
            prop: "name",
            label: "名字",
          },
          {
            prop: "createTime",
            label: "时间",
          },
          {
            prop: "coverUrl",
            label: "封面图片",
          },
        ],
        chose: [],
      },
      simplEputy: {
        column: [
          {
            prop: "name",
            label: "名字",
          },
          {
            prop: "createTime",
            label: "时间",
          },
          {
            prop: "coverUrl",
            label: "封面图片",
          },
        ],
        chose: [],
      },
      tablePop: {
        title: "标题",
        formObj: {},
        list: [],
        column: [],
        fun: listCourse,
        chose: [],
      },
      tablePopList: {
        1: {
          title: "瑜伽课程选择",
          formObj: {},
          list: [
            {
              label: "课程名",
              code: "name",
            },
          ],
          column: [
            {
              prop: "name",
              label: "课程名称",
            },
            // {
            //   prop:'coachNameStr',
            //   label:'教练名',
            // },
            {
              prop: "createTime",
              label: "创建时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
            },
          ],
          fun: listCourse,
          chose: [],
        },
        11: {
          title: "瑜伽栏目",
          formObj: {},
          list: [
            {
              label: "瑜伽栏目",
              code: "name",
            },
          ],
          column: [
            {
              prop: "name",
              label: "标题",
            },
            {
              prop: "coachNameStr",
              label: "教练名",
            },
            {
              prop: "createTime",
              label: "创建时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
            },
          ],
          fun: listCourse,
          chose: [],
        },
        3: {
          title: "冥想",
          formObj: {},
          list: [
            {
              label: "冥想",
              code: "name",
            },
          ],
          column: [
            {
              prop: "name",
              label: "冥想标题",
            },
            // {
            //   prop:'author',
            //   label:'作者',
            // },
            {
              prop: "updateTime",
              label: "发布时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
              img: true,
            },
          ],
          fun: mediationList,
          chose: [],
        },
        4: {
          title: "智慧",
          formObj: {},
          list: [
            {
              label: "智慧",
              code: "name",
            },
          ],
          column: [
            {
              prop: "name",
              label: "智慧标题",
            },
            // {
            //   prop:'author',
            //   label:'作者',
            // },
            {
              prop: "updateTime",
              label: "发布时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
            },
          ],
          fun: jnanaList,
          chose: [],
        },
        6: {
          title: "教练",
          formObj: {},
          list: [
            {
              label: "教练",
              code: "name",
            },
          ],
          column: [
            {
              prop: "name",
              label: "教练名称",
            },
            {
              prop: "headUrl",
              label: "头像",
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
          title: "百科",
          formObj: {},
          list: [
            {
              label: "百科",
              code: "title",
            },
          ],
          column: [
            {
              prop: "title",
              label: "百科标题",
            },
            {
              prop: "createTime",
              label: "添加时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
            },
          ],
          fun: wikiList,
          chose: [],
        },
        8: {
          title: "新闻",
          formObj: {},
          list: [
            {
              label: "新闻",
              code: "title",
            },
          ],
          column: [
            {
              prop: "title",
              label: "新闻标题",
            },
            {
              prop: "createTime",
              label: "添加时间",
            },
            {
              prop: "coverUrl",
              label: "封面图片",
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
      },
      courseList: _typeEnum2,
      list: [
        {
          el: "img",
          code: "coverUrl",
          label: "图片地址",
          ratio: "750/1136",
          size: 1024,
        },
        {
          el: "textArea",
          code: "remark",
          label: "备注",
          required: false,
        },
        {
          el: "date",
          code: "startTime",
          label: "开始时间",
          endCode: "endTime",
          timeError: "开始时间要小于结束时间",
          required: false,
          stamp: true,
        },
        {
          el: "date",
          code: "endTime",
          label: "结束时间",
          required: false,
          timeError: "开始时间要小于结束时间",
          starCode: "startTime",
          stamp: true,
             defaultTime: "23:59:59",
        },
      ],
      config: {
        labelWidth: "8em",
        inline: false,
        buttonsArea: "popButtom",
        buttons: [],
      },
      tabIdList: [],
      chooseItem: {},
      stateOption: [
        { label: "全部", val: "" },
        { label: "未上线", val: "0" },
        { label: "已上线", val: "1" },
        { label: "已下线", val: "2" },
      ],
      formInline: {
        banned: null,
        tabId: "",
        state: "",
      },
      ruleForm: {
        relevanceType: "1",
        relevanceId: null,
        sortIndex: "",
        h5: "",
      },
      ruleFormEm: {
        relevanceType: "1",
        relevanceId: null,
        sortIndex: "",
        h5: "",
      },
      showShopBtn: false,
      showAREABtn: false,
      showTwoPageBtn: false,
      isAdd: false,
      column: [
        { prop: "createTime", label: "添加时间" },
        {
          prop: "coverUrl",
          label: "开屏图片",
          img: true,
        },
        {
          prop: "remark",
          label: "备注",
        },

        {
          prop: "relevanceType",
          label: "类型",
          formatter: (row, column) => {
            return typeEnums[row.relevanceType] || row.relevanceType;
          },
        },
        {
          prop: "relevanceName",
          label: "关联目标",
        },
        {
          prop: "startTime",
          label: "开始时间",
          time: true,
        },
        {
          prop: "endTime",
          label: "结束时间",
          time: true,
        },
        {
          prop: "state",
          label: "显示状态",
          state: true,
        },
        {
          prop: "enable",
          label: "启用状态",
          switch: true,
          fun: managerStateChange,
        },

        {
          prop: "action",
          label: "操作",
          fixed: "right",
          actives: [
            {
              name: "修改",
              method: (val) => {
                let tempObj = { ...val, time: "" }; //time必须初始化才能绑定成功

                if (val.enable) {
                  this.$message.error("请先关闭启用");
                  return;
                }
                managerDetail({ id: val.id }).then((res) => {
                  let data = res.data;
                  tempObj = { ...tempObj, ...res.data };
                  if (data.startTime && data.endTime) {
                    let startTime = new Date(data.startTime);
                    let endTime = new Date(data.endTime);
                    tempObj.time = [startTime, endTime];
                  } else {
                    tempObj.time = [];
                  }
                  if (tempObj.relevanceType) {
                    tempObj.relevanceType = tempObj.relevanceType * 1;
                  }
                  if (data.relevanceType == 9) {
                    tempObj.h5 = data.hfiveUrl;
                  } else {
                    this.simpleObj = this.getColumn(this.simpleObj);
                    this.simpleObj.chose = [data.adsenseResourceVO];
                  }
                  this.ruleForm = tempObj;
                  this.isAdd = false;
                  this.dialogVisible = true;
                });
              },
            },
          ],
        },
      ],
    };
  },
  computed: {
    getList() {
      return managerList;
    },
  },
  created() {
    const _tempArray = [{ lab: "全部", val: "" }];
    for (let key in typeEnums) {
      _tempArray.push({ lab: typeEnums[key], val: key });
    }
    this.tabIdList = _tempArray;
  },
  mounted() {
    //栏目多选
    managerQueryColumn().then((res) => {
      if (res.code == 200) {
        this.relevanceType11 = res.data;
      }
    });
  },
  methods: {
    formChange(e) {},
    handleOK() {
      this.$refs.formList.confirm();
    },
    // 新加，编辑
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        const urlReg = /^(http|https):\/\/([\w.]+\/?)\S*/;
        let { relevanceType, h5 } = this.ruleForm;
        let data = { ...this.ruleForm, ...val.value, ...{ relevanceType, h5 } };
        if (data.relevanceType == 11) {
          if (this.ruleForm.relevanceId) {
            data.relevanceId = this.ruleForm.relevanceId;
          } else {
            this.$message.error("请选择瑜伽栏目");
            return;
          }
        }
        if (data.relevanceType != 9 && data.relevanceType != 11 && (this.simpleObj.chose.length == 0 || this.simpleObj.chose[0].id == "")) {
          this.$message.error("没有选关联数据");
          return;
        }
        if (data.relevanceType == 9) {
          data.relevanceId = "";
          data.hfiveUrl = this.ruleForm.h5;
        } else {
          if (data.relevanceType != 11) {
            data.relevanceId = this.simpleObj.chose[0].id || "";
            data.hfiveUrl = "";
          }
        }
        if (data.relevanceType == 9 && !urlReg.test(data.hfiveUrl)) {
          this.$message.error("无效的网络地址!");
          this.ruleForm.h5 = "";
          return false;
        }
        data.coverUrl = backType(data.coverUrl, "String") ? data.coverUrl : data.coverUrl.join(",");
        //后端区分开屏和练习广告
        data.showLocation = "TAB_12";
        if (this.isAdd) {
          // 新增
          managerAdd(data).then((res) => {
            this.$refs.table.update();
            if (res.code === 200) {
              this.tablePopShow = false;
              this.handleClose();
              this.$message.success("操作成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          // 编辑
          managerUpdate(data).then((res) => {
            this.$refs.table.update();
            if (res.code === 200) {
              this.tablePopShow = false;
              this.handleClose();
              this.$message.success("操作成功");
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
      console.log("tablePopButton", val);
      if (val.name == "confirm" && val.valid) {
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
      let { relevanceType } = this.ruleForm;
      if (!relevanceType) {
        this.$message.error("请选择关联数据");
      }
      if (relevanceType != 9) {
        this.tablePop = this.getColumn(this.tablePopList[relevanceType], false);
        this.tablePopShow = true;
      }
    },
    // 切换
    changeRadio() {
      this.simpleObj = { ...this.simplEputy };
      if (this.ruleForm.relevanceType != 9) {
        this.showShopBtn = false;
        this.showAREABtn = false;
        this.showTwoPageBtn = false;
      }
    },
    // 获取clume
    getColumn(obj, simple = true) {
      let { column } = obj;
      column.map((val) => {
        if (val.label.includes("图") || val.label.includes("头像")) {
          let prop = val.prop;
          val.render = simple ? (vals) => `<img style="width: 100px;height: 100px;" src="${vals[prop]}">` : "";
          val.img = true;
        }
        val.param = val.prop;
        val.align = "center";
        return val;
      });
      obj = { ...obj, ...{ column } };
      return obj;
    },
    // 关闭弹窗
    handleClose() {
      this.$refs.formList.reset();
      this.ruleForm = {};
      this.dialogVisible = false;
      this.$refs["popBeforeForm"].resetFields();
      this.simpleObj = { ...this.simplEputy };
      this.ruleForm = { ...this.ruleFormEm };
    },
    formButtonTop(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.$refs.table.update(data);
      } else if (val.name == "add") {
        this.isAdd = true;
        this.dialogVisible = true;
      } else if (val.name == "reset") {
        this.formObjTop = {
          state: "",
        };
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
</style>
