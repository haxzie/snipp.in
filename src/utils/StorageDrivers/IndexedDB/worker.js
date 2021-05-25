import db from "@/utils/db";
import * as Comlink from "comlink";

/**
 * The driver object to expose all the necessary actions
 */
const Driver = {
  /**
   * @returns { openFiles, activeFiles, files }
   */
  async getAllFiles() {
    try {
      const result = await db.transaction(
        "r",
        db.openFiles,
        db.activeFiles,
        db.files,
        async () => {
          const openFiles = await db.openFiles.toArray();
          const activeFiles = await db.activeFiles.toArray();
          const files = await db.files.toArray();
          return { openFiles, activeFiles, files };
        }
      );
      return result;
    } catch (error) {
      console.error(error);
      return { openFiles: null, activeFiles: null, files: null };
    }
  },

  /**
   * Creates a new file
   * @param {Object} file
   */
  async createFile({ file }) {
    try {
      const newFile = await db.files.add(file, ["id"]);
      return newFile;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Changes a file's parent id
   * @param {Object} param
   * @param {String} param.id Id of the file
   * @param {String} param.parent_id Id of the parent
   */
  async moveFile({ id, parent_id }) {
    try {
      const movedFile = await db.transaction("rw", db.files, async () => {
        const result = await db.files
          .where("id")
          .equals(id)
          .modify({ parent: parent_id });
        // console.log(`file ${id} moved to ${parent_id}!`);
        return result;
      });
      return movedFile;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Renames a file with specified name
   * @param {Object} param
   * @param {String} param.id Id of the file
   * @param {String} param.name New name of the file
   */
  async renameFile({ id, name }) {
    try {
      const renamedFile = await db.transaction("rw", db.files, async () => {
        // Mark bigfoots:
        const file = await db.files
          .where("id")
          .equals(id)
          .modify({ name });
        // console.log(`file ${id} renamed!`);
        return file;
      });
      return renamedFile;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Updates an exisiting file
   * @param {Object} param
   * @param {String} param.id Id of the file
   * @param {String} param.contents Updated contents of the file
   */
  async updateFile({ id, contents }) {
    try {
      const updatedFile = db.transaction("rw", db.files, async () => {
        // Mark bigfoots:
        const file = await db.files
          .where("id")
          .equals(id)
          .modify({ contents });
        // console.log(`file ${id} updated!`);
        return file;
      });
      return updatedFile;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Delete an existing file
   * @param {Object} param
   * @param {String} param.id Id of the file
   */
  async deleteFile({ id }) {
    try {
      const deletedFile = await db.transaction("rw", db.files, async () => {
        // Mark bigfoots:
        const file = await db.files
          .where("id")
          .equals(id)
          .delete();
        // console.log(`file ${id} deleted!`);
        return file;
      });
      return deletedFile;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Restores a files Object containing files
   * @param {Object} param
   * @param {Object} param.filesObject Object containing files
   */
  async restoreFiles({ filesObject }) {
    try {
      const restoredFiles = await db.files
        .bulkPut(
          Object.keys(filesObject).map((file_id) => filesObject[file_id])
        )
        .catch((error) => {
          console.error(error);
        });
      return restoredFiles;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Creates a footprint of the open file
   * @param {Object} param
   * @param {OpenFileFootprint} param.footPrint
   */
  async addOpenFile({ fileFootPrint }) {
    try {
      const fp = await db.openFiles.put(fileFootPrint, ["id"]);
      return fp;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  /**
   * Creates a footprint of an active file
   * 
   */
  async addActiveFile({fileFootPrint}) {
    try {
      const fp = await db.activeFiles.put(fileFootPrint, ["editor"]);
      return fp;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Removes the footprints of an open file
   * @param {Object} param
   * @param {String} param.id Id of the file
   */
  async removeOpenFile({ id }) {
    try {
      await db.openFiles
      .where("id")
      .equals(id)
      .delete();
      return true;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Removes the footprints of an active file
   * @param {Object} param
   * @param {String} param.id Id of the file
   */
  async removeActiveFile({ id }) {
    try {
      await db.activeFiles
      .where("id")
      .equals(id)
      .delete();
      return true;
    } catch (error) {
      console.error(error);
    }
  },

  /**
   * Removes all the open file footprints
   */
  async clearOpenFiles() {
    try {
      await db.openFiles.clear();
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Removes all the active file footprints
   */
  async clearActiveFiles() {
    try {
      await db.activeFiles.clear();
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

Comlink.expose(Driver);
