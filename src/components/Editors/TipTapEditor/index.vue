<template>
  <div class="prosemirror-wrapper">
    <editor-content :editor="editor" class="tiptap-editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import debounce from "lodash/debounce";

export default {
  components: {
    EditorContent,
  },
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  computed: {
    getFileContents() {
      const fileContents = (this.file && this.file.contents) || {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: {
              level: 1,
            },
            content: [
              {
                type: "text",
                text: "Untitled Document",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Click to edit and start writing…",
              },
            ],
          }
        ],
      };
      return fileContents;
    },
  },
  methods: {
    setOutput() {
      this.debouncedEmit();
    },
    async emitOutput() {
      let json = this.editor.getJSON();
      this.$emit("contentChanged", json);
    },
  },
  watch: {
    file: {
      immediate: true,
      handler(current, previous) {
        if (previous && current.id === previous.id) return;

        if (this.editor) {
          this.editor.destroy();
        }
        this.editor = new Editor({
          extensions: [
            StarterKit,
            Typography,
            Highlight,
            Document,
            Paragraph,
            Text,
            Placeholder,
            BulletList,
            ListItem,
            TaskList,
            TaskItem,
          ],
          editable: true,
          onUpdate: this.setOutput,
          autofocus: true,
        });
        this.editor.commands.setContent(this.getFileContents);
      },
    },
  },
  created() {
    this.debouncedEmit = debounce(this.emitOutput, 500);
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.prosemirror-wrapper {
  width: 100%;
  height: 100%;
  flex: 1;
  overflow-y: auto;
  background: var(--color-secondary);

  .tiptap-editor {
    width: 100%;
    min-height: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 50px 15px;
    background: var(--color-secondary);

    .ProseMirror {
      outline: none !important;
      min-height: 100%;
      overflow: hidden;
      color: var(--font-color);

      a {
        color: #4183c4;
        text-decoration: none;
      }

      a.absent {
        color: #cc0000;
      }

      a.anchor {
        display: block;
        padding-left: 20px;
        margin-left: -20px;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: 10px 0 0 0;
        padding: 15px 0px;
        font-weight: bold;
        -webkit-font-smoothing: antialiased;
        cursor: text;
        position: relative;
        color: var(--font-color);
        border-bottom: 1px solid var(--border-color);
        line-height: 1.6rem;
      }

      h2:first-child,
      h1:first-child,
      h1:first-child + h2,
      h3:first-child,
      h4:first-child,
      h5:first-child,
      h6:first-child {
        margin-top: 0;
        padding-top: 0;
      }

      h1:hover a.anchor,
      h2:hover a.anchor,
      h3:hover a.anchor,
      h4:hover a.anchor,
      h5:hover a.anchor,
      h6:hover a.anchor {
        text-decoration: none;
      }

      h1 tt,
      h1 code {
        font-size: inherit;
      }

      h2 tt,
      h2 code {
        font-size: inherit;
      }

      h3 tt,
      h3 code {
        font-size: inherit;
      }

      h4 tt,
      h4 code {
        font-size: inherit;
      }

      h5 tt,
      h5 code {
        font-size: inherit;
      }

      h6 tt,
      h6 code {
        font-size: inherit;
      }

      h1 {
        font-size: 2rem;
        line-height: 2.2rem;
        color: var(--font-color);
      }

      h2 {
        font-size: 1.5rem;
        line-height: 1.8rem;
        color: var(--font-color);
      }

      h3 {
        font-size: 1.2rem;
        line-height: 1.5rem;
      }

      h4 {
        font-size: 1rem;
        line-height: 1.2rem;
      }

      p,
      blockquote,
      ul,
      ol,
      dl,
      li,
      table,
      pre {
        font-size: 16px;
        line-height: 1.65rem;
        margin: 15px 0;
        color: var(--font-color);
      }

      hr {
        border: 0 none;
        background: var(--border-color);
        height: 1px;
        padding: 0;
      }

      body > h2:first-child {
        margin-top: 0;
        padding-top: 0;
      }

      body > h1:first-child {
        margin-top: 0;
        padding-top: 0;
      }

      body > h1:first-child + h2 {
        margin-top: 0;
        padding-top: 0;
      }

      body > h3:first-child,
      body > h4:first-child,
      body > h5:first-child,
      body > h6:first-child {
        margin-top: 0;
        padding-top: 0;
      }

      a:first-child h1,
      a:first-child h2,
      a:first-child h3,
      a:first-child h4,
      a:first-child h5,
      a:first-child h6 {
        margin-top: 0;
        padding-top: 0;
      }

      h1 p,
      h2 p,
      h3 p,
      h4 p,
      h5 p,
      h6 p {
        margin-top: 0;
      }

      li p.first {
        display: inline-block;
      }

      ul {
        list-style-type: disc;
      }

      ol {
        list-style-type: decimal;
      }

      ul,
      ol {
        padding-left: 20px;
      }

      li {
        margin: 10px 0 0 0;
      }

      ul :first-child,
      ol :first-child {
        margin-top: 0;
      }

      ul :last-child,
      ol :last-child {
        margin-bottom: 0;
      }

      ul[data-type="taskList"] {
        list-style: none;
        padding: 0 0 0 10px;

        li {
          display: flex;
          align-items: center;

          > label {
            flex: 0 0 auto;
            margin-right: 0.5rem;

            input[type="checkbox"]:checked {
              background: var(--color-primary);
              margin-right: 5px;
            }
          }
        }
      }

      dl {
        padding: 0;
      }

      dl dt {
        font-size: 14px;
        font-weight: bold;
        font-style: italic;
        padding: 0;
        margin: 15px 0 5px;
      }

      dl dt:first-child {
        padding: 0;
      }

      dl dt > :first-child {
        margin-top: 0;
      }

      dl dt > :last-child {
        margin-bottom: 0;
      }

      dl dd {
        margin: 0 0 15px;
        padding: 0 15px;
      }

      dl dd > :first-child {
        margin-top: 0;
      }

      dl dd > :last-child {
        margin-bottom: 0;
      }

      blockquote {
        border-left: 4px solid var(--font-color-light);
        padding: 0 15px;
        color: #777777;
      }

      blockquote > :first-child {
        margin-top: 0;
      }

      blockquote > :last-child {
        margin-bottom: 0;
      }

      table {
        padding: 0;
      }
      table tr {
        border-top: 1px solid #cccccc;
        background-color: white;
        margin: 0;
        padding: 0;
      }

      table tr:nth-child(2n) {
        background-color: #f8f8f8;
      }

      table tr th {
        font-weight: bold;
        border: 1px solid #cccccc;
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }

      table tr td {
        border: 1px solid #cccccc;
        text-align: left;
        margin: 0;
        padding: 6px 13px;
      }

      table tr th :first-child,
      table tr td :first-child {
        margin-top: 0;
      }

      table tr th :last-child,
      table tr td :last-child {
        margin-bottom: 0;
      }

      img {
        max-width: 100%;
      }

      span.frame {
        display: block;
        overflow: hidden;
      }

      span.frame > span {
        border: 1px solid #dddddd;
        display: block;
        float: left;
        overflow: hidden;
        margin: 13px 0 0;
        padding: 7px;
        width: auto;
      }

      span.frame span img {
        display: block;
        float: left;
      }

      span.frame span span {
        clear: both;
        color: #333333;
        display: block;
        padding: 5px 0 0;
      }

      span.align-center {
        display: block;
        overflow: hidden;
        clear: both;
      }

      span.align-center > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: center;
      }

      span.align-center span img {
        margin: 0 auto;
        text-align: center;
      }

      span.align-right {
        display: block;
        overflow: hidden;
        clear: both;
      }

      span.align-right > span {
        display: block;
        overflow: hidden;
        margin: 13px 0 0;
        text-align: right;
      }

      span.align-right span img {
        margin: 0;
        text-align: right;
      }

      span.float-left {
        display: block;
        margin-right: 13px;
        overflow: hidden;
        float: left;
      }

      span.float-left span {
        margin: 13px 0 0;
      }

      span.float-right {
        display: block;
        margin-left: 13px;
        overflow: hidden;
        float: right;
      }

      span.float-right > span {
        display: block;
        overflow: hidden;
        margin: 13px auto 0;
        text-align: right;
      }

      code,
      tt {
        margin: 0 2px;
        padding: 0 5px;
        white-space: nowrap;
        border: 1px solid var(--border-color);
        background-color: var(--color-secondary-light);
        border-radius: 3px;
      }

      pre code {
        margin: 0;
        padding: 0;
        white-space: pre;
        border: none;
        background: transparent;
      }

      .highlight pre {
        background-color: var(--color-secondary-light);
        border: 1px solid var(--border-color);
        font-size: 15px;
        line-height: 19px;
        overflow: auto;
        padding: 15px;
        border-radius: 3px;
      }

      pre {
        background-color: var(--color-secondary-light);
        border: 1px solid var(--border-color);
        font-size: 15px;
        line-height: 19px;
        overflow: auto;
        padding: 15px;
        border-radius: 3px;
      }

      pre code,
      pre tt {
        background-color: transparent;
        border: none;
      }
    }

    .ProseMirror {
      > * + * {
        margin-top: 0.75em;
      }
    }

    /* Placeholder (at the top) */
    .ProseMirror p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: var(--font-color);
      pointer-events: none;
      height: 0;
    }
  }
}
</style>
