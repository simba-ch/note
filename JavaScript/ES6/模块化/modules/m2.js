export let a = 15;
export const t = Date.now();

export const k = "m2的k";
export default function () {
  console.log("这是m2的默认导出");
  return [
    "String",
    "Number",
    "Boolean",
    "Object",
    "null",
    "undefined",
    "Symbol",
    "BigInt",
  ];
}
