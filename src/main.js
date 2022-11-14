import { createApp } from 'vue'
import App from './App.vue'
import AutoplayAnimation from './components/AutoplayAnimation.vue'
import AutoplayVideo from './components/AutoplayVideo.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { ScrollTrigger } from 'vue-gsap-scrolltrigger'

import Home from './views/Home.vue'
import About from './views/About.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

createApp(App)
.use(router)
.component('AutoplayAnimation', AutoplayAnimation)
.component('AutoplayVideo', AutoplayVideo)
.component('ScrollTrigger', ScrollTrigger)
.mount('#app')
