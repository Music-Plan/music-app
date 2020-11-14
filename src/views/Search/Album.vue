<template>
  <a-spin :spinning="loading">
    <div id="search-album">
      <div class="result-wrapper">
        <div class="row" v-for="(row, index) of albums" :key="`row-${index}`">
          <template v-for="(album, index) of row">
            <uni-card v-if="album" :key="album.key" :data="album" />
            <div
              v-else
              class="fill-blank"
              :key="`blank-${index}`"
              :style="{ width: `${CARD_SIZE}px` }"
            />
          </template>
        </div>
      </div>
      <div class="foot-wrapper">
        <a-pagination
          :defaultPageSize="SEARCH_PAGE_SIZE * 2"
          :total="resultInfo.total"
          :current="resultInfo.pageNo"
          :disabled="loading"
          @change="page => search({ current: page })"
        />
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import UniCard from "@/components/UniCard.vue";
import { StoreState } from "@/types/store";
import { SearchAlbumResultResponse, SearchType } from "@/types/response/search";
import { UniCardData } from "@/types/components/uniCard";
import { TableColumn, Pagination } from "@/types/antd";
import { Entity, Platform } from "@/types/response/base";
import { searchByKeyword } from "@/utils/apis";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { expandDims } from "@/utils";
export default defineComponent({
  name: "SearchAlbumTab",
  components: {
    UniCard
  },
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();

    const searchType: SearchType = "album";
    const albums = ref<UniCardData[][]>();
    const loading = ref(false);
    const resultInfo = ref({
      pageNo: 1,
      total: 0
    });
    const CARD_SIZE = 250;
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
          const searchResult = (res.data as SearchAlbumResultResponse).data;
          const tmp = searchResult.qqMusic.albums
            .map(
              album =>
                ({
                  key: nanoid(8),
                  cover: {
                    src: album.pic,
                    size: CARD_SIZE
                  },
                  platform: "qqMusic" as Platform,
                  title: {
                    text: album.name,
                    onClick() {
                      router.push(`/album/${album.mid}`);
                    }
                  },
                  subtitle: album.artist.name
                } as UniCardData)
            )
            .concat(
              searchResult.cloudMusic.albums.map(
                album =>
                  ({
                    key: nanoid(8),
                    cover: {
                      src: `${album.pic}?param=${CARD_SIZE}x${CARD_SIZE}`,
                      size: CARD_SIZE
                    },
                    platform: "cloudMusic" as Platform,
                    title: {
                      text: album.name,
                      onClick() {
                        router.push(`/album/${album.id}`);
                      }
                    },
                    subtitle: album.artist.name
                  } as UniCardData)
              )
            );
          albums.value = expandDims<UniCardData>(tmp, 6);
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
      }
    );
    onMounted(() => {
      search({ current: 1 });
    });

    return {
      albums,
      loading,
      resultInfo,
      search,
      SEARCH_PAGE_SIZE,
      CARD_SIZE
    };
  }
});
</script>

<style lang="scss">
#search-album {
  margin: 1rem 0;

  & > .result-wrapper > .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  & > .foot-wrapper {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
