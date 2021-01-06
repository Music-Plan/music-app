<template>
  <div id="hotsong">
    <div class="hot-songs">
      <span>热门歌曲</span>
      <div style="flex: 1"></div>
      <span @click="setTab"
        >更多<RightOutlined :style="{ fontSize: '12px', color: '#999' }"
      /></span>
    </div>
    <a-table
      :columns="columns"
      :data-source="hotSongs"
      :pagination="false"
      :show-total="(total, range) => `${total}条结果`"
    >
      <template v-slot:artists="{ text: artists }">
        <template v-for="(artist, index) of artists" :key="artist.id">
          <a>{{ artist.name }}</a>
          <span v-if="index < artists.length - 1"> / </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { HotSong, HotSongResponse } from "@/types/response/artist";
import { TableColumn, Pagination } from "@/types/antd";
import { getHotSongs } from "@/utils/apis";
import { StoreState } from "@/types/store";
import { sec2Time, setStoreState } from "@/utils";
import { Entity, Platform } from "@/types/response/base";
import { RecursivePartial, WithKey } from "@/types/base";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { RightOutlined } from "@/icons";
export default defineComponent({
  name: "HotSongTab",
  components: {
    RightOutlined
  },
  setup(props, { emit }) {
    const store = useStore<StoreState>();
    const router = useRouter();
    const hotSongs = ref<(HotSong & WithKey)[]>([]);
    const loading = computed(() => store.state.loading);
    const _setStoreState = (payload: RecursivePartial<StoreState>) =>
      setStoreState(store, payload);
    const { id, platform } = store.state.artistDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
    }

    const setTab = () => {
      emit("change", "song");
    };

    getHotSongs(id!, platform!)
      .then(res => {
        const songResult = (res.data as HotSongResponse).data;
        hotSongs.value = songResult.hotSongs;
        hotSongs.value.forEach(song => {
          song.key = song.id;
        });
      })
      .finally(() => {
        _setStoreState({
          loading: false
        });
      });
    _setStoreState({
      loading: true
    });
    const columns: TableColumn<HotSong>[] = [
      {
        title: "歌名",
        dataIndex: "name",
        width: 200,
        ellipsis: true,
        slots: { customRender: "name" }
      },
      {
        title: "艺术家",
        dataIndex: "artists",
        width: 100,
        ellipsis: true,
        slots: { customRender: "artists" }
      },
      {
        title: "专辑",
        dataIndex: "album",
        width: 200,
        ellipsis: true,
        customRender: ({ text: curData }: { text: Entity }) => curData.name
      },
      {
        title: "时长",
        dataIndex: "duration",
        width: 50,
        customRender: ({ text: duration }: { text: number }) =>
          sec2Time(Math.floor(duration))
      }
    ];
    return {
      columns,
      hotSongs,
      SEARCH_PAGE_SIZE,
      platform,
      setTab
    };
  }
});
</script>

<style lang="scss" scoped>
.hot-songs {
  font-size: 24px;
  color: #333;
  padding-left: 16px;
  display: flex;
  align-items: center;
  padding-right: 16px;
  :last-child {
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
}
</style>
