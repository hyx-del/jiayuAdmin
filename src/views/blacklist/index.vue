<template>
	<div class="commonPage">
		<formList ref="formList" :config="config" :formObj="formObj" :list="list" @button="formButton" />
		<Table :loadData="getList" refHead="formList" :showSortIndex="{ show: true, lable: '序号' }" :column="column" ref="TableList"></Table>
    <!-- 新增/编辑 -->
    <el-dialog v-if="dialogVisible" @close="handleClose" title="黑名单" :visible.sync="dialogVisible" width="500px" custom-class="dialog_content" :close-on-click-modal="false">
      <div class="popBody">
        <formList ref="popFormList" :loading.sync="loading" :config="popConfig" :formObj="popObj" :list="popList"  @button="popFormButton"/>
      </div>
      <div slot="footer" class="popButton">
        <el-button size="small" type="danger" @click="handleClose">取 消</el-button>
        <el-button size="small" type="primary" @click="handleOK()">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
/*
 * jnana jnanaStateChange
 * */
// import { regionData, CodeToText } from 'element-china-area-data';
import Table from '@/components/Table/index';

import formList from '@/components/FormList';
import { jananColumnList, jnanaDelete, jnanaList, jnanaStateChange ,jnanaUpdateSort} from '@/api/wisdom';
import {adminUserBlacklistDetailbyphone, adminUserBlacklistList, adminUserBlacklistUpdatePost} from '@/api/blacklist'
export default {
	components: {
		Table,
		formList,
	},
	data() {
		return {
      dialogVisible:false,
      loading:false,
      popObj: {},
      popConfig:{
        hasLoading: false,
        inline: false,
        allRequired: true,
        size:"mini",
        inputStyle: {
          width: '200px',
        },
        buttons: [],
      },
      popList:[
        {
          code:'userPhone',
          label: '手机号',
          type:'phone',
          maxlength:11,
          inSlot:{
            el:'button',
            size:'mini',
            text:'查询',
            style:{
              marginLeft:'10px'
            },
            check:true,
            click:(phone,obj)=>{
              adminUserBlacklistDetailbyphone({phone})
                  .then(({code,data}) => {
                    this.popObj=data
                  })
                  .catch(()=>{
                    this.popObj={
                      userId:'',
                      id:'',
                      userNikename:'',
                    }
                  })
            }
          }
        },
        {
          code:'userId',
          label: '用户ID',
          disabled:true,
        },
        {
          code:'userNikename',
          label: '用户昵称',
          disabled:true,
        },
        {
          el:'checkbox',
          code:'disableFunction',
          label: '禁用功能',
          list:[
            {
              label:'禁止评论',
              value:'1'
            }
          ]
        },
      ],
			columnForm: {},
			dialogFormVisible: { bl: false },
			config: {
				hasLoading: false,
				inline: true,
				allRequired: false,
				size:"mini",
				inputStyle: {
					width: '200px',
				},
				buttons: [
					{
						funType: 'confirm',
						type: 'primary',
						name: '查询',
					},
					{
						funType: 'reset',
						type: 'primary',
						name: '重置',
					},
					{
						funType: 'add',
						type: 'primary',
						name: '添加',
						icon: 'el-icon-plus',
					},
				],
			},
			formObj: {},
			list: [
				{
					code: 'userNikename',
					label: '昵称',
				},
				{
					code: 'userPhone',
					label: '电话',
				},
			],
      disableObj:{
			  1:'禁止评论'
      },
			// 表头
			column: [
        {
          label: '用户ID',
          prop: 'userId',
        },
        {
          label: '用户昵称',
          prop: 'userNikename',
        },
        {
          label: '用户电话',
          prop: 'userPhone',
        },
        {
          label: '禁用功能',
          prop: 'disableFunction',
          html:(row,val)=>val&&val.map(v=>this.disableObj[v]).join(',')
        },
        {
          label: '更新时间',
          prop: 'updateTime',
        },
        {
          label: '操作人',
          prop: 'operator',
        },
        {
					prop: 'action',
					label: '操作',
					fixed: 'right',
					width: 140,
					actives: [
						{
							name:({disableFunction})=>disableFunction.length>0 ?'解禁':'',
							method: value => {
                this.$confirm('是否解除该用户?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  adminUserBlacklistUpdatePost({...value,disableFunction:[]}).then(res=>{
                    this.$message.success('解禁成功');
                    this.$refs.TableList.update()
                  })
                })

							},
						},
            {
              name:({disableFunction})=>disableFunction.length==0 ?'拉黑':'',
              method: value => {
                this.popObj=value
                this.dialogVisible=true
              },
            },

					],
				},
			],
		};
	},
	computed: {
		getList() {
			return adminUserBlacklistList;
		},
	},
	methods: {
	  // 添加的确认事件
    handleOK(){
      this.$refs.popFormList.confirm()
    },
	  // 添加的确认事件
    popFormButton({value}){
      if (value.userId) {
        value.disableFunction=value.disableFunction.split(',').map(v=>Number(v))
        adminUserBlacklistUpdatePost({...value}).then(res=>{
          this.$message.success('加入黑名单成功');
          this.$refs.TableList.update()
          this.handleClose()
        })
      }
    },
    handleClose(){

      this.popObj={}
      this.$refs.popFormList.reset()
      this.dialogVisible=false
    },
		// 搜索查询
		formButton(val) {
			if (val.name == 'confirm' && val.valid) {
				let data = val.value;
				this.$refs.TableList.update({ ...data });
			}
			if (val.name == 'add') {
			  this.dialogVisible=true

			}
		},


	},
};
</script>
<style lang="scss" scoped>
@import url('~@/styles/common.scss');
</style>
