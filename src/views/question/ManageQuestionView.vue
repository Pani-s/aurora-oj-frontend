<template>
  <div id="manageQuestionView">
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="orange"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record)" id="btn">
            修改
          </a-button>
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
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const tableRef = ref();

const dataList = ref<Array<Question>>([]);
const total = ref(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    //这个故事告诉我们，没有好的前端基础不要想着：懒得后端转换交给前端吧！
    dataList.value.forEach((item) => {
      try {
        // 解析details字段的JSON字符串
        item.judgeConfig = JSON.parse(item.judgeConfig);
        item.tags = JSON.parse(item.tags);
      } catch (error) {
        console.error("Parsing error for item!!!啊啊啊啊");
        // 可以选择设置为null或者保留原始字符串
        item.judgeConfig = null;
      }
    });
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
    title: "id",
    dataIndex: "id",
    width: 80,
  },
  {
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
    width: 180,
  },
  {
    title: "标签",
    dataIndex: "tags",
    slotName: "tags",
    width: 180,
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    width: 50,
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    width: 50,
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    children: [
      {
        title: "时间限制",
        dataIndex: "judgeConfig.timeLimit",
        width: 80,
      },
      {
        title: "内存限制",
        dataIndex: "judgeConfig.memoryLimit",
        width: 80,
      },
      {
        title: "堆栈限制",
        dataIndex: "judgeConfig.stackLimit",
        width: 80,
      },
    ],
    width: 240,
  },
  {
    title: "创建用户id",
    dataIndex: "userId",
    ellipsis: true,
    tooltip: true,
    width: 140,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 170,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 170,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style>
#manageQuestionView {
  padding-left: 8%;
  padding-right: 8%;
}

#btn {
  background-color: #cebeff;
  color: #ffffff;
}

#btn:hover {
  background-color: #9685cc;
  transition: 0.3s;
}

.arco-table-th {
  background-color: rgba(238, 236, 248, 0.61);
}
</style>
