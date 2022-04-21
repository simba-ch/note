# TypeScript {ignore}

# TypeScript 是什么？

TypeScript（下面简称 TS）是 JavaScript 的超集，是一个可选的，静态的，类型检查系统；
TS 可以对代码中所有的标识符（变量、函数、参数、返回值）进行类型检查

# 类型约束

添加类型约束（变量、函数参数、函数返回值）：在需要添加类型约束的地方`:类型`

## 基本类型

- number：数字
- string：字符串
- boolean：布尔值
- array：数组
- object：对象
- null 和 undefined

null 和 undefined 是所有其他类型的子类型，它们可以赋值给其他类型
通过添加`strictNullChecks:true`，可以获得更严格的空类型检查，null 和 undefined 只能赋值给自身。

## 其他常用类型

- 联合类型：多种类型任选其一
  使用`|`分隔多个类型

```ts
let gender: "male" | "female" | "男" | "女" = "男";
```

配合类型保护进行判断

类型保护：当对某个变量进行类型判断之后，在判断的语句块中便可以确定它的确切类型，typeof 可以触发类型保护。

- void 类型：通常用于约束函数的返回值，表示该函数没有任何返回

- never 类型：通常用于约束函数的返回值，表示该函数永远不可能结束

- 字面量类型：使用一个值进行约束

- 元祖类型（Tuple）：一个固定长度的数组，并且数组中每一项的类型确定

- any 类型：表示任意类型，对该类型，ts 不进行类型检查，any 类型可以绕开类型检查，因此，any 类型的数据可以赋值给任意类型

## 类型别名：

对已知的一些类型定义名称

```ts
type 类型名 = ...
```

### 交叉类型

使用`&`组合多个类型
交叉类型会把相同的成员的类型进行交叉

```ts
type Foo = {
  foo: string;
};

type Bar = {
  bar: number;
};

type FooBar = {
  fooBar: boolean;
} & Foo &
  Bar;
```

## 函数的相关约束

函数重载：在函数实现前，对函数调用的多种情况进行声明

```ts
type combineArg = number | string;
function combine(arg1: number, arg2: number): number;
function combine(arg1: string, arg2: string): string;
function combine(arg1: combineArg, arg2: combineArg): combineArg {
  if (typeof arg1 === "number" && typeof arg2 === "number") {
    return arg1 * arg2;
  } else if (typeof arg1 === "string" && typeof arg2 === "string") {
    return arg1 + arg2;
  }
}
```

可选参数：可以在某些参数名后加上问号，表示该参数可以不用传递。可选参数必须在参数列表的末尾。

## 枚举

枚举通常用于约束某个变量的取值范围
枚举会出现在编译结果中，编译结果中表现为对象

定义枚举使用`enum`关键字

枚举的规则：

- 枚举的值可以是字符串或数字
- 当枚举的值为数字时，枚举的值会自动增加
- 被数字枚举的约束的变量，可以直接赋值为数字
- 数字枚举的编译结果 和 字符串枚举有差异

```ts
enum 枚举名 {
  枚举字段1 = 值1,
  枚举字段2 = 值2,
  ...
}
```

### [扩展]位枚举（枚举的位运算）

针对数字枚举

位运算：两个数字换算成二进制后进行的运算

- 或运算（`|`）：同位比较有 1 为 1，否则为 0。可以用来组合权限
- 与运算（`&`）：同位比较有 0 为 0，否则为 1。可以用来判断权限
- 异或运算（`^`）：同位比较相同为 0，不同为 1。可以用来删除权限

## 模块化

### 如何在 TS 中书写模块化语句

TS 中，导入和导出模块，统一使用 ES6 的模块化标准

### 编译结果中的模块化

可配置

TS 中的模块化在编译结果中：

- 如果编译结果的模块化标准是 ES6：没有区别
- 如果编译结果的模块化标准是 CommonJS：导出的声明会变成 exports 的属性，默认导出会变成 exports 的 default 属性

### 在 TS 中书写 CommonJS 模块化代码

导出：`export = xxx`

导入：`import xxx = require("xxx")`

### 模块解析

模块解析：应该从什么位置寻找模块

TS 中有两种模块解析策略

- classic：经典
- node：node 解析策略（与 node 解析模块策略一致，唯一的变化是将 js 替换成 ts）

## 接口和类型兼容性

接口：interface

Typescript 的接口：用于约束类、对象、函数的契约（标准）

面对对象领域中的接口的语义：表达了某个类是否拥有某种能力
某个类具有某种能力，其实就是实现了某种接口。使用`implements`关键字表示实现某个接口

```ts
class FooBar implements foo, bar {}
```

类型保护函数：通过调用该函数，会触发 TS 的类型保护，该函数必须返回 Boolean
使用`is`关键字来定义一个类型保护函数

