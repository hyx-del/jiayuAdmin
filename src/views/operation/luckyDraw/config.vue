
<template>
  <div class="commonPage">
    <el-row ref="button">
      <el-button type="primary" size="small" @click="addForm()">抽奖规则说明</el-button>
    </el-row>
    <Table :loadData="getList" :column="column" ref-head="button" ref="TableList" :showSortIndex="{ show: true, lable: '序号' }">
    </Table>
    <!-- 抽奖规则说明 -->
    <el-dialog
        title="抽奖规则说明"
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
    <!-- 修改记录 -->
    <el-dialog
        title="修改记录"
        center
        :visible.sync="dialogTable"
        v-if="dialogTable"
        width="600px"
        custom-class="role_dialog"
        :close-on-click-modal="false"
    >
      <Table :loadData="getListPop" :params="{ prizeId: prizeId }" :column="columnPop" ref="TableList2" />
    </el-dialog>

    <!-- 修改抽奖 -->
    <el-dialog
        title="修改抽奖"
        center
        :visible.sync="dialogTab"
        v-if="dialogTab"
        width="800px"
        top="5vh"
        ref="dialog"
        custom-class="role_dialog"
        :close-on-click-modal="false"
        @close="upTabel"
    >
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane v-for="item in luckPrize" :key="item.id" :label="`奖品${item.cursorIndex}`" :name="item.cursorIndex">
          <div class="tabPane">
            <div class="tabPaneSon">
              <formList ref="formList" @formChange="formChange" :config="configTabs" :formObj="formObjTabs" :list="listTabs" @button="formButtonTabs">
                <template #total>
                  {{probability}}%
                </template>
                <template #tabes>
                  <div class="rotary">
                    <div class="rotary_item" :class="{active:pickerOptions[index].position==activeName}" v-for="(item,index) in  rotaryList" :key="item">{{pickerOptions[index].position}}</div>
                  </div>
                </template>
                <template #prizeInput>
                  <el-input size="small"  style="width: calc(100% - 172px);" v-if="formObjTabs.prizeType==0" @blur="prizeInputBlur" v-model="prizeInputValue" placeholder="请输入积分"></el-input>
                </template>
              </formList>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>
<script>
/*
*  奖品配置
* */

