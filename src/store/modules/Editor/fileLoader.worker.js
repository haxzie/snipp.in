import { expose } from "comlink";

async function fileReader(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function loadLocalFile(file) {
  const text = await fileReader(file);
  return text;
}

expose({
  loadLocalFile,
  fileReader,
});
