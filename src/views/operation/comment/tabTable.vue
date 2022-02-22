<!--
 * @Author: tianhao
 * @Date: 2020-06-16 15:22:52
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-10 15:34:32
 * @Descripttion:
-->
<template>
  <div class="waitDelivered">
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item :label="nameArr[tabId].title">
        <el-input placeholder="输入标题" size="small" prefix-icon="el-icon-search" v-model.trim="formInline.sourceName"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input placeholder="输入昵称" size="small" prefix-icon="el-icon-search" v-model.trim="formInline.userName" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input placeholder="输入关键词" size="small" prefix-icon="el-icon-search" v-model.trim="formInline.content" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <el-button type="danger" size="small" @click="deleteTable">批量删除</el-button>
      </el-form-item>
    </el-form>
    <Table :select="tableSelect" :showSortIndex="{ show: true, lable: '序号' }" :loadData="getList" refHead="formInline" additional="120" :column="column" style="width: 100%;" ref="refsCommonList" :params="{ tabId: tabId }" />
    <!--关联数据弹窗-->
    <el-dialog :title="title" @close="roleDialogClose" center :visible.sync="popShow" v-if="popShow" width="800px" custom-class="role_dialog" :close-on-click-modal="false">
      <Table :showSortIndex="{ show: true, lable: '序号' }" :loadData="getListPop" :headHight="500" additional="120" :column="columnPop" style="width: 100%;" ref="refsCommonListPop" :params="{ tabId: tabId, id: userId }" />
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import {
  getUserComments,
  delUserComments,
  getReplylist,
  UserCommentsTopping,
  adminUserCommentBatchDelete
} from "@/api/operation";

export default {
  components: {
    Table,
  },
  props: {
    tabId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title: "评论内容",
      popShow: false,
      userId: "",
      nameArr: {
        1: {
          title: "瑜伽标题",
        },
        3: {
          title: "冥想标题",
        },
        4: {
          title: "幸福智慧标题",
        },
      },
      formInline: {},
      selectList:[],
      column: [
        { prop: "sourceName", label: "瑜伽标题" },
        { prop: "content", label: "评论内容", width: 400 },
        {
          prop: "userName",
          label: "评论人",
          actives: [
            {
              name: (val) => val.userName || "",
              method: (val) => this.$router.push(`/operation/userDetail?userId=${val.userId}`),
            },
          ],
        },
        { prop: "createTime", label: "评论时间" },
        { prop: "updateTime", label: "最后更新时间" },
        { prop: "praiseCount", label: "被点赞次数" },
        {
          prop: "replyCount",
          label: "被回复次数",
          actives: [
            {
              name: (val) => val.replyCount || "0",
              method: (val) => {
                this.popShow = true;
                this.userId = val.id;
              },
            },
          ],
        },

        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 80,
          actives: [
            {
              name: (val) => {
                //0:代表未置顶    1：代表已经置顶
                return val.topping ? "撤销置顶" : "置顶";
              },
              method: (val) => {
                let operation = val.topping ? 0 : 1;
                UserCommentsTopping({ id: val.id, operation: operation }).then((res) => {
                  if (res.code == 200) {
                    this.$message({
                      type: "success",
                      message: val.topping ? "撤销置顶成功" : "置顶成功",
                    });
                    // 刷新数据
                    this.$refs.refsCommonList.update({ ...this.formInline });
                  }
                });
              },
            },
            {
              name: "删除",
              method: (val) => {
                this.$confirm("是否确认删除?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    delUserComments({ id: val.id }).then((res) => {
                      if (res.code == 200) {
                        this.$message({
                          type: "success",
                          message: "删除成功!",
                        });
                        // 刷新数据
                        this.$refs.refsCommonList.update({ ...this.formInline });
                      }
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除",
                    });
                  });
              },
            },
          ],
        },
      ],
      columnPop: [
        { prop: "content", label: "评论内容", width: 400 },
        {
          prop: "userName",
          label: "评论人",
          actives: [
            {
              name: (val) => val.userName || "",
              method: (val) => this.$router.push(`/operation/userDetail?userId=${val.userId}`),
            },
          ],
        },
        { prop: "createTime", label: "评论时间" },
        // {
        //   prop: 'reply',
        //   label: '被回复次数',
        //   actives: [
        //     {
        //       name: (val)=>val.reply||'0',
        //       method: val => {
        //         console.log(val)
        //         getReplylist()
        //       },
        //     },
        //   ],
        // },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 80,
          actives: [
            {
              name: "删除",
              method: (val) => {
                this.$confirm("是否确认删除?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    delUserComments({ id: val.id }).then((res) => {
                      if (res.code == 200) {
                        this.$message({
                          type: "success",
                          message: "删除成功!",
                        });
                        // 刷新数据
                        this.$refs.refsCommonListPop.reset();
                      }
                    });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除",
                    });
                  });
              },
            },
          ],
        },
      ],
    };
  },
  mounted() {},
  created() {
    this.column[0].label = this.nameArr[this.tabId].title;
  },
  computed: {
    getListPop() {
      return getReplylist;
    },
  },
  methods: {
    // 关闭弹窗
    roleDialogClose() {
      console.log(this.$refs);
      this.$refs.refsCommonList.reset();
    },
    getList(par) {
      return getUserComments(par);
    },
    tableSelect(val) {
      this.selectList=val
    },
    reset() {
      this.$refs.refsCommonList.reset();
    },
    // 查询
    search() {
      this.$refs.refsCommonList.update({ ...this.formInline });
    },
    // 删除
    deleteTable() {
      if (this.selectList.length>0) {
        this.$confirm('是否删除这些评论?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let idList=this.selectList.map(v=>Number(v.id))
          adminUserCommentBatchDelete(idList).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.selectList=[]
            this.$refs.refsCommonList.update({});
          })
        })
      }else{
        this.$message({
          type: 'error',
          message: '请选择数据!'
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("~@/styles/common.scss");

.exportBtn {
  display: inline;
  margin-left: 8px;
}
p {
  margin: 0;
}
.el-form--label-top .el-form-item__label {
  padding: 0;
}
.upload-demo {
  margin-left: 10px;
}
.newUploadForm {
  text-align: center;
}
.sendExpressForm {
  p {
    margin: 0;
  }
  .el-form-item__label {
    line-height: unset;
  }
}
.refundForm {
  p {
    margin: 0;
  }
}
.gotoPage {
  color: blue;
}
.gotoPage:hover {
  color: red;
}
</style>
