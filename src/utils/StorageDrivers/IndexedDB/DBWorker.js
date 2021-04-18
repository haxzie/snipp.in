import controllers from "./Controllers";
import StorageActions from "../storageActions";

self.addEventListener("message", async (e) => {
  if (!e.data) return;
  const { type, payload } = e.data;
  const actions = Object.values(StorageActions);
  if (!(type && actions.includes(type))) {
    console.log({ actions })
    throw new Error(`Invalid storage action, ${type}`);
  }

  // execute the controller action
  try {
    console.info(`Worker Action: ${type}`)
    const result = await controllers[type](payload);
    // self.postMessage(result)
  } catch (error) {
    console.error(error);
    return null;
  }

  // switch (type) {
  //   case dbActions.CREATE_FILE:
  //     createFile(payload);
  //     break;
  //   case dbActions.UPDATE_FILE:
  //     updateFile(payload);
  //     break;
  //   case dbActions.RENAME_FILE:
  //     renameFile(payload);
  //     break;
  //   case dbActions.DELETE_FILE:
  //     deleteFile(payload);
  //     break;
  //   case dbActions.MOVE_FILE:
  //     moveFile(payload);
  //     break;
  //   case dbActions.RESTORE_FILES:
  //     restoreFiles(payload);
  //     break;
  //   default:
  //     console.log("Invalid file action");
  //     break;
  // }
  // return false;
});