```ts
function protectedType(type:object) type is otherType{
  if(type.propertype !== undefined){
    return true
  }
  return false
}
```

接口可以继承类，表示该类的所有成员都在接口中

和类型别名一样，接口不会出现在编译结果中
接口和类型别名的最大区别：接口可以被类实现，而类型别名不可以

契约（标准）的形式：

- API 文档，弱标准
- 代码约束，强标准

### 接口的使用

1. 接口约束对象

```ts
interface User {
  name: string;
  age: number;
  gender: "male" | "female";
}
```

2. 接口约束函数

```ts
interface Condition {
  (n: number): boolean;
}
```

**接口可以继承**
可以通过接口之间的继承，实现多种接口的组合

```ts
interface father {
  name: string;
  age: number;
}

interface mother {
  cookie: () => void;
}

interface son extends father {
  sayHello: (name: string) => string;
}

//接口可以多继承
interface son extends father, mother {
  sayHello: (name: string) => string;
}
```

使用类型别名可以实现类似的组合效果，需要通过`&`，它叫做交叉类型

它们的区别：

- 子接口不能覆盖父接口的成员
- 交叉类型会把相同的成员的类型进行交叉

### 类型兼容性

B -> A,如果能完成赋值，则 B 和 A 类型兼容

鸭子辩型法（子结构辩型法）：目标类型需要某一些特征，赋值的类型只要能满足该特征即可

- 基本类型：完全匹配

- 对象类型：鸭子辩型法

类型断言
使用`as 类型`修改 TS 的类型推断

非空断言
在被推导的数据后使用`!`，告诉TS不用考虑数据为非空的情况

```ts
interface Duck {
  sound: "嘎嘎嘎";
  swin(): void;
}

let person = {
  name: "伪装成鸭子的人",
  age: 18,
  sound: "嘎嘎嘎" as "嘎嘎嘎",
  swin() {},
};
```

当直接使用对象字面量赋值的时候，会进行更加严格的判断

- 函数类型

**参数**：传递给目标函数的参数可以少，但不可以多

**返回值**：要求返回必须返回，不要求返回你随意

## TS 类

### 属性

使用属性列表来描述类中的属性

**属性简写**

如果某个属性，通过构造函数的参数传递，并且不做任何处理的赋值给该属性。可以进行简写

```ts
class User {
  name: string;
  age: number;
  gender: "男" | "女" = "女";
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
//属性简写
//以上代码可以简写为：
class User {
  gender: "男" | "女" = "女";
  constructor(public name: string, public age: number) {}
}
```

**属性的初始化检查**
`strictPropertyInitialization:true`

**属性的初始化位置**

1. 在构造函数中

2. 属性默认值

**属性可以修饰为可选的**

**属性可以修饰为只读的**

**使用访问修饰符**

访问修饰符可以控制类中的某个成员的访问权限

- readonly：只读修饰符，修饰的目标是只读的，只读修饰符不在编译结果中
- public：默认的访问修饰符，公开的，所有的代码均可访问
- private： 私有的，只有在类中可以访问
- protected：受保护的成员，只能在自身和子类中访问

### 访问器

作用：用于控制属性的读取和赋值
使用`set`和`get`关键字来设置一个属性的访问器

```ts
class User {
  constructor(private _age: number) {}
  get age() {
    return this._age;
  }

  set age(n: number) {
    this._age = n;
  }
}
```

### 类的继承

继承可以描述类与类之间的关系

如果 A 和 B 都是类，并且可以描述为 A 是 B，则 A 和 B 形成继承关系
如果 A 继承自 B，则 A 中自动拥有 B 中的所有成员

### 成员的重写

重写（override）：无论是属性还是方法，子类都可以对父类的相应成员进行重写，但是重写时，需要保证类型的匹配。**子类成员不能改变父类成员的类型**

#### this 的指向约束

**注意**this 关键字：在继承关系中，this 的指向是动态——调用方法时，根据具体的调用者确定 this 指向

##### 在 JS 中 this 的指向几种情况

明确：大部分时候，this 的指向取决于函数的调用方式

- 如果直接调用函数（全局调用），this 指向全局对象或 undefined（启用严格模式）
- 如果使用`对象.方法`调用，this 指向对象本身
- 如果是 dom 事件的处理函数，this 指向事件处理对象

特殊情况：

- 箭头函数，this 在函数声明时确定指向，指向函数位置的 this
- 使用 bind、apply、call 手动绑定 this 对象

##### TS 中的 this

配置`noImplicitThis`为`true`，表示不允许 this 隐式指向 any

在 TS 中，允许在书写函数时，手动声明该函数中 this 指向，将 this 作为函数的第一个参数，该参数只用于约束 this，并不是真正的参数，也不会出现在编译结果中。

```
interface User{
  name:string
  age:number
  sayHello(this:User):void
}
```

