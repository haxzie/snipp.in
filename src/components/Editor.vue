<template>
  <div :class="['editor-area', getEditorMode]">
    <div
      v-if="getOpenFiles[EDITORS.primary].length > 0"
      id="primary-editor"
      class="codemirror-instances"
      @click="switchActiveEditor(EDITORS.primary)"
    >
      <TopBar
        :editor="EDITORS.primary"
        :activeFile="getActiveFiles[EDITORS.primary]"
        :openFiles="getOpenFiles[EDITORS.primary]"
        :isActive="getActiveEditor === EDITORS.primary"
      />
      <div class="scroll-wrapper">
        <component
          v-if="getActiveFiles[EDITORS.primary]"
          :file="getActiveFiles[EDITORS.primary]"
          :is="getEditorForFile(getActiveFiles[EDITORS.primary])"
          :isActive="getActiveEditor === EDITORS.primary"
          @contentChanged="
            (contents) =>
              updateContents(getActiveFiles[EDITORS.primary].id, contents)
          "
        />
      </div>
    </div>
    <div
      v-if="
        getOpenFiles[EDITORS.secondary].length > 0 &&
          getEditorMode === 'multiple'
      "
      id="secodary-editor"
      class="codemirror-instances"
      @click="switchActiveEditor(EDITORS.secondary)"
    >
      <TopBar
        :editor="EDITORS.secondary"
        :activeFile="getActiveFiles[EDITORS.secondary]"
        :openFiles="getOpenFiles[EDITORS.secondary]"
        :isActive="getActiveEditor === EDITORS.secondary"
      />
      <div class="scroll-wrapper">
        <component
          v-if="getActiveFiles[EDITORS.secondary]"
          :file="getActiveFiles[EDITORS.secondary]"
          :is="getEditorForFile(getActiveFiles[EDITORS.secondary])"
          :isActive="getActiveEditor === EDITORS.primary"
          @contentChanged="
            (contents) =>
              updateContents(getActiveFiles[EDITORS.secondary].id, contents)
          "
        />
      </div>
    </div>
    <div
      class="welcome-texts"
      v-if="
        !(
          getOpenFiles[EDITORS.primary].length > 0 ||
          getOpenFiles[EDITORS.secondary].length > 0
        )
      "
    >
      <h2 class="title">Welcome to Snipp.in</h2>
      <p class="description">
        Snipp.in is an in-browser snippet manager and editor.
      </p>

      <h3 class="menu-title">Get Started</h3>
      <ul class="menu">
        <li
          @click="setShowCreateFileModal({ flag: true, filename: 'untitled' })"
        >
          <FilePlusIcon class="icon" size="18" /> Create new snippet file <span>ALT+N</span>
        </li>
        <li
          @click="
            setShowCreateFileModal({ flag: true, filename: 'untitled.doc' })
          "
        >
          <FileTextIcon class="icon" size="18" /> Create new document
        </li>
        <li @click="createDirectory({ editable: true })">
          <FolderPlusIcon class="icon" size="18" /> Create new Folder
        </li>
      </ul>

      <h3 class="menu-title">Get Involved</h3>
      <ul class="menu">
        <li>
          <a
            href="https://github.com/haxzie/snipp.in"
            target="_blank"
            ref="noopener noreferrer"
            ><GithubIcon class="icon" size="18" /> GitHub</a
          >
        </li>
        <li>
          <a
            href="https://github.com/haxzie/snipp.in/issues"
            target="_blank"
            ref="noopener noreferrer"
            ><GitPullRequestIcon class="icon" size="18" /> Report a bug or an
            issue</a
          >
        </li>
      </ul>
    </div>
    <div
      v-if="getDraggingFileId"
      class="draggable-area"
      @dragenter.prevent="enableDragAndDropMode"
      @dragover.prevent
    >
      <div
        :class="['area', { highlight: targetDropEditor === EDITORS.primary }]"
        @dragenter.prevent="setTargetDropEditor(EDITORS.primary)"
        @drop.stop="openDroppedFile"
        @dragover.prevent
      ></div>
      <div
        v-if="getOpenFiles[EDITORS.primary].length > 0"
        :class="['area', { highlight: targetDropEditor === EDITORS.secondary }]"
        @dragenter.prevent="setTargetDropEditor(EDITORS.secondary)"
        @drop.stop="openDroppedFile"
        @dragover.prevent
      ></div>
    </div>
  </div>
</template>

<script>
import LoadingScreen from "@/components/LoadingScreen";
import TopBar from "@/components/TopBar";
import { mapActions, mapGetters } from "vuex";
import { EDITORS } from "@/store/modules/Editor/initialState";
import debounce from "lodash/debounce";
import {
FileIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderPlusIcon,
  GithubIcon,
  GitPullRequestIcon,
} from "vue-feather-icons";
import { fileTypes } from "@/models/vFile.model";
import FileDocumentIcon from "./Icons/FileDocumentIcon.vue";

const CodeEditor = () => ({
  component: import(
    /* webpackPrefetch: true */ "@/components/Editors/CodeEditor/index.vue"
  ),
  loading: LoadingScreen,
  error: LoadingScreen,
});

const TipTapEditor = () => ({
  component: import(
    /* webpackPrefetch: true */ "@/components/Editors/TipTapEditor/index.vue"
  ),
  loading: LoadingScreen,
  error: LoadingScreen,
});

