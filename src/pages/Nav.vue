<template>
  <div class="container">
    <el-button type="primary" @click="goVR('/vr/simple')">HDR实现VR看房</el-button>
    <el-button type="success" @click="goVR('/vr/afford')">正方体实现VR看房</el-button>
    <el-button type="warning" @click="goVR('/vr/home')">VR全景看房</el-button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const Router = useRouter();

const goVR = (path) => {
  Router.push(path);
};
</script>

<style lang="scss" scoped>
.container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
