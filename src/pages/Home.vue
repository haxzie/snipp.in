<template>
  <div id="main-layout">
    <FileExplorer />
    <Editor />
    <CommandCenter/>
  </div>
</template>

<script>
import FileExplorer from "@/components/FileExplorer";
import Editor from "@/components/Editor";
import CommandCenter from "@/components/CommandCenter";

export default {
  components: {
    FileExplorer,
    Editor,
    CommandCenter
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
