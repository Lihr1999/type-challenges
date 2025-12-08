/*
  268 - If
  -------
  by Pavel Glushkov (@pashutk) #简单 #utils

  ### 题目

  实现一个 `IF` 类型，它接收一个条件类型 `C` ，一个判断为真时的返回类型 `T` ，以及一个判断为假时的返回类型 `F`。 `C` 只能是 `true` 或者 `false`， `T` 和 `F` 可以是任意类型。

  例如：

  ```ts
  type A = If<true, 'a', 'b'>  // expected to be 'a'
  type B = If<false, 'a', 'b'> // expected to be 'b'
  ```

  > 在 Github 上查看：https://tsch.js.org/268/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.03 13:39:34
/*
  知识点: 
  1. 如果需要严格判断，需要多写一次extends
  2. boolean是ture | false的联合类型
  3. 条件类型的分布式特性
    3.1 例子: If<boolean, 'a', 2>：
      If<true | false, 'a', 2> ↓

      For true:
      If<true, 'a', 2> = true extends Boolean ? (true extends true ? 'a' : 2) : never ↓
      true extends true ? 'a' : 2 ↓
      result: 'a'

      For false:
      If<false, 'a', 2> = false extends Boolean ? (false extends true ? 'a' : 2) : never ↓
      false extends true ? 'a' : 2 ↓
      result: 2
*/

// type If<C extends boolean, T, F> = C extends true ? T : F // myself1 || issues1 - 下面error的例子，如果C不是传入的boolean类型，会被返回F
type If<C extends boolean, T, F> = C extends boolean ? C extends true ? T : F : never // myself2 - 解决下面error的例子，应该严格校验是否为boolean

/*
  issues2: 使用isEqual判断
  type If<C extends boolean, T, F> = isEqual<C, true> extends true ? T : isEqual<C, false> extends true ? F : never;
  type isEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
*/

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<If<true, 'a', 'b'>, 'a'>>,
  Expect<Equal<If<false, 'a', 2>, 2>>,
  Expect<Equal<If<boolean, 'a', 2>, 'a' | 2>>,
]

// @ts-expect-error
type error = If<null, 'a', 'b'>

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/268/answer/zh-CN
  > 查看解答：https://tsch.js.org/268/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
