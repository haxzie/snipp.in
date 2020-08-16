<template>
  <div class="directory-listing">
    <FadeTransition group>
      <component
        v-for="(file) in files"
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
import { fileTypes } from '../models/vFile.model';
import { mapGetters } from 'vuex';

export default {
  props: {
    files: Array,
    activeFiles: Object,
  },
  components: {
    [fileTypes.FILE]: FileItem,
    [fileTypes.DIRECTORY]: DirectoryItem,
    FadeTransition,
  },
  computed:{
    ...mapGetters("Editor", ["getActiveFileList"])
  },
  created() {
    this.fileTypes = fileTypes
  }
};
</script>

<style></style>
