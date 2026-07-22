/*
  645 - Diff
  -------
  by ZYSzys (@ZYSzys) #中等 #object

  ### 题目

  获取两个接口类型中的差值属性。

  ```ts
  type Foo = {
    a: string;
    b: number;
  }
  type Bar = {
    a: string;
    c: boolean
  }

  type Result1 = Diff<Foo,Bar> // { b: number, c: boolean }
  type Result2 = Diff<Bar,Foo> // { b: number, c: boolean }

  ```

  > 在 Github 上查看：https://tsch.js.org/645/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.28 11:04:33
/*
  知识点: 
    1. 泛型默认值仍然需要补充extends限制，否则有隐式的any类型
    2. keyof (A | B) => 获取公共key(交集)    keyof (A & B) => 获取所有key(并集)
*/

/*
  myself: 
    1. 重写映射类型
      type Diff<O, O1, unionKeys extends keyof (O & O1) = keyof (O & O1), intersectionKeys extends keyof (O | O1) = keyof (O | O1)> = {
        [k in unionKeys as k extends intersectionKeys ? never : k]: k extends keyof O ? O[k] : k extends keyof O1 ? O1[k] : never
      }
  
    2. 使用内置工具
      type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>
*/

type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>

type result = Diff<Foo, Bar>

type intersectionKeys = keyof (Foo & Bar)

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  name: string
  age: string
}
type Bar = {
  name: string
  age: string
  gender: number
}
type Coo = {
  name: string
  gender: number
}

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string, gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string, gender: number }>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/645/answer/zh-CN
  > 查看解答：https://tsch.js.org/645/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
