import { v4 as uuid } from 'uuid'

export default class VFile {
    constructor({ file_id, folder_id, name, contents, created_at, editable }) {
        this.file_id = file_id || `file_${uuid()}`;
        this.folder_id = folder_id || 'root';
        this.name = name || '';
        this.contents = contents;
        this.created_at = created_at || Date.now();
        this.type = "FILE"
        this.editable = editable || false;
    }
}