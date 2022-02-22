
<template>
  <div class="commonPage">
    <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton"/>
    <Table :loadData="getList" refHead="formList" :showSortIndex="{ show: true, lable: '序号' }" :column="column" ref="TableList"></Table>
    <!--新加、编辑数据弹窗-->
    <el-dialog
        :title="title"
        center
        :visible.sync="popShow"
        v-if="popShow"
        width="450px"
        ref="dialog"
        custom-class="role_dialog"
        :close-on-click-modal="false"
    >
      <formList ref="formListPop" :config="configPop" :formObj="formObjPop" :list="listPop" @button="formButtonPop"/>
    </el-dialog>
  </div>
</template>
<script>
// 热门搜索
import Table from '@/components/Table/index';
import formList from "@/components/FormList";
import {searchList, searchSavePost, searchUpdatePut, stateChangePut} from "@/api/search";

export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      // title:'新加',
      add:true,
      popShow:false,
      config:{
        hasLoading:false,
        inline:true,
        allRequired:false,
        inputStyle:{
          width:'300px',
        },
        buttons:[
          // {
          //   funType:'confirm',
          //   type:'primary',
          //   name:'查询'
          // },
          // {
          //   funType:'reset',
          //   type:'primary',
          //   name:'重置'
          // },
          {
            funType:'add',
            type:'primary',
            name:'添加关键词',
            icon:'el-icon-plus'
          }
        ]
      },
      formObj:{},
      list:[],
      configPop:{
        hasLoading:true,
        inline:false,
        allRequired:true,
        buttonsArea:'popButtom',
        inputStyle:{
          width:'300px',
        },
        buttons:[
          {
            funType:'reset',
            type:'primary',
            name:'重置'
          },
          {
            funType:'confirm',
            type:'primary',
            name:'确定'
          },
        ]
      },
      formObjPop:{},
      listPop:[
        {
          code:'keyword',
          label: '关键词',
          maxlength:20
        },
        {
          code: 'sort',
          label: '顺序',
          type:'number',
          maxlength:4
        },
      ],
      // 表头
      column: [
        {
          prop: 'keyword',
          label: '关键词',
        },
        {
          prop: 'sort',
          label: '顺序',
        },
        {
          prop: 'enable',
          label: '启用/禁用',
          switch: true,
          fun:stateChangePut
        },
        {
          prop: 'action',
          label: '操作',
          fixed: 'right',
          width:140,
          actives: [
            {
              name: '修改',
              method: val => {
                this.add=false
                this.popShow=true
                this.formObjPop=val
                console.log(this.add)
              },
            },
          ],
        },
      ],
    };
  },
  computed: {
    getList() {
      return searchList;
    },
    title(){
      return this.add?'新加':'编辑'
    }
  },
  methods: {
    // 搜索查询
    formButton(val){
      if (val.name=='add') {
        this.formObjPop={}
        this.add=true
        this.popShow=true
      }
    },
    // 搜索查询
    formButtonPop(val){
      if (val.name=='confirm'&&val.valid) {
        let data=val.value
        if (this.add) {
          searchSavePost(data).then(res=>{
            this.$message.success('新加成功');
          }).finally(() => {
            this.popShow=false
            this.$refs.TableList.update({})
          })
        }else{
          searchUpdatePut(data).then(res=>{
            this.$message.success('修改成功');
          }).finally(() => {
            this.popShow=false
            this.$refs.TableList.update({})
          })
        }
        console.log(data)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
