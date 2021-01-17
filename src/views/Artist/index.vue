<template>
  <section>
    <div class="artist-info">
      <div class="artist-pic">
        <img :src="artistPic" style="border-radius: 100%" />
      </div>
      <span>{{ artistName }}</span>
    </div>
    <a-tabs :activeKey="activeKey" @change="setActiveTab">
      <a-tab-pane key="info" tab="精选">
        <hot-song-tab @change="setActiveTab" />
      </a-tab-pane>
      <a-tab-pane key="song" tab="歌曲">
        <all-song-tab />
      </a-tab-pane>
      <a-tab-pane key="album" tab="专辑">
        <album-tab />
      </a-tab-pane>
      <a-tab-pane key="detail" tab="详情">
        <detail-tab />
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import HotSongTab from "./HotSong.vue";
import AllSongTab from "./AllSong.vue";
import DetailTab from "./ArtistDetail.vue";
import AlbumTab from "./ArtistAlbum.vue";
export default defineComponent({
  name: "artistDetail",
  components: {
    HotSongTab,
    AllSongTab,
    DetailTab,
    AlbumTab
  },
  setup() {
    const activeKey = ref("info");
    const route = useRoute();
    const setActiveTab = (key: string) => {
      activeKey.value = key;
    };
    const artistPic = route.params.artistPic;
    const artistName = route.params.artistName;
    return {
      activeKey,
      setActiveTab,
      artistPic,
      artistName
    };
  }
});
</script>

<style lang="scss">
.artist-info {
  display: flex;
  align-items: center;
  margin: 16px 0 32px 0;
  span {
    font-size: 32px;
    font-weight: 600;
    color: #333;
  }
  .artist-pic {
    margin: 0px 80px 0px 27px;
    img {
      width: 150px;
      height: 150px;
    }
  }
}
</style>
