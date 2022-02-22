<template>
  <div class="commonPage">
    <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton"/>
    <Table :loadData="getList" refHead="formList" :showSortIndex="{ show: true, lable: '序号' }" :column="column" ref="TableList">
    </Table>
    <!--监测模式说明-->
    <el-dialog
        title="监测模式说明"
        center
        :visible.sync="popShow"
        v-if="popShow"
        width="450px"
        custom-class="role_dialog"
        :close-on-click-modal="false"
    >
      <formList ref="formListPop" :loading="loading" :config="configPop" :formObj="formObjPop" :list="listPop" @button="formButtonPop"/>
    </el-dialog>
  </div>
</template>
<script>
/*
* meditationListen
* */
import Table from '@/components/Table/index';
import formList from "@/components/FormList";
import {analysisList, monitorDetail, monitorUpdatePut} from "@/api/meditation";
export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      config:{
        hasLoading:false,
        inline:true,
        allRequired:false,
        size:"mini",
        inputStyle:{
          width:'200px',
        },
        buttons:[
          {
            funType:'confirm',
            type:'primary',
            name:'查询'
          },
          {
            funType:'reset',
            type:'primary',
            name:'重置'
          },
          {
            funType:'instr',
            type:'primary',
            name:'监测模式说明',
            maxlength:300
          }

        ]
      },
      formObj:{},
      list:[
        {
          code:'keyword',
          label:'用户昵称/用户id',
        },
        {
          el: 'date',
          code: 'startTime',
          label: '开始时间',
          endCode: 'endTime',
          timeError: '开始时间要小于结束时间',
        },
        {
          el: 'date',
          code: 'endTime',
          label: '结束时间',
          timeError: '结束时间要大于开始时间',
          starCode: 'startTime',
        },
      ],
      // 表头
      column: [
        {
          prop: 'startTime',
          label: '冥想开始时间',
        },
        {
          prop: 'typeName',
          label: '类型',
        }, {
          prop: 'userId',
          label: '用户ID',
        },
        { prop: 'nickname', label: '用户昵称',actives:[
            {
              name: (val)=>val.nickname||'',
              method: val => this.$router.push(`/operation/userDetail?userId=${val.userId}`),
            },
          ]
        },
        // {
        //   prop: 'nickname',
        //   label: '用户昵称',
        // },
        {
          prop: 'endTime',
          label: '冥想结束时间',
        },
      ],
      formObjPop:{},
      popShow:false,
      loading:false,
      configPop:{
        hasLoading:true,
        inline:false,
        allRequired:true,
        colon:'',
        buttonsArea:'popButtom',
        inputStyle:{
          width:'300px',
        },
        buttons:[
          {
            funType:'cancel',
            type:'none',
            name:'取消'
          },
          {
            funType:'confirm',
            type:'primary',
            name:'确定'
          },
        ]
      },
      listPop:[
        {
          el:'textArea',
          code:'monitorValue',
          label: '',
          maxlength:300,
          rows:18
        },
      ],

    };
  },
  computed: {
    getList() {
      return analysisList;
    },
  },
  created () {
    this.getMonitor()
  },
  methods: {
    // 获取冥想说明
    getMonitor(){
      monitorDetail().then(res => {
        this.formObjPop.monitorValue=res.data
      })
    },
    // 搜索查询
    formButton(val){
      if (val.name=='confirm' &&(val.text=='查询'||val.text=='input')  &&val.valid) {
        let data=val.value
        this.$refs.TableList.update({...data})
      }
      if (val.name=='instr') {
        this.popShow=true
      }

    },
    // 说明弹窗按钮
    formButtonPop(val){
      if (val.name=='confirm'&&val.valid) {
        let data=val.value
        this.loading=true
        monitorUpdatePut({...data}).then(res => {
          this.$message.success(res.data);
        }).finally(res=>{
          this.loading=false
          this.getMonitor()
        })
      }
      if (val.name=='cancel') {
        this.popShow=false
      }

    }
  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
