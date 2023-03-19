import * as Comlink from "comlink";
const worker = new Worker(new URL("./worker.js", import.meta.url));
console.log("Initializing IndexedDB Storage drivers...");
const driver = Comlink.wrap(worker);

export default {
  getAllFiles: async () => {
    const files = await driver.getAllFiles();
    return files;
  },
  create: async ({ file }) => {
    await driver.createFile({ file });
  },
  move: async ({ id, parent_id }) => {
    await driver.moveFile({ id, parent_id });
  },
  update: async ({ id, contents }) => {
    await driver.updateFile({ id, contents });
  },
  rename: async ({ id, name }) => {
    await driver.renameFile({ id, name });
  },
  delete: async ({ id }) => {
    await driver.deleteFile({ id });
  },
  restore: async ({ filesObject }) => {
    await driver.restoreFiles({ filesObject });
  },
  addOpenFile: async ({ fileFootPrint }) => {
    await driver.addOpenFile({ fileFootPrint });
  },
  addActiveFile: async ({ fileFootPrint }) => {
    await driver.addActiveFile({ fileFootPrint });
  },
  removeOpenFile: async ({ id }) => {
    await driver.removeOpenFile({ id });
  },
  removeActiveFile: async ({ id }) => {
    await driver.removeActiveFile({ id });
  },
  clearOpenFiles: async () => {
    await driver.clearOpenFiles();
  },
  clearActiveFiles: async () => {
    await driver.clearActiveFiles();
  },
};
