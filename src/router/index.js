import Vue from 'vue'
import Router from 'vue-router'
import MyTree from '@/components/MyTree'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MyTree',
      component: MyTree
    }
  ]
})
