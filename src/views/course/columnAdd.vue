<template>
  <div class="commonPage">
    <el-button class="cancelTop" size="small" type="danger" @click="cancel">
      返回到列表
    </el-button>
    <el-steps :active="active" :space="400" align-center>
      <el-step title="填写栏目信息"></el-step>
      <el-step title="关联课程"></el-step>
    </el-steps>
    <div class="formBody" v-show="active == 1">
      <formList ref="formList" :config="config" :formObj="formObj" :list="list" :searchObj="searchObj" @searchVal="searchVal" @button="formButton" />
    </div>
    <div class="formBody" v-show="active == 2">
      <el-button class="topBut" size="small" type="primary" @click="addNode">
        选择课程
      </el-button>
      <simpleTable :style="{ height: 'calc(100vh - 300px)' }" @buttons="buttonsTable" :table-data="tableData" :table-label="tableLabel" :table-option="tableOption" />
          <v-dialog title="修改顺序值"
                   :model="columnForm"
                   :visible="dialogSort"
                   :list="dialogList"
                   @submit="changePasswords"
                   v-if="dialogSort.bl"></v-dialog>
      <div class="bottonBut">
        <el-button class="topBut" size="small" type="primary" @click="steps(-1)">
          上一步
        </el-button>
        <el-button :loading="loading" class="topBut" size="small" type="primary" @click="saveCourse">
          保存
        </el-button>
      </div>
    </div>
    <div class="pop">
      <el-dialog title="选择课程" center :visible.sync="courseDialog" v-if="courseDialog" width="1200px" custom-class="role_dialog" :close-on-click-modal="false">
        <!--        course-->
        <formList ref="courseForm" :config="popConfig" :formObj="courseObj" :list="coursList" @button="courseButton" />
        <Table :single="false" :select="courseChoose" :loadData="courseList" :headHight="400" :column="courseColumn" ref="courseTable"></Table>
        <div class="popButton">
          <el-button @click="courseAdd" type="primary" size="small">确定</el-button>
          <el-button @click="courseDialog = false" type="danger" size="small">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/* course/add 添加课程和修改课程 Course
 * */
import formList from "@/components/FormList/index";
import simpleTable from "@/components/simpleTable/index";
import { Message } from "element-ui";

