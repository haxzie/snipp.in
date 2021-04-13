import Dexie from "dexie";

export const DB_VERSION = 2;

const db = new Dexie("hspace");
db.version(DB_VERSION).stores({
  files: "id, parent, name, type, contents, created_at",
  openFiles: "id, editor",
  activeFiles: "editor, id",
});

export default db;
