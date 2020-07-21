<template>
  <div
    :class="['file-item', { active: isActive }]"
    @click="openFile({ file_id: file.file_id })"
    @dblclick="readonly = !readonly"
  >
    <FileTextIcon class="icon" size="18" />
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
    <div class="context-menu">
      <MoreVerticalIcon
        class="trigger-icon"
        size="18"
        @click="toggleContextMenu"
      />
      <div v-if="showContextMenu" class="options">
        <div class="option-item" @click="openRenameMode">
          <edit3-icon size="18" class="icon" />Rename
        </div>
        <div class="option-item">
          <download-icon size="18" class="icon" />Download File
        </div>
        <div class="option-item">
          <copy-icon size="18" class="icon" />Duplicate File
        </div>
        <div class="option-item">
          <clipboard-icon size="18" class="icon" />Copy contents
        </div>
        <div class="option-item" @click="deleteCurrentFile">
          <trash2-icon size="18" class="icon" />Delete File
        </div>
      </div>
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
import { mapActions } from "vuex";

export default {
  components: {
    FileTextIcon,
    MoreVerticalIcon,
    Trash2Icon,
    Edit3Icon,
    DownloadIcon,
    CopyIcon,
    ClipboardIcon
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
    ...mapActions("Editor", ["openFile"]),
    ...mapActions("Files", ["renameFile", "deleteFile"]),
    changeFileName() {
      if (this.filename) {
        this.renameFile({ file_id: this.file.file_id, name: this.filename });
        this.readonly = true;
        this.openFile({ file_id: this.file.file_id });
      } else {
        this.deleteFile({ file_id: this.file.file_id });
      }
    },
    openRenameMode() {
      this.readonly = false;
      this.$refs.input.focus();
      this.showContextMenu = false;
    },
    toggleContextMenu() {
      this.showContextMenu = !this.showContextMenu;
    },
    deleteCurrentFile() {
        this.deleteFile({ file_id: this.file.file_id });
        this.showContextMenu = !this.showContextMenu;
    }
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
};
</script>

<style lang="scss" scoped>
.file-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px 2px 10px;
  margin: 0 5px;
  border-radius: 5px;

  &.active {
    // color: var(--color-primary);
    background: var(--color-secondary);
  }

  .icon {
    margin-right: 10px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: 0.3s all ease-in-out;

    .trigger-icon {
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

    .context-menu .trigger-icon {
      visibility: visible;
    }
  }

  // &:read-only {
  //   background: transparent;
  // }
}
</style>
