<!--
  *  @Author:  wei.chen
  *  @Date:  2020-07-18  10:03:47
 * @LastEditors: jiu yin zhen jing
 * @LastEditTime: 2021-11-03 16:07:41
 * @Descripttion:
-->
<template>
  <div class="taskScoreComp">
    <!-- 搜索 -->
    <el-form :inline="true" :model="searchfrom" ref="searchForm" class="demo-form-inline">
      <div class="hederBut">
        <el-button type="primary" icon="el-icon-plus" @click="addTaskScoreFun" size="small">
          更改积分
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addTaskRuleDialog" size="small">
          查看说明
        </el-button>
      </div>
      <el-form-item label="发起时间:">
        <el-date-picker @change="onChange" v-model.trim="searchfrom.regDate" type="daterange" size="small" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"></el-date-picker>
      </el-form-item>
      <el-form-item prop="phone" label="手机号码:">
        <el-input v-model.trim="searchfrom.phone" size="small" placeholder="手机号码" prefix-icon="el-icon-search"></el-input>
      </el-form-item>
      <el-form-item label="积分规则">
        <el-select size="small" v-model.trim="searchfrom.rule" >
          <!-- <el-option :label="'全部'" :value="''" selected="selected"></el-option> -->
          <el-option v-for="item in registeredSourceOptions" :key="item.val" :label="item.lab" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onClickSearch" size="small">搜索</el-button>
      </el-form-item>
      <div class="rule">
        当前<span style="color: red;">{{ selectLable }}</span
        >规则下：&ensp;获得：{{ countInfo.socreAddNum }} <span>扣除：{{ countInfo.socreCutNum }} </span> 总计：{{ countInfo.scoreTotal }}
      </div>
    </el-form>

    <!-- 表格 -->

    <Table :loadData="getList" :column="column" ref="TableList" refHead="searchForm" :showSortIndex="{ show: true, lable: '序号' }" @resData="resData"></Table>

    <!-- 新增/编辑欢迎词模态窗 -->
    <el-dialog title="更改积分" center :visible.sync="dialogFormVisible" v-if="dialogFormVisible" @close="resetForm('addScoreForm')" custom-class="role_dialog" :close-on-click-modal="false">
      <el-form :model="addScoreForm" label-width="100px" :rules="addScoreRules" ref="addScoreForm">
        <el-form-item label="用户手机号:" prop="phone">
          <el-input v-model.trim="addScoreForm.phone" maxlength="11" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="变化积分：" prop="score">
          <el-input v-model.trim="addScoreForm.score" maxlength="7" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="积分规则：" prop="ruleType">
          <el-select v-model="addScoreForm.ruleType" class="selected_item" placeholder="请选择" :disabled="true">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in scoreRuleList" :key="index"></el-option>
          </el-select>
          <!-- <el-input
						v-model.trim="addScoreForm.ruleType"
						maxlength="24"
						placeholder="请输入名称"
					></el-input> -->
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model.trim="addScoreForm.remark" maxlength="200" type="textarea" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addScoreForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('addScoreForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="积分说明弹窗" center :visible.sync="dialogaAddFormVisible" v-if="dialogaAddFormVisible" @close="resetForm('addRuleform')" custom-class="role_dialog" :close-on-click-modal="false">
      <el-form :model="addRuleform" :rules="rules" ref="addRuleform" label-position="top">
        <el-form-item label="积分规则：" prop="scoreIntroduce">
          <el-input v-model.trim="addRuleform.scoreIntroduce" type="textarea" :autosize="{ minRows: 5, maxRows: 7 }" :maxlength="2000" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRuleResetForm('addRuleform')">取 消</el-button>
        <el-button type="primary" @click="addRuleSubmitForm('addRuleform')">
          保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";
import { Message } from "element-ui";
import { getTaskScoreListDetail, addTaskScore, editTaskScore, getTaskScoreListInfo, getTaskScoreInfoDetail } from "@/api/taskScore";

export default {
  name: "taskScoreComp",
  components: {
    Table,
  },
  data() {
    var checkScore = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入积分"));
      } else if (!/^-$|^-?[1-9][0-9]*$/.test(+value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    };
    return {
      registeredSourceOptions: [
        {
          lab: "全部",
          val: "",
        },
        {
          lab: "签到积分",
          val: "sign",
        },
        {
          lab: "新用户注册首次登录积分",
          val: "reg",
        },
        {
          lab: "第一次修改头像积分",
          val: "avatar",
        },
        {
          lab: "第一次修改昵称积分",
          val: "nickname",
        },
        {
          lab: "第一次修改性别积分",
          val: "sex",
        },
        {
          lab: "邀请用户注册并登录积分",
          val: "invite",
        },
        {
          lab: "学习瑜伽视频30分钟",
          val: "video",
        },
        {
          lab: "听冥想智慧完成积分",
          val: "audio",
        },
        {
          lab: "分享积分",
          val: "share",
        },
        {
          lab: "评论积分",
          val: "comment",
        },
        {
          lab: "约课积分",
          val: "yueke",
        },
        {
          lab: "系统产生",
          val: "system",
        },
        {
          lab: "活动",
          val: "activite",
        },
        {
          lab: "购买瑜伽课程",
          val: "purchase",
        },
         {
          lab: "取消购买瑜伽课程",
          val: "cancel",
        },
      ],
      dialogFormVisible: false, //  新增/编辑欢迎词模态窗是否显示
      dialogaAddFormVisible: false,
      dialogTableVisible: false,
      addRuleform: { scoreIntroduce: "" },
      userData: [], // 查看人员列表数据
      taskScoreCompVisible: false,
      checkedKeys: [], // 已有的权限ID
      expandedKeys: [],
      //表单
      searchfrom: { rule: "" },
      //下拉lable值
      selectLable: "全部",
      //  表头
      column: [
        // { prop: 'id', label: '序号' },
        { prop: "nickname", label: "用户" },
        { prop: "phone", label: "用户手机" },
        { prop: "ruleName", label: "积分规则" },
        { prop: "score", label: "变更积分" },
        { prop: "remark", label: "备注" },
        { prop: "createTime", label: "发生时间" },
      ],
      countInfo: {
        //积分总量
        scoreTotal: 0,
        //积分增量
        socreAddNum: 0,
        //积分减量
        socreCutNum: 0,
      },
      scoreRuleList: [],
      form: {
        // 新增/编辑欢迎词模态窗表单数据
        content: "", // 欢迎词名称
      },
      addScoreForm: {
        phone: null,
        score: null,
        ruleType: 19,
        remark: null,
      },
      addScoreRules: {
        phone: [{ required: true, message: "请输入名称", trigger: "blur" }],
        score: [{ required: true, validator: checkScore, trigger: "blur" }],
        ruleType: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      title: "", // 新增/编辑欢迎词模态窗的 title
      // 新增/编辑欢迎词模态窗表单校检
      rules: {
        content: [{ required: true, message: "请输入名称", trigger: "blur" }],
        // operatorIdSet: [{ required: true, message: '请选择人员', trigger: 'blur' }],
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
    };
  },
  computed: {
    getList() {
      return getTaskScoreListDetail; //  return 数据列表接口
    },
  },
  mounted() {
    // 初始化编辑的数据
    this.initData();
  },
  methods: {
    initData() {
      // 获取积分规则列表数据
      getTaskScoreListInfo().then((res) => {
        if (res.code === 200) {
          this.scoreRuleList = res.data;
        }
      });
    },
    resData(e) {
      this.countInfo = e.countInfo;
    },
    // 获取要设置的权限 Code
    handleCheckChange(data, checked) {},
    // 设置权限确定事件
    onClicktaskScoreComp() {
      addRoletaskScoreComp({ ...this.params }).then((res) => {
        if (res.code === 200) {
          Message.success("操作成功！！！");
          this.taskScoreCompVisible = false;

          this.$refs.tree.setCheckedKeys([]); // 重置树节点勾选状态
          this.$refs.TableList.reset();
        }
      });
    },
    //开始结束时间
    onChange(value) {
      if (value) {
        let distance = parseInt(value[1] - value[0]);
        let day = parseInt(31 * 24 * 60 * 60 * 1000);
        if (distance > day) {
          return Message({
            message: "查询时间不能超过31天",
            type: "error",
            duration: 2000,
          });
        } else {
          this.searchfrom.startTime = value[0];
          this.searchfrom.endTime = value[1];
        }
      } else {
        this.searchfrom.startTime = null;
        this.searchfrom.endTime = null;
      }
    },
    // 搜索事件
    onClickSearch() {
      let obj = this.registeredSourceOptions.find((item) => item.val == this.searchfrom.rule);
      this.selectLable = obj.lab;
      this.$refs.TableList.update({ ...this.searchfrom });
    },
    // 新增 Btu 事件
    addTaskScoreFun() {
      this.dialogFormVisible = true;
      this.form = {
        content: "", // 规则内容
      };
    },
    // 新增 Btu 事件
    addTaskRuleDialog() {
      this.dialogaAddFormVisible = true;
      getTaskScoreInfoDetail()
        .then((res) => {
          if (res.code === 200) {
            this.addRuleform.scoreIntroduce = res.data;
          }
        })
        .catch((error) => {});
      this.addRuleform = {
        scoreIntroduce: "", // 欢迎词名称
      };
    },
    // 模态窗确认保存事件
    submitForm(formName) {
      console.log(this.addScoreForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _par = { ...this.addScoreForm };

          addTaskScore(_par).then((res) => {
            debugger;
            if (res.code === 200) {
              this.dialogFormVisible = false;
              Message.success("添加成功！！！");
              this.$refs.TableList.reset();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addRuleSubmitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const _par = { scoreIntroduce: this.addRuleform.scoreIntroduce };
        editTaskScore(_par).then((res) => {
          if (res.code === 200) {
            this.dialogaAddFormVisible = false;
            Message.success("修改成功！！！");
            // this.$refs.TableList.reset();
          }
        });
      });
    },
    // 模态窗取消事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 模态窗取消事件
    addRuleResetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogaAddFormVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.taskScoreComp {
  padding: 20px;
  .hederBut {
    padding-bottom: 20px;
  }
  .selected_item {
    width: 100%;
  }
  .rule {
    color: #909399;
    font: bold 19px "微软雅黑";
    span {
      display: inline-block;
      padding: 0 20px;
    }
  }
}
</style>
