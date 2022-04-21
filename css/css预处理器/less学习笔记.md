# less

[官网](https://lesscss.org/):https://lesscss.org/
[中文网](https://less.bootcss.com/):https://less.bootcss.com/

# 简介

2009 年出现，受 SASS 的影响较大，但又使用 CSS 的语法，让大部分开发者和设计师更容易上手，在 ruby 社区之外支持者远超过 SASS，其缺点是比起 SASS 来，可编程功能不够，不过优点是简单和兼容 CSS，反过来也影响了 SASS 演变到了 SCSS 的时代，著名的 Twitter Bootstrap 就是采用 LESS 做底层语言的。

# less 基础

less 文件以`.less`为后缀名

## 变量

tips:
变量可以在定义之前使用（这点与 sass 有很大不同）
变量拥有作用域，父规则内不能使用子规则内的变量，定义多个同名变量时会取离它最近的作用域内的变量值。同一作用域内，后面的变量覆盖前面的变量。

1. 定义变量：使用`@`符定义一个变量

```less
@width: 10px;
@height: @width + 10px;
```

2. 使用变量

```less
#header {
  width: @width;
  height: @height;
}
```

### 变量的插值

使用`@{变量名}`来使用变量插值

```less
@my-selector:banner;
.@{my-selector}{
  font-weight: bold;
  line-height: 40px;
  margin: 0 auto;
}

@images:"../images"
body{
  color: #444;
  background: url("@{images}/white-sand.png");
}

@prop:color
.widget {
  @{prop}: #0ee;
  background-@{prop}: #999;
}
```

### 可变变量

使用`@@`可以定义一个变量名为另一个变量的值的变量

```less
@primary: green;
@secondary: blue;

.section {
  @color: primary;

  .element {
    color: @@color;
  }
}
```

编译后：

```css
.section .element {
  color: green;
}
```

### 同名变量覆盖

```less
.class {
  @var: 1;
  .brass {
    @var: 2;
    three: @var;
    @var: 3;
  }
  one: @var;
}
@var: 0;
```

编译后：

```css
.class {
  one: 1;
}
.class .brass {
  three: 3;
}
```

### 引用属性

可以通过`$`引用一个属性的值，为其他属性赋值。与变量类似当前规则内有同名属性引用它，没有向上找，直到找到或报错，同一个的规则内后定义的属性值覆盖前面的属性值。

```less
.block {
  color: red;
  .inner {
    background-color: $color;
  }
  color: blue;
}
```

编译后：

```css
.block {
  color: red;
  color: blue;
}
.block .inner {
  background-color: blue;
}
```

### 变量的属性访问

tips：当变量是一个对象时，为类混合变量，可以当成混合在规则内调用

```less
@var: {
  font-size: 18px;
  color: red;
};
body {
  // 直接在规则内调用
  @var();
}
```

```less
@dr: {
  @foo: bar;
  value: baz;
};

.box {
  my-value: @dr[value];
  my-foo: @dr[ @foo];
}
```

编译后

```css
.box {
  my-value: baz;
  my-foo: bar;
}
```

## 混合

混合是一种将一组属性从一个规则集包含到另一个规则集的方法

### 简单混合

可以混合`类选择器`和`id选择器`到一个新的规则内

```less
.a,
#b {
  color: red;
}
.mixin-class {
  .a;
}
.mixin-id {
  #b;
}
```

编译后

```css
.a,
#b {
  color: red;
}
.mixin-class {
  color: red;
}
.mixin-id {
  color: red;
}
```

### 选择器混合

混合内可以写选择器（与 sass 不同的是即使混合内没有写任何属性，混合也不可以在规则外调用）

```less
.my-hover-mixin() {
  &:hover {
    border: 1px solid red;
  }
}
button {
  .my-hover-mixin();
}
```

编译后：

```css
button:hover {
  border: 1px solid red;
}
```

### 不输出的混合

在类选择器或id选择器后加上`()`。使用混合就是在需要的地方直接书写混合名

```less
.mixin() {
  ...;
}
```

```less
.not-outputting-mixin() {
  background: white;
}

.calss {
  .not-outputting-mixin();
}
```

编译后：

```css
.class {
  background: white;
}
```

### 带有参数的混合

混合内的参数以变量的形式定义，传参以定义参数的顺序传参
混合内的参数可以由`,`或者`;`分隔，但是更推荐用`;`作为参数的分隔符。因为`,`有两种含义：1.混合参数的分隔符；2.css 的列表。当混合名后的`()`内出现最少一个`;`less 将认为参数是以`;`作为分隔符的。
例：

- 两个参数的混合，并且每个参数都是一个 css 列表：`.name(1,2,3;something,else)`
- 三个参数的混合，并且每个参数都是一个数字：`.name(1,2,3)`
- 一个参数的混合，参数是一个 css 列表，需要在最后加上一个`;`：`.name(1,2,3;)`
- 在定义混合时使用`,`来分隔默认值：`.name(@param1: red, blue;)`。

```less
.border-radius(@radius) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

#header {
  .border-radius(4px);
}
.button {
  .border-radius(6px);
}
```

#### 参数默认值

```less
.border-radius(@radius: 5px) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}
```

#### 命名参数

传参的时候指定参数名，这样传参的顺序就不重要了

```less
.mixin(@color: black; @margin: 10px; @padding: 20px) {
  color: @color;
  margin: @margin;
  padding: @padding;
}
.class1 {
  .mixin(@margin: 20px; @color: #33acfe);
}
.class2 {
  .mixin(#efca44; @padding: 40px);
}
```

编译后

```css
.class1 {
  color: #33acfe;
  margin: 20px;
  padding: 20px;
}
.class2 {
  color: #efca44;
  margin: 10px;
  padding: 40px;
}
```

#### `@arguments`变量

`@argumnets`变量在混合中是有特殊意义的。当混合被调用时，`@arguments`变量是代表其他所有的参数变量，顺序和混合定义时的参数顺序有关。

```less
.box-shadow(@x: 0; @y: 0; @blur: 1px; @color: #000) {
  -webkit-box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  box-shadow: @arguments;
}
.big-block {
  .box-shadow(@y:5xp;@color:#fff; @x:2px;);
}
```

```css
.big-block {
  -webkit-box-shadow: 2px 5xp 1px #ffffff;
  -moz-box-shadow: 2px 5xp 1px #ffffff;
  box-shadow: 2px 5xp 1px #ffffff;
}
```

#### 任意参数和`@reset`

当你需要定义一个任意参数的混合是可以使用`...`

```less
.mixin(...) {        // matches 0-N arguments
.mixin() {           // matches exactly 0 arguments
.mixin(@a: 1) {      // matches 0-1 arguments
.mixin(@a: 1; ...) { // matches 0-N arguments
.mixin(@a; ...) {    // matches 1-N arguments
```

此外你可以定义一个变量如：`@reset`，来接收这些参数的值

```less
.mixin(@a; @rest...) {
  // @rest is bound to arguments after @a
  // @arguments is bound to all arguments
}
```

#### 重载混合

less 允许定义多个同名混合(这与 sass 有天壤之别，sass 后面定义的混合会覆盖前面定义的混合)，当调用混合时会根据传入的参数来确定哪些是满足的条件的混合，将这些满足条件的混合中的样式全部包含到调用它的地方
如果两个同名混合中有同名属性会按定义顺序依次输出到css文件中。

```less
.mixin(@color) {
  color-1: @color;
}
.mixin(@color; @padding: 2) {
  color-2: @color;
  padding-2: @padding;
}
.mixin(@color; @padding; @margin: 2) {
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}
.some .selector div {
  .mixin(#008000);
}
```

编译后：

```css
.some .selector div {
  color-1: #008000;
  color-2: #008000;
  padding-2: 2;
}
```
同名混合中的同名属性
```less
.mixin(@color) {
  color-1: @color;
}
.mixin(@padding,@color:red) {
  color-1: @color;
  padding-2: @padding;
}

.mixin(@color; @padding; @margin: 2) {
  color-3: @color;
  padding-3: @padding;
  margin: @margin @margin @margin @margin;
}
.some .selector div {
  .mixin(#008000);
}
```

编译后：
```css
.some .selector div {
  color-1: #008000;
  color-1: red;
  padding-2: #008000;
}
```

##### 模式匹配
利用混合重载做可选样式
`@_`表示匹配任意值

```less
.mixin(dark; @color) {
  color: darken(@color, 10%);
}
.mixin(light; @color) {
  color: lighten(@color, 10%);
}
.mixin(@_; @color) {
  display: block;
}

@switch: light;

.class {
  .mixin(@switch; #888);
}
```

编译后：

```css
.class {
  color: #a2a2a2;
  display: block;
}
```

实例：

```less
//当参数是一个值的时候`color`为不同的颜色值，当参数是两个值的时候是淡入淡出效果
.mixin(@a) {
  color: @a;
}
.mixin(@a; @b) {
  color: fade(@a; @b);
}
```

### 命名空间

命名空间用来提取混合中的某个样式
你可以通过堆积多个 id 或类选择器来完成
tips:

```less
// 下面三种写法的效果是一样的
#outer > .inner();
#outer .inner();
#outer.inner();
```

```less
#outer() {
  .inner {
    color: red;
  }
}

.c {
  #outer > .inner();
}
```

编译后：

```css
.c {
  color: red;
}
```

### 使用`!import`关键字

在混合调用后使用`!import`关键字，为混合中的每一个属性在引用它的规则中添加`!import`关键字。

```less
.foo (@bg: #f5f5f5, @color: #900) {
  background: @bg;
  color: @color;
}
.unimportant {
  .foo();
}
.important {
  .foo() !important;
}
```

编译后

```css
.unimportant {
  background: #f5f5f5;
  color: #900;
}
.important {
  background: #f5f5f5 !important;
  color: #900 !important;
}
```

### 函数式混合

从 less3.5 开始，你可以使用`[]`像属性、变量访问器来获取一个正在调用的混合的规则中的某个值

```less
.average(@x, @y) {
  @result: ((@x + @y) / 2);
}

div {
  // call a mixin and look up its "@result" value
  padding: .average(16px, 50px) [ @result];
}
```

编译后：

```css
div {
  padding: 33px;
}
```

#### 未命名查找

当混合调用后的`[]`内没有填任何要查找的属性、变量时，默认是查找最后一个定义的属性或变量

```less
.mixin() {
  @width: 100%;
  @height: 200px;
  border: 1px solid red;
}

.caller {
  width: .mixin() [];
}
```

编译后：

```css
.caller {
  width: 1px solid red;
}
```

### 递归混合

在 Less 中，混合可以调用自身。这种递归混合，当与守卫表达式（when）和模式匹配结合使用时，可用于创建各种迭代/循环结构。

```less
.generate-columns(4);

.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
```

编译后：

```css
.column-1 {
  width: 25%;
}
.column-2 {
  width: 50%;
}
.column-3 {
  width: 75%;
}
.column-4 {
  width: 100%;
}
```

### 守卫表达式

`when`关键字引出一个守卫序列

```less
混合名(...) when (条件) {
  ...;
}
```

```less
.mixin(@a) when (lightness(@a) >= 50%) {
  background-color: black;
}
.mixin(@a) when (lightness(@a) < 50%) {
  background-color: white;
}
.mixin(@a) {
  color: @a;
}

.class1 {
  .mixin(#ddd);
}
.class2 {
  .mixin(#555);
}
```

编译后：

```css
.class1 {
  background-color: black;
  color: #ddd;
}
.class2 {
  background-color: white;
  color: #555;
}
```

#### 比较符

- `>`
- `>=`
- `=`
- `<=`
- `<`
- `true`:当为真值（truthy）时相等

#### 逻辑符

- `and`：`.mixin(@a) when (isnumber(@a)) and (@a > 0) { ... }`
- `,`：`.mixin(@a) when (@a > 10), (@a < -10) { ... }`
- `not`：`.mixin(@b) when not (@b > 0) { ... }`

#### 类型检查函数

- iscolor
- isnumber
- isstring
- iskeyword
- isurl
- ispixel
- ispercentage
- isem
- isunit

### 别名混合

可以将混合中的属性、变量赋值给一个变量，调用这个变量来得到相应的值
**注意**：将混合赋值给变量的时候调用混合时不能省略`()`。

```less
#theme.dark.navbar {
  .colors(light) {
    primary: purple;
  }
  .colors(dark) {
    primary: black;
    secondary: grey;
  }
}

.navbar {
  @colors: #theme.dark.navbar.colors(dark);
  background: @colors[primary];
  border: 1px solid @colors[secondary];
}
```

编译后：

```css
.navbar {
  background: black;
  border: 1px solid grey;
}
```

例 2：

```less
#library() {
  .rules() {
    background: green;
  }
}
.box {
  @alias: #library.rules();
  @alias();
}
```

```css
.box {
  background: green;
}
```

## 嵌套(选择器)

less 提供嵌套代替层叠或与层叠结合的能力

```less
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

编译后：

```css
#header {
  color: black;
}
#header .navigation {
  font-size: 12px;
}
#header .logo {
  width: 300px;
}
```

### 嵌套时调用父选择器

在嵌套时使用`&`可以调用父选择器

```less
article a {
  color: blue;
  &:hover {
    color: red;
  }
}
```

编译后：

```css
article a {
  color: blue;
}
article a:hover {
  color: red;
}
```

### 群组选择器的嵌套

```less
.container {
  h1,
  h2,
  h3 {
    margin-bottom: 8px;
  }
}
```

编译后：

```css
nav,
aside {
  a {
    color: blue;
  }
}
.container h1,
.container h2,
.container h3 {
  margin-bottom: 8px;
}

