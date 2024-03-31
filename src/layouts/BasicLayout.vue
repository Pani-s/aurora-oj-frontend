<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a
          href="https://github.com/Pani-s"
          target="_blank"
          style="text-decoration-line: none; color: #51416b"
        >
          Rainy days ♪ &nbsp;© 2024
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  /*margin-bottom: 5px;*/
  box-shadow: #e5e5e5 1px 1px 5px;
  z-index: 10;
  /*这样就不会被覆盖了*/
}

#basicLayout .content {
  /*background: linear-gradient(to right, #e5f2ff, #fdebff);*/
  /*background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png");*/
  /*background: rgb(255, 255, 255);*/
  background: linear-gradient(180deg, #f3f3ff 0%, #ffffff 30%);
  /*margin-bottom: 16px;*/
  padding: 20px;
}

#basicLayout .footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*color: var(--color-white);*/
  background: rgba(255, 255, 255, 0.87);
  font-size: 14px;
  font-stretch: condensed;
  text-align: center;
  padding: 15px;
}

/*#basicLayout .footer {*/
/*  background: rgba(255, 255, 255, 0.87);*/
/*  padding: 16px;*/
/*  position: sticky;*/
/*  bottom: 0;*/
/*  left: 0;*/
/*  right: 0;*/
/*  text-align: center;*/
/*}*/
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
