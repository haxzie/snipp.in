<template>
  <div class="toolbar-wrapper">
    <div
      class="toolbar"
      :style="{
        gridTemplateColumns: `repeat(1, 35px)`,
      }"
    >
      <div
        v-for="tool in Object.keys(tools)"
        :key="tool"
        :class="['toolbar-icon', { active: tool === activeTool }]"
        @click="selectTool(tool)"
      >
        <component :is="tools[tool].icon" class="icon" size="18" />
        <span class="tool-label">{{ tools[tool].name }}</span>
      </div>
    </div>
    <div
      class="toolbar"
      :style="{
        gridTemplateColumns: `repeat(${Object.keys(actions).length}, 35px)`,
      }"
    >
      <div
        v-for="tool in Object.keys(actions)"
        :key="tool"
        :class="['toolbar-icon']"
        @click="selectAction(tool)"
      >
        <component :is="actions[tool].icon" class="icon" size="18" />
        <span class="tool-label">{{ actions[tool].name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MousePointerIcon,
  CircleIcon,
  SquareIcon,
  CornerUpRightIcon,
  Edit2Icon,
  Edit3Icon,
  TypeIcon,
  MoveIcon,
  Trash2Icon,
} from "vue-feather-icons";
import FreehandIcon from "@/components/Icons/FreehandIcon";
import LineIcon from "@/components/Icons/LineIcon";

export default {
  components: {
    MousePointerIcon,
    CircleIcon,
    SquareIcon,
    CornerUpRightIcon,
    Edit2Icon,
    Edit3Icon,
    TypeIcon,
    MoveIcon,
    Trash2Icon,
    FreehandIcon,
    LineIcon
  },
  props: {
    activeTool: {
      type: String,
      default: "select",
    },
    tools: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      actions: {
        clear: {
          name: "Clear Screen",
          icon: "Trash2Icon",
        },
      },
    };
  },
  methods: {
    selectTool(tool) {
      this.$emit("select-tool", tool);
    },
    selectAction(action) {
      this.$emit("select-action", action);
    },
  },
};
</script>

<style lang="scss" scoped>
.toolbar-wrapper {
  display: flex;
  //   align-items: center;
  flex-direction: column;
  background: var(--color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0 5px 5px 0;
  position: absolute;
  z-index: 9;
  //   margin-left: auto;
  //   margin-right: auto;
  //   left: 0;
  //   right: 0;
  text-align: center;
  top: 20px;
  left: 0;
  min-width: 0;
  min-height: 0;

  .toolbar {
    display: grid;
    column-gap: 5px;
    padding: 5px;
    .toolbar-icon {
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      opacity: 0.7;
      position: relative;

      .tool-label {
        background: var(--color-secondary);
        word-wrap: none;
        white-space: nowrap;
        position: absolute;
        left: 50px;
        padding: 5px 10px;
        border-radius: 5px;
        transform: translateX(-20px);
        opacity: 0;
        pointer-events: none;
        transition: 0.3s all ease-in-out;
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
        opacity: 1;
        .tool-label {
          opacity: 1;
          transform: translateX(0);
        }
      }

      &.active {
        color: var(--color-primary);
        opacity: 1;
        background: var(--color-secondary-light);
      }
    }
  }
}
</style>
