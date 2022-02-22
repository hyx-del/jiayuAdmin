<template>
   <div class="commonPage">
      <el-button class="cancelTop"
                 size="small"
                 type="danger"
                 @click="cancel">
         返回到列表
      </el-button>
      <el-steps :active="active"
                :space="400"
                align-center>
         <el-step title="填写购买信息"></el-step>
         <el-step title="填写课程信息"></el-step>
         <el-step title="添加小节信息"></el-step>
      </el-steps>
      <div class="formBody"
           v-show="active == 1">
         <formList ref="formList"
                   :config="config"
                   :formObj="formObj"
                   :list="list"
                   @button="formButton"
                   @formChange="formChange">
            <template #totalMonth>
               <div class="totalMonth">{{ totalYear }}</div>
            </template>
         </formList>
      </div>
      <div class="formBody"
           v-show="active == 2">
         <formList ref="formList2"
                   :config="config2"
                   :formObj="formObj2"
                   :list="list2"
                   @button="formButton2" />
      </div>
      <div class="formBody"
           v-show="active == 3">
         <el-button class="topBut"
                    size="small"
                    type="primary"
                    @click="addNode">
            添加节次
         </el-button>
         <simpleTable :style="{ height: 'calc(100vh - 300px)' }"
                      @buttons="buttonsTable"
                      :table-data="tableData"
                      :table-label="tableLabel"
                      :table-option="tableOption" />
         <v-dialog title="修改顺序值"
                   :model="columnForm"
                   :visible="dialogSort"
                   :list="dialogList"
                   @submit="changePasswords"
                   v-if="dialogSort.bl"></v-dialog>
         <div class="bottonBut">
            <el-button class="topBut"
                       size="small"
                       type="primary"
                       @click="steps(-1)">
               上一步
            </el-button>
            <el-button :loading="loading"
                       class="topBut"
                       size="small"
                       type="primary"
                       @click="saveCourse">
               保存
            </el-button>
         </div>
      </div>
      <!-- 新增/编辑门店模态窗 -->
      <el-dialog :title="title"
                 center
                 :visible.sync="dialogFormVisible"
                 v-if="dialogFormVisible"
                 width="650px"
                 custom-class="role_dialog"
                 :close-on-click-modal="false">
         <formList ref="formListPop"
                   :config="configPop"
                   :formObj="formObjPop"
                   :list="listPop"
                   @button="formButtonPop" />
      </el-dialog>
   </div>
</template>
<script>
/* course/add 添加课程和修改课程 Course
 * */
import formList from "@/components/FormList/index";
import simpleTable from "@/components/simpleTable/index";
import { Message } from "element-ui";

