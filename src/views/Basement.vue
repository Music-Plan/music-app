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
          <a-input
            placeholder="搜索音乐"
            v-model:value="keyword"
            @keydown.enter="search"
            size="large"
            class="search-input"
          >
            <template v-slot:prefix>
              <search-outlined />
            </template>
          </a-input>
        </div>
      </div>
      <div class="content">
        <div class="wrapper">
          <a-spin :spinning="loading">
            <router-view />
          </a-spin>
        </div>
      </div>
      <div class="footer"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { StoreState } from "@/types/store";
import { SearchOutlined, HomeOutlined, LikeOutlined } from "@/icons";
import { setStoreState } from "@/utils";

export default defineComponent({
  name: "SideMenu",
  components: {
    SearchOutlined,
    HomeOutlined,
    LikeOutlined
  },
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();
    const currentKeys = ref(["search"]);

    const keyword = ref("");
    const search = () => {
      if (!keyword.value) return;
      router.push({
        name: "search",
        query: { keyword: keyword.value }
      });
      setStoreState(store, {
        search: {
          keywordUpdated: true,
          keyword: keyword.value
        }
      });
    };

    const loading = computed(() => store.state.loading);

    return {
      keyword,
      currentKeys,
      search,
      loading
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
    flex-shrink: 0;
    background-color: rgb(245, 245, 245);

    ul#side-menu {
      background-color: transparent;
    }
  }

  #content-side {
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;

    & > .header {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      padding: 0 1rem;

      .layout {
        flex-grow: 1;

        & > .anticon {
          padding: 0 10px;
        }

        & > .ant-input-affix-wrapper {
          width: 300px;

          & > input.ant-input {
            border-radius: 2rem;
          }
        }
      }
    }

    & > .content {
      flex-grow: 1;
      overflow-y: scroll;

      .wrapper {
        padding: 0 1rem;
      }
    }
  }

  #menu-side,
  #content-side {
    & > .header {
      height: 4rem;
    }
  }
}
</style>
