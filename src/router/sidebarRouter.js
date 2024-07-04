export default [
  {
    text: '首页',
    name: 'Home',
    path: '/home/index',
    component: () => import('@/views/home/index'),
    breadcrumbJump: false
  }
]
