<template>
  <div id="album-detail-view">
    <div class="placeholder" v-if="loading"></div>
    <template v-else>
      <div class="head-wrapper">
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
      <div class="content-wrapper">
        <a-table :columns="columns" :data-source="songs" :pagination="false">
          <template v-slot:name="{ text, index }">
            <span class="song-order">{{
              (index + 1).toString().padStart(2, 0)
            }}</span>
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
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { useStore } from "vuex";
import { Entity, Platform } from "@/types/response/base";
import { StoreState } from "@/types/store";
import { fetchAlbumDetail } from "@/utils/apis";
import { Album, AlbumDetailResponse } from "@/types/response/album";
import { sec2Time, setStoreState } from "@/utils";
import { COVER_SIZE } from "@/utils/constants";
import { CaretRightOutlined } from "@/icons";
import dayjs from "dayjs";
import { Song } from "@/types/response/song";
import { WithKey } from "@/types/base";
import { nanoid } from "nanoid";
import { TableColumn } from "@/types/antd";

type AlbumInfo = Omit<Album, "songCount">;
type AlbumSong = Omit<Song, "album"> & WithKey;

export default defineComponent({
  name: "AlbumDetail",
  props: {
    id: {
      type: String,
      required: true
    }
  },
  components: {
    CaretRightOutlined
  },
  setup(props) {
    const store = useStore<StoreState>();

    const info = ref<AlbumInfo>();
    const songs = ref<AlbumSong[]>();
    const loading = computed(() => store.state.loading);
    const platform = computed(() => store.state.albumDetail.platform!);
    fetchAlbumDetail(props.id, platform.value)
      .then(res => {
        const detail = (res.data as AlbumDetailResponse).data;
        info.value = detail.info;
        info.value.publishTime = dayjs(info.value.publishTime).format(
          "YYYY-MM-DD"
        );
        if (platform.value === "cloudMusic") {
          info.value.pic += `?param=${COVER_SIZE}x${COVER_SIZE}`;
        }
        songs.value = detail.songs.map(
          song =>
            ({
              key: nanoid(8),
              ...song
            } as AlbumSong)
        );
      })
      .finally(() => {
        setStoreState(store, {
          loading: false
        });
      });

    const columns: TableColumn<Song>[] = [
      {
        title: "歌名",
        dataIndex: "name",
        width: 100,
        ellipsis: true,
        slots: { customRender: "name" }
      },
      {
        title: "艺术家",
        dataIndex: "artists",
        width: 50,
        ellipsis: true,
        slots: { customRender: "artists" }
      },
      {
        title: "时长",
        dataIndex: "duration",
        width: 20,
        customRender: ({ text: duration }: { text: number }) =>
          sec2Time(duration)
      }
    ];

    return {
      info,
      columns,
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

  & > .placeholder {
    min-height: 200px;
  }

  .head-wrapper {
    display: flex;

    & > .layout {
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

        & > p.album-title {
          font-size: 40px;
          font-weight: bold;
        }
      }
    }
  }

  .content-wrapper {
    margin-top: 1rem;
    .ant-table-tbody > tr.ant-table-row > td > span.song-order {
      display: inline-block;
      margin-right: 1rem;
    }
  }
}
</style>
