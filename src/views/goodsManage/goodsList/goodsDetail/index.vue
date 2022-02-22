<!--
 * @Author: wei.chen
 * @Date: 2020-06-22 15:59:20
 * @LastEditTime: 2021-08-11 11:48:44
 * @LastEditors: jiu yin zhen jing
 * @Description: 
-->
<template>
  <div class="goodsDetail">
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">基本信息</span>
      </div>
      <div class="baseInfomation">
        <el-carousel height="300px" class="swiper" :autoplay="false" indicator-position="outside">
          <el-carousel-item v-for="(item, index) in swiperData" :key="'swiper_' + index">
            <div style="position: relative;">
              <img :src="item" />
              <span class="swiper_title" v-if="!index">封面图</span>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div class="info">
          <p>
            <span class="title">商品名称：</span>
            {{ detailData.goodsName }}
          </p>

          <p>
            <span class="title">编码：</span>
            {{ detailData.goodsId }}
          </p>
          <p>
            <span class="title">简介：</span>
            {{ detailData.intro }}
          </p>
          <p>
            <span class="title">品类：</span>
            {{ detailData.categoryName }}
          </p>
          <p>
            <span class="title">品牌：</span>
            {{ detailData.brandName }}
          </p>

          <p>
            <span class="title">支持服务：</span>
            <span v-for="(item, index) in afterService" :key="'service_' + index">
              {{ item.supportName }}
            </span>
          </p>
          <p>
            <span class="title">计量单位：</span>
            {{ detailData.unit }}
          </p>
        </div>
      </div>
    </el-card>
    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">规格信息</span>
      </div>
      <el-table :data="SKUdata">
        <el-table-column :prop="item.prop" :label="item.label" v-for="item in SKUcolumn" :key="item.prop">
          <template v-slot="scope" prop="displayUrl" v-if="item.prop == 'displayUrl'">
            <el-image :src="scope.row.displayUrl" class="table_img" :preview-src-list="[scope.row.displayUrl]" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card :body-style="{ padding: '20px' }">
      <div slot="header">
        <span class="label">详情描述</span>
      </div>
      <img v-for="item in detailImgs" :key="item" :src="item" class="detailImg" />
    </el-card>
  </div>
</template>

<script>
import { getGoodDetail } from "@/api/mall";
import { getSku } from "@/utils";

export default {
  data() {
    return {
      detailData: "",
      swiperData: [],
      afterService: "",
      detailImgs: "",
      SKUdata: [],
      SKUcolumn: [],
    };
  },
  created() {
    getGoodDetail({ goodsId: this.$route.query.id }).then((res) => {
      if (res.code == 200) {
        this.detailData = res.data;
        const _showListImg = res.data.coverUrl.split(",");
        const _carouselUrls = res.data.carouselUrls.split(",");
        const _tempSwiper = [];
        _tempSwiper.push(_showListImg);
        for (let index = 0, len = _carouselUrls.length; index < len; index++) {
          _tempSwiper.push(_carouselUrls[index]);
        }
        this.swiperData = [..._tempSwiper];

        // 支持的服务

        this.afterService = [...this.detailData.supportList];

        this.detailImgs = this.detailData.infoUrls.split(",");
        // this.detailImgs.splice(this.detailImgs.length - 1, 1);
        let arr = []; //表头
        let { specList } = this.detailData;

        for (let j = 0, specListLen = specList.length; j < specListLen; j++) {
          let arr = specList[j].specAttrList;
          let obj = {};
          for (let i = 0; i < arr.length; i++) {
            obj[`sku${i}`] = arr[i]["attrValue"];
          }

          obj.amount = specList[j].amount;
          obj.cash = specList[j].cash;
          obj.stock = specList[j].stock;
          obj.stockAlarm = specList[j].stockAlarm;
          obj.displayUrl = specList[j].displayUrl;
          obj.specId = specList[j].specId;

          this.SKUdata.push(obj);
        }
        //动态表头
        for (let i = 0; i < specList[0].specAttrList.length; i++) {
          let obj = {};
          obj.prop = `sku${i}`;
          obj.label = specList[0].specAttrList[i].attrName;
          arr.push(obj);
        }
        this.SKUcolumn = [
          ...arr,
          {
            prop: "displayUrl",
            label: "规格展示图",
          },

          {
            prop: "amount",
            label: "价格(积分)",
          },
          {
            prop: "stock",
            label: "商品库存",
          },
          {
            prop: "stockAlarm",
            label: "库存预警值",
          },
          {
            prop: "specId",
            label: "SKU编号",
          },
        ];
		//是否为现金需不需要展示
        if (this.detailData.payMode) {
          let indexAmount = null;
          this.SKUcolumn.forEach((item, index) => {
            if (item.prop == "amount") {
              indexAmount = index;
            }
          });
          this.SKUcolumn.splice(indexAmount + 1, 0, { prop: "cash", label: "价格(现金)" });
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.goodsDetail {
  .baseInfomation {
    display: flex;
    p {
      color: gray;
      font-size: 14px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #000;
    }
    .label {
      font-weight: bold;
    }
    .info {
      margin-left: 80px;
      max-width: 50%;
    }
    .goods_code {
      > img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        display: block;
      }
      position: absolute;
      right: 50px;
    }
    img {
      height: 300px;
      width: 300px;
    }
    .swiper_title {
      display: inline-block;
      background-color: red;
      color: #ffffff;
      text-align: center;
      position: absolute;
      top: 282px;
      left: 0;
      width: 300px;
    }
  }
  .swiper {
    width: 300px;
  }
  .chooseImg {
    width: 100px;
    height: 100px;
  }
  .table_img {
    height: 50px;
    width: 50px;
  }
  .detailImg {
    width: 300px;
    height: 300px;
  }
}
</style>
