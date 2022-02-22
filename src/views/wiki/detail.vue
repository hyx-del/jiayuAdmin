<template>
   <div class="commonPage">
      <div class="myDetail">
         <div class="buttons">
            <el-button v-show="activeName == 1"
                       @click="courseDialog = true"
                       type="primary"
                       size="small">选择课程</el-button>
            <el-button v-show="activeName == 2"
                       @click="coachDialog = true"
                       type="primary"
                       size="small">选择教练</el-button>
            <el-button @click="cancel"
                       type="danger"
                       size="small">返回列表</el-button>
         </div>
         <div class="detail_left">
            <div class="detail_title">百科详情</div>
            <div class="formShowH">
               <p class="formShowH_tit">列表封面</p>
               <img class="formShowH_img"
                    :src="formObj.coverListUrl" />
               <p class="formShowH_tit">内容封面</p>
               <img class="formShowH_img"
                    :src="formObj.coverUrl" />
               <div class="formShowH_tit"
                    v-html="formObj.title"></div>
               <div class="formShowH_mid">
                  <div class="formShowH_tips">{{ formObj.createTime || formObj.startTime }}</div>
                  <div class="formShowH_tips">点赞：{{ formObj.clickNum || 0 }}</div>
                  <div class="formShowH_tips">浏览：{{ formObj.reading || 0 }}</div>
                  <div class="formShowH_tips">收藏：{{ formObj.collectionsNum || 0 }}</div>
               </div>
               <div class="formShowH_video"
                    v-if="formObj.videoUrl">
                  <video :src="formObj.videoUrl"
                         controls="controls"></video>
               </div>
               <div class="formShowH_content"
                    v-html="formObj.detailText"></div>
            </div>
         </div>
         <div class="detail_right">
            <el-tabs refHead="200"
                     v-model="activeName"
                     @tab-click="handleClick">
               <el-tab-pane :label="`关联课程${courseData.length > 0 ? `(${courseData.length})` : ''}`"
                            name="1">
                  <simpleTable :style="{ height: 'calc(100vh - 240px)' }"
                               @buttons="courseTable"
                               :table-data="courseData"
                               :table-label="courseLabel"
                               :table-option="courseOption" />
                  <div class="save">
                     <el-button @click="courseSave"
                                type="primary"
                                size="small">确定</el-button>
                  </div>
               </el-tab-pane>
               <el-tab-pane :label="`关联教练${coachData.length > 0 ? `(${coachData.length})` : ''}`"
                            name="2">
                  <simpleTable :style="{ height: 'calc(100vh - 240px)' }"
                               @buttons="coachTable"
                               :table-data="coachData"
                               :table-label="coachLabel"
                               :table-option="coachOption" />
                  <div class="save">
                     <el-button @click="coachSave"
                                type="primary"
                                size="small">确定</el-button>
                  </div>
               </el-tab-pane>
            </el-tabs>
            <v-dialog title="修改顺序值"
                      :model="columnForm"
                      :visible="dialogSort"
                      :list="dialogList"
                      @submit="changePasswords"
                      v-if="dialogSort.bl"></v-dialog>
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
                   :params="{ enable: 1 }"
                   :column="courseColumn"
                   ref="courseTable"></Table>
            <div class="popButton">
               <el-button @click="courseAdd"
                          type="primary"
                          size="small">确定</el-button>
               <el-button @click="courseDialog = false"
                          type="danger"
                          size="small">取消</el-button>
            </div>
         </el-dialog>
         <!--关联教练-->
         <el-dialog title="选择教练"
                    center
                    :visible.sync="coachDialog"
                    v-if="coachDialog"
                    width="600px"
                    :params="{ enable: 1 }"
                    custom-class="role_dialog"
                    :close-on-click-modal="false">
            <!--        coach-->
            <formList ref="coachForm"
                      :config="coachConfig"
                      :formObj="coachObj"
                      :list="coachList"
                      @button="coachButton" />
            <Table :single="false"
                   :select="coachChoose"
                   :loadData="coachTableList"
                   :headHight="400"
                   :column="coachColumn"
                   :params="{ enable: 1 }"
                   ref="coachTable"></Table>
            <div class="popButton">
               <el-button @click="coachAdd"
                          type="primary"
                          size="small">确定</el-button>
               <el-button @click="coachDialog = false"
                          type="danger"
                          size="small">取消</el-button>
            </div>
         </el-dialog>
      </div>
   </div>
</template>
<script>
/*
 * wiki/detail 教练管理--详情
 * */
import Table from "@/components/Table/index";
import { Message } from "element-ui";

