/**
 * @author 挽歌
 * @description 向场景中添加提示标志，供用户进行交互和浏览。
 * **/
import {
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
} from "three";
import { livingRoomTexture, tipTexture } from "./TTextures";
import * as THREE from 'three'
import { dataList } from "../data/pointData";

export let objectList = [];
export const tipsSpriteList = [];


// ------------------------------------------------------
// 创建一个Canvas元素  
const canvas = document.createElement('canvas');  
canvas.width = 1024;
canvas.height = 1024;
let text='测试代码'
// 获取Canvas的2D渲染上下文  
const context = canvas.getContext("2d");
context.fillStyle = "rgba(100,100,100,1)";
context.fillRect(0, 256, 1024, 512);
context.textAlign = "center";
context.textBaseline = "middle";
context.font = "bold 200px Arial";
context.fillStyle = "rgba(255,255,255,1)";
context.fillText(text, canvas.width / 2, canvas.height / 2);
  
// 创建一个纹理，将Canvas内容作为数据源  
const texture = new THREE.Texture(canvas);  
texture.needsUpdate = true; // 通知Three.js纹理已更改  
// ------------------------------------------------------
// const tipMaterial = new SpriteMaterial({ map: tipTexture, color: 0xffffff });
const tipMaterial = new SpriteMaterial({ map: texture, color: 0xffffff });

if (false) {
  //#endregion
} else {
  //#region 球型的方式添加
  const sphereGeometry = new SphereGeometry(16, 50, 50);
  sphereGeometry.scale(16, 16, -16);
  const sphereMaterial = new MeshBasicMaterial({ map: livingRoomTexture });
  const sphere = new Mesh(sphereGeometry, sphereMaterial);
  objectList.push(sphere);

  addTip(dataList.livingRoomTipList);
  //#endregion
}

export function addTip(data) {
  // 清除掉之前的
  tipsSpriteList.length = 0;
  data.forEach((item) => {
    const tipSprite = new Sprite(tipMaterial);
    tipSprite.scale.set(30, 30, 30);
    tipSprite.position.set(item.position.x, item.position.y, item.position.z);
    tipSprite.content = item.content;
    tipsSpriteList.push(tipSprite);
  });
}
