/*
  1097 - IsUnion
  -------
  by null (@bencor) #中等 #union

  ### 题目

  Implement a type `IsUnion`, which takes an input type `T` and returns whether `T` resolves to a union type.

  For example:

  ```ts
  type case1 = IsUnion<string> // false
  type case2 = IsUnion<string | number> // true
  type case3 = IsUnion<[string | number]> // false
  ```

  > 在 Github 上查看：https://tsch.js.org/1097/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.28 17:16:10
/*
  知识点: 
    1. <T, U = T> - 原始联合类型需要分配律时,可创建多一个U泛型 = T保留原始联合类型
    2. 在分配律运算表达式中,如果需要判断never,需要用[never]包裹
      [Exclude<U, T>] extends [never]
    3. Exclude过滤传入的类型,结果是never
      Exclude<'A', 'A'> => never
    4. 泛型开启分配律 = 泛型(联合类型) + (放在 extends 关键字左侧 ? 不能用[]包裹 : 可以用[]包裹)
      有分配律(T放在extends右侧，无论有没有[]包裹): type IsUnion<T, U = T> = [U] extends [T]
      有分配律(T放在extends左侧，不能用[]包裹): type IsUnion<T, U = T> = [T] extends [U]
*/

/*
  思路: 
    例子: T = 'A' | 'B'
    1. 利用分配律 + Exclude<原始联合类型, 分配律时的每个类型>
      Exclude<'A', 'A'> => 'B' 
      只需要判断将第一个进行Exclude后是否为never即可,但是要注意,这个判断需要用[]包裹,去除分配律特性,否则结果是never
    2. 利用[Exclude<U, T>] extends [never]判断
      2.1 需要多利用一个泛型,U = T
      2.2 U不进行分配律 + T进行分配律
*/

/*
  反思: 
    1. [Exclude<U, T>] extends [never] ? xx : xx -> 可以简写为 [U] extends [T]判断
      1.1 在分配律中, [U] extends [第一个类型]，那么就可以认为T只有一个类型,非union
    2. T extends U ? [U] extends [T] ? 'hhh' : true
      2.1 在符合自动分配律条件式中，T已经是每次分配后的类型，所以[U] extends [T] => ['a' | 'b'] extends ['a'] ?
      2.2 总结: 只要泛型在外层条件符合分配律特性，那么内层条件中，使用到的泛型参数仍然保留分配律特性
*/

// myself
// type IsUnion<T, U = T> = [T] extends [never] ? false : T extends T ? [Exclude<U, T>] extends [never] ? false : true : false
// 根据issues更换泛型名称
type IsUnion<T, U = T> = [T] extends [never] ? false : T extends U ? [U] extends [T] ? false : true : false

// issues
// 去除Exclude方式判断
// type IsUnion<U, U1 = U> = [U] extends [never] ? false : U extends U1 ? [U1] extends [U] ? false : true : never

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsUnion<string>, false>>,
  Expect<Equal<IsUnion<string | number>, true>>,
  Expect<Equal<IsUnion<'a' | 'b' | 'c' | 'd'>, true>>,
  Expect<Equal<IsUnion<undefined | null | void | ''>, true>>,
  Expect<Equal<IsUnion<{ a: string } | { a: number }>, true>>,
  Expect<Equal<IsUnion<{ a: string | number }>, false>>,
  Expect<Equal<IsUnion<[string | number]>, false>>,
  // Cases where T resolves to a non-union type.
  Expect<Equal<IsUnion<string | never>, false>>,
  Expect<Equal<IsUnion<string | unknown>, false>>,
  Expect<Equal<IsUnion<string | any>, false>>,
  Expect<Equal<IsUnion<string | 'a'>, false>>,
  Expect<Equal<IsUnion<never>, false>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/1097/answer/zh-CN
  > 查看解答：https://tsch.js.org/1097/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
