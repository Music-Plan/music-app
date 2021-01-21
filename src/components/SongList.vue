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
    <template v-if="showPlatform" v-slot:name="{ text, record }">
      <platform-tag :platform="record.platform" />
      <span>{{ text }}</span>
    </template>
    <template v-slot:artists="{ text: artists }">
      <template v-for="(artist, index) of artists" :key="artist.id">
        <a>{{ artist.name }}</a>
        <span v-if="index < artists.length - 1"> / </span>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";
import { TableColumn, Pagination } from "@/types/antd";
import { Entity } from "@/types/response/base";
import { Song } from "@/types/response/song";
import { AlbumDetailResponse } from "@/types/response/album";
import { sec2Time, setStoreState } from "@/utils";
import { fetchAlbumDetail } from "@/utils/apis";
import { ALBUM_COVER_PLACEHOLDER, SEARCH_PAGE_SIZE } from "@/utils/constants";
import PlatformTag from "@/components/PlatformTag.vue";

export default defineComponent({
  name: "SongList",
  props: {
    rowKey: {
      type: String,
      default: "id"
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showPlatform: {
      type: Boolean,
      default: false
    },
    showAlbum: {
      type: Boolean,
      default: false
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
    albumInfo: {
      type: Object as PropType<{
        mid: string;
        pic: string;
      }>
    }
  },
  components: {
    PlatformTag
  },
  setup(props, ctx) {
    const columns: TableColumn<Song>[] = [];
    if (props.showIndex) {
      columns.push({
        width: 20,
        customRender: ({ index }) => (index + 1).toString().padStart(2, "0")
      });
    }
    if (props.showPlatform) {
      columns.push({
        title: "歌名",
        dataIndex: "name",
        width: 200,
        ellipsis: true,
        slots: { customRender: "name" }
      });
    } else {
      columns.push({
        title: "歌名",
        dataIndex: "name",
        width: 200,
        ellipsis: true
      });
    }
    columns.push({
      title: "艺术家",
      dataIndex: "artists",
      width: 150,
      ellipsis: true,
      slots: { customRender: "artists" }
    });
    if (props.showAlbum) {
      columns.push({
        title: "专辑",
        dataIndex: "album",
        width: 150,
        ellipsis: true,
        customRender: ({ text: curData }: { text: Entity }) => curData.name
      });
    }
    columns.push({
      title: "时长",
      dataIndex: "duration",
      width: 50,
      customRender: ({ text: duration }: { text: number }) => sec2Time(duration)
    });

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
        dblclick() {
          const mid = props.albumInfo ? props.albumInfo.mid : record.album.mid!;
          // qq音乐没有专辑封面数据，因此需要额外请求
          if (
            !props.albumInfo &&
            record.platform === "qq" &&
            !coverCache[mid]
          ) {
            fetchAlbumDetail(mid, "qq").then(res => {
              // 将返回的数据保存在log内，避免重复请求
              const cover = (res.data as AlbumDetailResponse).data.info.pic;
              coverCache[mid] = cover;
              setStoreState({
                playing: { cover }
              });
            });
          }
          setStoreState({
            playing: {
              url: record.url,
              cover: props.albumInfo
                ? props.albumInfo.pic
                : record.platform === "netease"
                ? `${record.album.pic}?param=64x64`
                : coverCache[mid] ?? ALBUM_COVER_PLACEHOLDER,
              title: record.name,
              artist: record.artists.map(artist => artist.name).join(" / "),
              duration: record.duration
            }
          });
        }
      };
    };

    const handlePageChange = (pagination: Pagination) => {
      const { current, pageSize } = pagination;
      ctx.emit("page-change", current, pageSize);
    };

    return {
      columns,
      customRow,
      handlePageChange
    };
  }
});
</script>
