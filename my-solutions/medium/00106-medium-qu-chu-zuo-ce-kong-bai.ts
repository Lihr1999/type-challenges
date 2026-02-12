/*
  106 - 去除左侧空白
  -------
  by Anthony Fu (@antfu) #中等 #template-literal

  ### 题目

  实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

  例如

  ```ts
  type trimmed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '
  ```

  > 在 Github 上查看：https://tsch.js.org/106/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.23 13:36:55
/*
  知识点: 
  1. 模板字符串
    1.1 ` ${infer Rest}`
      例子: ` abc` => 那么Rest返回的结果就是abc
    
    1.2 `${infer Rest} `
      例子: `abc ` => 那么Rest返回的结果就是abc

    1.3 extends `${infer Rest}${voidStr}` - 即: 模板字符串可以拼接自定义联合类型字符
      type voidStr = " " | "\n" | "\t"
      例子: T extends `abc\n` === T extends `${infer Rest}${voidStr}` 即 Rest => abc

  反思: 
  1. 模板字符串可以拼接自定义类型，那就不需要递归调用处理每一个字符是否extends voidStr
    1.1 extends `${infer Rest}${voidStr}`
*/

/*
  思路: 
    1. myself - 递归 - √
    2. issues - 依靠模板字符串+infer 推断递归 - √
*/

/*
  myself1 - 递归处理每一个字符是否extends voidStr
  type voidStr = " " | "\n" | "\t"
  type TrimLeft<T extends string> = T extends `${infer First}${infer Rest}` ? First extends voidStr ? TrimLeft<Rest> : T : T // myself

  myself2 - 利用模板字符串extends infer拼接自定义类型
  type voidStr = " " | "\n" | "\t"
  type TrimLeft<T extends string> = T extends `${voidStr}${infer Rest}` ? `${TrimLeft<Rest>}` : T
*/

type voidStr = " " | "\n" | "\t"
type TrimLeft<T extends string> = T extends `${voidStr}${infer Rest}` ? `${TrimLeft<Rest>}` : T // myself + issues
type TrimRight<T extends string> = T extends `${infer Rest}${voidStr}` ? `${TrimRight<Rest>}` : T

/*
  issues - 同myself
*/

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>,
  Expect<Equal<TrimLeft<''>, ''>>,
  Expect<Equal<TrimLeft<' \n\t'>, ''>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/106/answer/zh-CN
  > 查看解答：https://tsch.js.org/106/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
