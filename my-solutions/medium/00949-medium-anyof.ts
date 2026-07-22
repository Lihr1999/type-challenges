/*
  949 - AnyOf
  -------
  by null (@kynefuk) #中等 #array

  ### 题目

  在类型系统中实现类似于 Python 中 `any` 函数。类型接收一个数组，如果数组中任一个元素为真，则返回 `true`，否则返回 `false`。如果数组为空，返回 `false`。

  例如：

  ```ts
  type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
  type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.
  ```

  > 在 Github 上查看：https://tsch.js.org/949/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.28 11:35:43
/*
  知识点: 
  1. 泛型元组需要逐个判断元素类型时，可以使用T[number]
    1.1 复杂化: T extends [infer First, ...infer Rest]
  2. 判断空数组方法
    方式一: type emptyObject = { [k: string]: never }
    方式二: type isEmptyObject<T extends unknown> = keyof T extends never ? true : false
*/

/*
  mysefl: 
    1. 创建辅助类型判断是否为false，元祖逐个元素进行判断
      type FalseUnion<T extends unknown> = T extends (0 | '' | [] | false) ? true : keyof T extends never ? true : false
      type AnyOf<T extends readonly any[]> =
        T extends [infer First, ...infer Rest]
        ? FalseUnion<First> extends false ? true : AnyOf<Rest>
        : false
    
    2. 同上，逐个判断改为T[number]
      type FalseUnion<T extends unknown> = T extends (0 | '' | [] | false) ? true : keyof T extends never ? true : false
      type AnyOf<T extends any[]> = T[number] extends any ? FalseUnion<T[number]> & false extends never ? false : true : false
*/

/*
  issues: 
    1. 严格判断空字符('')、空数组('length'为0)、
      type IsNotArrayEmpty<T extends any[]> = T extends [] ? false : true
      type IsNotObjectEmpty<T extends {}> = T extends { [key: string]: never } ? false : true
      type Bool<T> = T extends 1 ? true :
        T extends string ? T extends '' ? false : true :
        T extends boolean ? T :
        T extends any[] ? IsNotArrayEmpty<T> :
        T extends object ? IsNotObjectEmpty<T> :
        false
      type AnyOf<T extends readonly any[]> = T extends [infer R, ...infer Rest] ? (Bool<R> extends true ? true : AnyOf<Rest>) : false
    
    2. T[number] extends 联合类型
      type FalseUnion = 0 | "" | false | undefined | null | [] | { [key: string]: never }
      type AnyOf<T extends readonly any[]> =
      T[number] extends FalseUnion
      ? false : true
*/

type FalseUnion = 0 | "" | false | undefined | null | [] | { [key: string]: never }
type AnyOf<T extends readonly any[]> =
  T[number] extends FalseUnion
  ? false : true

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<AnyOf<[1, 'test', true, [1], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[1, '', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, 'test', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/949/answer/zh-CN
  > 查看解答：https://tsch.js.org/949/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
