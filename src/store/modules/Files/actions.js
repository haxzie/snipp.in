import { types } from "./mutations";
import VFile from "@/models/vFile.model";
import db from "@/utils/db";
import Dexie from "dexie";
import omit from "lodash/omit";

export default {
  /**
   * Loads all the files available in the localstorage into the store
   */
  loadFiles: async ({ commit, dispatch }) => {
    db.files.toArray((files) => {
      const filesObject = files.reduce((result, item) => {
        Object.assign(result, {
          [item.file_id]: new VFile({ ...item, editable: false }),
        });
        return result;
      }, {});
      commit(types.SET_FILES, filesObject);
    });
  },

  /**
   * Creates a new file
   */
  createFile: async ({ state, commit, dispatch }, fileDetails) => {
    const details = fileDetails ? fileDetails : {};
    const file = new VFile({ ...details });
    commit(types.SET_FILES, {
      ...state.files,
      [file.file_id]: file,
    });
    db.files.add(file);
    // dispatch("Editor/openFile", file.file_id, { root: true });
  },

  updateFileContents: async (
    { state, commit, dispatch },
    { file_id, contents }
  ) => {
    commit(types.SET_FILES, {
      ...state.files,
      [file_id]: {
        ...state.files[file_id],
        contents,
      },
    });
    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("file_id")
        .equals(file_id)
        .modify({ contents });
      console.log(`file ${file_id} updated!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },
  renameFile: async ({ state, commit }, { file_id, name }) => {
    commit(types.SET_FILES, {
      ...state.files,
      [file_id]: {
        ...state.files[file_id],
        name,
        editable: false
      },
    });

    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("file_id")
        .equals(file_id)
        .modify({ name });
      console.log(`file ${file_id} renamed!`);
    })
      .catch(Dexie.ModifyError, (error) => {
        // ModifyError did occur
        console.error(error.failures.length + " items failed to modify");
      })
      .catch((error) => {
        console.error("Generic error: " + error);
      });
  },
  deleteFile: async ({ state, commit, dispatch }, { file_id }) => {
    await dispatch('Editor/closeFileFromAllEditor', { file_id }, { root: true });
    console.log('back to delete file')
    commit(types.SET_FILES, omit(state.files, file_id));
    db.transaction("rw", db.files, async () => {
      // Mark bigfoots:
      await db.files
        .where("file_id")
        .equals(file_id)
        .delete();
      console.log(`file ${file_id} deleted!`);
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