nav a,
aside a {
  color: blue;
}
```

### @规则嵌套和冒泡

@规则（例如`@media`或`@supports`）可以与选择器以相同的方式进行嵌套。@规则会被放在前面，同一规则集中的其它元素的相对位置保持不变。这叫冒泡。

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}
```

编译后：

```css
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }
}
```

## 运算

less 提供`+`、`-`、`*`、`/`对数字进行运算，当数字带有单位，less 会尝试转化单位后进行运算，转化后的单位以左边第一个出现的单位为准；当无法转化或者转换后失去意义的时候，则忽略单位，以左边第一个出现的单位作为结果的单位。

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

// conversion is impossible
@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

// example with variables
@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%
```

乘除不会对单位进行转化。因为这两种运算在大多数的情况下转换都没有意义，一个长度乘以一个长度，得到一个区域，在 css 中是不支持区域的。

```less
@base: 2cm * 3mm; // 结果是 6cm
```

### `calc()`

为了与 css 保持一致，`calc()`不会对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

```less
@var: 50vh/2;
width: calc(50% + (@var - 20px)); // 结果是 calc(50% + (25vh - 20px))
```

## 转义

转义允许你使用任意字符串作为属性值或变量值。任何`~'anythig'`或`~"anything"`形式的内容都将按原样输出。除非在 interpolation（插值表达式中）。

```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

