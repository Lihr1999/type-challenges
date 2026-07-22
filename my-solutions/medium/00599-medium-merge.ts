/*
  599 - Merge
  -------
  by ZYSzys (@ZYSzys) #中等 #object

  ### 题目

  将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。

  例如

  ```ts
  type foo = {
    name: string;
    age: string;
  }

  type coo = {
    age: number;
    sex: string
  }

  type Result = Merge<foo,coo>; // expected to be {name: string, age: number, sex: string}
  ```

  > 在 Github 上查看：https://tsch.js.org/599/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.26 13:44:32
/*
  知识点: 
    1. 使用keyof获取不同对象之间属性key的交集、并集
      1.1 所有属性key(并集): 利用 keyof (A & B)
      1.2 相同属性key(交集): 利用 keyof (A | B)
      type UnionKeys = keyof Foo | keyof Bar 等价于 keyof (Foo & Bar) // 并集 - "a" | "b" | "c"
      type IntersectionKeys = keyof Foo & keyof Bar 等价于 keyof (Foo | Bar) // 交集 - "b"
*/

/*
  反思: 
    1. 泛型默认值不等于泛型约束
      例子: I只是个默认值，但是仍然缺少类型限制
      type Merge<F, S, I = keyof F & keyof S> = Pick<Omit<F, I> & S, keyof S | keyof Omit<F, I>> // Type 'I' does not satisfy the constraint 'string | number | symbol'.ts(2344)

    2. keyof (ObjectA & ObjectB) 等价于 keyof ObjectA | keyof ObjectB
      因为keyof得到的本质上就是联合类型，所以两个对象使用&交叉合并即可
*/

/*
  myself: 
    // 1 - 构建新映射类型对象
    // type Merge<F, S> = {
    //   [k in keyof F | keyof S]: k extends keyof S ? S[k] : k extends keyof F ? F[k] : never
    // }
    简化版:
    // type Merge<F, S> = {
    //   [k in keyof (F & S)]: k extends keyof S ? S[k] : k extends keyof F ? F[k] : never
    // }

    // 2 - 通过TS内置函数 - Pick + Omit
    // 获取两个对象的所有key(两个对象的并集): 利用'|'联合类型 keyof F | keyof S，可以获取两个对象的所有key
    // 获取两个对象的所有相同key(两个对象的交集): 利用
    // [k in keyof F | keyof S]: 类型取最新的  
    type Merge<F, S> = Pick<Omit<F, keyof F & keyof S> & S, keyof S | keyof Omit<F, keyof F & keyof S>>
    简化版本:
      1. 将第一个对象过滤第二个对象的所有key
    type Merge<F, S> = Pick<Omit<F, keyof S> & S, keyof (Omit<F, keyof S> & S)>
*/

/*
  issues: 
    1. 使用&交叉合并对象 - 实际思路效果一致，只是无法通过case
      type Merge<F, S> = Omit<F, keyof S> & S
*/

type Merge<F, S> = Pick<Omit<F, keyof S> & S, keyof (Omit<F, keyof S> & S)>

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  a: number
  b: string
}

type Bar = {
  b: number
  c: boolean
}

type cases = [
  Expect<Equal<Merge<Foo, Bar>, {
    a: number
    b: number
    c: boolean
  }>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/599/answer/zh-CN
  > 查看解答：https://tsch.js.org/599/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
