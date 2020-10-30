<template>
  <a-tabs>
    <a-tab-pane key="song" tab="歌曲">
      <a-table
        :columns="columns"
        :data-source="songs"
        :pagination="{
          defaultPageSize: 60,
          total: resultInfo.total,
          current: resultInfo.pageNo
        }"
        :loading="loading"
        :show-total="(total, range) => `${total}条结果`"
        @change="search"
      >
        <template v-slot:platform="{ text }">
          <span v-if="text === 'cloudMusic'">
            <a-tag color="red">网易云</a-tag>
          </span>
          <span v-else-if="text === 'qqMusic'">
            <a-tag color="orange">QQ音乐</a-tag>
          </span>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import { instance } from "@/utils/request";
import { TableColumn, Pagination } from "@/types/antd";
import { StoreState } from "@/types/store";
import { Song } from "@/types/response/song";
import { SearchSongResultResponse } from "@/types/response/search";
import { Entity, Platform } from "@/types/response/base";
import { WithKey } from "@/types/base";
export default defineComponent({
  name: "SearchResult",
  setup() {
    const store = useStore<StoreState>();

    const songs = ref<(Song & WithKey)[]>([]);
    const loading = ref(false);
    const keyword = ref(store.state.search.keyword);
    const resultInfo = ref({
      pageNo: 1,
      total: 0
    });
    const search = (pagination?: Partial<Pagination>) => {
      instance
        .get("/search", {
          params: {
            keyword: keyword.value,
            pageNo: pagination ? pagination.current : resultInfo.value.pageNo
          }
        })
        .then(res => {
          loading.value = false;
          store.commit("setState", {
            search: {
              keywordUpdated: false,
              keyword: keyword.value
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
            /**
             * 网易云没数据时不包含total字段
             */
            total:
              searchResult.qqMusic.total + (searchResult.cloudMusic.total ?? 0)
          };
        });
      loading.value = true;
    };
    watch(
      () => store.state.search.keyword,
      () => {
        if (store.state.search.keywordUpdated) search({ current: 1 });
      },
      {
        immediate: true
      }
    );

    const columns: TableColumn<Song>[] = [
      {
        title: "平台",
        dataIndex: "platform",
        width: 20,
        slots: { customRender: "platform" }
      },
      {
        title: "歌曲",
        dataIndex: "name",
        width: 200
      },
      {
        title: "艺术家",
        dataIndex: "artists",
        width: 100,
        customRender: ({ text: curData }: { text: Entity[] }) =>
          curData.map(artist => artist.name).join("/")
      },
      {
        title: "专辑",
        dataIndex: "album",
        width: 200,
        customRender: ({ text: curData }: { text: Entity }) => curData.name
      },
      {
        title: "时长",
        width: 20
      }
    ];
    return {
      columns,
      songs,
      loading,
      resultInfo,
      search
    };
  }
});
</script>
