<template>
  <div id="root-container">
    <div id="menu-side">
      <div class="header"></div>
      <a-menu id="side-menu" mode="inline" v-model:selectedKeys="currentKeys">
        <a-menu-item-group title="通用">
          <a-menu-item key="home">
            <home-outlined />
            <span>首页</span>
          </a-menu-item>
        </a-menu-item-group>
        <a-menu-item-group title="我的音乐">
          <a-menu-item key="likes">
            <like-outlined />
            <span>我喜欢的</span>
          </a-menu-item>
        </a-menu-item-group>
      </a-menu>
    </div>
    <div id="content-side">
      <div class="header">
        <div class="layout">
          <left-outlined />
          <right-outlined />
          <a-input
            placeholder="搜索音乐"
            v-model:value="keyword"
            @keydown.enter="search"
          >
            <template v-slot:prefix>
              <search-outlined />
            </template>
          </a-input>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { StoreState } from "@/types/store";
import {
  SearchOutlined,
  HomeOutlined,
  LikeOutlined,
  LeftOutlined,
  RightOutlined
} from "@/icons";

export default defineComponent({
  name: "SideMenu",
  components: {
    SearchOutlined,
    HomeOutlined,
    LikeOutlined,
    LeftOutlined,
    RightOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();
    const keyword = ref("");
    const currentKeys = ref(["search"]);

    const search = (e: KeyboardEvent) => {
      router.push({
        name: "search",
        query: { keyword: (e.target as HTMLInputElement).value }
      });
      store.commit("setState", {
        search: {
          keywordUpdated: true,
          keyword: (e.target as HTMLInputElement).value
        }
      } as StoreState);
    };

    return {
      keyword,
      currentKeys,
      search
    };
  }
});
</script>

<style lang="scss">
#root-container {
  display: flex;
  height: 100vh;
  max-height: 100vh;

  #menu-side {
    width: 200px;
    background-color: rgb(245, 245, 245);

    ul#side-menu {
      background-color: transparent;
    }
  }

  #content-side {
    flex-grow: 1;
    padding: 0 1rem;
    overflow-y: scroll;

    & > .header {
      display: flex;
      align-items: center;

      .layout {
        flex-grow: 1;

        & > .anticon {
          padding: 0 10px;
        }

        & > .ant-input-affix-wrapper {
          width: auto;
          margin-left: 1rem;
        }
      }
    }
  }

  #menu-side,
  #content-side {
    & > .header {
      height: 3rem;
    }
  }
}
</style>
