/*
  9 - 对象属性只读（递归）
  -------
  by Anthony Fu (@antfu) #中等 #readonly #object-keys #deep

  ### 题目

  实现一个泛型 `DeepReadonly<T>`，它将对象的每个参数及其子对象递归地设为只读。

  您可以假设在此挑战中我们仅处理对象。不考虑数组、函数、类等。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

  例如

  ```ts
  type X = {
    x: {
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }

  type Expected = {
    readonly x: {
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey'
  }

  type Todo = DeepReadonly<X> // should be same as `Expected`
  ```

  > 在 Github 上查看：https://tsch.js.org/9/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.09 15:23:58
/*
  知识点:
  1. 判断是否为对象 - 使用keyof xx extends never，判断是否有对象属性
    1.1 注意: keyof {} => never，keyof 空对象也是never
  2. 构建映射类型时,先判断当前属性值是否为对象, 再递归处理
    例子: { a: { b: 123 } } k就是a,然后判断T[k] 即 keyof { b: 123 } extends never ? T[k] : 递归
    type DeepReadonly<T> = {
      readonly [k in keyof T]: keyof T[k] extends never ? T[k] : DeepReadonly<T[k]>
    }

  反思: 
  1. 不需要针对函数进行判断extends {}，因为{} 除了null undefined，其他都是{}的子类
*/

// myself - 多出了函数的判断，只需要判断是否为对象即可
// type DeepReadonly<T> = T extends (...args: never[]) => any ? T : T extends {} ? {
//   readonly [k in keyof T]: DeepReadonly<T[k]>
// } : T

// issues
type DeepReadonly<T> = {
  readonly [k in keyof T]: keyof T[k] extends never ? T[k] : DeepReadonly<T[k]>
}

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<DeepReadonly<X1>, Expected1>>,
  Expect<Equal<DeepReadonly<X2>, Expected2>>,
]

type X1 = {
  a: () => 22
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: 'string'
        }
        k: 'hello'
      }
      l: [
        'hi',
        {
          m: ['hey']
        },
      ]
    }
  }
}

type X2 = { a: string } | { b: number }

type Expected1 = {
  readonly a: () => 22
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: 'string'
        }
        readonly k: 'hello'
      }
      readonly l: readonly [
        'hi',
        {
          readonly m: readonly ['hey']
        },
      ]
    }
  }
}

type Expected2 = { readonly a: string } | { readonly b: number }

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/9/answer/zh-CN
  > 查看解答：https://tsch.js.org/9/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
