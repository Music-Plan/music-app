<template>
  <section>
    <span> {{ artistDetail }}</span>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ArtistDetailResponse } from "@/types/response/artist";
import { getArtistDetail } from "@/utils/apis";
import { message } from "ant-design-vue";
import store from "@/store";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "ArtistDetailTab",
  setup() {
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
