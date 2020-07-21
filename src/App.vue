<template>
  <div id="main-layout">
    <FileExplorer />
    <Editor />
  </div>
</template>

<script>
import FileExplorer from "./components/FileExplorer";
import Editor from "./components/Editor";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    FileExplorer,
    Editor,
  },
  methods: {
    ...mapActions("Files", ["loadFiles"]),
  },
  async mounted() {
    this.loadFiles();
  },
};
</script>

<style lang="scss" scoped>
#main-layout {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--color-secondary-light);
}
</style>
