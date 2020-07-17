/**
 * Automatically imports all the modules and exports as a single module object
 *
 * THERE IS NO NEED TO EDIT THIS FILE
 */

const files = require.context(".", true, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
  if (
    key === "./index.js" ||
    (key.split("/").length > 2 && !key.includes("index.js"))
  )
    return;
  modules[key.split("/")[1].replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

export default modules;


