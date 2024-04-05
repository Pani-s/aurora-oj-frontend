<template>
  <div id="manageUserView">
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      style="accent-color: #51416b"
      @page-change="onPageChange"
    >
      <template #userAvatar="{ record }">
        <a-avatar shape="square"
          ><img
            :src="
              record.userAvatar ??
              'https://img.88icon.com/upload/jpg/20210524/d1c91060a0e644d6da9cf59288fb2dc7_18160_512_512.jpg!bg'
            "
            alt="头像"
        /></a-avatar>
      </template>
      <template #userRole="{ record }">
        <template v-if="record.userRole === 'admin'">
          <a-badge status="warning" />
        </template>
        <template v-if="record.userRole !== 'admin'">
          <a-badge status="processing" />
        </template>
        {{ record.userRole }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-popconfirm
            content="确定要重置密码吗?"
            type="warning"
            @ok="doUpdate(record)"
          >
            <a-button type="primary" id="btn"> 重置密码</a-button>
          </a-popconfirm>

          <a-popconfirm
            content="确定要删除吗?"
            type="warning"
            @ok="doDelete(record)"
          >
            <a-button status="danger">删除</a-button>
            <!--            @click="doDelete(record)-->
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { User, UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const tableRef = ref();

const dataList = ref<Array<User>>([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await UserControllerService.listUserByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    total.value = res?.data?.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "头像",
    dataIndex: "userAvatar",
    slotName: "userAvatar",
    width: 80,
  },
  {
    title: "用户id",
    dataIndex: "id",
    width: 180,
  },
  {
    title: "用户账号",
    dataIndex: "userAccount",
    ellipsis: true,
    tooltip: true,
    width: 180,
  },
  {
    title: "用户名",
    dataIndex: "userName",
    // slotName: "tags",
    width: 180,
  },
  {
    title: "用户角色",
    dataIndex: "userRole",
    slotName: "userRole",
    width: 100,
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    width: 170,
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (user: User) => {
  const res = await UserControllerService.deleteUserUsingPost({
    id: user.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const doUpdate = async (user: User) => {
  const res = await UserControllerService.resetPasswordUsingPost(user?.id);
  if (res.code === 0) {
    message.success("重置密码成功");
    loadData();
  } else {
    message.error("重置密码失败");
  }
};

</script>

<style scoped>
#manageUserView {
  padding-left: 8%;
  padding-right: 8%;
}
</style>