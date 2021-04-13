<template>
  <MonacoEditor
    ref="editor"
    class="monaco-editor"
    v-model="code"
    :language="getLanguage"
    :options="editorOptions"
    @change="onCodeChanged"
    @editorDidMount="editorDidMount"
  />
</template>

<script>
import MonacoEditor from "vue-monaco";
// import NightOwl from "@/themes/NightOwl";
import DraculaTheme from "@/themes/Dracula";
import GitHubTheme from "@/themes/GitHub";
import { mapGetters } from "vuex";
import { THEMES } from "@/store/modules/UI/initialState";
// import BlackBoard from "@/themes/BlackBoard";
// import CloudsMidnight from "@/themes/CloudsMidnight";

export default {
  components: {
    MonacoEditor,
  },
  props: {
    file: Object,
  },
  data() {
    return {
      code: "",
      editorOptions: {
        automaticLayout: true,
        selectOnLineNumbers: true,
        theme: "vs-dark",
        fontSize: 16,
        fontLigatures: true,
        minimap: {
          enabled: false,
        },
      },
    };
  },
  methods: {
    onCodeChanged(newCode) {
      // this.code = newCode;
      this.$emit("contentChanged", newCode);
    },
    applyAppTheme() {
      const monaco = this.$refs.editor.monaco;
      switch (this.getActiveTheme) {
        case THEMES.dark: {
          monaco.editor.setTheme("Dracula");
          break;
        }
        case THEMES.light: {
          monaco.editor.setTheme("GitHub");
          break;
        }
      }
    },
    editorDidMount(editor) {
      // monaco.editor.defineTheme("night-owl", NightOwl);
      // monaco.editor.setTheme("night-owl");
      const monaco = this.$refs.editor.monaco;
      monaco.editor.defineTheme("Dracula", DraculaTheme);
      monaco.editor.defineTheme("GitHub", GitHubTheme);

      this.applyAppTheme();
    },
  },
  computed: {
    ...mapGetters("UI", ["getActiveTheme"]),
    editor() {
      return this.$refs.editor.monaco;
    },
    getLanguage() {
      const languageExts = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        py: "python",
        json: "json",
        html: "html",
        css: "css",
        md: "markdown",
        csv: "csv",
      };
      if (this.file && this.file.name) {
        const nameParts = this.file.name.split(".");
        const ext = nameParts[nameParts.length - 1];
        return languageExts[ext] || "markdown"; // fallback to default syntax highlightning to be markdown
      } else {
        return "markdown";
      }
    },
  },
  watch: {
    file(newFile) {
      this.code = newFile.contents || "";
    },
    getActiveTheme() {
      this.applyAppTheme();
    },
    // code(newCode) {
    //   this.$emit("contentChanged", newCode);
    // },
  },
  created() {
    this.code = this.file ? this.file.contents : "";
  },
};
</script>

<style lang="scss">
.monaco-editor {
  flex: 1;
  width: 100%;
  * {
    font-family: "Fira Code", monospace;
  }
}
</style>
