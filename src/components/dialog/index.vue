<!--
 * @Author: jiu yin
 * @Date: 2021-10-27 18:39:29
 * @LastEditTime: 2022-01-07 14:22:30
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\components\dialog\index.vue
 * jiu
-->
<template>
   <div>
      <el-dialog :title="title"
                 :visible.sync="visible.bl"
                 :close-on-click-modal="false"
                 width="400px"
                 ref="dialog"
                 :destroy-on-close="true"
                 v-if="visible.bl">
         <!-- 常规场景 -->
         <div v-if="type == 'normal'"
              class="flex">
            <el-form :model="modelObj"
                     ref="form">
               <el-form-item :label="item.label"
                             :required="item.required"
                             v-for="(item, index) in list"
                             :key="index"
                             :label-width="item.width?item.width:'100px'">
                  <el-input v-model.trim="modelObj[item.code]"
                            autocomplete="off"
                            size="mini"
                            :maxlength="item.maxLength"
                            v-if="item.type == 'text' && item.el == 'input'"></el-input>
                  <el-input v-model.number.trim="modelObj[item.code]"
                            autocomplete="off"
                            size="mini"
                            :maxlength="item.maxLength"
                            v-if="item.type == 'number' && item.el == 'input'"></el-input>
                  <el-select v-model="modelObj[item.code]"
                             :placeholder="item.placeholder ? item.placeholder : '请选择'"
                             v-if="item.el == 'select'"
                             size="mini">
                     <el-option v-for="i in item.options"
                                :key="i.id"
                                :label="i.name"
                                :value="i.id"></el-option>
                  </el-select>
               </el-form-item>
            </el-form>
         </div>
         <!-- 顺序特殊场景 -->
         <div v-if="type == 'sort'"
              class="flex">
            <div v-for="(item, index) in model"
                 :key="index">
               <el-form :model="item"
                        label-width="120px"
                        ref="form">
                  <el-form-item :label="item.name"
                                :required="required">
                     <el-input v-model.number="item.sort"
                               autocomplete="off"
                               size="mini"
                               :maxlength="item.maxLength"></el-input>
                  </el-form-item>
               </el-form>
            </div>
         </div>
         <div slot="footer"
              class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary"
                       @click="changePasswords">确认修改</el-button>
         </div>
      </el-dialog>
   </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
   props: {
      title: {
         type: String,
         default: "弹窗提示",
      },
      model: {
         type: Object,
         default: {},
      },
      list: {
         type: Array,
         default: [{ label: "调试", code: "code", type: "text" }],
      },
      visible: {
         type: Object,
         default: { bl: true },
      },
      type: {
         type: String,
         default: "normal",
      },
   },
   components: {},
   data() {
      return {
         modelObj: {},
      };
   },
   computed: {
      ...mapGetters({}),
   },
   methods: {
      ...mapActions({}),
      changePasswords() {
         let params = this.type == "normal" ? this.modelObj : this.model;
         this.$emit("submit", params);
         this.visible.bl = false;
      },
      cancel(){
         this.visible.bl = false
         this.$emit("cancel");
      }
   },
   mounted() {
      //子变父不变 
      this.modelObj = { ... this.model };
      this.list.forEach((item) => {
         item.el ? null : (item.el = "input");
         item.type ? null : (item.type = "text");
         if (typeof item.options == "function") {
            item.options().then((res) => (item.options = res.data));
         }
      });
      console.log(this.modelObj);
   },
};
</script>
<style scoped lang="scss">
>>> .el-dialog__body {
   display: block;
}
>>> .el-form-item__label {
   // width: 100px!important;
   text-align: left;
}
>>> .el-form-item__content {
   margin-left: 0 !important;
}
</style>
