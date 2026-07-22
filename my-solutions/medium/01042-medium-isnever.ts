/*
  1042 - IsNever
  -------
  by hiroya iizuka (@hiroyaiizuka) #中等 #union #utils

  ### 题目

  Implement a type IsNever, which takes input type `T`.
  If the type of resolves to `never`, return `true`, otherwise `false`.

  For example:

  ```ts
  type A = IsNever<never> // expected to be true
  type B = IsNever<undefined> // expected to be false
  type C = IsNever<null> // expected to be false
  type D = IsNever<[]> // expected to be false
  type E = IsNever<number> // expected to be false
  ```

  > 在 Github 上查看：https://tsch.js.org/1042/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.28 16:35:08
/*
  知识点: 
    1. 在泛型自动分配率的特性中,防止返回never,可以强制使用[T]包裹去除分配律
    2. 构建空对象的可映射类型{ [k: string]: never }
*/

// myself
type IsNever<T> = [T] extends [never] ? true : false

/*
  issues: 
    1. 判断 - 构建空对象的可映射类型写法
      type IsNever<T> = { a: T } extends { [k: string]: never } ? true : false;

    2. 使用Equal
      type IsNever<T> = Equal<never, T>
*/

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsNever<never>, true>>,
  Expect<Equal<IsNever<never | string>, false>>,
  Expect<Equal<IsNever<''>, false>>,
  Expect<Equal<IsNever<undefined>, false>>,
  Expect<Equal<IsNever<null>, false>>,
  Expect<Equal<IsNever<[]>, false>>,
  Expect<Equal<IsNever<{}>, false>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/1042/answer/zh-CN
  > 查看解答：https://tsch.js.org/1042/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
