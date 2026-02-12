/*
  20 - Promise.all
  -------
  by Anthony Fu (@antfu) #中等 #array #promise

  ### 题目

  给函数`PromiseAll`指定类型，它接受元素为 Promise 或者类似 Promise 的对象的数组，返回值应为`Promise<T>`，其中`T`是这些 Promise 的结果组成的数组。

  ```ts
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise<string>((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });

  // 应推导出 `Promise<[number, 42, string]>`
  const p = PromiseAll([promise1, promise2, promise3] as const)
  ```

  > 在 Github 上查看：https://tsch.js.org/20/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.16 11:33:49
/*
  知识点: 
  1. Variadic Tuple Types - 可变元组类型 
    概念: 当一个数组字面量的上下文类型是 Tuple Type，那么就会对这个数组字面量推导出对应的Tuple Type，[...T]就是这个上下文类型的指示器。
    注意: 可变元组类型只是保留元组的精确结构，并不是将单独元组元素值进行类型描述所组成的元组. ['1', 2] => ['1', 2] 并不是[string, number]
    总结: 根据上下文保留元组的精确结构
    资料: 
    https://www.zhihu.com/question/523396892
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types

    例子1: declare function test<T extends unknown[]>(params: T)
    T => 元组1 | 元组2 | ...
    例子2: declare function test<T extends unknown[]>(params: [...T])
    [...T] => [元组1, 元组2, 元组3]
  2. 遍历映射类型 - 元组 - 根据被遍历的原始类型T的"形状"(shape)智能地决定映射结果的结构
    注意: 
      - 映射类型不一定就是对象，因为本质上都是Iterable，仅仅是映射，即使T的行为看似在处理对象，它也不会改变原始的T类型{P in keyof T: some logic with P}
      - 映射类型是"结构保留"的，不是"对象转换"的
    2.1 基本用法
      type Mapped<T> = { [K in keyof T]: T[K] }

      // 测试1: T 是对象 -> 结果是对象
      type obj = Mapped<{ a: string, b: number }> // 结果: { a: string; b: number; }

      // 测试2: T 是元组 -> 结果是元组
      type tupple = Mapped<[string, number]> // 结果: [string, number]

      // 测试3: T 是数组 -> 结果是数组
      type Arr = Mapped<string[]> // 结果: string[]

      // 测试4: 混合元组 -> 结果是元组
      type MixedTuple = Mapped<[string, ...number[]]> // 结果: [string, ...number[]

      // 测试5: 可选元素元组 -> 结果是元组
      type OptionalTuple = Mapped<[string, number?]> // 结果: [string, number?]

      // 测试6: 联合类型元组 -> 元组
      type UnionTuple = Mapped<[string] | [number]> // 结果: [string] | [number] (分配律)

      // 测试7: 交叉类型 -> 传入类型的所有原型组成的新映射对象类型
      type Intersection = Mapped<[string] & { custom: boolean }> // 结果: { [x: number]: string; 0: string ... }
    2.2 函数
      type Tuple = ["A", "B"]
      type funcReturnTuple<T extends unknown[]> = ([...T]) => {
        [P in keyof T]: T[P]
      }
      type case1 = funcReturnTuple<Tuple> // ([...T]: Iterable<any, void, undefined>) => ["A", "B"]
  3. 函数传参 - 类型拓宽
    type A = <T extends unknown[]>(values: [...T]) => void
    const arr = ['a', 1]
    const case1: A = () => { }
    case1(arr) // const case1: <(string | number)[]>(values: (string | number)[]) => void
    case1(['a', 1]) // const case1: <[string, number]>(values: [string, number]) => void

    // 解释: 
    const arr = ['a', 1]
    // TypeScript 推断：arr: (string | number)[]
    // 原因：TypeScript 认为这个数组是"可变的"，未来可能添加更多元素

    // 等价于：
    const arr: (string | number)[] = ['a', 1]
  4. Awaited
    解释: 用于获取等待一个 Promise 解析后的结果类型,这种类型旨在模拟函数await中的操作async，或 s.then()上的方法——特别是它们递归解包Promise的方式

  5. declare 描述声明
    5.1 描述函数 - declare function - 不能有具体实现
      解释: 声明外部函数或类（通常来自非 TypeScript 文件
      declare function greet(name: string): void;
    5.2 描述模块 - declare module
      解释: 模块声明（比如未提供类型的 npm 包）
      declare module 'some-old-lib' {
        export function doSomething(input: string): number;
      }
*/

/*
  myself1: 只能验证通过promiseAllTest1、promiseAllTest2
  type getP<T> = T extends Promise<infer R> ? R : T
  type getPromise<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest] ? [Awaited<First>, ...getPromise<Rest>] : T
  declare function PromiseAll<T extends readonly unknown[]>(values: T): Promise<getPromise<T>>

  myself2: 只能验证通过promiseAllTest1、promiseAllTest2、promiseAllTest3 无法验证通过Promise的具体传参值类型
  改进: 定义为Variadic tuple types - 可变元组类型(将其类型拆分) - values: [...T] => [类型1, 类型2, ...] 
    type getP<T> = T extends Promise<infer R> ? R : T
    type getPromise<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest] ? [Awaited<First>, ...getPromise<Rest>] : T
    declare function PromiseAll<T extends readonly unknown[]>(values: [...T]): Promise<getPromise<T>>

*/

/*
  issues1: 无法通过泛型Promise测试用例
  declare function PromiseAll<T extends unknown[]>(
    values: readonly [...T],
  ): Promise<{ [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P] }>


  issues2: 全部通过
  declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<{
    [P in keyof T]: Awaited<T[P]>
  }>
  解释: values: readonly [...T]添加readonly的原因
    https://github.com/type-challenges/type-challenges/issues/1924#issuecomment-866556950
    简单总结: 应该是为了告诉TS，此处的变量是不变的
    1. 将具有元组类型的 rest 参数扩展为离散参数
    2. 将具有元组类型的 spread 表达式扩展为离散参数
    3. 元组类型的通用静止参数及其推理
    4. 元组类型中的可选元素
    5. 元组类型中的 Rest 元素
    当函数调用包含元组类型的 spread 表达式作为最后一个参数时，spread 表达式对应于元组元素类型的离散参数序列。因此，下面的调用是等价的:
    const args: [number, string, boolean] = [42, "hello", true];
    foo(42, "hello", true);
    foo(args[0], args[1], args[2]);
    foo(...args);

*/

declare function PromiseAll<T extends readonly unknown[]>(values: [...T]): Promise<{
  [k in keyof T]: Awaited<T[k]>
}>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])
const promiseAllTest4 = PromiseAll<Array<number | Promise<number>>>([1, 2, 3])
const promiseAllTest5 = PromiseAll<(number | Promise<string>)[]>([1, 2, Promise.resolve('3')])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>,
  Expect<Equal<typeof promiseAllTest4, Promise<number[]>>>,
  Expect<Equal<typeof promiseAllTest5, Promise<(number | string)[]>>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/20/answer/zh-CN
  > 查看解答：https://tsch.js.org/20/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
