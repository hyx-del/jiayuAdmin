<template>
  <div class="formPage">
    <div class="formBody">
      <formList ref="formList" :loading.sync="loading" :config="config" :formObj="formObj" :list="list" @button="formButton" />
    </div>
  </div>
</template>
<script>
import formList from "@/components/FormList/index";
import { Message } from "element-ui";
import { wikiAdd, getWiki, wikiUpdate, wikiColumnList } from "@/api/wiki";
import { timeFormat } from "@/core/directives/time.js";
import { getCoachesList } from "@/api/coach";
export default {
  components: {
    formList,
  },
  data() {
    return {
      value2: "",
      loading: false,
      searchObj: {
        list: [],
      },
      edit: false,
      list: [
        {
          code: "title",
          label: "百科标题",
          maxlength: 30,
        },
        {
          code: "sort",
          label: "置顶顺序",
          type: "number",
          required: false,
        },
        {
          code: "readintRandom",
          label: "虚拟浏览量",
          type: "number",
          required: false,
        },
        {
          el: "select",
          code: "wikiType",
          label: "栏目 ",
          back: true,
          labelCode: "name",
          valueCode: "id",
          fun: wikiColumnList,
        },
        {
          el: "date",
          code: "startTime",
          label: "开始时间",
          endCode: "endTime",
          timeError: "开始时间要小于结束时间",
          required: false,
        },
        {
          el: "date",
          code: "endTime",
          label: "结束时间",
          required: false,
          timeError: "开始时间要小于结束时间",
          starCode: "startTime",
          minTime: new Date(),
        },
        {
          el: "img",
          code: "coverListUrl",
          label: "列表封面图",
          ratio: "750/390",
          // ratio:'220/300'
        },
        {
          el: "img",
          code: "coverUrl",
          label: "内容封面图",
          ratio: "750/390",
          // ratio:'220/300'
        },
        {
          el: "img",
          code: "previewUrl",
          label: "视频封面图",
          ratio: "530/300",
          required: false,
        },
        {
          el: "video",
          code: "videoUrl",
          label: "视频",
          required: false,
        },
        {
          el: "editer",
          code: "detailText",
          label: "详细内容",
        },
      ],
      formObj: {},
      config: {
        // allRequired:false,
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
      getWiki({ id: this.$route.query.id }).then((res) => {
        console.log(res);
        this.formObj = res.data;
        this.formObj = JSON.parse(JSON.stringify(this.formObj));
      });
    }
  },
  computed: {},
  methods: {
    toTime(str) {
      str = str.substring(0, 19);
      str = str.replace(/-/g, "/");
      var timestamp = new Date(str).getTime();
      console.log(new Date(timestamp));
      return new Date(timestamp);
    },
    formButton(val) {
      if (val.name == "confirm" && val.valid) {
        let data = val.value;
        this.loading = true;

        if (this.edit) {
          wikiUpdate(data)
            .then((res) => {
              this.loading = false;
              this.$confirm("编辑成功，是否跳转到列表?", "编辑成功", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                this.$router.push({
                  path: '/content/wiki/index',
                });
              });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          wikiAdd(data)
            .then((res) => {
              this.loading = false;
              this.$alert("添加成功，跳转到列表", "添加成功", {
                confirmButtonText: "确定",
                callback: (action) => {
                  this.$router.push({
                    path: '/content/wiki/index',
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
          path: '/content/wiki/index',
        });
      }
    },
    // 搜索值
    searchVal(val) {
      if (val.value == "") {
        this.searchObj = {
          code: val.code,
          list: [],
        };
      } else {
        setTimeout(() => {
          this.searchObj = {
            code: val.code,
            selectType: "Object",
            list: [
              {
                label: "张三",
                value: "1",
              },
              {
                label: "李四",
                value: "2",
              },
              {
                label: "法外狂徒",
                value: "110",
              },
            ],
          };
        }, 200);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url("~@/styles/common.scss");
</style>
