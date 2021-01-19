<template>
  <a-tag v-if="platform === 'netease'" color="red">网易云</a-tag>
  <a-tag v-else color="orange">QQ音乐</a-tag>
</template>

<script lang="ts">
import { PropType, defineComponent } from "vue";
import { Platform } from "@/types/response/base";
export default defineComponent({
  name: "PlatformCard",
  props: {
    platform: {
      type: String as PropType<Platform>,
      required: true
    }
  }
});
</script>
