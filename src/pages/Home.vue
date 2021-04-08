<template>
  <main>
    <div id="main-layout">
      <SideNavigationBar />
      <div v-show="getActivePanelId" class="explorer-panel">
        <FileExplorer
          v-if="getActivePanelId === 'explorer'"
        />
        <SearchPanel :key="'search'" v-if="getActivePanelId === 'search'" />
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
import { mapGetters } from "vuex";

export default {
  components: {
    FileExplorer,
    Editor,
    CommandCenter,
    SideNavigationBar,
    SearchPanel,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("UI", ["getActivePanelId"]),
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
