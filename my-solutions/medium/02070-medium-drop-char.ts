/*
  2070 - Drop Char
  -------
  by CaptainOfPhB (@CaptainOfPhB) #中等 #template-literal #infer

  ### 题目

  从字符串中剔除指定字符。

  例如：

  ```ts
  type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
  ```

  > 在 Github 上查看：https://tsch.js.org/2070/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.03.03 15:50:56
/*
  知识点:
    1. 模板字符串匹配固定字符方式 - 可看知识点二原理
      U = ' '
      T extends `${infer First}${U}${infer Rest}` ? `${First}${DropChar<Rest, U>}`
      这样即使匹配到空字符串都会符合条件，First和Rest都是''空字符串，所以本质上就是来判断是否包含U，是则递归去除

    2. 空字符串在模板字符串的表现 - '' extends `${infer First}${infer Rest}` 此表达式为true
      type emptyStr = ' '
      type z = ' ' extends `${infer First}${emptyStr}${infer Rest}` ? true : false // 结果: true - 而且First和Rest都是''空字符串
*/

/*
  myself:
    1. 逐个字符递归判断
    type DropChar<T extends string, U extends string> =
      T extends `${infer First}${infer Rest}`
      ? `${First extends U ? '' : First}${DropChar<Rest, U>}`
      : T
    2. 利用空字符串占位方式
    type DropChar<T extends string, U extends string> =
      T extends `${infer First}${U}${infer Rest}` ? `${First}${DropChar<Rest, U>}` : T
*/

// issues - 可能存在递归太深的问题
// type DropChar<S, C extends string> = S extends `${infer L}${C}${infer R}` ? DropChar<`${L}${R}`, C> : S;

type DropChar<T extends string, U extends string> =
  T extends `${infer First}${U}${infer Rest}` ? `${First}${DropChar<Rest, U>}` : T

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  // @ts-expect-error
  Expect<Equal<DropChar<'butter fly!', ''>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', '!'>, 'butter fly'>>,
  Expect<Equal<DropChar<'    butter fly!        ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 'b'>, '  u t t e r f l y ! '>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 't'>, ' b u   e r f l y ! '>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/2070/answer/zh-CN
  > 查看解答：https://tsch.js.org/2070/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
