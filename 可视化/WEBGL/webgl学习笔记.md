# WEBGL 学习手册 {ignore}

[toc]

## 1. 创建 webgl

1. 创建画布（webgl 上下文）
   在 HTML 中使用 canvas 创建一个画布，在 js 中将 canvas 的类型设置为
   webgl

   ```html
   <body onload="main()">
     <canvas id="glcanvas" width="640" height="480">
       你的浏览器似乎不支持或者禁用了HTML5 <code>&lt;canvas&gt;</code> 元素.
     </canvas>
   </body>
   ```

   ```js
   function main() {
     const canvas = document.querySelector("#glcanvas");
     // 初始化WebGL上下文
     const gl = canvas.getContext("webgl");
     // 确认 WebGL 支持性
     if (!gl) {
       alert(
         "无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。"
       );
       return;
     }

     // 使用完全不透明的黑色清除所有图像
     gl.clearColor(0.0, 0.0, 0.0, 1.0);
     // 用上面指定的颜色清除缓冲区
     gl.clear(gl.COLOR_BUFFER_BIT);
   }
   ```

## 2. 创建内容

名词解释：

- 着色器：是使用 OpenGL ES 着色语言(GLSL)编写的程序，**它携带着绘制形状的顶点信息以及构造绘制在屏幕上像素的所需数据，换句话说，它负责记录着像素点的位置和颜色。**

- 顶点着色器：**每次渲染一个形状时，顶点着色器会在形状中的每个顶点运行。 它的工作是将输入顶点从原始坐标系转换到 WebGL 使用的缩放空间(clipspace)坐标系**，其中每个轴的坐标范围从-1.0 到 1.0，并且不考虑纵横比，实际尺寸或任何其他因素。顶点着色器需要对顶点坐标进行必要的转换，在每个顶点基础上进行其他调整或计算，然后通过将其保存在由 GLSL 提供的特殊变量（我们称为 gl_Position）中来返回变换后的顶点。

- 片段着色器：片段着色器在顶点着色器处理完图形的顶点后，会**被要绘制的每个图形的每个像素点调用一次。它的职责是确定像素的颜色**，通过指定应用到像素的纹理元素（也就是图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色。之后颜色存储在特殊变量 gl_FragColor 中，返回到 WebGL 层。该颜色将最终绘制到屏幕上图形对应像素的对应位置。

- 着色器程序：绘制 WebGL 时候有两种不同的着色器函数，顶点着色器和片段着色器。你需要通过用 GLSL 编写这些着色器，并将代码文本传递给 WebGL ， 使之在 GPU 执行时编译。**顶点着色器和片段着色器的集合**我们通常称之为着色器程序。

### 绘制一个没有纹理的 2D 图形（画一个正方形）

1. 定义并创建顶点着色器和片段着色器

```js
// Vertex shader program
// 定义顶点着色器
const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

//fragment shader program
// 定义片段着色器
const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

// 定义一个创建着色器函数用于创建指定着色器，上传source源码并编译
function loadShader(gl, type, source) {
  // 创建一个着色器
  const shader = gl.createShader(type);
  // 为指定shader添加source源码
  gl.shaderSource(shader, source);
  // 编译指定着色器
  gl.compileShader(shader);
  // 验证是否编译成功
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
```

2. 定义一个着色器程序创建函数，用于创建一个着色器程序，将顶点着色器和片段着色器附加到同一着色器程序上，并连接它们

```js
// 创建一个初始化函数，初始化我们的着色器程序，让Webgl知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource) {
  // 创建顶点和片段着色器
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  // 创建着色器程序
  const shaderProgram = gl.createProgram();
  // 将两个着色器附加到着色器程序上
  gl.attachShader(shaderProgram, vertextShader);
  gl.attachShader(shaderProgram, fragmentShader);
  // 连接两个着色器
  gl.linkProgram(shaderProgram);
  // 验证连接是否成功
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}
```

3. 创建对象

