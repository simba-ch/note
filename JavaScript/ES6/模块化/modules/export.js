//ES6基本模块导出语法
console.log("基本导出");
// 1.export 声明表达式
export const name = "基本导出";

// 2.export {具名符号}
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  print() {
    console.log("姓名：", this.name);
    console.log("年龄：", this.age);
  }
}
export { Person };
//2.1 导出是可以通过as为导出符号重命名
const oldV = "原来的字符串";
export { oldV as newV };

//ES6默认模块导出语法
// 每个模块只允许有一个默认导出
console.log("默认导出模块");
// 1.export default 要导出的数据
const obj = {
  name: "simba",
  age: 18,
};
// export default obj;

//2.利用as为导出模块更名为default导出
// export {要导出的具名符号 as default}
const soonChange = () => {
  console.log("我已不是原来的我");
};
// export { soonChange as default };

//3.多次导出可以用默认导出导出一个对象
const a = "just a";
const b = "just b";
const c = "just c";
const d = "just d";
export default {
  a,
  b,
  c,
  d,
  obj,
  soonChange,
};

//导入导出
// 不可以用模块内给的接口
// 可以使用绑定再导出，来重新导出来自另一个模块的内容
// 有的时候，我们可能需要用一个模块封装多个模块，然后有选择的将多个模块的内容分别导出，可以使用下面的语法轻松完成
// export {绑定的标识符} from '模块路径'
// 注意！！！：r，k相当于本模块导出，但是如果本模块已存在r，k将被本模块取代（后面的替换前面的），
// 如果本模块已有默认导出再导入导出default的话会报错
// export { r, k, default} from "./m.js";

// 注：如果使用*号，会将所有基本导出和默认导出聚合到一个对象中，默认导出会作为属性default存在
// export *  from "./m.js";表示将路径的导出在本模块内导出，会与本模块的导出接口冲突
// export * as m from "./m.js";将路径的导出聚合到m对象中，导出m对象，不会与本模块接口冲突
