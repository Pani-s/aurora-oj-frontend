<template>
  <div id="userInfoView">
    <div id="container">
      <a-layout>
        <a-layout-header>
          <h2 style="text-align: center; color: #51416b">个人资料</h2>
          <!--          <a-menu-->
          <!--            :openKeys="['1']"-->
          <!--            :selectedKeys="['0_2']"-->
          <!--            mode="horizontal"-->
          <!--            style="background-color: rgba(255,255,255,0)"-->
          <!--          >-->
          <!--            <a-menu-item key="0_1">-->
          <!--              <IconHome />-->
          <!--              修改资料-->
          <!--            </a-menu-item>-->
          <!--            <a-menu-item key="0_2">-->
          <!--              <IconSettings />-->
          <!--              修改密码-->
          <!--            </a-menu-item>-->
          <!--          </a-menu>-->
        </a-layout-header>
        <a-layout style="padding: 0 30px; min-height: 300px">
          <a-layout-content>
            <!--            <div id="info">-->
            <!--              <a-row>-->
            <!--                <a-col :span="4"> 用户昵称：</a-col>-->
            <!--                <a-col :span="10">-->
            <!--                  <a-input v-model="user.userName"></a-input>-->
            <!--                </a-col>-->
            <!--              </a-row>-->
            <!--              <a-divider size="0" />-->
            <!--              <a-row>-->
            <!--                <a-col :span="4"> 用户简介：</a-col>-->
            <!--                <a-col :span="18">-->
            <!--                  <a-textarea v-model="user.userProfile"></a-textarea>-->
            <!--                </a-col>-->
            <!--              </a-row>-->
            <!--              <a-button id="btn">修改</a-button>-->
            <!--            </div>-->
            <div id="info">
              <a-form
                ref="infoFormRef"
                :model="user"
                label-align="left"
                @submit="doChangeInfo"
                :rules="infoRules"
              >
                <a-form-item
                  field="userName"
                  label="用户昵称"
                  validate-trigger="blur"
                >
                  <a-input
                    v-model="user.userName"
                    placeholder="请输入用户昵称"
                  />
                </a-form-item>
                <a-form-item
                  field="userProfile"
                  label="用户简介"
                  validate-trigger="blur"
                >
                  <a-textarea
                    v-model="user.userProfile"
                    placeholder="这个人很懒，没写下任何东西~~"
                  />
                </a-form-item>
                <a-button
                  id="btn"
                  html-type="submit"
                  @click="infoFormRef.validate()"
                  type="primary"
                  style="min-width: 120px"
                  >修改
                </a-button>
              </a-form>
            </div>
            <!--            修改密码-->
            <a-space size="large" style="padding: 20px" />
            <a-divider size="30" />
            <div id="pwd">
              <a-form
                ref="pwdFormRef"
                :model="pwd"
                label-align="left"
                @submit="doChangePwd"
                :rules="pwdRules"
              >
                <a-form-item
                  field="userPassword"
                  label="旧密码"
                  validate-trigger="blur"
                >
                  <a-input-password
                    v-model="pwd.userPassword"
                    placeholder="请输入旧密码"
                  />
                </a-form-item>
                <a-form-item
                  field="newPassword"
                  label="新密码"
                  validate-trigger="blur"
                >
                  <a-input-password
                    v-model="pwd.newPassword"
                    placeholder="请输入新密码"
                  />
                </a-form-item>
                <a-form-item
                  field="checkedNewPassword"
                  label="确认密码"
                  validate-trigger="blur"
                >
                  <a-input-password
                    v-model="pwd.checkedNewPassword"
                    placeholder="请确认密码"
                  />
                </a-form-item>
                <a-button
                  id="btn"
                  html-type="submit"
                  @click="pwdFormRef.validate()"
                  type="primary"
                  style="min-width: 120px"
                  >修改密码
                </a-button>
              </a-form>
              <a-space size="large" style="padding: 30px" />
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { LoginUserVO, UserControllerService } from "../../../generated";
import { useStore } from "vuex";
import { FieldRule } from "@arco-design/web-vue";
import message from "@arco-design/web-vue/es/message";

const pwdFormRef = ref(null);
const infoFormRef = ref(null);

const store = useStore();
let user = ref<LoginUserVO>(store.state.user.loginUser);
let pwd = ref({ userPassword: "", newPassword: "", checkedNewPassword: "" });

const doChangePwd = (value: any) => {
  pwdFormRef?.value?.validate(async (r: any, Record: any) => {
    //r == void 0 验证成功通过
    if (r == void 0) {
      if (pwd.value.newPassword !== pwd.value.checkedNewPassword) {
        message.error("两次输入密码不一致！");
        return;
      }
      console.log("修改密码的验证通过");
      let res;
      try {
        res = await UserControllerService.updatePwdMyUserUsingPost({
          ...pwd.value,
        });
        if (res.code === 0) {
          message.success("更改成功");
          pwdFormRef.value?.resetFields();
        } else {
          message.error("更改失败，" + res.message);
        }
      } catch (e) {
        message.error("更改失败，" + res.message);
      }
    }
  });
};

const doChangeInfo = async (value: any) => {
  // console.log(value);
  infoFormRef?.value?.validate(async (r: any, Record: any) => {
    //r == void 0 验证成功通过
    if (r == void 0) {
      console.log("修改信息的验证通过");
      let res;
      try {
        res = await UserControllerService.updateMyUserUsingPost({
          userName: user.value.userName,
          userProfile: user.value.userProfile,
          // userAvatar:value.userAvatar,
        });
        if (res.code === 0) {
          message.success("更新成功");
        } else {
          message.error("更新失败，" + res.message);
        }
      } catch (e) {
        message.error("更新失败，" + res.message);
      }
    }
  });
};

const infoRules: Record<string, FieldRule | FieldRule[]> = {
  userName: [
    {
      required: true,
      message: "用户名不能为空",
    },
  ],
};
const pwdRules: Record<string, FieldRule | FieldRule[]> = {
  userPassword: [
    {
      required: true,
      message: "旧密码不能为空",
      minLength: 3,
      maxLength: 20,
    },
  ],
  newPassword: [
    {
      required: true,
      message: "新密码不能为空，长度3-20",
      minLength: 3,
      maxLength: 20,
    },
  ],
  checkedNewPassword: [
    {
      required: true,
      message: "确认新密码不能为空",
      minLength: 3,
      maxLength: 20,
    },
  ],
};
</script>

<style>
#userInfoView {
  padding-left: 20%;
  padding-right: 20%;
}

#container {
  box-shadow: #d5d5d5 1px 5px 5px;
  z-index: 10;
  background-color: white;
  border-radius: 10px;
}

/*突然不生效我只好去APP。vue*/

/*.arco-input-wrapper {*/
/*  background-color: white;*/
/*  border-radius: 4px;*/
/*  border: 1px solid #c2c2c2;*/
/*}*/

/*.arco-textarea {*/
/*  background-color: white;*/
/*  border-radius: 4px;*/
/*  border: 1px solid #c2c2c2;*/
/*}*/
</style>