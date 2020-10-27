import Dexie from "dexie";

const db = new Dexie("hspace");
db.version(2).stores({
  files: "id, parent, name, type, contents, created_at",
  openFiles: "id, editor",
  activeFiles: "editor, id",
});

export default db;
