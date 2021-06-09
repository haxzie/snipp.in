import { types } from "./mutations";
import VFile, { fileTypes } from "@/models/vFile.model";
import omit from "lodash/omit";
import Fuse from "fuse.js";
import fileStorage from "@/utils/StorageDrivers/IndexedDB";
import Vue from "vue"; // Switch storage drivers if needed
import {setCalculatedRadius, setDetailFromContents} from "@/utils/stock"
export default {
  /**
   * Loads all the files available in the localstorage into the store
   */
  loadFiles: async ({ commit, dispatch }) => {
    const { openFiles, activeFiles, files } = await fileStorage.getAllFiles();
    if (files) {
      const filesObject = files.reduce((result, item) => {
        Object.assign(result, {
          [item.id]: new VFile({ ...item, editable: false }),
        });
        return result;
      }, {});
      commit(types.SET_FILES, filesObject);
    }

    await dispatch(
        "Editor/reOpenFiles",
        { openFiles: openFiles, activeFiles: activeFiles },
        { root: true }
    );
  },
  /**
   * Creates a new file
   */
  createFile: async ({ state, commit, dispatch }, fileDetails) => {
    /**
     * Show the explorer panel while files are being created
     */
    try {
      dispatch("UI/showExplorerPanel", null, { root: true });
    } catch (error) {
      console.error("Unable to commit active panel to explorer");
      console.error(error);
    }

    const details = fileDetails ? fileDetails : {};
    const file = new VFile({ ...details, type: fileTypes.FILE });
    commit(types.SET_FILES, {
      ...state.files,
      [file.id]: file,
    });
    fileStorage.create({ file });
    return file;
    // dispatch("Editor/openFile", file.id, { root: true });
  },

  moveFile: async ({ state, commit, dispatch }, { id, directoryId }) => {
    if (!id) return;

    commit(types.SET_FILES, {
      ...state.files,
      [id]: {
        ...state.files[id],
        parent: directoryId,
        editable: false,
      },
    });
    fileStorage.move({ id, parent_id: directoryId });
  },

  createDirectory: async ({ state, commit, dispatch }, directoryDetails) => {
    /**
     * Show the explorer panel while directories are being created
     */
    try {
      dispatch("UI/showExplorerPanel", null, { root: true });
    } catch (error) {
      console.error("Unable to commit active panel to explorer");
      console.error(error);
    }

    const details = directoryDetails ? directoryDetails : {};
    const directory = new VFile({ ...details, type: fileTypes.DIRECTORY });
    commit(types.SET_FILES, {
      ...state.files,
      [directory.id]: directory,
    });
    fileStorage.create({ file: directory });
  },

  updateFileContents: async ({ state, commit, dispatch }, { id, contents }) => {
    if (!id) return;

    let stockFromDB = {}
    let stock = {
      "prices": [],
      "dates": [],
    }
    Object.assign(stockFromDB, state.files[id].stock)
    if(stockFromDB.isStock) {
      // Set histories, company name
      stock["isStock"] = true
      setDetailFromContents(stock, contents)
      // If stockSymbol from DB and Content are same, don't need to call api
      // If last element of dates is same today, don't need to call api
      if (stock.company !== stockFromDB.company || stockFromDB.dates[stockFromDB.dates.length - 1] !== new Date().toISOString().slice(0, 10)) {
        // Fetch stock information from external api
        await Vue.axios.get(`http://127.0.0.1:5000/api/stock/${stock.company}`)
            .then(response => {
              stock["dates"] = response.data.dates
              stock["prices"] = response.data.prices
            }).catch(error => {
              console.log("error on get stock data from api : ", error)
              stock["dates"] = []
              stock["prices"] = []
              stock["company"] = ""
            })
      }
      commit(types.SET_FILES, {
        ...state.files,
        [id]: {
          ...state.files[id],
          contents,
          stock
        }
      });
    } else {
      commit(types.SET_FILES, {
        ...state.files,
        [id]: {
          ...state.files[id],
          contents,
        }
      });
    }
    fileStorage.update({ id, contents, stock });
  },

  renameFile: async ({ state, commit }, { id, name }) => {
    if (!id) return;
    let stock = {}
    Object.assign(stock, state.files[id].stock)
    stock.isStock = name.endsWith("_stock")

    commit(types.SET_FILES, {
      ...state.files,
      [id]: {
        ...state.files[id],
        name,
        editable: false,
        stock: stock,
      },
    });
    fileStorage.rename({ id, name, stock });
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
    console.log("Inside delete file")
    await dispatch("Editor/closeFileFromAllEditor", { id }, { root: true });
    commit(types.SET_FILES, omit(state.files, id));
    fileStorage.delete({ id });
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
    await dispatch("deleteFile", { id });
  },
  searchFiles: async ({ state, commit }, { target: { value } }) => {
    const options = {
      includeScore: true,
      threshold: 0.2,
      keys: ["name"],
    };

    const fuse = new Fuse(Object.values(state.files), options);

    const filteredFiles = fuse.search(value).map(({ item }) => item);
    commit(types.SET_FILTERED_FILES, filteredFiles);
  },
  createExportPayload: async ({ state }) => {
    return {
      files: state.files,
    };
  },
  restoreFiles: async ({ state, commit }, { files }) => {
    const newFiles = Object.keys(files).reduce((result, fileId) => {
      return {
        ...result,
        [fileId]: new VFile(files[fileId]),
      };
    }, {});

    const newFilesList = {
      ...state.files,
      ...newFiles,
    };
    commit(types.SET_FILES, newFilesList);

    // update the db
    fileStorage.restore({ filesObject: newFilesList });

    return true;
  },
};
