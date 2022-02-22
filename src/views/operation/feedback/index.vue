<!--
 * @Author: tianhao
 * @Date: 2020-06-17 11:55:33
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-16 17:28:51
 * @Descripttion: 用户列表
-->
<template>
   <div class="userLists">
      <el-form :inline="true"
               :model="ruleForm"
               ref="ruleForm"
               class="demo-form-inline">
         <el-form-item label="发起人ID">
            <el-input placeholder="输入用户ID"
                      prefix-icon="el-icon-search"
                      v-model.trim="ruleForm.createUserId"
                      size="small"
                      @blur="blueText"></el-input>
         </el-form-item>
         <el-form-item label="发起人昵称">
            <el-input placeholder="输入用户昵称"
                      prefix-icon="el-icon-search"
                      v-model.trim="ruleForm.createUserName"
                      size="small"></el-input>
         </el-form-item>
         <el-form-item label="发起时间:">
            <el-date-picker @change="onChange"
                            v-model.trim="ruleForm.regDate"
                            type="daterange"
                            size="small"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['00:00:00', '23:59:59']"
                            value-format="timestamp"></el-date-picker>
         </el-form-item>
         <el-form-item label="状态">
            <el-select size="small"
                       v-model.trim="ruleForm.state">
               <el-option :label="'全部'"
                          :value="''"
                          selected="selected"></el-option>
               <el-option v-for="item in registeredSourceOptions"
                          :key="item.val"
                          :label="item.lab"
                          :value="item.val"></el-option>
            </el-select>
         </el-form-item>
         <el-form-item>
            <el-button type="primary"
                       size="small"
                       @click="onClickSearch($event, 'click')">查询</el-button>
            <el-button type="primary"
                       size="small"
                       @click="reset">重置</el-button>
         </el-form-item>
      </el-form>

      <Table refHead="ruleForm"
             :loadData="getList"
             :column="column"
             ref="userList"
             :showSortIndex="{ show: true, lable: '序号' }">
         <template v-slot:ideaUrlList="{ scope }">
            <div class="imgLayout">
               <el-image style="width: 130px; height: 80px; margin: 5px;"
                         :lazy="true"
                         v-for="(item, index) in scope.ideaUrlList"
                         :key="index"
                         :src="item"
                         :preview-src-list="scope.ideaUrlList"
                         fit="cover"></el-image>
            </div>
         </template>
      </Table>
      <!-- 新增/编辑 -->
      <el-dialog title="编辑回复"
                 :visible.sync="dialogVisible"
                 width="600px"
                 custom-class="dialog_content"
                 :close-on-click-modal="false">
         <el-input type="textarea"
                   placeholder="请输入内容"
                   v-model="ruleForm.reply"
                   maxlength="500"
                   show-word-limit
                   :autosize="{ minRows: 7 }"> </el-input>
         <span slot="footer"
               class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"
                       @click="handleOKUpdateState">
               确 定
            </el-button>
         </span>
      </el-dialog>
   </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
