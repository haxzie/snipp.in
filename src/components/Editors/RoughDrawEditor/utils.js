import rough from "roughjs/bundled/rough.esm.js";
const generator = rough.generator();

// root of [(x1-x2)^2 + (y1, y2)^2]
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const ELEMENTS = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
};

export function createElement(id, element, x1, y1, x2, y2) {
  switch (element) {
    case ELEMENTS.line:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.line,
        element: generator.line(x1, y1, x2, y2, {
          roughness: 1,
          preserveVertices: true,
        }),
      };
    case ELEMENTS.rectangle:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.rectangle,
        element: generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
          roughness: 1,
          preserveVertices: true,
        }),
      };
    case ELEMENTS.ellipse:
      const center = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.ellipse,
        element: generator.ellipse(center.x, center.y, x2 - x1, y2 - y1, {
          roughness: 1,
          preserveVertices: true,
        }),
      };
    default:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type: ELEMENTS.line,
        element: generator.line(x1, y1, x2, y2, { roughness: 1, preserveVertices: true }),
      };
  }
}

export function isWithinElement(x, y, element) {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENTS.rectangle: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    case ELEMENTS.line: {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x, y };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      return Math.abs(offset) < 1;
    }
    case ELEMENTS.ellipse: {
      console.log({ element })
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      const { h, k } = { h: (minX + maxX) / 2, k: (minY + maxY) / 2 };
      const a = (maxX - minX) / 2;
      const b = (maxY - minY) / 2;
      return Math.pow(x - h, 2) / Math.pow(a, 2) +
        Math.pow(y - k, 2) / Math.pow(b, 2) <=
        1
        ? true
        : false;
    }
  }
}

export function adjustElementCoordinates(element) {
  const { type, x1, y1, x2, y2 } = element;
  switch (type) {
    case ELEMENTS.rectangle: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
    case ELEMENTS.line: {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
    case ELEMENTS.ellipse: {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    }
  }
}
