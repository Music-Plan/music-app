<template>
  <section>
    <div class="hot-song">
      <div class="hot-title">
        <span>热门歌曲</span>
        <span class="more" @click="jumpTo('song')"
          >更多<RightOutlined :style="{ fontSize: '12px', color: '#999' }"
        /></span>
      </div>
      <a-table
        :columns="columns"
        :data-source="hotSongs"
        :pagination="false"
        :show-total="(total, range) => `${total}条结果`"
      >
        <template v-slot:artists="{ text: artists }">
          <template v-for="(artist, index) of artists" :key="artist.id">
            <a>{{ artist.name }}</a>
            <span v-if="index < artists.length - 1"> / </span>
          </template>
        </template>
      </a-table>
    </div>
    <div class="hot-album">
      <div class="hot-title">
        <span>热门专辑</span>
        <span class="more" @click="jumpTo('album')"
          >更多<RightOutlined :style="{ fontSize: '12px', color: '#999' }"
        /></span>
      </div>
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
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import {
  HotSongResponse,
  ArtistAlbumResponse,
  HotSong
} from "@/types/response/artist";
import { TableColumn, Pagination } from "@/types/antd";

import { getArtistAlbums, getHotSongs } from "@/utils/apis";
import { StoreState } from "@/types/store";
import { sec2Time, setStoreState, expandDims } from "@/utils";
import { Entity, Platform } from "@/types/response/base";
import { RecursivePartial, WithKey } from "@/types/base";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { RightOutlined } from "@/icons";
import { COVER_SIZE } from "@/utils/constants";
import { useRoute } from "vue-router";
import UniCard from "@/components/UniCard.vue";
import { UniCardData } from "@/types/components/uniCard";
export default defineComponent({
  name: "HotSongTab",
  components: {
    RightOutlined,
    UniCard
  },
  setup(props, { emit }) {
    const store = useStore<StoreState>();
    const router = useRouter();
    const albums = ref<UniCardData[][]>();
    const hotSongs = ref<(HotSong & WithKey)[]>([]);
    const loading = computed(() => store.state.loading);
    const _setStoreState = (payload: RecursivePartial<StoreState>) =>
      setStoreState(store, payload);
    const { id, platform } = store.state.artistDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
    }

    getArtistAlbums(id!, platform!, 1, 6)
      .then(res => {
        const data = (res.data as ArtistAlbumResponse).data;
        console.log(data);
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

    const jumpTo = (path: string) => {
      emit("change", path);
    };

    getHotSongs(id!, platform!)
      .then(res => {
        const songResult = (res.data as HotSongResponse).data;
        hotSongs.value = songResult.hotSongs;
        for (const hotsong of hotSongs.value) {
          hotsong.key = hotsong.id;
        }
      })
      .finally(() => {
        _setStoreState({
          loading: false
        });
      });
    _setStoreState({
      loading: true
    });
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
    return {
      columns,
      hotSongs,
      platform,
      jumpTo,
      albums,
      COVER_SIZE
    };
  }
});
</script>

<style lang="scss">
.hot-song,
.hot-album {
  .hot-title {
    font-size: 1.5rem;
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0 1rem;
    line-height: 1.5rem;
    .more {
      font-size: 1rem;
      color: #999;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
.hot-album {
  margin: 1rem 0;
  .result-wrapper {
    margin: 1rem 0;
  }
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
