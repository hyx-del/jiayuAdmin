
<template>
  <div class="commonPage">
    <formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton"/>
    <Table :loadData="getList" refHead="formList" :showSortIndex="{ show: true, lable: '序号' }" :column="column" ref="TableList">
    </Table>
  </div>
</template>
<script>
/*
* jnana jnanaStateChange
* */
import Table from '@/components/Table/index';
import {objToUrl, parseTime} from '@/utils';
import formList from "@/components/FormList";
import { historyList} from "@/api/search";
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
          // {
          //   funType:'confirm',
          //   type:'primary',
          //   name:'导出Excel表格',
          //   icon:'el-icon-plus'
          // }
        ]
      },
      formObj:{},
      list:[
        {
          code:'nickname',
          label:'用户昵称',
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
          prop: 'keyword',
          label: '关键词',
        },
        {
          label: '用户昵称',
          actives:[ {
            name: (val)=>val.nickname||'',
            method: val => this.$router.push(`/operation/userDetail?userId=${val.userId}`),
          }]
        },
        {
          prop: 'updateTime',
          label: '搜索时间',
        },
      ],
    };
  },
  computed: {
    getList() {
      return historyList;
    },
  },
  methods: {
    // 搜索查询
    formButton(val){
      if (val.name=='confirm' &&(val.text=='查询'||val.text=='input')  &&val.valid) {
        let data=val.value
        this.$refs.TableList.update({...data})
      }
      if (val.name=='confirm'&&val.text=='导出Excel表格') {
        let data=val.value
        let url = `${process.env.VUE_APP_BASE_API}/admin/search/history/open/excelOutPut?${objToUrl(data)}`;
        window.open(url);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
