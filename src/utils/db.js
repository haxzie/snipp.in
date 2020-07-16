import Dexie from 'dexie';

const db = new Dexie('hspace');
db.version(1).stores({
    files: 'file_id, folder_id, name, contents, created_at',
    folders: 'folder_id, parent_id, name, color',
});

export default db;