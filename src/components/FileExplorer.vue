<template>
  <div class="file-explorer">
    <header>
      <h4>Snipp.in</h4>
      <div class="menu">
        <div v-tooltip="'Create new folder'" class="icon-wrapper">
          <FolderPlusIcon size="18" class="icon" @click="createNewFolder" />
        </div>
        <div v-tooltip="'Create new file'" class="icon-wrapper">
          <FilePlusIcon size="18" class="icon" @click="createNewFile" />
        </div>
      </div>
    </header>
    <simplebar class="content-area">
      <DirectoryListing v-if="children && children.length > 0" :files="children" :activeFiles="getActiveFileList" />
      <div v-else class="help-text">
        <p>No Snippets found, click on the create icons to start creating snippets</p>
      </div>
    </simplebar>
  </div>
</template>

<script>
import { FilePlusIcon, FolderPlusIcon } from "vue-feather-icons";
import { mapGetters, mapActions } from "vuex";
import DirectoryListing from "./DirectoryListing";

export default {
  components: {
    FilePlusIcon,
    FolderPlusIcon,
    DirectoryListing,
  },
  computed: {
    ...mapGetters("Files", ["getFiles"]),
    ...mapGetters("Editor", ["getActiveFiles", "getActiveFileList", "getChildren"]),
    children() {
      return this.getChildren('root');
    }
  },
  methods: {
    ...mapActions("Files", ["createFile", "createDirectory"]),
    createNewFile() {
      this.createFile({ editable: true });
    },
    createNewFolder() {
      this.createDirectory({ editable: true });
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
}
</style>
