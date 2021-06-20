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
      @select-tool="(tool) => setActiveTool(tool)"
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
  ELEMENTS,
  isWithinElement,
  generateSelectionBoundary,
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
      selecting: false,
      rendering: false,
      selectionRect: null,
      temporaryElement: null,
      elements: [],
      selectedElements: [],
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
          null,
          this.activeTool,
          layerX,
          layerY,
          layerX,
          layerY
        );
        this.temporaryElement = element;
      } else if (activeAction === "move") {
        const element = this.getElementAtPosition(layerX, layerY);
        if (element) {
          const offsetX = layerX - element.x1;
          const offsetY = layerY - element.y1;
          const selectionBoundary = generateSelectionBoundary(
            element.id,
            element.x1,
            element.y1,
            element.x2,
            element.y2
          );
          this.selectedElements = [
            {
              ...element,
              offsetX,
              offsetY,
              selectionBoundary,
            },
          ];
          this.moving = true;
        } else {
          const selectionRect = createElement(
            -1,
            ELEMENTS.selection,
            layerX,
            layerY,
            layerX,
            layerY
          );
          this.selectionRect = selectionRect;
          this.selecting = true;
          if (this.selectedElements && this.selectedElements.length > 0) {
            this.selectedElements = [];
          }
        }
      }
    },
    handleMouseMove($event) {
      // console.log(`mouse move`);

      const { layerX, layerY } = $event;

      if (this.moving) {
        $event.target.style.cursor = "move";
      } else if (this.activeTool === "select") {
        $event.target.style.cursor = this.getElementAtPosition(layerX, layerY)
          ? "move"
          : "default";
      } else {
        $event.target.style.cursor = "default";
      }

      if (this.drawing) {
        if (this.temporaryElement) {
          const { x1, y1 } = this.temporaryElement;
          this.updateTemporaryElement(x1, y1, layerX, layerY);
        } else if (this.moving) {
          console.log(`No last element`);
        }
      } else if (
        this.moving &&
        this.selectedElements &&
        this.selectedElements.length > 0
      ) {
        this.selectedElements = this.selectedElements.map((selectedElement) => {
          const {
            id,
            type,
            x1,
            y1,
            x2,
            y2,
            offsetX,
            offsetY,
          } = selectedElement;
          const width = x2 - x1;
          const height = y2 - y1;
          const newX1 = layerX - offsetX;
          const newY1 = layerY - offsetY;
          const element = this.updateElement(
            id,
            type,
            newX1,
            newY1,
            newX1 + width,
            newY1 + height
          );
          // update selection boundary for the element
          const selectionBoundary = generateSelectionBoundary(
            element.id,
            newX1,
            newY1,
            newX1 + width,
            newY1 + height
          );
          return {
            ...element,
            offsetX,
            offsetY,
            selectionBoundary,
          };
        });
      } else if (this.selecting && this.selectionRect) {
        const { id, type, x1, y1 } = this.selectionRect;
        this.updateSelectionRect(id, type, x1, y1, layerX, layerY);
      }
    },
    handleMouseUp($event) {
      if (this.drawing && this.temporaryElement) {
        const index = this.elements.length;
        const element = this.temporaryElement;
        if (element) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(element);
          if (x2 - x1 > 1 || y2 - y1 > 1) {
            this.elements = [
              ...this.elements,
              { ...element, x1, y1, x2, y2, id: index },
            ];
          }
        }
      }

      this.drawing = false;
      this.moving = false;
      this.selecting = false;
      this.temporaryElement = null;
      // this.selectedElement = null;
      this.selectionRect = null;
    },
    getElementAtPosition(x, y) {
      return [...this.elements]
        .reverse()
        .find((element) => isWithinElement(x, y, element));
    },
    updateTemporaryElement(x1, y1, x2, y2) {
      this.temporaryElement = createElement(
        null,
        this.temporaryElement.type,
        x1,
        y1,
        x2,
        y2
      );
    },
    updateElement(id, type, x1, y1, x2, y2) {
      const updatedElement = createElement(id, type, x1, y1, x2, y2);
      const copyElements = [...this.elements];
      copyElements[id] = updatedElement;
      this.elements = copyElements;
      return updatedElement;
    },
    updateSelectionRect(id, type, x1, y1, x2, y2) {
      const updatedElement = createElement(id, type, x1, y1, x2, y2);
      this.selectionRect = updatedElement;
    },
    draw() {
      if (!this.rendering) {
        this.rough.ctx.clearRect(
          0,
          0,
          this.rough.canvas.width,
          this.rough.canvas.height
        );
      } else {
        // return if there is a rendering in progress
        return;
      }
      this.rendering = true;

      if (this.elements && this.elements.length > 0) {
        for (let i = 0; i < this.elements.length; i++) {
          const item = this.elements[i];
          this.rough.draw(item.element);
        }
      }
      // draw the selection rectangle
      if (this.temporaryElement) {
        this.rough.draw(this.temporaryElement.element);
      }

      // draw element selection boundaries
      if (this.selectedElements && this.selectedElements.length > 0) {
        this.selectedElements.forEach(
          ({ selectionBoundary: { boundingRect, edges } }) => {
            this.rough.draw(boundingRect.element);
            edges.forEach((edge) => this.rough.draw(edge.element));
          }
        );
      }

      // draw the selection rectangle
      if (this.selectionRect) {
        this.rough.draw(this.selectionRect.element);
      }

      this.$nextTick().then(() => {
        this.rendering = false;
      });
      // this.debouncedEmit();
    },
    reset() {
      this.drawing = false;
      this.moving = false;
      this.selecting = false;
      this.rendering = false;
      this.selectionRect = null;
      this.temporaryElement = null;
      this.elements = [];
      this.selectedElements = [];
    },
    dispatchAction(action) {
      switch (action) {
        case "clear":
          this.reset();
          return;
      }
    },
    setActiveTool(tool) {
      this.activeTool = tool;
      this.selectedElements = [];
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
    selectionRect(selection) {
      this.draw();
    },
    selectedElements() {
      this.draw();
    },
    temporaryElement(element) {
      if (element) {
        this.draw();
      }
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
    // this.$on("rerender", this.draw);
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
