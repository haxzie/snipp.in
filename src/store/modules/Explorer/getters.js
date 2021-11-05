import VFile, { fileTypes } from "@/models/vFile.model";
const JSZip = require("jszip")

export default {
  getDirectoryTree: (state, getters, rootState, rootGetters) => {
    const files = rootGetters["Files/getFiles"];
    return files;
    // sort the files,
    // package them into directories
  },

  getChildren: (state, getters, rootState, rootGetters) => (parent_id) => {
    const files = rootGetters["Files/getFiles"];
    return files.filter(item => item.parent === parent_id);
  },

  getDirectoryBlob: (state, getters, rootState, rootGetters) => async ({ id, name }) => {
    const children = rootGetters["Explorer/getChildren"](id);
    const zip = new JSZip();
    const folder = zip.folder(name);
    let promises = [];

    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      if (child.type === fileTypes.DIRECTORY) {
        let waitingFolder = await rootGetters["Explorer/getDirectoryBlob"]({ id: child.id, name: child.name });
        waitingFolder = waitingFolder.files;

        for (const file in waitingFolder) {
          if (waitingFolder[file].dir == false) {
            const currentFile = waitingFolder[file];
            const contents = new Promise((resolve, reject) => {
              resolve(currentFile._data);
            });
            promises.push({ name: currentFile.name, contents });
          }
        }
      } else {
        folder.file(child.name, child.contents);
      }
    }

    const files = await Promise.all(promises);
    for (let j = 0; j < files.length; j += 1) {
      folder.file(files[j].name, files[j].contents);
    }

    return folder;
  },
}