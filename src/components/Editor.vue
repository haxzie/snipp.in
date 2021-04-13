<template>
  <div :class="['editor-area', getEditorMode]">
    <div v-if="getOpenFiles[getEditors.primary].length > 0" id="primary-editor" class="codemirror-instances">
      <TopBar
        :editor="getEditors.primary"
        :activeFile="getActiveFiles[getEditors.primary]"
        :openFiles="getOpenFiles[getEditors.primary]"
      />
      <div class="scroll-wrapper">
        <CodeEditor
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
      v-if="getOpenFiles[getEditors.secondary].length > 0 && getEditorMode === 'multiple'"
      id="secodary-editor"
      class="codemirror-instances"
    >
      <TopBar
        :editor="getEditors.secondary"
        :activeFile="getActiveFiles[getEditors.secondary]"
        :openFiles="getOpenFiles[getEditors.secondary]"
      />
      <CodeEditor
        v-if="getActiveFiles[getEditors.secondary]"
        :file="getActiveFiles[getEditors.secondary]"
      />
    </div>
    <div class="welcome-texts" v-if="!(getOpenFiles[getEditors.primary].length > 0 || getOpenFiles[getEditors.secondary].length > 0)">
      <h2 class="title">Welcome to Snipp.in</h2>
      <p class="description">Snipp.in is an in-browser snippet manager and editor.</p>

      <h3 class="menu-title">Get Started</h3>
      <ul class="menu">
        <li @click="createFile({ editable: true })"><FilePlusIcon class="icon" size="18"/> Create new file</li>
        <li @click="createDirectory({ editable: true })"><FolderPlusIcon class="icon" size="18"/> Create new Folder</li>
      </ul>

      <h3 class="menu-title">Get Involved</h3>
      <ul class="menu">
        <li><a href="https://github.com/haxzie/snipp.in" target="_blank" ref="noopener noreferrer"><GithubIcon class="icon" size="18"/> GitHub</a></li>
        <li><a href="https://github.com/haxzie/snipp.in/issues" target="_blank" ref="noopener noreferrer"><GitPullRequestIcon class="icon" size="18"/> Report a bug or an issue</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import TopBar from "@/components/TopBar";
import { mapActions, mapGetters } from "vuex";
import { EDITORS } from "@/store/modules/Editor/initialState";
import debounce from "lodash/debounce";
import { FilePlusIcon, FolderPlusIcon, GithubIcon, GitPullRequestIcon } from 'vue-feather-icons';

export default {
  components: {
    CodeEditor,
    TopBar,
    FilePlusIcon, 
    FolderPlusIcon,
    GithubIcon,
    GitPullRequestIcon
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
    ...mapActions("Files", ["updateFileContents", "createFile", "createDirectory"]),
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
  width: 100%;
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
      padding: 10px 0;
    }

    .description {
      opacity: 0.7;
    }

    .menu-title {
      font-size: 1rem;
      margin-top: 20px;
      padding: 0 15px;
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
        color: var(--color-primary);
        align-self: flex-start;
        border-radius: 5px;
        transition: 0.3s all ease-in-out;

        a {
          display: flex;
          align-items: center;
          color: var(--color-primary);
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
}
</style>
