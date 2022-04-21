# stylus

[官网](https://stylus-lang.com/)：https://stylus-lang.com/
[中文网](https://stylus-lang.net/):https://stylus-lang.net/

# 简介

2010 年产生，来自 Node.js 社区，主要用来给 Node 项目进行 CSS 预处理支持，在此社区之内有一定支持者，在广泛的意义上人气还完全不如 SASS 和 LESS。

# stylus 基础

stylus 以`.styl`作为文件后缀名。以缩进和换行代替`{}`和`;`。

## 选择器

```stylus
body
  color white
//或者加上冒号`:`，便于阅读
body
  color: white
```

编译后：

```css
body {
  color: #fff;
}
```

stylus 允许使用`,`将选择器分开，为多个选择器同时定义属性

```stylus
textarea, input
  border 1px solid #eee

//与上面的效果是一样的
textarea
input
  border 1px solid #eee
```

编译后：

```css
textarea,
input {
  border: 1px solid #eee;
}
```

### 父级引用

字符`&`指向符选择器

```stylus
article a
  color: blue
  &:hover
    color: red
```

编译后：

```css
article a {
  color: #00f;
}
article a:hover {
  color: #f00;
}
```

## 变量

使用`=`定义一个变量，`变量名 = 变量值`
变量名或函数可以包含`$`字符
变量必须先定义再使用（与 sass 相同，与 less 相差甚远），当使用一个变量时会向上找离它最近的一个已定义的同名变量，后定义的同名变量会覆盖前面变量的值。

```stylus
$font-size = 14px
font = $font-size "Lucida Grande", Arial

body
  font font sans-serif
```

编译后：

```css
body {
  font: 14px "Lucida Grande", Arial sans-serif;
}
```

变量相关规则

```stylus
color = blue
.block
  color color
  color = green
  .inner
    background-color: color
    color = red
```

编译后：

```css
.block {
  color: #00f;
}
.block .inner {
  background-color: #008000;
}
```

### 属性查找

可以通过`@`引用一个属性的值，为其他属性赋值。会向上冒泡查找，直到找到或返回`null`，即使在同一个规则集内后定义的属性也不会被查找到（这与 less 有很大差异），同一个的规则内后定义的属性值覆盖前面的属性值。

```stylus
.block
  color: red;
  .inner
    background-color: @color
    color red
  color: blue;

/*======分割线======*/

.block
  color: red;
  .inner
    color green
    background-color: @color
    color red
  color: blue;
```

编译后：

```css
.block {
  color: #f00;
  color: #00f;
}
.block .inner {
  background-color: #00f;
  color: #f00;
}
/*======分割线======*/
.block {
  color: #f00;
  color: #00f;
}
.block .inner {
  color: #008000;
  background-color: #008000;
  color: #f00;
}
```

## 插值

使用`{}`字符包围表达式来插入值，例如`-webkit-{'border' + '-radius'}`等同于`-webkit-border-redius`。

```stylus
images = "../images"
name = "info";
attr = "border";

.alert-{name} {
  {attr}-color: #ccc;
  background:url('{images}/white-sand.png')
}
```

编译后：

```css
.alert-info {
  border-color: #ccc;
  background: url("{images}/white-sand.png");
}
```

## 运算符
下面是运算符优先级，从高到低
```
[]
! ~ + -
is defined
** * / %
+ -
... ..
<= >= < >
in
== is != is not isnt
is a
&& and || or
?:
= := ?= += -= *= /= %=
not
if unless
```

## 混合
用于样式重用
tips：当一个混合器内只有 css 选择器没有属性的话，就可以在 css 规则外调用
混合可以省略`()`调，但是无参数调用必须加上`()`
```stylus
//定义混合
alert()
  color: #8a6d3b
  background-color: #fcf8e3
  a
    color: #724a04

border(px,bd,color)
	border px bd color

//调用混合
.alert-warning { 
  //无参调用
  alert()
  //省略括号调用
  border 1px solid red
}
```

编译后：
```css
.alert-warning {
  color: #8a6d3b;
  background-color: #fcf8e3;
  border: 1px solid #f00;
}
.alert-warning a {
  color: #724a04;
}
```

### 多参数混合
混合允许定义多个参数每个参数用`,`分隔，调用的时候在`()`内用`,`分隔不同的参数，如果省略`()`用空格分隔每一个参数。
关键字`arguments`可以获取到混合的所有参数，`arguments`是不定参数，此时定义混合的参数是没有意义的
当调用多个参数的混合时，参数可以多传不可以少传
```stylus
border-radius()
  -webkit-border-radius arguments
  -moz-border-radius arguments
  border-radius arguments

.nav
  border-radius 1px 2px / 3px 4px
```

编译后：
```css
.nav {
  -webkit-border-radius: 1px 2px/3px 4px;
  -moz-border-radius: 1px 2px/3px 4px;
  border-radius: 1px 2px/3px 4px;
}
```

### 剩余参数

## 方法

## 注释

## 条件

## 循环

## 指令



