<template>
  <div
    class="directory-wrapper"
    :class="{ highlighted: getDraggingId === file.id }"
    @drop.stop="handleDrop"
    @dragover.prevent.stop="handleDragOver"
    @dragenter.prevent
    @contextmenu.prevent.stop="toggleContextMenu"
  >
    <div :class="['file-item', { active: isActive || showContextMenu }]">
      <div
        class="clickable-area"
        @click="toggleShowChildren"
        @dblclick="readonly = !readonly"
        draggable
        @dragstart="handleDrag"
      >
        <FolderOpenIcon v-if="showChildren" class="icon" size="20" />
        <FolderIcon v-else class="icon" size="20" />
        <form @submit.prevent="$refs.input.blur()">
          <input
            :ref="'input'"
            type="text"
            v-model="filename"
            :readonly="readonly"
            size="2"
            @blur="changeFileName"
          />
        </form>
      </div>
      <div class="context-menu">
        <MoreVerticalIcon
          class="trigger-icon no-margin"
          :style="showContextMenu ? 'visibility: visible' : null"
          size="18"
          @click="toggleContextMenu"
        />
        <SlideYUpTransition>
          <div
            v-if="showContextMenu"
            class="options"
            v-click-outside="toggleContextMenu"
          >
            <div class="option-item" @click="createNewFile">
              <file-plus-icon size="18" class="icon" />Create File
            </div>
            <div class="option-item" @click="createNewFolder">
              <folder-plus-icon size="18" class="icon" />Create Folder
            </div>
            <div class="option-item" @click="openRenameMode">
              <edit3-icon size="18" class="icon" />Rename
            </div>
            <div class="option-item" @click="saveFolderAs">
              <download-icon size="18" class="icon" />Download
            </div>
            <div class="option-item" @click="deleteCurrentFolder">
              <trash2-icon size="18" class="icon" />Delete Folder
            </div>
          </div>
        </SlideYUpTransition>
      </div>
    </div>
    <!-- <SlideYUpTransition> -->
    <div v-if="showChildren" class="files">
      <component
        v-for="child in getChildren(file.id)"
        :key="child.id"
        :is="child.type"
        :file="child"
        :isActive="!!getActiveFileList[child.id]"
      />
    </div>
    <!-- </SlideYUpTransition> -->
  </div>
</template>

<script>
import {
  FolderPlusIcon,
  FilePlusIcon,
  MoreVerticalIcon,
  Trash2Icon,
  Edit3Icon,
  DownloadIcon,
  CopyIcon,
  ClipboardIcon,
  FolderMinusIcon,
} from "vue-feather-icons";
import FolderIcon from "@/components/Icons/FolderIcon";
import FolderOpenIcon from "@/components/Icons/FolderOpenIcon";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { SlideYUpTransition, FadeTransition } from "vue2-transitions";
import FileItem from "./FileItem";
import DirectoryItem from "./DirectoryItem";
import { fileTypes } from "../models/vFile.model";

