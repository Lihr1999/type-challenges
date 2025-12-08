/*
  533 - Concat
  -------
  by Andrey Krasovsky (@bre30kra69cs) #简单 #array

  ### 题目

  在类型系统里实现 JavaScript 内置的 `Array.concat` 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

  例如：

  ```ts
  type Result = Concat<[1], [2]> // expected to be [1, 2]
  ```

  > 在 Github 上查看：https://tsch.js.org/533/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.04 11:19:09
/*
  知识点:
    1. readonly不能修饰泛型数组, 只能用于数组和元组文本修饰 readonly [] || readonly any[]
      'readonly' type modifier is only permitted on array and tuple literal types. // “readonly”类型修饰符仅允许用于数组和元组文本类型
      错误写法: readonly Array<T> || readonly Test<xx>
    2. 可以把重复的类型提到一个公共类型

*/
type Tuple = readonly unknown[] // issues
type Concat<T extends Tuple, U extends Tuple> = [...T, ...U] // myself

// 处理异常情况
// type Concat<T extends Tuple, U extends Tuple> = T extends Tuple ? U extends Tuple ? [...T, ...U] : [...T] : never // issues

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const tuple = [1] as const

type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], [1]>, [1]>>,
  Expect<Equal<Concat<typeof tuple, typeof tuple>, [1, 1]>>,
  Expect<Equal<Concat<[1, 2], [3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Concat<['1', 2, '3'], [false, boolean, '4']>, ['1', 2, '3', false, boolean, '4']>>,
]

// @ts-expect-error
type error = Concat<null, undefined>

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/533/answer/zh-CN
  > 查看解答：https://tsch.js.org/533/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
