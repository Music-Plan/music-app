import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import SideMenu from "../views/SideMenu.vue";
import SearchResult from "../views/Search/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/main"
  },
  {
    path: "/main",
    component: SideMenu,
    children: [
      {
        path: "search",
        name: "search",
        component: SearchResult
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
