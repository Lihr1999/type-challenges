/*
  1130 - ReplaceKeys
  -------
  by 贱贱 (@lullabyjune) #中等 #object-keys

  ### 题目

  Implement a type ReplaceKeys, that replace keys in union types, if some type has not this key, just skip replacing,
  A type takes three arguments.

  For example:

  ```ts
  type NodeA = {
    type: "A"
    name: string
    flag: number
  }

  type NodeB = {
    type: "B"
    id: number
    flag: number
  }

  type NodeC = {
    type: "C"
    name: string
    flag: number
  }

  type Nodes = NodeA | NodeB | NodeC

  type ReplacedNodes = ReplaceKeys<
    Nodes,
    "name" | "flag",
    { name: number; flag: string }
  > // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.

  type ReplacedNotExistKeys = ReplaceKeys<Nodes, "name", { aa: number }> // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never
  ```

  > 在 Github 上查看：https://tsch.js.org/1130/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.03.02 14:34:15
/*
  知识点: 
    1. 利用联合类型 + extends产生自动分配特性
*/

/*
  思路: 
    1. 构建映射类型
      1.1 利用U联合类型的自动分配特性
      1.2 k为keyof U
      1.3 value值处判断k是否extends Y
        1.3.1 是则取Y[k]
        1.3.2 不是则继续判断k extends T ?
          1.3.2.1 是则代表T传入了，但是没有在Y中，需要将值定义为never
          1.3.2.2 不是则取U[k]
*/

/*
  myself: 
    1. 重新构建映射类型对象
      type ReplaceKeys<U, T, Y> = {
        [k in keyof U]: k extends keyof Y ? Y[k] : k extends T ? never : U[k]
      }

    2. 使用内置工具类型 - 过于复杂 - 无法实现
*/

type ReplaceKeys<U, T, Y> = {
  [k in keyof U]: k extends keyof Y ? Y[k] : k extends T ? never : U[k]
}

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type NodeC = {
  type: 'C'
  name: string
  flag: number
}

type ReplacedNodeA = {
  type: 'A'
  name: number
  flag: string
}

type ReplacedNodeB = {
  type: 'B'
  id: number
  flag: string
}

type ReplacedNodeC = {
  type: 'C'
  name: number
  flag: string
}

type NoNameNodeA = {
  type: 'A'
  flag: number
  name: never
}

type NoNameNodeC = {
  type: 'C'
  flag: number
  name: never
}

type Nodes = NodeA | NodeB | NodeC
type ReplacedNodes = ReplacedNodeA | ReplacedNodeB | ReplacedNodeC
type NodesNoName = NoNameNodeA | NoNameNodeC | NodeB

type cases = [
  Expect<Equal<ReplaceKeys<Nodes, 'name' | 'flag', { name: number, flag: string }>, ReplacedNodes>>,
  Expect<Equal<ReplaceKeys<Nodes, 'name', { aa: number }>, NodesNoName>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/1130/answer/zh-CN
  > 查看解答：https://tsch.js.org/1130/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
