import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    }, {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[{
        path:':id',
        name:'SingerDetail',
        component:SingerDetail
      }]
    }, {
      path: '/rank',
      name: 'Rank',
      component: Rank
    }, {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
