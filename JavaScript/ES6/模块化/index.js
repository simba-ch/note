// ES6模块导入需要以./或../开口
//导入import必须在最顶端：因为ES6是预加载方便确认依赖关系也更易阅读
// 只想运行一遍代码不做其他事
// import '模块路径'
import "./modules/justRuning.js";

//基本导入
//方式1： import {具名符号} from 模块路径
//导入多个用逗号隔开
import { Person } from "./modules/export.js";
//方式2：可以结合as关键字为导入符号该名
// import {导出符号 as 接受变量名} from './modules/base.js';
import { newV as oldV } from "./modules/export.js";

//默认导入
// 方式1：import 接受变量名 from "模块路径"
import defaultExport from "./modules/export.js";
// 方式2：import {default as 接受的变量名} from '模块路径'
// import { default as newDefaultExport } from "./modules/export.js";

//花式导入（基本导入与默认导入结合）
// import 接受默认导出的变量名,{具名符号} from '模块路径'
// import * as 接受的变量名 from '模块路径'
// 会将所有基本导出和默认导出聚合到一个对象中，默认导出会作为属性default存在

import defaultVariable, { name } from "./modules/export.js";
import * as defaultValue from "./modules/export.js";

// ------------------------
let preson1 = new Person("simba", 18);
preson1.print();
console.log(oldV);
defaultExport.soonChange();
console.log(defaultVariable);
console.log(name);
console.log(defaultValue);
// console.log(defaultValue.m.default())
