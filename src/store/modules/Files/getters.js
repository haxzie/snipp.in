export default {
  getFiles: (state) => {
    return state.filesById.map((id) => state.files[id]);
  },
  getFile: (state) => (file_id) => {
    return state.files[file_id];
  },
};
