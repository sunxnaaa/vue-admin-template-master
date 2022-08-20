<template>
  <div class="login-container" ref="fo">
    <div class="login-box">
      <h2>Login</h2>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">
        <div class="user-box">
          <el-form-item prop="username">
            <el-input type="text" name="" v-model="loginForm.username" ref="username" label="Username" @focus="download"
              @blur="unfocused" @clear="empty" @input="inputText" />
            <span :class="[{ 'focusBlur': changeIndex == 1 }, { 'focusBlurTwo': changeIndex == 2 }]">Username</span>
          </el-form-item>
        </div>
        <div class="user-box">
          <el-input name="" required="" :key="passwordType" ref="password" :type="passwordType" @focus="download1"
            v-model="loginForm.password" @blur="unfocused1" @clear="empty1" @input="inputText1" />
          <p class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </p>
          <span :class="[{ 'focusBlur1': changeIndex1 == 1 }, { 'focusBlurTwo1': changeIndex1 == 2 }]">Password</span>
        </div>
        <a href="javascript:void(0);" v-on:click="handleLogin()">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          登录
        </a>
        <a href="javascript:void(0);" v-on:click="register()">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          注册
        </a>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUser, login } from '@/api/user'
import '@/styles/login/login.css'
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      new Promise(function (resolve, reject) {
        validUser({ username: value }).then(function (res) {
          if (!res.success) {
            callback(new Error("Please enter the correct user name"));
          } else {
            callback();
          }
        }).catch(function (error) {
          console.log(error);
        });
      });
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };

    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      changeIndex: 0, //定义一个变量;0默认样式，1第二套样式，2第三套样式
      changeIndex1: 0,
      loading: false,
      passwordType: "password",
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
  mounted() {

  },
  methods: {
    //获得焦点事件
    download() {
      this.changeIndex = 1; //获取焦点等于1，展示第二套样式，文字提示平移到input框上面
    },
    inputText() {
      this.changeIndex = 1; //当input值改变时，展示第二套样式，文字提示平移到input框上面
    },
    //清空事件
    empty() {
      this.changeIndex = 0; //点击清空展示默认的样式
    },
    //失去焦点事件
    unfocused() {
      if (this.loginForm.username != "") {
        this.changeIndex = 2; //如果框中有值,展示第三套样式
      } else if (this.loginForm.username == "") {
        this.changeIndex = 0; //失焦等于 0,展示默认样式
      }
    },
    //获得焦点事件
    download1() {
      this.changeIndex1 = 1; //获取焦点等于1，展示第二套样式，文字提示平移到input框上面
    },
    inputText1() {
      this.changeIndex1 = 1; //当input值改变时，展示第二套样式，文字提示平移到input框上面
    },
    //清空事件
    empty1() {
      this.changeIndex1 = 0; //点击清空展示默认的样式
    },
    //失去焦点事件
    unfocused1() {
      if (this.loginForm.password != "") {
        this.changeIndex1 = 2; //如果框中有值,展示第三套样式
      } else if (this.loginForm.password == "") {
        this.changeIndex1 = 0; //失焦等于 0,展示默认样式
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.loading = true;
      const { username, password } = this.loginForm
      new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password }).then(res => {
          if (res.success == true) {
            this.$store.dispatch('user/login', res.token).then(() => { })
            this.$router.push({ path: this.redirect || "/" });
            this.loading = false;
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
        }).catch(error => {
          reject(error)
          this.loading = false;
        })
      })
    },
    register() {
      this.$router.push({ path: "/register" });
    }
  },
};
</script>


</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;


.user-box span {
  /* 默认情况下的样式 */
  position: absolute;
  top: 0;
  left: 0%;
  padding: 0px 7px;
  display: inline-block;
  margin-top: -0.55%;

  color: #9e9e9edf;
  font-size: 14px;
  pointer-events: none;
  height: 40px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  /*平移上方时，添加一个过渡效果让其没有那么的不自然，我这边设置了0.3秒执行完这个上移的操作 */
}

/* 获取焦点后的第一种样式 */
.user-box .focusBlur {
  position: absolute;
  font-size: 12px;
  top: -16%;
  height: 16px;
  color: #03e9f4;
  background-color: transparent;
}

/* 如果框中有值顶部文字颜色展示为黑色，第二种样式 */
.user-box .focusBlurTwo {
  position: absolute;
  font-size: 12px;
  top: -16%;
  height: 16px;
  color: #03e9f4;
  background-color: transparent;
}






/* 获取焦点后的第一种样式 */
.user-box .focusBlur1 {
  position: absolute;
  font-size: 12px;
  top: -16%;
  height: 16px;
  color: #03e9f4;
  background-color: transparent;
}

/* 如果框中有值顶部文字颜色展示为黑色，第二种样式 */
.user-box .focusBlurTwo1 {
  position: absolute;
  font-size: 12px;
  top: -16%;
  height: 16px;
  color: #03e9f4;
  background-color: transparent;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 0px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  html {
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: sans-serif;
    background: linear-gradient(#141e30, #243b55);
  }

  .login-box {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 400px;
    padding: 40px;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.6);
    border-radius: 10px;
  }

  .login-box h2 {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
  }

  .login-box .user-box {
    position: relative;
  }

  .user-box .el-form-item {
    margin-bottom: 30px;
  }


  .login-box form a {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: #03e9f4;
    font-size: 15px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    margin-top: 20px;
    margin-left: 50px;
    letter-spacing: 4px;
  }

  .login-box a:hover {
    background: #03e9f4;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
      0 0 100px #03e9f4;
  }

  .login-box a span {
    position: absolute;
    display: block;
  }

  .login-box a span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #03e9f4);
    animation: btn-anim1 1s linear infinite;
  }

  @keyframes btn-anim1 {
    0% {
      left: -100%;
    }

    50%,
    100% {
      left: 100%;
    }
  }

  .login-box a span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #03e9f4);
    animation: btn-anim2 1s linear infinite;
    animation-delay: 0.25s;
  }

  @keyframes btn-anim2 {
    0% {
      top: -100%;
    }

    50%,
    100% {
      top: 100%;
    }
  }

  .login-box a span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #03e9f4);
    animation: btn-anim3 1s linear infinite;
    animation-delay: 0.5s;
  }

  @keyframes btn-anim3 {
    0% {
      right: -100%;
    }

    50%,
    100% {
      right: 100%;
    }
  }

  .login-box a span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #03e9f4);
    animation: btn-anim4 1s linear infinite;
    animation-delay: 0.75s;
  }

  @keyframes btn-anim4 {
    0% {
      bottom: -100%;
    }

    50%,
    100% {
      bottom: 100%;
    }
  }
}
</style>

<style>
.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 0px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

input:-webkit-autofill {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>