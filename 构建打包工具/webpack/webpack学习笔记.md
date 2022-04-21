# webpack 学习笔记 {ignore}

[toc]

## webpack 是什么？

webpack 是基于模块化的打包（构建）工具，致力于解决前端的工程化问题，尤其是浏览器端工程化中遇到的问题；
webpack 把一切视为模块，通过一个开发时态的入口模块为起点，分析出所有的依赖关系，然后经过一系列的过程（合并，压缩），最终生成运行时态的文件。

## 安装 webpack

webpack 提供了两个包：

- webpack：核心包，包含了 webpack 构建过程中要用到的所有 api；
- webpack-cli：提供一个简单的 cli 命令，它调用了 webpack 核心包的 api，来完成构建过程

安装方式：

- 全局安装： 可以全局使用 webpack 命令，但是无法为不同项目对应不同的 webpack 版本
- 本地安装（推荐）：每个项目都使用自己的 webpack 版本进行构建

## webpack 的使用

- ```shell
  webpack
  ```

  默认情况下，webpack 会以`./src/index.js`作为入口文件分析依赖关系，打包到`./dist/main.js`文件中

  通过--mode 选项可以控制 webpack 的打包结果的运行环境

  - ```shell
    webpack --mode=development
    ```

    打包的开发环境，文件整洁，有提示功能，适合调试

  - ```shell
    webpack --mode = production
    ```
    打包到生产环境，文件已压缩，适合上线部署

## webpack 的模块兼容性

- 同一文件可以同时使用 CommonJS 模块标准和 ES6 模块标准导入文件。

- 同一文件不可以同时使用 CommonJS 标准和 ES6 模块标准导出文件，如果同时使用，将报错。

- 同一个文件不能使用 ES6 模块化标准导入文件同时使用 CommonJS 标准导出文件，如果同时使用，报错。原因：当模块中只有 CommonJS 导出时，`__webpack_require__`函数中的第二个形参是`exports`，但是当模块中出现 ES6 导出时，`__webpack_require__`函数的第二个形参是`__webpack_exports__`，此时模块中的`exports`未定义

## webpack 的编译过程

webpack 的作用是将源代码编译（构建、打包）成最终代码
![](assets/2020-01-09-10-26-15.png)

整个过程大致分为三个步骤：

1. 初始化
2. 编译
3. 输出
   ![](assets/2020-01-09-10-53-28.png)

### 初始化

此阶段，webpack 会将**CLI 参数**、**配置文件**、**默认配置**进行融合，形成一个最终的配置对象。

对配置的处理过程是依托一个第三方库`yargs`完成的

此阶段相对比较简单，主要是为接下来的编译阶段做必要的准备

目前，可以简单的理解为，初始化阶段主要用于产生一个最终的配置

### 编译

1. **创建 chunk**

chunk 是 webpack 在内部构建过程中的一个概念，译为`块`，它表示通过某个入口找到的所有依赖的统称。

根据入口模块（默认为`./src/index.js`）创建一个 chunk

![](assets/2020-01-09-11-54-08.png)

每个 chunk 都有至少两个属性：

- name：默认为 main
- id：唯一编号，开发环境和 name 相同，生产环境是一个数字，从 0 开始

2. **构建所有依赖模块**

![](assets/2020-01-09-12-32-38.png)

> AST 在线测试工具：https://astexplorer.net/

简图

![](assets/2020-01-09-12-35-05.png)

3. **产生 chunk assets**

在第二步完成后，chunk 中会产生一个模块列表，列表中包含了**模块 id**和**模块转换后的代码**

接下来，webpack 会根据配置为 chunk 生成一个资源列表，即`chunk assets`，资源列表可以理解为是生成到最终文件的文件名和文件内容

![](assets/2020-01-09-12-39-16.png)

> chunk hash 是根据所有 chunk assets 的内容生成的一个 hash 字符串
> hash：一种算法，具体有很多分类，特点是将一个任意长度的字符串转换为一个固定长度的字符串，而且可以保证原始内容不变，产生的 hash 字符串就不变

