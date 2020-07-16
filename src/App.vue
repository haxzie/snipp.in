<template>
  <div id="main-layout">
    <FileExplorer />
    <div class="editor-area">
      <TopBar/>
      <Editor />
    </div>
  </div>
</template>

<script>
import FileExplorer from "./components/FileExplorer";
import Editor from "./components/Editor";
import TopBar from "./components/TopBar"

export default {
  name: "App",
  components: {
    FileExplorer,
    Editor,
    TopBar
  },
};
</script>

<style lang="scss" scoped>
#main-layout {
  height: 100%;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--color-secondary-light);

  .editor-area {
    display: flex;
    flex-direction: column;
  }
}
</style>
