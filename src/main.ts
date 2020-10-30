import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Menu, Input, Tabs, Table, Tag } from "ant-design-vue";

const app = createApp(App);
app
  .use(Menu)
  .use(Input)
  .use(Tabs)
  .use(Table)
  .use(Tag);

app
  .use(store)
  .use(router)
  .mount("#app");
