/*
  529 - Absolute
  -------
  by Andrey Krasovsky (@bre30kra69cs) #中等 #math #template-literal

  ### 题目

  实现一个接收string,number或bigInt类型参数的`Absolute`类型,返回一个正数字符串。

  例如

  ```ts
  type Test = -100;
  type Result = Absolute<Test>; // expected to be "100"
  ```

  > 在 Github 上查看：https://tsch.js.org/529/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.25 18:36:33
/*
  知识点: 
    1. JS支持使用'_'分隔符分割数字，带有合法分隔符的数字转为字符串后会自动去除分隔符
      To improve readability for numeric literals, underscores (_, U+005F) can be used as separators:
      https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_literals
      const bigIntBySeparator = BigInt(1_000_000_000_000);
      console.log(bigIntBySeparator.toString()) // '1000000000000'
*/

/*
  思路: 
    1. 将传入的泛型转为字符串类型，再通过模板字符串的方式推断`-${}`
      1.1 因为测试例子中，除了数字分隔符外，其余的都是'-'符号，所以可以直接判断是否继承`-${infer Rest}`

*/

/*
  反思: 
    1. '_'是数字分隔符，不需要另外判断过滤字符串
      const num = 1000_000
      console.log(1000000 === num) // true
*/

/*
  mysefl: 
    1. 通过定义 IllegalCharacter判断过滤
      存在问题: 
        1. '_'字符不需要另外定义判断过滤，这是数字的合法分隔符
        2. 不需要单独判断是否extends '-'，可以直接判断泛型字符串是否extends `-${infer Rest}`
      type IllegalCharacter = '-' | '_'
      type Absolute<T extends number | string | bigint> =
        `${T}` extends `${infer _}${infer Rest}`
        ? `${_ extends IllegalCharacter ? '' : _}${Absolute<Rest>}`
        : T
    2. 解决上诉问题版本
      type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer Rest}` ? Rest : `${T}`
      
*/

// myself - 转为字符串
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer Rest}` ? Rest : `${T}`

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Absolute<0>, '0'>>,
  Expect<Equal<Absolute<-0>, '0'>>,
  Expect<Equal<Absolute<10>, '10'>>,
  Expect<Equal<Absolute<-5>, '5'>>,
  Expect<Equal<Absolute<'0'>, '0'>>,
  Expect<Equal<Absolute<'-0'>, '0'>>,
  Expect<Equal<Absolute<'10'>, '10'>>,
  Expect<Equal<Absolute<'-5'>, '5'>>,
  Expect<Equal<Absolute<-1_000_000n>, '1000000'>>,
  Expect<Equal<Absolute<9_999n>, '9999'>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/529/answer/zh-CN
  > 查看解答：https://tsch.js.org/529/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
