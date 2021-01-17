<template>
  <div class="uni-card" :style="{ width: coverStyle.width }">
    <div
      class="uni-card-cover-wrapper"
      @mouseenter="toggleFocus(true)"
      @mouseleave="toggleFocus(false)"
    >
      <img
        class="uni-card-cover"
        :src="data.cover.src"
        :style="coverStyle"
        loading="lazy"
      />
      <span class="platform-bar" :class="platformClass">
        {{ platformClass["cloud-music"] ? "网易云音乐" : "QQ音乐" }}
      </span>
      <div class="mask" :class="maskClass" @click="data.title.onClick">
        <play-circle-filled class="play-icon" />
      </div>
    </div>
    <div class="uni-card-content-wrapper">
      <div v-if="data.title">
        <a
          v-if="typeof data.title === 'object'"
          class="title"
          @click="data.title.onClick"
        >
          {{ data.title.text }}
        </a>
        <span v-else class="title">{{ data.title }}</span>
      </div>
      <div v-if="data.subtitle">
        <a
          v-if="typeof data.subtitle === 'object'"
          class="subtitle"
          @click="data.subtitle.onClick"
        >
          {{ data.subtitle.text }}
        </a>
        <span v-else class="subtitle">{{ data.subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue";
import { UniCardData } from "@/types/components/uniCard";
import { PlayCircleFilled } from "@/icons";
export default defineComponent({
  name: "UniversialCard",
  props: {
    data: {
      type: Object as PropType<UniCardData>,
      required: true
    }
  },
  components: {
    PlayCircleFilled
  },
  setup(props) {
    const platformClass = {
      "qq-music": props.data.platform === "qq",
      "cloud-music": props.data.platform === "netease"
    };

    const coverStyle = {
      width: `${props.data.cover.size ?? 150}px`,
      height: `${props.data.cover.size ?? 150}px`
    };

    const maskClass = reactive({
      focused: false
    });
    const toggleFocus = (focused: boolean) => {
      maskClass.focused = focused;
    };

    return {
      platformClass,
      coverStyle,
      toggleFocus,
      maskClass
    };
  }
});
</script>

<style lang="scss">
.uni-card {
  display: inline-block;

  .uni-card-cover-wrapper {
    position: relative;

    img.uni-card-cover {
      display: block;
      object-fit: cover;
      border-radius: 10px;
    }

    .platform-bar {
      display: inline-block;
      position: absolute;
      z-index: 10;
      min-width: 3rem;
      height: 1.5rem;
      line-height: 1.5rem;
      border-radius: 1rem;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      color: white;
      padding: 0 8px;

      &.qq-music {
        background-color: rgb(250, 230, 60);
      }

      &.cloud-music {
        background-color: red;
      }
    }

    .mask {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      transition: background-color 0.5s;
      border-radius: 10px;
      cursor: pointer;

      &.focused {
        background-color: rgba($color: #000000, $alpha: 0.5);

        & > .play-icon {
          opacity: 1;
        }
      }

      & > .play-icon {
        cursor: pointer;
        display: inline-block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 48px;
        transition: all 0.5s;
        opacity: 0;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }

  & > .uni-card-content-wrapper {
    margin-top: 0.5rem;

    .title,
    .subtitle {
      display: inline-block;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .subtitle {
      color: rgb(180, 180, 180);
    }
  }
}
</style>
