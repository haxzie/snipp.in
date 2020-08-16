import VFile, { fileTypes } from "@/models/vFile.model";

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
    }
}