/*
  3312 - Parameters
  -------
  by midorizemi (@midorizemi) #简单 #infer #tuple #built-in

  ### 题目

  实现内置的 Parameters<T> 类型，而不是直接使用它，可参考[TypeScript官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。

  例如：

  ```ts
  const foo = (arg1: string, arg2: number): void => {}

  type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
  ```

  > 在 Github 上查看：https://tsch.js.org/3312/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.05 13:54:09
/*
  知识点: 
  1. 函数形参声明建议使用any[]
  2. 数组元素类型是协变的，而函数参数类型是逆变的
    2.1 数组协变
      type arrResult1 = [string, number] extends unknown[] ? true : false // true
    2.2 函数逆变
      type testFn<T> = T extends (...ars: any[]) => any ? true : false

      type fnResult = testFn<(a: string, b: number) => {}> // 如果是unknown[]，此处是false; 如果是any[]，此处是true

      过程: 
      // 解析函数类型签名
        1. 首先testFn可以理解为目标函数TargetFn: Target: (arg0: unknown, arg1: unknown, arg2: unknown, ...unknown[]) => any
        2. 源函数（要赋值的函数）Source: (arg1: string, arg2: number) => void
      // 检查返回值类型（协变）
        1. 看函数返回值类型，=> void 是 => any 的子类型，符合√
      // 检查参数数量兼容性
        1. 接着查看源函数和目标函数的接收参数个数，源函数: 2个，目标函数: 任意
      // 参数类型逆变检查（核心步骤）- 规则: TargetParams extends SourceParam，
          - 函数A的参数类型必须是函数B的参数类型的子类型，那么函数A可以赋值给函数B，意味着执行A参数类型 extends B参数类型
          - 例如一个接受Dog类型参数的函数可以赋值给一个接受Animal类型参数的函数(因为Dog 是 Animal的子类型)
        1. arg[0]:
          Target[0]: unknown
          Source[0]: string
          Check: unknown extends string ? 
          × - unknown 不能赋值给 string

        2. arg[1]:
          Target[1]: unknown
          Source[1]: number
          Check: unknown extends number ?
          × - unknown 不能赋值给 number

        3. arg[3]: 无
*/

type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer Rest) => any ? Rest : [] // myself

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

function foo(arg1: string, arg2: number): void { }
function bar(arg1: boolean, arg2: { a: 'A' }): void { }
function baz(): void { }

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/3312/answer/zh-CN
  > 查看解答：https://tsch.js.org/3312/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
