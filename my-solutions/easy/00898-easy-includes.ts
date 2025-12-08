/*
  898 - Includes
  -------
  by null (@kynefuk) #简单 #array

  ### 题目

  在类型系统里实现 JavaScript 的 `Array.includes` 方法，这个类型接受两个参数，返回的类型要么是 `true` 要么是 `false`。

  例如：

  ```ts
  type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
  ```

  > 在 Github 上查看：https://tsch.js.org/898/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.04 15:52:24
/*
  知识点: 
  1. 泛型类型数组元组 索引签名 循环
    1.1 T extends any[]可以在遍历中使用k in T[number]
    1.2 T extends unknown[]不可以在遍历中使用k in T[number]
  
  2. 定义对象类型结构时，可以直接在花括号后加中括号[U]进行操作extends

  3. 数组递归判断每一项和U是否相等
    3.1 T extends [infer R, ...infer Rest] ? Equal<R, U> extends true ? true : false : false
*/

// type Includes<T extends readonly unknown[], U extends unknown> = U extends T[number] ? true : false // myself
// type Includes<T extends any[], U> = T extends [infer R, ...infer Rest] ? Equal<R, U> extends true ? true : Includes<Rest, U> : false // myself - 阅读issues后，采用数组方式并且补充Equal判断

// issuse1 - 对象结构 - 判断对象中是否有对应U的key - 有弊端
// 思路: 
// 1. 采用对象方式 type test = { x1: true, x2: true }
// 2. 然后判断test[U]是否为true
// 弊端: 
// Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>> // 无法通过校验
// Expect<Equal<Includes<[1 | 2], 1>, false>> // 无法通过校验 返回了true
// type Includes<T extends readonly any[], U> = {
//   [k in T[number]]: true
// }[U] extends true ? true : false

// issues2 -数组结构 - 递归遍历判断
// 思路: 
// 1. 采用数组递归 type Includes<T extends any[], U> = T extends [infer R, ...infer Rest] ? xx : Includes<Rest, U>
// 2. 递归时将R和U进行Equal对比，判断是否extends true即可
type Includes<T extends readonly unknown[], U> = T extends [infer First, ...infer Rest] ? Equal<First, U> extends true ? true : Includes<Rest, U> : false // issues

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>, false>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
  Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
  Expect<Equal<Includes<[{ a: 'A' }], { readonly a: 'A' }>, false>>,
  Expect<Equal<Includes<[{ readonly a: 'A' }], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[1], 1 | 2>, false>>,
  Expect<Equal<Includes<[1 | 2], 1>, false>>,
  Expect<Equal<Includes<[null], undefined>, false>>,
  Expect<Equal<Includes<[undefined], null>, false>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/898/answer/zh-CN
  > 查看解答：https://tsch.js.org/898/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
