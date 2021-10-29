import { types } from "./mutations";

export default {
  downloadDirectory: async ({ rootGetters }, { id, name }) => {
    const folder = await rootGetters["Explorer/getDirectoryBlob"]({ id, name });

    //Download current dir as .zip
    folder.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, `${name}.zip`);
    })
  }
}