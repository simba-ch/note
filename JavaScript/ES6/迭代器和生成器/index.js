// 迭代器是一个具有next方法的对象,该方法返回一个{value:下一个数据的值,done:Boolean，是否迭代完成}的格式的对象
function getIterator() {
  let i = 1,
    prev1 = 1,
    prev2 = 1,
    value;
  return {
    next() {
      if (i <= 2) {
        value = 1;
      } else {
        value = prev1 + prev2;
        prev2 = prev1;
        prev1 = value;
      }
      i++;
      return {
        value,
        done: false,
      };
    },
  };
}

//生成器是一个通过构造函数Generator创建的对象，这个对象既是一个迭代器也是一个迭代对象
// Generator构造函数是一个内部函数外部不可以使用，所以生成器只能通过生成器函数创建
const generator = {
  next() {
    return {
      value: 1,
      done: false,
    };
  },
  [Symbol.iterator]: () => {
    return {
      next() {
        return {
          value: 1,
          done: false,
        };
      },
    };
  },
};

//生成器函数
function* createGenerator() {
  let i = 1,
    result;
  console.log("输出：", i);
  result = yield i++;
  console.log("输出：", result);
}

let generator1 = createGenerator();

function fibo(num) {
  function* createGenerator() {
    let prev1 = (prev2 = 1);
    for (let i = 1; i > 0; i++) {
      if (i <= 2) {
        yield 1;
      } else {
        yield prev1 + prev2;
        [prev1, prev2] = [prev2, prev1 + prev2];
      }
    }
  }
  const fb = createGenerator();
  for (let i = 1; i < num; i++) {
    console.log(fb.next().value);
  }
}

fibo(10);
