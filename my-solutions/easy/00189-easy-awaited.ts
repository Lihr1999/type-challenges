/*
  189 - Awaited
  -------
  by Maciej Sikora (@maciejsikora) #简单 #promise #built-in

  ### 题目

  假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise<T> 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

  例如：`Promise<ExampleType>`，请你返回 ExampleType 类型。

  ```ts
  type ExampleType = Promise<string>

  type Result = MyAwaited<ExampleType> // string
  ```

  > 这个挑战来自于 [@maciejsikora](https://github.com/maciejsikora) 的文章：[original article](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4)

  > 在 Github 上查看：https://tsch.js.org/189/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.03 11:09:53
/*
  反思: 
  1. 可以使用infer关键字从一个类型中推断出想要的类型，TS会自动查找对应类型中的T，就是infer对应的推断类型
*/

/**
  知识点: 
  1. TS递归
    1.1 常用在extends中，只需要在一个类型中重复调用自身类型，并且传入对应参数即可  type xx<T> = T extends x ? xx<T> : never
  2. infer推断
    2.1 TypeScript 会自动在类型的泛型定义中 T 被使用的位置，寻找实际类型中对应位置的类型，并赋值给 infer R
    泛型T推断自动寻找对应类型例子: 
    interface Confusing<T> {
      method: (arg: { data: T }) => T
    }

    type Case1 = { method: (arg: { data: number }) => number }
    type Case2 = { method: (arg: number) => string }

    type R1 = Case1 extends Confusing<infer R> ? R : never // R = number
    type R2 = Case2 extends Confusing<infer R> ? R : never // 不匹配 R = never

*/

// type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T extends PromiseLike<infer U> ? U : T // issues
// type MyAwaited<T> = T extends PromiseLike<infer R> ? MyAwaited<R> : T // issues

// 思路: 先限制T需要传入为PromiseLike，然后推断取出promise的返回值类型R，再判断R是否为PromiseLike，是 则递归判断，不是 则就返回R
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer R> ? R extends PromiseLike<any> ? MyAwaited<R> : R : never // issues - https://github.com/type-challenges/type-challenges/issues/24969

/*
  myself: 
    
  type generatePromise<T extends promiseLike> = T['then'] extends (callback: (arg: infer R) => any) => any ? R : never

  type result = generatePromise<typeof test> // number

  interface promiseLike {
    then: (onfulfilled: (...args: any[]) => any) => any
  }

  const test: promiseLike = {
    then: (callback) => { callback() }
  }

  type test1 = MyAwaited<{ then: (onfulfilled: (arg: number) => any) => any }> // number

  type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T extends promiseLike ? generatePromise<T> : T
*/
// type MyAwaited<T> = T extends Promise<infer R> ? MyAwaited<R> : T extends promiseLike ? generatePromise<T> : T // myself

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
  Expect<Equal<MyAwaited<T>, number>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/189/answer/zh-CN
  > 查看解答：https://tsch.js.org/189/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
