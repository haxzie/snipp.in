<template>
  <div class="topbar">
    <ul class="file-tabs">
      <li class="active">hello.js <XIcon size="16" class="icon" /></li>
    </ul>
  </div>
</template>

<script>
import { XIcon } from "vue-feather-icons";

export default {
  components: {
    XIcon,
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;

  .file-tabs {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    align-items: center;

    li {
      padding: 7px 5px 7px 15px;
      opacity: 0.7;
      background: var(--color-secondary);
      margin-top: 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 5px 5px 0 0;

      .icon {
        margin-left: 5px;
        padding: 5px;
        border-radius: 3px;

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }

      &.active {
        color: var(--font-color);
        opacity: 1;
        border-bottom: 2px solid var(--color-primary);
      }
    }
  }
}
</style>
