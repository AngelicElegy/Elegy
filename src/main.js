import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/reset.css'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 页面跳转时，自动回顶
router.afterEach(() => {
    window.scrollTo(0, 0)
})
createApp(App).use(router).use(ElementPlus, {
    locale: zhCn
}).mount('#app')