import formShow from "@/components/FormList/listShow";
import formList from "@/components/FormList";
import { getChoose, listCourse } from "@/api/course";
import { getScreenList } from "@/api/yogaManage";
import { coachesCourse, getCoach, getCoachesList, getCoachLevelList } from "@/api/coach";
import simpleTable from "@/components/simpleTable";
import { getSalesRoomTree } from "@/api/admin";
import { getWiki, getWikiCoach, getWikiCourse, putWikiCoach, putWikiCourse, wikiColumnList, wikiList } from "@/api/wiki";
import { newsPutCoach, newsPutCourse } from "@/api/news";
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
         dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number", width: '120px' }],
         isCourseData: true,
         popConfig: {
            hasLoading: false,
            inline: true,
            allRequired: false,
            size: "mini",
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
         coachConfig: {
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

         courseChooseList: [],
         courseObj: {},
         courseDialog: false,
         coursList: [
            {
               code: "name",
               label: "名称",
               placeholder: "搜索课程名称、教练名称",
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
            { label: "节次", param: "nodeNum", align: "center" },
            { label: "难度等级", param: "levelName", align: "center" },
            { label: "练习人数", param: "joinTotal", align: "center" },
            { label: "教练名称", param: "coachName", align: "center" },
            {
               label: "顺序值",
               param: "sort",
               align: "center",
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val, index) => {
                        this.isCourseData = true;
                        this.columnForm.sort = val.sort;
                        this.tableDataIndex = index;
                        this.dialogSort = { bl: true };
                     },
                  },
               ],
            },
         ],
         courseOption: {
            label: "操作",
            width: "300",
            options: [
               // { label: '上移', type: 'primary', icon: 'el-icon-upload2', methods: 'download' },
               // { label: '下移', type: 'primary', icon: 'el-icon-download', methods: 'upload' },
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

         coachChooseList: [],
         coachObj: {},
         coachDialog: false,
         coachList: [
            {
               code: "name",
               label: "教练",
            },
         ],
         coachData: [],
         coachLabel: [
            { label: "教练名称", param: "name", align: "center" },
            {
               label: "头像",
               param: "headUrl",
               align: "center",
               render: (val) => `<img style="width: 100px;height: 100px;" src="${val.headUrl}">`,
            },
            { label: "slogan", param: "slogan", align: "center" },
            {
               label: "顺序值",
               param: "sort",
               align: "center",
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val, index) => {
                        this.isCourseData = false;
                        this.columnForm.sort = val.sort;
                        this.tableDataIndex = index;
                        this.dialogSort = { bl: true };
                     },
                  },
               ],
            },
         ],
         coachOption: {
            label: "操作",
            width: "300",
            options: [
               // { label: "上移", type: "primary", icon: "el-icon-upload2", methods: "download" },
               // { label: "下移", type: "primary", icon: "el-icon-download", methods: "upload" },
               { label: "删除", type: "primary", icon: "el-icon-delete", methods: "delete" },
            ],
         },
         //教练表头
         coachColumn: [
            {
               prop: "name",
               label: "教练",
            },
         ],

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
               label: "教练名称",
            },
            {
               code: "sex",
               label: "性别",
               list: [
                  {
                     label: "男",
                     value: 1,
                  },
                  {
                     label: "女",
                     value: 2,
                  },
               ],
            },
            {
               el: "img",
               code: "headUrl",
               label: "头像",
            },
            {
               code: "slogan",
               label: "Slogan",
            },
            {
               code: "coachLevelId",
               label: "教练等级",
               back: true,
               labelCode: "levelName",
               valueCode: "id",
               fun: getCoachLevelList,
            },
            {
               code: "teachingTime",
               label: "累计教学时长",
            },
            {
               back: true,
               code: "saleRoom",
               label: "所属门店",
               labelCode: "name",
               valueCode: "id",
               searchCode: "name",
               fun: getSalesRoomTree,
               funMode: 3,
               cascaderValue: "end",
               firstCode: "cityName",
            },
            {
               el: "img",
               code: "introducePicture",
               label: "介绍",
            },
            {
               code: "yogaSchool",
               label: "擅长瑜伽流派",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 1,
               },
            },
            {
               code: "yogaEffect",
               label: "擅长瑜伽功效",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 2,
               },
            },
         ],
         // 表头
         column: [
            {
               prop: "createTime",
               label: "节次名称",
            },
            {
               prop: "coverUrl",
               label: "封面",
               render: true,
            },
            {
               prop: "name",
               label: "时长（秒）",
            },
         ],

         id: "",
      };
   },
   computed: {
      getList() {
         return listCourse;
      },
      courseList() {
         return getChoose;
      },
      coachTableList() {
         return getCoachesList;
      },
   },
   created() {
      if (this.$route.query.id) {
         this.edit = true;
         this.id = this.$route.query.id;
         getWiki({ id: this.$route.query.id }).then((res) => {
            this.formObj = res.data;
         });
         getWikiCourse({ id: this.$route.query.id }).then((res) => {
            this.courseData = res.data;
         });
         getWikiCoach({ id: this.$route.query.id }).then((res) => {
            this.coachData = res.data;
         });
      }
   },
   methods: {
      cancel() {
         this.$confirm("是否返回到列表?确定将放弃编辑内容！", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
         }).then(() => {
            this.$router.push({
               path: "/content/wiki/index",
            });
         });
      },
      // 保存课程列表
      courseSave() {
           let arr = this.courseData.map(v => {
            let obj;
            let sort = v.sort || null;
            return { courseId: v.id, sort: sort };
         });
         debugger
         putWikiCourse({ id: this.id, courses: arr }).then((res) => {
            console.log(res);
            this.$message.success("操作成功");
         });
      },
      // 保存教练列表
      coachSave() {
          let arr = this.coachData.map(v => {
            let obj;
            let sort = v.sort || null;
            return obj = { coachId: v.id, sort:sort };
         });
         putWikiCoach({ id: this.id, coaches: arr }).then((res) => {
            this.$message.success("操作成功");
         });
      },
      // 课程选择编辑
      courseAdd() {
         let course = this.courseData.map((v) => v.id);
         let courseChose = this.courseChooseList.map((v) => v.id);
         let difference = [...new Set(courseChose.filter((x) => !course.includes(x)))];
         let differenceList = this.courseChooseList.filter((v) =>{
            v.sort = null;
            return difference.includes(v.id);
         });
         console.log(differenceList);
         this.courseData = [...differenceList, ...this.courseData];
         this.$message.success(`成功添加${differenceList.length}个`);
      },
      // 教练选择编辑
      coachAdd() {
         let coach = this.coachData.map((v) => v.id);
         let coachChose = this.coachChooseList.map((v) => v.id);
         let difference = [...new Set(coachChose.filter((x) => !coach.includes(x)))];
         let differenceList = this.coachChooseList.filter((v) => {
            v.sort = null;
            return difference.includes(v.id);
         });
         this.coachData = [...differenceList, ...this.coachData];
         this.$message.success(`成功添加${differenceList.length}个`);
      },

      // 课程选择事件
      courseChoose(val) {
         this.courseChooseList = val;
      },
      // 教练选择事件
      coachChoose(val) {
         this.coachChooseList = val;
      },

      handleClick() { },
      // 课程弹窗的查询按钮
      courseButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.$refs.courseTable.update({ ...data });
         }
      },
      // 课程弹窗的查询按钮
      coachButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.$refs.coachTable.update({ ...data });
         }
      },
      // 选择课程的表格内的按钮
      courseTable(info) {
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
      // 选择教练的表格内的按钮
      coachTable(info) {
         if (info.button.label == "上移") {
            if (info.index > 0) {
               this.coachData.splice(info.index - 1, 0, this.coachData.splice(info.index, 1)[0]);
            } else {
               Message.error("已经到顶了");
            }
         }
         if (info.button.label == "下移") {
            if (info.index == this.coachData.length - 1) {
               Message.error("已经到底了");
            } else {
               this.coachData.splice(info.index + 1, 0, this.coachData.splice(info.index, 1)[0]);
            }
         }
         if (info.button.label == "删除") {
            this.coachData.splice(info.index, 1);
         }
      },
      //修改顺序值
      changePasswords(e) {
         let index = this.tableDataIndex;
         // 关联课程
         if (this.isCourseData) {
            this.courseData[index].sort = e.sort;
            this.courseData = tableSort(this.courseData);
         } else {
            this.coachData[index].sort = e.sort;
            this.coachData = tableSort(this.coachData);
         }
      },
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
.formShowH {
   width: 100%;
   height: calc(100vh - 200px);
   overflow: auto;
   .formShowH_img {
      width: 100%;
   }
   .formShowH_tit {
      font-size: 16px;
      margin: 20px 0;
      font-weight: bold;
   }
   .formShowH_mid {
      display: flex;
      justify-content: space-between;
      .formShowH_tips {
         font-size: 12px;
         color: #999;
      }
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
.formShowH_video {
   width: 100%;
}
video {
   width: 100%;
}
>>>.el-dialog__body{
   display: block;
}
</style>
