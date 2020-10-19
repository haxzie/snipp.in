export default class OpenFileFootprint {
  constructor({ id, editor }) {
    if (editor && id) {
      this.id = id;
      this.editor = editor;
    } else {
      console.error("Id and editor required");
    }
  }
}
