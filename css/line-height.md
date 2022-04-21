# line-height
## line-height与基线的关系
## 为什么一般网站line-height为数值
1. 首先line-height的值可以有五种方式分别是：
* 关键字：比如normal，根据浏览器，及字体（主要是字体）不同normal的值也不同是字体在设计的时候就定好的
* 数值：比如1.5
* 百分比：比如150%
* px: 25px
* em: 5em
除了px取值其他取值都会根据font-size进行换算成px应用于line-height
2. 因为line-height为数值是数值是直接继承，而其他方式都是计算为px后再继承换算后的px值