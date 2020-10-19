import { types } from "./mutations";
import VFile, { fileTypes } from "@/models/vFile.model";
import db from "@/utils/db";
import Dexie from "dexie";
import omit from "lodash/omit";

export default {
  /**
   * Loads all the files available in the localstorage into the store
   */
  loadFiles: async ({ commit, dispatch }) => {
    db.transaction("rw", db.openFiles, db.activeFiles, db.files, async () => {
      const openFiles = await db.openFiles.toArray();
      const activeFiles = await db.activeFiles.toArray();
      const files = await db.files.toArray();

      await dispatch(
        "Editor/reOpenFiles",
        { openFiles: openFiles, activeFiles: activeFiles },
        { root: true }
      );

      const filesObject = files.reduce((result, item) => {
        Object.assign(result, {
          [item.id]: new VFile({ ...item, editable: false }),
        });
        return result;
      }, {});
      console.log({ filesObject });
      commit(types.SET_FILES, filesObject);
    })
      .then(() => {
        console.log("transaction committed");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },

  /**
   * Creates a new file
   */
  createFile: async ({ state, commit, dispatch }, fileDetails) => {
    const details = fileDetails ? fileDetails : {};
    const file = new VFile({ ...details, type: fileTypes.FILE });
    commit(types.SET_FILES, {
      ...state.files,
      [file.id]: file,
    });
    db.files.add(file, ["id"]).catch((error) => {
      console.error(error);
    });
    return file;
    // dispatch("Editor/openFile", file.id, { root: true });
  },

  createDirectory: async ({ state, commit }, directoryDetails) => {
    const details = directoryDetails ? directoryDetails : {};
    const directory = new VFile({ ...details, type: fileTypes.DIRECTORY });
    commit(types.SET_FILES, {
      ...state.files,
      [directory.id]: directory,
    });
    db.files.add(directory, ["id"]).catch((error) => {
      console.error(error);
    });
  },

  updateFileContents: async ({ state, commit, dispatch }, { id, contents }) => {
    if (!id) return;

    commit(types.SET_FILES, {
      ...state.files,
      [id]: {
        ...state.files[id],
        contents,
      },
    });
    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("id")
        .equals(id)
        .modify({ contents });
      console.log(`file ${id} updated!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },
  renameFile: async ({ state, commit }, { id, name }) => {
    if (!id) return;

    commit(types.SET_FILES, {
      ...state.files,
      [id]: {
        ...state.files[id],
        name,
        editable: false,
      },
    });

    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("id")
        .equals(id)
        .modify({ name });
      console.log(`file ${id} renamed!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },

  openRenameMode: async ({ state, commit }, { id }) => {
    if (!id) return;

    commit(types.SET_FILES, {
      ...state.files,
      [id]: {
        ...state.files[id],
        editable: true,
      },
    });
  },

  deleteFile: async ({ state, commit, dispatch }, { id }) => {
    if (!id) return;

    await dispatch("Editor/closeFileFromAllEditor", { id }, { root: true });
    console.log("back to delete file");
    commit(types.SET_FILES, omit(state.files, id));
    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("id")
        .equals(id)
        .delete();
      console.log(`file ${id} deleted!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },
  deleteDirectory: async ({ state, commit, dispatch, rootGetters }, { id }) => {
    if (!id) return;

    const children = rootGetters["Editor/getChildren"](id);
    // delete all the children of the directory first
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.type === fileTypes.DIRECTORY) {
        await dispatch("deleteDirectory", { id: child.id });
      } else {
        await dispatch("deleteFile", { id: child.id });
      }
    }
    // then delete the directory
    commit(types.SET_FILES, omit(state.files, id));
    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("id")
        .equals(id)
        .delete();
      console.log(`file ${id} deleted!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },
};
