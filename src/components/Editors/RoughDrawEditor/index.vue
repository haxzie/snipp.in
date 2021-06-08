<template>
  <div ref="drawArea" class="draw-area">
    <canvas
      id="drawCanvas"
      ref="roughCanvas"
      :width="width"
      :height="height"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    />
    <Toolbar
      :activeTool="activeTool"
      :tools="tools"
      @select-tool="(tool) => (activeTool = tool)"
      @select-action="(action) => dispatchAction(action)"
    />
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import Toolbar from "./Toolbar.vue";
import rough from "roughjs/bundled/rough.esm.js";
import {
  adjustElementCoordinates,
  createElement,
  isWithinElement,
} from "./utils";

export default {
  components: {
    Toolbar,
  },
  props: {
    file: Object,
  },
  data() {
    return {
      version: 1,
      activeTool: "select",
      width: 2000,
      height: 2000,
      drawing: false,
      moving: false,
      rendering: false,
      selectedElement: null,
      elements: [],
      tools: {
        select: {
          name: "Select Tool",
          icon: "MousePointerIcon",
          action: "move",
        },
        // move: {
        //   name: "Move Tool",
        //   icon: "MoveIcon",
        //   action: "pan",
        // },
        pencil: {
          name: "Pencil Tool",
          icon: "Edit2Icon",
          action: "draw",
        },
        rectangle: {
          name: "Rectangle Tool",
          icon: "SquareIcon",
          action: "draw",
        },
        ellipse: {
          name: "Circle Tool",
          icon: "CircleIcon",
          action: "draw",
        },
        text: {
          name: "Text Tool",
          icon: "TypeIcon",
          action: "draw",
        },
        line: {
          name: "Line Tool",
          icon: "Edit3Icon",
          action: "draw",
        },
        arrow: {
          name: "Arrow Tool",
          icon: "CornerUpRightIcon",
          action: "draw",
        },
      },
    };
  },
  methods: {
    handleMouseDown($event) {
      const { layerX, layerY } = $event;
      const activeAction = this.tools[this.activeTool].action;
      if (activeAction === "draw") {
        this.drawing = true;
        const element = createElement(
          this.elements.length - 1,
          this.activeTool,
          layerX,
          layerY,
          layerX,
          layerY
        );
        this.elements = [...this.elements, element];
      } else if (activeAction === "move") {
        const element = this.getElementAtPosition(layerX, layerY);
        if (element) {
          const offsetX = layerX - element.x1;
          const offsetY = layerY - element.y1;
          this.selectedElement = { ...element, offsetX, offsetY };
          this.moving = true;
        }
      }
    },
    handleMouseMove($event) {
      const { layerX, layerY } = $event;

      if (this.moving) {
        $event.target.style.cursor = "move"
      } else if (this.activeTool === "select") {
        $event.target.style.cursor = this.getElementAtPosition(layerX, layerY)
          ? "move"
          : "default";
      } else {
        $event.target.style.cursor = "default"
      }

      if (this.drawing) {
        const lastElement = this.elements.slice(-1)[0];
        if (lastElement) {
          const { x1, y1 } = lastElement;
          this.updateElement(
            this.elements.length - 1,
            this.activeTool,
            x1,
            y1,
            layerX,
            layerY
          );
        } else if (this.moving) {
          console.log(`No last element`);
        }
      } else if (this.moving && this.selectedElement) {
        const {
          id,
          type,
          x1,
          y1,
          x2,
          y2,
          offsetX,
          offsetY,
        } = this.selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = layerX - offsetX;
        const newY1 = layerY - offsetY;
        this.updateElement(
          id,
          type,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height
        );
      }
    },
    handleMouseUp($event) {
      if (this.drawing) {
        const index = this.elements.length - 1;
        const element = this.elements[index];
        if (element) {
          const { id, type } = element;
          const { x1, y1, x2, y2 } = adjustElementCoordinates(element);
          this.updateElement(id, type, x1, y1, x2, y2);
        }
      }

      this.drawing = false;
      this.moving = false;
      this.selectedElement = null;
      this.draw();
    },
    getElementAtPosition(x, y) {
      return [...this.elements]
        .reverse()
        .find((element) => isWithinElement(x, y, element));
    },
    updateElement(id, type, x1, y1, x2, y2) {
      const updatedElement = createElement(id, type, x1, y1, x2, y2);
      const copyElements = [...this.elements];
      copyElements[id] = updatedElement;
      this.elements = copyElements;
    },
    draw() {
      if (!this.rendering) {
        this.rough.ctx.clearRect(
          0,
          0,
          this.rough.canvas.width,
          this.rough.canvas.height
        );
      }
      this.rendering = true;

      if (this.elements && this.elements.length > 0) {
        for (let i = 0; i < this.elements.length; i++) {
          const item = this.elements[i];
          this.rough.draw(item.element);
        }
      }
      this.$nextTick().then(() => {
        this.rendering = false;
      });
      this.debouncedEmit();
    },
    dispatchAction(action) {
      switch (action) {
        case "clear":
          this.elements = [];
          return;
      }
    },
    emitChanges() {
      this.$emit("contentChanged", {
        version: this.version,
        elements: this.elements,
      });
    },
  },
  watch: {
    elements() {
      this.draw();
      this.debouncedEmit();
    },

    file: {
      immediate: true,
      handler(current, previous) {
        if (previous && current.id === previous.id) return;

        if (this.file && this.file.contents) {
          try {
            const { version, elements } = this.file.contents;
            if (version && elements && elements.length > 0) {
              this.version = version;
              this.elements = elements;
            }
          } catch (error) {
            console.log(`Invalid draw file`);
            this.elements = [];
          }
        }
      },
    },
  },
  mounted() {
    this.canvas = this.$refs.roughCanvas;
    this.context = this.canvas.getContext("2d");
    this.rough = rough.canvas(this.canvas, { seed: 0 });
    this.$on("rerender", this.draw);
    // window.requestAnimationFrame(this.draw)
  },
  created() {
    this.debouncedEmit = debounce(this.emitChanges, 500);
  },
};
</script>

<style lang="scss" scoped>
.draw-area {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  background: var(--color-secondary-light);

  #drawCanvas {
    background: white;
  }
}
</style>
