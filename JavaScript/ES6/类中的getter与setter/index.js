// 总结：
// 1.在类中通过get或set定义的属性与类中的默认属性不是同一个
// 2.在类中没有某个属性可以直接通过get和set定义，该属性会被直接定义在this上
// 3.如果在this中已定义了某个属性，get和set则是为该属性设置存取器属性，在new阶段就已经发挥作用

// 猜想：默认属性在定义类的时候不在this上，而是在new的时候被绑定到this上的



class Abc {
  age = 18;
  _gender = '男'
  constructor(name) {
    this.name = name;
  }


  get gender() {
    return this._gender
  }

  set gender(value) {
    this._gender = value
  }


  get age() {
    return this.age
  }

  set age(value) {
    this.age = value
  }


  get name() {
    return 'bcd'
  }


  set name(value) {
    console.log('设置abc的值')
  }
}


const abc = new Abc('abc')
// abc.age = 16
// console.log(abc.age)
abc.gender = '女'
console.log(abc.gender)