import { addColumnCourse, addCourse, getChoose, getColumnCourse, getCourse, listCourse, updateColumnCourse, updateCourse } from "@/api/course";
import { coachesCourse, getAssistantList, getCoachesList } from "@/api/coach";
import { getScreenList } from "@/api/yogaManage";
import Table from "@/components/Table";
import { backType } from "@/utils/validate";
import vDialog from "@/components/dialog/index.vue";
import { tableSort } from '@/utils/index';
export default {
  components: {
    formList,
    Table,
    simpleTable,
    vDialog
  },
  data() {
    return {
      columnForm: {},
      dialogSort: { bl: false },
      dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number" }],
      tableDataIndex: null,
      courseChooseList: [],
      courseObj: {},
      popConfig: {
        hasLoading: false,
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
        ],
      },
      courseDialog: false,
      coursList: [
        {
          code: "courseName",
          label: "课程名称",
        },
        {
          code: "coachName",
          label: "教练名称",
          maxlength: 20,
        },
        {
          el: "select",
          code: "yogaEffects",
          label: "瑜伽功效",
          back: true,
          labelCode: "name",
          valueCode: "id",
          fun: getScreenList,
          funMode: 2,
          postData: {
            id: 2,
            name: "瑜伽功效",
          },
        },
        {
          el: "select",
          code: "difficultyLevel",
          label: "难度等级",
          back: true,
          labelCode: "name",
          valueCode: "id",
          fun: getScreenList,
          funMode: 2,
          postData: {
            id: 3,
            name: "难度等级",
          },
        },
      ],
      courseData: [{}],
      courseLabel: [
        { label: "课程名称", param: "name", align: "center" },
        { label: "节次", param: "nodeTotal", align: "center" },
        { label: "难度等级", param: "difficultyLevel", align: "center" },
        { label: "练习人数", param: "joinTotal", align: "center" },
        { label: "教练名称", param: "coaches", align: "center" },
      ],
      courseOption: {
        label: "操作",
        width: "300",
        options: [
          {
            label: "上移",
            type: "primary",
            icon: "el-icon-upload2",
            methods: "download",
          },
          { label: "下移", type: "primary", icon: "el-icon-download", methods: "upload" },
          { label: "删除", type: "primary", icon: "el-icon-delete", methods: "delete" },
        ],
      },
      //课程表头
      courseColumn: [
        {
          prop: "name",
          label: "课程名称",
        },
        {
          prop: "nodeTotal",
          label: "节次",
          formatter: (row, column) => row.nodeTotal || 0,
        },
        {
          prop: "coachName",
          label: "教练名称",
        },
      ],
      postData: {},
      title: "添加节次",
      tableData: [],
      tableLabel: [
        { label: "序号", param: "index", align: "center", sortable: true },
        { label: "课程名称", param: "name", align: "center", sortable: true },
        { label: "节次", param: "nodeTotal", align: "center", sortable: true },
        { label: "难度等级", param: "difficultyLevel", align: "center", sortable: true },
        { label: "练习人数", param: "joinTotal", align: "center", sortable: true },
        { label: "教练名称", param: "coachName", align: "center", sortable: true, render: (obj) => (backType(obj.coachName, "Array") ? obj.coachName.join(",") : obj.coachName.replace("|", ",")) },
       {
               label: "顺序值",
               param: "sort",
               align: "center",
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val, index) => {
                         this.columnForm.sort=val.sort
                        this.tableDataIndex = index;
                        this.dialogSort = { bl: true };
                     },
                  },
               ],
            },
      ],
      tableOption: {
        label: "操作",
        width: "400",
        options: [
          // {
          //   label: "上移",
          //   type: "primary",
          //   icon: "el-icon-upload2",
          //   methods: "download",
          // },
          // { label: "下移", type: "primary", icon: "el-icon-download", methods: "upload" },
          { label: "删除", type: "primary", icon: "el-icon-delete", methods: "delete" },
          // {
          //   label: "编辑",
          //   type: "primary",
          //   icon: "el-icon-edit-outline",
          //   methods: "edit",
          // },
        ],
      },
      active: 1,
      loading: false,
      searchObj: {
        list: [],
      },
      edit: false,
      list: [
        {
          code: "name",
          label: "栏目名称",
          maxlength: 20,
        },
        {
          code: "sort",
          label: "顺序",
          type: "number",
          maxlength: 20,
        },
        {
          el: "img",
          code: "introductionUrl",
          label: "简介",
          size: 1024,
          limit: 1,
          ImgType: ["png", "jpg", "jpeg", "gif"],
          ratio: "750/640",
        },
        // {
        // 	el: 'checkbox',
        // 	code: 'difficultyLevels',
        // 	label: '难度等级',
        // 	back: true,
        // 	labelCode: 'name',
        // 	valueCode: 'id',
        // 	fun: getScreenList,
        // 	funMode: 2,
        // 	postData: {
        // 		id: 3,
        // 		name: '难度等级',
        // 	},
        // },
        // {
        // 	el: 'checkbox',
        // 	code: 'yogaEffects',
        // 	label: '瑜伽功效',
        // 	back: true,
        // 	labelCode: 'name',
        // 	valueCode: 'id',
        // 	fun: getScreenList,
        // 	funMode: 2,
        // 	postData: {
        // 		id: 2,
        // 		name: '瑜伽功效',
        // 	},
        // },
        // {
        // 	el: 'checkbox',
        // 	back: true,
        // 	code: 'yogaCategorys',
        // 	label: '瑜伽流派',
        // 	labelCode: 'name',
        // 	valueCode: 'id',
        // 	fun: getScreenList,
        // 	funMode: 2,
        // 	postData: {
        // 		id: 1,
        // 	},
        // },
      ],

      formObj: {
        // "courseType":1,
        // "sort":'12x',
        // "coverUrl":"http://oss.faceinner.com/img/qn00df124d513463458f798a65e75f26bb_1622425227000.jpg",
        // "coverUrl2":"http://oss.faceinner.com/img/qn0be0e43221346348aeba2ed28cd53f22_1622087109000.jpg",
        // "difficultyLevel":20,"introduceUrl":"http://oss.faceinner.com/img/qnf2b2b675813463458f9d1ef64bebf5cb_1622425278000.jpg",
        // "name":"就是让你瘦","practiceRate":12,
        // "previewUrl":"http://oss.faceinner.com/video/qn79f1e5ac01346348aeb7b37099f44e18_1622087102000.mp4",
        // "tips":"这是一个温馨提示","suitableCrowd":"18","yogaCategorys":15,
        // "yogaEffects":"7","previewCoverUrl":"http://oss.faceinner.com/img/qnec1fea14413463458f7bbf761246583e_1622425233000.jpg","coaches":"8","assistants":"2",
      },

      config: {
        buttonsArea: "popButtom",
        inline: false,
        mainStyle: {
          width: "80%",
          marginLeft: "10%",
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "下一步",
          },
        ],
      },

      tableIndex: -1,
      id: "",
    };
  },
  mounted() {
    if (this.$route.query.id) {
      // this.formObj=this.$route.params
      this.edit = true;
      this.id = this.$route.query.id;
      getColumnCourse({ id: this.$route.query.id }).then((res) => {
        console.log(res);
        this.formObj = res.data.column;
        this.tableData = res.data.courseList ? res.data.courseList : [];
         this.tableData.forEach((item,index)=>{
           item.index=index+1
         })
        // this.formObj=JSON.parse(JSON.stringify(this.formObj))
        // console.log(this.formObj)
      });
    }
  },
  computed: {
    courseList() {
      return getChoose;
    },
  },

  methods: {
    isAdd() {
      return this.tableIndex == -1;
    },
    // 课程弹窗的查询按钮
    courseButton(val) {
      console.log(this.$refs);
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.$refs.courseTable.update({ ...data });
      }
    },
    // 课程选择编辑
    courseAdd() {
      let course = this.tableData.map((v) => v.id);
      let courseChose = this.courseChooseList.map((v) => v.id);
      let difference = [...new Set(courseChose.filter((x) => !course.includes(x)))];
      let differenceList = this.courseChooseList.filter((v) => difference.includes(v.id));
      this.tableData = [ ...this.tableData,...differenceList];
      this.$message.success(`成功添加${differenceList.length}个`);
    },

    // 取消,返回到列表
    cancel() {
      this.$confirm("是否返回到列表?确定将放弃编辑内容！", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.push({
          path: "/content/course/column",
        });
      });
    },
    // 步进
    steps(num) {
      this.active += num;
    },
    // 保存课程列表
    courseSave() {
      coachesCourse(this.courseData).then((res) => {
        console.log(res);
      });
    },

    // 课程选择事件
    courseChoose(val) {
      this.courseChooseList = val;
    },
    // 保存课程
    saveCourse() {
      if (this.tableData.length > 0) {
        let list = this.tableData.map((val) => {
          let obj={}
            obj.courseId=val.id
            obj.sort=val.sort
            return obj
        });
        let data = { ...this.postData, ...{ list } };
        this.loading = true;
        if (this.edit) {
          data.id = this.id;
          updateColumnCourse(data)
            .then((res) => {
              this.loading = false;
              this.$router.push({
                path: "/content/course/column",
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          // 新加
          addColumnCourse(data)
            .then((res) => {
              this.loading = false;
              this.$router.push({
                path: "/content/course/column",
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      } else {
        Message.error("请添加课程");
      }
    },
    // 添加课程
    addNode() {
      this.courseDialog = true;
      this.title = "选择节点课程";
      this.tableIndex = -1;
    },
    // 表单的按钮
    buttonsTable(info) {
      if (info.button.label == "上移") {
        if (info.index > 0) {
          this.tableData.splice(info.index - 1, 0, this.tableData.splice(info.index, 1)[0]);
        } else {
          Message.error("已经到顶了");
        }
      }
      if (info.button.label == "下移") {
        if (info.index == this.tableData.length - 1) {
          Message.error("已经到底了");
        } else {
          this.tableData.splice(info.index + 1, 0, this.tableData.splice(info.index, 1)[0]);
        }
      }
      if (info.button.label == "删除") {
        this.tableData.splice(info.index, 1);
      }
      if (info.button.label == "编辑") {
        let obj = JSON.parse(JSON.stringify(info.row));
        obj.coverUrl = info.row.coverUrl;
        obj.resourceUrl = info.row.resourceUrl;
        this.formObjPop = obj;
        this.title = "编辑节点课程";
        this.tableIndex = info.index;
        this.courseDialog = true;
      }
    },
    // 填写课程信息的表单按钮
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.postData = { ...this.postData, ...data };
        this.steps(1);
      }
    },
    // 添加或编辑课程节点
    formButtonPop(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        data.time = data.resourceUrl_time ? data.resourceUrl_time : data.time;
        if (this.isAdd(this.tableIndex)) {
          this.tableData.push(data);
        } else {
          this.tableData.splice(this.tableIndex, 1, data);
        }
      }
      this.formObjPop = {};
      this.dialogFormVisible = false;
    },
    // 搜索值
    searchVal(val) {
      if (val.value == "") {
        this.searchObj = {
          code: val.code,
          list: [],
        };
      } else {
        setTimeout(() => {
          this.searchObj = {
            code: val.code,
            selectType: "Object",
            list: [
              {
                label: "张三",
                value: "1",
              },
              {
                label: "李四",
                value: "2",
              },
              {
                label: "法外狂徒",
                value: "110",
              },
            ],
          };
        }, 200);
      }
    },
    //修改顺序值
    changePasswords(e) {
           let index = this.tableDataIndex;
         this.tableData[index].sort = e.sort;
         this.tableData = tableSort(this.tableData);
      },
  },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.commonPage {
  padding-bottom: 60px;
}
.formBody {
  //position: relative;
  margin-top: 10px;
  width: 100%;
  height: calc(100vh - 240px);
  overflow: auto;
}
.topBut {
  margin-bottom: 20px;
}
.bottonBut {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}
.cancelTop {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
}

.popButton {
  display: flex;
  //justify-content: flex-end;
  justify-content: center;
}

.pop >>> .el-pagination__jump:not([class*="suffix"]) {
  margin-right: 30px;
}
.pop >>> .el-dialog__body {
  display: block;
}
</style>
