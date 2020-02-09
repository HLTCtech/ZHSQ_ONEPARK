<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">财务系统后台管理登录</h3>
      </div>

      <el-form-item prop="userPhone">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userPhone"
          v-model="loginForm.userPhone"
          placeholder="请输入手机号"
          name="userPhone"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="已开启大写" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 获取验证码 -->
      <el-form-item prop="smsCode">
        <span class="svg-container">
          <svg-icon icon-class="chat" />
        </span>
        <el-input
          ref="smsCode"
          v-model="loginForm.smsCode"
          placeholder="请输入短信验证码"
          name="smsCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
        <el-button class="show-sms" type="primary" :disabled="disabled=!show" style="width:175px;" @click="getVerify(loginForm)">
          <span v-show="show">获取验证码</span>
          <span v-show="!show" class="count"> {{count}} s</span>
        </el-button>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div style="position:absolute">
        <div class="tips">
          <span>Powered by HuaLongTech</span>
        </div>
      </div> -->
    </el-form>

  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'
import { getSMS } from '@/api/user'

export default {
  name: 'Login',
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('请输入正确的用户名（也即手机号）'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateUserPhone = (rule, value, callback) => {
      const phone = value
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        callback(new Error('请输入正确的用户名（手机号）'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的密码（不少于6位）'))
      } else {
        callback()
      }
    }
    const validateSmsCode = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确的验证码（不少于6位）'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userPhone: '',
        password: '',
        smsCode: ''
      },
      show: true,
      count: '',
      timer: null,
      loginRules: {
        userPhone: [{ required: true, trigger: 'blur', validator: validateUserPhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message({ message: '请输入正确的账号密码及验证码', type: 'error' })
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 获取验证码
    getVerify(loginForm) {
      // 只对表单中的验证码字段进行验证
      // 使用的是validateField，验证错误，!userPhoneerror是验证正确的操作逻辑
      this.$refs.loginForm.validateField('userPhone', (userPhoneerror) => {
        if (!userPhoneerror) {
          this.$refs.loginForm.validateField('password', (passworderror) => {
            if (!passworderror) {
              // 调用获取验证码api
              getSMS(loginForm).then(response => {
                if (response.codeStatus === 200) {
                  this.$message({ message: '验证码会发送到您的手机上，请注意查收', type: 'success' })
                } else {
                  this.$message({ message: '提交失败，请联系系统管理员', type: 'error' })
                }
              })
              // 更改获取验证码按钮倒计时
              const TIME_COUNT = 60 // 更改倒计时时间
              if (!this.timer) {
                this.count = TIME_COUNT
                this.show = false
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--
                  } else {
                    this.show = true
                    clearInterval(this.timer) // 清除定时器
                    this.timer = null
                  }
                }, 1000)
              }
            } else {
              this.$message({ message: '请输入正确的手机号及密码', type: 'error' })
            }
          })
        } else {
          this.$message({ message: '请输入正确的手机号及密码', type: 'error' })
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .show-sms {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
