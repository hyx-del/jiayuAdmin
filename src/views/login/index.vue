<template>
  <div class="login-container">
    <div class="login-bg">
      <img src="https://file.jiayu.world/image/admin/loginbr.jpg" alt="" />
    </div>
    <div class="login-bg">
      <img src="~@/assets/bg_login.svg" alt="" />
    </div>
    <div class="login-login">
      <img src="~@/assets/logo.svg" alt="" />
      <i></i>
      <p>梵音瑜伽后台管理系统</p>
    </div>
    <div class="login-content">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="phone">
          <div class="icons">
            <span class="el-icon-s-custom"><i>账号</i></span>
          </div>
          <el-input ref="phone" v-model.trim="loginForm.phone" placeholder="手机号" name="phone" type="text" tabindex="1" auto-complete="on" maxlength="11" />
        </el-form-item>

        <el-form-item prop="passWord">
          <div class="icons">
            <span class="ps">密码</span>
          </div>
          <el-input :key="passwordType" ref="passWord" v-model.trim="loginForm.passWord" :type="passwordType" placeholder="密码" name="passWord" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'passWord' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button class="login-button" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { isPhone } from "@/utils/validate";
import { getOSSToken } from "@/api/common";
import store from "@/store";
import getRouterList from "@/router/router";
import { removeToken } from "@/utils/auth";
import { Message } from "element-ui";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      callback();
      // }
    };
    return {
      loginForm: {
        phone: "",
        passWord: "",
      },
      loginRules: {
        phone: [{ required: true, trigger: "blur", validator: validateUsername }],
        passWord: [{ required: true, trigger: "blur", validator: validatePassword }],
      },
      loading: false,
      passwordType: "passWord",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    removeToken("yoga_Authorization");
    // TODO  本地的session token 删除
    sessionStorage.removeItem("token");
    if (sessionStorage.getItem("role_router")) {
      location.reload();
      sessionStorage.removeItem("role_router");
    }
  },
  mounted() {
    removeToken("yoga_Authorization");
    if (sessionStorage.getItem("role_router")) {
      location.reload();
      sessionStorage.removeItem("role_router");
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === "passWord") {
        this.passwordType = "";
      } else {
        this.passwordType = "passWord";
      }
      this.$nextTick(() => {
        this.$refs.passWord.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const _par = { ...this.loginForm };
          _par.passWord = md5(_par.passWord);
          let _formData = new FormData();
          _formData.append("grant_type", "password");
          _formData.append("username", _par.phone);
          _formData.append("password", _par.passWord);
          this.$store
            .dispatch("user/login", _formData)
            .then(() => {
              // 登录后第一次
              getOSSToken().then((res) => {
                if (res.code === 200) {
                  store.dispatch("app/setUpLoadToken", res.data);
                } else {
                  Message.error(res.msg);
                }
              });
              this.$store.dispatch("user/getMenuInfo").then(() => {
                let _tempRouter = getRouterList();
                this.$router.options.routes = [...this.$router.options.routes, ..._tempRouter];
                this.$router.addRoutes(_tempRouter);
                this.$router.push({ path: "/" });
              });
              this.loading = false;
            })
            .catch((res) => {
              Message.error(res.msg);
              this.loading = false;
            })
            .finally((res) => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  .login-bg {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    img {
      transform: scaleX(1.01);
      width: 100%;
      height: 100%;
    }
  }
  .login-login {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 129px;
    img {
      display: block;
      width: 204px;
      height: 100px;
    }
    i {
      width: 1px;
      height: 48px;
      opacity: 1;
      border: 1px solid #ffffff;
      margin: 0 42px;
    }
    p {
      height: 42px;
      font-size: 30px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #ffffff;
      line-height: 42px;
      letter-spacing: 1px;
    }
  }
  .login-content {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 100;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 384px;
    opacity: 1;
    background: #ffffff;
    border-radius: 4px;
    display: flex;
    justify-content: center;

    .login-form {
      display: block;
      width: 360px;
      margin-top: 25px;
      .el-form-item {
        // margin-bottom: 24px;
        margin: 62px 0 0 0;
        width: 100%;
      }
      & >>> .el-form-item__content {
        .icons {
          position: absolute;
          left: 1px;
          top: -31px;
          z-index: 10;
          color: #ef8236;
          font: 400 14px " MicrosoftYaHei, MicrosoftYaHei-Regular";
          .el-icon-s-custom {
            font-size: 20px;
            i {
              font-size: 14px;
              font-style: normal;
              padding-left: 10px;
            }
          }
          .ps {
            display: block;
            height: 21px;
            background: url("../../assets/loginPass.png") no-repeat;
            background-size: 20px;
            padding-left: 30px;
            padding-top: 3px;
          }
        }
      }
      .el-input__inner,
      .el-input {
        width: 100%;
      }

      & >>> .el-input--small {
        .el-input__inner {
          //   padding-left: 32px;
        }
      }
      & >>> .el-input__inner {
        // padding-left: 32px;
      }
      .svg-container {
        position: absolute;
        left: 10px;
        z-index: 10;
      }
      .show-pwd {
        position: absolute;
        right: 10px;
      }
    }
    .login-button {
      border: none;
      width: 100%;
      margin-top: 62px;
      background: #ef8236;
      color: #fff;
      height: 36px;
    }
    .svg-container {
    }
  }
}
</style>
