/*
  459 - Flatten
  -------
  by zhouyiming (@chbro) #中等 #array

  ### 题目

  在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。

  例如:

  ```ts
  type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
  ```

  > 在 Github 上查看：https://tsch.js.org/459/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.25 14:34:35
/*
  知识点: 
  1. 
*/

/*
  思路: 
    1. 泛型拆分数组
      T extends [infer First, ...infer Rest]
    2. 边界判断
      2.1 判断First是否为数组，是: 递归调用Pattern<First> | 否: First
*/

// myself
// type Flatten<T extends unknown[]> =
//   T extends [infer First, ...infer Rest]
//   ? First extends unknown[]
//   ? [...Flatten<First>, ...Flatten<Rest>]
//   : [First, ...Flatten<Rest>]
//   : T
 
// issues - 将First的判断简写
type Flatten<T extends unknown[]> = T extends [infer First, ...infer Rest] ? [...(First extends unknown[] ? Flatten<First> : [First]), ...Flatten<Rest>] : T


/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[{ foo: 'bar', 2: 10 }, 'foobar']>, [{ foo: 'bar', 2: 10 }, 'foobar']>>,
]

// @ts-expect-error
type error = Flatten<'1'>

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/459/answer/zh-CN
  > 查看解答：https://tsch.js.org/459/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