```css
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

**注意**：从 less3.5 开始，以前需要用转义的地方都不再需要了，可以简写为：

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

## 函数

- `if(条件，value1，value2)`：当条件为真时，取`value1`的值，当条件为假时取`value2`的值。

## 映射

使用命名空间和混合作为值的映射，通过将命名空间与查找语法`[]`相结合，你可以将规则集或混合转化为映射

```less
@sizes: {
  mobile: 320px;
  tablet: 768px;
  desktop: 1024px;
};

.navbar {
  display: block;

  @media (min-width: @sizes[tablet]) {
    display: inline-block;
  }
}
```

编译后：

```css
.navbar {
  display: block;
}
@media (min-width: 768px) {
  .navbar {
    display: inline-block;
  }
}
```

**注意**：在查找语法中`[@lookup]`,`@lookup`不是一个变量只是一个普通的值，如果你想要使用一个变量，可以使用可变变量。

```less
.foods() {
  @dessert: ice cream;
}

@key-to-lookup: dessert;

.lunch {
  treat: .foods[ @@key-to-lookup];
}
```

编译后：

```css
.lunch {
  treat: ice cream;
}
```

## 注释

- 块注释：在编译的时候，不会去掉

```less
/*
*天王盖地虎
*宝塔镇河妖
*/
```

- 行注释：在编译的时候会去掉

```less
//你脸红个泡泡茶壶
```

## 导入

你可以在 less 文件中的任意地方使用导入`@import`
less 会根据文件的扩展名进行不同的处理

- 如果是以`.css`为扩展名，它将视为 css 文件导入，
- 如果是以其他扩展名导入，它将被视为一个 less 文件导入
- 如果没有扩展名，将被视为一个 less 文件导入

### 导入选项

语法：`@import (keyword) 'filename';`
每一个`@import`允许多个关键字，但是必须以`,`分隔
例：`@import (optional,reference) 'foo.less'`

- `reference`：使用 Less 文件但不输出它；
- `inline`：在输出中包含源文件但不处理它
- `less`：无论文件扩展名是什么，都将文件视为 Less 文件
- `css`：无论文件扩展名是什么，都将文件视为 CSS 文件
- `once`：只包含文件一次（这是默认行为）
- `multiple`：包含文件多次
- `optional`：找不到文件时继续编译

## 继承

less 中的继承像是一个带有参数的伪类（不要忘了结尾的`;`）
less 可以继承多个类，用`,`分隔
在扩展类（被继承的类）后可以添加`all`关键字来实现相关组合选择器的继承(效果类似于 sass 中的继承)

```less
:extend('被继承的选择器或元素') ;
```

- 继承一个扩展类，不带`all`关键字

```less
.c:extend(.foo) {
  background: blue;
}

