<template>
  <div id="app">
    <div class="content-wrap">
      <div id="nav">
        <BaseNavigation />
      </div>
      <router-view />
    </div>
    <BaseFooter />
  </div>
</template>
<script>


export default({
  setup() {
    document.title = 'StudyPlan';
    document.documentElement.setAttribute('lang', 'de')
    //const favicon = document.getElementById("favicon");      
    //favicon.href = "https://www.google.com/favicon.ico";
  },
  mounted(){
    const favicon = document.getElementById("favicon");
    console.log(favicon);
  },
})
</script>

<style lang="scss">
$htwGruen: #76b900;
html {
  overflow-x: hidden;
}
html,
body {
  max-height: 100vh;
  max-width: 100vw;
  margin: -0px !important;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  position: relative;
  min-height: 100vh;
  width: 100vw;
}

.content-wrap {
  padding-bottom: 100px;
}

#nav {
  padding: 30px 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: $htwGruen;
}
</style>
