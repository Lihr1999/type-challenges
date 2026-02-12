/*
  108 - 去除两端空白字符
  -------
  by Anthony Fu (@antfu) #中等 #template-literal

  ### 题目

  实现`Trim<T>`，它接受一个明确的字符串类型，并返回一个新字符串，其中两端的空白符都已被删除。

  例如

  ```ts
  type trimmed = Trim<'  Hello World  '> // expected to be 'Hello World'
  ```

  > 在 Github 上查看：https://tsch.js.org/108/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.25 10:03:58
/*
  知识点: 
  1. 模板字符串联合类型 + 推断infer
    type Trim<T extends string> = T extends `${voidStr}${infer Rest}` | `${infer Rest}${voidStr}` ? `${Trim<Rest>}` : T
    计算步骤: 
      1. extends ' abc ' => ' Rest' | 'Rest '
      2. 递归<去除左侧第一个空格后的剩余字符Rest> | 递归<去除右侧第一个空格后的剩余字符Rest>
      3. 可以理解为把 左侧的第一个空格去掉 | 把右侧的第一个空格去掉 后的剩余字符串递归代入，重复执行该逻辑
  2. 模板字符串 extends + infer可以做一些特殊的结构判断
    2.1 <T, U = '-'> = T extends `${infer First}${U}${infer Rest}` => 代表匹配`a-b...`这种结构
  
  反思:
  1. 利用TS自身的infer推断，很多时候不需要使用 具体某个类型 extends xx这种判断
*/

/*
  思路: 
    前言: 先看上一个TrimLeft去除左侧空格的思路
    1. myself1 - 循环多次处理:
      例子: ` abc  `
      步骤:
        1. 进行一次TrimeLeft => `abc `
        2. 进行Reverse => `  cba`
        3. 进行一次TrimLeft => `cba`
        4. 进行一次Reverse
    
    2. myself2 - TrimLeft + TrimRight合并组合字符串
      例子: `  a b c  `
      步骤:
        `${TrimRight<TrimLeft<Rest>>}` 
        1. 将TrimLeft后的结果交给TrimRight继续处理
*/

/*
  myself1 - 循环多次处理结果

  type voidStr = " " | "\n" | "\t"
  type TrimLeft<T extends string> = T extends `${infer First}${infer Rest}` ? First extends voidStr ? TrimLeft<Rest> : T : T
  type ReverseStr<T extends string> = T extends `${infer First}${infer Rest}` ? `${ReverseStr<Rest>}${First}` : T
  type Trim<T extends string = ''> = T extends `${infer Rest}` ? `${ReverseStr<TrimLeft<ReverseStr<TrimLeft<Rest>>>>}` : T

  myselft2 - TrimLeft + TrimRight合并组合字符串
  type voidStr = " " | "\n" | "\t"
  type TrimLeft<T extends string> = T extends `${voidStr}${infer Rest}` ? `${TrimLeft<Rest>}` : T
  type TrimRight<T extends string> = T extends `${infer Rest}${voidStr}` ? `${TrimRight<Rest>}` : T
  type Trim<T extends string> = T extends `${infer Rest}` ? `${TrimLeft<TrimRight<Rest>>}` : T // myself
*/

/*
  issues - 模板字符串联合类型 + 推断
  原理: 通过联合字符串infer推断Rest + 递归调用
  type Trim<T extends string> = T extends `${voidStr}${infer Rest}` | `${infer Rest}${voidStr}` ? `${Trim<Rest>}` : T
*/

type voidStr = " " | "\n" | "\t"
type TrimLeft<T extends string> = T extends `${voidStr}${infer Rest}` ? `${TrimLeft<Rest>}` : T
type TrimRight<T extends string> = T extends `${infer Rest}${voidStr}` ? `${TrimRight<Rest>}` : T
// type Trim<T extends string> = T extends `${infer Rest}` ? `${TrimLeft<TrimRight<Rest>>}` : T // myself
type Trim<T extends string> = T extends `${voidStr}${infer Rest}` | `${infer Rest}${voidStr}` ? `${Trim<Rest>}` : T // issues

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Trim<'str'>, 'str'>>,
  Expect<Equal<Trim<' str'>, 'str'>>,
  Expect<Equal<Trim<'     str'>, 'str'>>,
  Expect<Equal<Trim<'str   '>, 'str'>>,
  Expect<Equal<Trim<'     str     '>, 'str'>>,
  Expect<Equal<Trim<'   \n\t foo bar \t'>, 'foo bar'>>,
  Expect<Equal<Trim<''>, ''>>,
  Expect<Equal<Trim<' \n\t '>, ''>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/108/answer/zh-CN
  > 查看解答：https://tsch.js.org/108/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
