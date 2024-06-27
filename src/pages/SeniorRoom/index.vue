<template>
    <div class="three-canvas" ref="threeTargetRef"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import TEngine from './three/TEngine'
const threeTargetRef = ref(null);

onMounted(() => {
  nextTick(() => {
    new TEngine(threeTargetRef.value);
  });
});
</script>

<style>
.three-canvas {
  width: 100vw;
  height: 100vh;
}
</style>
