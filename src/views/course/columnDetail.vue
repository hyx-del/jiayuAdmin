<template>
   <div class="commonPage">
      <div class="myDetail">
         <div class="detail_left">
            <div class="detail_title">课程栏目详情</div>
            <div class="formShowH">
               <formShow ref="formShow"
                         :config="config"
                         :formObj="formObj"
                         :list="list"
                         @button="formButton" />
            </div>
         </div>
         <div class="detail_right">
            <div class="buttons">
               <!--        <el-button v-show="activeName ==1" @click="courseDialog=true" type="primary" size="small">选择课程</el-button>-->
               <el-button @click="backList"
                          type="danger"
                          size="small">返回列表</el-button>
            </div>
            <el-tabs refHead="200"
                     v-model="activeName"
                     @tab-click="handleClick">
               <el-tab-pane :label="`关联课程${courseData.length > 0 ? `(${courseData.length})` : ''}`"
                            name="1">
                  <simpleTable :style="{ height: 'calc(100vh - 240px)', width: '100%' }"
                               @buttons="buttonsTable"
                               :table-data="courseData"
                               :table-label="courseLabel" />
                  <!--            :table-option="courseOption"-->
                  <div class="save">
                     <!--              <el-button @click="courseSave" type="primary" size="small">确定</el-button>-->
                  </div>
               </el-tab-pane>
            </el-tabs>
            <v-dialog title="修改顺序值"
                      :model="columnForm"
                      :visible="dialogSort"
                      :list="dialogList"
                      @submit="changePasswords"
                      v-if="dialogSort.bl"></v-dialog>
            <el-button type="primary"
                       @click="submitSort"
                       size="medium"
                       style="float:right;margin-right:100px">确定</el-button>
         </div>
      </div>
      <div class="pop">
         <!-- 关联课程 -->
         <el-dialog title="选择课程"
                    center
                    :visible.sync="courseDialog"
                    v-if="courseDialog"
                    width="1200px"
                    custom-class="role_dialog"
                    :close-on-click-modal="false">
            <!--        course-->
            <formList ref="courseForm"
                      :config="popConfig"
                      :formObj="courseObj"
                      :list="coursList"
                      @button="courseButton" />
            <Table :single="false"
                   :select="courseChoose"
                   :loadData="courseList"
                   :headHight="400"
                   :column="courseColumn"
                   :params="{ enable: 1 }"
                   ref="courseTable"></Table>
            <div class="popButton">
               <el-button @click="courseAdd"
                          type="primary"
                          size="small">确定</el-button>
               <el-button @click="courseDialog = false"
                          type="danger"
                          size="small">
                  取消
               </el-button>
            </div>
         </el-dialog>
      </div>
   </div>
</template>
<script>
/*
 * course/columnDetail 课程栏目--详情
 * */
import Table from "@/components/Table/index";
import { Message } from "element-ui";

