<template>
  <div class="file-explorer">
    <header>
      <h4>Hacker Space</h4>
      <div class="menu">
        <FilePlusIcon size="18" class="icon" />
      </div>
    </header>
  </div>
</template>

<script>
import { FilePlusIcon } from "vue-feather-icons";

export default {
  components: {
    FilePlusIcon,
  },
};
</script>

<style lang="scss" scoped>
.file-explorer {
  background: var(--color-secondary-light);

  header {
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    align-items: center;

    h4 {
      font-weight: bold;
      flex: 1;
    }

    .icon {
      padding: 7px;
      border-radius: 3px;
      transition: 0.3s all ease-in-out;

      &:hover {
        cursor: pointer;
        background: var(--color-secondary);
        color: var(--color-primary);
      }

      &:active {
        opacity: 0.7;
        transform: scale(0.98);
      }
    }
  }
}
</style>
