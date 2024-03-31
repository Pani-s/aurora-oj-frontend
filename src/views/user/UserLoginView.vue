<template>
  <div id="userLoginView">
    <h1 style="margin-bottom: 16px; color: #594a65">用户登录</h1>
    <a-space></a-space>
    <a-form
      ref="formRef"
      style="max-width: 580px; margin: 0 auto;min-width: 400px"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
      :rules="loginRules"
    >
      <a-form-item field="userAccount" label="账号">
      <a-input
        v-model="form.userAccount"
        placeholder="请输入账号 (体验账号user/admin)"
        />
      </a-form-item>
      <a-form-item field=" userPassword
      " tooltip="密码不少于 6 位" label="密码">
      <a-input-password
        v-model="form.userPassword"
        placeholder="请输入密码 (体验密码123456)"
      />
      </a-form-item>
      <a href="/user/register" style="text-align: right; color: #5a5d8a"
      >没有账号？去注册</a
      >
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px">
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { FieldRule } from "@arco-design/web-vue";

const formRef = ref(null);
/**
 * 表单信息
 */
const form = reactive({
  userAccount: "",
  userPassword: ""
} as UserLoginRequest);

const router = useRouter();
const store = useStore();

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  console.log(form);
  formRef?.value?.validate(async (r: any, Record: any) => {
    //r == void 0 验证成功通过
    if (r == void 0) {
      const res = await UserControllerService.userLoginUsingPost(form);
      // 登录成功，跳转到主页
      if (res.code === 0) {
        await store.dispatch("user/getLoginUser");
        router.push({
          path: "/",
          replace: true
        });
      } else {
        message.error("登陆失败，" + res.message);
      }
    }
  });
};

const loginRules: Record<string, FieldRule | FieldRule[]> = {
  userPassword: [
    {
      required: true,
      message: "密码不能为空，长度6-20",
      minLength: 6,
      maxLength: 20
    }
  ],
  userAccount: [
    {
      required: true,
      message: "用户账号不能为空，长度3-20",
      minLength: 3,
      maxLength: 20
    }
  ]
};
</script>