
<template>
  <div class="commonPage">
    <el-button type="primary" size="small" @click="addForm()">新加</el-button>
    <Table :loadData="getList" :column="column" ref="TableList" :showSortIndex="{ show: true, lable: '序号' }">
    </Table>
    <!-- 新增/编辑 -->
    <el-dialog
        :title="title"
        center
        :visible.sync="dialogFormVisible"
        v-if="dialogFormVisible"
        @close="resetForm('form')"
        width="460px"
        custom-class="role_dialog"
        :close-on-click-modal="false"
    >
      <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton"/>
    </el-dialog>
  </div>
</template>
<script>
/*
* wiki 百科栏目
* */

import Table from '@/components/Table/index';
import { parseTime } from '@/utils';
import { Message } from 'element-ui';

import formList from "@/components/FormList";
import {wikiColumnList, wikiColumnAdd, wikiColumnUpdate, enableWikiColumn, enableWiki} from "@/api/wiki";
export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      title:'新加栏目',
      edit:true,
      dialogFormVisible:false,
      config:{
        hasLoading:true,
        inline:false,
        allRequired:true,
        buttonsArea:'popButtom',
        inputStyle:{
          width:'100%'
        },
        buttons:[
          {
            funType:'confirm',
            type:'primary',
            name:'确定'
          },
          {
            funType:'reset',
            type:'primary',
            name:'取消'
          }
        ]
      },
      formObj:{},
      // 表单
      list:[
        {
          code:'name',
          label:'栏目名称',
          maxlength:20,
        },
        {
          code:'sort',
          label:'顺序',
          type:'number'
        },
      ],
      // 表头
      column: [
        {
          prop: 'name',
          label: '栏目名称',
        },
        {
          prop: 'sort',
          label: '顺序',
        },
        {
          prop: 'enable',
          label: '启用/禁用',
          switch: true,
          fun:enableWikiColumn
        },
        {
          prop: 'action',
          label: '操作',
          fixed: 'right',
          actives: [
            {
              name: '修改',
              method: val => {
                console.log(val)
                this.formObj=val
                this.edit=true
                this.title='编辑'
                this.dialogFormVisible=true
              },
            },
          ],
        },
      ],
    };
  },
  computed: {
    getList() {
      return wikiColumnList;
    },
  },
  methods: {
    // 新加栏目
    addForm(){
      this.edit=false
      this.dialogFormVisible=true
    },// 新加栏目
    resetForm(){
      this.$refs.formList.reset()
    },
    // 添加修改
    formButton(val){
      if (val.name=='confirm'&&val.valid) {
        let data=val.value
        if (this.edit) {
          wikiColumnUpdate(data).then(res=>{
            this.dialogFormVisible=false
            this.$refs.TableList.update({})
          })
        }else{
          // 新加
          wikiColumnAdd(data).then(res=>{
            this.dialogFormVisible=false
            this.$refs.TableList.update({})
          })
        }

      }
      if (val.name=='reset') {
        this.dialogFormVisible=false
      }
    },

  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
