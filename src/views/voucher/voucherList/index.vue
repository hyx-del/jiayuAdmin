<template>
  <div class="commonPage">
    <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton" />
    <Table :loadData="getList" refHead="formList" :column="column" ref="TableList" :showSortIndex="{ show: true, lable: '序号'}"></Table>

    <el-dialog title="发放代金券" :visible.sync="dialogVisible" width="30%">
      <div style="height: 262px;">
        <formList ref="formGrant" :config="configGrant" :formObj="formObjGrant" :list="listGrant" @button="formButtonGrant" @formChange="formChange" />
        <span class="hint" v-if="hint">该用户还未注册，请让用户注册梵音瑜伽后台再发券</span>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="核销备注" :visible.sync="remark" width="30%">
      <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="textarea" maxlength="220" size="small" show-word-limit resize="none"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remark = false">取 消</el-button>
        <el-button type="primary" @click="remarkSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Table from "@/components/Table/index";
import formList from "@/components/FormList";
import { voucherList, voucherAdd, voucherDelete, selectUserByPhone, voucherUse, voucherUpdateUseRemarks } from "@/api/voucher";
export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      id: null,
      loading: false,
      //是否核销
      useStatus: null,
      //发放弹框
      dialogVisible: false,
      //未注册
      hint: false,
      //核销备注弹框
      remark: false,
      textarea: "",
      config: {
        hasLoading: false,
        inline: true,
        allRequired: false,
        size:"mini",
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
            name: "发放代金券",
          },
        ],
      },
      configGrant: {
        hasLoading: false,
        inline: true,
        allRequired: false,
        colon: "：", // label后的冒号，可以替换成其他的
        inputStyle: {
          width: "300px",
        },
        buttons: [],
      },
      //头部表单
      formObj: { useStatus: "" },
      formObjUp: {},
      //弹框
      formObjGrant: {
        voucherName: "梵因美业代金券",
        purpose: "「美白注氧」or 「筋膜提升」项目专用 ",
      },
      list: [
        {
          code: "voucherNumber",
          placeholder: "请输入代金券ID",
          label: "",
          icon: "el-icon-zoom-in",
        },
        {
          code: "receiverPhone",
          placeholder: "请输入接收人电话",
          label: "",
          icon: "el-icon-zoom-in",
        },
        {
          code: "issuingPhone",
          placeholder: "请输入发券人电话",
          label: "",
          icon: "el-icon-zoom-in",
        },
        {
          code: "userPhone",
          placeholder: "请输入核销人电话",
          label: "",
          icon: "el-icon-zoom-in",
        },
        {
          el: "select",
          code: "useStatus",
          label: "核销状态",
          list: [
            { value: "", label: "全部" },
            { value: 1, label: "已核销" },
            { value: 0, label: "未核销" },
          ],
        },
      ],
      listGrant: [
        {
          code: "voucherName",
          label: "代金券名称",
          disabled: true,
        },
        {
          code: "purpose",
          label: "用途说明",
          disabled: true,
        },
        {
          code: "money",
          label: "代金金额",
          type: "number",
          required: true,
          maxlength: 5,
        },
        {
          code: "receiverPhone",
          label: "用户电话",
          required: true,
          type: "phone",
        },
      ],

      // 表头
      column: [
        {
          prop: "voucherNumber",
          label: "代金券ID",
        },
        {
          prop: "money",
          label: "代金券金额",
        },
        {
          prop: "receiverName",
          label: "接收人昵称",
        },
        {
          prop: "receiverPhone",
          label: "接收人电话",
        },
        {
          prop: "issuingTime",
          label: "发券时间",
        },
        {
          prop: "issuingPeople",
          label: "发券操作人",
        },
        {
          prop: "issuingPhone",
          label: "发券人电话",
        },
        {
          prop: "useStatus",
          label: "是否核销",
          html: (row, column) => (row.useStatus ? `<span style='color:green'>已核销</span> ` : `<span style='color:red'>未核销</span>`),
        },
        {
          prop: "useTime",
          label: "核销时间",
        },
        {
          prop: "useRemarks",
          label: "核销备注",
        },
        {
          prop: "usePeople",
          label: "核销人操作",
        },
        {
          prop: "userPhone",
          label: "核销人电话",
        },
        {
          prop: "action",
          label: "操作",
          fixed: "right",
          width: 140,
          actives: [
            {
              name: (row, column) => (row.useStatus ? "" : "删除"),
              method: (val) => {
                console.log(val);
                this.$confirm("确定删除?", "提示", {
                  type: "warning",
                }).then(() => {
                  voucherDelete({ id: val.id }).then((res) => {
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
            {
              name: (row, column) => (row.useStatus ? "" : "核销"),
              method: (val) => {
                this.remark = true;
                this.id = val.id;
                //是否核销
                this.useStatus = val.useStatus;
              },
            },
            {
              name: (row, column) => (row.useStatus ? "修改备注" : ""),
              method: (val) => {
                this.useStatus = val.useStatus;
                this.textarea = val.useRemarks;
                this.remark = true;
                this.id = val.id;
              },
            },
          ],
        },
      ],
    };
  },
  computed: {
    getList() {
      return voucherList;
    },
  },
  created() {},
  methods: {
    submit() {
      this.$refs.formGrant.confirm();
    },
    // 搜索查询
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        console.log(data);
        this.formObjUp = data;
        this.$refs.TableList.update({ ...data });
      }
      if (val.name == "grant") {
        this.hint = false;
        this.dialogVisible = true;
      }
    },
    //发券弹框
    formButtonGrant(val) {
      console.log(val.value);
      let phone = { receiverPhone: val.value.receiverPhone };
      selectUserByPhone(phone).then((res) => {
        if (res.code == 200) {
          if (res.data.status) {
            voucherAdd(val.value).then((res) => {
              if (res.code == 200) {
                this.dialogVisible = false;
                this.$refs.TableList.update({ ...this.formObjUp });
                this.$message({
                  type: "success",
                  message: "发放成功",
                });
              }
            });
          } else {
            this.hint = true;
            return;
          }
        }
      });
      return;
    },
    messageSucces(msg) {
      this.remark = false;
      this.textarea = "";
      this.$message({
        type: "success",
        message: msg,
      });
      this.$refs.TableList.update({ ...this.formObjUp });
    },
    //核销备注
    remarkSubmit() {
      //核销？修改核销备注
      let obj = { id: this.id, useRemarks: this.textarea };
      if (this.useStatus) {
        if (this.textarea) {
          voucherUpdateUseRemarks(obj).then((res) => {
            if (res.code == 200) {
              this.messageSucces("修改备注成功");
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "核销备注不能为空",
          });
          return;
        }
      } else {
        if (this.textarea) {
          voucherUse(obj).then((res) => {
            if (res.code == 200) {
              this.messageSucces("核销成功");
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "核销备注不能为空",
          });
          return;
        }
      }
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