```js
// 得到一个着色器程序
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
// 在创建着色器程序之后，我们需要查找WebGL返回分配的输入位置。
// 由于属性和统一的位置是特定于单个着色器程序的，因此我们将它们存储在一起以使它们易于传递
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
  },
};

// 在画正方形前，我们需要创建一个缓冲器来存储它的顶点。
// 定义缓冲器函数用于创建缓冲器
function initBuffers(gl) {
  // 创建一个缓冲器
  const positionBuffer = gl.createBuffer();
  // 为缓冲区绑定上下文
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 定义正方形各个顶点的坐标
  let vertices = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  // 将顶点数据传递给顶点缓冲区来建立对象的顶点
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
}
```

4. 绘制场景
   绘制前需引入 gl-matrix.js 文件，否则报错：‘mat4 is not defined’

```js
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(
    modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]
  ); // amount to translate

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3; // pull out 3 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}
```

### 使用着色器（shader）给图形添加颜色

- **在 GL 中，物体是由一系列顶点组成的，每一个顶点都有位置和颜色信息。**
- **在默认情况下，所有像素的颜色（以及它所有的属性，包括位置）都由线性插值计算得来，自动形成平滑的渐变。**

1. 给顶点着色

   1. 创建一个颜色的数组，然后将它们存在 WebGL 的缓冲区中。
      实现这一功能我们在 initBuffer 函数中加入如下代码：

   ```js
   const positionBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

   const colorBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
   const colors = [
     1.0,
     1.0,
     1.0,
     1.0, // 白
     1.0,
     0.0,
     0.0,
     1.0, // 红
     0.0,
     1.0,
     0.0,
     1.0, // 绿
     0.0,
     0.0,
     1.0,
     1.0, // 蓝
   ];
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.ARRAY_DRAW);

   return {
     position: positionBuffer,
     color: colorBuffer,
   };
   ```

   2. 将顶点着色器中的代码修改为如下代码，使得着色器可以从颜色缓冲区中正确的取出颜色：

   ```js
   //与之前相比，这段代码的关键不同点在于：每个顶点都与一个颜色数组中的数值相连接。
     attribute vec3 aVertexPosition;
         attribute vec4 aVertexColor;

         uniform mat4 uModelViewMatrix;
         uniform mat4 uProjectionMatrix;

         varying lowp vec4 vColor;

         void main(void) {
           gl_Position = uProjectionMatrix* uModelViewMatrix * vec4(aVertexPosition, 1.0);
           vColor = aVertexColor;
         }
   ```

2. 给片段着色
   修改片段着色器为如下代码，使每个像素都得到插值后的颜色：

```js
//我们只需要在此从 vColor 变量中获取这个颜色的值
varying lowp vec4 vColor;

      void main(void) {
        gl_FragColor = vColor;
      }
```

3. 带颜色的绘制

   1. 在 initShader 函数中初始化颜色属性，以便着色器使用

   ```js
   vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
   gl.enableVertexAttribArray(vertexColorAttribute);
   ```

   2. 修改 drawScene 函数使之在绘制正方形的时候使用这些颜色

   ```js
   gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
   gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
   ```

### 用 WebGL 让目标动起来

1. 让我们开始旋转图形。我们需要的第一件事就是创建一个变量用于跟踪正方形的当前旋转。

```js
let squareRotation = 0.0;
```

2. 现在我们更新 drawScene 函数以在绘制的时候将当前旋转应用于正方形。

```js
//这会将modelViewMatrix的当前值squareRotation绕Z轴旋转。
mat4.rotate(
  modelViewMatrix, // destination matrix
  modelViewMatrix, // matrix to rotate
  squareRotation, // amount to rotate in radians
  [0, 0, 1]
); // axis to rotate around
```

3. 要进行动画，我们需要添加 squareRotation 随时间更改值的代码。为此，我们可以创建一个新变量来跟踪上次动画播放的时间（我们称之为 then），然后将以下代码添加到主函数末尾。

```js
//该代码用于  requestAnimationFrame 要求浏览器在每一帧上调用函数“render”。requestAnimationFrame 自页面加载以来经过的时间（以毫秒为单位）。我们将其转换为秒，然后从中减去，以计算deltaTime 自渲染最后一帧以来的秒数  。
var then = 0;

// Draw the scene repeatedly
function render(now) {
  now *= 0.001; // convert to seconds
  const deltaTime = now - then;
  then = now;

  drawScene(gl, programInfo, buffers, deltaTime);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
```

