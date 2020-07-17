<template>
  <div class="directory-listing">
      <component
        v-for="(file, index) in files"
        :key="index"
        :is="file.type"
        :file="file"
      />
  </div>
</template>

<script>
import FileItem from './FileItem';
import FolderItem from './FolderItem';

export default {
    props: {
        files: Array
    },
    components: {
        FILE: FileItem,
        FOLDER: FolderItem
    }
}
</script>

<style>

</style>