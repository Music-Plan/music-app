<template>
  <div id="search-album">
    <div class="result-wrapper">
      <div class="row" v-for="(row, index) of albums" :key="`row-${index}`">
        <template v-for="(album, index) of row">
          <uni-card v-if="album" :key="album.key" :data="album" />
          <div
            v-else
            class="fill-blank"
            :key="`blank-${index}`"
            :style="{ width: `${COVER_SIZE}px` }"
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
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import UniCard from "@/components/UniCard.vue";
import { StoreState } from "@/types/store";
import { SearchAlbumResultResponse, SearchType } from "@/types/response/search";
import { UniCardData } from "@/types/components/uniCard";
import { TableColumn, Pagination } from "@/types/antd";
import { Entity, Platform } from "@/types/response/base";
import { RecursivePartial } from "@/types/base";
import { searchByKeyword } from "@/utils/apis";
import { SEARCH_PAGE_SIZE, COVER_SIZE } from "@/utils/constants";
import { expandDims, setStoreState } from "@/utils";

export default defineComponent({
  name: "SearchAlbumTab",
  components: {
    UniCard
  },
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();

    const _setStoreState = (payload: RecursivePartial<StoreState>) =>
      setStoreState(store, payload);

    const searchType: SearchType = "album";
    const albums = ref<UniCardData[][]>();
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
          const searchResult = (res.data as SearchAlbumResultResponse).data;
          const tmp = searchResult.qqMusic.albums
            .map(
              album =>
                ({
                  key: nanoid(8),
                  cover: {
                    src: album.pic,
                    size: COVER_SIZE
                  },
                  platform: "qqMusic",
                  title: {
                    text: album.name,
                    onClick() {
                      router.push({
                        name: "albumDetail"
                      });
                      _setStoreState({
                        albumDetail: {
                          id: album.mid,
                          platform: "qqMusic"
                        }
                      });
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
                      src: `${album.pic}?param=${COVER_SIZE}x${COVER_SIZE}`,
                      size: COVER_SIZE
                    },
                    platform: "cloudMusic",
                    title: {
                      text: album.name,
                      onClick() {
                        router.push({
                          name: "albumDetail"
                        });
                        _setStoreState({
                          albumDetail: {
                            id: album.id,
                            platform: "cloudMusic"
                          }
                        });
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
        if (
          store.state.search.keywordUpdated &&
          store.state.search.activeKey === "album"
        )
          search({ current: 1 });
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
      COVER_SIZE
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
