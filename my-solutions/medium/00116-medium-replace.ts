/*
  116 - Replace
  -------
  by Anthony Fu (@antfu) #中等 #template-literal

  ### 题目

  实现 `Replace<S, From, To>` 将字符串 `S` 中的第一个子字符串 `From` 替换为 `To` 。

  例如

  ```ts
  type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'
  ```

  > 在 Github 上查看：https://tsch.js.org/116/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.26 11:41:36
/*
  知识点: 
  1. 模板字符串
    1.1 replace 替换首次出现的字符串，不需要进行递归，直接返回一个新模板字符串进行拼接

    1.2 模板字符串搭配extends 可以拆分多个部分进行infer推断 `${infer First}${xx1}${infer Rest}${xx2}`
      1.2.1 没有匹配到的变量部分，会是一个""空字符串
      1.2.2 TS会根据${xx}分割字符串，只要符合
        ${infer First}就是${xx}前面的所有字符
        ${Rest}就是${xx}后面的所有字符

    1.3 处理匹配模板字符串时，如果具有某些特征结构时，可以将字符串infer分割为多个部分，replace可分割为: `${infer First}${特征结构}${infer Rest}`
      例子: replace替换第一次出现特征的字符串
        `${infer First}${匹配内容}${infer Rest}`
        Replace<'abcfoobarabc', 'bar', 'foo'>
        计算步骤: 
          当前参数: T: 'abcfoobardef' From: 'bar' To: 'foo'
          1. 代入`${infer First}${From}${infer Rest}`
            1.1 当前参数: First: "abcfoo" From: "bar" Rest: "def"
            1.2 返回: `${First}${To}${Rest}` => 即把中间的${From}替换为${To}，其他部分不变
            1.3 结果: `${'abcfoo'}${'foo'}${def}`

    1.4 `${From extends '' ? never : From}` infer推断过程中可以继续extends，返回never代表过滤此变量
      前提需要将变量定义在泛型参数中，否则会提示找不到该变量 type Replace<T extends string, From extends string, To extends string>
      计算步骤: 
        T extends `${infer First}${From extends '' ? never : From}${infer Rest}` => `${First}${never}${Rest}`
        1.1 因为不会有extends `xx${never}xx`这种结构的字符串
        1.2 所以直接走非extends，返回T

*/
type Replace<T extends string, From extends string, To extends string> =
  T extends `${infer First}${From extends '' ? never : From}${infer Rest}`
  ? `${First}${To}${Rest}`
  : T

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Replace<'foobar', 'bar', 'foo'>, 'foofoo'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', 'foo'>, 'foofoobar'>>,
  Expect<Equal<Replace<'foobarbar', '', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'foobarbar', 'bar', ''>, 'foobar'>>,
  Expect<Equal<Replace<'foobarbar', 'bra', 'foo'>, 'foobarbar'>>,
  Expect<Equal<Replace<'', '', ''>, ''>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/116/answer/zh-CN
  > 查看解答：https://tsch.js.org/116/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
