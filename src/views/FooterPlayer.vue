<template>
  <div id="footer-player" v-if="info.url">
    <a-slider
      :tip-formatter="sec2Time"
      v-model:value="current"
      :max="info.duration"
    />
    <div class="wrapper">
      <div class="layout">
        <img class="cover" :src="info.cover" />
        <span class="title">{{ info.title }}</span>
      </div>
      <div class="layout">
        <step-backward-filled />
        <play-circle-filled />
        <step-forward-filled />
      </div>
      <div class="layout">
        <span>{{ `${currentText} / ${durationText}` }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { StoreState } from "@/types/store";
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  PlayCircleFilled,
  StepBackwardFilled,
  StepForwardFilled
} from "@/icons";
import { sec2Time } from "@/utils";

export default defineComponent({
  name: "FooterPlayer",
  components: {
    PlayCircleFilled,
    StepBackwardFilled,
    StepForwardFilled
  },
  setup() {
    const store = useStore<StoreState>();

    const info = computed(() => store.state.playing);
    const current = ref(0);
    const currentText = computed(() => sec2Time(current.value));
    const durationText = computed(() => sec2Time(info.value.duration));
    watch(
      () => info.value.url,
      () => {
        current.value = 0;
      }
    );

    return {
      info,
      current,
      currentText,
      durationText,
      sec2Time
    };
  }
});
</script>

<style lang="scss">
#footer-player {
  & > .wrapper {
    margin: 0.5rem 1rem;

    & > .layout {
      display: inline-block;
      vertical-align: middle;
      width: 33.333%;

      &:first-child {
        & > * {
          display: inline-block;
          vertical-align: middle;
        }

        & > img.cover {
          border-radius: 8px;
          width: 48px;
          height: 48px;
        }

        & > .title {
          margin-left: 8px;
        }
      }

      &:nth-child(2) {
        text-align: center;

        & > * {
          font-size: 32px;

          &:nth-child(2) {
            color: #1890ff;
          }
        }
      }

      &:last-child {
        text-align: right;
      }
    }
  }
}
</style>
