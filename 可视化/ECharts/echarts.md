[^_^]: 教程 -----> 配置项
[^_^]:教程：ECharts 中的样式简介

# echarts

[toc]

## 认识 ECharts

1. 什么是 echarts?
   数据可视化库
2. echarts 能做什么？
   echarts 的五大核心：动态叙事、视觉设计、交互能力、开发体验、可访问性。

### ECharts 基础概念概览

1. <font color="#c7254e" size=4>echarts 实例</font>：一个网页中可以创建多个 <mark style="background-color:#f4f4f4; color:#c7254e;">echarts 实例</mark>。每个<mark style="background-color:#f4f4f4; color:#c7254e;">echarts 实例</mark> 中可以创建多个图表和坐标系等等（用 <mark style="background-color:#f4f4f4; color:#c7254e;">option</mark> 来描述）。准备一个 DOM 节点（作为 echarts 的渲染容器），就可以在上面创建一个 echarts 实例。每个 echarts 实例独占一个 DOM 节点。

2. <font color="#c7254e" size=4>用 option 描述图表</font>：上面已经出现了 <mark style="background-color:#f4f4f4; color:#c7254e;">option</mark> 这个概念。echarts 的使用者，使用 <mark style="background-color:#f4f4f4; color:#c7254e;">option</mark> 来描述其对图表的各种需求，包括：有什么数据、要画什么图表、图表长什么样子、含有什么组件、组件能操作什么事情等等。简而言之，<mark style="background-color:#f4f4f4; color:#c7254e;">option</mark> 表述了：<mark style="background-color:#f4f4f4; color:#c7254e;">数据</mark>、<mark style="background-color:#f4f4f4; color:#c7254e;">数据如何映射成图形</mark>、<mark style="background-color:#f4f4f4; color:#c7254e;">交互行为</mark>。

3. <font color="#c7254e" size=4>系列（series）</font>：在 echarts 里，<mark style="background-color:#f4f4f4; color:#c7254e;">系列</mark>（<font color="#337ab7">series</font>）是指：一组数值以及他们映射成的图。
   echarts 里系列类型（<mark style="background-color:#f4f4f4; color:#c7254e;">series.type</mark>）就是图表类型。系列类型（<mark style="background-color:#f4f4f4; color:#c7254e;">series.type</mark>)至少有：<font color="#337ab7">line</font>（折线图）、<font color="#337ab7">bar</font>（柱状图）、<font color="#337ab7">pie</font>（饼图）、<font color="#337ab7">scatter</font>（散点图）、<font color="#337ab7">graph</font>（关系图）、<font color="#337ab7">tree</font>（树图）、...
   每个系列中有他所需要的数据（<font color="#337ab7">series.data</font>），系列的数据还可以从 <font color="#337ab7">dataset</font> 中取。

4. <font color="#c7254e" size=4>坐标系</font>：很多系列，例如 <font color="#337ab7">line</font>（折线图）、<font color="#337ab7">bar</font>（柱状图）、<font color="#337ab7">scatter</font>（散点图）、<font color="#337ab7">heatmap</font>（热力图）等等，需要运行在 “坐标系” 上。坐标系用于布局这些图，以及显示数据的刻度等等。
   echarts 中至少支持这些坐标系：<font color="#337ab7">直角坐标系</font>、<font color="#337ab7">极坐标系</font>、<font color="#337ab7">地理坐标系（GEO）</font>、<font color="#337ab7">单轴坐标系</font>、<font color="#337ab7">日历坐标系</font> 等。
   其他一些系列，例如 <font color="#337ab7">pie</font>（饼图）、<font color="#337ab7">tree</font>（树图）等等，并不依赖坐标系，能独立存在。
   还有一些图，例如 <font color="#337ab7">graph</font>（关系图）等，既能独立存在，也能布局在坐标系中，依据用户的设定而来。
   另外，一个系列，往往能运行在不同的坐标系中。例如，一个 <font color="#337ab7">scatter</font>（散点图）能运行在 <font color="#337ab7">直角坐标系</font>、<font color="#337ab7">极坐标系</font> 、<font color="#337ab7">地理坐标系（GEO）</font> 等各种坐标系中。同样，一个坐标系，也能承载不同的系列，如上面出现的各种例子，<font color="#337ab7">直角坐标系</font> 里承载了 <font color="#337ab7">line</font>（折线图）、<font color="#337ab7">bar</font>（柱状图）等等。

