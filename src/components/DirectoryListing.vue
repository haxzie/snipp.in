<template>
  <div class="directory-listing">
    <div class="search-input-wrapper">
      <input
        type="text"
        placeholder="🔍 Search"
        class="search-input"
        @input="searchFiles"
        v-model="searchInput"
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
      style="padding: 15px"
      v-if="Object.values(getFilteredFiles).length == 0 && searchInput != ''"
    >
      <p>No Search Results for '{{ searchInput }}'</p>
    </div>

    <FadeTransition group v-if="searchInput == ''">
      <component
        v-for="file in files"
        :key="file.id"
        :is="file.type"
        :file="file"
        :isActive="!!getActiveFileList[file.id]"
      />
    </FadeTransition>
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
};
</script>

<style lang="scss">
.search-input-wrapper {
  padding: 0 20px 0 0px;
}

.search-input {
  padding: 10px 15px;
  background: var(--color-secondary-light);
  border: none;
  border-bottom: 1px solid #666;
  color: var(--font-color);
  width: 100%;
  display: block;
  &:focus {
    border: none;
    border-bottom: 1px solid var(--font-color);
    box-shadow: none;
    outline: none;
  }
}
</style>
