<template>
  <div id="questionSubmitList">
    <h2 style="color: #51416b">让我看看大家的提交</h2>
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
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <!--              {{ JSON.stringify(record.judgeInfo) }}-->
        {{ record.judgeInfo }}
      </template>
      <template #status="{ record }">
        <!--              {{ JSON.stringify(record.judgeInfo) }}-->
        <div
          style="font-weight: bold"
          :style="{ color: getStatusColor(record.status) }"
        >
          {{ record.status }}
        </div>
      </template>
      <!--      <template #createTime="{ record }">-->
      <!--        {{ record.createTime }}-->
      <!--              {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
      <!--      </template>-->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmit,
  QuestionSubmitQueryRequest,
} from "../../generated";
import message from "@arco-design/web-vue/es/message";
import { QuestionStateEnum } from "@/views/question/QuestionStateEnum";

/**
 * 定义组件属性类型
 */
interface Props {
  questionId: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  questionId: () => "",
});

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: props.questionId,
  language: undefined,
  pageSize: 10,
  current: 1,
  sortOrder: "descend",
  sortField: "updateTime",
});

const loadData = async () => {
  const res = await QuestionControllerService.listSubmitQuestionByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    dataList.value.forEach((item: QuestionSubmit) => {
      item.status = QuestionStateEnum[item.status];
      item.userId = maskNumber(item?.userId);
      // item.judgeInfo = JSON.parse(item.judgeInfo);
      // if (item.judgeInfo.memory == 0) {
      //   item.judgeInfo.memory = "-";
      // }
    });
    total.value = res?.data?.total;
  } else {
    message.error("加载失败，请稍后再试：" + res.message);
  }
};

function maskNumber(number: number) {
  // 将数字转换为字符串
  const numStr = number.toString();
  // 获取字符串的长度
  const length = numStr.length;
  // 如果数字长度小于或等于5位，直接返回原数字
  if (length <= 5) {
    return numStr;
  }
  // 计算星号的数量，即除去前5位之外的数字长度
  const starCount = length - 7;
  // 创建遮蔽用的星号字符串
  const mask = "*".repeat(starCount);
  // 拼接字符串：开头5位 + 星号
  return numStr.slice(0, 7) + mask;
}

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
    ellipsis: true,
    width: 80,
  },
  {
    title: "编程语言",
    dataIndex: "language",
    width: 80,
  },
  {
    title: "判题信息",
    dataIndex: "judgeInfo",
    children: [
      {
        title: "执行信息",
        dataIndex: "judgeInfo.message",
        width: 100,
      },
      {
        title: "执行内存",
        dataIndex: "judgeInfo.memory",
        width: 60,
      },
      {
        title: "执行时间",
        dataIndex: "judgeInfo.time",
        width: 60,
      },
    ],
    width: 220,
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    width: 110,
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
    width: 80,
  },
  {
    title: "时间",
    dataIndex: "updateTime",
    width: 100,
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

const getStatusColor = (statusEnum: string) => {
  if (statusEnum === "RUNNING") {
    return "orange";
  } else if (statusEnum === "WAITING") {
    return "lightblue";
  } else if (statusEnum === "SUCCEED") {
    return "green";
  } else if (statusEnum === "FAILED") {
    return "red";
  }
  // 返回默认颜色或者其他逻辑
  return "black";
};
</script>

<style scoped>
#questionSubmitList table {
}
</style>
