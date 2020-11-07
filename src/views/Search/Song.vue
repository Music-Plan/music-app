<template>
  <div id="search-song">
    <a-table
      :columns="columns"
      :data-source="songs"
      :pagination="{
        defaultPageSize: SEARCH_PAGE_SIZE * 2,
        total: resultInfo.total,
        current: resultInfo.pageNo
      }"
      :loading="loading"
      :show-total="(total, range) => `${total}条结果`"
      @change="search"
    >
      <template v-slot:name="{ text, record }">
        <template v-if="record.platform === 'cloudMusic'">
          <a-tag color="red">网易云</a-tag>
        </template>
        <template v-else>
          <a-tag color="orange">QQ音乐</a-tag>
        </template>
        <span>{{ text }}</span>
      </template>
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
import { defineComponent, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import { TableColumn, Pagination } from "@/types/antd";
import { StoreState } from "@/types/store";
import { Song } from "@/types/response/song";
import { SearchSongResultResponse, SearchType } from "@/types/response/search";
import { Entity, Platform } from "@/types/response/base";
import { WithKey } from "@/types/base";
import { searchByKeyword } from "@/utils/apis";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
export default defineComponent({
  name: "SearchSongTab",
  setup() {
    const store = useStore<StoreState>();

    const searchType: SearchType = "song";
    const songs = ref<(Song & WithKey)[]>([]);
    const loading = ref(false);
    const resultInfo = ref({
      pageNo: 1,
      total: 0
    });
    const search = (pagination: Partial<Pagination>) => {
      searchByKeyword(
        store.state.search.keyword,
        pagination.current,
        searchType
      )
        .then(res => {
          loading.value = false;
          store.commit("setState", {
            search: {
              keywordUpdated: false
            }
          } as StoreState);
          const searchResult = (res.data as SearchSongResultResponse).data;
          songs.value = searchResult.qqMusic.songs
            .map(song => {
              song.platform = "qqMusic";
              return song;
            })
            .concat(
              searchResult.cloudMusic.songs.map(song => {
                song.platform = "cloudMusic";
                return song;
              })
            );
          songs.value.forEach(song => {
            song.key = nanoid(8);
          });
          resultInfo.value = {
            pageNo: searchResult.pageNo,
            total: searchResult.qqMusic.total + searchResult.cloudMusic.total
          };
        })
        .catch(() => {
          loading.value = false;
        });
      loading.value = true;
    };
    watch(
      () => store.state.search.keywordUpdated,
      () => {
        if (store.state.search.keywordUpdated) search({ current: 1 });
      },
      {
        immediate: true
      }
    );

    const displayTime = (duration: number) => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration - minutes * 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };
    const columns: TableColumn<Song>[] = [
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
          displayTime(duration)
      }
    ];
    return {
      columns,
      songs,
      loading,
      resultInfo,
      search,
      SEARCH_PAGE_SIZE
    };
  }
});
</script>
