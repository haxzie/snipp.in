<template>
  <div
    class="progress-view glow-shadow"
    :style="{
      top: top ? `${top}px` : 0,
    }"
  ></div>
</template>

<script>
export default {
  props: {
    top: Number,
  },
};
</script>

<style lang="scss" scoped>
.progress-view {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  min-height: 2px;
  max-height: 2px;
  height: 2px;
  background: repeating-linear-gradient(
    to right,
    var(--color-secondary) 0%,
    var(--color-accent) 50%,
    var(--color-primary) 100%
  );
  background-size: 200% auto;
  background-position: 0 100%;
  animation: gradient 1.5s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
}

@keyframes gradient {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