在 drawScene 函数的结尾处我们需要添加以下代码来更新 squareRotation 的值：

```js
squareRotation += deltaTime;
```

### 使用 WebGL 创建一个 3D 物品

为之前的正方形添加五个面，来创建一个三维的立方体。最简单的方法是通过调用方法 gl.drawElements 方法使用顶点数组列表来替换之前直接使用顶点数组的 gl.drawArray 方法。顶点数组列表里保存这将被引用到一个个独立的顶点。

1. 首先更新 initBuffer 函数，创建顶点位置数据缓存。现在的代码看起来和渲染正方形的代码很相似，只是比之前的代码更长因为现在有了 24 个顶点（每个面使用 4 个顶点）：

```js
var vertices = [
  // Front face
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

  // Back face
  -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

  // Top face
  -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

  // Right face
  1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

  // Left face
  -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
];
```

2. 然后我们为每个顶点定义颜色：

```js
var colors = [
  [1.0, 1.0, 1.0, 1.0], // Front face: white
  [1.0, 0.0, 0.0, 1.0], // Back face: red
  [0.0, 1.0, 0.0, 1.0], // Top face: green
  [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
  [1.0, 1.0, 0.0, 1.0], // Right face: yellow
  [1.0, 0.0, 1.0, 1.0], // Left face: purple
];

var generatedColors = [];

for (j = 0; j < 6; j++) {
  var c = colors[j];

  for (var i = 0; i < 4; i++) {
    generatedColors = generatedColors.concat(c);
  }
}

var cubeVerticesColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(generatedColors),
  gl.STATIC_DRAW
);
```

3. 定义元素（三角形）数组

```js
const cubeVerticesIndexBuffer = gl.createBuffer();
// This array defines each face as two triangles, using the
// indices into the vertex array to specify each triangle's
// position.

const cubeVertexIndices = [
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23, // left
];

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
// Now send the element array to GL
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Unit16Array(cubeVertexIndices),
  gl.STATIC_DRAW
);
```

4. 渲染立方体
   接下来就需要在 drawScene 函数里添加代码使用立方体顶点索引数据来渲染这个立方体。

```js
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
setMatrixUniforms();
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
```

### 在 WebGL 中使用纹理贴图（texture） 未完待续~~~

**注意**：值得注意的一点是对纹理的加载同样需要遵循跨域访问规则；也就是说你只能从允许跨域访问的网址加载你需要的纹理。下面的例子就是支持跨域访问的。
加载纹理代码如下：

```js
function initTextures() {
  //  首先调用 GL createTexture() 函数来创建一个GL纹理对象 cubeTexture
  cubeTexture = gl.createTexture();
  // 为了把图片文件加载到纹理，代码首先创建了一个 Image 对象
  cubeImage = new Image();
  // 然后把需要当作纹理使用的图形文件加载了进来。当图片加载完成后回调函数 handleTextureLoaded() 就会执行。
  cubeImage.onload = function () {
    handleTextureLoaded(cubeImage, cubeTexture);
  };
  cubeImage.src = "cubetexture.png";
}

function handleTextureLoaded(image, texture) {
  // 接下来为了真正地形成纹理，我们通过把新创建的纹理对象绑定到 gl.TEXTURE_2D 来让它成为当前操作纹理。
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // 然后通过调用 texImage2D() 把已经加载的图片图形数据写到纹理。
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  // 接下来两行设置了纹理过滤器，过滤器用来控制当图片缩放时像素如何生成如何插值。
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.LINEAR_MIPMAP_NEAREST
  );
  // 接下来我们通过调用 generateMipMap() (en-US) 来生成多级渐进纹理，
  gl.generateMipmap(gl.TEXTURE_2D);
  // 接着通过给 gl.TEXTURE_2D 绑定值 null 来告诉 WebGL 我们对当前纹理的操作已经结束了。
  gl.bindTexture(gl.TEXTURE_2D, null);
}
```


### 在WebGL中模拟灯光效果

### WebGL中的动画纹理贴图