super 关键字：在子类的方法中，可以使用 super 关键字读取父类成员

### 类型匹配

鸭子辩型法

子类的对象，始终可以赋值给父类

面向对象中，这种现象，叫做里氏替换原则

如果需要判断一个数据的具体子类类型，可以使用`instanceof`

### 单根型和传递性

单根型：每个类最多只能拥有一个父类

传递性：如果 A 是 B 父类，并且 B 是 C 的父类，则可以认为 A 也是 C 的父类

### 抽象类

有时某个类只表示一个抽象概念，主要用于提取子类共有的成员，而不能直接创建它的对象。该类可以作为抽象类。

给类前面加上`abstract`，表示该类是一个抽象类，不可以创建一个抽象类的对象

#### 抽象成员

父类中，可能知道有些成员是必须存在的，但是不知道该成员的值或实现是什么，因此，需要有一种强约束，让继承该类的子类必须要实现该成员。

```ts
abstract class Person {
  abstract readonly name: string;
  abstract age: number;
}
```

### 静态成员

静态成员是指，附着在类上的成员（属于某个构造函数的成员）

使用`static`修饰的成员，属于某个类的对象

实例成员：对象成员，属于某个类的对象

静态成员：非实例成员，属于某个类

### 静态方法中的 this

实例方法中的 this 指向是**当前对象**

而静态方法中的 this 指向是**当前类**

## 索引器

`对象[值]`，使用成员表达式

在 TS 中，默认情况下，不对索引器（成员表达式）做严格的类型检查

使用配置`noImplicitAny`开启对隐式 any 的检查

隐式 any：TS 根据实际情况推导出的 any 类型

在索引器中，键的类型可以是字符串，也可以是数字

在类中，索引器书写的位置应该是所有成员之前

TS 中索引器的作用

- 在严格的检查下，可以实现为类动态增加成员
- 可以实现动态的操作成员

在 JS 中，所有的成员本质上，都是字符串，如果使用数字作为成员名，会自动转换为字符串

在 TS 中，如果某个类中使用了两种类型的索引器，要求两种索引器的值类型必须匹配
如果不匹配，索引器中`key`为`number`的值必须是索引器中`key`为`string`的值的子类型

```
class Index {
  [prop:string]:any
  [prop:number]:string | number
  constructor(public name:string,public age:number){

  }
}

```

## 泛型

有时，书写某个函数时，会丢失一些类型信息（多个位置的类型应该保持一致或有关联的信息）
泛型：是指附属于函数、类、接口、类型别名之上的类型

泛型相当于是一个类型变量，在定义时，无法预先知道具体的类型，可以用该变量来代替，只有到调用时才能确定它的类型

很多时候，TS 会智能的根据传递的参数，推导出泛型的具体类型

如果无法完成推导，并且又没有传递具体的类型，默认为空对象

泛型可以设置默认值
`<泛型名称 = 具体的类型>`

### 在函数中使用泛型

在函数名之后写上`<泛型名称>`

在调用的时候，在函数名后写上`<具体的类型>`

### 如何在类型别名、接口、类中使用泛型

直接在名称后写上`<泛型名称>`

### 泛型约束

泛型约束，用于限制泛型的取值
使用`<泛型名称 extends 具体的类型>`

### 多泛型

`<泛型名称,另一个泛型名称>`

## 装饰器

面对对象的概念（Java：注解，C#：特征），decorator

使用装饰器`@得到一个函数`

### 装饰器的作用

装饰器，能够带来额外的信息，可以达到分离关注点的目的。

装饰器的作用：为某些属性、类、参数、方法提供元数据信息（metadata）

元数据：描述数据的数据

### 装饰器的本质

在 JS 中，装饰器是一个函数。（装饰器是要参与运行的）

装饰器可以修饰：

- 类
- 成员（属性 + 方法）
- 参数

### 类装饰器

类装饰器本质是一个函数，该函数接收一个参数，表示类本身（构造函数本身）

在 TS 中，如何约束一个变量为类

- Function
- `new (参数) => object`

```ts
function d1(target: new (...rest: any[]) => {}) {}

@d1
class User {
  constructor(public name: string) {}
}
```

在 TS 中要使用装饰器，需要开启`experimentalDecorators`

装饰器函数的运行时间：在类定义后直接运行

类装饰器可以具有返回值：

- void：仅运行函数
- 返回一个新的类：会将新的类替换掉装饰目标

多个装饰器的情况：会按照后加入先调用的顺序进行调用

### 成员装饰器

#### 属性

属性装饰器也是一个函数，该函数需要两个参数：

1. 如果是静态属性，则为类本身(类的构造函数)；如果是实例属性，则为类的原型；
2. 固定为一个字符串，表示属性名

```ts
function d (target:any,key:string) {
  console.log(target);
  console.log(key);
}

class User(){
  @d
  prop1:string

  @d
  prop2:string
}
```

