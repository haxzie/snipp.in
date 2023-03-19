<template>
  <div
    class="file-explorer"
    :class="{ highlighted: getDraggingId === 'root' }"
    @drop="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent
    @contextmenu.prevent="openContextMenu"
  >
    <header>
      <h4>File Explorer</h4>
      <div class="menu">
        <div
          v-tooltip="'Create new file (Alt+N)'"
          class="icon-wrapper"
        >
          <FilePlusIcon size="18" class="icon" @click="setShowCreateFileModal({ flag: true })" />
        </div>
        <div
          v-tooltip="'Create new folder (Ctrl+Alt+N)'"
          class="icon-wrapper"
          v-shortkey="['ctrl', 'alt', 'n']"
          @shortkey="createNewFolder"
        >
          <FolderPlusIcon size="18" class="icon" @click="createNewFolder" />
        </div>
      </div>
    </header>
    <div class="content-area">
      <DirectoryListing
        v-if="children && children.length > 0"
        :files="children"
        :activeFiles="getActiveFileList"
      />
      <div v-else class="help-text">
        <p>
          No Snippets found, click on the create icons to start creating
          snippets
        </p>
      </div>
    </div>
    <SlideYUpTransition>
      <div
        ref="contextMenu"
        v-show="isContextMenuToggled"
        class="context-menu"
        v-click-outside="closeContextMenu"
      >
        <div class="option-item" @click="createNewFile">
          <file-plus-icon size="18" class="icon" />Create File
        </div>
        <div class="option-item" @click="createNewFolder">
          <folder-plus-icon size="18" class="icon" />Create Folder
        </div>
      </div>
    </SlideYUpTransition>
  </div>
</template>

<script>
import { FilePlusIcon, FolderPlusIcon } from "vue-feather-icons";
import { SlideYUpTransition } from "vue2-transitions";
import { mapGetters, mapActions, mapMutations } from "vuex";
import DirectoryListing from "./DirectoryListing";

export default {
  components: {
    FilePlusIcon,
    FolderPlusIcon,
    DirectoryListing,
    SlideYUpTransition,
  },
  data() {
    return {
      isContextMenuToggled: false,
    };
  },
  computed: {
    ...mapGetters("Files", ["getFiles"]),
    ...mapGetters("Editor", [
      "getActiveFiles",
      "getActiveFileList",
      "getChildren",
      "getDraggingId",
    ]),
    children() {
      if (this.getFiles) {
        return this.getChildren("root");
      }
    },
  },
  methods: {
    ...mapMutations("Editor", { setDraggingId: "SET_DRAGGING_ID" }),
    ...mapActions("Files", ["createFile", "createDirectory", "moveFile"]),
    ...mapActions("UI", ["setShowCreateFileModal"]),
    createNewFile() {
      this.closeContextMenu();
      this.createFile({ editable: true });
    },
    createNewFolder() {
      this.closeContextMenu();
      this.createDirectory({ editable: true });
    },
    handleDrop(event) {
      const fileId = event.dataTransfer.getData("fileId");
      this.moveFile({ id: fileId, directoryId: "root" });
      this.setDraggingId("");
    },
    handleDragOver() {
      if (this.getDraggingId !== "root") {
        this.setDraggingId("root");
      }
    },
    closeContextMenu() {
      this.isContextMenuToggled = false;
    },
    openContextMenu(e) {
      this.isContextMenuToggled = !this.isContextMenuToggled;

      this.$refs.contextMenu.style.top = `${e.y}px`;
      this.$refs.contextMenu.style.left = `${e.x}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-explorer {
  background: var(--color-secondary-light);
  z-index: 9;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  min-height: 0;
  border-right: 1px solid var(--border-color);

  &.highlighted {
    background-color: var(--drag-over-color);
  }

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

  .content-area {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .help-text {
      display: flex;
      padding: 10px;
      opacity: 0.7;
      text-align: center;
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
}
</style>
