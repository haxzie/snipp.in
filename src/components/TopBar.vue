<template>
  <simplebar class="topbar">
    <ul class="file-tabs" 
      v-shortkey="['alt', 'w']" 
      @shortkey="closeFile({ editor, id: activeFile.id })"
    >
        <li
          v-for="file in openFiles"
          :key="file.id"
          :class="[{ active: file.id === (activeFile? activeFile.id: null) }]"
          @click="setActiveFile({ editor, id: file.id })"
        >
          <span>{{ file.name }}</span>
          <XIcon
            size="16"
            class="icon"
            @click.stop="closeFile({ editor, id: file.id })"
          />
        </li>
    </ul>
  </simplebar>
</template>

<script>
import { XIcon } from "vue-feather-icons";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    XIcon,
  },
  props: {
    editor: String,
    openFiles: Array,
    activeFile: Object,
  },
  methods: {
    ...mapActions("Editor", ["closeFile", "setActiveFile"]),
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: auto;

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
      border-bottom: 2px solid var(--color-secondary);
      margin-right: 1px;
      max-width: 150px;

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      }

      &:last-child {
        margin-right: 0;
      }

      .icon {
        margin-left: 5px;
        padding: 5px;
        border-radius: 3px;

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }

      &:hover {
        opacity: 1;
        cursor: pointer;
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