export default {
  name: "directory",
  components: {
    MoreVerticalIcon,
    Trash2Icon,
    Edit3Icon,
    DownloadIcon,
    CopyIcon,
    ClipboardIcon,
    SlideYUpTransition,
    FolderPlusIcon,
    FolderMinusIcon,
    FilePlusIcon,
    [fileTypes.FILE]: FileItem,
    [fileTypes.DIRECTORY]: DirectoryItem,
    FadeTransition,
    FolderIcon,
    FolderOpenIcon,
  },
  props: {
    file: Object,
    isActive: Boolean,
  },
  data() {
    return {
      readonly: true,
      filename: "",
      showContextMenu: false,
      showChildren: false,
    };
  },
  computed: {
    ...mapGetters("Editor", [
      "getChildren",
      "getActiveFileList",
      "getDraggingId",
    ]),
    children() {
      const cs = this.getChildren(this.file.id);
      return cs;
    },
  },
  methods: {
    ...mapActions("Explorer", ["downloadDirectory"]),
    ...mapActions("Editor", ["setDraggingId"]),
    ...mapActions("Files", [
      "renameFile",
      "deleteDirectory",
      "createFile",
      "createDirectory",
      "moveFile",
    ]),
    changeFileName() {
      if (this.filename) {
        this.renameFile({ id: this.file.id, name: this.filename });
        this.readonly = true;
      } else {
        this.renameFile({ id: this.file.id, name: this.file.name });
      }
    },
    openRenameMode() {
      this.showContextMenu = false;
      this.readonly = false;
      this.$refs.input.focus();
    },
    toggleContextMenu(e) {
      this.showContextMenu = !this.showContextMenu;
    },
    deleteCurrentFolder() {
      this.showContextMenu = !this.showContextMenu;
      this.deleteDirectory({ id: this.file.id });
    },
    createNewFile() {
      this.showChildren = true;
      this.createFile({ parent: this.file.id, editable: true });
      this.showContextMenu = false;
    },
    createNewFolder() {
      this.createDirectory({ parent: this.file.id, editable: true });
      this.showContextMenu = false;
      this.showChildren = true;
    },
    saveFolderAs() {
      this.downloadDirectory({ id: this.file.id, name: this.filename });
    },
    toggleShowChildren() {
      this.showChildren = !this.showChildren;
    },
    handleDragOver() {
      if (this.getDraggingId !== this.file.id) {
        this.setDraggingId({ id: this.file.id });
      }
    },
    handleDrop(event) {
      const fileId = event.dataTransfer.getData("fileId");
      this.setDraggingId({ id: null });
      // prevent creating a black hole
      if (fileId === this.file.id) return;
      this.moveFile({ id: fileId, directoryId: this.file.id });
      this.showChildren = true;
    },
    handleDrag(event) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("fileId", this.file.id);
    },
  },
  watch: {
    readonly(value) {
      if (!value) {
        this.$refs.input.focus();
      }
    },
  },
  mounted() {
    this.readonly = !this.file.editable;
    this.filename = this.file.name;
    if (this.file.editable) {
      this.$refs.input.focus();
    }
  },
  created() {
    this.fileTypes = fileTypes;
  },
};
</script>

<style lang="scss" scoped>
.directory-wrapper {
  display: flex;
  flex-direction: column;

  &.highlighted {
    background-color: var(--drag-over-color);
  }

  .files {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
  }
}

.file-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px 2px 0;
  margin: 0px 5px 1px 5px;
  border-radius: 5px;

  &.active {
    // color: var(--color-primary);
    background: var(--color-secondary);
  }

  .clickable-area {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 3px 10px;
  }
  .icon {
    margin-right: 5px;
    width: 20px;
  }

  form {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  input {
    border: 0;
    padding: 6px 8px;
    border-radius: 2px;
    color: var(--font-color);
    border: 2px solid transparent;
    outline: none;
    transition: 0.2s all ease-in-out;
    background: transparent;
    min-width: 0;

    &[readonly] {
      pointer-events: none;
    }

    &:focus {
      border-bottom: 2px solid var(--color-primary);
    }
  }

  .context-menu {
    align-items: center;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: 0.3s all ease-in-out;

    .trigger-icon {
      display: block;
      visibility: hidden;
      padding: 5px;
      border-radius: 5px;
      margin-right: 5px;

      &.no-margin {
        margin-right: 0;
      }

      &:hover {
        background: var(--color-secondary-light);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .options {
      position: absolute;
      right: 0;
      top: 35px;
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

        &:hover {
          cursor: pointer;
          // background: var(--color-secondary-light);
          color: var(--color-primary);
        }
      }
    }
  }

  &:hover {
    background: var(--color-secondary);
    cursor: pointer;
    color: var(--font-color);

    .context-menu {
      display: flex;
      .trigger-icon {
        visibility: visible;
      }
    }
  }

  // &:read-only {
  //   background: transparent;
  // }
}
</style>
