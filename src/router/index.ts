import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Basement from "../views/Basement.vue";
import SearchResult from "../views/Search/index.vue";
import AlbumDetail from "../views/AlbumDetail.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/main"
  },
  {
    path: "/main",
    component: Basement,
    children: [
      {
        path: "search",
        name: "search",
        component: SearchResult
      },
      {
        path: "album/detail",
        name: "albumDetail",
        component: AlbumDetail
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
