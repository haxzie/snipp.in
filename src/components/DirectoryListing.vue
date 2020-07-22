<template>
  <div class="directory-listing">
    <FadeTransition group>
      <component
        v-for="(file) in files"
        :key="file.file_id"
        :is="file.type"
        :file="file"
        :isActive="!!activeFiles[file.file_id]"
      />
    </FadeTransition>
  </div>
</template>

<script>
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import { FadeTransition } from "vue2-transitions";

export default {
  props: {
    files: Array,
    activeFiles: Object,
  },
  components: {
    FILE: FileItem,
    FOLDER: FolderItem,
    FadeTransition,
  },
};
</script>

<style></style>
