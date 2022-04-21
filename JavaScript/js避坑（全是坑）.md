# 全是坑
## 不知道怎么分类的坑（了解一下就好）
* `isFinite(null);  // true，这点当特别注意`
* `0/0    // NaN`
* `0/100 //0`
* `100/0 //Infinity`

## 自我提醒
* js浮点计算是个坑，小心
* 避免使用with()可以把变量加入到全局作用域中，因此，如果有其它的同名变量，一来容易混淆，二来值也会被覆盖。

## 疑问
* onload方法可能不允许嵌套onload方法：
`window.onload = function(){
   {内有异步加载函数（比如图片：img.onload）}
`
window.onload会失效。
