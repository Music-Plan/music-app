<template>
  <section>
    <span> {{ artistDetail }}</span>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import store from "@/store";
import { setStoreState } from "@/utils";
import { getArtistDetail } from "@/utils/apis";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { Entity, Platform } from "@/types/response/base";
import { ArtistDetailResponse } from "@/types/response/artist";
export default defineComponent({
  name: "ArtistDetailTab",
  setup() {
    const loading = computed(() => store.state.loading);
    const router = useRouter();
    const artistDetail = ref("");
    const { id, platform } = store.state.artistDetail;
    if (!id || !platform) {
      message.info("没有数据，回到首页");
      router.push("/main");
    }
    getArtistDetail(id!, platform!).then(res => {
      const result = (res.data as ArtistDetailResponse).data;
      artistDetail.value = result.desc;
    });

    return {
      artistDetail
    };
  }
});
</script>

<style></style>
