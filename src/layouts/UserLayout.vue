<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <a href="/" title="Aurora OJ">
            <img src="../assets/oj-logo.svg" class="logo" />
            <img src="../assets/title-2.png" class="title-img" />
            <!--          <div>Aurora OJ</div>-->
          </a>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="glass">
          <router-view />
        </div>
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
  background: url("http://pics.soogyu.xyz/pani/oj/ava/2024033111.webp") center center / cover
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
  justify-content: center;
  display: flex;
  /*align-items: center;*/
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

.glass{
  width: 700px;
  height: 375px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  /*gap: 20px;*/
  border-radius: 40px;
  backdrop-filter: blur(5px);
  background-color: rgba(200, 197, 222, 0.13);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
  border: 0px rgba(255,255,255,0.2) solid;
  border-bottom: 0px rgba(40,40,40,0.25) solid;
  border-right: 0px rgba(40,40,40,0.25) solid;
}
</style>
<script></script>
