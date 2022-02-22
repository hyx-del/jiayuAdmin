<!--
 * @Author: wei.chen
 * @Date: 2020-06-12 15:11:11
 * @LastEditTime: 2021-11-10 15:30:04
 * @LastEditors: jiu yin zhen jing
 * @Description: 系统账号管理
-->
<template>
  <el-card class="yoga_screen_info" :body-style="{ padding: '20px' }">
    <el-table border :data="tableListData">
      <el-table-column align="center" property="index" width="120" label="序号"></el-table-column>
      <el-table-column align="center" property="name" width="120" label="Tab选项"></el-table-column>
      <el-table-column align="center" property="sort" width="100" label="顺序"></el-table-column>
      <el-table-column align="center" property="describe" label="简介"></el-table-column>
      <el-table-column align="center" property="enable" width="140" label="启用/禁用">
        <template slot-scope="scope">
          <el-switch v-model="!scope.row.enable" active-color="#13ce66" inactive-color="#ff4949" :active-value="false" :inactive-value="true" @change="bannedChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" property="active" width="80" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="showDialogModal(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增/编辑版本模态窗 -->
    <el-dialog :title="title" center :visible.sync="dialogFormVisible" v-if="dialogFormVisible" @close="resetForm('form')" width="460px" custom-class="role_dialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label=" 顺序:" prop="sort" class="item">
          <el-input v-model.number="form.sort" maxlength="4" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label=" 简介:" prop="describe" class="item">
          <el-input type="textarea" v-model="form.describe" maxlength="50" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('formRef')">取 消</el-button>
        <el-button type="primary" @click="submitForm('formRef')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getHomeTabList, editHomeTab, bannedHomeTab } from "@/api/yogaManage";
import { Message } from "element-ui";
export default {
  components: {},
  data() {
    const orderCode = (rule, value, callback) => {
      if (!/^[1-9][0-9]{0,3}$/.test(value)) {
        return callback(new Error("请输入大于1小于9999的整数"));
      } else {
        callback();
      }
    };
    return {
      pid: "",

      tableListData: [],
      // 模态窗数据
      dialogFormVisible: false,
      form: {
        describe: null,
        sort: null,
      },
      rules: {
        // text: [{ required: true, message: '请输入', trigger: 'blur' }],
        sort: [{ required: true, validator: orderCode, trigger: "blur" }],
      },
      title: "", // 模态窗标题
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      getHomeTabList().then((res) => {
        if (res.code === 200) {
          this.tableListData = res.data;
          this.tableListData.forEach((item, index) => {
            item.index = index + 1;
          });
        }
      });
    },
    showDialogModal(item) {
      this.dialogFormVisible = true;
      this.title = "修改" + item.name;
      this.form = { ...item };
    },
    // 模态窗取消事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // 模态窗确认保存事件
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editHomeTab({ ...this.form }).then((res) => {
            if (res.code === 200) {
              this.dialogFormVisible = false;
              Message.success("修改成功！！！");
              this.initData();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 禁用
    bannedChange(item) {
      console.log(item);
      let _state = null;
      if (item.enable == 1) {
        _state = 0;
      } else {
        _state = 1;
      }
      bannedHomeTab({ enable: _state, id: item.id }).then((res) => {
        if (res.code === 200) {
          Message.success("操作成功！");
          this.initData();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.admin_avater {
  height: 40px;
  width: 40px;
}
.yoga_screen_info {
  .item {
    width: 100%;
    margin-right: 20px;
    .el-select {
      width: 100%;
    }
  }
  .width_item {
    width: 93%;
    .el-form-item__content {
      width: 100%;
    }
  }
}
</style>
