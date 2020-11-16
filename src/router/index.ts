import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";
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
        path: "album/:id/detail",
        name: "albumDetail",
        component: AlbumDetail,
        props: true
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});
router.beforeEach((to, from, next) => {
  if (to.name === "albumDetail") {
    if (store.state.albumDetail.platform) next();
    else next("/main");
  }
  next();
});

export default router;
