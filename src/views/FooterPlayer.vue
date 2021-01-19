<template>
  <div id="footer-player" v-if="info.url">
    <a-slider
      :tip-formatter="null"
      v-model:value="current"
      :max="info.duration"
      @change="dragSlider"
      @afterChange="dragDone"
    />
    <div class="wrapper">
      <div class="layout">
        <img class="cover" :src="info.cover" />
        <div class="album-info">
          <p>{{ info.title }}</p>
          <p>{{ info.artist }}</p>
        </div>
      </div>
      <div class="layout">
        <step-backward-filled />
        <pause-circle-filled v-if="playing" @click="togglePlay" />
        <play-circle-filled v-else @click="togglePlay" />
        <step-forward-filled />
      </div>
      <div class="layout">
        <span>{{ `${currentText} / ${durationText}` }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  PauseCircleFilled,
  PlayCircleFilled,
  StepBackwardFilled,
  StepForwardFilled
} from "@/icons";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { sec2Time } from "@/utils";
import store from "@/store";

export default defineComponent({
  name: "FooterPlayer",
  components: {
    PlayCircleFilled,
    StepBackwardFilled,
    StepForwardFilled,
    PauseCircleFilled
  },
  setup() {
    const info = computed(() => store.state.playing);
    const current = ref(0);
    const currentText = computed(() => sec2Time(current.value));
    const durationText = computed(() => sec2Time(info.value.duration));
    const audioContext = new AudioContext();
    let audio: HTMLAudioElement;
    let track: MediaElementAudioSourceNode;
    const playing = ref(false);
    const dragging = ref(false);
    let timerId: number;
    const genTimer = () =>
      setInterval(() => {
        if (!dragging.value) current.value = Math.floor(audio.currentTime);
      }, 1000);
    onMounted(() => {
      audio = document.createElement("audio");
      audio.autoplay = true;
      audio.controls = false;
      audio.crossOrigin = "anonymous";
      track = audioContext.createMediaElementSource(audio);
      track.connect(audioContext.destination);
    });
    watch(
      () => info.value.url,
      () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
        current.value = 0;
        audio.src = info.value.url;
        playing.value = true;
        timerId = genTimer();
      }
    );
    const togglePlay = () => {
      if (playing.value) {
        audio.pause();
        playing.value = false;
        clearInterval(timerId);
      } else {
        audio.play();
        playing.value = true;
        timerId = genTimer();
      }
    };
    const dragSlider = () => {
      if (!dragging.value) dragging.value = true;
    };
    const dragDone = (value: number) => {
      current.value = value;
      audio.currentTime = value;
      dragging.value = false;
    };

    return {
      info,
      current,
      currentText,
      durationText,
      togglePlay,
      playing,
      dragSlider,
      dragDone
    };
  }
});
</script>

<style lang="scss">
#footer-player {
  .wrapper {
    margin: 0.5rem 1rem;
  }

  .layout {
    display: inline-block;
    vertical-align: middle;
    width: 33.333%;

    &:first-child {
      & > * {
        display: inline-block;
        vertical-align: middle;
      }

      .cover {
        border-radius: 8px;
        width: 48px;
        height: 48px;
      }

      .album-info {
        margin-left: 8px;
      }
    }

    &:nth-child(2) {
      text-align: center;

      & > * {
        font-size: 32px;

        &:nth-child(2) {
          color: #1890ff;
          cursor: pointer;
        }
      }
    }

    &:last-child {
      text-align: right;
    }
  }
}
</style>
