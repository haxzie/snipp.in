<template>
  <main>
    <div id="main-layout">
      <SideNavigationBar
        :activeOption="activePanel"
        :menuOptions="navigationOptions"
        @change="setActivePanel"
      />
      <div v-show="activePanel" class="explorer-panel">
        <FileExplorer :key="'explorer'" v-show="activePanel === 'explorer'" />
        <SearchPanel :key="'search'" v-show="activePanel === 'search'" />
        <TrashPanel :key="'trash'" v-show="activePanel === 'trash'" />
      </div>
      <Editor />
    </div>
    <CommandCenter />
  </main>
</template>

<script>
import FileExplorer from "@/components/FileExplorer";
import Editor from "@/components/Editor";
import CommandCenter from "@/components/CommandCenter";
import SideNavigationBar from "@/components/SideNavigationBar";
import SearchPanel from "@/components/SearchPanel";
import TrashPanel from "@/components/TrashPanel";

export default {
  components: {
    FileExplorer,
    Editor,
    CommandCenter,
    SideNavigationBar,
    SearchPanel,
    TrashPanel,
  },
  data() {
    return {
      activePanel: "explorer",
      navigationOptions: [
        {
          id: "explorer",
          icon: "FileTextIcon",
          name: "File Explorer",
        },
        {
          id: "search",
          icon: "SearchIcon",
          name: "Search",
        },
        {
          id: "trash",
          icon: "TrashIcon",
          name: "Trash",
        },
      ],
    };
  },
  methods: {
    setActivePanel(optionId) {
      this.activePanel = optionId;
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}
#main-layout {
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 50px auto 1fr;
  background: var(--color-secondary-light);
  position: relative;

  .explorer-panel {
    width: 270px;
    height: 100%;
    overflow: hidden;
  }
}
</style>
