import Dexie from 'dexie';

const db = new Dexie('hspace');
db.version(1).stores({
    files: 'id, parent, name, type, contents, created_at',
});

export default db;