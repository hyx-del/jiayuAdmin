<!--
 * @Author: tianhao
 * @Date: 2020-06-17 11:55:33
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-08-24 15:43:18
 * @Descripttion: 用户列表
-->
<template>
  <div class="userList">
    <el-button type="primary" @click="InviteRules" size="mini">邀请规则</el-button>
    <el-dialog title="邀请规则" :visible.sync="dialogVisible" width="600px" custom-class="dialog_content" :close-on-click-modal="false">
      <el-input type="textarea" placeholder="" v-model="ruleForm.rule" maxlength="500" show-word-limit :autosize="{ minRows: 7 }" resize="none" autofocus> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleOKUpdateState">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
      <el-form-item prop="phone" label="邀请人手机：">
        <el-input placeholder="邀请人手机号码" prefix-icon="el-icon-search" v-model.number="ruleForm.phone" size="small" autocomplete @input="blueText" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="好友注册时间:">
        <el-date-picker @change="onChange" v-model.trim="ruleForm.regDate" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-form-item label="积分发放状态">
        <el-select size="small" v-model.trim="ruleForm.grantState">
          <el-option :label="'全部'" :value="''" selected="selected" ></el-option>
          <el-option v-for="item in registeredSourceOptions" :key="item.val" :label="item.lab" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onClickSearch($event,'click')">搜索</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <Table refHead="ruleForm" :loadData="getList" :column="column" ref="userList" :showSortIndex="{ show: true, lable: '序号' }"> </Table>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
//获取邀请记录，邀请规则
import { inviteList, inviRule, inviRuleUpdate } from "@/api/operation";
import { Message } from "element-ui";
export default {
  components: {
    Table,
  },
  data() {
    return {
      registeredSourceOptions: [
        {
          lab: "未发放",
          val: 0,
        },
        {
          lab: "已发放",
          val: 1,
        },
        {
          lab: "邀请无效",
          val: 2,
        },
      ],
      dialogVisible: false,
      userItemForm: { banOperate: [] },
      ruleForm: {
        phone: null, //邀请人手机号
        grantState: "", //积分发放状态
        starTime: null, //开始时间
        endTime: null, //截至时间
        rule: "", //邀请规则
      },
      column: [
        { prop: "nickname", label: "邀请人昵称" },
        { prop: "phone", label: "邀请人手机号" },
        { prop: "inviteNickname", label: "好友昵称" },
        { prop: "invitePhone", label: "好友手机" },
        {
          prop: "createTime",
          label: "好友注册时间",
          formatter: (row, column) => {
            return parseTime(row.createTime);
          },
        },
        { prop: "inviteRegistIp", label: "好友注册IP" },
        {
          prop: "grantState",
          label: "积分发放状态",
          formatter: (row, column) => {
            let state;
            switch (row.grantState) {
              case 0:
                state = "未发放";
                break;
              case 1:
                state = "已发放";
                break;
              case 2:
                state = "邀请无效";
                break;
              default:
                break;
            }
            return state;
          },
        },
        { prop: "score", label: "邀请积分" },
        {
          prop: "grantTime",
          label: "积分发放时间",
          formatter: (row, column) => {
            return parseTime(row.grantTime);
          },
        },
      ],
    };
  },
  created() {},
  computed: {
    getList() {
      return inviteList;
    },
  },
  methods: {
    //手机正则
    blueText() {
      if (!/^\d{0,11}$/.test(this.ruleForm.phone)) {
        Message.warning("请输入正确手机号");
        this.ruleForm.phone = "";
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
    onClickSearch(e,type) {
      console.log(e);
      if (type == "click" || e.keyCode == 13) {
        this.$refs.userList.update(this.ruleForm);
      }
    },
    //邀请规则
    InviteRules() {
      this.dialogVisible = true;
      inviRule().then((res) => {
        if (res.code == 200) {
          this.ruleForm.rule = res.data;
        }
      });
    },
    //邀请规则编辑
    handleOKUpdateState() {
      console.log(this.ruleForm.rule);
      let inviteRuleVO = { rule: this.ruleForm.rule };
      inviRuleUpdate(inviteRuleVO).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false;
          Message({ message: "恭喜你，保存成功", type: "success" });
        }
      });
    },
    //重置
    reset() {
      this.ruleForm = {
        phone: null, //邀请人手机号
        grantState: '', //积分发放状态
        starTime: null, //开始时间
        endTime: null, //截至时间
        rule: "", //邀请规则
      };
      //  this.$refs.userList.update(this.ruleForm);
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
.userList {
  padding: 20px !important;
}
</style>
