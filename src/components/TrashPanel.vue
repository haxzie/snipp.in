<template>
  <div class="trash-panel">
    <header>
      <h4>Trash</h4>
      <div class="menu">
        <div
          v-tooltip="'Empty Trash'"
          class="icon-wrapper"
        >
          <Trash2Icon size="18" class="icon" @click="emptyTrash" />
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { Trash2Icon } from "vue-feather-icons";

export default {
  components: {
    Trash2Icon
  },
  methods: {
    emptyTrash() {

    }
  }
};
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

  header {
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    align-items: center;
    z-index: 99;

    h4 {
      font-weight: bold;
      flex: 1;
    }

    .menu {
      display: flex;
    }

    .icon-wrapper {
      position: relative;
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