简图

![](assets/2020-01-09-12-43-52.png)

4. **合并 chunk assets**

将多个 chunk 的 assets 合并到一起，并产生一个总的 hash

![](assets/2020-01-09-12-47-43.png)

### 输出

此步骤非常简单，webpack 将利用 node 中的 fs 模块（文件处理模块），根据编译产生的总的 assets，生成相应的文件。

![](assets/2020-01-09-12-54-34.png)

### 总过程

![](assets/2020-01-09-15-51-07.png)

![](assets/2020-01-09-12-32-38.png)

**涉及术语**

1. module：模块，分割的代码单元，webpack 中的模块可以是任何内容的文件，不仅限于 JS
2. chunk：webpack 内部构建模块的块，一个 chunk 中包含多个模块，这些模块是从入口模块通过依赖分析得来的
3. bundle：chunk 构建好模块后会生成 chunk 的资源清单，清单中的每一项就是一个 bundle，可以认为 bundle 就是最终生成的文件
4. hash：最终的资源清单所有内容联合生成的 hash 值
5. chunkhash：chunk 生成的资源清单内容联合生成的 hash 值
6. chunkname：chunk 的名称，如果没有配置则使用 main
7. id：通常指 chunk 的唯一编号，如果在开发环境下构建，和 chunkname 相同；如果是生产环境下构建，则使用一个从 0 开始的数字进行编号

## webpack 的配置文件

webpack 默认配置文件为项目根目录下文件名为：`webpack.config.js`的文件，也可以通过命令行参数`--config`自定义配置文件

```shell
webpack --config <文件路径>
```

配置文件中通过 CommonJS 模块导出一个**配置对象**；或导出一个**函数**返回一个**配置对象**，函数接收**一个参数 env**，可以用于**区分环境**

在开始构建时，webpack 如果发现配置是一个函数，会调用该函数，并向该函数传入一个参数 env，该函数的值来自 webpack 命令中给 env 指定的值，webpack 会将该函数返回的对象作为配置内容，因此，开发者可以根据不同的环境返回不同的对象

```shell
  webpack --env abc # env:'abc'
  webpack --env.abc # env:{abc:true}
  webpack --env.abd=1 # env:{abc:1}
  webpack --env.abd=1 --env.bcd=2 # env:{abc:1,bcd:2}
```

**注意：配置文件中的代码，必须是有效的 node 代码**

命令行的参数比配置文件的配置优先级高，当命令行参数与配置文件中的配置出现冲突时，以命令行参数为准

### devtool 配置

优化调试体验：可以通过配置来决定是否生成 source map 文件，以及生成哪种 source map 文件来进行调试

### entry（入口） 配置

**注意**：入口真正配置的是 chunk。

- 语法：
  - 单个 chunk：当只有一个入口文件时，可以是一个字符串；当有多个入口文件时，是一个字符串数组。默认chunk名为`main`。
    ```js
    option = {
      entry: "./path/to/my/entry/file.js",
    };
    //或者
    option = {
      entry: [
        "./path/to/my/entry/file.js",
        "./path/to/my/entry/file1.js",
        "./path/to/my/entry/file2.js",
      ],
    };
    ```
  - 多个 chunk：入口还可以配置成一个对象，对象的`key`就是 chunk 名，对象的`value`就是入口文件，`value`同单个 chunk 相同可以配置成字符串，或者字符串数组。
    ```js
    option = {
      entry: {
        app: "./src/app.js",
        vendors: "./src/vendors.js",
      },
    };
    ```

### output（出口） 配置

**注意**：出口针对的是资源列表的文件名或路径的配置。即使存在多个入口起点，但是只指定一个输出配置。
文件名与路径可以是固定的

```js
option = {
  output: {
    filename: "bundle.js",
    path: "/home/proj/public/assets",
  },
};
```

也可以用占位符动态设置

```js
option = {
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
};
```

