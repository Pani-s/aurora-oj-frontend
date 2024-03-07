<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <a href="/">
            <img src="../assets/oj-logo.svg" class="logo" />
            <img src="../assets/title-1.png" class="title-img" />
            <!--          <div>Aurora OJ</div>-->
          </a>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a
          href="https://github.com/Pani-s"
          target="_blank"
          style="text-decoration-line: none; color: inherit"
        >
          ♪ Are you feeling the rush ♪ &nbsp;© 2024
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  /*background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")*/
  /*0% 0% / 100% 100%;*/
  background: url("@/assets/cool-background.svg") center center / cover
    no-repeat;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#userLayout .title-img {
  height: 50px;
  margin-top: 10px;
}
</style>
<script></script>