#### 方法

方法装饰器也是一个函数，该函数需要三个参数：

1. 如果是静态方法，则为类本身（类的构造函数）；如果是实例方法，则为类的原型；
2. 固定为一个字符串，表示方法名
3. 属性描述对象（在 TS 中描述对象的类型为`PropertyDescriptor`）

可以有多个装饰器修饰

### 参数装饰器

依赖注入、依赖倒置

要求函数有三个参数：

1. 如果方法是静态的，则为类本身；如果方法是实例方法，则为类的原型
2. 方法名称
3. 在参数列表中的索引

- 关于 TS 自动注入的元数据

如果安装了`reflect-metadata`，并且导入了该库，并且在某个成员上添加了元数据，并且启用了`emitDecoratorMetadata`。
则 TS 在编译结果中，会将约束的类型，作为元数据加入到相应位置

这样一来，TS 的类型检查（约束）将有机会在运行时进行。

- AOP（aspect oriented programming）

编程方式，属于面向对象开发

将一些在业务中共同出现的功能块，横向切分，已达到分离关注点的目的。

### reflect-metadata 库

该库的作用：保存元数据

### class-validator 和 class-transformer 库

依赖`reflect-metadata`库

## 类型演算

根据已知的信息，计算出新的类型

### 三个关键字

- typeof

TS 中的 typeof，书写的位置在类型约束的位置上。

表示：获取某个数据的类型

当 typeof 作用于类的时候，得到的类型是该类的构造函数

- keyof

作用于类、接口、类型别名，用于获取其他类型中的所有成员名组成的联合类型

- in

该关键字往往和 keyof 联用，限制某个索引类型的取值范围

```ts
type Props = {
  loginId: string;
  loginPwd: string;
};

type Obj = {
  [p in keyof Props]: string;
};
```

### TS 中预设的类型演算

```ts

Partial<T> //将类型T中的成员变为可选

Required<T> //将类型T中的成员变为必填

Readonly<T> //将类型T中的成员变为只读

Exclude<T,U> //从T中剔除可以赋值给U的类型

Extract<T,U> //提取T中可以赋值给U的类型

Nonnullable<T> //从T中剔除null和undefined

ReturnType<T> //获取函数返回值类型

InstanceType<T> //获取构造函数类型的实例类型

```

## 声明文件

### 概述

1. 声明文件是什么
   以`.d.ts`结尾的文件

2. 声明文件有什么作用

为 JS 代码提供类型声明

3. 声明文件的位置

- 放置到 tsconfig.json 配置中包含（`include`配置的路径下）的目录中
- 放置到 node_modules/@types 文件中
- 手动配置（配置 tsconfig.json 的`typeRoots`，该配置是一个数组可以配置多个路径，开启该配置上面两中情况失效）
- 与 JS 代码所在目录相同，并且文件名也相同的文件。用 TS 代码书写的工程发布之后的格式。

### 编写

- 自动生成

工程局是使用 TS 开发的，发布（编译）之后，发布的是 js 文件

如果发布的文件需要被其他开发者使用，可以使用声明文件，来描述发布结果中的类型。

配置 tsconfig.json 中的`declaration:true`即可

- 手动编写

1. 对已有库，它是使用 js 书写而成，并且更改该库的代码为 TS 成本较高，可以手动编写声明文件

2. 对一些第三方库，它们使用 js 书写而成，并且这些第三方库没有提供声明文件，可以手动编写声明文件。

**全局声明**
声明一些全局的对象、属性、变量

namespace：表示命名空间，可以将其认为是一个对象，命名空间中的内容，必须通过`命名空间.成员名`访问

**模块声明**

```ts
declare module "模块名" {
  export function 函数名(): void;
}
```

**三斜线指令**

在一个声明文件中，包含另一个声明文件
三斜线指令必须在最上面书写
如果是相对路径，从当前路径出发

```ts
/// <reference path="要引用的文件路径"/>
```

### 发布

1. 当前工程使用 ts 开发

编译完成后，将编译结果所在文件夹直接发布到 npm 上即可

2. 为其他第三方库开发的声明文件

发布到@types/\*\*中。

1） 进入 github 的开源项目：https://github.com/DefinitelyTyped/DefinitelyTyped

2） fork 到自己的开源库中

3） 从自己的开源库中克隆到本地

4） 本地新建分支（例如：mylodash4.3），在新分支中进行声明文件的开发

    在types目录中新建文件夹，在新的文件夹中开发声明文件

5） push 分支到你的开源库

6） 到官方的开源库中，提交 pull request

7） 等待官方管理员审核（1 天）

审核通过之后，会将你的分支代码合并到主分支，然后发布到 npm。

之后，就可以通过命令`npm install @types/你发布的库名`