.foo {
  color: red;
}

.foo {
  .bar {
    line-height: 1.5;
  }
}
```

编译后：

```css
.c {
  background: blue;
}
.foo,
.c {
  color: red;
}
.foo .bar {
  line-height: 1.5;
}
```

- 继承多个扩展类，带`all`关键字

```less
.c:extend(.foo all, .baz) {
  background: blue;
}

.foo {
  color: red;
}

.foo {
  .bar {
    line-height: 1.5;
  }
}

nav {
  .baz {
    font-size: 1.2rem;
  }
}

.baz {
  border: 1px solid green;
}
```

编译后：

```css
.c {
  background: blue;
}
.foo,
.c {
  color: red;
}
.foo .bar,
.c .bar {
  line-height: 1.5;
}
nav .baz {
  font-size: 1.2rem;
}
.baz,
.c {
  border: 1px solid green;
}
```

### 继承附加到选择器上

继承可以写在选择器后面，并且可以有多个继承，但是所有继承必须写在选择器的末尾。

- 允许在继承内扩展类为组合选择器，多个组合选择器用`,`分隔
- 在选择器后面的继承：`pre:hover:extend(div pre)`
- 选择器和继承之前允许有空格：`pre:hover :extend(div pre)`
- 允许有多个继承：`pre:hover:extend(div pre):extend(.bucket tr)`，
  等同于`pre:hover:extend(div pre,.bucket tr)`

### 在规则集内的继承

结合`&`与群组选择器实现多个选择器的继承

```less
pre:hover,
.some-class {
  &:extend(div pre);
}

