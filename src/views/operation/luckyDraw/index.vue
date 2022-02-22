<!--
 * @Author: jiu yin
 * @Date: 2021-07-27 09:35:21
 * @LastEditTime: 2021-11-10 15:37:55
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\operation\luckyDraw\index.vue
 *  “”
-->
<template>
  <div class="userList">
    <el-form :inline="true" :model="ruleForm" ref="ruleForm" class="demo-form-inline">
      <el-form-item prop="userId" label="用户ID:">
        <el-input placeholder="输入ID" prefix-icon="el-icon-search" v-model.number="ruleForm.userId" size="small" autocomplete @blur="blueId"></el-input>
      </el-form-item>
      <el-form-item prop="nickname" label="用户昵称:">
        <el-input placeholder="输入昵称" prefix-icon="el-icon-search" v-model.number="ruleForm.nickname" size="small" autocomplete></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="用户手机号:">
        <el-input placeholder="输入手机号" prefix-icon="el-icon-search" v-model.number="ruleForm.phone" size="small" autocomplete @blur="blueText" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select size="small" v-model.trim="ruleForm.state">
          <el-option :label="'全部'" :value="''" selected="selected"></el-option>
          <el-option v-for="item in registeredSourceOptions" :key="item.val" :label="item.lab" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抽奖时间:">
        <el-date-picker @change="onChange" v-model.trim="ruleForm.regDate" type="date" size="small" value-format="timestamp" placeholder="请选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onClickSearch($event, 'click')">查询</el-button>
        <el-button type="primary" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <Table refHead="ruleForm" :loadData="getList" :column="column" ref="userList" :showSortIndex="{ show: true, lable: '序号' }"> </Table>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
// 抽奖分页 抽奖状态改变
import { winrecordPage, winrecordState } from "@/api/luckyDraw";
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
      ],
      dialogVisible: false,
      userItemForm: { banOperate: [] },
      ruleForm: {
        userId: null, //用户ID
        nickname: null, //用户昵称
        phone: "", //邀请人手机号
        state: "", //发放状态状态
        createTimeStamp: null, //开始时间
      },
      column: [
        { prop: "id", label: "序号" },
        { prop: "userId", label: "用户ID" },
        { prop: "nickname", label: "用户昵称" },
        { prop: "phone", label: "用户手机号" },
        {
          prop: "createTimeStamp",
          label: "抽奖时间",
          formatter: (row, column) => {
            return parseTime(row.createTime);
          },
        },
        {
          prop: "luckType",
          label: "抽奖方式",
          formatter: (row, column) => {
            let state;
            switch (row.state) {
              case 0:
                state = "免费";
                break;
              case 1:
                state = "积分";
                break;
              default:
                break;
            }
            return state;
          },
        },
        { prop: "name", label: "获得奖品" },
        {
          prop: "state",
          label: "积分发放状态",
          formatter: (row, column) => {
            let state;
            switch (row.state) {
              case 0:
                state = "未发放";
                break;
              case 1:
                state = "已发放";
                break;
              default:
                break;
            }
            return state;
          },
        },
        {
          prop: "receiveTime",
          label: "发放时间",
          formatter: (row, column) => {
            return parseTime(row.receiveTime);
          },
        },
        {
          prop: "states",
          label: "操作",
          actives: [
            {
              name: (val) => {
                return val.state ? "撤销发放" : "发放";
              },
              method: (val) => {
                winrecordState(val.id).then((res) => {
                  if (res.code == 200) {
                    Message({ message: "id" + val.id + (val.state ? "撤销" : "发放") + "成功", type: "success" });
                    this.$refs.userList.update(this.ruleForm);
                  }
                });
              },
            },
          ],
        },
      ],
    };
  },
  created() {},
  computed: {
    getList() {
      return winrecordPage;
    },
  },
  methods: {
    //手机正则
    blueText() {
      // let e = this.ruleForm.phone;
      // if (e !== "" && /^\d{0,11}$/.test(e)) {
      //   Message.warning("请输入正确手机号");
      //   // this.ruleForm.phone = "";
      // }
    },
    blueId(e) {
      let es = e.target.value;
      if (es !== "" && !/^[0-9]*$/.test(es)) {
        Message.warning("请输入数字ID");
        // this.ruleForm.userId = "";
      }
    },
    //开始结束时间
    onChange(value) {
      if (value) {
        this.ruleForm.createTimeStamp = value;
      } else {
        this.ruleForm.createTimeStamp = null;
      }
    },
    //查询回车键搜索
    onClickSearch(e, type) {
      //vue 带的双向number 只能输入数字以后才生效
      if (this.ruleForm.userId == "") {
        this.ruleForm.userId = null;
      }
      if (typeof this.ruleForm.userId == "string") {
        return;
      } else {
        if (type == "click" || e.keyCode == 13) {
          this.$refs.userList.update(this.ruleForm);
        }
      }
    },
    //重置
    reset() {
      this.ruleForm = {
        userId: null, //用户ID
        nickname: null, //用户昵称
        phone: null, //邀请人手机号
        state: "", //发放状态状态
        createTimeStamp: null, //开始时间
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
  padding: 20px;
}
</style>
