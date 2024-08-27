<template>
  <div id="questionSubmitList">
    <a-button
      shape="round"
      style="float: right"
      type="outlined"
      @click="loadData"
    >
      <icon-refresh />
    </a-button>
    <h2 style="color: #51416b; font-family: 幼圆, sans-serif">我的历史提交</h2>
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
      <template #judgeInfoMemory="{ record }">
        <!--        整数除法-->
        <template
          v-if="record.judgeInfo.memory && record.judgeInfo.memory !== 0"
        >
          {{ ((record.judgeInfo.memory / 1024) | 0) }}kb
        </template>
        <template v-else> -</template>
      </template>

      <template #judgeInfoTime="{ record }">
        <template v-if="record.judgeInfo.time && record.judgeInfo.time !== 0">
          {{ record.judgeInfo.time }}ms
        </template>
        <template v-else> -</template>
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
      <template #optional="{ record }">
        <a-space>
          <a-button
            style="max-width: 50px; font-size: smaller"
            @click="showAnswer(record)"
          >
            查看
          </a-button>
        </a-space>
      </template>

      <!--      <template #createTime="{ record }">-->
      <!--        {{ record.createTime }}-->
      <!--              {{ moment(record.createTime).format("YYYY-MM-DD") }}-->
      <!--      </template>-->
    </a-table>

    <a-modal v-model:visible="visible" @ok="handleOk" style="min-width: 50%">
      <template #title> 提交结果</template>
      <h3>详细信息</h3>
      <MdViewer :value="detail || '无详细信息'" />
      <a-divider />
      <h3>你的代码~</h3>
      <a-textarea :model-value="ans" auto-size readonly></a-textarea>
    </a-modal>
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
import { QuestionStateEnum } from "@/views/questionsubmit/QuestionStateEnum";
import { QuestionStateStrEnum } from "@/views/questionsubmit/QuestionStateStrEnum";
import MdViewer from "@/components/MdViewer.vue";

const visible = ref(false);
const ans = ref<string>("");
const detail = ref<string>("");

const showAnswer = (record: any) => {
  visible.value = true;
  ans.value = record.code;
  detail.value = record.judgeInfo.details;
};
const handleOk = () => {
  visible.value = false;
};

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
});

const loadData = async () => {
  const res =
    await QuestionControllerService.listMySubmitQuestionByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  if (res.code === 0) {
    dataList.value = res?.data?.records;
    dataList.value.forEach((item: QuestionSubmit) => {
      item.status = QuestionStateEnum[item.status];
      item.judgeInfo = JSON.parse(item.judgeInfo);
    });
    total.value = res?.data?.total;
  } else {
    message.error("加载失败，请稍后再试：" + res.message);
  }
};

// function maskNumber(number: number) {
//   // 将数字转换为字符串
//   const numStr = number.toString();
//   // 获取字符串的长度
//   const length = numStr.length;
//   // 如果数字长度小于或等于5位，直接返回原数字
//   if (length <= 5) {
//     return numStr;
//   }
//   // 计算星号的数量，即除去前5位之外的数字长度
//   const starCount = length - 7;
//   // 创建遮蔽用的星号字符串
//   const mask = "*".repeat(starCount);
//   // 拼接字符串：开头5位 + 星号
//   return numStr.slice(0, 7) + mask;
// }

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "编程语言",
    dataIndex: "language",
    width: 60,
  },
  {
    title: "判题信息",
    dataIndex: "judgeInfo",
    children: [
      {
        title: "执行信息",
        ellipsis: true,
        tooltip: true,
        dataIndex: "judgeInfo.message",
        width: 60,
      },
      {
        title: "详细信息",
        dataIndex: "judgeInfo.details",
        ellipsis: true,
        tooltip: true,
        width: 50,
      },
      {
        title: "执行内存",
        dataIndex: "judgeInfo.memory",
        slotName: "judgeInfoMemory",
        width: 50,
      },
      {
        title: "执行时间",
        dataIndex: "judgeInfo.time",
        slotName: "judgeInfoTime",
        width: 50,
      },
    ],
    width: 210,
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    width: 80,
  },
  {
    title: "提交时间",
    dataIndex: "updateTime",
    width: 100,
  },
  {
    slotName: "optional",
    width: 50,
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
  if (statusEnum === QuestionStateStrEnum.RUNNING_STR) {
    return "orange";
  } else if (statusEnum === QuestionStateStrEnum.WAITING_STR) {
    return "lightblue";
  } else if (statusEnum === QuestionStateStrEnum.SUCCESS_STR) {
    return "green";
  } else if (statusEnum === QuestionStateStrEnum.FAILED_STR) {
    return "red";
  } else if (statusEnum === QuestionStateStrEnum.ERROR_STR) {
    return "brown";
  }
  // 返回默认颜色或者其他逻辑
  return "brown";
};
</script>

<style scoped>
#questionSubmitList table {
}
</style>
