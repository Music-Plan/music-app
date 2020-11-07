<template>
  <div id="search-album">
    <a-table
      :columns="columns"
      :data-source="albums"
      :pagination="{
        defaultPageSize: SEARCH_PAGE_SIZE * 2,
        total: resultInfo.total,
        current: resultInfo.pageNo
      }"
      :loading="loading"
      :show-total="(total, range) => `${total}条结果`"
      @change="search"
      :show-header="false"
    >
      <template v-slot:name="{ text, record }">
        <template v-if="record.platform === 'cloudMusic'">
          <a-tag color="red">网易云</a-tag>
        </template>
        <template v-else>
          <a-tag color="orange">QQ音乐</a-tag>
        </template>
        <span>{{ text }}</span>
      </template>
      <template v-slot:pic="{ text: pic }">
        <img class="album-cover" :src="pic" />
      </template>
      <template v-slot:time="{ text }">
        <span class="publish-time">{{ text }}</span>
      </template>
      <template v-slot:count="{ text }">
        <span class="song-count">{{ text }}首</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { StoreState } from "@/types/store";
import { SearchAlbumResultResponse, SearchType } from "@/types/response/search";
import { Album } from "@/types/response/album";
import { WithKey } from "@/types/base";
import { searchByKeyword } from "@/utils/apis";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { TableColumn, Pagination } from "@/types/antd";
import { Entity } from "@/types/response/base";
export default defineComponent({
  name: "SearchAlbumTab",
  setup() {
    const store = useStore<StoreState>();

    const searchType: SearchType = "album";
    const albums = ref<(Album & WithKey)[]>([]);
    const loading = ref(false);
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
          loading.value = false;
          store.commit("setState", {
            search: {
              keywordUpdated: false
            }
          } as StoreState);
          const searchResult = (res.data as SearchAlbumResultResponse).data;
          albums.value = searchResult.qqMusic.albums
            .map(album => {
              album.platform = "qqMusic";
              album.publishTime = dayjs(album.publishTime).format("YYYY-MM-DD");
              return album;
            })
            .concat(
              searchResult.cloudMusic.albums.map(album => {
                album.platform = "cloudMusic";
                album.publishTime = dayjs(album.publishTime).format(
                  "YYYY-MM-DD"
                );
                return album;
              })
            );
          albums.value.forEach(album => {
            album.key = nanoid(8);
          });
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

    const columns: TableColumn<Album>[] = [
      {
        dataIndex: "pic",
        width: 40,
        slots: { customRender: "pic" }
      },
      {
        dataIndex: "name",
        width: 200,
        ellipsis: true,
        slots: { customRender: "name" }
      },
      {
        dataIndex: "artist",
        width: 100,
        ellipsis: true,
        customRender: ({ text: artist }: { text: Entity }) => artist.name
      },
      {
        dataIndex: "publishTime",
        width: 30,
        slots: { customRender: "time" }
      },
      {
        dataIndex: "songCount",
        width: 20,
        slots: { customRender: "count" }
      }
    ];
    return {
      columns,
      albums,
      loading,
      resultInfo,
      search,
      SEARCH_PAGE_SIZE
    };
  }
});
</script>

<style lang="scss">
#search-album {
  img.album-cover {
    width: 128px;
    height: 128px;
    object-fit: cover;
    border-radius: 10px;
  }

  .publish-time,
  .song-count {
    color: rgb(150, 150, 150);
  }
}
</style>
