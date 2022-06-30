import { v4 as uuid } from 'uuid'

export const fileTypes = {
    FILE: "file",
    DIRECTORY: "directory",
    MARKDOWN: "markdown"
}

export const ALLOWED_FILES = [];
export default class VFile {
    constructor({ id, parent, type = fileTypes.FILE, name, contents, created_at, editable }) {
        this.id = id || `${type}_${uuid()}`;
        this.parent = parent || 'root';
        this.name = name || '';
        this.contents = contents || '';
        this.created_at = created_at || Date.now();
        this.type = type
        this.editable = editable || false;
    }
}