5. <font color="#c7254e" size=4>组件（component）</font>：echarts 中各种内容，被抽象为“组件”。例如，echarts 中至少有这些组件：<font color="#337ab7">xAxis</font>（直角坐标系 X 轴）、<font color="#337ab7">yAxis</font>（直角坐标系 Y 轴）、<font color="#337ab7">grid</font>（直角坐标系底板）、<font color="#337ab7">angleAxis</font>（极坐标系角度轴）、<font color="#337ab7">radiusAxis</font>（极坐标系半径轴）、<font color="#337ab7">polar</font>（极坐标系底板）、<font color="#337ab7">geo</font>（地理坐标系）、<font color="#337ab7">dataZoom</font>（数据区缩放组件）、<font color="#337ab7">visualMap</font>（视觉映射组件）、<font color="#337ab7">tooltip</font>（提示框组件）、<font color="#337ab7">toolbox</font>（工具栏组件）、<font color="#337ab7">series</font>（系列）、...
   我们注意到，其实系列（<font color="#337ab7">series</font>）也是一种组件，可以理解为：系列是专门绘制“图”的组件。注：因为系列是一种特殊的组件，所以有时候也会出现 “组件和系列” 这样的描述，这种语境下的 “组件” 是指：除了 “系列” 以外的其他组件。

6. <font color="#c7254e" size=4>组件定位</font>：不同的组件、系列，常有不同的定位方式。

- 类 CSS 的绝对定位：多数组件和系列，都能够基于 <mark style="background-color:#f4f4f4; color:#c7254e;">top</mark> / <mark style="background-color:#f4f4f4; color:#c7254e;">right</mark> / <mark style="background-color:#f4f4f4; color:#c7254e;">down</mark> / <mark style="background-color:#f4f4f4; color:#c7254e;">left</mark> / <mark style="background-color:#f4f4f4; color:#c7254e;">width</mark> / <mark style="background-color:#f4f4f4; color:#c7254e;">height</mark> 绝对定位。 这种绝对定位的方式，类似于 <mark style="background-color:#f4f4f4; color:#c7254e;">CSS</mark> 的绝对定位（<mark style="background-color:#f4f4f4; color:#c7254e;">position: absolute</mark>）。绝对定位基于的是 echarts 容器 DOM 节点。
  - 绝对数值（例如 <mark style="background-color:#f4f4f4; color:#c7254e;">bottom: 54</mark> 表示：距离 echarts 容器底边界 <mark style="background-color:#f4f4f4; color:#c7254e;">54</mark> 像素）。
  - 或者基于 echarts 容器高宽的百分比（例如 <mark style="background-color:#f4f4f4; color:#c7254e;">right: '20%'</mark> 表示：距离 echarts 容器右边界的距离是 echarts 容器宽度的 <mark style="background-color:#f4f4f4; color:#c7254e;">20%</mark>）。
- 中心半径定位：少数圆形的组件或系列，可以使用“中心半径定位”，例如，<font color="#337ab7">pie</font>（饼图）、<font color="#337ab7">sunburst</font>（旭日图）、<font color="#337ab7">polar</font>（极坐标系）。
  中心半径定位，往往依据 <font color="#337ab7">center</font>（中心）、<font color="#337ab7">radius</font>（半径）来决定位置。

- 其他定位：少数组件和系列可能有自己的特殊的定位方式。

### Echarts 中的样式简介

