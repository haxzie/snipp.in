import { omit } from "lodash";

export class Schema {
  constructor(
    { type, properties, additionalProperties } = {
      type: "object",
      properties: {},
      additionalProperties: true,
    }
  ) {
    this.type = type;
    this.properties = properties;
    this.additionalProperties = additionalProperties;
  }
}

export class Validator {
  /**
   *
   * @param {Schema} schema to be valided against
   */
  constructor(schema) {
    if (!schema || typeof schema !== "object") {
      console.error("Invalid schema provided");
      throw new Error("Invalid/No Schema Provided");
    }
    this.schema = schema;
  }

  test(item) {

    const itemType = typeof item;
    if (itemType !== this.schema.type) {
      throw new Error("Item doesn't match the schema type");
    }

    Object.keys(this.schema.properties).forEach((key) => {
      const property = this.schema.properties[key];
      if (property.required) {
        if (!(key in item)) {
          throw new Error(
            `Validation Failed. key "${key}" not present in the item`
          );
        }
      }
      if (property.type !== typeof item[key]) {
        throw new Error(`Mismatching propery types in item`);
      }
    });

    if (!this.schema.additionalProperties) {
      const keys = Object.keys(this.schema.properties);
      const emittedObject = omit(item, keys);
      if (Object.keys(emittedObject).length > 0) {
        throw new Error("Additional properties not allowd");
      }
    }
    return true;
  }
}

/**
 * Checks if the given backup is valid or not
 */
export const validateBackup = (backup) => {
  const backupSchema = new Schema({
    type: "object",
    properties: {
      DB_VERSION: {
        type: "number",
        required: true,
      },
      files: {
        type: "object",
        required: true,
      },
      settings: {
        type: "object",
      },
    },
    additionalProperties: true,
  });
  const backupValidator = new Validator(backupSchema);

  const isValidBackup = backupValidator.test(backup);
  if (isValidBackup) {
    const filesToBackup = Object.keys(backup.files);
    let isFilesValid = true;
    for (let i = 0; i < filesToBackup.length; i++) {
      const isValid = validateFile(backup.files[filesToBackup[i]]);
      if (!isValid) {
        isFilesValid = false;
        break;
      }
    }
    return isFilesValid;
  } else {
    return false;
  }
};

/**
 * Checks if the given file is valid or not
 */
export const validateFile = (file) => {
  const fileSchema = new Schema({
    type: "object",
    properties: {
      id: {
        type: "string",
        required: true,
      },
      parent: {
        type: "string",
        required: true,
      },
      name: {
        type: "string",
        required: true,
      },
      contents: {
        type: "string",
        required: true,
      },
      created_at: {
        type: "number",
        required: true,
      },
      type: {
        type: "string",
        required: true,
      },
    },
    additionalProperties: true,
  });
  const fileValidator = new Validator(fileSchema);
  return fileValidator.test(file);
};
