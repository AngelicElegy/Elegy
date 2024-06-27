<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import * as three from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, onMounted } from "vue";

const scene = new three.Scene();
const camera = new three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 0.1;
scene.add(camera);

const spheregeometry = new three.SphereGeometry(5, 32, 32);
const loader = new RGBELoader();

loader.load("./imgs/VRhdr/HDRI_Hen-Hotel_Room_4k.hdr", (texture) => {
  const material = new three.MeshBasicMaterial({ map: texture });
  const sphere = new three.Mesh(spheregeometry, material);
  sphere.geometry.scale(1, 1, -1);
  scene.add(sphere);
});
// loader.load("./imgs/VRhdr/ersisd-Beerse_Kitchen_4k.hdr", (texture) => {
//   const material = new three.MeshBasicMaterial({ map: texture });
//   const sphere = new three.Mesh(spheregeometry, material);
//   sphere.geometry.scale(1, 1, -1);
//   scene.add(sphere);
// });

// 初始化渲染器
const renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref(null);

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  render();
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

/* 100vh是指铺满屏幕的高度 */
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
