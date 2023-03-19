import { types } from "./mutations";
import OpenFileFootprint from "@/models/openFileFootprint.model";
import { EDITORS } from "./initialState";
import { saveAs } from "file-saver";
import fileStorage from "@/utils/StorageDrivers/IndexedDB"; // Switch storage drivers if needed
import { wrap } from "comlink";
const worker = new Worker(new URL("./fileLoader.worker.js", import.meta.url));
const fileLoader = wrap(worker);

export default {
  /**
   * Opens a file in active editor or primary editor
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.id id of the file to be opened
   */
  openFile: async ({ state, commit, dispatch }, { id, editor }) => {
    editor = editor || state.activeEditor;
    // check if the file is already opened in the active editor
    if (!state.openFiles[editor].includes(id)) {
      commit(types.SET_OPEN_FILES, {
        ...state.openFiles,
        [editor]: [...state.openFiles[editor], id],
      });
      let newOpenFile = new OpenFileFootprint({
        editor,
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
      editor: editor,
      id: id,
    });
  },

  /**
   * Opens a local file from a file object being passed
   * @param {Object} file 
   * @param {String} editor 
   */
  openLocalFile: async ({ commit, state, dispatch }, { file, editor }) => {
    editor = editor || state.activeEditor;
    const fileData = await fileLoader.loadLocalFile(file);
    if (fileData) {
      const createdFile = await dispatch("Files/createFile", {
        name: file.name,
        contents: fileData,
        editable: false
      }, { root: true });
      dispatch("openFile", { id: createdFile.id, editor: editor });
    }
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
      // if one of the editors files is empty, always move things to primary editor
      // and clear out secondarye editor by default
      dispatch("swapEditorFiles");
    }
  },

  swapEditorFiles: async ({ state, commit, dispatch }) => {
    // if the primary editor is empty, move files from the secondary editor to primary
    if (state.openFiles[EDITORS.primary].length === 0) {
      await fileStorage.clearActiveFiles();
      await fileStorage.clearOpenFiles();
      if (state.openFiles[EDITORS.secondary].length > 0) {
        const secondaryOpenFiles = state.openFiles[EDITORS.secondary];
        const secondayActiveFile = state.activeFiles[EDITORS.secondary];
        // swap the editor files
        commit(types.SET_OPEN_FILES, {
          [EDITORS.primary]: secondaryOpenFiles,
          [EDITORS.secondary]: [],
        });
        // swap active files
        commit(types.SET_ACTIVE_FILES, {
          [EDITORS.primary]: secondayActiveFile,
          [EDITORS.secondary]: null,
        });
        dispatch("setActiveEditor", { editors: EDITORS.primary });
        // save the active file footprint
        let newActiveFile = new OpenFileFootprint({
          editor: EDITORS.primary,
          id: secondayActiveFile,
        });
        // replaces the activeFile stored in IndexedDB with the new active file
        fileStorage.addActiveFile({ fileFootPrint: newActiveFile });
        // update footprints
        secondaryOpenFiles.forEach((fileId) => {
          let newOpenFile = new OpenFileFootprint({
            editor: EDITORS.primary,
            id: fileId,
          });
          fileStorage.addOpenFile({ fileFootPrint: newOpenFile });
        });
      }
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
  setActiveFile: async ({ state, commit, dispatch }, { editor, id }) => {
    commit(types.SET_ACTIVE_FILES, {
      ...state.activeFiles,
      [editor]: id,
    });

    dispatch("setActiveEditor", { editor });

    if (id && editor) {
      let newActiveFile = new OpenFileFootprint({
        editor: editor,
        id: id,
      });

      // replaces the activeFile stored in IndexedDB with the new active file
      fileStorage.addActiveFile({ fileFootPrint: newActiveFile });
    }
  },

  /**
   * Sets the active Editor
   */
  setActiveEditor: async ({ commit }, { editor }) => {
    commit(types.SET_ACTIVE_EDITOR, editor);
  },

  /**
   * Downloads a file
   * @param {Object} context
   * @param {Object} payload
   * @param {String} payload.id File id
   */
  downloadFile: async ({ rootGetters }, { id }) => {
    const file = rootGetters["Files/getFile"](id);
    const fileBlob = new Blob([file.contents], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(fileBlob, file.name);
  },

  /**
   * Sets the id of the dragging directory drop id
   */
  setDraggingId: async ({ commit }, { id }) => {
    commit(types.SET_DRAGGING_ID, id);
  },

  /**
   * sets Id of the file being dragged
   */
  setDraggingFileId: async ({ commit }, { id }) => {
    commit(types.SET_DRAGGING_FILE_ID, id);
  },
};
