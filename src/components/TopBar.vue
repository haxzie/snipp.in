<template>
  <div @contextmenu.prevent="openContextMenu">
    <div class="topbar">
      <div class="file-tabs">
        <!-- <Container
          @drop="onDrop"
          lock-axis="y"
          orientation="horizontal"
          behaviour="contain"
        > -->
          <!-- <Draggable v-for="file in draggableOpenFiles" :key="file.id"> -->
          <div
            v-for="file in openFiles"
            :key="file.id"
            class="tab"
            :class="[
              {
                active: file.id === (activeFile && activeFile.id) && isActive,
              },
              {
                inActive:
                  file.id === (activeFile && activeFile.id) && !isActive,
              },
            ]"
            @click="setActiveFile({ editor, id: file.id })"
            @click.middle="closeFile({ editor, id: file.id })"
            @click.right="setActiveFile({ editor, id: file.id })"
          >
            <span>{{ file.name }}</span>
            <XIcon
              size="16"
              class="icon"
              @click.stop="closeFile({ editor, id: file.id })"
            />
          </div>
          <!-- </Draggable> -->
        <!-- </Container> -->
      </div>
    </div>
    <SlideYUpTransition>
      <div
        ref="contextMenu"
        v-show="isContextMenuToggled"
        class="context-menu"
        v-click-outside="closeContextMenu"
      >
        <div class="option-item" @click="closeOtherTabs">
          <x-icon size="14" class="icon" /> Close other tabs
        </div>
      </div>
    </SlideYUpTransition>
  </div>
</template>

<script>
import { SlideYUpTransition } from "vue2-transitions";
import { XIcon } from "vue-feather-icons";
import { mapActions, mapGetters } from "vuex";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag, generateItems } from "../utils/dnd-helpers";

export default {
  components: {
    XIcon,
    SlideYUpTransition,
    Container,
    Draggable,
  },
  props: {
    editor: String,
    openFiles: Array,
    activeFile: Object,
    isActive: Boolean,
  },
  data() {
    return {
      isContextMenuToggled: false,
      // draggableOpenFiles: this.openFiles,
    };
  },
  computed: {
    ...mapGetters("Editor", ["getActiveFiles", "getOpenFiles"]),
  },
  methods: {
    ...mapActions("Editor", ["closeFile", "setActiveFile"]),
    closeContextMenu() {
      this.isContextMenuToggled = false;
    },
    openContextMenu(e) {
      this.isContextMenuToggled = !this.isContextMenuToggled;
      this.$refs.contextMenu.style.top = `${e.y - 10}px`;
      this.$refs.contextMenu.style.left = `${e.x - 320}px`;
    },
    closeOtherTabs() {
      this.closeContextMenu();
      const activeFileId = this.getActiveFiles.PRIMARY.id;
      this.getOpenFiles.PRIMARY.map((openFile) => {
        if (openFile.id !== activeFileId) {
          this.closeFile({ editor: this.editor, id: openFile.id });
        }
      });
    },
    // onDrop(dropResult) {
    //   this.draggableOpenFiles = applyDrag(this.draggableOpenFiles, dropResult);
    // },
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

    .tab {
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
        max-width: 120px;
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

      &.inActive {
        border-bottom: 2px solid var(--font-color);
      }
    }
  }
}
.context-menu {
  position: absolute;
  width: 170px;
  height: auto;
  z-index: 99;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background: var(--color-secondary);
  box-shadow: var(--smooth-shadow);
  border: 1px solid var(--border-color);
  padding: 5px;

  .option-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 3px;

    .icon {
      margin-right: 5px;
      width: 20px;
    }

    &:hover {
      cursor: pointer;
      // background: var(--color-secondary-light);
      color: var(--color-primary);
    }
  }
}
</style>
