<template>
  <div class="formPage">
    <div class="formBody">
      <formList ref="formList" :loading.sync="loading" :config="config" :formObj="formObj" :list="list" @button="formButton" />
      <div class="addgoods">
        <span>添加商品：</span>
        <el-button type="primary" @click="addGoods">添加商品</el-button>
      </div>
      <div class="addgoods">
        <el-table :data="tableData" style="width: 100%;">
          <el-table-column prop="goodsName" label="商品名称" />
          <el-table-column prop="displayUrl" label="规格展示图">
            <template slot-scope="scope">
              <el-image :src="scope.row.displayUrl" :preview-src-list="[scope.row.displayUrl]" style="width: 60px; height: auto;" />
            </template>
          </el-table-column>
          <el-table-column prop="specName" label="规格名称" />
          <el-table-column prop="amount" label="价格(积分)" />
          <el-table-column prop="cash" label="价格(现金)">
            <template slot-scope="scope">
              {{ scope.row.payMode ? scope.row.cash : "无" }}
            </template>
          </el-table-column>
          <el-table-column prop="promotionAmount" label="抢购价格（积分）" />
          <el-table-column prop="promotionCash" label="抢购价格（现金）">
            <template slot-scope="scope">
              {{ scope.row.payMode ? (scope.row.promotionCash ? scope.row.promotionCash : "") : "无" }}
            </template>
          </el-table-column>
          <el-table-column prop="stock" label="实际库存" />
          <el-table-column prop="activityStock" label="活动库存" />
          <el-table-column prop="limitPerPerson" label="每人限购数量" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button type="text" @click="delTable(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="选择商品" center :visible.sync="productVisible" v-if="productVisible" @close="productVisible = false" custom-class="role_dialog" width="50%" :close-on-click-modal="false">
      <el-input v-model="searchfrom.goodsName" placeholder="请输入内容" class="input-with-select">
        <el-button slot="append" @click="onClickSearch" icon="el-icon-search"></el-button>
      </el-input>
      <div style="margin: 10px 0;">
        <span>品类：</span>
        <el-select v-model="searchfrom.categoryId" @change="onClickSearch" placeholder="请选择">
          <el-option v-for="item in briefData" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="table">
        <Table :loadData="getList" :column="column" :select="handleSelectionChange" :select-all="allSelect" :single="single" ref="TableList" :headHight="400">
          <template v-slot:coverUrl="{ scope }">
            <el-image :src="scope.coverUrl" :preview-src-list="[scope.coverUrl]" style="width: 200px; height: 130px;" />
          </template>
        </Table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="productVisible = false">取 消</el-button>
        <el-button type="primary" @click="productVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择规格" center :visible.sync="Specifications" v-if="Specifications" @close="Specifications = false" custom-class="role_dialog" width="50%" :close-on-click-modal="false">
      <div class="specBox">
        <el-checkbox-group v-model="checkedSpec">
          <div v-for="(item, index) of specData" :key="index" class="list">
            <el-checkbox :label="item">
              <div class="spec">
                <el-image :src="item.displayUrl" :preview-src-list="[item.displayUrl]" style="width: 70px; height: 70px;" />
                <div>
                  <div>{{ item.specName }}</div>
                  <div>剩余库存{{ item.stock }}</div>
                  <div class="price">
                    {{ item.amount }}(积分)<span v-if="item.cash">+{{ item.cash }}(现金)</span>
                  </div>
                </div>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Specifications = false">取 消</el-button>
        <el-button type="primary" @click="spec">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置参数" center :visible.sync="systemVisible" v-if="systemVisible" @close="resetForm('form')" custom-class="role_dialog" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-form-item label="抢购价(积分)：" prop="promotionAmount">
          <el-input v-model.trim="form.promotionAmount" placeholder="请输入" type="number"></el-input>
        </el-form-item>
        <el-form-item label="抢购价(现金)：" prop="promotionCash" v-if="form.payMode ? true : false">
          <el-input v-model.trim="form.promotionCash" placeholder="请输入" type="number"></el-input>
        </el-form-item>
        <el-form-item label="活动库存" prop="activityStock">
          <el-input v-model.trim="form.activityStock" maxlength="10" placeholder="请输入" type="number"></el-input>
        </el-form-item>
        <el-form-item label="每人限购数量">
          <el-input v-model.trim="form.limitPerPerson" maxlength="10" placeholder="请输入" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="system">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* coachList/add 添加修改教练 Course
 * */
