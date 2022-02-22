<!--
 * @Author: jiu yin
 * @Date: 2021-11-15 15:05:29
 * @LastEditTime: 2021-12-07 15:13:58
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\operation\comment\sensitiveType\index.vue
 * jiu
-->
<template>
   <div class="commonPage">
      <el-button type="primary"
                 @click="add">添加</el-button>
      <Table :loadData="getList"
             refHead="formList"
             :column="column"
             ref="TableList"
             :showSortIndex="{ show: true, lable: '序号' }"></Table>
      <v-dialog :title="isAdd ? '添加敏感词类型' : '编辑敏感词类型'"
                :model="columnForm"
                :visible="dialogFormVisible"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogFormVisible.bl"></v-dialog>
   </div>
</template>
<script>
import Table from "@/components/Table/index";
import { sensitiveTypeList, sensitiveTypeDelete, sensitiveTypeEdit, sensitiveTypeAdd } from '@/api/operation';
import vDialog from "@/components/dialog/index.vue";

export default {
   components: {
      Table,
      vDialog,
   },
   data() {
      return {
         columnForm: {},
         dialogFormVisible: { bl: false },
         dialogList: [{ label: "类型", code: "sensitiveWordsType", width: "47px" ,maxLength:20}],
         isAdd: true,
         // 表头
         column: [
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
                        this.columnForm = { sensitiveWordsType: val.sensitiveWordsType, id: val.id };
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
                           sensitiveTypeDelete({ id: val.id }).then((res) => {
                              if (res.code == 200) {
                                 this.$message({
                                    type: "success",
                                    message: "删除成功！",
                                 });
                                 this.$refs.TableList.update();
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
         return sensitiveTypeList;
      },
   },
   created() { },
   methods: {
      add() {
         this.columnForm={}
         this.dialogFormVisible.bl = true;
         this.isAdd = true;
      },

      diaLog(e, api) {
         api(e).then((res) => {
            res.code == 200 ? this.$message.success("修改成功") : this.$message.error("修改失败");
            this.$refs.TableList.reset();
         });
      },
      // 修改
      changePasswords(e) {
         console.log(e);
         this.isAdd ?
            this.diaLog(e, sensitiveTypeAdd) :
            this.diaLog(e, sensitiveTypeEdit);
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
