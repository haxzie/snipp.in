<template>
  <div :class="['file-item', { active: isActive || showContextMenu }]">
    <div
      class="clickable-area"
      @click="openFile({ id: file.id })"
      @dblclick="readonly = !readonly"
      draggable
      @dragstart="handleDrag"
      @dragend="handleDragEnd"
      @contextmenu.prevent.stop="toggleContextMenu"
    >
      <component :is="getFileIcon(file)" class="icon" size="20" />
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
      <div class="active-indicator" v-if="isActive"></div>
    </div>
    <div class="context-menu">
      <MoreVerticalIcon
        class="trigger-icon"
        :style="showContextMenu ? 'visibility: visible' : null"
        size="18"
        @click="toggleContextMenu"
      />
      <SlideYUpTransition>
        <div
          v-if="showContextMenu"
          class="options"
          v-click-outside="toggleContextMenu"
          @mouseleave.once="showContextMenu = false"
        >
          <div class="option-item" @click="openRenameMode">
            <edit3-icon size="18" class="icon" />Rename
          </div>
          <div class="option-item" @click="saveFileAs">
            <download-icon size="18" class="icon" />Download File
          </div>
          <!--<div class="option-item">
            <copy-icon size="18" class="icon" />Duplicate File
          </div>-->
          <div class="option-item" @click="copyFileContents">
            <clipboard-icon size="18" class="icon" />Copy contents
          </div>
          <div class="option-item" @click="deleteCurrentFile">
            <trash2-icon size="18" class="icon" />Delete File
          </div>
        </div>
      </SlideYUpTransition>
    </div>

    <!-- <span>{{ file.name }}</span> -->
  </div>
</template>

<script>
import {
  FileTextIcon,
  MoreVerticalIcon,
  Trash2Icon,
  Edit3Icon,
  DownloadIcon,
  CopyIcon,
  ClipboardIcon,
} from "vue-feather-icons";
import FileIcon from "@/components/Icons/FileIcon";
import FileJavascriptIcon from "@/components/Icons/FileJavascriptIcon";
import FileMarkdownIcon from "@/components/Icons/FileMarkdownIcon";
import FileJsonIcon from "@/components/Icons/FileJsonIcon";
import FileDocumentIcon from "@/components/Icons/FileDocumentIcon";
import FilePythonIcon from "@/components/Icons/FilePythonIcon";
import { mapActions } from "vuex";
import { SlideYUpTransition } from "vue2-transitions";

export default {
  components: {
    FileTextIcon,
    MoreVerticalIcon,
    Trash2Icon,
    Edit3Icon,
    DownloadIcon,
    CopyIcon,
    ClipboardIcon,
    SlideYUpTransition,
    FileIcon,
    FileJavascriptIcon,
    FileMarkdownIcon,
    FileJsonIcon,
    FileDocumentIcon,
    FilePythonIcon,
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
    };
  },
  methods: {
    ...mapActions("Editor", ["openFile", "downloadFile", "setDraggingId", "setDraggingFileId"]),
    ...mapActions("Files", ["renameFile", "deleteFile"]),
    changeFileName() {
      if (this.filename) {
        this.renameFile({ id: this.file.id, name: this.filename });
        this.readonly = true;
        this.openFile({ id: this.file.id });
      } else {
        this.renameFile({ id: this.file.id, name: this.file.name });
      }
    },
    openRenameMode() {
      this.showContextMenu = false;
      this.readonly = false;
      this.$refs.input.focus();
    },
    toggleContextMenu() {
      this.showContextMenu = !this.showContextMenu;
    },
    deleteCurrentFile() {
      this.showContextMenu = !this.showContextMenu;
      this.deleteFile({ id: this.file.id });
    },
    handleDrag(event) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('fileId', this.file.id);
      this.setDraggingFileId({ id: this.file.id });
    },
    handleDragEnd() {
      setTimeout(() => {
        this.setDraggingFileId({ id: null });
        this.setDraggingId({ id: null });
      }, 100);
    },
    copyFileContents() {
      navigator.clipboard.writeText(this.file.contents);
      this.showContextMenu = false;
    },
    saveFileAs() {
      this.downloadFile({ id: this.file.id });
      this.showContextMenu = false;
    },
    getFileIcon(file) {
      let extension = null;
      if (file && file.name) {
        const { name } = file;
        const fileParts = name.split(".");
        extension =
          fileParts.length > 1 ? fileParts.slice(-1).slice(-1)[0] : null;
      }

      switch (extension) {
        case "js":
          return "FileJavascriptIcon";
        case "json":
          return "FileJsonIcon";
        case "md":
          return "FileMarkdownIcon";
        case "doc":
          return "FileDocumentIcon";
        case "py":
          return "FilePythonIcon";
        default:
          return "FileIcon";
      }
    },
  },
  watch: {
    readonly(value) {
      if (!value) {
        this.$refs.input.focus();
      }
    },
    file: {
      immediate: true,
      handler() {
        this.readonly = !this.file.editable;
        this.filename = this.file.name;
        if (this.file.editable) {
          setTimeout(() => {
            this.$refs.input.focus();
          }, 200);
        }
      },
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px 2px 0;
  margin: 0 5px 1px 5px;
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

  .active-indicator {
    width: 5px;
    height: 5px;
    background: var(--color-primary);
    border-radius: 50%;
  }

  .context-menu {
    display: none;
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
