// 用fetch获取数据
/* 请求测试地址：http://101.132.72.36:5100/api/local
使用 ```fetch``` 函数即可立即向服务器发送网络请求 */
/* const request = "http://101.132.72.36:5100/api/local";
fetch(request)
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    console.log(myJson);
  });
 */
// 用fetch上传数据
/* 测试地址：http://101.132.72.36:5100/api/upload
> 键的名称（表单域名称）：imagefile

请求方法：POST
请求的表单格式：multipart/form-data
请求体中必须包含一个键值对，键的名称是服务器要求的名称，值是文件数据 */
const url = "http://101.132.72.36:5100/api/upload";
const btn = document.getElementById("btn"),
  inp = document.getElementById("inp");
async function upload() {
  const formData = new FormData(),
    file = inp.files[0];
  formData.append("imagefile", file);
  const resp = await fetch(url, {
    method: "POST",
    body: formData,
  });
  console.log("已发送");
  let result = await resp.json();
  console.log(result);
  return result;
}
btn.onclick = () => {
  upload();
};