//======华丽的分割线============
// 等同于上面的效果
pre:hover:extend(div pre),
.some-class:extend(div pre) {
}
```

### 继承匹配规则

less 中的继承是完全匹配，即使它们的含义相同也不会匹配。但是属性选择器中的引号（`''`和`""`）是个例外，less 会匹配引号内的内容是否相同。
以下情况都不会匹配：

- 例 1：

```less
.a.class,
.class.a,
.class > .a {
  color: blue;
}
.test:extend(.class) {
} // this will NOT match the any selectors above
```

- 例 2：

```less
*.class {
  color: blue;
}
.noStar:extend(.class) {
} // this will NOT match the *.class selector
```

- 例 3：

```less
link:hover:visited {
  color: blue;
}
.selector:extend(link:visited:hover) {
}
```

- 例 4：

```less
:nth-child(1n + 3) {
  color: blue;
}
.child:extend(:nth-child(n + 3)) {
}
```

- 例 5：属性选择器中的引号

```less
[title="identifier"] {
  color: blue;
}
[title="identifier"] {
  color: blue;
}
[title="identifier"] {
  color: blue;
}

.noQuote:extend([title="identifier"]) {
}
.singleQuote:extend([title="identifier"]) {
}
.doubleQuote:extend([title="identifier"]) {
}
```

编译后：

```css
[title="identifier"],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}

[title="identifier"],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}

[title="identifier"],
.noQuote,
.singleQuote,
.doubleQuote {
  color: blue;
}
```

### 继承与变量插值

继承可以附加到插值选择器上,或将插值选择器作为扩展类

- 继承附加到插值选择器上

```less
.bucket {
  color: blue;
}
@{variable}:extend(.bucket) {
}
@variable: .selector;
```

编译后：

```css
.bucket,
.selector {
  color: blue;
}
```

- 插值选择器作为扩展类，被继承

```less
@variable: .bucket;
// interpolated selector
@{variable} {
  color: blue;
}
.some-class:extend(.bucket) {
  ...
}
// 或者
.bucket {
  color: blue;
}

.some-class:extend(@{variable}) {
  ...
} 
@variable: .bucket;
```

编译后：

```css
.bucket {
  color: blue;
}
```

### 继承与`@media`

- 继承只会继承当前查询的`@media`域内的选择器，不会继承外部,或子查询`@media`的选择器

```less
@media screen {
  // extend inside media
  .screenClass:extend(.selector) {
    ...
  } 

  @media (min-width: 1023px) {
     // ruleset inside nested media - extend ignores it
    .selector {
      color: blue;
    }
  }
}

// ruleset on top of style sheet - extend ignores it
.selector {
  color: red;
}
```

编译后：

```css
@media screen {
}
@media screen and (min-width: 1023px) {
  .selector {
    color: blue;
  }
}
.selector {
  color: red;
}
```

- 顶级继承会包含查询`@media`内的所有选择器

```less
@media screen {
  // ruleset inside nested media - top level extend works
  .selector {
    color: blue;
  }

  @media (min-width: 1023px) {
     // ruleset inside nested media - top level extend works
    .selector {
      color: blue;
    }
  }
}

// top level extend matches everything
.topLevel:extend(.selector) {
}
```

编译后：

```css
@media screen {
  .selector,
  .topLevel {
    color: blue;
  }
}
@media screen and (min-width: 1023px) {
  .selector,
  .topLevel {
    color: blue;
  }
}
```
