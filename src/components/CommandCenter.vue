<template>
  <div
    class="command-center"
    v-shortkey="['alt', 'k']"
    @shortkey="toggleCommandMenu"
  >
    <!-- <ZoomCenterTransition>
      <div class="toggle" v-if="!showMenu" @click="toggleCommandMenu">
        <CommandIcon />
      </div>
    </ZoomCenterTransition> -->

    <SlideYUpTransition>
      <div
        class="command-menu"
        v-if="showMenu"
        v-shortkey="['esc']"
        @shortkey="toggleCommandMenu"
        @click.self="toggleCommandMenu"
      >
        <div class="command-card">
          <form
            @submit.prevent="execute"
            :class="['header', { active: !!activeCommand }]"
          >
            <TerminalIcon class="left-icon" size="18" />
            <input
              ref="commandInput"
              id="command-input"
              type="text"
              placeholder="Type your command"
              v-model="command"
              name="command"
              size="2"
              :style="{
                flex: activeCommand ? '0' : '1',
              }"
              autocomplete="off"
              autofocus
            />
            <input
              v-show="activeCommand"
              ref="parameterInput"
              type="text"
              name="parameter"
              class="parameter-input"
              v-model="parameter"
              @keydown="(e) => clearIfEmpty(e)"
              autocomplete="off"
              :placeholder="activeCommand && activeCommand.parameter"
            />
            <button
              :class="[
                'arrow-button',
                { active: command && command.length > 1 },
              ]"
              type="submit"
            >
              <ArrowRightIcon size="18" />
            </button>
          </form>
          <div class="contents">
            <div
              v-for="(command, index) in filtererdCommands"
              :key="index"
              class="item"
            >
              <CommandIcon size="18" />
              <span class="command">{{ command.command }}</span>
              <span class="name"
                >{{ command.name
                }}<span v-if="command.parameter" class="parameter">
                  -> {{ command.parameter }}</span
                ></span
              >
              <span class="shortcut">{{
                command.shortcut ? command.shortcut.join(" + ") : ""
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </SlideYUpTransition>
  </div>
</template>

<script>
import { CommandIcon, TerminalIcon, ArrowRightIcon } from "vue-feather-icons";
import { ZoomCenterTransition, SlideYUpTransition } from "vue2-transitions";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    CommandIcon,
    ZoomCenterTransition,
    SlideYUpTransition,
    TerminalIcon,
    ArrowRightIcon,
  },
  data() {
    return {
      activeCommand: null,
      command: "",
      parameter: "",
      commands: [
        {
          command: "/k",
          name: "Toggle command center",
          shortcut: ["alt", "k"],
          parameter: null,
        },
        {
          command: "/n",
          name: "Create new file",
          shortcut: ["alt", "n"],
          parameter: "File Name",
        },
        {
          command: "/f",
          name: "Create new folder",
          shortcut: ["ctrl", "alt", "n"],
          parameter: "Folder Name",
        },
        {
          command: "/w",
          name: "Close active file",
          shortcut: ["alt", "w"],
          parameter: null,
        },
        {
          command: "/s",
          name: "Download active file",
          shortcut: [""],
          parameter: null,
        },
        {
          command: "/c",
          name: "Copy active file to clipboard",
          shortcut: [""],
          parameter: null,
        },
        {
          command: "/d",
          name: "Delete active file",
          shortcut: ["alt", "d"],
          parameter: null,
        },
        {
          command: "/r",
          name: "Rename active file",
          shortcut: ["alt", "r"],
          parameter: "New name",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("Editor", ["getActiveEditor", "getActiveFiles"]),
    ...mapGetters("UI", ["getShowCommandCenter"]),
    showMenu: {
      get() {
        return this.getShowCommandCenter;
      }, set(val) {
        this.setShowCommandCenter(val);
      }
    },
    filtererdCommands() {
      const regex = new RegExp(this.command ? this.command.trim() : "", "i");
      return this.commands
        .filter((item) => regex.test(item.command))
        .sort((a, b) =>
          a.command > b.command ? 1 : b.command > a.command ? -1 : 0
        )
        .sort((a, b) =>
          a.name && b.name
            ? a.name > b.name
              ? 1
              : b.name > a.name
              ? -1
              : 0
            : 0
        );
    },
  },
  methods: {
    ...mapActions("Files", [
      "createFile",
      "createDirectory",
      "deleteFile",
      "renameFile",
    ]),
    ...mapActions("Editor", ["closeFile", "openFile", "downloadFile"]),
    ...mapActions("UI", ["setShowCommandCenter"]),
    toggleCommandMenu() {
      this.showMenu = !this.showMenu;
      if (this.showMenu) {
        setTimeout(() => {
          this.$refs.commandInput.focus();
        }, 300);
      } else {
        this.command = null;
        this.activeCommand = null;
        this.parameter = null;
      }
    },
    async execute() {
      console.log("Executing...");
      // check if the commands are valid or not
      let commandToExecute = null;
      if (this.activeCommand) {
        commandToExecute = this.activeCommand;
      } else if (this.command && this.command.length > 0) {
        const findCommand = this.commands.find(
          (item) => item.command === this.command.trim()
        );
        if (findCommand) {
          commandToExecute = findCommand;
        } else {
          console.log("No command found");
          this.toggleCommandMenu();
        }
      } else {
        console.log("Not a valid command");
        this.toggleCommandMenu();
      }

      if (!commandToExecute) {
        this.toggleCommandMenu();
        return;
      }

      let activeFile = null;
      switch (commandToExecute.command) {
        case "/k":
          this.toggleCommandMenu();
          break;
        case "/n":
          if (this.parameter && this.parameter.length > 0) {
            const file = await this.createFile({ name: this.parameter });
            this.openFile(file);
          } else {
            this.createFile({ editable: true });
          }
          this.toggleCommandMenu();
          break;
        case "/f":
          if (this.parameter && this.parameter.length > 0) {
            this.createDirectory({ name: this.parameter });
          } else {
            this.createDirectory({ editable: true });
          }
          this.toggleCommandMenu();
          break;
        case "/w":
          activeFile = this.getActiveFiles[this.getActiveEditor];
          if (activeFile && activeFile.id) {
            this.closeFile({ editor: this.getActiveEditor, id: activeFile.id });
          }
          this.toggleCommandMenu();
          break;
        case "/d":
          activeFile = this.getActiveFiles[this.getActiveEditor];
          if (activeFile && activeFile.id) {
            this.deleteFile(activeFile);
          }
          this.toggleCommandMenu();
          break;
        case "/r":
          activeFile = this.getActiveFiles[this.getActiveEditor];
          if (this.parameter && this.parameter.length > 0 && activeFile) {
            this.renameFile({ id: activeFile.id, name: this.parameter });
          }
          this.toggleCommandMenu();
          break;
        case "/s":
          activeFile = this.getActiveFiles[this.getActiveEditor];
          if (activeFile) {
            this.downloadFile({ id: activeFile.id });
          }
          this.toggleCommandMenu();
          break;
        case "/c":
          activeFile = this.getActiveFiles[this.getActiveEditor];
          if (activeFile) {
            navigator.clipboard.writeText(activeFile.contents);
          }
          this.toggleCommandMenu();
          break;
        default:
          this.toggleCommandMenu();
      }
    },
    clearIfEmpty(e) {
      if (
        e &&
        e.keyCode === 8 &&
        !(this.parameter && this.parameter.length > 0)
      ) {
        this.activeCommand = null;
        this.$refs.commandInput.focus();
      }
    },
  },
  watch: {
    command(value) {
      for (let i = 0; i < this.commands.length; i++) {
        const commandItem = this.commands[i];
        // check if the command matches and the command requires a parameter
        if (value === `${commandItem.command} ` && commandItem.parameter) {
          // set the active command and ask user for the parameter
          this.activeCommand = commandItem;
          setTimeout(() => {
            this.$refs.parameterInput.focus();
          }, 100);
          console.log(commandItem);
          return;
        }
      }

      this.activeCommand = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: var(--color-secondary);
  background: var(--color-primary);
  transition: 0.1s all ease-in-out;

  &:hover {
    cursor: pointer;
    // transform: scale(1.05);
    box-shadow: 0 10px 15px var(--color-secondary);
  }

  &:active {
    opacity: 0.8;
  }
}

.command-center {
  z-index: 99;

  .command-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--popup-background);
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .command-card {
      display: flex;
      flex-direction: column;
      width: 90%;
      max-width: 500px;
      border-radius: 5px;
      background: var(--color-secondary);
      margin-top: 150px;

      .header {
        display: flex;
        align-items: center;
        background: var(--color-secondary-light);
        margin: 5px;
        padding: 0 15px 0 10px;

        .left-icon {
          margin-right: 5px;
        }

        input {
          flex: 1;
          background: transparent;
          border: 0;
          padding: 15px 5px;
          color: var(--font-color);
          min-width: 20px;
          outline: none;
        }

        #command-input {
          font-weight: bold;
          color: var(--color-primary);
        }

        .parameter-input {
          flex: 1;
          padding: 15px 0;
        }

        .arrow-button {
          border: 0;
          padding: 0;
          background: transparent;
          color: var(--font-color);
          opacity: 0.3;

          &.active {
            opacity: 1;
          }
        }
      }

      .contents {
        display: flex;
        flex-direction: column;

        .item {
          padding: 15px;
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          align-items: center;

          .command {
            padding: 0 10px;
            font-weight: bold;
            // color: var(--color-primary);
          }

          .name {
            opacity: 0.8;
            .parameter {
              margin-left: 5px;
              opacity: 0.3;
            }
          }

          .shortcut {
            opacity: 0.7;
          }
        }
      }
    }
  }
}
</style>
