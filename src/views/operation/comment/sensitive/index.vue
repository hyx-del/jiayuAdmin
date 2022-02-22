<!--
 * @Author: jiu yin
 * @Date: 2021-11-15 15:05:29
 * @LastEditTime: 2021-12-07 15:12:44
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\operation\comment\sensitive\index.vue
 * jiu
-->
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
      <v-dialog :title="isAdd ? '添加敏感词' : '编辑敏感词'"
                :model="columnForm"
                :visible="dialogFormVisible"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogFormVisible.bl"></v-dialog>
   </div>
</template>
<script>
import Table from "@/components/Table/index";
import formList from "@/components/FormList";
import { sensitiveList, sensitiveDelete, sensitiveEdit, sensitiveAdd ,sensitiveListSelete} from '@/api/operation';

import vDialog from "@/components/dialog/index.vue";

export default {
   components: {
      Table,
      formList,
      vDialog,
   },
   data() {
      return {
         columnForm: {},
         dialogFormVisible: { bl: false },
         dialogList: [
            { el: "select", label: "类型", code: "sensitiveTypeId", options: sensitiveListSelete, required: true, width: "60px" },
            { label: "敏感词", code: "sensitiveWords", width: "60px" ,maxLength:100},
         ],
         isAdd: true,
         config: {
            hasLoading: false,
            inline: true,
            allRequired: false,
            size: "mini",
            colon: "", // label后的冒号，可以替换成其他的
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
                  funType: "grant",
                  type: "primary",
                  name: "添加",
               },
            ],
         },
         list: [
            {
               code: "sensitiveWords",
               placeholder: "敏感词",
               label: "敏感词",
               icon: "el-icon-zoom-in",
            },
            {
               el: "select",
               code: "sensitiveTypeId",
               label: "类型",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: sensitiveListSelete,
               funMode: 2,
            },
         ],
         // 表头
         column: [
            {
               prop: "sensitiveWords",
               label: "敏感词",
            },
            {
               prop: "sensitiveWordsType",
               label: "类型",
            },
            {
               prop: "action",
               label: "操作",
               fixed: "right",
               width: 140,
               actives: [
                  {
                     name: "修改",
                     method: (val) => {
                        this.columnForm = { sensitiveTypeId: val.sensitiveTypeId, id: val.id ,sensitiveWords:val.sensitiveWords};
                        this.isAdd = false;
                        this.dialogFormVisible = { bl: true };
                     },
                  },
                  {
                     name: "删除",
                     method: (val) => {
                        this.$confirm("确定删除?", "提示", {
                           type: "warning",
                        }).then(() => {
                           sensitiveDelete({ id: val.id }).then((res) => {
                              if (res.code == 200) {
                                 this.$message({
                                    type: "success",
                                    message: "删除成功！",
                                 });
                                 this.$refs.TableList.update({ ...this.formObjUp });
                              }
                           });
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
         return sensitiveList;
      },
   },
   created() { },
   methods: {
      // 搜索查询
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            this.formObjUp = data;
            this.$refs.TableList.update({ ...data });
         }
         if (val.name == "grant") {
            this.formObjUp={}
            this.isAdd = true;
            this.dialogFormVisible = { bl: true };
         }
      },
      diaLog(e, api) {
         api(e).then((res) => {
            res.code == 200 ? this.$message.success("修改成功") : this.$message.error("修改失败");
            this.$refs.TableList.reset();
         });
      },
      // 修改
      changePasswords(e) {
         this.isAdd ?
            this.diaLog(e, sensitiveAdd) :
            this.diaLog(e, sensitiveEdit);
      },
   },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.hint {
   text-indent: 112px;
   display: inline-block;
   color: red;
}
</style>
