# Sass

[官网](https://sass-lang.com/)：https://sass-lang.com/
[中文网](https://www.sass.hk/guide/)：https://www.sass.hk/guide/

# 简介

2007 年诞生，最早也是最成熟的 CSS 预处理器，拥有 ruby 社区的支持和 compass 这一最强大的 css 框架，目前受 LESS 影响，已经进化到了全面兼容 CSS 的 SCSS。

# sass 基础

Sass 有两种语法格式：
一种以`.scss`为后缀名：这种是最常用的，这种格式是在 css3 的语法基础上进行了扩展，所有 css3 的语法在 SCSS 中都是通用的。
一个以`.sass`为后缀名：被称为缩进式，它使用“缩进”代替“花括号”表示属性属于某个选择器，用“换行”代替“分号”分隔属性。

## 变量

变量用于定义一个属性值
变量是可以定义在选择器内，变量拥有域的概念，当一个变量定义在选择器内它的子选择器可以使用它，它的父选择器不可以使用它。
变量必须先定义再使用，后定义的同名变量会覆盖前面变量的值。当使用一个变量时会向上冒泡查找离它最近的一个已定义的同名变量，后定义的变量不会对其产生影响。
变量可以引用其他变量，定义一组值，这组值在 sass 中被称为`list`。
如下：

1. 定义变量：使用`$`符定义一个变量

tips:在定义和使用变量时`-`和`_`是可以相互使用的，比如：当定义了一个变量`$primary-color`在使用的它的时候可以使用`$primary_color`

```scss
$primary-color: #f40;
// 定义了一个list
$primary-border: 1px solid $primary-color;
```

2. 使用变量：

```scss
div.box {
  color: $primary-color;
}
h1.page-header {
  border: 1px solid $primary-color;
}
h1.page-header {
  border: $primary-border;
}
```

### 默认变量值

在变量定义时在变量值后使用`!default`关键字，来定义一个默认变量值。
默认变量值的作用是当这个变量被定义了，使用其定义的变量值，否则使用当前的默认变量值。

```scss
$link-color: red;
$link-color: blue !default;

a {
  color: $link-color;
}
```

```css
a {
  color: red;
}
```

## 嵌套（选择器）

sass 通过嵌套来实现 css 的选择器的功能
tips:css 中的选择器在 sass 中依然有效

```scss
#content {
  article {
    h1 {
      color: #333;
    }
    p {
      margin-bottom: 1.4em;
    }
  }
  aside {
    background-color: #eee;
  }
}
```

编译后：

```css
#content article h1 {
  color: #333;
}
#content article p {
  margin-bottom: 1.4em;
}
#content aside {
  background-color: #eee;
}
```

### 嵌套时调用父选择器

在嵌套时使用`&`符可以调用父选择器

```scss
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

```scss
.container {
  h1,
  h2,
  h3 {
    margin-bottom: 8px;
  }
}

nav,
aside {
  a {
    color: blue;
  }
}
```

编译后：

```css
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

### 属性的嵌套

属性嵌套规则：把属性名从中划线`-`的地方断开，在根属性后边添加一个冒号`:`，紧跟一个`{ }`块，把子属性部分写在这个`{ }`块中。

```scss
body {
  font: {
    family: Helvatica, Arial, sans-serif;
    size: 15px;
    weight: normal;
  }
}

.nav {
  border: 1px solid #f40 {
    left: 0;
    right: 0;
  }
}
```

编译后：

```css
body {
  font-family: Helvatica, Arial, sans-serif;
  font-size: 15px;
  font-weight: normal;
}

.nav {
  border: 1px solid #f40;
  border-left: 0;
  border-right: 0;
}
```

## 混合

混合用于重用样式代码
混合必须先定义再使用，同名混合后面定义的会覆盖前面的（这与 less 相差甚远）。在使用混合时，会向上冒泡找到离它最近的同名混合，在它之后定义的同名混合不会对其造成影响。
tips：当一个混合器内只有 css 规则没有属性的话，就可以在 css 规则外调用

1. 定义混合:

```scss
@mixin 名字（参数1，参数2...）{
   ...
  }
```

2. 使用混合：

```scss
@include 名字(参数1，参数2...);
```

当一个混合没有参数可以省略混合名后面`()`

```scss
// 无参定义
@mixin alert {
  color: #8a6d3b;
  background-color: #fcf8e3;
  a {
    color: #724a04;
  }
}
//无参调用
.alert-warning {
  @include alert;
}
```

编译后：

```css
.alert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
}
.alert-warning a {
  color: #724a04;
}
```

### 混合中的参数

定义混合的参数就是定义一个没有赋值的变量

```scss
@mixin alert($text-color, $bg-color) {
  color: $text-color;
  background-color: $bg-color;
  a {
    color: #724a04;
  }
}

// 不指定参数调用，需按照参数定义的顺序
.alert-warning {
  @include alert(#8a6d3b, #fcf8e3);
}

//指定参数调用，这时候参数的调用顺序就不重要了
.alert-warning {
  @include alert($bg-color: #fcf8e3, $text-color: #8a6d3b);
}
```

编译后：

```css
.alert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
}
.alert-warning a {
  color: #724a04;
}

.alert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
}
.alert-warning a {
  color: #724a04;
}
```

### 混合参数默认值

我们在定义混合时，可以为参数设置一个默认值，当调用这个混合没有给该参数传值时，将使用该参数设置的默认值。
没有设置默认值的参数必须定义在设置了默认值的参数前

```scss
@mixin link-colors($normal, $hover: red, $visited: green) {
  color: $normal;
  &:hover {
    color: $hover;
  }
  &:visited {
    color: $visited;
  }
}

a {
  @include link-colors(blue);
}
```

编译后：

```css
a {
  color: blue;
}
a:hover {
  color: red;
}
a:visited {
  color: green;
}
```

## 继承

让你的选择器拥有来自其他的选择器或元素中的样式
在选择器中使用`@extend`关键字来继承另一个选择器内定义的所有样式

tips:
除了继承类还可以继承元素，尽管默认的浏览器样式不会被继承（因为它们不属于样式表中的样式），但样式表中对元素添加的样式都会被继承
当一个选择器 A 继承另一个元素或选择器 B,与 A 相关的组合选择器也会继承与 B 相关的组合选择器
一个规则内可以写多个继承，这样这个选择器就继承了多个其他的选择器或元素
被继承的选择器或元素无需定义在继承它的元素前
无法继承选择器序列如：`#main .error`，会报语法错误

**注意**：继承会引起 css 样式层叠的问题

```scss
// 继承一个类
.info .error {
  border: 1px solid red;
  background-color: #fdd;
  a {
    color: red;
  }
}
.seriousError {
  @extend .error;
  border-width: 3px;
}

// 继承一个元素
.disable {
  color: grey;
  @extend a;
}

a {
  &:hover {
    color: blue;
  }
}

a span {
  font-size: 15px;
}
```

```css
.info .error,
.info .seriousError {
  border: 1px solid red;
  background-color: #fdd;
}
.info .error a,
.info .seriousError a {
  color: red;
}

.seriousError {
  border-width: 3px;
}

/* 分隔符=========== */

.disable {
  color: grey;
}

a:hover,
.disable:hover {
  color: blue;
}

a span,
.disable span {
  font-size: 15px;
}
```

### 复杂继承

复杂类名的继承

```scss
#main .seriousError {
  font-size: 18px;
  @extend .error;
}

.error {
  color: red;
}

a.error {
  &:hover {
    color: blue;
  }
}
```

编译后

```css
#main .seriousError {
  font-size: 18px;
}

.error,
#main .seriousError {
  color: red;
}

a.error:hover,
#main a.seriousError:hover {
  color: blue;
}
```

## 注释

多行注释:在编译输出时保留，在压缩输出时会去掉

<pre>
/*
*天王盖地虎
*宝塔镇河妖
*/
</pre>

单行注释：不会出现在编译后的 css 文件中
//你脸红个泡泡茶壶

强制注释：会一直出现在编译后的 css 文件中

<pre>
/*!
*天王盖地虎
*宝塔镇河妖
*/
</pre>

## 导入

扩展了 css 原本的`@import`功能，可以用于导入其他的 sass 文件，最终编译成一个 css 文件。

tips:
- 导入时可以省略文件后缀名
- 当导入的 scss 文件以`_`开头，这样 sass 就不会将其编译成一个单独的 css 文件，而是编译成导入它的文件的一部分。在导入时可以去除文件的下划线和后缀名。
- 在`.scss`可以导入`.sass`为后缀名的 sass 文件，反之亦然。
- 可以导入多个文件，以`,`分割，分号结束。

### 嵌套导入

sass 允许`@import`命令写在 css 规则内。这种导入方式下，生成对应的 css 文件时，导入的文件会被直接插入到 css 规则内导入它的地方。
被导入文件中定义的所有变量和混合器，也会在这个规则范围内生效，这些变量和混合不会全局生效。

### sass 中的原生 css`@import`导入

- 导入已`.css`为后缀名的文件
- 导入的是一个 url 地址如`htpp://`或`https://`
- 导入的是一个 url，写`url()`
- 导入时有媒体查询

```scss
SCSS SYNTAX
@import "theme.css";
@import "http://fonts.googleapis.com/css?family=Droid+Sans";
@import url(theme);
@import "landscape" screen and (orientation: landscape);
```

## 数据类型

- number（数字）：5px,2em,50%都被认为是数字可以直接运算，单位不同不能在一起运算
- string（字符串）：用带引号的字符串连接一个带引号或不带引号的字符串得到一个带引号的字符串，用一个不带引号的字符串连接一个带引号或不带引号的字符串得到一个不带引号的字符串。
- boolean（布尔值）：`and` `or` `not`
- list（列表）：列表中的值可以使用`空格`或者`,`分隔,定义一个列表`$list:(5px 10px) (5px 0)`
- map（映射）：定义一个 map`$map:(light:#fff,dark:#000)`

## 插值

使用`#{}`可以让我们把一个值插入到另一个值里面

```scss
$version: "1.0.1";
/*当前项目的版本号是#{$version}*/

$name: "info";
$attr: "border";

.alert-#{$name} {
  #{$attr}-color: #ccc;
}
```

编译后

```css
@charset "UTF-8";
/*当前项目的版本号是1.0.1*/
.alert-info {
  background-color: #ccc;
}
```

## 控制指令

### @if/@else if/@else

```scss
@if 条件 {
  ...
}@else if 条件 {
...
}@else {
  ...
}
```

```scss
$theme: "light";
body {
  @if $theme == "light" {
    background-color: white;
  } @else if $theme == "dark" {
    background-color: black;
  } @else {
    background-color: grey;
  }
}
```

编译后

```css
body {
  background-color: white;
}
```

### @for

```scss
// $var包含结束值
@for $var from <开始值> through <结束值>{
  ...
}
// $var不包含结束值
@for $var from <开始值> to <结束值>{
  ...
}
```

```scss
$columns: 4;

@for $i from 1 through $columns {
  .col-#{$i} {
    width: 100% / $columns * $i;
  }
}
```

编译后

```css
.col-1 {
  width: 25%;
}

.col-2 {
  width: 50%;
}

.col-3 {
  width: 75%;
}

.col-4 {
  width: 100%;
}
```

```scss
$columns: 4;

@for $i from 1 to $columns {
  .col-#{$i} {
    width: 100% / $columns * $i;
  }
}
```

编译后

```css
.col-1 {
  width: 25%;
}

.col-2 {
  width: 50%;
}

.col-3 {
  width: 75%;
}
```

### @each

```scss
@each $var in $list {
  ...
}
```

```scss
$icons: success error warning;

@each $icon in $icons {
  icon-#{$icon} {
    background-image: url(../images/icons/#{$icon}.png);
  }
}
```

```css
icon-success {
  background-image: url(../images/icons/success.png);
}

icon-error {
  background-image: url(../images/icons/error.png);
}

icon-warning {
  background-image: url(../images/icons/warning.png);
}
```

### @while

```scss
@while 条件 {
  ...
}
```

```scss
$i: 6;
@while $i>0 {
  .item-#{$i} {
    width: 5px * $i;
  }
  $i: $i - 2;
}
```

```css
.item-6 {
  width: 30px;
}

.item-4 {
  width: 20px;
}

.item-2 {
  width: 10px;
}
```

## 自定义函数

```scss
@function 名称 （参数1，参数2...）{
  ...
  // 可选
  @return 返回结果
}
```

```scss
$colors: (
  light: #fff,
  dark: #000,
);

@function getColor($key) {
  @return map-get($colors, $key);
}

body {
  background-color: getColor(light);
}
```

```css
body {
  background-color: #fff;
}
```

## 警告与错误

警告`@warn`：会在命令行打印相关信息,不会中断后续文件的编译；
错误`@error`：会直接中断文件的编译，css 文件中报错，提示错误信息，sass 代码不会编译成 css 代码。

```scss
$colors: (
  light: #fff,
  dark: #000,
);
@function getColor($key) {
  @if not map-has-key($colors, $key) {
    @warn $colors中没有#{$key}这个key;
  }

  @return map-get($colors, $key);
}
```
