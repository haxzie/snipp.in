<template>
  <div class="search-panel">
      <header>
          <h4>Search Files</h4>
      </header>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.search-panel {
  background: var(--color-secondary-light);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--border-color);

  header {
    display: flex;
    flex-direction: row;
    padding: 10px;
    align-items: center;
    z-index: 99;

    h4 {
      font-weight: bold;
      flex: 1;
    }
  }
}
</style>
