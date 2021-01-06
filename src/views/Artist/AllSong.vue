<template>
  <div id="artist-song">
    <a-table
      :columns="columns"
      :data-source="songs"
      :pagination="{
        defaultPageSize: 10,
        total: resultInfo.total,
        current: resultInfo.pageNo
      }"
      :show-total="(total, range) => `${total}条结果`"
      @change="getPageInfo"
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
import { TableColumn, Pagination } from "@/types/antd";
import { getHotSongs } from "@/utils/apis";
import { sec2Time, setStoreState } from "@/utils";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { StoreState } from "@/types/store";
import { RecursivePartial, WithKey } from "@/types/base";
import { Entity, Platform } from "@/types/response/base";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { HotSong, HotSongResponse } from "@/types/response/artist";
export default defineComponent({
  name: "allSongTab",
  setup() {
    const store = useStore<StoreState>();
    const songs = ref<(HotSong & WithKey)[]>([]);
    const loading = computed(() => store.state.loading);
    const router = useRouter();
    const _setStoreState = (payload: RecursivePartial<StoreState>) =>
      setStoreState(store, payload);
    const { id, platform } = store.state.artistDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
    }
    const resultInfo = ref({
      pageNo: 1,
      total: 0
    });

    const getPageInfo = (pagination: Partial<Pagination>) => {
      const pageNo = pagination.current ?? 1;
      getHotSongs(id!, platform!, pageNo)
        .then(res => {
          const songResult = (res.data as HotSongResponse).data;
          songs.value = songResult.hotSongs;
          songs.value.forEach(song => {
            song.key = song.id;
          });
          resultInfo.value = {
            total: songResult.total,
            pageNo: pageNo
          };
        })
        .finally(() => {
          _setStoreState({
            loading: false
          });
        });
      _setStoreState({
        loading: true
      });
    };
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
    getPageInfo({ current: 1 });
    return {
      columns,
      songs,
      resultInfo,
      SEARCH_PAGE_SIZE,
      getPageInfo
    };
  }
});
</script>

<style></style>