如何自定义主题，并加载和注册：

  使用[主题编辑器](https://echarts.apache.org/zh/theme-builder.html)自定义主题。
  
  1.如果主题保存为 JSON 文件，那么可以自行加载和注册，例如：
  
  ```js
  // 假设主题名称是 "vintage"
  $.getJSON("xxx/xxx/vintage.json", function (themeJSON) {
    echarts.registerTheme("vintage", JSON.parse(themeJSON));
    var chart = echarts.init(dom, "vintage");
  });
  ```
  
  2.如果保存为 UMD 格式的 JS 文件，那么支持了自注册，直接引入 JS 文件即可：
  ```js
  // HTML 引入 vintage.js 文件后（假设主题名称是 "vintage"）
  var chart = echarts.init(dom, 'vintage');
  // ...
  ```

### 异步数据加载和更新

1.获取数据后再设置数据：

  ```js
  var myChart = echarts.init(document.getElementById('main'));

  $.get('data.json').done(function (data) {
      myChart.setOption({
          title: {
              text: '异步数据加载示例'
          },
          tooltip: {},
          legend: {
              data:['销量']
          },
          xAxis: {
              data: data.categories
          },
          yAxis: {},
          series: [{
              name: '销量',
              type: 'bar',
              data: data.data
          }]
      });
  });
  ```

2.先设置好一些空数据，获取数据后再更新数据：

  ```js
  var myChart = echarts.init(document.getElementById('main'));
  // 显示标题，图例和空的坐标轴
  myChart.setOption({
      title: {
          text: '异步数据加载示例'
      },
      tooltip: {},
      legend: {
          data:['销量']
      },
      xAxis: {
          data: []
      },
      yAxis: {},
      series: [{
          name: '销量',
          type: 'bar',
          data: []
      }]
  });

  // 异步加载数据
  $.get('data.json').done(function (data) {
      // 填入数据
      myChart.setOption({
          xAxis: {
              data: data.categories
          },
          series: [{
              // 根据名字对应到相应的系列
              name: '销量',
              data: data.data
          }]
      });
  });
  ```

#### loading 动画
如果数据加载时间较长，一个空的坐标轴放在画布上也会让用户觉得是不是产生 bug 了，因此需要一个 loading 的动画来提示用户数据正在加载。

ECharts 默认有提供了一个简单的加载动画。只需要调用 <font color='#337ab7'>showLoading</font> 方法显示。数据加载完成后再调用 <font color='#337ab7'>hideLoading</font> 方法隐藏加载动画。

#### 数据的动态更新

所有数据的更新都通过 setOption实现，你只需要定时获取数据，setOption 填入数据，而不用考虑数据到底产生了那些变化，ECharts 会找到两组数据之间的差异然后通过合适的动画去表现数据的变化。

### 使用dataset管理数据

1.以二维数组方式：
  ```js
  option = {
      legend: {},
      tooltip: {},
      dataset: {
          // 提供一份数据。
          source: [
              ['product', '2015', '2016', '2017'],
              ['Matcha Latte', 43.3, 85.8, 93.7],
              ['Milk Tea', 83.1, 73.4, 55.1],
              ['Cheese Cocoa', 86.4, 65.2, 82.5],
              ['Walnut Brownie', 72.4, 53.9, 39.1]
          ]
      },
      // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
      xAxis: {type: 'category'},
      // 声明一个 Y 轴，数值轴。
      yAxis: {},
      // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
      series: [
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'}
      ]
  }
  ```

2.以对象数组方式：

  ```js
  option = {
      legend: {},
      tooltip: {},
      dataset: {
          // 用 dimensions 指定了维度的顺序。直角坐标系中，
          // 默认把第一个维度映射到 X 轴上，第二个维度映射到 Y 轴上。
          // 如果不指定 dimensions，也可以通过指定 series.encode
          // 完成映射，参见后文。
          dimensions: ['product', '2015', '2016', '2017'],
          source: [
              {product: 'Matcha Latte', '2015': 43.3, '2016': 85.8, '2017': 93.7},
              {product: 'Milk Tea', '2015': 83.1, '2016': 73.4, '2017': 55.1},
              {product: 'Cheese Cocoa', '2015': 86.4, '2016': 65.2, '2017': 82.5},
              {product: 'Walnut Brownie', '2015': 72.4, '2016': 53.9, '2017': 39.1}
          ]
      },
      xAxis: {type: 'category'},
      yAxis: {},
      series: [
          {type: 'bar'},
          {type: 'bar'},
          {type: 'bar'}
      ]
  };
  ```
#### 数据到图形的映射
我们制作数据可视化图表的逻辑是这样的：基于数据，在配置项中指定如何映射到图形。

概略而言，可以进行这些映射：

  - 指定 dataset 的列（column）还是行（row）映射为图形系列（series）。这件事可以使用 <font color='#337ab7'>series.seriesLayoutBy</font> 属性来配置。默认是按照列（column）来映射。
  - 指定维度映射的规则：如何从 dataset 的维度（一个“维度”的意思是一行/列）映射到坐标轴（如 X、Y 轴）、提示框（tooltip）、标签（label）、图形元素大小颜色等（visualMap）。这件事可以使用 <font color='#337ab7'>series.encode</font> 属性，以及 <font color='#337ab7'>visualMap</font> 组件（如果有需要映射颜色大小等视觉维度的话）来配置。如果没有给出这种映配置，那么 ECharts 就按最常见的理解进行默认映射：X 坐标轴声明为类目轴，默认情况下会自动对应到dataset.source 中的第一列；  每个系列中的data一一对应到 dataset.source 中后面每一列。

##### 把数据集（ dataset ）的行或列映射为系列（series）
有了数据表之后，使用者可以灵活得配置：数据如何对应到轴和图形系列。

用户可以使用 <mark style="background-color:#f4f4f4; color:#c7254e;">seriesLayoutBy</mark> 配置项，改变图表对于行列的理解。<mark style="background-color:#f4f4f4; color:#c7254e;">seriesLayoutBy</mark> 可取值：

- 'column': 默认值。系列被安放到 <mark style="background-color:#f4f4f4; color:#c7254e;">dataset</mark> 的列上面。
- 'row': 系列被安放到 <mark style="background-color:#f4f4f4; color:#c7254e;">dataset</mark> 的行上面。

##### 维度与数据到图形的映射
- 维度：常用图表所描述的数据大部分是“二维表”结构，我们都使用二维数组来容纳二维表。现在，当我们把系列（series）对应到“列”的时候，那么每一列就称为一个“维度（dimension）”，而每一行称为数据项（item）。反之，如果我们把系列（series）对应到表行，那么每一行就是“维度（dimension）”，每一列就是数据项（item）。
 
 - 维度名：维度可以有单独的名字，便于在图表中显示。维度名（dimension name）可以在定义在 dataset 的第一行（或者第一列）。从第二行开始，才是正式的数据。<mark style="background-color:#f4f4f4; color:#c7254e;">dataset.source</mark> 中第一行（列）到底包含不包含维度名，ECharts 默认会自动探测。当然也可以设置 <mark style="background-color:#f4f4f4; color:#c7254e;">dataset.sourceHeader: true</mark> 显示声明第一行（列）就是维度，或者 <mark style="background-color:#f4f4f4; color:#c7254e;">dataset.sourceHeader: false</mark> 表明第一行（列）开始就直接是数据。

- 维度的定义，也可以使用单独的  <mark style="background-color:#f4f4f4; color:#c7254e;">dataset.dimensions</mark> 或者  <mark style="background-color:#f4f4f4; color:#c7254e;">series.dimensions</mark> 来定义，这样可以同时指定维度名，和维度的类型（dimension type）：
    ```js
    var option1 = {
        dataset: {
            dimensions: [
                {name: 'score'},
                // 可以简写为 string，表示维度名。
                'amount',
                // 可以在 type 中指定维度类型。
                {name: 'product', type: 'ordinal'}
            ],
            source: [...]
        },
        ...
    };

    var option2 = {
        dataset: {
            source: [...]
        },
        series: {
            type: 'line',
            // 在系列中设置的 dimensions 会更优先采纳。
            dimensions: [
                null, // 可以设置为 null 表示不想设置维度名
                'amount',
                {name: 'product', type: 'ordinal'}
            ]
        },
        ...
    ```
- 维度类型（dimension type）可以取这些值：

    - <mark style="background-color:#f4f4f4; color:#c7254e;">'number'</mark>: 默认，表示普通数据。
    - <mark style="background-color:#f4f4f4; color:#c7254e;">'ordinal'</mark>: 对于类目、文本这些 string 类型的数据，如果需要能在数轴上使用，须是 'ordinal' 类型。ECharts 默认会自动判断这个类型。但是自动判断也是不可能很完备的，所以使用者也可以手动强制指定。
    - <mark style="background-color:#f4f4f4; color:#c7254e;">'time'</mark>: 表示时间数据。设置成 <mark style="background-color:#f4f4f4; color:#c7254e;">'time'</mark> 则能支持自动解析数据成时间戳（timestamp），比如该维度的数据是 '2017-05-10'，会自动被解析。如果这个维度被用在时间数轴（<font color='#337ab7'>axis.type</font> 为 <mark style="background-color:#f4f4f4; color:#c7254e;">'time'</mark>）上，那么会被自动设置为<mark style="background-color:#f4f4f4; color:#c7254e;">'time'</mark> 类型。
    - <mark style="background-color:#f4f4f4; color:#c7254e;">'float'</mark>: 如果设置成 <mark style="background-color:#f4f4f4; color:#c7254e;">'float'</mark>，在存储时候会使用 <mark style="background-color:#f4f4f4; color:#c7254e;">TypedArray</mark>，对性能优化有好处。
    - <mark style="background-color:#f4f4f4; color:#c7254e;">'int'</mark>: 如果设置成 <mark style="background-color:#f4f4f4; color:#c7254e;">'int'</mark>，在存储时候会使用 <mark style="background-color:#f4f4f4; color:#c7254e;">TypedArray</mark>，对性能优化有好处。

了解了维度的概念后，我们就可以使用 encode 来做映射。总体是这样的感觉：
    ```js
    var option = {
        dataset: {
            source: [
                ['score', 'amount', 'product'],
                [89.3, 58212, 'Matcha Latte'],
                [57.1, 78254, 'Milk Tea'],
                [74.4, 41032, 'Cheese Cocoa'],
                [50.1, 12755, 'Cheese Brownie'],
                [89.7, 20145, 'Matcha Cocoa'],
                [68.1, 79146, 'Tea'],
                [19.6, 91852, 'Orange Juice'],
                [10.6, 101852, 'Lemon Juice'],
                [32.7, 20112, 'Walnut Brownie']
            ]
        },
        xAxis: {},
        yAxis: {type: 'category'},
        series: [
            {
                type: 'bar',
                encode: {
                    // 将 "amount" 列映射到 X 轴。
                    x: 'amount',
                    // 将 "product" 列映射到 Y 轴。
                    y: 'product'
                }
            }
        ]
    };
    ```

<mark style="background-color:#f4f4f4; color:#c7254e;">series.encode</mark<mark style="background-color:#f4f4f4; color:#c7254e;">> 声明的基本结构如下，其中冒号左边是坐标系、标签等特定名称，如 <mark style="background-color:#f4f4f4; color:#c7254e;">'x'</mark>, <mark style="background-color:#f4f4f4; color:#c7254e;">'y'</mark>, <mark style="background-color:#f4f4f4; color:#c7254e;">'tooltip'</mark> 等，冒号右边是数据中的维度名（string 格式）或者维度的序号（number 格式，从 0 开始计数），可以指定一个或多个维度（使用数组）。通常情况下，下面各种信息不需要所有的都写，按需写即可。

下面是 <mark style="background-color:#f4f4f4; color:#c7254e;">series.encode</mark> 支持的属性：
  ```js
    // 在任何坐标系和系列中，都支持：
    encode: {
        // 使用 “名为 product 的维度” 和 “名为 score 的维度” 的值在 tooltip 中显示
        tooltip: ['product', 'score']
        // 使用 “维度 1” 和 “维度 3” 的维度名连起来作为系列名。（有时候名字比较长，这可以避免在 series.name 重复输入这些名字）
        seriesName: [1, 3],
        // 表示使用 “维度2” 中的值作为 id。这在使用 setOption 动态更新数据时有用处，可以使新老数据用 id 对应起来，从而能够产生合适的数据更新动画。
        itemId: 2,
        // 指定数据项的名称使用 “维度3” 在饼图等图表中有用，可以使这个名字显示在图例（legend）中。
        itemName: 3
    }

    // 直角坐标系（grid/cartesian）特有的属性：
    encode: {
        // 把 “维度1”、“维度5”、“名为 score 的维度” 映射到 X 轴：
        x: [1, 5, 'score'],
        // 把“维度0”映射到 Y 轴。
        y: 0
    }

    // 单轴（singleAxis）特有的属性：
    encode: {
        single: 3
    }

    // 极坐标系（polar）特有的属性：
    encode: {
        radius: 3,
        angle: 2
    }

    // 地理坐标系（geo）特有的属性：
    encode: {
        lng: 3,
        lat: 2
    }

    // 对于一些没有坐标系的图表，例如饼图、漏斗图等，可以是：
    encode: {
        value: 3
    }
  ```
## ECharts 的配置项
