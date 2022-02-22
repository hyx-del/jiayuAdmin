<template>
   <div class="commonPage">
      <formList ref="formList"
                :config="config"
                :formObj="formObj"
                :list="list"
                @button="formButton" />
      <Table :loadData="getList"
             refHead="formList"
             :column="column"
             ref="TableList"
             :showSortIndex="{ show: true, lable: '序号' }"></Table>
      <v-dialog title="修改顺序值"
                :model="columnForm"
                :visible="dialogFormVisible"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogFormVisible.bl"></v-dialog>
   </div>
</template>
<script>
/*
 * course 瑜伽课程管理
 * */
import Table from "@/components/Table/index";

import formList from "@/components/FormList";
import { courseEnable, coursePractise, courseRecommend, deleteCourse, listCourse, courseSort, courseSortPra } from "@/api/course";
import { buyList, buyType, stateList, stateObj } from "@/utils/systemEnum";
import { getScreenList } from "@/api/yogaManage";
import vDialog from "@/components/dialog/index.vue";

export default {
   name: "versionManage",
   components: {
      Table,
      formList,
      vDialog,
   },
   data() {
      return {
         columnForm: {},
         dialogFormVisible: { bl: false },
         dialogList: [{ label: "修改顺序值", code: "recommendOrder", maxLength: 5, type: "number", width: "130px" }],
         config: {
            hasLoading: false,
            inline: true,
            allRequired: false,
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
                  name: "添加课程",
                  icon: "el-icon-plus",
               },
            ],
            inputStyle: {//input框样式，css
               width: '120px',
            },
         },
         formObj: {
            courseType: "",
         },
         list: [
            {
               code: "name",
               label: "课程名称",
               // required:true
            },
            {
               code: "coachName",
               label: "教练名称",
               maxlength: 20,
            },
            {
               el: "select",
               label: "课程类型",
               code: "durationType",
               list: [
                  // 下拉选项
                  {
                     label: "全部",
                     value: "",
                  },
                  {
                     label: "主题短视频",
                     value: "1",
                  },
                  {
                     label: "专题短视频",
                     value: "2",
                  },
                  {
                     label: "大课",
                     value: "3",
                  },
               ],
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
            {
               el: "select",
               code: "enable",
               label: "启用状态",
               list: stateList,
            },
            {
               el: "select",
               code: "payType",
               label: "付费方式",
               list: buyList,
            },
         ],
         // 表头
         column: [
            {
               prop: "createTime",
               label: "添加时间",
            },
            {
               prop: "coverUrl",
               label: "课程封面",
               img: true,
            },
            {
               prop: "name",
               label: "课程名称",
            },
            {
               prop: "courseType",
               label: "课程类型",
               formatter: (val) => {
                  switch (val.durationType) {
                     case 1:
                        return "主题短视频";
                        break;
                     case 2:
                        return "专题短视频";
                        break;
                     case 3:
                        return "大课";
                        break;
                     default:
                        break;
                  }
               },
            },
            {
               prop: "difficultyLevelName",
               label: "难度等级",
               //   formatter: (row, column) => console.log(11),
            },
            {
               prop: "coachName",
               label: "教练名称",
               formatter: (row, column) => row.coachName.join(","),
            },
            {
               prop: "nodeTotal",
               label: "总小节",
               formatter: (row, column) => row.nodeTotal || 0,
            },
            {
               prop: "payType",
               label: "付费方式",
               html: (val) => buyType[val.payType],
            },
            {
               prop: "scorePrice",
               label: "积分价格",
            },
            {
               prop: "cashPrice",
               label: "现金价格",
            },
            // {
            //   prop: "joinTotal",
            //   label: "真实练习人数",
            // },
            // {
            //   prop: "joinTotalRandom",
            //   label: "虚拟练习人数",
            // },
            // {
            //   prop: "countJoinTotal",
            //   label: "总练习人数",
            // },
            {
               prop: "recommend",
               label: "推荐",
               switch: true,
               fun: courseRecommend,
            },
            {
               prop: "recommendOrder",
               label: "推荐顺序",
               actives: [
                  {
                     name: (row, index) => (row.recommendOrder && row.recommendOrder != -1 ? row.recommendOrder : "未填写"),
                     method: (val) => {
                        this.dialogList[0].label = "修改推荐顺序值";
                        this.dialogList[0].code = "recommendOrder";
                        this.columnForm = {
                           recommendOrder: val.recommendOrder == -1 ? "" : val.recommendOrder,
                           id: val.id,
                        };
                        this.dialogFormVisible = { bl: true };
                     },
                  },
               ],
            },
            {
               prop: "practiceRecommend",
               label: "练习推荐",
               switch: true,
               fun: coursePractise,
            },

            {
               prop: "practiceRecommendOrder",
               label: "练习推荐顺序",

               actives: [
                  {
                     name: (row, index) => (row.practiceRecommendOrder && row.practiceRecommendOrder != -1 ? row.practiceRecommendOrder : "未填写"),
                     method: (val) => {
                        this.dialogList[0].label = "修改练习顺序值";
                        this.dialogList[0].code = "practiceRecommendOrder";
                        this.columnForm = {
                           practiceRecommendOrder: val.practiceRecommendOrder == -1 ? "" : val.practiceRecommendOrder,
                           id: val.id,
                        };
                        console.log(this.columnForm);
                        this.dialogFormVisible = { bl: true };
                     },
                  },
               ],
            },
            {
               prop: "enable",
               label: "启用/禁用",
               switch: true,
               fun: courseEnable,
            },
            {
               prop: "action",
               label: "操作",
               fixed: "right",
               actives: [
                  {
                     name: "详情",
                     method: (val) => {
                        this.$router.push({
                           path: "/content/course/detail",
                           query: { id: val.id },
                        });
                     },
                  },
                  {
                     name: "编辑",
                     method: (val) => {
                        console.log("======>>val", val);
                        this.$router.push({
                           path: "/content/course/add",
                           query: { id: val.id },
                        });
                     },
                  },
                  // {
                  //   name: '删除',
                  //   method: val => {
                  //     this.$confirm('是否删除！', '警告', {
                  //       confirmButtonText: '确定',
                  //       cancelButtonText: '取消',
                  //       type: 'warning'
                  //     }).then(() => {
                  //       deleteCourse({id:val.id}).then(res=>{
                  //         Message('删除成功')
                  //         this.$refs.TableList.reset();
                  //       })
                  //     })
                  //   },
                  // },
               ],
            },
         ],
      };
   },
   computed: {
      getList() {
         return listCourse;
      },
   },
   methods: {
      // 搜索查询
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.$refs.TableList.update({ ...data });
         }
         if (val.name == "add") {
            this.$router.push({
               path: "/content/course/add",
            });
         }
      },
      // 禁用状态切换
      bannedChange(item, code) {
         let data = { id: item.id, [code]: item[code] };

         if (code == "enable") {
            courseEnable(data).then((res) => {
               this.$message.success("操作成功");
               this.$refs.TableList.reset();
            });
         }
         if (code == "recommend") {
            courseRecommend(data).then((res) => {
               this.$message.success("操作成功");
               this.$refs.TableList.reset();
            });
         }
         if (code == "practiceRecommend") {
            coursePractise(data).then((res) => {
               this.$message.success("操作成功");
               this.$refs.TableList.reset();
            });
         }
         console.log(item, code);
      },
      prompt(res) {
         if (res.code == 200) {
            this.$message.success("修改成功");
            this.$refs.TableList.reset();
         } else {
            this.$message.error("修改失败");
         }
      },
      changePasswords(e) {
         let type = this.dialogList[0].code;
         if (type == "recommendOrder") {
            courseSort(e).then((res) => {
               this.prompt(res);
            });
         } else if (type == "practiceRecommendOrder") {
            courseSortPra(e).then((res) => {
               this.prompt(res);
            });
         }
      },
   },
};
</script>
<style lang="scss" scoped>
.commonPage {
   padding: 20px;
}
</style>
