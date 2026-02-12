/*
  119 - ReplaceAll
  -------
  by Anthony Fu (@antfu) #中等 #template-literal

  ### 题目

  实现 `ReplaceAll<S, From, To>` 将一个字符串 `S` 中的所有子字符串 `From` 替换为 `To`。

  例如

  ```ts
  type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'
  ```

  > 在 Github 上查看：https://tsch.js.org/119/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.29 09:50:03
/*
  知识点: 
  1. 模板字符串
    1.1 extends `${infer First}${From extends '' ? never : From}${infer Rest}` 推断结构变量，可以继续使用extends判断，并且使用never

    1.2 注意: (空字符串"" + 目标字符) === `${""}${目标字符}` - 可以利用此特性对进行字符串推断后的变量进行特殊处理
      1.2.1 例子: 'abc' extends `${""}${""}${'abc'}`
      type test = 'abc' extends `${""}${'abc'}` ? true : false // 结果: true

      1.2.2 例子: 'abc' extends `${infer First}${""}${infer Rest}`
      type test = 'abc' extends `${infer First}${""}${infer Rest}` ? Rest : false // 结果: First: 'a' Rest: 'bc'
*/

/*
  myself - 模板字符串内部 推断变量 后进行extends限制
  type ReplaceAll<T extends string, From extends string, To extends string> = T extends `${infer First}${From extends '' ? never : From}${infer Rest}` ? `${First}${To}${ReplaceAll<Rest, From, To>}` : T // myself
*/

/*
  issues1 - 提前判断From是否为空
  type ReplaceAll<S extends string, From extends string, To extends string> = From extends ''
  ? S
  : S extends `${infer R1}${From}${infer R2}`
  ? `${R1}${To}${ReplaceAll<R2, From, To>}`
  : S
*/

type ReplaceAll<T extends string, From extends string, To extends string> = T extends `${infer First}${From extends '' ? never : From}${infer Rest}` ? `${First}${To}${ReplaceAll<Rest, From, To>}` : T // myself
/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<ReplaceAll<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobar', 'bag', 'foo'>, 'foobar'>>,
  Expect<Equal<ReplaceAll<'foobarbar', 'bar', 'foo'>, 'foofoofoo'>>,
  Expect<Equal<ReplaceAll<'t y p e s', ' ', ''>, 'types'>>,
  Expect<Equal<ReplaceAll<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<ReplaceAll<'barfoo', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<ReplaceAll<'foobarfoobar', 'ob', 'b'>, 'fobarfobar'>>,
  Expect<Equal<ReplaceAll<'foboorfoboar', 'bo', 'b'>, 'foborfobar'>>,
  Expect<Equal<ReplaceAll<'', '', ''>, ''>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/119/answer/zh-CN
  > 查看解答：https://tsch.js.org/119/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
