<template>
  <a-table
    class="song-list"
    :rowKey="rowKey"
    :columns="columns"
    :data-source="data"
    @change="handlePageChange"
    :customRow="customRow"
    :pagination="
      disablePagination
        ? false
        : {
            defaultPageSize: size,
            current,
            total
          }
    "
  >
    <template v-slot:name="{ text, record }">
      <platform-tag :platform="record.platform" />
      <span>{{ text }}</span>
    </template>
    <template v-slot:artists="{ text: artists }">
      <template v-for="(artist, index) of artists" :key="artist.id">
        <a @click="jumpToDetail('artist', artist)">{{ artist.name }}</a>
        <span v-if="index < artists.length - 1"> / </span>
      </template>
    </template>
    <template v-slot:album="{ text: album }">
      <a @click="jumpToDetail('album', album)">{{ album.name }}</a>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";
import { TableColumn, Pagination } from "@/types/antd";
import { Song } from "@/types/response/song";
import { AlbumDetailResponse } from "@/types/response/album";
import { sec2Time, setStoreState } from "@/utils";
import { fetchAlbumDetail } from "@/utils/apis";
import { ALBUM_COVER_PLACEHOLDER, SEARCH_PAGE_SIZE } from "@/utils/constants";
import PlatformTag from "@/components/PlatformTag.vue";
import router from "@/router";
import { Entity } from "@/types/response/base";

export default defineComponent({
  name: "SongList",
  props: {
    rowKey: {
      type: String,
      default: "id"
    },
    disablePagination: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array as PropType<Song[]>,
      default: []
    },
    size: {
      type: Number,
      default: SEARCH_PAGE_SIZE * 2
    },
    current: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    cover: String
  },
  components: {
    PlatformTag
  },
  setup(props, ctx) {
    const columns: TableColumn<Song>[] = [
      {
        width: 20,
        customRender: ({ index }) => (index + 1).toString().padStart(2, "0")
      },
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
        width: 150,
        ellipsis: true,
        slots: { customRender: "artists" }
      },
      {
        title: "专辑",
        dataIndex: "album",
        width: 150,
        ellipsis: true,
        slots: { customRender: "album" }
      },
      {
        title: "时长",
        dataIndex: "duration",
        width: 50,
        customRender: ({ text: duration }: { text: number }) =>
          sec2Time(duration)
      }
    ];

    watch(
      () => props.data,
      () => {
        props.data
          .filter(song => song.platform === "qq")
          .forEach(song => {
            song.url = song.url?.replace(
              "http://isure.stream.qqmusic.qq.com",
              "/qq-stream"
            );
          });
      },
      { immediate: true }
    );

    const coverCache: Record<string, string> = {};
    const customRow = (record: Song) => {
      return {
        onDblclick() {
          // qq音乐没有专辑封面数据，因此需要额外请求
          if (
            !props.cover &&
            record.platform === "qq" &&
            !coverCache[record.album.mid!]
          ) {
            fetchAlbumDetail(record.album.mid!, "qq").then(res => {
              // 将返回的数据保存在log内，避免重复请求
              const cover = (res.data as AlbumDetailResponse).data.info.pic;
              coverCache[record.album.mid!] = cover;
              setStoreState({
                playing: { cover }
              });
            });
          }
          setStoreState({
            playing: {
              url: record.url,
              cover:
                record.platform === "netease"
                  ? `${record.album.pic}?param=64x64`
                  : props.cover ??
                    coverCache[record.album.mid!] ??
                    ALBUM_COVER_PLACEHOLDER,
              title: record.name,
              artist: record.artists.map(artist => artist.name).join(" / "),
              duration: record.duration
            }
          });
        }
      };
    };

    const jumpToDetail = (type: "album" | "artist", entity: Entity) => {
      if (type === "album") {
        router.push({ name: "albumDetail" });
        setStoreState({
          albumDetail: {
            id: entity.mid ?? entity.id,
            platform: entity.mid ? "qq" : "netease"
          }
        });
      } else if (type === "artist") {
        router.push({ name: "artistDetail" });
        setStoreState({
          artistDetail: {
            id: entity.mid ?? entity.id,
            platform: entity.mid ? "qq" : "netease"
          }
        });
      }
    };

    const handlePageChange = (pagination: Pagination) => {
      const { current, pageSize } = pagination;
      ctx.emit("page-change", current, pageSize);
    };

    return {
      columns,
      customRow,
      jumpToDetail,
      handlePageChange
    };
  }
});
</script>
