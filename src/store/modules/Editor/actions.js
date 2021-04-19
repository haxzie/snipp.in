import { types } from "./mutations";
import OpenFileFootprint from "@/models/openFileFootprint.model";
import { EDITORS } from "./initialState";
import { saveAs } from "file-saver";
import fileStorage from "@/utils/StorageDrivers/IndexedDB"; // Switch storage drivers if needed

export default {
  /**
   * Opens a file in active editor or primary editor
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.id id of the file to be opened
   */
  openFile: async ({ state, commit, dispatch }, { id }) => {
    // check if the file is already opened in the active editor
    if (!state.openFiles[state.activeEditor].includes(id)) {
      commit(types.SET_OPEN_FILES, {
        ...state.openFiles,
        [state.activeEditor]: [...state.openFiles[state.activeEditor], id],
      });
      let newOpenFile = new OpenFileFootprint({
        editor: state.activeEditor,
        id: id,
      });
      fileStorage.addOpenFile({ fileFootPrint: newOpenFile });
    }
    // set as the active file in the editor
    // commit(types.SET_ACTIVE_FILES, {
    //   ...state.activeFiles,
    //   [state.activeEditor]: id,
    // });

    // calling dispatch because activeFileId needs to be saved in indexedDB
    await dispatch("setActiveFile", {
      editor: state.activeEditor,
      id: id,
    });
  },

  /**
   * Opens a list of files in primary editor
   * @param {Object} context 
   * @param {Object} payload
   * @param {Array<Object>} payload.openFiles
   * @param {Array<Object>} payload.activeFiles
   */
  reOpenFiles: async ({ state, commit }, { openFiles, activeFiles }) => {
    // check if the file is already opened in the active editor
    // if (!state.openFiles[state.activeEditor].includes(id)) {
    let primaryFiles = [],
      secondaryFiles = [];
    openFiles.forEach((file) => {
      if (file.editor === EDITORS.primary) {
        primaryFiles.push(file.id);
      } else {
        secondaryFiles.push(file.id);
      }
    });

    commit(types.SET_OPEN_FILES, {
      ...state.openFiles,
      [EDITORS.primary]: [...state.openFiles[EDITORS.primary], ...primaryFiles],
      [EDITORS.secondary]: [
        ...state.openFiles[EDITORS.secondary],
        ...secondaryFiles,
      ],
    });
    // }
    // set as the active file in the editor

    let primaryActiveFile, secondaryActiveFile;
    activeFiles.forEach((file) => {
      if (file.editor === EDITORS.primary) {
        primaryActiveFile = file.id;
      } else {
        secondaryActiveFile = file.id;
      }
    });
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [EDITORS.primary]: primaryActiveFile,
      [EDITORS.secondary]: secondaryActiveFile,
    });
  },

  /**
   * Close a file from an editor
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.editor Id/name of the editor
   * @param {String} payload.id id of the file to be closed
   */
  closeFile: async ({ state, commit, dispatch }, { editor, id }) => {
    // check if the file is currently opened
    if (state.activeFiles[editor] === id) {
      //set the first file in the editor's open files as the active file
      await dispatch("setActiveFile", {
        editor,
        id: state.openFiles[editor].filter((_id) => _id !== id)[0] || null,
      });
    }

    // remove the file from the open editors
    commit(types.SET_OPEN_FILES, {
      ...state.openFiles,
      // check if there are any open files in the editor
      [editor]: state.openFiles[editor]
        ? state.openFiles[editor].filter((_id) => _id !== id)
        : [],
    });
    // debugger
    await fileStorage.removeOpenFile({ id });
    console.log(`footprints of ${id} deleted!`);
    if (state.openFiles[editor].length === 0) {
      await fileStorage.clearActiveFiles();
      console.log(`activeFiles emptied.`);
    }
  },

  /**
   * Close a file from all the available editor
   * used when a file is being deleted
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.id id of the file to be closed
   */
  closeFileFromAllEditor: async ({ state, dispatch }, { id }) => {
    // remove the file from the open files list of all editors
    const editors = Object.keys(state.openFiles);
    for (let i = 0; i < editors.length; i++) {
      if (state.openFiles[editors[i]].includes(id)) {
        await dispatch("closeFile", { editor: editors[i], id });
      }
    }
  },

  /**
   * Set a file as an active file in an editor
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.editor name of the editor
   * @param {String} payload.id id of the file to set active
   */
  setActiveFile: async ({ state, commit }, { editor, id }) => {
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [editor]: id,
    });

    if (id && editor) {
      let newActiveFile = new OpenFileFootprint({
        editor: state.activeEditor,
        id: id,
      });

      // replaces the activeFile stored in IndexedDB with the new active file
      fileStorage.addActiveFile({ fileFootPrint: newActiveFile });
    }
  },

  /**
   * Downloads a file
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.id File id 
   */
  downloadFile: async ({ rootGetters }, { id }) => {
    const file = rootGetters['Files/getFile'](id);
    const fileBlob = new Blob([file.contents], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(fileBlob, file.name);
  }
};
