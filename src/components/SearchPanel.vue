<template>
  <div class="search-panel">
    <!-- <header>
      <h4>Search Files</h4>
    </header> -->
    <div class="search-listing">
      <div class="search-input-wrapper">
        <input
          type="text"
          placeholder="Search files..."
          class="search-input"
          @input="searchFiles"
          v-model="searchInput"
          ref="searchInput"
        />
      </div>
      <FadeTransition group v-if="Object.values(getFilteredFiles).length > 0">
        <component
          v-for="file in getFilteredFiles"
          :key="file.id"
          :is="file.type"
          :file="file"
          :isActive="!!getActiveFileList[file.id]"
        />
      </FadeTransition>

      <div
        class="help-text"
        v-if="Object.values(getFilteredFiles).length == 0 && searchInput != ''"
      >
        <p>No Search Results for '{{ searchInput }}'</p>
      </div>

      <div group v-if="searchInput == ''" class="help-text">
        <p>Type in your query to search your files</p>
      </div>
    </div>
  </div>
</template>

<script>
import FileItem from "./FileItem";
import DirectoryItem from "./DirectoryItem";
import { FadeTransition } from "vue2-transitions";
import { fileTypes } from "../models/vFile.model";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    files: Array,
    activeFiles: Object,
  },
  data: () => {
    return { searchInput: "" };
  },
  components: {
    [fileTypes.FILE]: FileItem,
    [fileTypes.DIRECTORY]: DirectoryItem,
    FadeTransition,
  },
  computed: {
    ...mapGetters("Editor", ["getActiveFileList"]),
    ...mapGetters("Files", ["getFilteredFiles"]),
  },
  created() {
    this.fileTypes = fileTypes;
  },
  methods: {
    ...mapActions("Files", ["searchFiles"]),
  },
  mounted() {
    this.$refs.searchInput.focus();
  },
};
</script>

<style lang="scss" scoped>
.search-panel {
  background: var(--color-secondary-light);
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
    padding: 10px;
    align-items: center;
    z-index: 99;

    h4 {
      font-weight: bold;
      flex: 1;
    }
  }
  .search-input-wrapper {
    display: flex;
    background: var(--color-input-background);
    .search-input {
      padding: 10px 15px;
      border: none;
      color: var(--font-color);
      background: transparent;
      width: 100%;
      display: block;
      // border-radius: 5px;
      border-bottom: 2px solid transparent;

      &:focus {
        border: none;
        border-bottom: 2px solid var(--font-color);
        box-shadow: none;
        outline: none;
      }
    }
  }

  .help-text {
    padding: 15px;
    opacity: 0.5;
  }
}
</style>
