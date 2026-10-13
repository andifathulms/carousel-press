import JSZip from "jszip";
import { b as slugify, s as slideFileName } from "./registry-CfRP1EtO.js";
import { b } from "./exportPng-JWI_EmEW.js";
function slideFileNames(count, name) {
  const slug = slugify(name) || "carousel";
  return Array.from({ length: count }, (_, i) => slideFileName(slug, i));
}
async function exportZip(blobs, name) {
  const zip = new JSZip();
  const names = slideFileNames(blobs.length, name);
  blobs.forEach((b2, i) => zip.file(names[i], b2));
  return zip.generateAsync({ type: "blob", compression: "STORE" });
}
export {
  b as downloadBlob,
  exportZip,
  slideFileNames
};
//# sourceMappingURL=zip.js.map
