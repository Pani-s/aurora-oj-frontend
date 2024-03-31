<template>
  <div id="userRegisterView">
    <h1 style="margin-bottom: 16px; color: #594a65">用户注册</h1>
    <a-space></a-space>
    <a-form
      ref="formRef"
      style="max-width: 580px; margin: 0 auto;min-width: 400px"
      label-align="left"
      auto-label-width
      :model="form"
      @submit="handleSubmit"
    >
      <a-form-item
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 3, message: '账号长度不能低于3位' },
        ]"
        field="userAccount"
        label="账号"
      >
        <a-input v-model="form.userAccount" placeholder="请输入账号" />
      </a-form-item>
      <a-form-item
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 6, message: '密码长度不能低于6位' },
        ]"
        field="userPassword"
        tooltip="密码不少于 6 位"
        label="密码"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 6, message: '密码长度不能低于6位' },
        ]"
        field="checkPassword"
        tooltip="密码不少于 6 位"
        label="重复密码 :"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a href="/user/login" style="text-align: right; color: #5a5d8a"
      >返回登录页面</a
      >
      <a-form-item>
        <a-button type="primary" html-type="submit"> 注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import store from "@/store";
import { useRouter } from "vue-router";
import { ref } from "vue";

const formRef = ref(null);
const router = useRouter();
const form = reactive<UserRegisterRequest>({
  userAccount: "",
  userPassword: "",
  checkPassword: ""
});
const handleSubmit = async () => {
  formRef?.value?.validate(async (r: any, Record: any) => {
    //r == void 0 验证成功通过
    if (r == void 0) {
      const res = await UserControllerService.userRegisterUsingPost(form);
      if (res.code === 0) {
        Message.success("注册成功！");
        await store.dispatch("getLoginUser");
        await router.push({
          path: "/user/login",
          replace: true
        });
      } else {
        Message.error(res.msg);
      }
    }
  })
};

</script>