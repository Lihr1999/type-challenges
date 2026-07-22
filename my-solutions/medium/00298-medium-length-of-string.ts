/*
  298 - Length of String
  -------
  by Pig Fang (@g-plane) #中等 #template-literal

  ### 题目

  计算字符串的长度，类似于 `String#length` 。

  > 在 Github 上查看：https://tsch.js.org/298/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.24 09:43:59
/*
  知识点: 
    1. 字符串转数组 'abc' => ['a', 'b', 'c']
      1.1 type StringToArray<T extends string> = T extends `${infer First}${infer Rest}` ? [First, ...StringToArray<Rest>] : []

    2. 数组可获取具体number数值
      2.1 type arrLength = ['a', 'b', 'c', 'd', 'e', 'f']['length'] // 6

    3. 泛型字符串推断剩余字符串时，可以省略第一个infer，但需要明确指定为string
      3.1 T extends `${string}${infer Rest}` // 注意: 此时首字符串就没办法使用了，就变成string类型了，如果需要用到首字符，还是需要使用infer
*/

/*
  思路: 
    方式1. 拆分两个步骤
      1.1 字符串转数组
        type StringToArray<T extends string> = T extends `${infer A}${infer Rest}` ? [A, ...StringToArray<Rest>] : []
      1.2 返回转换后数组的['length']
        type LengthOfString<T extends string> = StringToArray<T>['length']

    方式2: 利用双泛型
      2.1 定义U作为第二个泛型，类型为元组，值为每一次的字符串First + ...U
      2.2 
      type LengthOfString<T extends string, U extends unknown[] = []> = T extends `${infer First}${infer Rest}` ? LengthOfString<Rest, [...U, First]> : U['length']
      
*/

/*
  反思:
    1. 同时完成“构建数组”和“读取长度”两件事。这导致了类型定义的自我引用冲突 - 必须先得到精确的元组
      type LengthOfString<T extends string> = T extends `${infer First}${infer Rest}` ? [First, ...LengthOfString<Rest>]['length'] : [T]
*/

/*
  myself1:
    type StringToArray<T extends string> = T extends `${infer A}${infer Rest}` ? [A, ...StringToArray<Rest>] : []
    type LengthOfString<T extends string> = StringToArray<T>['length']

  myself2: 
    type LengthOfString<T extends string, U extends unknown[] = []> = T extends `${infer First}${infer Rest}` ? LengthOfString<Rest, [First, ...U]> : U['length']
*/

type LengthOfString<T extends string, U extends unknown[] = []> = T extends `${string}${infer Rest}` ? LengthOfString<Rest, [...U, string]> : U['length']

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LengthOfString<''>, 0>>,
  Expect<Equal<LengthOfString<'kumiko'>, 6>>,
  Expect<Equal<LengthOfString<'reina'>, 5>>,
  Expect<Equal<LengthOfString<'Sound! Euphonium'>, 16>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/298/answer/zh-CN
  > 查看解答：https://tsch.js.org/298/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
