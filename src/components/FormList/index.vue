<template>
   <div class="myFormList">
      <el-form :style="inConfig.mainStyle"
               ref="ruleForm"
               :rules="rules"
               :inline="inConfig.inline"
               :labelWidth="inLabelWidth"
               :model="inFormObj"
               :class="inConfig.inline ? 'demo-form-inline' : ''">
         <el-form-item :class="{ 'is-required': item.required }"
                       v-for="item in inList"
                       :key="item.code"
                       :prop="item.code"
                       :label="item.label + inConfig.colon">
            <el-input :style="{ ...inConfig.inputStyle }"
                      :size="inConfig.size"
                      @change="inputChange(item.code)"
                      @blur="inputChange(item.code)"
                      v-if="item.el == 'input'"
                      v-model.trim="inFormObj[item.code]"
                      :placeholder="item.placeholder"
                      :prefix-icon="item.icon"
                      :maxlength="item.maxlength"
                      :minlength="item.minlength"
                      :clearable="item.clear"
                      :disabled="item.disabled"
                      @keyup.enter.native="enter">
               <span v-if="item.suffix" slot="suffix"
                     v-html="item.suffix"></span>
            </el-input>
            <el-input :style="{ ...inConfig.inputStyle }"
                      :size="inConfig.size"
                      v-if="item.el == 'textArea'||item.el == 'textarea'"
                      type="textarea"
                      :disabled="item.disabled"
                      :rows="item.rows || 3"
                      v-model="inFormObj[item.code]"
                      :placeholder="item.placeholder"
                      :prefix-icon="item.icon"
                      :maxlength="item.maxlength"
                      :minlength="item.minlength"
                      :clearable="item.clear"
                      show-word-limit></el-input>

            <el-select :style="{ ...inConfig.inputStyle }"
                       v-if="item.el == 'select'"
                       :size="inConfig.size"
                       v-model="inFormObj[item.code]"
                       :placeholder="item.placeholder"
                       :filterable="item.filterable"
                       :clearable="item.clear"
                       @change="selectChange(item.code, item)">
               <el-option v-for="i in (item.back?backList[item.code]:item.list)"
                          :key="i.value"
                          :label="i.label"
                          :value="i.value"></el-option>
            </el-select>
            <div class="selectInput"
                 v-if="item.el == 'selectInput'">
               <div class="selectInputItem"
                    v-for="(sei,ind) in selectInputObj[item.code].itemList"
                    :key="ind">
                  <el-select :style="{ width: '260px' }"
                             :size="inConfig.size"
                             v-model="sei[item.selectCode]"
                             :placeholder="item.selectPlaceholder"
                             :clearable="item.clear"
                             @change="selectInputChange(sei,ind,item.code)">
                     <el-option v-for="i in selectInputObj[item.code].list"
                                :key="i.value"
                                :label="i.label"
                                :value="i.value"
                                :disabled="sei[item.selectCode]==i.value?false:i.disabled"></el-option>
                  </el-select>
                  <el-input :style="{ width: '100px' }"
                            @input="selectInputCg()"
                            @blur="selectInputBlur(sei,ind,item.code)"
                            :size="inConfig.size"
                            v-model.trim="sei[item.inputCode]"
                            :placeholder="item.inputPlaceholder"
                            :maxlength="item.maxlength"
                            :minlength="item.minlength"
                            :clearable="true" />
                  <div class="selectInputAdd el-icon-circle-plus-outline"
                       @click="selectInputAdd(sei,ind,item.code)"></div>
                  <div class="selectInputAdd el-icon-remove-outline"
                       @click="selectInputRedus(sei,ind,item.code)"></div>
               </div>
            </div>
            <el-cascader :style="{ ...inConfig.inputStyle }"
                         v-if="item.el == 'cascaderTags'"
                         :ref="item.code"
                         v-model="inFormObj[item.code + '_v']"
                         :options="(item.back?backList[item.code]:item.list)"
                         @change="cascaderTagsChange(item.code)"
                         :size="inConfig.size"
                         :placeholder="item.placeholder"
                         :clearable="item.clear" />
            <el-tag class="formListTag"
                    v-if="item.el == 'cascaderTags'"
                    v-for="(tag, ind) in inFormObj[item.code]"
                    :key="tag.label"
                    closable
                    :disable-transitions="false"
                    @close="cascaderTagsChangeClose(item, tag)">
               {{ tag.label }}
            </el-tag>

            <el-date-picker :style="{ ...inConfig.inputStyle }"
                            :size="inConfig.size"
                            v-if="item.el == 'date'"
                            v-model="inFormObj[item.code]"
                            :type="item.dateType"
                            :picker-options="item.pickerOptions"
                            range-separator="至"
                            :default-time="item.defaultTime?item.defaultTime: (item.dateType == 'datetimerange' ? ['00:00:00', '23:59:59']  : '')"
                            start-placeholder="开始日期"
                            :clearable="item.clear"
                            @blur="dateChange(item.code)"
                            end-placeholder="结束日期"
                            :ref="item.code" />
            <!--        @blur="dateChange"-->

            <el-select :style="{ ...inConfig.inputStyle }"
                       v-if="item.el == 'searchTags'"
                       :size="inConfig.size"
                       v-model="inSearchVal[item.code]"
                       :placeholder="item.placeholder"
                       :clearable="item.clear"
                       :ref="item.code"
                       remote
                       filterable
                       @change="searchTagsChange(item.code)"
                       :remote-method="remoteMethod">
               <el-option v-for="i in backList[item.code]"
                          :key="i.value"
                          :label="i.label"
                          :value="i.value" />
            </el-select>
            <el-tag class="formListTag"
                    v-if="item.el == 'searchTags'"
                    v-for="(tag, ind) in inFormObj[item.code]"
                    :key="tag.label"
                    closable
                    :disable-transitions="false"
                    @close="searchTagsClose(item, tag)">
               {{ tag.label ||tag.name}}
            </el-tag>
            <div class="myRadio"
                 v-if="item.el == 'radio'"
                 v-for="it in (item.back?backList[item.code]:item.list)"
                 :key="it.label"
                 :class="{ myRadioCheck: it.value == inFormObj[item.code] ,disabled:it.disabled}"
                 @click="myRadioClick(item.code, it)"
                 :value="inFormObj[item.code]"
                 :disabled="it.disabled">
               {{ it.label }}
            </div>
            <div class="myCheckbox"
                 v-if="item.el == 'checkbox'"
                 v-for="it in (item.back?backList[item.code]:item.list)"
                 :key="it.label"
                 @click="myCheckboxClick(item.code, it)"
                 :value="inFormObj[item.code]">
               <div class="myCheckbox_inlne"
                    :class="{ myCheckboxCheck: inFormObj[item.code] && inFormObj[item.code].includes(it.value) }"></div>
               {{ it.label }}
            </div>
            <UploadImgDrag v-if="item.el == 'img'"
                           v-model.trim="inFormObj[item.code]"
                           :size="item.size || 500"
                           :limit="item.limit || 1"
                           :ImgType="item.ImgType"
                           :tips="item.tips"
                           :ratio="item.ratio || ''" />
            <!-- 视频  -->
            <uploadVideo @changeFile="videoChange"
                         :code="item.code"
                         v-if="item.el == 'video'"
                         v-model.trim="inFormObj[item.code]"
                         :size="item.size || 1000"
                         :limit="item.limit || 1" />
            <!-- 音频  -->
            <uploadAudio v-if="item.el == 'mp3'"
                         v-model.trim="inFormObj[item.code]"
                         :size="item.size || 1000"
                         :limit="item.limit || 1" />
            <!--   富文本editer     -->
            <div :id="item.code"
                 class="editer"
                 v-if="item.el == 'editer'"></div>
            <el-cascader class="formListArea"
                         v-if="item.el == 'area'"
                         v-model="inFormObj[item.code]"
                         :options="optionsList"
                         :size="inConfig.size"
                         :style="{ ...inConfig.inputStyle }"
                         @change="addressHandleChange(item, item.code)"
                         :ref="item.code" />
            <div class="span"
                 v-if="item.el == 'span'">{{ inFormObj[item.code] }}</div>
           <template v-if="item.inSlot">
             <component
                 :is="getComponent(item.inSlot)"
                 v-bind="inGetInherit(item.inSlot)"
                 v-html="inGetHtml(item.inSlot,item.code)"
                 @click="slotClick(item.inSlot,item.code)"
             />
           </template>

            <div class="imgShow"
                 v-if="item.el == 'imgShow'"></div>
            <!--   底部提示     -->
            <div class="buttonTips"
                 v-if="item.buttonTips||item.tips">{{item.buttonTips||item.tips}}</div>
            <!-- slot插槽  -->
            <slot v-if="item.el == 'slot'"
                  :name="item.slotName"></slot>
            <slot v-if="item.afterSlot"
                  :name="item.afterSlot"></slot>
         </el-form-item>
         <el-form-item :class="inConfig.buttonsArea">
            <el-button v-for="bts in buttons"
                       :key="bts.name"
                       :type="bts.type"
                       :size="bts.size"
                       :icon="bts.icon"
                       :loading="bts.funType == 'confirm' ? inLoading : false"
                       @click="buttonsClick(bts)">
               {{ bts.name }}
            </el-button>
         </el-form-item>
      </el-form>
   </div>
