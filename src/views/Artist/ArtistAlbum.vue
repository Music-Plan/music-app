<template>
  <div class="hot-album">
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
        :defaultPageSize="SEARCH_PAGE_SIZE"
        :total="resultInfo.total"
        :current="resultInfo.pageNo"
        :disabled="loading"
        @change="page => getArtistAlbums(id, platform, page, 10)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { Pagination } from "@/types/antd";
import { getArtistAlbums } from "@/utils/apis";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { setStoreState, expandDims } from "@/utils";
import { useRouter } from "vue-router";
import { StoreState } from "@/types/store";
import dayjs from "dayjs";
import { RecursivePartial } from "@/types/base";
import UniCard from "@/components/UniCard.vue";
import { UniCardData } from "@/types/components/uniCard";
import { Entity, Platform } from "@/types/response/base";
import { COVER_SIZE, SEARCH_PAGE_SIZE } from "@/utils/constants";
import { ArtistAlbumResponse, ArtistAlbum } from "@/types/response/artist";
export default defineComponent({
  name: "ArtistAlbumTab",
  components: {
    UniCard
  },
  setup() {
    const store = useStore<StoreState>();
    const albums = ref<UniCardData[][]>();
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
    getArtistAlbums(id!, platform!, 1, 50)
      .then(res => {
        const data = (res.data as ArtistAlbumResponse).data;
        const tmp = data.albums.map(
          album =>
            ({
              key: album.id,
              cover: {
                src: album.pic,
                size: COVER_SIZE
              },
              platform: platform,
              title: {
                text: album.name,
                onClick() {
                  router.push({
                    name: "albumDetail"
                  });
                  _setStoreState({
                    albumDetail: {
                      id: album.mid,
                      platform: platform
                    }
                  });
                }
              },
              subtitle: dayjs(album.publishTime).format("YYYY-MM-DD")
            } as UniCardData)
        );
        albums.value = expandDims<UniCardData>(tmp, 6);
        resultInfo.value = {
          total: data.total,
          pageNo: 1
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

    return {
      albums,
      SEARCH_PAGE_SIZE,
      COVER_SIZE,
      id,
      platform,
      resultInfo,
      loading
    };
  }
});
</script>

<style lang="scss">
.hot-album {
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
