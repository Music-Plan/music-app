<template>
  <song-list
    id="artist-song"
    :data="songs"
    :current="pageInfo.current"
    :total="pageInfo.total"
    @page-change="getSongs"
  />
</template>

<script lang="ts">
import { HotSongResponse } from "@/types/response/artist";
import { Song } from "@/types/response/song";
import { defineComponent, reactive, ref } from "vue";
import { setStoreState } from "@/utils";
import { SEARCH_PAGE_SIZE } from "@/utils/constants";
import { getHotSongs } from "@/utils/apis";
import { message } from "ant-design-vue";
import store from "@/store";
import { useRouter } from "vue-router";
import SongList from "@/components/SongList.vue";

export default defineComponent({
  name: "ArtistSongTab",
  components: {
    SongList
  },
  setup() {
    const songs = ref<Song[]>([]);
    const router = useRouter();
    const { id, platform } = store.state.artistDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
    }
    const pageInfo = reactive({
      current: 1,
      total: 0
    });

    const getSongs = (current = 1) => {
      pageInfo.current = current;
      getHotSongs(id!, platform!, current)
        .then(res => {
          const songResult = (res.data as HotSongResponse).data;
          songs.value = songResult.hotSongs;
          for (const song of songs.value) {
            song.platform = platform!;
          }
          pageInfo.total = songResult.total;
        })
        .finally(() => {
          setStoreState({
            loading: false
          });
        });
      setStoreState({
        loading: true
      });
    };
    getSongs();

    return {
      songs,
      pageInfo,
      SEARCH_PAGE_SIZE,
      getSongs
    };
  }
});
</script>
