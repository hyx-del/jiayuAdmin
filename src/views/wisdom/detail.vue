
<template>
  <div class="commonPage">
    <div class="myDetail">
      <div class="buttons">
        <el-button @click="backList" type="danger" size="small">返回列表</el-button>
      </div>
      <div class="detail_left">
        <div class="detail_title">智慧基本信息</div>
        <div class="formShowH">
          <formShow ref="formShow" :config="config" :formObj="formObj" :list="list"/>
        </div>
      </div>
<!--      <div class="detail_right">-->
<!--        <el-tabs refHead="200" v-model="activeName" @tab-click="handleClick">-->
<!--          <el-tab-pane :label="`练习进度${courseData.length>0?`(${courseData.length})`:''}`" name="1">-->
<!--            <Table-->
<!--                :single="false"-->
<!--                :loadData="courseList"-->
<!--                :params="{courseId:id}"-->
<!--                :headHight="400"-->
<!--                :column="courseColumn"
                    :params="{ enable: 1 }"
-->
<!--                ref="courseTable">-->
<!--            </Table>-->
<!--          </el-tab-pane>-->
<!--        </el-tabs>-->
<!--      </div>-->
    </div>
  </div>
</template>
<script>
/*
* /content/wisdom/detail 幸福智慧详情
* */
import Table from '@/components/Table/index';
import {Message} from 'element-ui';

import formShow from "@/components/FormList/listShow";
import formList from "@/components/FormList";
import {getChoose, getColumnCourse, listCourse} from "@/api/course";
import {getScreenList} from "@/api/yogaManage";
import {coachesCourse, getCoach, getCoachLevelList} from "@/api/coach";
import simpleTable from "@/components/simpleTable";
import {getSalesRoomTree} from "@/api/admin";
import {wikiColumnList, wikiList} from "@/api/wiki";
import {mediationDetail, mediationUserPracticeList} from "@/api/meditation";
import {jnanaDetail, jnanaUserPracticeList} from "@/api/wisdom";

export default {
  name: 'versionManage',
  components: {
    Table,
    formShow,
    formList,
    simpleTable
  },
  data() {
    return {
      courseChooseList:[],
      courseData:[],

      activeName:'1',
      config:{
        hasLoading:false,
        inline:false,
        allRequired:false,
        buttons:[]
      },
      formObj:{},
      list:[
        {
          code:'name',
          label:'智慧标题'
        },
        // {
        //   code:'sort',
        //   label:'展示顺序',
        // },
        {
          code:'author',
          label:'作者',
        },
        {
          code:'viewNum',
          label:'实际播放次数',
          default:'0'
        },
        {
          code:'virtualPlay',
          label:'虚拟播放次数',
          default:'0'
        },
        {
          code:'virtualNum',
          label:'总播放次数',
          default:'0'
        },
         {
          code:'collectionsNum',
          label:'收藏次数',
          default:'0'
        },
        {
          code:'time',
          label:'时长',
          unit:'分钟',
        },
        {
          code:'payType',
          label:'支付类型',
          valueChange:(val,obj)=>[
            {
              code:'scorePrice',
              show:val!=0
            },
            {
              code:'cashPrice',
              show:val==2
            },
            {
              code:'applePurchaseId',
              show:val==2
            },
            {
              code:'auditionStartTime',
              show:val!=0
            },
            {
              code:'auditionEndTime',
              show:val!=0
            },
            {
              code:'effectiveTimeType',
              list:[
                {
                  label: '有限时长',
                  value: '0',
                  disabled:val==0
                },
                {
                  label: '永久有效',
                  value: '1',
                },
              ]
            },

          ],
          list:[
            {
              label: '免费',
              value: 0,
            },
            {
              label: '积分付费',
              value: 1,
            },
            {
              label: '积分+现金付费',
              value: 2,
            }
          ]
        },
        {
          code: "scorePrice",
          label: "积分价格",
          default:'0'
        },
        {
          code: "cashPrice",
          label: "现金价格",
          unit: "元",
        },
        {
          code: "applePurchaseId",
          label: "苹果内购id",
        },
        {
          code: "auditionStartTime",
          label: "试听开始时间",
          unit: "秒",
        },
        {
          code: "auditionEndTime",
          label: "试听结束时间",
          unit: "秒",
        },
        {
          code: "effectiveTimeType",
          label: "有效时长",
          valueChange:(val)=>[
            {
              code: "effectiveTime",
              show: val==0,
            }
          ],
          list:[
            {
              label: '有限时长',
              value: 0,
            },
            {
              label: '永久有效',
              value: 1,
            },
          ]
        },
        {
          code: "effectiveTime",
          label: "时长",
          unit:'月',
        },
        {
          el:'img',
          code:'coverUrl',
          label:'封面图',
        },
        {
          el:'img',
          code:'backgroundUrl',
          label:'播放背景图',
        },
        {
          code:'introduce',
          label:'简介',
        },
      ],
      //课程表头
      courseColumn:[
        {
          prop:'userName',
          label:'用户名称',
        },
        {
          prop:'totalDay',
          label:'今日练习（分钟）',
        },
        {
          prop:'todayTime',
          label:'累计练习（分钟）',
        },
        {
          prop:'continueDay',
          label:'连续练习（天）',
        },
        {
          prop:'totalTime',
          label:'累计练习（天）',
        },
        {
          prop:'completeCount',
          label:'完成次数',
        },
        {
          prop:'state',
          label:'状态',
          formatter: (row, column) =>row.state==1?'加入训练':''
        },
        {
          prop:'joinTime',
          label:'加入时间',
        },
      ],
    };
  },
  computed: {
    courseList() {
      return jnanaUserPracticeList;
    },
  },
  created () {
    if (this.$route.query.id) {
      this.edit=true
      this.id=this.$route.query.id
      jnanaDetail({id:this.$route.query.id}).then(res=>{
        let mid={}
        res.data.jananColumnVOS.forEach(item=>{
          item.code='jananColumnVOS'+item.id
          item.label=item.name+'顺序'
          this.list.splice(1,0,item)
          mid['jananColumnVOS'+item.id]=item.sort
        })
        this.formObj= {...res.data,...mid}
      })
    }
  },
  mounted () {
  },
  methods: {
    backList(){
      this.$router.push({
        path: '/content/wisdom/index',
      })
    },
    handleClick(){},
  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');

.myDetail{
  display: flex;
  justify-content: space-between;
  .buttons{
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
  }
  .detail_left{
    flex-shrink: 0;
    width: 420px;
    padding-right: 20px;
    border-right: 1px solid #eee;
  }
  .formShowH{
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;
  }
  .detail_right{
    width: 100%;
    padding-left: 20px;

  }
  .detail_title{
    font-size:24px;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
}
.popButton{
  display: flex;
  //justify-content: flex-end;
  justify-content: center;
}
.save{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.pop >>> .el-pagination__jump:not([class*=suffix]){
  margin-right: 30px;
}
</style>