const RoughDrawEditor = () => ({
  component: import(
    /* webpackPrefetch: true */ "@/components/Editors/RoughDrawEditor/index.vue"
  ),
  loading: LoadingScreen,
  error: LoadingScreen,
});

export default {
  components: {
    CodeEditor,
    TopBar,
    FilePlusIcon,
    FolderPlusIcon,
    GithubIcon,
    GitPullRequestIcon,
    TipTapEditor,
    RoughDrawEditor,
    FileDocumentIcon,
    FileIcon,
    FileTextIcon
},
  data() {
    return {
      dragAndDropMode: false,
      targetDropEditor: null,
    };
  },
  computed: {
    ...mapGetters("Editor", [
      "getActiveEditor",
      "getOpenFiles",
      "getActiveFiles",
      "getDraggingFileId",
    ]),
    ...mapGetters("Files", ["getFile"]),
    getEditorMode() {
      if (
        this.getOpenFiles[EDITORS.secondary] &&
        this.getOpenFiles[EDITORS.secondary].length > 0
      ) {
        return "multiple";
      } else {
        return "single";
      }
    },
  },
  methods: {
    ...mapActions("Files", [
      "updateFileContents",
      "createFile",
      "createDirectory",
      "deleteFile",
      "openRenameMode",
    ]),
    ...mapActions("Editor", [
      "setActiveEditor",
      "openFile",
      "setDraggingId",
      "setDraggingFileId",
      "closeFile",
    ]),
    ...mapActions("UI", ["setShowCreateFileModal"]),
    updateContents(id, contents) {
      this.debouncedFileUpdate({ id, contents });
    },
    switchActiveEditor(editor) {
      if (this.getActiveEditor !== editor) {
        this.setActiveEditor({ editor });
      }
    },
    getEditorForFile(file) {
      let extension = null;
      if (file && file.name) {
        const { name } = file;
        const fileParts = name.split(".");
        extension =
          fileParts.length > 1 ? fileParts.slice(-1).slice(-1)[0] : null;
      }

      switch (extension) {
        case "doc":
          return "TipTapEditor";
        case "draw":
          return "RoughDrawEditor";
        default:
          return "CodeEditor";
      }
    },
    enableDragAndDropMode() {
      this.dragAndDropMode = true;
    },
    disableDragAndDropMode() {
      this.dragAndDropMode = false;
      this.targetDropEditor = null;
    },
    setTargetDropEditor(editor) {
      console.log({ editor });
      this.targetDropEditor = editor;
    },
    openDroppedFile(event) {
      event.preventDefault();
      const editorTopBeDropped = this.targetDropEditor;
      const fileId = this.getDraggingFileId;
      this.setDraggingId({ id: null });
      this.setDraggingFileId({ id: null });
      const file = this.getFile(fileId);
      if (file && file.type !== fileTypes.DIRECTORY) {
        console.log({ id: fileId, editorTopBeDropped });
        this.openFile({ id: fileId, editor: editorTopBeDropped });
      }
    },
    dispatchActiveFileAction(action) {
      if (this.getActiveEditor) {
        const activeFile = this.getActiveFiles[this.getActiveEditor];
        if (activeFile && activeFile.id) {
          switch (action) {
            case "delete":
              this.deleteFile({ id: activeFile.id });
              break;
            case "rename":
              this.openRenameMode({ id: activeFile.id });
              break;
            case "close":
              this.closeFile({
                editor: this.getActiveEditor,
                id: activeFile.id,
              });
              break;
            default:
              console.error(`Invalid active fileaction: ${action}`);
          }
        }
      }
    },
  },
  created() {
    this.debouncedFileUpdate = debounce(this.updateFileContents, 1000);
    this.EDITORS = EDITORS;
  },
};
</script>

<style lang="scss" scoped>
.editor-area {
  display: grid;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  &.single {
    grid-template-columns: 1fr;
  }

  &.multiple {
    grid-template-columns: 1fr 1fr;
    column-gap: 3px;
  }

  .scroll-wrapper {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .codemirror-instances {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .welcome-texts {
    padding: 20px;

    .title {
      font-size: 1.2rem;
      padding: 10px 15px;
      font-weight: 600;
    }

    .description {
      opacity: 0.7;
      padding: 0px 15px;
    }

    .menu-title {
      font-size: 1rem;
      margin-top: 50px;
      padding: 0 15px;
      font-weight: 600;
    }

    .menu {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      list-style-type: none;
      margin-top: 10px;

      li {
        padding: 10px 15px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        color: var(--font-color);
        text-decoration: underline;
        text-decoration-style: dashed;
        text-decoration-color: var(--color-primary);
        text-underline-offset: 5px;
        align-self: flex-start;
        border-radius: 5px;
        transition: 0.3s all ease-in-out;

        span {
          margin-left: 5px;
          color: var(--font-color-light);
          text-decoration: none;
        }

        a {
          display: flex;
          align-items: center;
          color: var(--font-color);
        }

        .icon {
          margin-right: 10px;
        }

        &:hover {
          cursor: pointer;
          background: var(--color-secondary);
        }

        &:active {
          opacity: 0.7;
        }
      }
    }
  }

  .draggable-area {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    .area {
      display: flex;
      flex: 1;
      background: transparent;

      &.highlight {
        background: var(--drag-over-background);
      }
    }
  }
}
</style>