import formList from "@/components/FormList/index";
import { getBrief, goodsFind, getFindSpec, addActivity, activityInfo, editActivity } from "@/api/malloperation";
import Table from "@/components/Table/index";
import { parseTime } from "@/utils";

export default {
  components: {
    formList,
    Table,
  },
  data() {
    return {
      loading: false,
      edit: false,
      productVisible: false,
      Specifications: false,
      systemVisible: false,
      single: true,
      checkedSpec: [],
      specData: [],
      briefData: [],
      tableData: [],
      productObj: "",
      index: 0,
      column: [
        { prop: "goodsName", label: "商品名称" },
        // { prop: "stockSum", label: "剩余库存" },
        // { prop: "amountMin", label: "价格" },
        { prop: "coverUrl", label: "商品图片", render: true },
      ],
      list: [
        {
          code: "title",
          label: "活动标题",
          maxlength: 50,
        },
        {
          el: "textArea",
          code: "remarks",
          label: "活动描述",
          maxlength: 500,
        },
        {
          el: "date",
          code: "startTime",
          label: "活动开始时间",
          endCode: "endTime",
          timeError: "开始时间要小于结束时间",
          required: true,
        },
        {
          el: "date",
          code: "endTime",
          label: "活动结束时间",
          required: true,
          timeError: "开始时间要小于结束时间",
          starCode: "startTime",
          minTime: new Date(),
        },
      ],
      formObj: {},
      config: {
        buttonsArea: "popButtom",
        inline: false,
        mainStyle: {
          width: "80%",
          marginLeft: "10%",
        },
        buttons: [
          {
            funType: "confirm",
            type: "primary",
            name: "确定",
          },
          {
            funType: "cancel",
            type: "primary",
            name: "取消",
          },
        ],
      },
      // 搜索查询数据
      searchfrom: {
        goodsName: null, // 活动商品关联标题
        categoryId: null, // 活动状态
      },
      form: {
        limitPerPerson: "", //限购数量
        promotionAmount: "", //抢购价（积分）
        promotionCash: 0, //抢购价（现金）
        activityStock: "", //活动库存
        payMode: null, //积分还是 积+现
      },
      rules: {
        promotionAmount: [{ required: true, message: "请输入", trigger: "blur" }],
        promotionCash: [{ required: true, message: "请输入", trigger: "blur" }],
        activityStock: [{ required: true, message: "请输入", trigger: "blur" }],
      },
    };
  },
  mounted() {
    if (this.$route.query.id) {
      this.edit = true;
      activityInfo({ id: this.$route.query.id }).then((res) => {
        this.formObj = res.data;
        this.formObj.startTime = parseTime(this.formObj.startTime);
        this.formObj.endTime = parseTime(this.formObj.endTime);
        this.tableData = res.data.goodsRelList;
      });
    }
    this.getBrief();
  },
  computed: {
    getList() {
      return goodsFind; //  return 数据列表接口
    },
  },
  methods: {
    handleChange(val) {},
    delTable(index) {
      this.tableData.splice(index, 1);
    },
    // 填写课程信息的表单按钮
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        for (let item of this.tableData) {
          if (!item.promotionAmount) {
            return this.$message.error("请编辑商品积分抢购价");
          }
          if (item.payMode) {
            if (!item.promotionCash) {
              return this.$message.error("请编辑商品现金抢购价");
            }
          }
          if (!item.activityStock) {
            return this.$message.error("请编辑商品活动库存");
          }
        }
        for (let item of this.tableData) {
          if (!item.limitPerPerson) {
            item.limitPerPerson = "-1";
          }
        }
        data.goodsRelList = this.tableData;
        if (!this.tableData.length) return this.$message.error("请添加商品");
        if (this.edit) {
          editActivity(data).then((res) => {
            this.$alert("编辑成功，跳转到列表", "编辑成功", {
              confirmButtonText: "确定",
              callback: (action) => {
                this.$router.push({
                  path: "/malloperation/activity",
                });
              },
            });
          });
        } else {
          addActivity(data).then((res) => {
            this.$alert("添加成功，跳转到列表", "添加成功", {
              confirmButtonText: "确定",
              callback: (action) => {
                this.$router.push({
                  path: "/malloperation/activity",
                });
              },
            });
          });
        }
      } else {
        this.$confirm("是否返回到列表?确定将放弃编辑内容！", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$router.push({
            path: "/malloperation/activity",
          });
        });
      }
    },
    handleSelectionChange(val) {
      getFindSpec({ goodsId: val[0].goodsId }).then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.specData = data;
          this.Specifications = true;
          this.productObj = val;
        }
      });
    },
    getBrief() {
      getBrief().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.briefData = (data || []).map((item) => {
            return {
              value: item.id,
              label: item.categoryName,
            };
          });
        }
      });
    },
    addGoods() {
      this.productVisible = true;
    },
    // 搜索查询
    onClickSearch() {
      this.$refs.TableList.update({ ...this.searchfrom });
    },
    spec() {
      let arr = (this.checkedSpec || []).map((item) => {
        return Object.assign(item, ...this.productObj);
      });
      this.tableData = this.tableData.concat(arr);
      this.tableData = this.arr(this.tableData);
      this.Specifications = false;
      this.checkedSpec = [];
    },
    handleEdit(index, row) {
      this.form.promotionAmount = row.promotionAmount;
      this.form.promotionCash = row.promotionCash;
      this.form.activityStock = row.activityStock;
      this.form.limitPerPerson = row.limitPerPerson;
      this.index = index;
      this.form.payMode = row.payMode;
      this.systemVisible = true;
    },
    allSelect(val) {
      console.log(val);
      // this.$refs.TableList.clearSelection()
    },
    // 模态窗取消事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.systemVisible = false;
    },
    system() {
      parseInt(this.form.activityStock);
      if (parseInt(this.form.promotionAmount) >= parseInt(this.tableData[this.index].amount)) return this.$message.error("抢购积分不能大于等于实际积分");
      if (this.form.payMode) {
        if (parseInt(this.form.promotionCash) >= parseInt(this.tableData[this.index].cash)) return this.$message.error("抢购现金不能大于等于实际现金");
      }
      if (parseInt(this.form.activityStock) > parseInt(this.tableData[this.index].stock)) return this.$message.error("活动库存不能大于实际库存");
      //限购 活动库存
      if (parseInt(this.form.limitPerPerson) > parseInt(this.form.activityStock)) return this.$message.error("限购数量不能大于活动库存");

      this.$set(this.tableData[this.index], "limitPerPerson", this.form.limitPerPerson);
      this.$set(this.tableData[this.index], "promotionAmount", this.form.promotionAmount);
      this.$set(this.tableData[this.index], "promotionCash", this.form.promotionCash);
      this.$set(this.tableData[this.index], "activityStock", this.form.activityStock);
      this.resetForm("form");
    },
    // 数组去重
    arr(arr) {
      var obj = {};
      arr = arr.reduce(function (item, next) {
        obj[next.specId] ? "" : (obj[next.specId] = true && item.push(next));
        return item;
      }, []);
      return arr;
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
.addgoods {
  margin-left: 10%;
  color: #606266;
  font-size: 14px;
}
.table {
  padding: 20px;
}
.list {
  width: 100%;
  height: 100px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
}
.spec {
  display: flex;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    .price {
      color: red;
      font-size: 24px;
    }
  }
}
.specBox {
  height: 400px;
  overflow-y: auto;
}
</style>
