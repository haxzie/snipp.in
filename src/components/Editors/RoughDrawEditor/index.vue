<template>
  <div ref="drawArea" class="draw-area" @mouseenter="activateShortcuts" @mouseleave="deactivateShortcuts">
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
import Mousetrap from "mousetrap";

import {
  adjustElementCoordinates,
  createElement,
  ELEMENTS,
  isWithinElement,
  generateSelectionBoundary,
  getCursorForPosition,
  resizeElement,
} from "./utils";

export default {
  components: {
    Toolbar,
  },
  props: {
    file: Object,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      version: 1,
      activeTool: "select",
      width: 2000,
      height: 2000,
      drawing: false,
      moving: false,
      resizing: false,
      selecting: false,
      rendering: false,
      selectionRect: null,
      temporaryElement: null,
      selectedEdge: null,
      elements: [],
      selectedElements: [],
      selectionBoundary: null,
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
        // pencil: {
        //   name: "Pencil Tool [V]",
        //   icon: "Edit2Icon",
        //   action: "draw",
        // },
        rectangle: {
          name: "Rectangle Tool [R]",
          icon: "SquareIcon",
          action: "draw",
        },
        ellipse: {
          name: "Ellipse Tool [E]",
          icon: "CircleIcon",
          action: "draw",
        },
        // text: {
        //   name: "Text Tool [T]",
        //   icon: "TypeIcon",
        //   action: "draw",
        // },
        line: {
          name: "Line Tool [L]",
          icon: "Edit3Icon",
          action: "draw",
        },
        // arrow: {
        //   name: "Arrow Tool",
        //   icon: "CornerUpRightIcon",
        //   action: "draw",
        // },
      },
      shortcuts: {},
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
        const edgeElement = this.getEdgeAtPosition(layerX, layerY);
        if (edgeElement) {
          this.resizing = true;
          this.selectedEdge = edgeElement;
        } else {
          const element = this.getElementAtPosition(layerX, layerY);
          if (element) {
            const offsetX = layerX - element.x1;
            const offsetY = layerY - element.y1;
            const selectionBoundary = generateSelectionBoundary(
              element.id,
              element.type,
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
      }
    },
    handleMouseMove($event) {
      // console.log(`mouse move`);

      const { layerX, layerY } = $event;

      if (this.moving) {
        $event.target.style.cursor = "move";
      } else if (this.resizing) {
      } else if (this.activeTool === "select") {
        const edgeElement = this.getEdgeAtPosition(layerX, layerY);
        if (edgeElement) {
          $event.target.style.cursor = getCursorForPosition(
            edgeElement.position
          );
        } else {
          $event.target.style.cursor = this.getElementAtPosition(layerX, layerY)
            ? "move"
            : "default";
        }
      } else {
        $event.target.style.cursor = "crosshair";
      }

      if (this.drawing) {
        if (this.temporaryElement) {
          const { x1, y1 } = this.temporaryElement;
          this.updateTemporaryElement(x1, y1, layerX, layerY);
        } else if (this.moving) {
          console.log(`No last element`);
        }
      } else if (
        this.resizing &&
        this.selectedEdge &&
        this.selectedElements &&
        this.selectedElements.length > 0
      ) {
        const { id, position } = this.selectedEdge;
        const selectedElement = this.elements.find((item) => item.id === id);
        const { x1, y1, x2, y2 } = resizeElement(
          layerX,
          layerY,
          position,
          selectedElement
        );

        const updatedElement = this.updateElement(
          selectedElement.id,
          selectedElement.type,
          x1,
          y1,
          x2,
          y2
        );
        const selectionBoundary = generateSelectionBoundary(
          updatedElement.id,
          updatedElement.type,
          x1,
          y1,
          x2,
          y2
        );
        this.selectedElements = [
          {
            ...selectedElement,
            ...updatedElement,
            // ...adjustElementCoordinates(updatedElement),
            selectionBoundary,
          },
        ];
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
            element.type,
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
            this.updateElement(index, element.type, x1, y1, x2, y2);
          }
        }
      } else if (this.resizing && this.selectedEdge) {
        const element = { ...this.elements[this.selectedEdge.id] };
        if (element) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(element);
          const updatedElement = this.updateElement(
            element.id,
            element.type,
            x1,
            y1,
            x2,
            y2
          );
          const selectionBoundary = generateSelectionBoundary(
            updatedElement.id,
            updatedElement.type,
            x1,
            y1,
            x2,
            y2
          );
          this.selectedElements = [
            {
              ...updatedElement,
              selectionBoundary,
            },
          ];
        }
      }

      this.drawing = false;
      this.moving = false;
      this.selecting = false;
      this.resizing = false;
      this.temporaryElement = null;
      this.selectedEdge = null;
      this.selectionRect = null;
    },
    getElementAtPosition(x, y) {
      return [...this.elements]
        .reverse()
        .find((element) => isWithinElement(x, y, element));
    },
    getEdgeAtPosition(x, y) {
      if (this.selectedElements && this.selectedElements.length > 0) {
        const edgeElements = this.selectedElements[0].selectionBoundary.edges;
        return edgeElements.find((edge) => isWithinElement(x, y, edge));
      } else {
        return false;
      }
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
          ({ selectionBoundary: { skeleton, edges } }) => {
            this.rough.draw(skeleton.element);
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
    deleteActiveShapes() {
      if (this.selectedElements && this.selectedElements.length > 0) {
        const activeElements = this.selectedElements.map(element => element.id).sort((a,b) => a-b)
        const elementsCopy = [...this.elements];
        activeElements.forEach(id => {
          elementsCopy[id] = null;
        });
        this.selectedElements = [];
        this.elements = elementsCopy.filter(item => item !== null).map((item, index) => ({...item, id: index}));
      }
    },
    activateShortcuts() {
      if (this.isActive) {
        this.unbindShortcuts();
        window.addEventListener("keydown", this.bindShortcuts);
      }
    },
    deactivateShortcuts() {
      if (this.isActive) {
        this.unbindShortcuts();
      }
    },
    bindShortcuts(e) {
      switch(e.key) {
        case "Delete":
          this.deleteActiveShapes();
          break;
        case "v":
          this.setActiveTool("select");
          break;
        case "r":
          this.setActiveTool("rectangle");
          break;
        case "e":
          this.setActiveTool("ellipse");
          break;
        case "l":
          this.setActiveTool("line");
          break;
        // case "t":
        //   this.setActiveTool("text");
        //   break;
        // case "p":
        //   this.setActiveTool("pencil");
        //   break;
      }
    },
    unbindShortcuts() {
      window.removeEventListener("keydown", this.bindShortcuts);
    },
  },
  watch: {
    elements() {
      this.draw();
      this.debouncedEmit();
    },
    selectionRect() {
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
    isActive: {
      immediate: true,
      handler(isActive) {
        if (isActive) {
          window.addEventListener("keydown", this.bindShortcuts);
        } else {
          this.unbindShortcuts();
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
