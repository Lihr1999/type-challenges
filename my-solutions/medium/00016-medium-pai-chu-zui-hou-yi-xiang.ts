/*
  16 - 排除最后一项
  -------
  by Anthony Fu (@antfu) #中等 #array

  ### 题目

  > 在此挑战中建议使用TypeScript 4.0

  实现一个泛型`Pop<T>`，它接受一个数组`T`，并返回一个由数组`T`的前 N-1 项（N 为数组`T`的长度）以相同的顺序组成的数组。

  例如

  ```ts
  type arr1 = ['a', 'b', 'c', 'd']
  type arr2 = [3, 2, 1]

  type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
  type re2 = Pop<arr2> // expected to be [3, 2]
  ```

  **额外**：同样，您也可以实现`Shift`，`Push`和`Unshift`吗？

  > 在 Github 上查看：https://tsch.js.org/16/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.16 11:03:56
/*
  知识点: 
  1. 数组推断解构 ...infer 
    T extends [infer R, ...infer Rest] 或者 T extends [...infer Rest, infer _]
  2. _短横线前缀占位符，防止出现TS警告
    注意infer推断时，不使用的类型会出现警告，建议使用"_"占位
  3. 使用泛型T时，如果不符合extends条件，可以尝试返回T本身(不强制never的的情况下)
*/

type Pop<T extends unknown[]> = T['length'] extends 0 ? [] : T extends [...infer R, infer _] ? R : never // myself
type Shfit<T extends unknown[]> = T['length'] extends 0 ? [] : T extends [infer _, ...infer Rest] ? Rest : never  // myself
type Push<T extends unknown[], U extends unknown> = [...T, U] // myself
type Unshift<T extends unknown[], U extends unknown> = [U, ...T] // myself

// type Pop<T extends any[]> = T extends [...infer FirstSet, infer _] ? FirstSet : T // issues - 只要不符合条件，返回T

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>,
  Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>,
  Expect<Equal<Pop<[]>, []>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/16/answer/zh-CN
  > 查看解答：https://tsch.js.org/16/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
