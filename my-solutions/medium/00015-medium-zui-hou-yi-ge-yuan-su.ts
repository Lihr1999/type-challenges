/*
  15 - 最后一个元素
  -------
  by Anthony Fu (@antfu) #中等 #array

  ### 题目

  > 在此挑战中建议使用TypeScript 4.0

  实现一个`Last<T>`泛型，它接受一个数组`T`并返回其最后一个元素的类型。

  例如

  ```ts
  type arr1 = ['a', 'b', 'c']
  type arr2 = [3, 2, 1]

  type tail1 = Last<arr1> // 应推导出 'c'
  type tail2 = Last<arr2> // 应推导出 1
  ```

  > 在 Github 上查看：https://tsch.js.org/15/zh-CN
*/

/* _____________ 你的代码 _____________ */
// 2025.12.11 10:01:11
/*
  知识点: 
  1. 解构数组 [...infer _, infer Last]
    使用'_'下划线开头定义的参数名进行占位，是一个占位符，用于告诉typescript编译器并不真正关心这个变量
    如果不使用下划线开头定义参数名占位并且不使用该参数，TS会提示警告: 'xx' is declared but its value is never read.
  2. 索引方式访问数组最后一项 type Last<T extends any[]> = [never, ...T][T['length']]
    2.1 例子: Last<[1, 2]>
      即 => [never, 1, 2][2]
      原理: 将原数组展开，在其前面补充一个never
        1. 因为length需要-1才能拿到最后一项，那么TS中没办法用T['length'] - 1
        2. 将never和原数组组合起来即可[never, ...T]
        3. 所以重新组成一个新数组[never, ...T][T['length']]，那么就可以正常通过T['length']访问最后一项数组元素类型
  3. 元组访问无效索引自动变为索引签名行为 即: T[number]
    3.1 元组索引必须是非负整数 (0, 1, 2, ...)
    3.2 -1 是无效索引，所以T[-1] T['-2']这些无效的元组索引访问，都会变成索引签名T[number]，返回的都是数组每一个元素类型组成的联合类型
  
  反思: 
  1. 元组反向解构 
    一开始以为[...infer Rest, infer Last]不可以这么写，实际上是可以的
    [infer First, ...infer Rest]正向解构和反向解构都支持
*/

/*
  myself:

  1. type Last<T extends unknown[]> = T extends [infer First, ...infer Rest] ? Rest['length'] extends 0 ? First : Last<Rest> : never // 递归方式

  2. type Last<T extends unknown[]> = T extends [...infer Rest, infer Last] ? Last : never // 解构方式 - 查看issues后整理

*/

/*
  issues: 
  
  1. type Last<T extends any[]> = [never, ...T][T['length']] // 使用索引获取

  2. type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never // 使用 _ 下划线
    2.1 _ 下划线是用来告诉TS
  
  3. type Last<T extends any[]> = T extends [...unknown[], infer L] ? L : never // 不使用 _ 下划线
  
*/

// type Last<T extends unknown[]> = [never, ...T][T['length']]
type Last<T extends any[]> = T extends [...unknown[], infer L] ? L : never // 不使用 _ 下划线

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Last<[]>, never>>,
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/15/answer/zh-CN
  > 查看解答：https://tsch.js.org/15/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
