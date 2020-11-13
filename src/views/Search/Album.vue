<template>
  <div id="search-album">
    <uni-card
      v-for="album of albums"
      :key="album.key"
      :data="album"
      hoverable
    ></uni-card>
  </div>
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
import { WithKey } from "@/types/base";
import { searchByKeyword } from "@/utils/apis";
import { TableColumn, Pagination } from "@/types/antd";
import { Entity, Platform } from "@/types/response/base";
export default defineComponent({
  name: "SearchAlbumTab",
  components: {
    UniCard
  },
  setup() {
    const router = useRouter();
    const store = useStore<StoreState>();

    const searchType: SearchType = "album";
    const albums = ref<(UniCardData & WithKey)[]>([]);
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
          albums.value = searchResult.qqMusic.albums
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
                } as UniCardData & WithKey)
            )
            .concat(
              searchResult.cloudMusic.albums.map(
                album =>
                  ({
                    key: nanoid(8),
                    cover: {
                      src: `${album.pic}?params=${CARD_SIZE}x${CARD_SIZE}`,
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
                  } as UniCardData & WithKey)
              )
            );
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
      search
    };
  }
});
</script>

<style lang="scss">
#search-album {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .uni-card {
    margin: 2rem;
  }
}
</style>