占位符：
name:chunkname,
hash:总资源的 hash
chunkhash：每一个 chunk 资源列表的 hash
id：chunk 的 id

### <mark>loader</mark>

loader 文件导出一个函数，函数有一个参数`sourceCode`是匹配的源码文件字符串，它的作用是将某个源码字符转换成另一个源码字符返回。
![](assets/2020-01-13-10-39-24.png)

loader 函数的将在模块解析的过程中被调用，以得到最终的源码。
![](assets/2020-01-13-09-35-44.png)

处理 loader 流程
![](assets/2020-01-13-10-29-54.png)

**注意** loader 的运行顺序与 loaders 数组的顺序相反

loader 的完整配置：

```js
option = {
  module: {
    //针对模块的配置
    rules: [
      //模块匹配规则，可以存在多个规则
      {
        //每一个规则是一个对象
        test: /\.js$/, //匹配的模块正则
        use: [
          //匹配后应用的规则模块
          {
            //其中的一个模块
            loader: "模块路径", //模块路径
            options: {
              //向对应的loader文件传递的额外参数，可以在文件中的this.loaders.query中获取。
              //注意，在loader文件中单独输出this报错，this的相关属性，参见：https://www.webpackjs.com/api/loaders/#this-request
            },
          },
        ],
      },
    ],
  },
};
```

简化配置：

```js
option = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["模块1路径", "模块2路径?参数=aaa&参数1=bbb"], //模块的路径，其中可以通过参数的形式向loader文件传递额外参数
      },
    ],
  },
};
```

### <mark>plugin</mark>

plugin 的本质是一个带有 apply 方法的对象。
apply 函数会在初始化阶段创建好 Compiler 对象后运行。
compiler 对象是在初始化阶段构建的，整个 webpack 打包过程只会创建一个 compiler 对象，后续完成打包工作的是 compiler 对象内部创建的 compilation。

![](assets/2020-01-15-12-49-26.png)
apply 函数会在创建好 compiler 对象后调用，并将 compiler 对象作为参数。
compiler 对象提供大量的钩子函数（hooks，可以理解为事件），plugin 的开发者可以注册这些钩子函数，参与 webpack 的编译和生成。
你可以在 apply 方法中使用下面的代码注册钩子函数：

```js
  class MyPlugin {
    /**
     * 事件名称 - 即要监听的事件名，即钩子名，(https://www.webpackjs.com/api/compiler-hooks)
     * 事件类型 - 这一部分使用的Tapable API，这是一个小型的专门用于钩子函数监听的库
           它提供了一些事件类型：
                tap：注册一个同步的钩子函数，函数运行完毕则表示事件处理结束
                tapAsync：注册一个基于回调的异步的钩子函数，函数通过调用一个回调表示事件处理结束
                tapPromise：注册一个基于Promise的异步的钩子函数，函数通过返回的Promise进入已决状态表示事件处理结束
     * 处理函数 - 处理函数有一个事件参数compilation，在函数内部通过调用compilation提供的钩子函数参与webpack的编译与生成
    */
    apply(compiler){
        compiler.hooks.事件名称.事件类型.(name,callback(compilation))
    }
  }
```

应用 plugin 只需将相应的 plugin 对象部署到 webpack 配置对象中的 plugins 属性上

```js
var plugin = {
  apply: function (compiler) {
    // ...
  },
};

// 通常我们习惯把该对象写成构造函数的形式
class MyPlugin {
  apply(compiler) {
    // ....
  }
}

option = {
  plugins: [new MyPlugin()],
};
```

### context 配置

该配置会影响入口和 loaders 解析，入口和 loaders 的相对路径会以 context 的配置作为基准路径，这样，你的配置就会独立于 CWD（current working directory 当前执行路径）

### output.library 配置

```js
option = {
  output: {
    library: "abc",
  },
};
```

会将入口文件的导出结果暴露给 abc
**注意**，如果将数组作为 entry，那么只会暴露数组中的最后一个模块。如果将对象作为 entry，还可以使用数组语法暴露

