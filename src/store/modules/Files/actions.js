import { types } from "./mutations";
import VFile, { fileTypes } from "@/models/vFile.model";
import omit from "lodash/omit";
import Fuse from "fuse.js";
import fileStorage from "@/utils/StorageDrivers/IndexedDB"; // Switch storage drivers if needed

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
    let stock = state.files[id].stock
    if (stock.isStock) {
      stock["isStock"] = true
      // Remove unnecessary space, empty element
      const stockContent = contents.split("\n").map(content => {
        return content.trim()
      }).filter(content => {
        return content !== ""
      })

      stock["company"] = stockContent[1] || "";

      // Set buyHistory when //buy-start exist on stockContent
      const indexBuyHistoryStart = stockContent.indexOf("//buy-start")
      const indexBuyHistoryEnd = stockContent.indexOf("//buy-end")
      if (indexBuyHistoryStart !== -1 && indexBuyHistoryEnd !== -1) {
        stock["buyHistory"] = stockContent.slice(indexBuyHistoryStart + 1, indexBuyHistoryEnd).map(content => {
          // as-is : string "2020-01-10,51023,300"
          // to-be : array  ["2020-01-10", "51023", "300"]
          return content.split(",")
        })
      }

      // Set sellHistory when //sell-start exist on stockContent
      const indexSellHistoryStart = stockContent.indexOf("//sell-start")
      const indexSellHistoryEnd = stockContent.indexOf("//sell-end")
      if (indexSellHistoryStart !== -1 && indexSellHistoryEnd !== -1) {
        stock["sellHistory"] = stockContent.slice(indexSellHistoryStart + 1, indexSellHistoryEnd).map(content =>{
          return content.split(",")
        })
      }
      commit(types.SET_FILES, {
        ...state.files,
        [id]: {
          ...state.files[id],
          contents,
          stock,
        },
      });
    } else {
      commit(types.SET_FILES, {
        ...state.files,
        [id]: {
          ...state.files[id],
          contents,
        },
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
