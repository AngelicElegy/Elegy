/**
 *  核心实现
 *  初始化 Three.js 相关组件，包括场景、相机、渲染器等。
 *  添加物体和帮助器到场景中，并根据鼠标交互展示提示信息。
 *  监听窗口大小变化，鼠标点击和移动事件，实现交互操作。
 *  实现了动画循环和场景更新功能。
 * **/
import {
  Clock,
  Color,
  MathUtils,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer
} from "three"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Stats from "three/examples/jsm/libs/stats.module"

import { dataList } from "../data/pointData"
import { addTip, objectList, tipsSpriteList } from "./TBasicObject"
import { kitchenRoomTexture, livingRoomTexture } from "./TTextures"
let isKitch = true
//生成三维向量（0,0,0），相机的目标点
let target = new Vector3()
//lon 经度 竖着的 有东经 西经 ；lat 维度 横着的 有南纬 北纬
//该经纬表示相机的聚焦点，初始状态在前面
let lon = 90,
  lat = 0
//一样是相机的聚焦点，上面是角度，此处转化为弧度制
let phi = 0,
  theta = 0

export default class TEngine {
  width = 100
  height = 50
  stats = Stats()
  clock = new Clock()
  is_animate = true
  raycaster = new Raycaster()
  mouse = new Vector2()
  tip = document.createElement("div")
  constructor(el, width, height) {
    this.el = el
    this.width = width
    this.height = height

    this.setContainerWH()

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(60, this.width / this.height, 1, 1000)
    this.renderer = new WebGLRenderer({ antialias: true })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.maxDistance = 2;
    // this.controls.minDistance = 0;

    this.addObjects()
    this.setScene()
    this.setCamera()
    this.setRenderer()
    this.addContainer()

    if (this.is_animate) {
      this.animation()
    } else {
      this.render()
    }
    this.addEvent()
    this.addStats()

    this.addTipBox()
  }
  addTipBox() {
    const tip = this.tip
    tip.style.cssText = `
            display: none;
            border: 1px solid red;
            position: fixed;
            left: 0px;
            top: 0px;
            width: 200px;
            height: 120px;
        `
    this.el.appendChild(tip)
  }
  addObjects() {
    objectList.forEach(o => {
      this.scene.add(o)
    })
    this.addSpriteTip()
  }

  setContainerWH() {
    const { width, height } = this.el.getBoundingClientRect()
    this.width = width
    this.height = height
  }
  setScene() {
    this.scene.background = new Color("black")
  }
  setCamera() {
    this.camera.position.set(0, 0, 75)
  }
  setRenderer() {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
  }
  addContainer() {
    this.el.appendChild(this.renderer.domElement)
  }
  onResize() {
    this.setContainerWH()
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)

    if (!this.is_animate) {
      this.render()
    }
  }
  getIntersects(e) {
    // 优化画布坐标原点在左上定点为（0,0），而 webgl 的世界坐标远点在画布中心，则转换该坐标
    this.mouse.x = (e.clientX / this.width) * 2 - 1
    this.mouse.y = 1 - (e.clientY / this.height) * 2
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(tipsSpriteList, true)
    return {
      intersects,
      gl_x: this.mouse.x,
      gl_y: this.mouse.y,
      canvas_x: e.clientX,
      canvas_y: e.clientY
    }
  }
  onMouseClick(e) {
    e.preventDefault()
    const { intersects } = this.getIntersects(e)

    if (intersects.length > 0) {
      const obj = intersects[0].object
      if (obj.content && obj.content.showTitle) {
        console.log("showTitle")
        this.changeContentAndtips(obj.content.image)
      }
      if (obj.content && obj.content.showTip) {
        console.log("showTip")
      }
    }
  }
  changeContentAndtips(img) {
    // 去除所有的 tip
    this.scene.children = this.scene.children.filter(
      item => String(item.type) !== "Sprite"
    )

    const sphere = objectList.filter(obj => obj.type == "Mesh")[0]
    // 修改房间
    const sphereMaterial = new MeshBasicMaterial({
      map: isKitch ? kitchenRoomTexture : livingRoomTexture
    })
    sphere.material = sphereMaterial

    if (isKitch) {
      addTip(dataList.kitchenTipList)
    } else {
      addTip(dataList.livingRoomTipList)
    }

    this.addSpriteTip()

    // 慢慢进入到场景
    this.camera.fov = 145
    // const timer = setInterval(() => {
    //   if (this.camera.fov === 75) {
    //     clearInterval(timer);
    //   } else {
    //     this.camera.fov -= 1;
    //     this.camera.updateProjectionMatrix();
    //   }
    // }, 50);

    isKitch = !isKitch
  }
  addSpriteTip() {
    tipsSpriteList.forEach(t => {
      this.scene.add(t)
    })
  }
  onMousemove(e) {
    // console.log('mousemove')
    e.preventDefault()
    const { intersects, canvas_x, canvas_y } = this.getIntersects(e)
    if (intersects.length > 0) {
      const obj = intersects[0].object
      this.tip.style.left = canvas_x + "px"
      this.tip.style.top = canvas_y + "px"
      this.tip.style.display = "block"

      if (obj.content && obj.content.showTitle) {
        console.log("showTitle")
        this.tip.style.left = canvas_x + 10 + "px"
        this.tip.style.top = canvas_y + 10 + "px"
        this.tip.innerHTML = `<h2>${obj.content.title}</h2>`
      }
      if (obj.content && obj.content.showTip) {
        console.log("showTip")
        this.tip.innerHTML = `<h2>${obj.content.title}</h2><p>${obj.content.text}</p>`
      }
      console.log(obj)
    } else {
      this.tip.style.display = "none"
      this.tip.innerHTML = ""
    }
  }
  addEvent() {
    document.addEventListener("resize", this.onResize.bind(this), false)
    const canvas = this.renderer.domElement
    canvas.addEventListener("click", this.onMouseClick.bind(this), false)
    canvas.addEventListener("mousemove", this.onMousemove.bind(this), false)
  }
  animation() {
    this.renderer.setAnimationLoop(this.render.bind(this))
  }
  render() {
    this.update()
    this.renderer.render(this.scene, this.camera)
    this.stats.update()
  }
  update() {
    // 相关的物体更新
    const elapsedTime = this.clock.getElapsedTime()
    this.controls.update()

    // this.roam(elapsedTime);
  }
  // 漫游
  roam(elapsedTime) {
    lon += 0.1
    lat = Math.max(-85, Math.min(85, lat))
    phi = MathUtils.degToRad(90 - lat) // 角度转为弧度制
    theta = MathUtils.degToRad(lon)
    // 在球坐标系中算出相机的聚焦点的坐标
    target.x = Math.sin(phi) * Math.cos(theta) + elapsedTime
    target.y = Math.cos(phi)
    target.z = Math.sin(phi) * Math.sin(theta) + elapsedTime

    this.camera.lookAt(target)
  }
  addStats() {
    const statsDom = this.stats.domElement
    statsDom.style.position = "fixed"
    statsDom.style.top = "10px"
    statsDom.style.right = "10px"
    statsDom.style.left = "unset"
    this.el.appendChild(statsDom)
  }
}
