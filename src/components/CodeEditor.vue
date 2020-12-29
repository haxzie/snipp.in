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
import Dracula from "@/themes/Dracula";
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
    editorDidMount(editor) {
      const monaco = this.$refs.editor.monaco;
      console.log({ monaco });
      // monaco.editor.defineTheme("night-owl", NightOwl);
      // monaco.editor.setTheme("night-owl");
      monaco.editor.defineTheme("Dracula", Dracula);
      monaco.editor.setTheme("Dracula");
    },
  },
  computed: {
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
        csv: "csv"
      };
      if (this.file && this.file.name) {
        const nameParts = this.file.name.split(".");
        const ext = nameParts[nameParts.length - 1];
        return languageExts[ext] || "markdown"; // fallback to default syntax highlightning to be markdown
      } else {
        return "markdown"
      }
    },
  },
  watch: {
    file(newFile) {
      this.code = newFile.contents || "";
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
}
</style>
