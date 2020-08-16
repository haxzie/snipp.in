<template>
  <div :class="['editor-area', getEditorMode]">
    <div id="primary-editor" class="codemirror-instances">
      <TopBar
        :editor="getEditors.primary"
        :activeFile="getActiveFiles[getEditors.primary]"
        :openFiles="getOpenFiles[getEditors.primary]"
      />
      <div class="scroll-wrapper">
        <CodeMirror
          v-if="getActiveFiles[getEditors.primary]"
          :file="getActiveFiles[getEditors.primary]"
          @contentChanged="
            (contents) =>
              updateContents(
                getActiveFiles[getEditors.primary].id,
                contents
              )
          "
        />
      </div>
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
import debounce from "lodash/debounce";

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
  methods: {
    ...mapActions("Files", ["updateFileContents"]),
    updateContents(id, contents) {
      this.debouncedFileUpdate({ id, contents });
    },
  },
  created() {
    this.debouncedFileUpdate = debounce(this.updateFileContents, 1000);
  },
};
</script>

<style lang="scss" scoped>
.editor-area {
  display: grid;
  height: 100%;
  overflow: hidden;

  &.single {
    grid-template-columns: 1fr;
  }

  &.multiple {
    grid-template-columns: 1fr 1fr;
  }

  .scroll-wrapper {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .codemirror-instances {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
}
</style>
