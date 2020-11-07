<template>
  <a-tabs>
    <a-tab-pane key="song" tab="歌曲">
      <song-tab></song-tab>
    </a-tab-pane>
    <a-tab-pane key="album" tab="专辑">
      <album-tab></album-tab>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SongTab from "./Song.vue";
import AlbumTab from "./Album.vue";
export default defineComponent({
  name: "SearchResult",
  components: {
    SongTab,
    AlbumTab
  }
});
</script>
