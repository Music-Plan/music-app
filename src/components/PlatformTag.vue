<template>
  <a-tag v-if="platform === 'netease'" color="red">网易云</a-tag>
  <a-tag v-else color="orange">QQ音乐</a-tag>
</template>

<script lang="ts">
import { Platform } from "@/types/response/base";
import { defineComponent, PropType } from "vue";
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
