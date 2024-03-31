<template>
  <div id="rankComponent">
    <!--    <a-carousa-->
    <!--      :style="{-->
    <!--        width: '100%',-->
    <!--        height: '250px',-->
    <!--      }"-->
    <!--      :auto-play="true"-->
    <!--      indicator-type="dot"-->
    <!--      show-arrow="hover"-->
    <!--    >-->
    <!--      <a-carousa-item>-->
    <!--        <div style="background-color: white">-->
    <!--          aaaaaaaaaaa-->
    <!--          <img-->
    <!--            src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp"-->
    <!--            :style="{-->
    <!--              height: '100%',-->
    <!--              width: '100%',-->
    <!--            }"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </a-carousa-item>-->
    <!--      <a-carousa-item v-for="image in images" :key="image">-->
    <!--        &lt;!&ndash;        aaaaaaaaaaaaaaaaaa&ndash;&gt;-->
    <!--        <img-->
    <!--          :src="image"-->
    <!--          :style="{-->
    <!--            height: '100%',-->
    <!--            width: '100%',-->
    <!--          }"-->
    <!--        />-->
    <!--      </a-carousa-item>-->
    <!--    </a-carousa>-->

    <div class="ranking-list" :v-model="rank3">
      <a-row :gutter="20" class="ranking-row">
        <!-- 第二名 -->
        <a-col :span="6">
          <a-avatar
            :size="70"
            :image-url="rank3?.userAvatar"
            style="background-color: #ffffff"
          >
          </a-avatar>
          <div class="name-score">
            <span class="name">{{ rank3?.userName ?? "虚位以待" }}</span
            ><br />
            <span class="score">昨日通过数: {{ rank3?.count }}</span>
          </div>
        </a-col>
        <!-- 第一名 -->
        <a-col :span="12" :v-model="rank1">
          <div class="first-place">
            <div class="first-avatar">
              <a-avatar
                :size="80"
                :image-url="rank1?.userAvatar"
                style="background-color: #ffffff"
              >
              </a-avatar>
              <img class="crown" src="../assets/crown.svg" alt="crown" />
            </div>
            <div class="name-score">
              <span class="name">{{ rank1?.userName }}</span
              ><br />
              <span class="score">昨日通过数: {{ rank1?.count }}</span>
            </div>
          </div>
        </a-col>
        <!-- 第三名 -->
        <a-col :span="6" :v-model="rank2">
          <a-avatar
            :size="60"
            :imageUrl="rank2?.userAvatar"
            style="background-color: #ffffff"
          >
          </a-avatar>
          <div class="name-score">
            <span class="name">{{ rank2?.userName ?? "虚位以待" }}</span
            ><br />
            <span class="score">昨日通过数: {{ rank2?.count }}</span>
          </div>
        </a-col>
      </a-row>
    </div>
    <span style="color: #ffffff; font-size: small"
      >&nbsp; # 数据每日0点更新</span
    >
  </div>
</template>

<script setup lang="ts">
import { QuestionControllerService, Rank } from "../../generated";
import { onMounted, ref } from "vue";
import message from "@arco-design/web-vue/es/message";


const images = [
  "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp",
  "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp",
  "https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp",
];
let rank1 = ref<Rank>();
let rank2 = ref<Rank>();
let rank3 = ref<Rank>();
onMounted(() => {
  loadRank();
});
const loadRank = async () => {
  const res = await QuestionControllerService.getDailyRankNewPassUsingGet();
  if (res.code === 0) {
    const list = res.data;
    if (!list) {
      return;
    }
    if (list.length > 0) {
      rank1.value = list[0]; // 当数组长度大于0时，将第一个元素赋值给rank1
    }

    if (list.length > 1) {
      rank2.value = list[1]; // 当数组长度大于1时，将第二个元素赋值给rank2
    }

    if (list.length > 2) {
      rank3.value = list[2]; // 当数组长度大于2时，将第三个元素赋值给rank3
    }
  } else {
    message.error("加载排行榜失败，" + res.message);
  }
};
</script>

<style scoped>
#rankComponent {
}

.ranking-list {
  margin: 30px;
  text-align: center;
}

.ranking-row {
  margin-bottom: 20px;
}

.name-score {
  margin-top: 10px;
}

.name {
  color: #8e869b;
  font-size: 15px;
  font-weight: bold;
}

.score {
  font-size: 14px;
  color: #666;
}

.first-place {
  position: relative;
  display: inline-block;
}

.first-avatar {
  position: relative; /* 设置头像容器为相对定位 */
}

.crown {
  position: absolute; /* 绝对定位，相对于最近的已定位的祖先元素 */
  top: -30px; /* 根据实际情况调整，使皇冠位于头像上方 */
  left: 50%; /* 水平居中 */
  transform: translateX(-50%); /* 保持皇冠水平居中 */
  width: 40px; /* 根据实际皇冠图像大小调整 */
  height: auto; /* 保持图像比例 */
  /* 其他样式，如边框、阴影等 */
}
</style>