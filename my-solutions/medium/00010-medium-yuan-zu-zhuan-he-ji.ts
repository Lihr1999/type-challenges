/*
  10 - 元组转合集
  -------
  by Anthony Fu (@antfu) #中等 #infer #tuple #union

  ### 题目

  实现泛型`TupleToUnion<T>`，它返回元组所有值的合集。

  例如

  ```ts
  type Arr = ['1', '2', '3']

  type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'
  ```

  > 在 Github 上查看：https://tsch.js.org/10/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.10 11:40:39
/*
  知识点: 
  1. T[number] - 获取数组中每个元素组合起来的联合类型
  2. T[string] - 获取 interface接口 或者 type定义的映射类型 内定义的index签名类型中的属性值所组成的联合类型
    interface例子: 
    interface Test {
      [a: string]: number | string | boolean | unknown[]
    }

    type例子:
    type Test  {
      [a: string]: number | string | boolean | unknown[]
    }

    // 注意: 前提是必须要有[xx: string]定义的index签名，否则的话使用xx[string]会提示报错: Type 'Test' has no matching index signature for type 'string'.
    type result = Test[string] // number | string | boolean | unknown[]
  3. extends条件类型中推断元组R时，可以使用extends (infer R)[] 或者 Array<infer R>
    3.1 T extends (infer R)[] ? R : never
    3.2  T extends Array<infer R> ? R : never

*/
type TupleToUnion<T extends unknown[]> = T[number] // my-self

// type TupleToUnion<T extends unknown[]> = T extends Array<infer R> ? R : never // issues1

// type TupleToUnion<T extends unknown[]> = T extends (infer R)[] ? R : never // issues2

// issue3
// type TupleToUnion<T extends readonly any[]> = keyof {
//   [k in T[number]]: k
// }

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TupleToUnion<[123, '456', true]>, 123 | '456' | true>>,
  Expect<Equal<TupleToUnion<[123]>, 123>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/10/answer/zh-CN
  > 查看解答：https://tsch.js.org/10/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