import Table from '@/components/Table/index';
import formList from "@/components/FormList";
import {
  luckPrizeFindlist, luckPrizeList,
  luckprizeLogList,
  luckPrizeUpdatePut,
  prizeExplainGet,
  prizeExplainUpdatePut
} from "@/api/luckyDraw";
export default {
  components: {
    Table,
    formList,
  },
  data() {
    return {
      title:'新加栏目',
      edit:true,
      // 奖品信息
      luckPrize:[],
      rotaryList:[1,2,3,4,5,6,7,8,9],
      pickerOptions:[
        {
          position: 1,
        },
        {
          position: 2,
        },
        {
          position: 3,
        },
        {
          position: 8,
        },
        {
          position: '',
        },
        {
          position: 4,
        },
        {
          position: 7,
        },
        {
          position: 6,
        },
        {
          position: 5,
        },],
      activeName:1,
      prizeInputValue:'',
      dialogTab:false,
      dialogTable:false,
      dialogFormVisible:false,
      prizeId:'1',
      config:{
        hasLoading:true,
        inline:false,
        allRequired:true,
        colon:'',
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
      configTabs:{
        hasLoading:false,
        inline:false,
        allRequired:true,
        buttonsArea:'popButtom',
        mainStyle:{
          width:'80%',
          marginLeft:'10%'
        },
        inputStyle:{
          width:'100%',
        },
        buttons:[
          {
            funType:'confirm',
            type:'primary',
            name:'保存'
          },
          {
            funType:'reset',
            type:'primary',
            name:'取消'
          }
        ]
      },
      formObjTabs:{},
      listTabs:[
        {
          el:'slot',
          code:'adc',
          slotName:'total',
          label:'总中奖概率',
          required:false
        },
        {
          el:'slot',
          code:'adc12',
          slotName:'tabes',
          label:'展示位置',
        },
        {
          el:'radio',
          code:'prizeType',
          label:'奖品类型',
          afterSlot:'prizeInput',
          list:[
            {
              value:'0',
              label:'积分'
            },
            {
              value:'1',
              label:'商品'
            }
          ]
        },
        {
          code:'name',
          label:'奖品名称',
        },
        {
          code:'ratePercentage',
          label:'中奖概率',
          suffix:'%',
          maxCode:100,
        },
        {
          el:'img',
          code:'coverUrl',
          label:'奖品图片',
          ratio:'200/200'
        },
      ],
      formObj:{
        monitorValue:''
      },
      // 表单
      list:[
        {
          el:'textArea',
          code:'monitorValue',
          label:'',
          maxlength:1000,
          rows:18
        },
      ],
      // 表头
      column: [
        {
          prop:'coverUrl',
          label:'奖品图片',
          img:true
        },
        {
          prop:'name',
          label:'奖品名称',
        },
        {
          prop:'rate',
          label:'权重',
        },
        {
          prop:'ratePercentage',
          label:'中奖概率(%)',
          html:(val)=>`${val.ratePercentage||0}%`
        },
        {
          prop:'prizeType',
          label:'奖品类型',
          html:(val)=>`${val.prizeType==0?'积分':'商品'}`
        },
        {
          prop:'adc',
          label:'修改记录',
          actives: [
            {
              name: '修改记录',
              method: val => {
                console.log('val',val)
                this.prizeId=val.id
                this.dialogTable=true
              },
            },
          ],
        },
        {
          prop: 'action',
          label: '操作',
          fixed: 'right',
          actives: [
            {
              name: '修改',
              method: val => {
                this.getFindlist(()=>{
                  this.dialogTab=true
                  this.activeName=val.cursorIndex
                  this.tabClick()
                })
              },
            },
          ],
        },
      ],
      // 弹窗的表头
      columnPop:[
        {
          prop:'nickname',
          label:'修改人'
        },
        {
          prop:'createTime',
          label:'修改时间'
        },
        {
          prop:'name',
          label:'奖品名称'
        },
        {
          prop:'coverUrl',
          label:'奖品图片',
          img:true
        },
        {
          prop:'ratePercentage',
          label:'中奖概率(%)',
          html:(val)=>`${val.ratePercentage||0}%`
        },
      ],
    };
  },
  computed: {
    probability() {
      let n=1000000000
      let num=(this.luckPrize||[]).map(item=>item.ratePercentage*n||0)
      let nums=0;
      console.log(num)
      num.forEach(item=>nums+=item)
      // console.log(this.luckPrize[this.activeName])
      return isNaN(nums/n)?'概率输入有问题':nums/n;
    },
    getList() {
      return luckPrizeList;
    },
    getListPop() {
      return luckprizeLogList;
    },
  },
  created () {
    this.getDetail()
    this.getFindlist()
  },
  methods: {
    upTabel(obj=null){
      this.$refs.TableList.update(obj);
    },
    // 积分输入后验证
    prizeInputBlur(){
      if (!/^[0-9]*$/.test(this.prizeInputValue)) {
        this.prizeInputValue=''
        this.$message.error('积分需要输入数字');
      }else{
        this.luckPrize[this.activeName - 1].score=this.prizeInputValue||''
      }
    },
    // 切换
    tabClick(val){
     let tb=this.luckPrize.filter(v=>v.cursorIndex==this.activeName)
      this.prizeInputValue=tb[0].score
      this.formObjTabs=JSON.parse(JSON.stringify(tb[0]))
      this.$forceUpdate();
    },
    // 奖品信息
    getFindlist(back){
      luckPrizeFindlist().then(res=>{
        this.luckPrize=res.data
        back&&back()
      })
    },
    getDetail(){
      prizeExplainGet().then(res=>{
        this.formObj.monitorValue=res.data
      })
    },
    // 获取奖品说明
    addForm(){
      this.edit=false
      this.dialogFormVisible=true
    },// 新加栏目
    resetForm(){
      this.$refs.formList.reset()
    },
    // 抽奖规则说明
    formButton(val){
      if (val.name=='confirm'&&val.valid) {
        prizeExplainUpdatePut(val.value).then(res => {
          this.$message.success('操作成功');
        }).finally(()=>{
          this.dialogFormVisible=false
          this.getDetail()
        })
      }
      if (val.name=='reset') {
        this.dialogFormVisible=false
      }
    },
    formChange(val){
      this.luckPrize[this.activeName - 1][val.code]=val.value||''
      // 奖品类型
      if (val.code=='prizeType') {
        this.formObjTabs.prizeType=val.value
        this.prizeInputValue=0
      }
    },
    // 修改奖品
    formButtonTabs(val){
      console.log('this.luckPrize',this.luckPrize)
      if (val.name=='confirm'&&val.valid) {
        luckPrizeUpdatePut({luckPrizeVOS:this.luckPrize}).then(res => {
          this.$message.success('操作成功');
        }).finally(()=>{
          this.upTabel()
        })
      }else{
        this.dialogTab=false
        this.upTabel()
      }
    },

  },
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
.tabPane{
  position: relative;
  height: 680px;
  padding-bottom: 40px;
  overflow: hidden;
  .tabPaneSon{
    height: 650px;
    overflow: auto;
  }
}
.rotary{
  display: flex;
  flex-wrap: wrap;
  width: 150px;
}
.rotary_item{
  box-sizing: border-box;
  display: flex;
  justify-content:center;
  align-items: center;
  width: 50px;
  height: 50px;
  border:1px solid #eee;
  &.active{
    background: #aaa;
    color: #fff;
  }
}
</style>
