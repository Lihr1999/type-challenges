/*
  191 - 追加参数
  -------
  by Maciej Sikora (@maciejsikora) #中等 #arguments

  ### 题目

  > 由 @antfu 翻译

  实现一个泛型 `AppendArgument<Fn, A>`，对于给定的函数类型 `Fn`，以及一个任意类型 `A`，返回一个新的函数 `G`。`G` 拥有 `Fn` 的所有参数并在末尾追加类型为 `A` 的参数。

  ```typescript
  type Fn = (a: number, b: string) => number

  type Result = AppendArgument<Fn, boolean>
  // 期望是 (a: number, b: string, x: boolean) => number
  ```

  > 本挑战来自于 [@maciejsikora](https://github.com/maciejsikora) 在 Dev.io 上的[文章](https://dev.to/macsikora/advanced-typescript-exercises-question-4-495c)

  > 在 Github 上查看：https://tsch.js.org/191/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.29 16:20:58
/*
  知识点: 
  1. 函数推断 - 接收参数args剩余参数推断 + 函数返回值类型推断
    1.1 (...args: infer Rest) => infer U
    1.2 组成新函数接收参数
      1.2.1 例子: (...args: [...Rest, A]) => U
        解释: 
          1. ...args: [] 代表此函数的接收参数类型为数组
          2. ...args: [...Rest, A] 代表此函数的接收参数类型为 [每个Rest按顺序对应的类型, A]组成的元组
*/
type AppendArgument<Fn extends (...args: never[]) => unknown, A> = Fn extends (...args: infer Rest) => infer U ? (...args: [...Rest, A]) => U : never // myself

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Case1 = AppendArgument<(a: number, b: string) => number, boolean>
type Result1 = (a: number, b: string, x: boolean) => number

type Case2 = AppendArgument<() => void, undefined>
type Result2 = (x: undefined) => void

type cases = [
  Expect<Equal<Case1, Result1>>,
  Expect<Equal<Case2, Result2>>,
  // @ts-expect-error
  AppendArgument<unknown, undefined>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/191/answer/zh-CN
  > 查看解答：https://tsch.js.org/191/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
