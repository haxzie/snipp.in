<template>
  <svg
    clip-rule="evenodd"
    fill-rule="evenodd"
    stroke-linejoin="round"
    stroke-miterlimit="1.414"
    :width="size"
    :height="size"
    version="1.1"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h16c1.097 0 2-.903 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"
      fill="#bb8f00"
      fill-rule="nonzero"
      class="folder-icon"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: 24,
    },
  },
};
</script>

<style lang="scss" scoped>
.folder-icon {
    fill: #80868a;
}
</style>
