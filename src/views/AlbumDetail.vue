<template>
  <div id="album-detail-view">
    <div class="placeholder" v-if="loading" />
    <template v-else>
      <div class="header">
        <div class="layout">
          <img
            class="album-cover"
            :src="info.pic"
            :style="{ width: `${COVER_SIZE}px`, height: `${COVER_SIZE}px` }"
          />
        </div>
        <div class="layout">
          <p class="album-title">{{ info.name }}</p>
          <p>{{ info.artist.name }}</p>
          <p>{{ info.publishTime }}</p>
          <a-button type="primary" shape="round">
            <caret-right-outlined />
            播放全部
          </a-button>
        </div>
      </div>
      <div class="content">
        <song-list disable-pagination :data="songs" :cover="albumPic" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Album, AlbumDetailResponse } from "@/types/response/album";
import { computed, defineComponent, ref } from "vue";
import { setStoreState } from "@/utils";
import { COVER_SIZE } from "@/utils/constants";
import { CaretRightOutlined } from "@/icons";
import { Song } from "@/types/response/song";
import dayjs from "dayjs";
import { fetchAlbumDetail } from "@/utils/apis";
import { message } from "ant-design-vue";
import store from "@/store";
import { useRouter } from "vue-router";
import SongList from "@/components/SongList.vue";

type AlbumInfo = Omit<Album, "songCount">;
type AlbumSong = Omit<Song, "album">;

export default defineComponent({
  name: "AlbumDetail",
  components: {
    CaretRightOutlined,
    SongList
  },
  setup() {
    const router = useRouter();

    const info = ref<AlbumInfo>();
    const songs = ref<AlbumSong[]>();
    const loading = computed(() => store.state.loading);
    const { id, platform } = store.state.albumDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
      // loading未true时，不会渲染页面
      // 因为此时info和songs都为空，渲染了就会报错
      return {
        loading: true
      };
    }
    const albumPic = ref("");
    fetchAlbumDetail(id!, platform!)
      .then(res => {
        const detail = (res.data as AlbumDetailResponse).data;
        info.value = detail.info;
        albumPic.value = detail.info.pic;
        info.value.publishTime = dayjs(info.value.publishTime).format(
          "YYYY-MM-DD"
        );
        if (platform === "netease") {
          info.value.pic += `?param=${COVER_SIZE}x${COVER_SIZE}`;
        }
        for (const song of detail.songs) {
          song.platform = platform;
        }
        songs.value = detail.songs;
      })
      .finally(() => {
        setStoreState({ loading: false });
      });
    setStoreState({ loading: true });

    return {
      info,
      albumPic,
      songs,
      loading,
      COVER_SIZE
    };
  }
});
</script>

<style lang="scss">
#album-detail-view {
  margin-top: 1rem;

  .placeholder {
    min-height: 200px;
  }

  .header {
    display: flex;

    .layout {
      &:first-child {
        img.album-cover {
          border-radius: 1rem;
        }
      }

      &:last-child {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        margin-left: 2rem;

        .album-title {
          font-size: 40px;
          font-weight: bold;
        }
      }
    }
  }

  .content {
    margin-top: 1rem;
    .ant-table-tbody > tr.ant-table-row > td > span.song-order {
      display: inline-block;
      margin-right: 1rem;
    }
  }
}
</style>
