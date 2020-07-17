<template>
  <div :class="['editor-area', getEditorMode]">
    <div id="primary-editor" class="codemirror-instances">
      <TopBar
        :editor="getEditors.primary"
        :activeFile="getActiveFiles[getEditors.primary]"
        :openFiles="getOpenFiles[getEditors.primary]"
      />
      <CodeMirror
        v-if="getActiveFiles[getEditors.primary]"
        :file="getActiveFiles[getEditors.primary]"
      />
    </div>
    <div
      v-if="getEditorMode === 'multiple'"
      id="secodary-editor"
      class="codemirror-instances"
    >
      <TopBar
        :editor="getEditors.secondary"
        :activeFile="getActiveFiles[getEditors.secondary]"
        :openFiles="getOpenFiles[getEditors.secondary]"
      />
      <CodeMirror
        v-if="getActiveFiles[getEditors.secondary]"
        :file="getActiveFiles[getEditors.secondary]"
      />
    </div>
  </div>
</template>

<script>
import CodeMirror from "@/components/CodeMirror";
import TopBar from "@/components/TopBar";
import { mapActions, mapGetters } from "vuex";
import { EDITORS } from "@/store/modules/Editor/initialState";

export default {
  components: {
    CodeMirror,
    TopBar,
  },
  computed: {
    ...mapGetters("Editor", [
      "getActiveEditor",
      "getOpenFiles",
      "getActiveFiles",
    ]),
    getEditors() {
      return EDITORS;
    },
    getEditorMode() {
      if (
        this.getOpenFiles[EDITORS.secondary] &&
        this.getOpenFiles[EDITORS.secondary] > 0
      ) {
        return "multiple";
      } else {
        return "single";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-area {
  display: grid;

  &.single {
    grid-template-columns: 1fr;
  }

  &.multiple {
    grid-template-columns: 1fr 1fr;
  }

  .codemirror-instances {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
