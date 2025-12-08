/*
  18 - 获取元组长度
  -------
  by sinoon (@sinoon) #简单 #tuple

  ### 题目

  创建一个`Length`泛型，这个泛型接受一个只读的元组，返回这个元组的长度。

  例如：

  ```ts
  type tesla = ['tesla', 'model 3', 'model X', 'model Y']
  type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

  type teslaLength = Length<tesla> // expected 4
  type spaceXLength = Length<spaceX> // expected 5
  ```

  > 在 Github 上查看：https://tsch.js.org/18/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.03 11:09:40
/*
  知识点: 
  1. 泛型约束数组时，需要添加readonly - 它接受所有数组形式（可变、只读、元组、只读元组），因为readonly any[]无法分配给any[]
    1.1 因为const testArray = [1] as const 会让testArray自动带有readonly
  2. infer推断字符串时，必须要跟模板字符串进行书写，infer First和infer Rest，两个之间不能有空格 T extends `${infer F}${inferRest}`，注意遍历字符串需要递归调用类型    
*/

type Length<T extends readonly any[]> = T['length'] // myself

/*
  issues
  type strToArr<T extends string> = T extends `${infer F}${infer R}` ? T extends F ? [F] : [F, ...strToArr<R>] : never
  type Length<T> = T extends readonly unknown[] ? T['length'] : T extends string | number ? strToArr<`${T}`>['length'] : never
  // type Length<T> = T extends readonly unknown[] ? T['length'] : T extends string | number ? Length<strToArr<`${T}`>> : never
*/

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

type cases = [
  Expect<Equal<Length<typeof tesla>, 4>>,
  Expect<Equal<Length<typeof spaceX>, 5>>,
  // @ts-expect-error
  Length<5>,
  // @ts-expect-error
  Length<'hello world'>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/18/answer/zh-CN
  > 查看解答：https://tsch.js.org/18/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
