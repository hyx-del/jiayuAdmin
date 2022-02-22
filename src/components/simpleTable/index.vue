<!--
 * @Author: jiu yin
 * @Date: 2021-08-18 15:59:35
 * @LastEditTime: 2021-12-06 10:40:27
 * @LastEditors: jiu yin zhen jing
 * @Description: 666
 * @FilePath: \jiayu_admin\src\components\simpleTable\index.vue
 * jiu
-->
<template>
   <el-table class="simpleTable"
             ref="table"
             element-loading-text="Loading"
             :data="tableData"
             border
             tooltip-effect="dark"
             style="width: 100%;">
      <el-table-column v-for="(item, index) in tableLabel"
                       :width="item.width ? item.width : ''"
                       :key="index"
                       :align="item.align"
                       :label="item.label"
                       :prop="item.param"
                       :sortable="item.sortable ? 'custom' : false">
         <template v-if="item.formatter"
                   v-slot="scope">
            <span v-html="item.formatter(scope.row)"></span>
         </template>
         <template v-else-if="item.render"
                   v-slot="scope">
            <span v-html="item.render(scope.row)"></span>
         </template>
         <template v-else-if="item.renders"
                   v-slot="scope">
            <slot :scope="scope.row"
                  :name="item.param"></slot>
         </template>
         <template v-else-if="item.img"
                   v-slot="scope">
            <el-image :scope="scope.row"
                      :style="{
            width: item.width || 'auto',
            height: item.height || '80px',
          }"
                      class="table_img"
                      :src="[...scope.row[item.param]][0]"
                      :preview-src-list="[...scope.row[item.param]][0]"></el-image>
         </template>
         <template v-else-if="item.input"
                   v-slot="scope">
            <el-input v-model="scope.row[item.prop]"></el-input>
         </template>
         <template v-else-if="item.actives"
                   v-slot="scope">
            <template v-for="active in item.actives">
               <template v-if="typeof active.name === 'function' ? (active.name(scope.row, scope.$index, scope.row[item.prop]) ? active.name : false) : active.name">
                  <!-- 控制样式 -->
                  <div @click="active.method(scope.row, scope.$index)"
                       :key="'' + active.name"
                       v-html="typeof active.name === 'function' ? active.name(scope.row) : active.name"
                       class="activeDiv"></div>
               </template>
            </template>
         </template>
      </el-table-column>
      <el-table-column v-if="tableOption.label"
                       :width="tableOption.width"
                       :label="tableOption.label"
                       align="center"
                       class-name="small-padding fixed-width">
         <template slot-scope="scope">
            <el-button v-for="(item, index) in tableOption.options"
                       :key="index"
                       :type="item.type"
                       :icon="item.icon"
                       @click="handleButton(item, scope.row, scope.$index)"
                       size="mini">
               {{ item.label }}
            </el-button>
         </template>
      </el-table-column>
   </el-table>
</template>

<script>
/*
 * simpleTable 组件说明
 * import simpleTable from '@/components/simpleTable/index';
 *
 * */
export default {
   props: {
      tableData: {
         type: Array,
         default: () => {
            return [];
         },
      },
      tableLabel: {
         type: Array,
         default: () => {
            return [];
         },
      },
      tableOption: {
         type: Object,
         default: () => {
            return {};
         },
      },
   },
   components: {},
   methods: {
      handleButton(button, row, index) {
         this.$emit("buttons", { button, row, index });
      },
   },
};
</script>
<style lang="scss" scoped>
.simpleTable {
   height: 100vh;
   & >>> .el-table__body-wrapper {
      height: calc(100% - 60px);
      overflow-y: auto;
   }
   .activeDiv {
      color: #409eff;
      cursor: pointer;
      display: inline-block;
      padding: 0 10px;
      &:hover {
         color: #66b1ff;
      }
      &:active {
         color: #3a8ee6;
      }
   }
}
</style>
