<template>
   <div class="formPage">
      <div class="formBody">
         <formList ref="formList"
                   :loading.sync="loading"
                   :config="config"
                   :formObj="formObj"
                   :list="list"
                   @button="formButton"
         />
      </div>
   </div>
</template>
<script>
import formList from "@/components/FormList/index";
import { getCoachesList } from "@/api/coach";
import { jananColumnColumnlist, jananColumnList, jnanaDetail, jnanaSavePost, jnanaUpdatePost } from "@/api/wisdom";
export default {
   components: {
      formList,
   },
   data() {
      return {
         loading: false,
         edit: false,
         list: [
            {
               code: "name",
               label: "智慧标题",
               maxlength: 100,
            },
            {
               el: "selectInput",
               code: "jananColumnVOS",
               placeholder: "请选择展示栏目",
               label: "展示栏目",
               back: true,
               labelCode: "name",
               valueCode: "id",
               selectCode: "id",
               selectPlaceholder: "请选择展示栏目",
               inputLable: "顺序值：",
               inputCode: "sort",
               inputType: "number",
               inputPlaceholder: "请输入",
               fun: jananColumnList,
               filterable: true,
               valueBack: "author",
            },
            {
               code: "virtualPlay",
               label: "虚拟播放次数",
               type: "number",
               required: false,
            },
            {
               el: "select",
               code: "coachId",
               filterable: true,
               valueBack: "author",
               label: "作者",
               back: true,
               labelCode: "name",
               valueCode: "id",
               fun: getCoachesList,
            },
             {
               el: "select",
               code: "type",
               label: "选择文件类型",
               valueChange:(val)=>{
                 return [
                   {
                     code:'resourceUrl',
                     show:val==1
                   },
                   {
                     code:'videoUrl',
                     show:val==2
                   },
                 ]
               },
               list: [
                  {
                     label: "音频",
                     value: "1",
                  },
                  {
                     label: "视频",
                     value: "2",
                  },
               ],
            },
            {
               el: "mp3",
               code: "resourceUrl",
               label: "音频",
               timeCode: "time",
            },
            {
               el: "video",
               code: "videoUrl",
               label: "视频",
               timeCode: "time",
            },
            {
               code: "time",
               label: "时长",
               disabled: true,
               placeholder: "音视或频时长",
               suffix: "秒",
            },
           {
             el:'radio',
             code: "payType",
             label: "支付类型",
             required: false,
             default: '0',
             valueChange:(val,obj)=>{
               let list=[
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
                 {
                   code:'effectiveTime',
                   show:val!=0&&obj.effectiveTimeType==0
                 },
               ]
               let formObj={...obj,effectiveTimeType:val==0?'1':obj.effectiveTimeType}
               return {
                 list,
                 formObj,
               }
             },
             list:[
               {
                 label: '免费',
                 value: '0',
               },
               {
                 label: '积分付费',
                 value: '1',
               },
               {
                 label: '积分+现金付费',
                 value: '2',
               }
             ]
           },
           {
             code: "scorePrice",
             show:false,
             lessCode:0,
             label: "积分价格",
             type: "number",
           },
           {
             code: "cashPrice",
             show:false,
             label: "现金价格",
             lessCode:0,
             type: "numberPoint2",
           },
           {
             code: "applePurchaseId",
             show:false,
             label: "苹果内购id",
           },
           {
             code: "auditionStartTime",
             label: "开始时间",
             tips:'试听开始时间',
             suffix:'秒',
             type: "number",
             inSlot:{
               el:'span',
               text:(val)=>`${Math.floor(val/60)>0?`${Math.floor(val/60)}分`:''}${Math.floor(val%60)>0?`${Math.floor(val%60)}秒`:''}`,
               style:{
                 marginLeft: '10px'
               }
             }
           },
           {
             code: "auditionEndTime",
             label: "结束时间",
             tips:'试听结束时间',
             type: "number",
             suffix:'秒',
             valueChange:(val,obj)=>{
               if (val<obj.auditionStartTime) {
                 this.$message.error("结束时间必须大于开始时间");
               }
             },
             inSlot:{
               el:'span',
               text:(val)=>`${Math.floor(val/60)>0?`${Math.floor(val/60)}分`:''}${Math.floor(val%60)>0?`${Math.floor(val%60)}秒`:''}`,
               style:{
                 marginLeft: '10px'
               }
             }
           },
           {
             el:'radio',
             code: "effectiveTimeType",
             label: "有效时长",
             default: '1',
             valueChange:(val)=>[
               {
                 code: "effectiveTime",
                 show: val==0,
               }
             ],
             list:[
               {
                 label: '有限时长',
                 value: '0',
               },
               {
                 label: '永久有效',
                 value: '1',
               },
             ]
           },
           {
             code: "effectiveTime",
             label: "时长",
             suffix:'月',
             inSlot:{
               el:'span',
               text:(val)=>`${Math.floor(val/12)>0?`${Math.floor(val/12)}年`:''}${Math.floor(val%12)>0?`${Math.floor(val%12)}月`:''}`,
               style:{
                 marginLeft: '10px'
               }
             }
           },
           {
             el:'textArea',
             code: "purchaseIllustration",
             label: "购买说明",
             rows:6,
             default:`你将购买的商品为虚拟内容服务，购买后不支持退订、转让、退换，请斟酌确认。购买记录可在「我的-订单」 中查看`
           },
            {
               el: "img",
               code: "coverUrl",
               label: "封面图",
               ratio: "336/380",
            },
            {
               el: "img",
               code: "backgroundUrl",
               label: "播放背景图",
               // ratio:1242/2208,
               size: 1024,
            },
            {
               el: "textArea",
               code: "introduce",
               label: "简介",
               maxlength: 300,
              rows:6,
               required: false,
            },
         ],
         formObj: {
           payType:'0'
         },
         config: {
            inline: false,
            buttonsArea: "popButtom",
            mainStyle: {
               width: "80%",
               marginLeft: "10%",
            },
            buttons: [
               {
                  funType: "confirm",
                  type: "primary",
                  name: "确认提交",
               },
               {
                  funType: "cancle",
                  type: "primary",
                  name: "取消",
               },
            ],
         },
      };
   },
   mounted() {
      if (this.$route.query.id) {
         this.edit = true;
         jnanaDetail({ id: this.$route.query.id }).then((res) => {
            this.formObj = res.data;
         });
      }
   },
   computed: {},
   methods: {
      formButton(val) {
         if (val.name == "confirm" && val.valid) {
            let data = val.value;
            data.jananColumnVOS = data.jananColumnVOS.map((item) => {
               item.sort = Number(item.sort || 0);
               return item;
            });
            this.loading = true;
            if (this.edit) {
               data.type==1?data.videoUrl=null:data.resourceUrl=null
               jnanaUpdatePost(data)
                  .then((res) => {
                     this.loading = false;
                     this.$confirm("编辑成功，是否跳转到列表?", "编辑成功", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                     }).then(() => {
                        this.$router.push({
                           path: "/content/wisdom/index",
                        });
                     });
                  })
                  .finally(() => {
                     this.loading = false;
                  });
            } else {
               jnanaSavePost(data)
                  .then((res) => {
                     this.loading = false;
                     this.$alert("添加成功，跳转到列表", "添加成功", {
                        confirmButtonText: "确定",
                        callback: (action) => {
                           this.$router.push({
                              path: "/content/wisdom/index",
                           });
                        },
                     });
                  })
                  .finally(() => {
                     this.loading = false;
                  });
            }
         } else {
            this.$router.push({
               path: "/content/wisdom/index",
            });
         }
      },
   },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
</style>
