<template>
  <codemirror
    ref="cmEditor"
    :value="code"
    :options="cmOptions"
    :autoCloseTags="true"
    @ready="onCmReady"
    @focus="onCmFocus"
    @input="onCmCodeChange"
  />
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/gfm/gfm"
import "codemirror/mode/markdown/markdown"
import "codemirror/theme/dracula.css";
import "codemirror/theme/base16-light.css"
import "codemirror/addon/edit/closebrackets"
import "codemirror/addon/edit/closetag"

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      code: `**hello** hai bye`,
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: "text/javascript",
        theme: "dracula",
        lineNumbers: true,
        line: true,
        foldGutter: true,
        highlightFormatting: true,
        xml: true,
        autoCloseBrackets: true,
        autoCloseTags: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
    };
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focused!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode);
      this.code = newCode;
    },
  },
  computed: {
    codemirror() {
      return this.$refs.cmEditor.codemirror;
    },
  },
};
</script>

<style lang="scss">
.vue-codemirror {
  height: 100%;
  .CodeMirror {
    height: 100%;
    font-family: "Fira Code", monospace;
    font-size: 16px !important;
    // font-size: 2rem;
    .CodeMirror-overlayscroll-vertical div,
    .CodeMirror-overlayscroll-horizontal div {
      background-color: rgba(18, 21, 27, 0.45) !important;
    }
    pre {
      word-break: break-word;
    }
  }
  .CodeMirror-gutters {
    background-color: transparent !important;
  }
}
</style>
