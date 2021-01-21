<template>
  <div id="search-song">
    <song-list
      show-platform
      show-album
      :data="songs"
      :current="pageInfo.current"
      :total="pageInfo.total"
      @page-change="search"
    />
  </div>
</template>

<script lang="ts">
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { SearchSongResultResponse, SearchType } from "@/types/response/search";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { searchByKeyword } from "@/utils/apis";
import { setStoreState } from "@/utils";
import { Song } from "@/types/response/song";
import store from "@/store";
import { useRoute } from "vue-router";
import SongList from "@/components/SongList.vue";

export default defineComponent({
  name: "SearchSongTab",
  components: {
    SongList
  },
  setup() {
    const route = useRoute();

    const searchType: SearchType = "song";
    const songs = ref<Song[]>([]);
    const loading = computed(() => store.state.loading);
    const pageInfo = reactive({
      current: 1,
      total: 0
    });
    const search = (current = 1) => {
      pageInfo.current = current;
      searchByKeyword(store.state.search.keyword, current, searchType)
        .then(res => {
          const searchResult = (res.data as SearchSongResultResponse).data;
          songs.value = searchResult.qqMusic.songs
            .map(song => {
              song.platform = "qq";
              return song;
            })
            .concat(
              searchResult.cloudMusic.songs.map(song => {
                song.platform = "netease";
                return song;
              })
            );
          pageInfo.total =
            searchResult.cloudMusic.total + searchResult.qqMusic.total;
        })
        .finally(() => {
          setStoreState({
            loading: false,
            search: {
              keywordUpdated: false
            }
          });
        });
      setStoreState({ loading: true });
    };
    watch(
      () => store.state.search.keywordUpdated,
      () => {
        // 当前tab激活的状态下才重新发送请求
        if (
          store.state.search.keywordUpdated &&
          store.state.search.activeKey === "song"
        ) {
          search();
        }
      },
      {
        immediate: true
      }
    );
    // 不通过搜索框直接进入搜索界面时(如通过url直接跳转)
    // 从url读取数据进行搜索
    onMounted(() => {
      if (route.query.keyword) {
        setStoreState({
          search: {
            keywordUpdated: true,
            keyword: route.query.keyword as string
          }
        });
      }
    });

    return {
      songs,
      loading,
      search,
      pageInfo,
      SEARCH_PAGE_SIZE
    };
  }
});
</script>
