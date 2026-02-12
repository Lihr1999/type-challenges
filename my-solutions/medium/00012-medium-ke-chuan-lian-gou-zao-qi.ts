/*
  12 - 可串联构造器
  -------
  by Anthony Fu (@antfu) #中等 #application

  ### 题目

  在 JavaScript 中我们经常会使用可串联（Chainable/Pipeline）的函数构造一个对象，但在 TypeScript 中，你能合理的给它赋上类型吗？

  在这个挑战中，你可以使用任意你喜欢的方式实现这个类型 - Interface, Type 或 Class 都行。你需要提供两个函数 `option(key, value)` 和 `get()`。在 `option` 中你需要使用提供的 key 和 value 扩展当前的对象类型，通过 `get` 获取最终结果。

  例如

  ```ts
  declare const config: Chainable

  const result = config
    .option('foo', 123)
    .option('name', 'type-challenges')
    .option('bar', { value: 'Hello World' })
    .get()

  // 期望 result 的类型是：
  interface Result {
    foo: number
    name: string
    bar: {
      value: string
    }
  }
  ```

  你只需要在类型层面实现这个功能 - 不需要实现任何 TS/JS 的实际逻辑。

  你可以假设 `key` 只接受字符串而 `value` 接受任何类型，你只需要暴露它传递的类型而不需要进行任何处理。同样的 `key` 只会被使用一次。

  > 在 Github 上查看：https://tsch.js.org/12/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.10 15:40:16
/*
  知识点: 
  1. 泛型类型构建映射类型时，如果想让key值是具体的某个值，需要用 'in'关键字
    解释: 'in'关键字在TS中会自动展开后面的值，一般用于字符串或者联合类型，注意逻辑要写在[]里面
    // 例子
    type result1 = { [k in 'a']: string } // { a: string; }
    type result2 = { [k in 'a' | 'b']: string } // { a: string; b: string; }
  2. @ts-expect-error - 告诉编译器该处应该产生一个类型错误。如果编译器没有发出类型错误的警告，将会报告一个编译错误。
    此处的警告是提醒: 需要约束传参的类型，补充处理never情况。如果不限制never，那么参数类型永远都符合，就导致没法预期接收一个错误，所以就会出现警告 Unused '@ts-expect-error' directive.
    option<K extends string, V>(key: K extends keyof T ? never : K, // 魔法在这里！ value: V )
    
    注意: 
      1. 泛型一般只会是<T extends xx>
      2. 一般来说是需要处理函数接收参数的泛型约束(xx: T extends 某类型 ? never : T)

    原理: 
    1. 告诉TS期望这一行在编译时产生类型错误
    2. 当你的类型逻辑正确阻止重复 key 时 → 产生错误 → @ts-expect-error 满足 → 无警告
    3. 当你的类型逻辑无法阻止重复 key 时 → 无错误 → @ts-expect-error 失望 → 有警告
  3. 定义泛型参数类型时，需要使用extends
    option<K extends string, V> // √
    option<K: string, V>  // ×

  反思:
  1. 当递归泛型(默认值T = {})时，不需要再次遍历构建映射类型，直接返回T即可
  2. 建议补充处理函数接收参数的泛型约束

  思路: 
  1. Chainable<T = {}>，定义为泛型，并且默认值为{}
  2. 当调用option方法时，返回值为递归调用Chainable
    2.1 处理接收参数的泛型约束
    2.2 递归调用时传递 - 先排除当前key组成的映射结构(Omit) & 仅当前key组成的新映射结果(Record)
      2.2.1 此处是为了防止重复key的value不同，导致xx & xx，value会出现never的情况
  3. 当调用get方法时，返回值为泛型T即可，因为最后一次调用option，整个映射结构已经生成并返回了Chainable自身
*/

// myself - 会存在相同key的 @ts-expect-error 警告 - 没做接收参数的泛型约束
// type Chainable<T = {}> = {
//   option<K extends string, U>(key: K, value: U): Chainable<Omit<{ [k in keyof T]: T[k] }, K> & { [p in K]: U }>,
//   get(): {
//     [k in keyof T]: T[k]
//   }
// }

// myself - 阅读AI提示(需要添加泛型约束)
type Chainable<T = {}> = {
  option: <K extends string, V extends unknown>(key: K extends keyof T ? never : K, value: V) => Chainable<Omit<T, K> & Record<K, V>>
  get: () => T
}

// issues
// type Chainable<T = {}> = {
//   option: <K extends string, V>(
//     key: K extends keyof T ? never : K,
//     value: V
//   ) => Chainable<Omit<T, K> & Record<K, V>>
//   get: () => T
// }

/* _____________ 测试用例 _____________ */
import type { Alike, Expect } from '@type-challenges/utils'

declare const a: Chainable

const result1 = a
  .option('foo', 123)
  .option('bar', { value: 'Hello World' })
  .option('name', 'type-challenges')
  .get()

const result2 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 'last name')
  .get()

const result3 = a
  .option('name', 'another name')
  // @ts-expect-error
  .option('name', 123)
  .get()

type cases = [
  Expect<Alike<typeof result1, Expected1>>,
  Expect<Alike<typeof result2, Expected2>>,
  Expect<Alike<typeof result3, Expected3>>,
]

type Expected1 = {
  foo: number
  bar: {
    value: string
  }
  name: string
}

type Expected2 = {
  name: string
}

type Expected3 = {
  name: number
}

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/12/answer/zh-CN
  > 查看解答：https://tsch.js.org/12/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
