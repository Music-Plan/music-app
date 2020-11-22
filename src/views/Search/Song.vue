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
      :show-total="(total, range) => `${total}条结果`"
      @change="search"
      :customRow="customRow"
    >
      <template v-slot:name="{ text, record }">
        <platform-tag :platform="record.platform"></platform-tag>
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
import PlatformTag from "@/components/PlatformTag.vue";
import { defineComponent, ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import { TableColumn, Pagination } from "@/types/antd";
import { StoreState } from "@/types/store";
import { Song } from "@/types/response/song";
import { SearchSongResultResponse, SearchType } from "@/types/response/search";
import { Entity, Platform } from "@/types/response/base";
import { RecursivePartial, WithKey } from "@/types/base";
import { searchByKeyword } from "@/utils/apis";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { sec2Time, setStoreState } from "@/utils";

export default defineComponent({
  name: "SearchSongTab",
  components: {
    PlatformTag
  },
  setup() {
    const route = useRoute();
    const store = useStore<StoreState>();
    const _setStoreState = (payload: RecursivePartial<StoreState>) =>
      setStoreState(store, payload);

    const searchType: SearchType = "song";
    const songs = ref<(Song & WithKey)[]>([]);
    const loading = computed(() => store.state.loading);
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
        .finally(() => {
          _setStoreState({
            loading: false,
            search: {
              keywordUpdated: false
            }
          });
        });
      _setStoreState({
        loading: true
      });
    };
    watch(
      () => store.state.search.keywordUpdated,
      () => {
        // 当前tab激活的状态下才重新发送请求
        if (
          store.state.search.keywordUpdated &&
          store.state.search.activeKey === "song"
        )
          search({ current: 1 });
      },
      {
        immediate: true
      }
    );
    // 不通过搜索框直接进入搜索界面时(如通过url直接跳转)
    // 从url读取数据进行搜索
    onMounted(() => {
      if (route.query.keyword) {
        _setStoreState({
          search: {
            keywordUpdated: true,
            keyword: route.query.keyword as string
          }
        });
      }
    });

    const customRow = (record: Song, index: number) => {
      return {
        dblclick() {
          _setStoreState({
            playing: {
              url: record.url,
              cover:
                record.platform === "cloudMusic"
                  ? `${record.album.pic}?param=64x64`
                  : "",
              title: record.name,
              artist: record.artists.map(artist => artist.name).join(" / "),
              duration: record.duration
            }
          });
        }
      };
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
          sec2Time(duration)
      }
    ];

    return {
      columns,
      songs,
      loading,
      resultInfo,
      search,
      SEARCH_PAGE_SIZE,
      customRow
    };
  }
});
</script>
