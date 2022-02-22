<template>
   <div class="commonPage">
      <div class="formBody">
         <formList ref="formList"
                   :loading.sync="loading"
                   :formObj="formObj"
                   :config="config"
                   :list="list"
                   :searchObj="searchObj"
                   @searchVal="searchVal"
                   @button="formButton" />
         <el-form :model="ruleForm"
                  ref="ruleForm"
                  label-width="150px"
                  class="demo-ruleForm">
            <el-form-item label="标签"
                          prop="tags">
               <el-input style="width: 360px;"
                         v-model="ruleForm.tags"></el-input>
               <el-button type="primary"
                          @click="add">添加</el-button>
               <el-tag v-for="(tag, index) in tags"
                       :key="tag"
                       closable
                       @close="handleClose(tag, index)">
                  {{ tag }}
               </el-tag>
            </el-form-item>
         </el-form>
         <div style="text-align: center;">
            <el-button type="primary"
                       @click="resetForm">提交</el-button>
         </div>
      </div>
   </div>
</template>
<script>
import formList from "@/components/FormList/index";
import { getHeadmaster, getScreenList, getMeditation, updateHeadmaster } from "@/api/yogaManage";
import { Message } from "element-ui";

export default {
   components: {
      formList,
   },
   data() {
      return {
         edit: false,
         loading: false,
         searchObj: {
            list: [],
         },
         config: {
            buttons: [],
         },
         searchVal: "",
         ruleForm: {},
         tags: [],
         list: [
            {
               el: "img",
               code: "headerAvatarUrl",
               label: "校长头像",
               ratio: "1080/1080",
            },
            {
               el: "img",
               code: "wroteCoverUrl",
               label: "首页推荐寄语封面",
               ratio: "630/340",
            },
            {
               el: "img",
               code: "wroteVideoCoverUrl",
               label: "首页视频封面",
               ratio: "750/422",
            },
            {
               el: "video",
               code: "wroteVideoUrl",
               label: "校长寄语视频",
            },
            {
               code: "headerName",
               label: "校长名称",
               maxlength: 20,
            },
            {
               code: "virtualView",
               label: "虚拟浏览次数",
               type: "number",
            },
            {
               code: "viewNum",
               label: "真实浏览次数",
               type: "number",
               disabled: true,
               required: false,
            },
            {
               code: "countView",
               label: "总浏览次数",
               type: "number",
               disabled: true,
               required: false,
            },
            {
               code: "virtualPraise",
               label: "虚拟点赞次数",
               type: "number",
            },
            {
               code: "praiseNum",
               label: "真实点赞次数",
               type: "number",
               disabled: true,
               required: false,
            },
            {
               code: "countPraise",
               label: "总点赞次数",
               type: "number",
               disabled: true,
               required: false,
            },
            {
               el: "textArea",
               code: "describe",
               label: "简介",
               rows: 4,
               maxlength: 120,
            },
            {
               el: "searchTags",
               back: true,
               backType: "Array",
               code: "courses",
               label: "瑜伽课程",
               labelCode: "name",
               valueCode: "id",
               searchCode: "name",
               fun: getMeditation,
               funMode: 2,
               postData: {
                  type: 3,
                  name: '瑜伽',
               },
            },
            {
               el: "searchTags",
               back: true,
               backType: "Array",
               code: "meditations",
               label: "推荐冥想",
               labelCode: "name",
               valueCode: "id",
               searchCode: "name",
               fun: getMeditation,
               funMode: 2,
               postData: {
                  type: 1,
                  name: "冥想",
               },
            },
            {
               el: "searchTags",
               code: "jnanas",
               back: true,
               backType: "Array",
               label: "推荐智慧",
               labelCode: "name",
               valueCode: "id",
               searchCode: "name",
               fun: getMeditation,
               funMode: 2,
               postData: {
                  type: 2,
                  name: "智慧",
               },
            },

            // {
            //   el:'checkbox',
            //   back:true,
            //   backType:'Array',
            //   endVal:'all',
            //   code:'yogaSchools',
            //   label:'擅长瑜伽流派',
            //   required:true,
            //   labelCode:'name',
            //   valueCode:'id',
            //   fun:getScreenList,
            //   funMode:2,
            //   postData:{
            //     id:1
            //   }
            // },
            // {
            //   el:'checkbox',
            //   code:'yogaEffects',
            //   label:'擅长瑜伽功效',
            //   back:true,
            //   backType:'Array',
            //   endVal:'all',
            //   labelCode:'name',
            //   valueCode:'id',
            //   fun:getScreenList,
            //   funMode:2,
            //   postData:{
            //     id:2,
            //     name:'瑜伽功效'
            //   },
            // },
            // {
            //   el:'textArea',
            //   code:'introduce',
            //   label:'个人介绍',
            //   rows:4,
            //   maxlength: 120,
            // },
            {
               el: "img",
               code: "introduce",
               label: "个人介绍",
               limit: 10,
               ImgType: ["png", "jpg", "jpeg", "gif"],
               size: 500,
               ratio: "750/750",
            },
            {
               el: "img",
               code: "search",
               label: "搜索引导图",
               ImgType: ["png", "jpg", "jpeg", "gif"],
               size: 500,
               ratio: "690/180",
            },
         ],
         tableIndex: -1,
         id: "",
         formObj: {},
      };
   },
  created (){
      this.getData();
   },
   mounted() {
      // this.getData();
   },
   computed: {},
   methods: {
      add() {
         if (this.tags.indexOf(this.ruleForm.tags) !== -1) return this.$message.error("此标签已存在");
         this.tags.push(this.ruleForm.tags);
         this.ruleForm.tags = "";
      },
      handleClose(val, index) {
         this.tags.splice(index, 1);
      },
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            updateHeadmaster({ ...val.value, tags: this.tags }).then((res) => {
               const { code } = res;
               if (code == 200) {
                  this.$message.success("操作成功");
                  this.getData();
               }
            });
         }
      },
      resetForm() {
         if (!this.tags.length) return this.$message.error("请输入标签");
         this.$refs.formList.confirm();
      },
      getData() {
         getHeadmaster().then((res) => {
            const { data } = res;
            data.meditations = data.meditations.map((item) => {
               item.value = item.id;
               item.label = item.name;
               return item;
            });
            data.jnanas = data.jnanas.map((item) => {
               item.value = item.id;
               item.label = item.name;
               return item;
            });
            this.tags = data.tags;
            // data.yogaEffects = data.yogaEffects.map(item=> Number(item.id))
            // data.yogaSchools = data.yogaSchools.map(item => Number(item.id))
            this.formObj = data;
         });
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
</style>