import formShow from "@/components/FormList/listShow";
import formList from "@/components/FormList";
import { getChoose, getColumnCourse, listCourse, getSort } from "@/api/course";
import { getScreenList } from "@/api/yogaManage";
import { coachesCourse, getCoach, getCoachLevelList } from "@/api/coach";
import simpleTable from "@/components/simpleTable";
import { getSalesRoomTree } from "@/api/admin";
import { wikiColumnList, wikiList } from "@/api/wiki";
import vDialog from "@/components/dialog/index.vue";
import { tableSort } from '@/utils/index';
export default {
   name: "versionManage",
   components: {
      Table,
      formShow,
      formList,
      simpleTable,
      vDialog,
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
               code: "name",
               label: "名称",
               placeholder: "搜索课程名称、教练名称",
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
         courseData: [],
         courseLabel: [
            { label: "课程名称", param: "name", align: "center" },
            { label: "节次", param: "nodeTotal", align: "center" },
            { label: "难度等级", param: "difficultyLevelName", align: "center" },
            { label: "练习人数", param: "joinTotal", align: "center" },
            {
               label: "教练名称",
               param: "coachName",
               align: "center",
               render: (val) => (val.coachName ? val.coachName.join(",") : ""),
            },
            {
               label: "顺序值",
               prop: "sort",
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val, index) => {
                        this.columnForm.sort = val.sort;
                        this.columnForm.id = val.id;
                        this.tableDataIndex = index;
                        this.dialogSort = { bl: true };
                     },
                  },
               ],
            },
         ],
         // courseOption: {
         //   label: '操作',
         //   width: '300',
         //   options: [
         //     { label: '上移', type: 'primary', icon: 'el-icon-upload2', methods: 'download' },
         //     { label: '下移', type: 'primary', icon: 'el-icon-download', methods: 'upload' },
         //     { label: '删除', type: 'primary', icon: 'el-icon-delete', methods: 'delete' },
         //   ]
         // },
         courseNum: 0,
         practiceNum: 0,
         activeName: "1",
         config: {
            hasLoading: false,
            inline: false,
            allRequired: false,
            buttons: [],
         },
         formObj: {},
         list: [
            {
               code: "name",
               label: "栏目名称",
            },
            {
               code: "sort",
               label: "展示顺序",
               type: "number",
            },
            { el: "img", code: "introductionUrl", label: "简介" },
            // {
            // 	code: 'difficultyLevelsStr',
            // 	label: '难度等级',
            // },
            // {
            // 	code: 'yogaEffectsStr',
            // 	label: '瑜伽功效',
            // },
            // {
            // 	code: 'yogaCategorysStr',
            // 	label: '瑜伽流派',
            // },
         ],
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
               prop: "coaches",
               label: "教练名称",
            },
         ],
      };
   },
   computed: {
      getList() {
         return listCourse;
      },
      courseList() {
         return getChoose;
      },
   },
   created() {
      if (this.$route.query.id) {
         // this.formObj=this.$route.params
         this.edit = true;
         this.id = this.$route.query.id;
         getColumnCourse({ id: this.$route.query.id }).then((res) => {
            console.log(res);
            this.formObj = res.data.column;
            this.courseData = res.data.courseList ? res.data.courseList : [];
            console.log(this.courseData);
            // this.formObj=JSON.parse(JSON.stringify(this.formObj))
            // console.log(this.formObj)
         });
      }
   },
   methods: {
      backList() {
         this.$router.push({
            path: "/content/course/column",
         });
      },

      // 保存课程列表
      courseSave() {
         coachesCourse(this.courseData).then((res) => {
            console.log(res);
         });
      },
      // 课程选择编辑
      courseAdd() {
         let course = this.courseData.map((v) => v.id);
         let courseChose = this.courseChooseList.map((v) => v.id);
         let difference = [...new Set(courseChose.filter((x) => !course.includes(x)))];
         let differenceList = this.courseChooseList.filter((v) => difference.includes(v.id));
         this.courseData = [...differenceList, ...this.courseData];
         this.$message.success(`成功添加${differenceList.length}个`);
      },

      // 课程选择事件
      courseChoose(val) {
         this.courseChooseList = val;
      },

      handleClick() { },
      // 搜索查询
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.$refs.TableList.update({ ...data });
         }
         if (val.name == "add") {
            this.$router.push({
               path: "/content/wiki/add",
            });
         }
      },
      // 课程弹窗的查询按钮
      courseButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.$refs.courseTable.update({ ...data });
         }
      },
      // 选择课程的表格内的按钮
      buttonsTable(info) {
         if (info.button.label == "上移") {
            if (info.index > 0) {
               this.courseData.splice(info.index - 1, 0, this.courseData.splice(info.index, 1)[0]);
            } else {
               Message.error("已经到顶了");
            }
         }
         if (info.button.label == "下移") {
            if (info.index == this.courseData.length - 1) {
               Message.error("已经到底了");
            } else {
               this.courseData.splice(info.index + 1, 0, this.courseData.splice(info.index, 1)[0]);
            }
         }
         if (info.button.label == "删除") {
            this.courseData.splice(info.index, 1);
         }
      },
      //修改顺序值
      changePasswords(e) {
         let index = this.tableDataIndex;
         this.courseData[index].sort = e.sort;
         this.courseData[index].isSort = true;
         this.courseData = tableSort(this.courseData);
      },
      //批量保存顺序值
      submitSort() {
         let arr = this.courseData.filter(item => item.isSort).map(item => {
            let obj = {};
            obj = { courseId: item.id, sort: item.sort };
            return obj;
         });
         let params = { columnId: this.id, columnCourseList: arr };
         getSort(params).then(res => {
            res.code == 200 ? this.$message.success("保存成功") : this.$message.error("保存失败");
         });
      }
   },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");

.myDetail {
  display: flex;
   .detail_left {
      width: 25%;
      min-width: 350px;
      padding-right: 20px;
      border-right: 1px solid #eee;
   }
   .detail_right {
     width: 75%;
      padding-left: 20px;
   }
   .buttons {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
   }
   .formShowH {
      width: 100%;
      height: calc(100vh - 200px);
      overflow: auto;
   }
   .detail_title {
      font-size: 24px;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
   }
}
.popButton {
   display: flex;
   //justify-content: flex-end;
   justify-content: center;
}
.save {
   display: flex;
   justify-content: center;
   margin-top: 20px;
}
.pop >>> .el-pagination__jump:not([class*="suffix"]) {
   margin-right: 30px;
}
</style>
