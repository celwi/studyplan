<template>
  <div>
    <slot></slot>
    <div class="line"></div>
  </div>
</template>

<style lang="scss" scoped>
$htwGruen: #76b900;
h1 {
  font-weight: bold;
  margin-bottom: 20px;
  color: black;
}
.line {
  border-top: 3px solid $htwGruen;
  margin: 0 auto;
  padding: 0;
  width: 30px;
  height: 39px;
}
</style>
