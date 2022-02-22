
<template>
  <div class="commonPage">
    <el-button type="primary" size="small" @click="addForm()">新加</el-button>
    <Table :loadData="getList" :column="column" ref="TableList" :showSortIndex="{ show: true, lable: '序号' }"></Table>
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
* meditation 冥想栏目
* */
import Table from '@/components/Table/index';
import formList from "@/components/FormList";
import {
  enableMeditationColumn,
  mediationColumnList,
  mediationColumnSavePost, mediationColumnStateChange,
  mediationColumnUpdatePost,
  mediationUserPracticeList,
  meditationColumnAdd,
  meditationColumnList,
  meditationColumnUpdate
} from "@/api/meditation";
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
          fun:mediationColumnStateChange,
          switch: true
        },
        {
          prop: 'action',
          label: '操作',
          fixed: 'right',
          actives: [
            {
              name: '修改',
              method: val => {
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
      return mediationColumnList;
    },
  },
  methods: {
    // 新加栏目
    addForm(){
      this.edit=false
      this.dialogFormVisible=true
    },
    // 重置列表
    resetForm(){
      this.$refs.formList.reset()
    },
    // 添加修改
    formButton(val){
      if (val.name=='confirm'&&val.valid) {
        let data=val.value
        if (this.edit) {
          mediationColumnUpdatePost(data).then(res=>{
            this.dialogFormVisible=false
            this.$refs.TableList.update({})
          })
        }else{
          // 新加
          mediationColumnSavePost(data).then(res=>{
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
