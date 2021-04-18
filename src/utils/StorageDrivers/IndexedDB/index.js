import StorageActions from "../storageActions";
const worker = new Worker("./DBWorker.js", { type: "module" });
import controllers from "./Controllers";
console.log("Initializing IndexedDB Storage drivers...")
export default {
  getAllFiles: async () => {
    const files = await controllers[StorageActions.GET_ALL_FILES]();
    return files;
  },
  create: async ({ file }) => {
    worker.postMessage({
      type: StorageActions.CREATE_FILE,
      payload: { file },
    });
  },
  move: async ({ id, parent_id }) => {
    worker.postMessage({
      type: StorageActions.MOVE_FILE,
      payload: { id, parent_id },
    });
  },
  update: async ({ id, contents }) => {
    worker.postMessage({
      type: StorageActions.UPDATE_FILE,
      payload: { id, contents },
    });
  },
  rename: async ({ id, name }) => {
    worker.postMessage({
      type: StorageActions.RENAME_FILE,
      payload: { id, name },
    });
  },
  delete: async ({ id }) => {
    worker.postMessage({
      type: StorageActions.DELETE_FILE,
      payload: { id },
    });
  },
  restore: async ({ filesObject }) => {
    worker.postMessage({
      type: StorageActions.RESTORE_FILES,
      payload: { filesObject },
    });
  },
};