import { addCourse, getCourse, updateCourse } from "@/api/course";
import { getAssistantList, getCoachesList } from "@/api/coach";
import { getScreenList } from "@/api/yogaManage";
import { buyList } from "@/utils/systemEnum";
import { getSomeKey } from "@/utils";
import vDialog from '@/components/dialog/index.vue';
import { tableSort } from '@/utils/index';
let purchaseIllustration = {
   el: "textArea",
   code: "purchaseIllustration",
   label: "购买说明",
};
let endArr = [
   {
      el: "radio",
      code: "effectiveTimeType",
      label: "有效时长",
      list: [
         {
            label: "有限时长",
            value: 0,
         },
         {
            label: "永久有效",
            value: 1,
         },
      ],
   },
   purchaseIllustration,
];
export default {
   components: {
      formList,
      simpleTable,
      vDialog
   },
   data() {
      return {
         // 累计多少年
         totalYear: "",
         postData: {},
         title: "添加节次",
         dialogFormVisible: false,
         columnForm: {},
         dialogSort: { bl: false },
         dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number" }],
         tableDataIndex: null,
         tableData: [],
         tableLabel: [
            { label: "节次名称", param: "name", align: "center", sortable: true },
            {
               label: "封面",
               param: "coverUrl",
               align: "center",
               render: (val) => ` <image style="width:auto; height: 100px" src="${val.coverUrl}" :fit="fit"></image>`,
            },
            // { label: '视频地址', param: 'resourceUrl', align: 'center' },
            {
               label: "时长（秒）",
               param: "time",
               align: "center",
               render: (val) => (val.time ? val.time + "s" : "待查询"),
            },
            {
               label: "顺序值",
               param: "sort",
               align: "center",
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val, index) => {
                        this.columnForm.sort = val.sort;
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
               {
                  label: "编辑",
                  type: "primary",
                  icon: "el-icon-edit-outline",
                  methods: "edit",
               },
            ],
         },
         active: 1,
         loading: false,
         edit: false,
         payTypeLen: 0,
         list: [
            {
               el: "radio",
               code: "durationType",
               label: "课程类型",
               list: [
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
                     value: 3,
                  },
               ],
            },
            {
               el: "select",
               code: "courseDuration",
               label: "课程时长",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 6,
               },
            },
            {
               el: "radio",
               code: "courseType",
               label: "练习方式",
               list: [
                  {
                     label: "普通课程",
                     value: 1,
                  },
                  {
                     label: "特殊课程",
                     value: 2,
                     disabled: true,
                  },
               ],
            },
            {
               el: "select",
               code: "payType",
               label: "付费方式",
               list: buyList,
            },
            ...endArr,
         ],
         list2: [
            {
               code: "name",
               label: "课程名称",
               maxlength: 30,
            },
            {
               el: "img",
               code: "coverUrl",
               label: "课程列表封面",
               ratio: "690/336",
            },
            // {
            //   el: "video",
            //   code: "previewUrl",
            //   label: "预览视频",
            //   required: false,
            // },
            {
               el: "img",
               code: "previewCoverUrl",
               label: "课程详情封面",
               ratio: "750/508",
            },
            {
               code: "recommendOrder",
               label: "推荐顺序",
               type: "number",
               maxlength: 20,
               required: false,
            },
            {
               code: "practiceRecommendOrder",
               label: "练习推荐顺序",
               type: "number",
               maxlength: 20,
               required: false,
            },
            {
               code: "joinTotalRandom",
               label: "虚拟练习人数",
               type: "number",
               maxlength: 20,
               required: false,
            },

            {
               el: "searchTags",
               code: "coaches",
               label: "关联教练",
               labelCode: "name",
               valueCode: "id",
               searchCode: "name",
               fun: getCoachesList,
            },
            {
               el: "searchTags",
               code: "assistants",
               label: "关联助教",
               required: false,
               labelCode: "name",
               valueCode: "id",
               searchCode: "cotch",
               fun: getAssistantList,
            },
            {
               el: "radio",
               back: true,
               code: "yogaCategorys",
               label: "瑜伽流派",
               required: false,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 1,
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
            {
               el: "select",
               code: "practiceRate",
               label: "建议练习频次",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 5,
                  name: "练习频次",
               },
            },
            {
               el: "checkbox",
               code: "suitableCrowd",
               label: "适合人群",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 4,
                  name: "适用人群",
               },
               required: false,
            },
            {
               el: "checkbox",
               code: "yogaEffects",
               label: "练习功效",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getScreenList,
               funMode: 2,
               postData: {
                  id: 2,
                  name: "瑜伽功效",
               },
               required: false,
            },
            {
               el: "img",
               code: "introduceUrl",
               label: "课程介绍",
               limit: 10,
               ImgType: ["png", "jpg", "jpeg", "gif"],
               size: 1024,
            },
         ],
         listPop: [
            {
               code: "name",
               label: "课程名称",
               maxlength: 20,
            },
            {
               el: "img",
               code: "coverUrl",
               label: "封面",
               ratio: "690/220",
            },
            {
               code: "aliVideoId",
               label: "视频ID",
            },
         ],
         formObj: {
            //练习方式
            courseType: 1,
            //课程类型
            durationType: 1,
            purchaseIllustration: "你将购买的商品为虚拟内容服务，购买后不支持退订、转让、退换，请斟酌确认。                                                       购买记录可在「我的-订单」 中查看"
         },
         formObj2: {},
         formObjPop: {},
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
                  name: "下一步，添加课程信息",
               },
            ],
         },
         config2: {
            buttonsArea: "popButtom",
            inline: false,
            mainStyle: {
               width: "80%",
               marginLeft: "10%",
            },
            buttons: [
               {
                  funType: "none",
                  type: "none",
                  name: "上一步",
               },
               {
                  funType: "confirm",
                  type: "primary",
                  name: "下一步,添加小节信息",
               },
            ],
         },
         configPop: {
            buttonsArea: "popButtom",
            inline: false,
            mainStyle: {},
            size: "mini",
            inputStyle: {
               width: "200px",
            },
            buttons: [
               {
                  funType: "confirm",
                  type: "primary",
                  name: "确定",
               },
               {
                  funType: "cancle",
                  type: "primary",
                  name: "取消",
                  size: "small",
               },
            ],
         },
         tableIndex: -1,
         id: "",
      };
   },
   mounted() {
      if (this.$route.query.id) {
         this.edit = true;
         this.id = this.$route.query.id;
         getCourse({ id: this.$route.query.id }).then((res) => {
            let formData = res.data.course;
            //单独获取表单1的值
            let formData1 = getSomeKey(formData, ["durationType", "tips", "courseDuration", "courseType", "payType", "effectiveTimeType", "effectiveTime", "purchaseIllustration", "scorePrice", "cashPrice", "applePurchaseId"]);
            formData.recommendOrder = formData.recommendOrder && formData.recommendOrder != -1 ? formData.recommendOrder : "";
            formData.practiceRecommendOrder = formData.practiceRecommendOrder && formData.practiceRecommendOrder != -1 ? formData.practiceRecommendOrder : "";
            this.formObj = { ...formData1 };
            this.formObj2 = { ...formData };
            this.tableData = res.data.courseNodes;
            let changeArr = ["durationType", "courseType", "payType", "effectiveTimeType", "effectiveTime"];
            changeArr.forEach((key) => {
               this.formChange({ code: key, value: this.formObj[key] }, { value: this.formObj[key] });
            });
         });
      }
   },
   computed: {},
   methods: {
      //课程类型change事件主题专题只有普通课程 特殊课程有温馨提示
      formChange(val, it) {
         this.formObj[val.code] = val.value;
         let tipss = {
            el: "textArea",
            code: "tips",
            label: "温馨提示",
            rows: 4,
            maxlength: 120,
         };
         //点击课程
         if (val.code == "durationType") {
            let courseType = this.list.find((item) => item.code == "courseType");
            if (it.value == 3) {
               courseType.list[1].disabled = false;
            } else {
               let courseTypes = { ...this.formObj };
               courseTypes.courseType = 1;
               courseTypes.durationType = it.value;
               this.formObj = courseTypes;
               courseType.list[1].disabled = true;
               let list = [...this.list];
               let tips = list.find((item) => item.code == "tips");
               if (this.formObj.courseType == 1) {
                  if (tips) {
                     let tipsValue = { ...this.formObj };
                     this.formObj.tips = tipsValue.tips;
                     list.splice(3, 1);
                  }
               } else {
                  if (!tips) {
                     list.splice(3, 0, tipss);
                  }
               }
               this.list = list;
            }
         }
         //点击练习方式
         if (val.code == "courseType") {
            let list = [...this.list];
            let tips = list.find((item) => item.code == "tips");
            if (it.value == 1) {
               if (tips) {
                  let tipsValue = { ...this.formObj };
                  tipsValue.durationType = 3;
                  tipsValue.courseType = it.value;
                  this.formObj = tipsValue;
                  list.splice(3, 1);
               }
            } else {
               if (!tips) {
                  list.splice(3, 0, tipss);
               }
            }
            this.list = list;
         }
         //付费方式

         let effectiveTime = {
            code: "effectiveTime",
            label: "有效月数",
            type: "number",
            lessCode: 0,
            suffix: "月",
            afterSlot: "totalMonth",
            buttonTips: "有效时长按月计算，用户自购买当日起开始计算有效时长",
         };
         if (val.code == "payType") {
            /**effectiveTimeType */
            // 付费方式产生的长度
            let payTypeVal = this.formObj.payType;
            let list = [...this.list];
            let index = this.formObj.courseType == 2 ? 5 : 4;
            let scorePrice = {
               code: "scorePrice",
               label: "积分价格",
               type: "number",
            };
            let cashPrice = {
               code: "cashPrice",
               label: "现金价格",
               type: "numberPoint3",
               lessCode: 0
            };
            let applePurchaseId = {
               code: "applePurchaseId",
               label: "苹果内购ID",
            };
            list.splice(index, this.payTypeLen);
            let effectiveTimeType = list.find((item) => item.code == "effectiveTimeType");
            let effectiveTimeIndex = list.findIndex((item) => item.code == "effectiveTime");
            let effectiveTimeTypeList = { ...this.formObj };
            if (val.value == 0) {
               effectiveTimeTypeList.effectiveTimeType = 1;
               this.formObj = effectiveTimeTypeList;
               effectiveTimeType.list[0].disabled = true;
               if (effectiveTimeIndex != -1) {
                  list.splice(effectiveTimeIndex, 0);
               }
            } else {
              effectiveTimeTypeList.effectiveTimeType = effectiveTimeTypeList.effectiveTimeType || 0;
              this.formObj = effectiveTimeTypeList;
               effectiveTimeType.list[0].disabled = false;
               if (effectiveTimeIndex == -1) {
                  list.splice(index + 1, 0, effectiveTime);
               }
            }
            if (val.value == 1) {
               list.splice(index, 0, scorePrice);
            }
            if (val.value == 2) {
               list.splice(index, 0, scorePrice, cashPrice, applePurchaseId);
            }
            this.list = [...list];
            this.payTypeLen = payTypeVal == 0 ? 0 : payTypeVal == 1 ? 1 : 3;
         }
         if (val.code == "effectiveTimeType") {
            let list = [...this.list];
            if (val.value == 0 && list[list.length - 2].code != "effectiveTime") {
               list.splice(list.length - 1, 0, effectiveTime);
            }
            if (val.value == 1 && list[list.length - 2].code == "effectiveTime") {
               list.splice(list.length - 2, 1);
            }
            this.list = [...list];
         }
         if (val.code == "effectiveTime") {
            this.totalYear = val.value > 0 ? `共计 ${Math.floor(val.value / 12)}年${val.value % 12 == 0 ? "" : (val.value % 12) + "个月"}` : "";
         }
      },
      isAdd() {
         return this.tableIndex == -1;
      },
      // 取消,返回到列表
      cancel() {
         this.$confirm("是否返回到列表?确定将放弃编辑内容！", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
         }).then(() => {
            this.$router.push({
               path: "/content/course/index",
            });
         });
      },
      // 步进
      steps(num) {
         this.active += num;
      },
      // 保存课程
      saveCourse() {
         if (this.tableData.length > 0) {
            this.loading = true;
            let data = { ...this.postData, ...{ list: this.tableData } };
            console.log(data);
            data.recommendOrder = data.recommendOrder || -1;
            data.practiceRecommendOrder = data.practiceRecommendOrder || -1;
            if (this.edit) {
               data.id = this.id;
               updateCourse(data)
                  .then((res) => {
                     this.loading = false;
                     this.$router.push({
                        path: "/content/course/index",
                     });
                  })
                  .finally(() => {
                     this.loading = false;
                  });
            } else {
               addCourse(data)
                  .then((res) => {
                     this.$router.push({
                        path: "/content/course/index",
                     });
                  })
                  .finally(() => {
                     this.loading = false;
                  });
            }
         } else {
            Message.error("请添加节次");
         }
      },
      // 添加课程节点
      addNode() {
         this.dialogFormVisible = true;
         this.title = "编辑节点课程";
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
            this.dialogFormVisible = true;
         }
      },
      // 填写课程信息的表单按钮
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            if (data.courseType == 1) {
               data.tips = "";
            }
            this.formObj = { ...data };
            this.steps(1);
         }
      },
      formButton2(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            if (data.courseType == 1) {
               data.tips = "";
            }
            this.postData = { ...this.postData, ...data, ...this.formObj };
            this.steps(1);
         }
         if (val.text == "上一步") {
            this.steps(-1);
         }
      },
      // 添加或编辑课程节点
      formButtonPop(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            data.time = data.resourceUrl_time ? data.resourceUrl_time : data.time;
            data.sort = null;
            if (this.isAdd(this.tableIndex)) {
               this.tableData.push(data);
            } else {
               this.tableData.splice(this.tableIndex, 1, data);
            }
         }
         this.formObjPop = {};
         this.dialogFormVisible = false;
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
.totalMonth {
   position: absolute;
   top: 0;
   left: 368px;
}
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
</style>
