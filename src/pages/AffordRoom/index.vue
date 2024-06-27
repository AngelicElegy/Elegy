<template>
  <div class="container" ref="container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ref, onMounted } from "vue";
let scene, camera, renderer, cube;
let ww = window.innerWidth;
let wh = window.innerHeight;
const container = ref(null); // 获取dom对象
const bedroomArr = {
  tip: "bedroom",
  names: ["23_l", "23_r", "23_u", "23_d", "23_b", "23_f"],
};
// 初始化场景
scene = new THREE.Scene();
function init() {
  // 初始化相机
  camera = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 1000);
  // 设置相机位置
  camera.position.z = 0.1;
  // 初始化渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(ww, wh);
  renderer.setPixelRatio(window.devicePixelRatio); // 保证渲染清晰度
}
init();

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

function addListen() {
  // 监听画面变化
  window.addEventListener("resize", () => {
    const iwidth = window.innerWidth;
    const iheigt = window.innerHeight;
    //更新摄像头
    camera.aspect = iwidth / iheigt;
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix();
    // 更新渲染器
    renderer.setSize(iwidth, iheigt);
    // 设置渲染器像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });
}

// 添加立方体
const geometry = new THREE.BoxGeometry(10, 10, 10);

function addCube(arr) {
  const boxMaterials = [];
  arr.names.forEach((item, index) => {
    console.log(`./imgs/VRimg/${arr.tip}/${item}.jpg`);
    boxMaterials.push(
      loadTexture(`./imgs/VRimg/${arr.tip}/${item}.jpg`, index)
    );
  });
  cube = new THREE.Mesh(geometry, boxMaterials);
  scene.add(cube);
}
addCube(bedroomArr);
cube.geometry.scale(1, 1, -1);
cube.rotation.y = 3.5;

// 负责把图片加工成材料
function loadTexture(url, index = 0) {
  let texture = new THREE.TextureLoader().load(url);
  let boxMaterial;
  if (index == "2" || index == "3") {
    // 如果是上和下图，则进行旋转
    texture.rotation = Math.PI;
    texture.center = new THREE.Vector2(0.5, 0.5);
    boxMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
  } else {
    boxMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });
  }

  return boxMaterial;
}

// 挂载完毕之后获取dom
onMounted(() => {
  // 添加控制器
  const controls = new OrbitControls(camera, container.value);
  controls.enableDamping = true; // 开启控制器阻尼
  container.value.appendChild(renderer.domElement);
  render(scene);
  addListen();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
