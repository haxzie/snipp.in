<template>
  <div class="trash-panel"></div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.trash-panel {
  background: var(--color-secondary-light);
  z-index: 9;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--border-color);
}
</style>