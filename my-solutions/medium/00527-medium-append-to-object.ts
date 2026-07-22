/*
  527 - Append to object
  -------
  by Andrey Krasovsky (@bre30kra69cs) #中等 #object-keys

  ### 题目

  实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。

  例如:

  ```ts
  type Test = { id: '1' }
  type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
  ```

  > 在 Github 上查看：https://tsch.js.org/527/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.25 15:43:11
/*
  知识点: 
    1. 合并对象 - 源对象 & {[]: xx}
    2. 构建映射类型
      2.1 可以 in 多个联合类型
        k in ((keyof T) | U)
      2.2 注意需要收窄k，需要判断是否extends源对象
        正确写法: 
          [k in keyof T | U]: k extends keyof T ? T[k] : V
        错误写法: 因为Typescript无法收窄else分支中的类型
          条件类型 A extends B ? X : Y 并不会自动收窄 else 分支中其他变量的类型
          [k in keyof T | U]: k extends U ? V : T[k] // Type 'k' cannot be used to index type 'T'.
      2.3 如果类型是keyof之后的联合类型，那么不需要再keyof，直接使用in关键字即可
        正确写法: 
        <T extends keyof any> = { [k in T]: string }
        错误写法：只会保留string | number | symbol的公共原型方法
        <T extends keyof any> = { [k in keyof T]: string }
        结果： 
          type c = {
            toString: string;
            valueOf: string;
            toLocaleString: string;
          }
*/

/*
  反思: 
    1. 合并对象
      1.1 直接源对象 & { []: xx }构建新对象即可
      type AppendToObject<T, U, V> = T & { [k in U]: V }
    2. 注意构建映射类型时，Typescript无法收窄else分支中的类型，需要提前
*/

/*
  myself1 - keyof T | U
  type AppendToObject<T, U extends keyof any, V> = {
    [k in keyof T | U]: k extends keyof T ? T[k] : V
    // [k in keyof T | U]: k extends U ? V : T[k] // Type 'k' cannot be used to index type 'T'.
  }

  myself2 - 使用Pick
  type AppendToObject<T, U extends keyof any, V> = Pick<T & { [k in U]: V }, keyof T | U>
*/

// myself - keyof T | U - 将源对象的所有key和U作为联合
type AppendToObject<T, U extends keyof any, V> = {
  [k in keyof T | U]: k extends keyof T ? T[k] : V
}

// issues - 使用Omit
// type AppendToObject<T, U extends keyof any, V> = Omit<T & { [k in U]: V }, never>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type test1 = {
  key: 'cat'
  value: 'green'
}

type testExpect1 = {
  key: 'cat'
  value: 'green'
  home: boolean
}

type test2 = {
  key: 'dog' | undefined
  value: 'white'
  sun: true
}

type testExpect2 = {
  key: 'dog' | undefined
  value: 'white'
  sun: true
  home: 1
}

type test3 = {
  key: 'cow'
  value: 'yellow'
  sun: false
}

type testExpect3 = {
  key: 'cow'
  value: 'yellow'
  sun: false
  moon: false | undefined
}

type cases = [
  Expect<Equal<AppendToObject<test1, 'home', boolean>, testExpect1>>,
  Expect<Equal<AppendToObject<test2, 'home', 1>, testExpect2>>,
  Expect<Equal<AppendToObject<test3, 'moon', false | undefined>, testExpect3>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/527/answer/zh-CN
  > 查看解答：https://tsch.js.org/527/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
