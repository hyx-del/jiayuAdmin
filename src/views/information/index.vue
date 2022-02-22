<template>
   <div class="commonPage">
      <formList ref="formList"
                :config="config"
                :formObj="formObj"
                :list="list"
                @button="formButton" />
      <Table :loadData="getList"
             refHead="formList"
             :column="column"
             ref="TableList"
             :showSortIndex="{ show: true, lable: '序号' }">
         <template v-slot:enable="{ scope }">
            <el-switch v-model.trim="scope.enable"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       :active-value="1"
                       :inactive-value="0"
                       @change="bannedChange(scope, 'enable')"></el-switch>
         </template>
      </Table>
      <v-dialog title="修改顺序值"
                :model="columnForm"
                :visible="dialogSort"
                :list="dialogList"
                @submit="changePasswords"
                v-if="dialogSort.bl"></v-dialog>
   </div>
</template>
<script>
/*
 * information 新闻列表
 * */

import Table from '@/components/Table/index';
import { Message } from 'element-ui';
import { delSalesRoom, editSalesRoom, addSalesRoom, getSalesRoomList } from '@/api/admin';

import formList from '@/components/FormList';
import { newslist, editNewsState, newsDel, newsEnable ,newsSort} from '@/api/news';
import { wikiDelete } from '@/api/wiki';
import { stateList, stateObj } from '@/utils/systemEnum';
import { courseColumnEnable } from '@/api/course';
import { testTimeIn } from '@/utils';
import vDialog from "@/components/dialog/index.vue";

export default {
   name: 'versionManage',
   components: {
      Table,
      formList,
      vDialog,
   },
   data() {
      return {
         columnForm: {},
         dialogSort: { bl: false },
         dialogList: [{ label: "修改顺序值", code: "sort", maxLength: 5, type: "number", width: '120px' }],
         config: {
            hasLoading: false,
            inline: true,
            allRequired: false,
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
                  name: '添加新闻',
                  icon: 'el-icon-plus',
               },
            ],
         },
         formObj: {},
         list: [
            {
               code: 'title',
               label: '新闻标题',
               // required:true
            },
            {
               el: 'date',
               code: 'startTime',
               label: '开始时间',
               endCode: 'endTime',
               timeError: '开始时间要小于结束时间',
               required: false,
            },
            {
               el: 'date',
               code: 'endTime',
               label: '结束时间',
               required: false,
               timeError: '开始时间要小于结束时间',
               starCode: 'startTime',
            },
            {
               el: 'select',
               code: 'state',
               label: '显示状态',
               list: stateList,
            },
         ],
         // 表头
         column: [
            {
               prop: 'createTime',
               label: '添加时间',
            },
            {
               prop: 'title',
               label: '新闻标题',
            },
            {
               prop: 'praise',
               label: '点赞数',
               formatter: (row, column) => row.praise || 0,
            },
            // {
            //    prop: 'reading',
            //    label: '真实浏览量',
            //    formatter: (row, column) => row.reading || 0,
            // },
            // {
            //    prop: 'readintRandom',
            //    label: '虚拟浏览量',
            //    formatter: (row, column) => row.readintRandom || 0,
            // },
            {
               prop: 'countReadint',
               label: '总浏览量',
               formatter: (row, column) => row.countReadint || 0,
            },
            {
               prop: 'sort',
               label: '置顶顺序',
               type: 'number',
               actives: [
                  {
                     name: (val) => val.sort || '未填写',
                     method: (val) => {
								this.columnForm.id=val.id
                        this.dialogSort = { bl: true };
                     },
                  }
               ]

            },
            {
               prop: 'startTime',
               label: '开始时间',
               time: true,
            },
            {
               prop: 'endTime',
               label: '结束时间',
               time: true,
            },
            {
               prop: 'state',
               label: '显示状态',
               state: true,
            },
            {
               prop: 'enable',
               label: '启用/禁用',
               render: true,
            },
            {
               prop: 'action',
               label: '操作',
               width: 140,
               fixed: 'right',
               actives: [
                  {
                     name: '编辑',
                     method: val => {
                        console.log('======>>val', val);
                        this.$router.push({
                           path: '/content/information/add',
                           name: '添加资讯',
                           params: { ...val },
                        });
                     },
                  },
                  {
                     name: '详情',
                     method: val => {
                        this.$router.push({
                           path: '/content/information/detail',
                           query: { id: val.id },
                        });
                     },
                  },
               ],
            },
         ],
      };
   },
   computed: {
      getList() {
         return newslist;
      },
   },
   methods: {
      // 搜索查询
      formButton(val) {
         if (val.name == 'confirm' && val.valid) {
            let data = val.value;
            this.$refs.TableList.update({ ...data });
         }
         if (val.name == 'add') {
            this.$router.push({
               path: '/content/information/add',
            });
         }
      },
      // 禁用状态切换
      bannedChange(item, code) {
         let data = { id: item.id, [code]: Number(item[code]) };
         if (code == 'enable') {
            let endTime = new Date(item.endTime || '2300').getTime();
            let newTime = new Date().getTime();
            if (item.enable == 1 && endTime < newTime) {
               this.$message.error('改条资讯已过定时展示时间，请重置展示时间后再启用');
               this.$refs.TableList.reset();
            } else {
               newsEnable(data)
                  .then(res => {
                     this.$message.success('操作成功');
                  })
                  .finally(() => {
                     this.$refs.TableList.reset();
                  });
            }
         }
      },
		//修改顺序
      changePasswords(e) {
         console.log(e);
			newsSort(e).then(res=>{
			if(res.code==200){
				this.$message.success("修改成功")
				this.$refs.TableList.reset()
			}else{
				this.$message.error('修改失败')
			}
			})
      },
   },
};
</script>
<style lang="scss" scoped>
.commonPage {
   padding: 20px;
}
</style>
