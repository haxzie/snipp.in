<template>
  <div class="file-explorer">
    <header>
      <h4>Hacker Space</h4>
      <div class="menu">
        <div class="icon-wrapper">
          <FolderPlusIcon size="18" class="icon" @click="createNewFolder" />
          <span class="tooltip">Create Folder</span>
        </div>
        <div class="icon-wrapper">
          <FilePlusIcon size="18" class="icon" @click="createNewFile" />
          <span class="tooltip">Create File</span>
        </div>
      </div>
    </header>
    <div class="content-area">
      <DirectoryListing :files="getFiles"/>
    </div>
  </div>
</template>

<script>
import { FilePlusIcon, FolderPlusIcon } from "vue-feather-icons";
import { mapGetters, mapActions } from "vuex";
import DirectoryListing from './DirectoryListing';

export default {
  components: {
    FilePlusIcon,
    FolderPlusIcon,
    DirectoryListing
  },
  computed: {
    ...mapGetters('Files', ['getFiles']),
  },
  methods: {
    ...mapActions("Files", ["createFile"]),
    createNewFile() {
      this.createFile();
    },
    createNewFolder() {},
  },
};
</script>

<style lang="scss" scoped>
.file-explorer {
  background: var(--color-secondary-light);
  z-index: 9;
  header {
    display: flex;
    flex-direction: row;
    padding: 5px 10px 5px 10px;
    align-items: center;

    h4 {
      font-weight: bold;
      flex: 1;
    }

    .menu {
      display: flex;
    }

    .icon-wrapper {
      position: relative;

      .tooltip {
        position: absolute;
        background: var(--color-secondary);
        top: 35px;
        left: -10px;
        white-space: nowrap;
        display: none;
        padding: 5px 10px;
        border-radius: 5px;
      }

      &:hover {
        .tooltip {
          display: flex;
        }
      }
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

  .directory-listing {
    display: flex;
    flex-direction: column;
  }
}
</style>
