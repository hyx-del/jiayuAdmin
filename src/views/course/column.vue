<template>
  <div class="commonPage">
    <el-button ref="topButon" type="primary" size="small" @click="addForm()">新加</el-button>
    <Table :loadData="getList" refHead="topButon" :column="column" :showSortIndex="{ show: true, lable: '序号' }" ref="TableList"></Table>
    <!-- 新增/编辑 -->
    <el-dialog :title="title" center :visible.sync="dialogFormVisible" v-if="dialogFormVisible" @close="resetForm('form')" width="600px" custom-class="role_dialog" :close-on-click-modal="false">
      <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton" />
    </el-dialog>
  </div>
</template>
<script>
/*
 * /content/course/column 瑜伽课程栏目
 * */
// import { regionData, CodeToText } from 'element-china-area-data';
import Table from "@/components/Table";
import { parseTime } from "@/utils";
import { Message } from "element-ui";

import formList from "@/components/FormList";
import { wikiColumnList, wikiColumnAdd, wikiColumnUpdate } from "@/api/wiki";
import { getScreenList } from "@/api/yogaManage";
import { addColumnCourse, courseColumnEnable, courseEnable, delColumnCourse, getColumnList, updateColumnCourse } from "@/api/course";
export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      title: "新加栏目",
      edit: true,
      dialogFormVisible: false,
      config: {
        hasLoading: true,
        inline: false,
        allRequired: true,
        buttonsArea: "popButtom",
        inputStyle: {
          width: "100%",
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "确定",
          },
          {
            funType: "reset",
            type: "primary",
            name: "取消",
          },
        ],
      },
      formObj: {},
      // 表单
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
          el: "checkbox",
          code: "difficultyLevel",
          label: "难度等级",
          required: false,
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
          el: "checkbox",
          code: "yogaEffects",
          label: "瑜伽功效",
          required: false,
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
          el: "checkbox",
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
      ],
      // 表头
      column: [
        // {
        //   prop: 'id',
        //   label: 'ID',
        // },
        {
          prop: "name",
          label: "栏目名称",
        },
        // {
        //   prop: 'searchName',
        //   label: '检索参数',
        //   width:"600"
        // },
        {
          prop: "sort",
          label: "顺序",
          formatter: (row, column) => row.sort || "未填写",
        },
        {
          prop: "enable",
          label: "启用/禁用",
          switch: true,
          fun: courseColumnEnable,
          callBack: (res) => {
            if (res.code == 200) {
              let { data } = res;
              data.advertisement ? this.confirm(data, data.advertisement, "message") : this.$message.success("打开成功");
            } else {
              this.$message.error("操作失败");
            }
          },
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          actives: [
            {
              name: "详情",
              method: (val) => {
                console.log(val);
                // this.formObj=val
                // this.edit=true
                // this.title='编辑'
                // this.dialogFormVisible=true
                this.$router.push({
                  path: "/content/course/columnDetail",
                  query: { id: val.id },
                });
              },
            },
            {
              name: "修改",
              method: (val) => {
                this.confirm(val, val.advertisement, "confirm");
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
            //       delColumnCourse({id:val.id}).then(res=>{
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
      return getColumnList;
    },
  },
  methods: {
    //练习广告 开屏广告，有关联提示
    confirm(val, value, type) {
      if (!value) return;
      //都没有
      let no = value.includes("0");
      let exercise = value.includes("1") ? "、练习广告" : "";
      let carry = value.includes("2") ? "、开屏广告" : "";
      if (type == "confirm") {
        let str = `此栏目已关联${exercise}${carry}，请酌情修改`;
        this.$confirm(no ? "确定修改吗？" : str, "提示", {
          type: "warning",
        }).then(() => {
          this.$router.push({
            path: "/content/course/columnAdd",
            query: { id: val.id },
          });
        });
        return;
      }
      if (type == "message") {
        let str = `有${exercise}${carry}关联了该栏目，请根据实际运营情况同步调整`;
        no ? this.$message.success("关闭成功") : this.$message.warning(str);
        return;
      }
    },
    // 新加栏目
    addForm() {
      // this.title='新加栏目'
      // this.edit=false
      // this.dialogFormVisible=true
      this.$router.push({
        path: "/content/course/columnAdd",
      });
    }, // 新加栏目
    resetForm() {
      this.$refs.formList.reset();
    },
    // 添加修改
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        if (this.edit) {
          updateColumnCourse(data).then((res) => {
            this.dialogFormVisible = false;
            this.$refs.TableList.update({});
          });
        } else {
          // 新加
          addColumnCourse(data).then((res) => {
            this.dialogFormVisible = false;
            this.$refs.TableList.update({});
          });
        }
      }
      if (val.name == "reset") {
        this.dialogFormVisible = false;
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
