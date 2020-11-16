<template>
  <a-tabs @change="setActiveTab">
    <a-tab-pane key="song" tab="歌曲">
      <song-tab />
    </a-tab-pane>
    <a-tab-pane key="album" tab="专辑">
      <album-tab />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SongTab from "./Song.vue";
import AlbumTab from "./Album.vue";
import { setStoreState } from "@/utils";
import { useStore } from "vuex";
import { StoreState } from "@/types/store";

export default defineComponent({
  name: "SearchResult",
  components: {
    SongTab,
    AlbumTab
  },
  setup() {
    const store = useStore<StoreState>();

    const setActiveTab = (key: string) => {
      setStoreState(store, {
        search: {
          activeKey: key
        }
      });
    };

    return {
      setActiveTab
    };
  }
});
</script>
