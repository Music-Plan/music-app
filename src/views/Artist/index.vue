<template>
  <section>
    <div class="artist-info">
      <div class="artist-pic">
        <img :src="artistPic" style="border-radius: 100%" />
      </div>
      <span>{{ artistName }}</span>
    </div>
    <a-tabs :activeKey="activeKey" @change="setActiveTab">
      <a-tab-pane key="pick up" tab="精选">
        <pick-up-tab @change="setActiveTab" />
      </a-tab-pane>
      <a-tab-pane key="song" tab="歌曲">
        <song-tab />
      </a-tab-pane>
      <a-tab-pane key="album" tab="专辑">
        <album-tab />
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AlbumTab from "./Album.vue";
import SongTab from "./Song.vue";
import PickUpTab from "./PickUp.vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "artistDetail",
  components: {
    PickUpTab,
    SongTab,
    AlbumTab
  },
  setup() {
    const activeKey = ref("pick up");
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
