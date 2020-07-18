<template>
  <div class="directory-listing">
      <component
        v-for="(file, index) in files"
        :key="index"
        :is="file.type"
        :file="file"
        :isActive="!!activeFiles[file.file_id]"
      />
  </div>
</template>

<script>
import FileItem from './FileItem';
import FolderItem from './FolderItem';

export default {
    props: {
        files: Array,
        activeFiles: Object
    },
    components: {
        FILE: FileItem,
        FOLDER: FolderItem
    }
}
</script>

<style>

</style>