// 意见列表 意见回复
import { feedbackList, feedbackUpdate } from "@/api/operation";
import { Message, Switch } from "element-ui";
export default {
   components: {
      Table,
   },
   data() {
      return {
         registeredSourceOptions: [
            {
               lab: "已处理",
               val: 1,
            },
            {
               lab: "未处理",
               val: 0,
            },

         ],
         dialogVisible: false,
         reply: "",
         ruleForm: {
            createUserId: null, //发起人ID
            createUserName: null, //发起人名称
            starTime: null, //开始时间
            endTime: null, //截至时间
            reply: null, //回复内容
            id: null,
            state: ''
         },
         column: [
            { prop: "content", label: "意见内容", width: 350 },
            { prop: "ideaUrlList", label: "图片", render: true, width: 445 },
            { prop: "title", label: "意见标题", width: 120 },
            {
               prop: "createTime",
               label: "发起时间",
               width: 150,
               formatter: (row, column) => {
                  return parseTime(row.createTime);
               },
            },
            {
               prop: "createUserName", label: "发起人昵称", width: 100, actives: [
                  {
                     name: (val) => val.createUserName || "",
                     method: (val) => this.$router.push(`/operation/userDetail?userId=${val.createUserId}`),
                  },
               ],
            },
            { prop: "createUserId", label: "发起人ID" },
            {
               prop: "platform",
               label: "平台",
               width: 100,
               formatter: (row) => {
                  let _str = "";
                  switch (row.platform) {
                     case "iOS":
                        _str = "苹果手机";
                        break;
                     case "Android":
                        _str = "安卓手机";
                        break;
                     case "WechatMP":
                        _str = "微信小程序";
                        break;
                     case "iOS":
                        _str = "苹果手机";
                        break;
                     case "Store":
                        _str = "门店平台";
                        break;
                     case "Web":
                        _str = "浏览器";
                        break;
                     case "YQH5":
                        _str = "邀请注册用户";
                     case "NONE":
                        _str = "未知平台";
                        break;
                     default:
                        break;
                  }
                  return _str;
               },
            },
            { prop: "version", label: "版本记录 ", width: 80 },
            { prop: "reply", label: "回复内容 ", width: 350 },
            {
               prop: "state",
               label: "状态",
               formatter: (row, column) => {
                  let state;
                  switch (row.state) {
                     case 0:
                        state = "未处理";
                        break;
                     case 1:
                        state = "已处理";
                        break;
                     default:
                        break;
                  }
                  return state;
               },
            },
            {
               prop: "action",
               label: "操作",
               actives: [
                  {
                     name: (val) => {
                        return val.reply ? "修改回复" : "回复";
                     },
                     method: (val) => {
                        this.dialogVisible = true;
                        this.ruleForm.id = val.id;
                        this.ruleForm.reply = val.reply;
                        //判断页面进入是否有内容
                        this.reply = val.reply;
                     },
                  },
               ],
            },
         ],
      };
   },
   created() { },
   computed: {
      getList() {
         return feedbackList;
      },
   },
   methods: {
      blueText(e) {
         if (!/^[0-9]*$/.test(e.target.value)) {
            Message.warning("请输入数字ID");
            this.ruleForm.createUserId = "";
         }
      },
      //开始结束时间
      onChange(value) {
         if (value) {
            this.ruleForm.startTime = value[0];
            this.ruleForm.endTime = value[1];
         } else {
            this.ruleForm.startTime = null;
            this.ruleForm.endTime = null;
         }
      },
      //回车键搜索
      onClickSearch(e, type) {
         if (type == "click" || e.keyCode == 13) {
            //弹框里回复清空
            this.ruleForm.reply = null;
            this.$refs.userList.update(this.ruleForm);
         }
      },

      //编辑回复内容
      handleOKUpdateState() {
         let feedbackRequestDTO = {
            id: this.ruleForm.id,
            reply: this.ruleForm.reply,
         };
         //是否输入回复内容
         if (this.ruleForm.reply) {
            feedbackUpdate(feedbackRequestDTO).then((res) => {
               if (res.code == 200) {
                  this.dialogVisible = false;
                  Message({ message: "恭喜你，回复成功", type: "success" });
                  this.$refs.userList.update(this.ruleForm);
               }
            });
         } else {
            //清空回复内容
            if (this.ruleForm.reply !== this.reply) {
               Message({ message: "修改值不能为空", type: "info" });
               return;
            }
            Message({ message: "请输入内容", type: "info" });
            // setTimeout(() => {
            //   this.dialogVisible = false;
            // }, 600);
         }
      },
      //重置
      reset() {
         this.ruleForm = {
            createUserId: null, //发起人ID
            createUserName: null, //发起人名称
            starTime: null, //开始时间
            endTime: null, //截至时间
            reply: null, //回复内容
            state: ""
         };
         // this.$refs.userList.update(this.ruleForm);
      },
   },
   mounted() {
      //搜索的键盘事件
      const that = this;
      document.addEventListener("keydown", that.onClickSearch);
   },
};
</script>

<style>
.userLists {
   padding: 20px !important;
}
.imgLayout {
   display: flex;
   flex-wrap: wrap;
}
</style>
