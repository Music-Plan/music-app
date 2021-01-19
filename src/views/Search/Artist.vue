<template>
  <div id="search-artist">
    <div class="result-wrapper">
      <div class="row" v-for="(row, index) of artists" :key="`row-${index}`">
        <template v-for="(artist, index) of row">
          <uni-card v-if="artist" :key="artist.key" :data="artist" />
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
import { defineComponent, ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";
import { searchByKeyword } from "@/utils/apis";
import { useRoute } from "vue-router";
import { WithKey } from "@/types/base";
import { Pagination } from "@/types/antd";
import UniCard from "@/components/UniCard.vue";
import { UniCardData } from "@/types/components/uniCard";
import {
  SearchArtistResultResponse,
  SearchType
} from "@/types/response/search";
import { SEARCH_PAGE_SIZE, COVER_SIZE } from "@/utils/constants";
import { setStoreState, expandDims } from "@/utils";
import { Artist } from "@/types/response/artist";

export default defineComponent({
  name: "SearchArtistTab",
  components: {
    UniCard
  },
  setup() {
    const router = useRouter();
    const searchType: SearchType = "artist";
    const resultInfo = ref({
      pageNo: 1,
      total: 0
    });
    const artists = ref<UniCardData[][]>();
    const loading = computed(() => store.state.loading);
    const search = (pagination: Partial<Pagination>) => {
      searchByKeyword(
        store.state.search.keyword,
        pagination.current,
        searchType
      )
        .then(res => {
          const searchResult = (res.data as SearchArtistResultResponse).data;
          const tmp = searchResult.qqMusic.artists
            .map(
              artist =>
                ({
                  key: artist.id,
                  cover: {
                    src: artist.pic,
                    size: COVER_SIZE
                  },
                  platform: "qq",
                  title: {
                    text: artist.name,
                    onClick() {
                      router.push({
                        name: "artistDetail",
                        params: {
                          artistName: artist.name,
                          artistPic: artist.pic
                        }
                      });
                      setStoreState({
                        artistDetail: {
                          id: artist.mid,
                          platform: "qq"
                        }
                      });
                    }
                  },
                  subtitle: `专辑数：${artist.albumSize}   mv数：${artist.mvSize}`
                } as UniCardData)
            )
            .concat(
              searchResult.cloudMusic.artists.map(
                artist =>
                  ({
                    key: artist.id,
                    cover: {
                      src: `${artist.pic}?param=${COVER_SIZE}x${COVER_SIZE}`,
                      size: COVER_SIZE
                    },
                    platform: "netease",
                    title: {
                      text: artist.name,
                      onClick() {
                        router.push({
                          name: "artistDetail",
                          params: {
                            artistName: artist.name,
                            artistPic: artist.pic
                          }
                        });
                        setStoreState({
                          artistDetail: {
                            id: artist.id,
                            platform: "netease"
                          }
                        });
                      }
                    },
                    subtitle: `专辑数：${artist.albumSize} mv数：${artist.mvSize}`
                  } as UniCardData)
              )
            );
          artists.value = expandDims<UniCardData>(tmp, 6);
          resultInfo.value = {
            pageNo: searchResult.pageNo,
            total: searchResult.qqMusic.total + searchResult.cloudMusic.total
          };
        })
        .finally(() => {
          setStoreState({
            loading: false,
            search: {
              keywordUpdated: false
            }
          });
        });
      setStoreState({
        loading: true
      });
    };
    watch(
      () => store.state.search.keywordUpdated,
      () => {
        if (
          store.state.search.keywordUpdated &&
          store.state.search.activeKey === "artist"
        )
          search({ current: 1 });
      }
    );
    onMounted(() => {
      search({ current: 1 });
    });

    return {
      artists,
      loading,
      resultInfo,
      SEARCH_PAGE_SIZE,
      search,
      COVER_SIZE
    };
  }
});
</script>

<style lang="scss">
#search-artist {
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
