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
const generator = rough.generator();

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
      activeAction: "move",
      width: 5000,
      height: 5000,
      drawing: false,
      elements: [],
      tools: {
        select: {
          name: "Select Tool",
          icon: "MousePointerIcon",
          action: "move",
        },
        move: {
          name: "Move Tool",
          icon: "MoveIcon",
          action: "pan",
        },
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
      if (this.tools[this.activeTool].action === "draw") {
        this.drawing = true;
        const element = this.createElement(layerX, layerY, layerX, layerY);
        this.elements = [...this.elements, element];
      } else if ((this.tools[this.activeTool].action = "move")) {
        const element = this.getElementAtPosition(layerX, layerY);
      }
    },
    handleMouseMove($event) {
      if (this.tools[this.activeTool].action === "draw") {
        if (!this.drawing) return;
        const { layerX, layerY } = $event;
        const lastElementIndex = this.elements.length - 1;
        const lastElement = this.elements[lastElementIndex];
        if (lastElement) {
          const { x1, y1 } = lastElement;
          const element = this.createElement(x1, y1, layerX, layerY);
          const copyElements = [...this.elements];
          copyElements[lastElementIndex] = element;
          this.elements = copyElements;
        } else {
          console.log(`No last element`);
        }
      } else if (this.tools[this.activeTool].action === "move") {
      }
    },
    handleMouseUp($event) {
      this.drawing = false;
      this.draw();
    },
    createElement(x1, y1, x2, y2) {
      switch (this.activeTool) {
        case "line":
          return {
            x1,
            y1,
            x2,
            y2,
            type: "line",
            element: generator.line(x1, y1, x2, y2),
          };
        case "rectangle":
          return {
            x1,
            y1,
            x2,
            y2,
            type: "rectangle",
            element: generator.rectangle(x1, y1, x2 - x1, y2 - y1),
          };
        case "ellipse":
          return {
            x1,
            y1,
            x2,
            y2,
            type: "ellipse",
            element: generator.ellipse(x1, y1, (x2 - x1) * 2, (y2 - y1) * 2),
          };
        default:
          return {
            x1,
            y1,
            x2,
            y2,
            type: "line",
            element: generator.line(x1, y1, x2, y2),
          };
      }
    },
    getElementAtPosition(x, y) {
        return this.elements.find(element => isWithinElement(x, y, element));
    },
    draw() {
      this.context.clearRect(0, 0, this.width, this.height);
      if (this.elements && this.elements.length > 0) {
        this.elements.map((item) => this.roughCanvas.draw(item.element));
      }
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
    this.roughCanvas = rough.canvas(this.canvas);
    // window.requestAnimationFrame(this.draw)
    this.draw();
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
