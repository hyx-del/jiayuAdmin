<!--
 * @Author: jiu yin
 * @Date: 2021-08-12 09:36:30
 * @LastEditTime: 2021-08-12 15:25:50
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\views\mall\orderRule\index.vue
 *  “”
-->
<template>
  <div class="assistantTemp">
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-form-item label="限时抢购订单超过" prop="company">
          <el-input v-model.trim="form.saleLimitAutoClose" maxlength="10" placeholder="请输入" class="lastInput">
            <template slot="append">/分</template>
          </el-input>
          <span>未付款，则订单自动关闭</span>
        </el-form-item>
        <el-form-item label="下单后，超过" prop="company">
          <el-input v-model.trim="form.payLimitAutoClose" maxlength="10" placeholder="请输入" class="lastInput2">
            <template slot="append">/分</template>
          </el-input>
          <span>未付款，则订单自动关闭</span>
        </el-form-item>
        <el-form-item label="已发货订单超过" prop="company">
          <el-input v-model.trim="form.deliverLimitAutoClose" maxlength="10" placeholder="请输入" class="lastInput3">
            <template slot="append">/分</template>
          </el-input>
          <span>未收货，则订单自动关闭</span>
        </el-form-item>
        <el-form-item label="用户延长收货时长为" prop="company">
          <el-input v-model.trim="form.delayTimeCount" maxlength="10" placeholder="请输入" class="lastInput4">
            <template slot="append">/天</template>
          </el-input>
          <span style="color: red;">若用户延长收货，则已发货订单自动化规则将顺延！</span>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
import { getOrderRule } from "@/api/mall";
export default {
  data() {
    return {
      form: {
        // 新增/编辑助教模态窗表单数据
        delayTimeCount: "", //用户延长收货时长为(天) 若用户延长收货，则已发货订单自动化规则将顺延
        deliverLimitAutoClose: "", //已发货 订单超过XXX天未收货,则订单自动关闭
        payLimitAutoClose: "", //下单后 订单超过XXX分未付款,则订单自动关闭
        saleLimitAutoClose: "", //限时抢购 订单超过XXX分未付款,则订单自动关闭
      },
      // 新增/编辑助教模态窗表单校检
      rules: {
        company: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getOrderRule().then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.form = data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.assistantTemp {
  padding: 20px;
  display: flex;
  justify-content: center;
}
.el-form-item {
  display: flex;
  span {
     padding-left: 10px;
  }
}
    .lastInput {
        padding-left: 30px;
    }
       .lastInput2 {
        padding-left: 59px;
    }
      .lastInput3 {
        padding-left: 45px;
    }
       .lastInput4 {
        padding-left: 18px;
    }

</style>