</template>

<script>
/*
  * index组件说明
  *
  * */
import { Message } from 'element-ui';
// import E from "wangeditor"
// import { regionData, CodeToText } from 'element-china-area-data';
import {
  parseTime,
  dataFormat,
  checkType,
  checkTypeArr,
  compareTime,
  backType,
  getInherit,
  inheritObj,
  resetDefaltList, resetDefalt
} from "./utils";
import UploadImgDrag from "@/components/uploadDrag";
import uploadVideo from "@/components/uploadVideo";
import uploadAudio from "@/components/uploadAudio";
import store from "@/store";
import { url } from "@/config";
import { GUID } from "@/utils/guid";
const OSS = require('ali-oss');

let inputArr = ['input', 'textArea'];
const valArray = ['area', 'searchTags', 'checkbox', 'img', 'cascaderTags'];
const checkChange = ['img', 'video', 'mp3', 'textArea', 'area'];
// editer 需要单独检查
export default {
   components: {
      UploadImgDrag,
      uploadVideo,
      uploadAudio,
   },
   name: 'index',
   data() {
      return {
        // 第一次表单变化
        firstValueChangeTf:false,
         optionsList: regionData,
         inLoading: false,
         rules: {},
         formListObj: {},//全部对象
         test: '',
         editor: null,
         inList: [],
         inLabelWidth: 4,
         inFormObj: {},
         editerReq: false,//editer是否通过验证
         backList: {},//存放从后台获取到的下拉数据的列表数据
         backListRequst: {},//存放从后台获取到的下拉数据的列表数据
         splitCodeObj: {},//需要分割的结果的对象
         buttons: [
            {
               funType: 'confirm',
               type: 'primary',
               name: '确认',
               size: 'small'
            },
            {
               funType: 'cancle',
               type: 'primary',
               name: '取消',
               size: 'small'
            },
            {
               funType: 'reset',
               type: 'primary',
               name: '重置',
               size: 'small'
            },
         ],
         inConfig: {
            buttonsArea: '',
            enter: true,
            allRequired: true,// 是否全部必填
            labelShow: true,
            inline: false,//行内
            inputStyle: {
               width: '200px',
            },
            size: 'mini',
            colon: '：',// 冒号
            mainStyle: {
               // width:'80%',
               // marginLeft:'10%',
               // display:'flex',
               // flexWrap:'wrap',
               // justifyContent:'space-between'
            }
         },
         inSearchVal: {},
         refSeachObj: {},
         // 存放area
         refArea: {},
         // 存放area
         refVideo: {},
         hasEditer: false,
         editerObj: {},
         refDate: {},// 时间对象
         checkChangeObj: {},// 检查变化对象
         refCascader: {},//联级选择的对象
         arrayObj: {},//记录那些字段是数组的，最后转成字符串，接收结果时转成数组
         midList: [],// 中间的list数组
         deleteObj: {},
         selectInputObj: {},//selectInput对象
      };
   },
   props: {
     formState: {
         type: Array,
         required: false
      },
      loading: {
         type: Boolean,
         required: false
      },
      list: {
         type: Array,
         required: true
      },
      formObj: {
         type: Object,
         required: true
      },
      searchObj: {
         type: Object,
         required: false,
         default: () => {
            return {};
         }
      },
      config: {
         type: Object,
         default: () => {
            return {};
         }
      }
   },
   created() {
      this.midList = [...this.list];
     this.firstValueChange()
   },

   computed: {
      // 需要单独检查是否验证成功的数组
      checkChangeArr() {
         let checkChangeArr = this.inList.filter(item => checkChange.includes(item.el));
         return checkChangeArr.map(item => item.code);
      },
      editerObjArr() {
         return Object.keys(this.editerObj);
      },
   },
   mounted() {
      if (this.hasEditer) {
         this.initEditer();
      }
   },
   methods: {
     // slot点击
     slotClick(obj,code) {
       if (obj.click) {
         if (obj.check) {
           this.$refs['ruleForm'].validateField(code,(err)=>{
             if (err=='') {
               let back= obj.click(this.inFormObj[code],this.inFormObj,err)
               if (backType(back,'Array')) {
                 this.changeList(back)
               }
             }
           })
         }else{
           let back= obj.click(this.inFormObj[code],this.inFormObj)
           if (backType(back,'Array')) {
             this.changeList(back)
           }
         }
       }
     },
     // 获取可继承属性
     inGetInherit(obj) {
       return  getInherit(obj, obj.el || "span");
     },
     // 获取使用组件
     getComponent(obj) {
       let backEl=obj.el||'span'
       return  inheritObj[backEl]&&inheritObj[backEl].el||'span';
     },
     // 获取文本
     inGetHtml(obj,code) {
       if (backType(obj.text,'Function')) {
         return  obj.text(this.inFormObj[code],this.inFormObj);
       }else{
         return obj.text
       }
     },
     // 第一次表单变化
     firstValueChange(){
       this.midList.map(value=>{
         let {code}=value
         // 默认值添加 没有值且有默认值
         if (value.default!=undefined&&this.inFormObj[code]==undefined) {
           this.inFormObj[code]=value.default
         }
         if (value.valueChange) {
           let list=value.valueChange(this.inFormObj[code],this.inFormObj)
           this.changeList(list)
         }
       })
       this.firstValueChangeTf=true
       this.setForm();
     },
     // 表单变化抛出结果，并触发表单变化
     formChange(formChange){
       if (formChange.valueChange) {
         let list=formChange.valueChange(formChange.value||'',this.inFormObj)
         this.changeList(list)
       }
       this.$emit('formChange', formChange);
     },
      inputChange(code) {
         let formChange = this.formListObj[code];
         formChange.value = this.inFormObj[code];
         this.formChange(formChange)
      },
      // slect 改变事件
      selectChange(code, item) {
         let { valueBack = code + 'label' } = item;
         if (item.fun) {
            this.inFormObj[valueBack] = this.backList[code].filter(v => v.value == this.inFormObj[code])[0].label;
         } else {
            this.inFormObj[valueBack] = item.list.filter(v => v.value == this.inFormObj[code])[0].label;
         }
         let formChange = this.formListObj[code];
         formChange.value = this.inFormObj[code];
        this.formChange(formChange)
      },
      // 联级改变事件
      cascaderTagsChange(code) {
         let value = this.inFormObj[code + '_v'];
         let options = this.$refs[code][0].options;
         let obj = this.getCascaderLabel(options, value);
         this.inFormObj[code] = obj ? this.addItem(obj, this.inFormObj[code]) : this.inFormObj[code];
         this.inFormObj[code + '_v'] = [];
         this.upDom();
      },
      //  selectInput改变事件
      selectInputChange(sei, ind, code) {
         this.selectInputChangeList(code);
      },
      // 改变是否能选择
      selectInputChangeList(code, fresh = true) {
         let { selectCode, inputCode, inputType } = this.selectInputObj[code];
        let selectIds;
        if (this.selectInputObj[code].itemList&&this.selectInputObj[code].itemList.length>0) {
          selectIds = this.selectInputObj[code].itemList.map(v => v && v[selectCode]);
        }
         this.selectInputObj[code].list = (this.selectInputObj[code].list || []).map(val => {
            val.disabled = selectIds.includes(val[selectCode]);
            return val;
         });
         fresh && this.upDom();
      },
      //  selectInput 添加按钮
      selectInputAdd(sei, ind, code) {
         let { selectCode, inputCode, inputType } = this.selectInputObj[code];
         let hasNoSelect = this.selectInputObj[code].itemList.some(v => !v[selectCode]);
         if (hasNoSelect) {
            this.$message.error('请选择后再添加！');
            return;
         }
         if (this.selectInputObj[code].itemList.length == this.selectInputObj[code].list.length) {
            this.$message.error('已添加到最多！');
            return;
         };
         let midObj = {
            [selectCode]: '',
            [inputCode]: '',
            inputType: inputType,
         };
         this.selectInputObj[code].itemList.push(midObj);
         this.upDom();
      },
      selectInputRedus(sei, ind, code) {
         if (this.selectInputObj[code].itemList.length == 1) {
            this.$message.error('必须留一个！');
            return;
         };
         this.selectInputObj[code].itemList.splice(ind, 1);
         this.selectInputChangeList(code);
      },
      // input失去焦点对属性检查
      selectInputBlur(sei, ind, code) {
         let { selectCode, inputCode, inputType } = this.selectInputObj[code];
         let inputValue = this.selectInputObj[code].itemList[ind][inputCode];
         if (!checkType[inputType].regular.test(inputValue)) {
            this.$message.error(checkType[inputType].error);
            this.selectInputObj[code].itemList[ind][inputCode] = '';
            this.upDom();
         }
      },
      selectInputCg(val) {
         this.upDom();
      },
      // 联级关闭tags事件
      cascaderTagsChangeClose(item, index) {
         this.inFormObj[item.code] = this.inFormObj[item.code].filter(val => val != index);
      },
      getCascaderLabel(list, arr) {
         let obj = { value: arr.join(',') };
         list.forEach(v => {
            if (v.value == arr[0]) {
               v.children.map(val => {
                  if (val.value == arr[1]) {
                     obj.label = v.label + ',' + val.label;
                  }
               });
            }
         });
         return obj.label ? obj : false;
      },
      searchTagsChange(code) {
         let chose = this.backList[code].filter(val => this.inSearchVal[code] == val.value);
         this.inFormObj[code] = this.addItem(chose[0], this.inFormObj[code]);
         this.inSearchVal[code] = '';
         let mid = this.formListObj[code];
         mid.value = this.inFormObj[code];
         this.$emit('formChange', mid);
         this.upDom();
      },
      addItem(item, arr, key = 'value') {
         if (arr.length == 0) return [item];
         let repeat = arr.filter(val => val[key] == item[key]);
         arr = repeat.length > 0 ? arr : [...arr, item];
         return arr;
      },
      // 监听input的enter事件
      enter() {
         // 默认开启
         if (this.inConfig.enter) {
            this.confirm({ name: 'input' });
            this.$emit('enter', 'enter');
         }
      },
      // 地区选择 item.areaCode province(省),provinceId(省id),city(市),cityId(市ID),county(区),countyId(区ID)
      addressHandleChange(item, code) {
         setTimeout(() => {
            let value = this.$refs[code][0].value;
            let nameArr = this.$refs[code][0].presentText.split(' / ');
            let areaCode = item.areaCode || 'province,provinceId,city,cityId,county,countyId';
            let areaCodeArr = areaCode.split(',');
            this.inFormObj[areaCodeArr[0]] = nameArr[0];
            this.inFormObj[areaCodeArr[1]] = value[0];
            this.inFormObj[areaCodeArr[2]] = nameArr[1];
            this.inFormObj[areaCodeArr[3]] = value[1];
            this.inFormObj[areaCodeArr[4]] = nameArr[2];
            this.inFormObj[areaCodeArr[5]] = value[2];
         }, 100);
      },
      // 选择日期组件
      dateChange(code) {
         let { maxTime, minTime, label } = this.formListObj[code];
         maxTime = new Date(maxTime).getTime();
         minTime = new Date(minTime).getTime();
         let choseTime = new Date(this.$refs[code][0].value).getTime();
         if (maxTime && maxTime < choseTime) {
            Message.error(`${label}选择时间大于可选的最大时间${parseTime(maxTime)}`);
            this.inFormObj[code] = '';
         }
         if (minTime && minTime > choseTime) {
            Message.error(`${label}选择时间小于可选的最小时间${parseTime(minTime)}`);
            this.inFormObj[code] = '';
         }
         let formChange = this.formListObj[code];
         formChange.value = this.inFormObj[code];
        this.formChange(formChange)
         this.upDom();
      },
      upDom() {
         this.inFormObj = { ...this.inFormObj };
      },
      keyC(obj, mapList) {
         if (!mapList) return [];
         return mapList.map(v => {
            v.label = v[obj.labelCode];
            v.value = v[obj.valueCode] + '';
            return v;
         });
      },
      // 获取label格式的数据
      getFunData(obj, parObj = {}) {
         let par = { ...{ size: 1000, current: 1, enable: 1 }, ...obj.postData, ...parObj };
         let { code } = obj;
         let requsetStr = `${code}${JSON.stringify(par)}`;
         if (this.backListRequst[requsetStr]) return;
         this.backListRequst[requsetStr] = true;
         obj.fun(par).then(res => {
            if (obj.funMode == 2) {
               this.backList[code] = this.keyC(obj, res.data);
            } else {
               this.backList[code] = this.keyC(obj, res.data.records);
            }
            if (obj.funMode == 3) {
               this.backList[code] = res.data.map(v => {
                  v.label = v.cityName;
                  v.value = v.cityName;
                  v.children = v.list.map(vv => {
                     vv.label = vv.name;
                     vv.value = vv.id;
                     return vv;
                  });
                  return v;
               });
            }
            if (obj.funMode == 4) {
               this.backList[code] = res.data.map(v => {
                  let obj = {
                     label: v,
                     value: v,
                  };
                  return obj;
               });
            }
            if (obj.el == 'checkbox' && this.inFormObj[code] && this.inFormObj[code] != null) {
               let mid = [];
               let type = typeof this.inFormObj[code];
               if (type == 'number') {
                  mid = [this.inFormObj[code]];
               } else if (type == 'string') {
                  mid = this.inFormObj[code].split(',');
               } else {
                  mid = this.inFormObj[code];
               }
               mid = mid.map(v => Number(v));
               mid = [...new Set(mid)];
               this.inFormObj[code] = mid;
            }
            if (obj.el == 'searchTags') {
            }
            this.upDom();
         });

      },
      // 初始化组件
      setForm() {
         let defaltLabelWidth = 0;
         this.inConfig = Object.assign(this.inConfig, this.config);
         // 按钮初始化
         if (this.inConfig.buttons && this.inConfig.buttons) {
            this.buttons = this.inConfig.buttons.map(bts => {
               let obj = {
                  funType: 'nothing',
                  type: 'primary',
                  name: 'name',
                  size: 'mini'
               };
               return Object.assign(obj, bts);
            });
         }
         let hasRequired = false;
         this.inList = this.midList.map(value => {
            let { code, el = 'input', label } = value;
            // 基本参数
            let defalt = {
               el: 'input',
               clear: true,
               disabled: false,
               required: this.inConfig.allRequired,
               minlength: 1,
               maxlength: 120,
               dateType: 'datetime',
               backType: 'String',
               placeholder: ''
            };
            let required = value.required == undefined ? this.inConfig.allRequired : value.required;

            // 从后台获取list的初始化
            if (value.back) {
               this.backList[code] = this.backList[code] ? this.backList[code] : [];
               this.getFunData(value);
            }
            // 结果是数组的处理
            if (valArray.includes(el) && value.backType != 'Array') {
               this.arrayObj[code] = {};
               if (this.inFormObj[code] && typeof this.inFormObj[code] == 'string') {
                  this.inFormObj[code] = this.inFormObj[code] ? this.inFormObj[code].split(',') : [];
                  this.inFormObj[code] = this.inFormObj[code].map(v => {
                     if (Number(v)) v = Number(v);
                     return v;
                  });
               } else {
                  this.inFormObj[code] = this.inFormObj[code] ? this.inFormObj[code] : [];
               }
            }
            // 初始化分割程序
            if (value.splitCode) {
               this.splitCodeObj[code] = {};
               let splitCodeArr = value.splitCode.split(',');
               let splitValueArr = [];
               if (typeof this.inFormObj[code] == 'string') {
                  splitValueArr = this.inFormObj[code].split(',');
               } if (typeof this.inFormObj[code] == 'object') {
                  splitValueArr = this.inFormObj[code];
               }
               splitValueArr.map(v => v !== '');
               this.inFormObj[code] = this.inFormObj[code] || [];
               let mid = [];
               splitCodeArr.forEach((v, i) => {
                  this.inFormObj[v] = (this.inFormObj[v] || splitValueArr[i]) || '';
                  if (this.inFormObj[v].length > 0) {
                     mid[i] = parseTime(this.inFormObj[v], dataFormat[value.dateType]);
                  }
               });
               this.inFormObj[code] = mid;
            }
            // 日期初始化
            if (el == 'date') {
               this.refDate[code] = {};
               if (value.options && value.dateType == 'datetimerange' && value.options.length > 0) {
                  value.pickerOptions = this.getOptions(value.options);
               }
               if (value.maxTime || value.minTime) {
                  let maxTime = new Date(value.maxTime || '2200-12-31 00:00:00').getTime();
                  let minTime = new Date(value.minTime || 0).getTime() - 24 * 60 * 60 * 1000;
                  let pickerOptions = {
                     disabledDate(time) {
                        return time.getTime() < minTime || time.getTime() > maxTime;
                     }
                  };
                  value.pickerOptions = { ...value.pickerOptions, ...pickerOptions };
               }
               if (value.dateType == 'daterange' || value.dateType == 'datetimerange') {
               }
            }
            // cascader 联级初始化
            if (el == 'cascaderTags') {
               this.inFormObj[code + '_v'] = [];
               this.refCascader[code] = {};
               if (this.inFormObj[code].length > 0 && value.backType != 'Array') {
                  let time = setInterval(() => {
                     if (this.backList[code].length > 0) {
                        clearInterval(time);
                        let arr = [];
                        this.inFormObj[code] = this.inFormObj[code].map(v => Number(v));
                        this.backList[code].forEach(val => {
                           val.children.forEach(v => {
                              if (this.inFormObj[code].includes(v.value)) {
                                 arr.push({
                                    label: `${val.label},${v.label}`,
                                    value: `${val.value},${v.value}`
                                 });
                              }
                           });
                        });
                        this.inFormObj[code] = arr;
                     }
                  }, 100);
               }
            }

            // selectInputObj 初始化
            if (el == 'selectInput') {
              if ( this.selectInputObj[code]) {
                this.selectInputObj[code] = {...this.selectInputObj[code], ...value };
              }else{
                this.selectInputObj[code] = { ...value };
              }
              let { postData = {} } = value;
               if (this.selectInputObj[code]) {
                  value.fun({ size: 1000, current: 1, ...postData }).then(res => {
                     let mid = res.data.records.filter(v => {
                        v.label = v[value.labelCode];
                        v.value = v[value.valueCode];
                        return v;
                     });
                     this.selectInputObj[code].list = [...mid];
                     if ((this.inFormObj[code] && this.inFormObj[code].length == 0) || !this.inFormObj[code]) {
                       if (!this.selectInputObj[code].hasOwnProperty('itemList')) {
                         this.selectInputObj[code].itemList = [{
                           list: [...mid],
                           [value.selectCode]: '',
                           [value.inputCode]: '',
                         }];
                       }
                     } else {
                        this.selectInputObj[code].itemList = (this.inFormObj[code] || []).filter(v => {
                           if (v && v[value.selectCode]) {
                              return v;
                           }
                        });
                        this.selectInputChangeList(code);
                     }
                  });
               }else{
                 this.inFormObj[code]=[]
               }
            }
            // select-tage初始化
            if (el == 'searchTags') {
               let { postData = {} } = value;
               value.fun({ size: 1000, current: 1, ...postData }).then(res => {
                  if (this.inFormObj[code] && this.inFormObj[code].length > 0 && value.backType != 'Array') {
                     let mid = res.data.records.filter(v => {
                        let search = this.inFormObj[code].filter(vv => vv == v[value.valueCode]);
                        if (search.length > 0) {
                           v.label = v[value.labelCode];
                           v.value = v[value.valueCode];
                           return v;
                        }
                     });
                     this.inFormObj[code] = mid.length > 0 ? mid : this.inFormObj[code];
                     this.upDom();
                  }
               });
               this.backList[code] = [];
               this.refSeachObj[code] = {};
               this.inSearchVal[code] = '';
            }
            // 值变化检查值数组
            if (checkChange.includes(el)) {
               this.checkChangeObj[code] = {};
            }
            // 值变化检查值数组
            if (value.deleteArr) {
               this.deleteObj[code] = {};
               // if (this.inFormObj[code]) this.deleteList(this.inFormObj[code],value.deleteArr)
            }
            // area 初始化
            if (el == 'area') {
               this.refArea[code] = {};
            }
            // 视频 初始化
            if (el == 'video' || el == 'mp3') {
               this.refVideo[code] = {};
            }
            // Checkbox 初始化
            if (el == 'checkbox') {
            }
            if (el == 'editer') {
               this.hasEditer = true;
               this.editerObj[code] = this.editerObj[code] || {};
            }
            defaltLabelWidth = value.label.length > defaltLabelWidth ? value.label.length : defaltLabelWidth;
            value = Object.assign(defalt, value);
            value.placeholder = value.placeholder ? value.placeholder : `${inputArr.includes(el) ? '请输入' : '请选择'}${value.label}`;
            // 创建验证规则
            this.rules[code] = [];
            let comObj = { required: value.required, message: value.placeholder };
            if (el == 'input' || el == 'textArea') {
               let one = { trigger: el == 'textArea' ? ['blur', 'change'] : 'blur', ...comObj };
               // 长度检查
               let check = (rule, val, callback) => {
                  if (val == '') callback();
                  val += '';
                  if (val.length < value.minlength) {
                     callback(new Error(`请输入长度大于 ${value.minlength} 个字符`));
                  }
                  if (val.length > value.maxlength) {
                     callback(new Error(`请输入长度小于 ${value.minlength} 个字符`));
                  }
                  callback();
               };
               let min = { validator: check, trigger: el == 'textArea' ? ['blur', 'change'] : 'blur' };
               this.rules[code].push(one);
               this.rules[code].push(min);
               // 有检查类型
               if (value.type && checkTypeArr.includes(value.type)) {
                  let check = (rule, val, callback) => {
                     if (val && !checkType[value.type].regular.test(val)) {
                        callback(new Error(checkType[value.type].error));
                     }
                     callback();
                  };
                  let validator = { validator: check, message: checkType[value.type].error, trigger: 'blur' };
                  this.rules[code].push(validator);
               }
            }
            // 输入框最小值检查
            if (value.lessCode != undefined) {
               let check = (rule, val, callback) => {
                  if (val == '') callback();
                  let { code, lessCode } = rule;
                  val += '';
                  if (isNaN(Number(val))) {
                     callback(new Error(`请输入数字`));
                  }
                  if (Number(val) <= Number(lessCode || 0)) {
                     callback(new Error(`请输入大于 ${value.lessCode} 的数字`));
                  }
                  callback();
               };
               let validator = { validator: check, code, lessCode: value.lessCode, trigger: 'blur' };
               this.rules[code].push(validator);
            }
            // 输入框最大值检查
            if (value.maxCode) {
               let check = (rule, val, callback) => {
                  if (val == '') callback();
                  let { code, maxCode } = rule;
                  val += '';
                  if (isNaN(Number(val))) {
                     callback(new Error(`请输入数字`));
                  }
                  if (Number(val) > Number(maxCode || 0)) {
                     callback(new Error(`请输入小于 ${value.maxCode} 的数字`));
                  }
                  callback();
               };
               let validator = { validator: check, code, maxCode: value.maxCode, trigger: 'blur' };
               this.rules[code].push(validator);
            }


            // slect 验证
            let changsArr = ['select', 'searchTags', 'cascaderTags'];
            if (changsArr.includes(el)) {
               this.rules[code] = { trigger: 'change', ...comObj };
            }
            if (el == 'searchTags') {
               this.rules[code] = { trigger: 'change', ...comObj, type: 'array' };
            }
            if (el == 'img') {
               let check = (rule, val, callback) => {
                  let { code } = rule;
                  if (val && this.inFormObj[code].length == 0 && required) {
                     callback(new Error(`请上传`));
                  }
                  callback();
               };
               this.rules[code] = { ...comObj, el: el, code: code, validator: check, message: `请上传${value.label}`, trigger: ['change', 'blur'], };
            }
            if (el == 'video' || el == 'mp3') {
               let check = (rule, val, callback) => {
                  let { code, item } = rule;
                  if (backType(val, 'Array') && val.length == 0 && required) {
                     callback(new Error(`请上传`));
                  }
                  if (backType(val, 'Object') && val.size == 0 && required) {
                     callback(new Error(`请上传`));
                  } else if (((val && val.length == 0) || !val) && required) {
                     callback(new Error(`请上传`));
                  }
                  if (val && val.len) {
                     this.inFormObj[item.timeCode || code + '_time'] = val.len;
                     this.inFormObj[item.nameCode || code + '_name'] = val.oldName;
                  }
                  callback();
               };
               this.rules[code] = { ...comObj, el: el, code: code, item: value, validator: check, message: `请上传${value.label}`, trigger: ['change', 'blur'], };
            }
            if (el == 'editer') {
               let check = (rule, val, callback) => {
                  let { code } = rule;
                  let v = this.inFormObj[code] || '';
                  v = v.replace(/<p>/ig, '').replace(/<\/p>/ig, '').replace(/&nbsp;/ig, '').replace(/<br\/>/ig, '');
                  v = v.trim();
                  if (v.length == 0 && required) callback(new Error(`请输入内容`));
                  callback();
               };
               this.rules[code] = { ...comObj, code: code, validator: check, message: `请输入${value.label}`, trigger: 'blur', };
            }
            // 多选规则
            if (el == 'checkbox') {
               let check = (rule, val, callback) => {
                  if (val.length == 0 && required) {
                     callback(new Error(value.error || value.placeholder));
                  }
                  callback();
               };
               this.rules[code].push({ validator: check, trigger: 'change' });
            }
            // 单选规则
            if (el == 'radio') {
               let check = (rule, val, callback) => {
                  if (val == '' || val == undefined && required) {
                     callback(new Error(value.error || value.placeholder));
                  }
                  callback();
               };
               this.rules[code].push({ validator: check, trigger: 'change' });
            }
            // 正则规则
            if (value.regular) {
               let check = (rule, val, callback) => {
                  if (value && !value.regular.test(val) && required) {
                     callback(new Error(value.error || value.placeholder));
                  }
                  callback();
               };
               this.rules[code].push({ validator: check, trigger: value.trigger || 'blur' });
            }
            // 时间处理
            if (el == 'date' && value.dateType == 'datetimerange' && required) {
               this.rules[code] = { type: 'array', trigger: 'change', ...comObj };
            }
            // 两个时间处理前后顺序开始时间处理
            if (el == 'date' && value.starCode) {
               let check = (rule, val, callback) => {
                  let starCode = rule.starCode;
                  let starTime = this.inFormObj[starCode];
                  if (!val || !this.inFormObj[starCode]) callback();
                  if (!compareTime(starTime, val)) {
                     callback(new Error(value.timeError || value.placeholder));
                  }
                  callback();
               };
               this.rules[code].push({ validator: check, starCode: value.starCode, trigger: value.trigger || 'blur' });
            }
            // 两个时间处理前后顺序结束时间处理
            if (el == 'date' && value.endCode) {
               let check = (rule, val, callback) => {
                  let endCode = rule.endCode;
                  let endTime = this.inFormObj[endCode];
                  if (!val || !this.inFormObj[endCode]) callback();
                  if (!compareTime(val, endTime)) {
                     callback(new Error(value.timeError || value.placeholder));
                  }
                  callback();
               };
               this.rules[code].push({ validator: check, endCode: value.endCode, trigger: value.trigger || 'blur' });
            }
            if (value.validator) {
               this.rules[code].push({ validator: value.validator, trigger: 'blur' });
            }

           this.formListObj[code] = value;
            hasRequired = value.required ? true : hasRequired;
            return value;
         });
        // 根据 配置labelWidth>label最大长度+冒号的长度+是否含有必选项  得到labelWidth
         this.inLabelWidth = this.config.labelWidth ? this.config.labelWidth : defaltLabelWidth + this.inConfig.colon.length + (hasRequired ? 1 : 0) + 1 + 'em';
        this.inList =  this.inList.filter(item=>item.show||item.show==undefined)
      },
      // 处理date组件的时间标签
      getOptions(list) {
         let pickerOptions = {};
         let backList = list.map(value => {
            return {
               text: value.text,
               onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  if (value.value > 0) {
                     end.setTime(start.getTime() + 3600 * 1000 * 24 * value.value);
                  } else {
                     start.setTime(start.getTime() + 3600 * 1000 * 24 * value.value);
                  }
                  picker.$emit('pick', [start, end]);
               }
            };
         });
         pickerOptions.shortcuts = backList;
         return pickerOptions;
      },
      // 删除选中的tag
      searchTagsClose(item, index) {
         this.inFormObj[item.code] = this.inFormObj[item.code].filter(val => val != index);
         let formChange = item;
         formChange.value = this.inFormObj[item.code];
        this.formChange(formChange)
      },
      // 自定义单选
      myRadioClick(code, it) {
         if (it.disabled) return;
         let item = this.formListObj[code];
         this.inFormObj[code] = it.value;
         this.inFormObj[item.valueBack || code + 'label'] = it.label;
         let deleteArr = this.formListObj[code].deleteArr;
         if (deleteArr) this.deleteList(it.value, deleteArr);
         let formChange = this.formListObj[code];
         formChange.value = this.inFormObj[code];
         // this.$emit('formChange', formChange, it);
        this.formChange(formChange)
         this.upDom();
      },
      resetDelete(obj) {
         let deleteObj = Object.keys(this.deleteObj);
         deleteObj.forEach(code => {
            if (obj[code]) {
               this.deleteList(obj[code], this.formListObj[code].deleteArr);
            }
         });
      },
      // 删除某些节点
      deleteList(val, deleteArr, code) {
         deleteArr.forEach(vals => {
            if (vals[0] == val) {
               let arr = vals[1].split(',').filter(v => v);
               if (arr.length > 0) {
                  this.midList = this.midList.filter(v => !arr.includes(v.code));
               } else {
                  this.midList = this.list;
               }
               this.setForm();
            }
         });
         this.upDom();
      },
      // 自定义多选
      myCheckboxClick(code, it) {
         //
         let item = this.formListObj[code];
         let idx = this.inFormObj[code].indexOf(it.value);
         if (idx > -1) {
            this.inFormObj[code].splice(idx, 1);
         } else {
            // console.log(Object.keys(this.arrayObj),code,this.inFormObj[code],typeof  this.inFormObj[code])
            if (typeof this.inFormObj[code] == 'string') {
               let v = this.inFormObj[code];
               this.inFormObj[code] = [];
               this.inFormObj[code].push(v);
               this.inFormObj[code].push(it.value);
            } else {
               this.inFormObj[code].push(it.value);
            }

         }
         if (item.endVal == 'all') {
            let list = item.fun ? this.backList[code] : item.list;
            this.inFormObj[item.valueBack || code + '_list'] = list.filter(v => this.inFormObj[code].includes(v.id)) || [];
         }
         let formChange = this.formListObj[code];
         formChange.value = this.inFormObj[code];
        this.formChange(formChange)
         this.upDom();
      },
      // 初始化富文本
      initEditer() {
         //cdn引入优化
         const E = window.wangEditor;
         for (let key in this.editerObj) {
            this.editerObj[key] = new E(`#${key}`);
            this.editerObj[key].config.showLinkImg = false;
            this.editerObj[key].config.showLinkVideo = false;
            this.editerObj[key].config.showFullScreen = false;
            this.editerObj[key].config.uploadImgShowBase64 = true;
            this.editerObj[key].config.menus = [
               'head',  // 标题
               'bold',  // 粗体
               'fontSize',  // 字号
               'fontName',  // 字体
               'italic',  // 斜体
               'underline',  // 下划线
               'strikeThrough',  // 删除线
               'foreColor',  // 文字颜色
               'backColor',  // 背景颜色
               'link',  // 插入链接
               'list',  // 列表
               'justify',  // 对齐方式
               'quote',  // 引用
               'emoticon',  // 表情
               'image',  // 插入图片
               'table',  // 表格
               'code',  // 插入代码
               'undo',  // 撤销
               'redo'  // 重复
            ];
            let client = new OSS({
               accessKeyId: store.getters.upLoadToken.accessKeyId,
               accessKeySecret: store.getters.upLoadToken.accessKeySecret,
               stsToken: store.getters.upLoadToken.securityToken,
               bucket: url.OSSBucket,
               region: url.OSSRegion,
               endpoint: url.OSSUrl,
               cname: url.OSSUrl,
            });
            this.editerObj[key].config.customUploadImg = function (resultFiles, insertImgFn) {
               // resultFiles 是 input 中选中的文件列表
               // insertImgFn 是获取图片 url 后，插入到编辑器的方法
               let guid = new GUID();
               let name = guid.newGUID();
               client.put(name, resultFiles[0])
                  .then(function (res) {
                     // 上传图片，返回结果，将图片插入到编辑器中
                     insertImgFn(res.url);
                  })
                  .catch(function (err) {
                     console.log(err);
                  });
            };
            this.editerObj[key].create();
         }
         //这里各位小伙伴可以查询官网，根据自己的需求进行菜单栏调整
      },
      // 搜索+select 的搜索值传出
      remoteMethod(val) {
         let seachArr = Object.keys(this.refSeachObj);
         let code = '';
         // 获取当前的code
         seachArr.forEach(el => {
            if (val == this.$refs[el][0].query) {
               code = el;
            }
         });
         let searchCode = this.formListObj[code].searchCode;
         this.getFunData(this.formListObj[code], { [searchCode]: val });
      },
      // editer的值为空提示
      getEditerVal() {
         for (let key in this.editerObj) {
            this.inFormObj[key] = this.editerObj[key].txt.html();
         }
      },
      // 获取节点
      getNode() {
         this.getEditerVal();
         return this.$refs['ruleForm'];
      },
      // 获取结果
      getForm() {
         return this.inFormObj;
      },
      // 确认事件
      confirm(bts = { name: '' }) {
         this.$refs['ruleForm'].validate(valid => {
            if (valid) {
               if (this.inConfig.hasLoading) {
                  this.inLoading = true;
                  this.$emit('update:loading', this.inLoading);
               }
               let arrayObj = Object.keys(this.arrayObj);
               let backObj = JSON.parse(JSON.stringify(this.inFormObj));
               // 数组处理
               arrayObj.forEach(key => {
                  let item = this.formListObj[key];
                  if (typeof backObj[key] == 'object' && item.backType != 'Array') {
                     backObj[key] = backObj[key].join(',');
                  }
               });
               // searchTags 的值的处理
               let refSeachObj = Object.keys(this.refSeachObj);
               refSeachObj.forEach(key => {
                  let item = this.formListObj[key];
                  if (item.backType != 'Array') {
                     backObj[key] = this.inFormObj[key].map(val => val.value).join(',');
                  }
               });
               // refVideo 视频值的处理
               let refVideo = Object.keys(this.refVideo);
               refVideo.forEach(key => {
                  if (backType(backObj[key], 'Object')) {
                     console.log(backObj[key], 111111111);
                     let item = this.formListObj[key];
                     try {
                        backObj[key] = this.inFormObj[key].url || '';
                        backObj[(item.timeCode || key + '_time')] = this.inFormObj[key].len || '';
                        backObj[(item.nameCode || key + '_name')] = this.inFormObj[key].oldName || '';
                     } catch (err) {
                        backObj[key] = '';
                        backObj[(item.timeCode || key + '_time')] = '';
                        backObj[(item.nameCode || key + '_name')] = '';
                     }
                  }
               });
               // 时间的处理
               let refDate = Object.keys(this.refDate);
               let timeArr = ['datetimerange', 'daterange', 'monthrange', 'dates'];

               refDate.forEach(key => {
                  // 多日期兼容
                  if (timeArr.includes(this.formListObj[key].dateType) && typeof this.inFormObj[key] == 'object' && this.inFormObj[key] != null) {
                     // console.log(this.inFormObj[key])
                     backObj[key] = this.inFormObj[key].map(v => parseTime(v, dataFormat[this.formListObj[key].dateType])).join(',');
                  } else if (this.formListObj[key].stamp) {
                     let stamp = new Date(this.inFormObj[key]).getTime();
                     if (stamp) {
                        backObj[key] = stamp;
                     } else {
                        backObj[key] = "";
                     }

                  } else {
                     backObj[key] = parseTime(this.inFormObj[key], dataFormat[this.formListObj[key].dateType]);
                  }
               });

               // 时间分割字符串处理
               let splitCodeObj = Object.keys(this.splitCodeObj);
               splitCodeObj.forEach(code => {
                  let item = this.formListObj[code];
                  let value = (typeof this.inFormObj[code] == 'object' && this.inFormObj[code] != null) ? this.inFormObj[code] : (this.inFormObj[code] ? this.inFormObj[code].split(',') : []);
                  value = value.filter(v => v != '');
                  let splitCode = item.splitCode.split(',');
                  if (item.el == 'date') {
                     splitCode.forEach((key, i) => {
                        backObj[key] = value[i] ? parseTime(value[i], dataFormat[item.dateType]) : '';
                     });
                  }
               });

               let refCascader = Object.keys(this.refCascader);
               refCascader.forEach(code => {
                  let item = this.formListObj[code];
                  if (item.cascaderValue == 'end') {
                     backObj[code] = this.inFormObj[code].map(v => v.value.split(',')[v.value.split(',').length - 1]).join(',');
                     backObj[item.firstCode || 'firstCode'] = this.inFormObj[code].map(v => v.value.split(',')[0]).join(',');
                  } else {
                     backObj[code] = this.inFormObj[code].map(v => v.value).join('||');
                  }
               });
               // 对于结果的最终处理
               for (let code in this.inFormObj) {
                  let item = this.formListObj[code];
                  if (item && item.endVal == 'all') {
                     if (backType(backObj[code], 'String')) {
                        let midArr = backObj[code].split(',');
                        backObj[code] = this.interArr(this.backList[code] || item.list, midArr, 'value');
                     } else if (backType(backObj[code], 'Array')) {
                        if (backType(backObj[code][0], 'Object')) {
                           backObj[code] = this.inFormObj[code];
                        } else {
                           backObj[code] = this.interArr(this.backList[code] || item.list, backObj[code], 'value');
                        }
                     }
                  }
               }
               // selectInput验证
               let selectInput = true;
               if (this.selectInputObj) {
                  for (let key in this.selectInputObj) {
                     let { itemList, inputCode, selectCode, code, placeholder } = this.selectInputObj[key];
                     backObj[code] = itemList.map(v => ({ [inputCode]: v[inputCode], [selectCode]: v[selectCode] }));
                     if (!backObj[code][0][selectCode]) {
                        this.$message.error(placeholder);
                        selectInput = false;
                     }
                  }
               }
               if (!selectInput) return;
               this.$emit('button', { name: 'confirm', node: this.$refs['ruleForm'], value: backObj, valid: true, text: bts.name || '' });
            }
         });
      },
      // 两个数组，一个数组是对象数组，一个是字符串数组，返回交集的数组
      interArr(big, sm, code) {
         let backArr = [];
         big.forEach(val => {
            sm.forEach(v => {
               if (val[code] == v) {
                  backArr.push(val);
               }
            });
         });
         return backArr;
      },
     // 改变dom
     changeList(obj){
       if (obj) {
         let list=[]
         if (backType(obj,'Object')) {
           list=obj.list||[]
           if (obj.formObj) {
             this.inFormObj={...this.inFormObj,...obj.formObj}
           }
         }else{
           list=obj
         }
         let codeObj = {};
         let codeList = list.map((item) => {
           codeObj[item.code] = item;
           return item.code;
         });
         codeList = codeList.filter((v) => v);
         this.midList = this.midList.map((item) => {
           if (codeList.includes(item.code)) {
             item = { ...item, ...codeObj[item.code] };
           }
           return item;
         });
         // console.log('----------',this.midList)
         this.setForm();
       }
     },
      // 重置表单
      reset(bts = { name: 'reset' },keep={}) {
         this.$refs['ruleForm'].resetFields();
         let inFormObj={}
         this.inList.forEach((item) => {
          if (item.default) {
            inFormObj[item.code] = item.default;
          } else {
            inFormObj[item.code] = resetDefaltList.includes(item.el)
                ? resetDefalt[item.el]
                : "";
          }
        });
        this.$nextTick(() => {
          this.inFormObj = {...inFormObj,...keep};
          this.setForm();
          this.upDom();
        })
         this.$emit('button', { name: 'reset', node: this.$refs['ruleForm'], value: '', valid: false, text: bts.name || '' });
      },
      // 按钮事件
      buttonsClick(bts) {
         if (bts.funType == 'reset') {
            this.reset(bts);
         } else if (bts.funType == 'confirm') {
            this.getEditerVal();
            this.confirm(bts);
         } else {
            this.$emit('button', { name: bts.funType, node: this.$refs['ruleForm'], value: '', valid: false, text: bts.name });
         }
      },
      videoChange(value) {
         // console.log('videoChange',value);
      }
   },
   watch: {
      list: {
         deep: true,
         immediate: true,
         handler: function (newV, oldV) {
            if (newV != oldV) {
               this.midList = newV;
               this.setForm();
               this.upDom();
            }
         }
      },
     formState:{
       deep: true,
       immediate: true,
       handler: function (newV, oldV) {
         if (newV != oldV) {
           this.changeList(newV)
         }
       }
     },
      loading: {
         deep: true,
         immediate: true,
         handler: function (newV, oldV) {
            if (newV != oldV) {
               this.inLoading = newV;
            }
         }
      },
      formObj: {
         deep: true,
         immediate: true,
         handler: function (newV, oldV) {
           // 防止有些数字导致无限循环
           if (newV != oldV) {
             for (const key in newV) {
               let item=this.formListObj[key]
               if (backType(newV[key], 'Number')) {
                 newV[key] = newV[key] + '';
               }
               if (item&&item.valueChange) {
                 let list=item.valueChange(newV[key],newV)
                 this.changeList(list)
               }
             }
               // 编辑器加入内容
               let editerObj = Object.keys(this.editerObj);
               editerObj.forEach(code => {
                  this.editerObj[code].txt.html(newV[code]);
               });
               let arrayObj = Object.keys(this.arrayObj);
               // 数组处理,字符串转数组
               arrayObj.forEach(key => {
                  if (backType(newV[key], 'String')) {
                     newV[key] = newV[key] ? newV[key].split(',') : [];
                  }
                  if (backType(newV[key], 'Number')) {
                     newV[key] = [newV[key] + ''];
                  }
               });
               // selectInput处理
               for (let key in this.selectInputObj) {
                  let { selectCode } = this.selectInputObj[key];
                  if (newV[key]) {
                     this.selectInputObj[key].itemList = newV[key].filter(v => {
                        if (v && v[selectCode]) {
                           return v;
                        }
                     });
                  }
                  this.selectInputChangeList(key);
               }
               this.inFormObj = { ...this.inFormObj, ...newV };
               this.setForm();
               this.resetDelete(newV);
               this.$forceUpdate();
               this.upDom();
            }
         }
      },
      searchObj: {
         deep: true,
         handler: function (val, oldV) {
         }
      },
      inFormObj: {
         deep: true,
         immediate: true,
         handler: function (val, oldV) {
            // 对编辑器的监听
            this.editerObjArr.forEach(key => {
               if (val[key] && val[key] == ' ') {
                 this.$refs.ruleForm&&this.$refs.ruleForm.validateField(key);
               }
            });
            // 对检查数组的监听
            this.checkChangeArr.forEach(key => {
               let item = this.formListObj[key];
               if (val[key] && val[key].length > 0) {
                  this.$refs.ruleForm.validateField(key);
               }
               if (backType(val[key], 'Object')) {
                  if (item.el == 'video' || item.el == 'mp3') {
                     let { len } = val[key];
                     this.inFormObj[key] = val[key].url;
                     this.inFormObj[item.timeCode || key + '_len'] = len;
                  }
                  try {
                     this.$refs.ruleForm.validateField(key);
                  } catch (err) {
                     console.log(err);
                  }
               }
               let formChange = { ...item };
               formChange.value = val[key];
               if (backType(val[key], 'Array')) {
                  formChange.value = val[key].join(',');
               }
              this.formChange(formChange)
            });

         }
      },
   }
}
</script>

<style lang="scss" scoped>
@import "index.scss";
</style>
<style>
.el-form-item {
   margin-bottom: 10px;
}
.el-form-item__error {
   margin-top: -7px;
}
</style>