### output.libraryTarget 配置

```js
const config = {
  output: {
    library: "var",
  },
};
```

该配置可以更加精细化的控制入口包的导出结果

其他值可选值：

- var：默认值，暴露一个用`var`定义的全局变量；
- window：暴露给 window 对象的一个属性；
- this：暴露给 this 的一个属性
- global： 暴露给 global 的一个属性
- commonjs：暴露给 exports 的一个属性
- 其他：https://www.webpackjs.com/configuration/output/#output-librarytarget

### target

```js
const config = {
  target: "web",
};
```

设置打包结果最终要运行的环境，常用值有

- web：默认值，打包后的代码运行在 web 环境中
- node：打包后的代码运行在 node 环境中
- 其他：https://www.webpackjs.com/configuration/target/

### module.noParse

```js
const config = {
  module: {
    noParse: /jquery/,
  },
};
```

不解析正则表达式匹配的模块，通常用它来忽略那些大型的单模块库，以提高构建性能

### resolve.modules

```js
const config = {
  resolve: {
    modules: ["node_modules"], //默认值
  },
};
```

当解析模块时，如果遇到导入语句，`require('test')`，webpack 会从下面的位置寻找依赖模块

1. 当前目录下的 node_modules 目录下
2. 上级目录下的 node_modules 目录下
3. ……

**注意**，当数组内是一个相对或者绝对路径时，不会 webpack 不会向上递归查找，只有当是文件名时才会向上递归查找

### resolve.extensions

```js
const config = {
  resolve: {
    extensions: [".js", ".json", ".css"],
  },
};
```

当解析模块时，遇到无具体后缀名的导入语句，例如`require（'test'）`，会依次测试它的后缀名

### resolve.alias

```js
const config = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      _: __dirname,
    },
  },
};
```

有了 alias（别名）后，导入语句中可以加入配置的键名，例如`require（'@/abc.js'）`，webpack 会将其看作是`require(src的绝对路径 + "/abc.js")`

### externals

```js
const config = {
  externals: {
    jquery: "$",
    lodash: "_",
  },
};
```

从最终的 bundle 中排除掉配置的源代码，例如，入口模块是

```js
// index.js
require("jquery");
require("lodash");
```

生成的 bundle 是：

```js
(() => {
  const __webpack_modules__ = {
    "./node_modules/jquery/dist/jquery.js": function (module, exports) {
      // jquery源码
    },
    "./node_modules/lodash/dist/lodash.js": function (module, exports) {
      // lodash源码
    },
    "./src/index.js": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      // ...
    },
  };
})();
```

但有了上面的配置后，则变成了：

```js
(() => {
  const __webpack_modules__ = {
    "./src/index.js": (
      module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      // ...
    },
    jquery: function (module) {
      module.exports = self["$"];
    },
    lodash: function (module) {
      module.exports = self["_"];
    },
  };
})();
```

这比较适用于一些第三方库来自外部 CDN 的情况，这样一来，即可以在页面中使用 CDN，又让 bundle 的体积更小，还不影响源码的编写

### stats

控制的是构建过程中控制台的输出内容（https://www.webpackjs.com/configuration/stats/#stats）

## webpack-dev-server（开发服务器）
在开发阶段类似vscode中的`live Server`

## CSS工程化

**三个问题**：
- 类名冲突
- 代码重复
- 文件细分

**解决方案**：

- 类名冲突：
  - 命名约定：BEM、OOCSS、AMCSS、SMACSS 等
  - css in js
  - css模块化

- 代码重复：
  - css in js
  - 预编译器

- 文件细分：
  - 利用构建工具，例如webpack等

## js兼容性
### babel预设与插件
babel插件与预设的运行顺序：
1. 插件在Presets前运行
2. 插件顺序从前往后运行
3. Preset顺序从后往前运行

## 性能优化

### 压缩与tree shaking
压缩：移除模块内的无效代码；
tree shaking：将模块内没有用到的导入标记为`dead code`，交给代码压缩工具处理（移除）