/*
  1978 - Percentage Parser
  -------
  by SSShuai1999 (@SSShuai1999) #中等 #template-literal

  ### 题目

  实现类型 PercentageParser<T extends string>。根据规则 `/^(\+|\-)?(\d*)?(\%)?$/` 匹配类型 T。

  匹配的结果由三部分组成，分别是：[`正负号`, `数字`, `单位`]，如果没有匹配，则默认是空字符串。

  例如：

  ```ts
  type PString1 = ''
  type PString2 = '+85%'
  type PString3 = '-85%'
  type PString4 = '85%'
  type PString5 = '85'

  type R1 = PercentageParser<PString1> // expected ['', '', '']
  type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
  type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
  type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
  type R5 = PercentageParser<PString5> // expected ["", "85", ""]
  ```

  > 在 Github 上查看：https://tsch.js.org/1978/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.03.02 18:44:39
/*
  知识点:
    1. 模板字符串`${infer First}${infer Rest}`中
      1.1 Rest是代表所有剩余的字符串
    2. 模板字符串`${infer First extends OperatorCharacter}${infer Rest}${suffixSymbol}`
      2.1 First严格限制是否为`OperatorCharacter`类型
      2.2 限制最后一个字符需要是`suffixSymbol`类型
    3. 模板字符串`${infer Rest}${string}`
      3.1 代表尾字符必须要有一个字符串占位，不过针对''空字符串仍然会进入判断 - 因为'' extends string 是true
*/

/*
  思路:
    1.
      大致思路:
        - 先判断是否 T extends `${infer First}${infer Rest}` => 是则代表非空字符，否则返回['', '', '']
          - 判断First首字符是否为`OperatorCharacter`运算符,然后判断Rest的结构是否包含`suffixSymbol`，然后具体返回[First, U, suffixSymbol] 或者 [First, U, '']
          - 如果不符合First开头的结构，就判断T extends `${infer Rest}${suffixSymbol}`判断是否带有`suffixSymbol`符号，然具体返回['', Rest, suffixSymbol] 或者 ['', Rest, '']
      首先判断T extends `${infer First}${infer Rest}` ?
        1.1 是
          1.1.1 判断First extends OperatorCharacter ?
            1.1.1.1 是 => 判断Rest extends `${infer U}${suffixSymbol}`
              1.1.1.1.1 是 => [First, U, suffixSymbol]
              1.1.1.1.2 不是 => [First, U, '']

            1.1.1.2 不是 => 判断T extends `${infer U}${suffixSymbol}`
              1.1.1.2.1 是 => ['', U, suffixSymbol]
              1.1.1.2.2 不是 => ['', U, '']

        1.2 不是 => ['', '', '']
*/

/*
  myself:
    1. 利用模板字符串，判断结构
      type OperatorCharacter = '+' | "-"
      type suffixSymbol = '%'
      type PercentageParser<T extends string> =
        T extends `${infer Rest}${suffixSymbol}`
        ? Rest extends `${infer First extends OperatorCharacter}${infer U}` ? [First, U, suffixSymbol] : ['', Rest, suffixSymbol]
        : T extends `${infer First extends OperatorCharacter}${infer U}`
        ? [First, U, '']
        : ['', T, '']

    2. 同上，判断思路顺序不同
      type OperatorCharacter = '+' | "-"
      type suffixSymbol = '%'
      type PercentageParser<T extends string> =
        T extends `${infer First}${infer Rest}`
        ? First extends OperatorCharacter ? Rest extends `${infer U}${suffixSymbol}` ? [First, U, suffixSymbol] : [First, Rest, '']
        : T extends `${infer U}${suffixSymbol}` ? ['', U, suffixSymbol] : ['', T, '']
        : ['', '', '']

*/

type OperatorCharacter = '+' | '-'
type suffixSymbol = '%'
type PercentageParser<T extends string> =
  T extends `${infer First}${infer Rest}`
    ? First extends OperatorCharacter ? Rest extends `${infer U}${suffixSymbol}` ? [First, U, suffixSymbol] : [First, Rest, '']
      : T extends `${infer U}${suffixSymbol}` ? ['', U, suffixSymbol] : ['', T, '']
    : ['', '', '']

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Case0 = ['', '', '']
type Case1 = ['+', '', '']
type Case2 = ['+', '1', '']
type Case3 = ['+', '100', '']
type Case4 = ['+', '100', '%']
type Case5 = ['', '100', '%']
type Case6 = ['-', '100', '%']
type Case7 = ['-', '100', '']
type Case8 = ['-', '1', '']
type Case9 = ['', '', '%']
type Case10 = ['', '1', '']
type Case11 = ['', '100', '']

type cases = [
  Expect<Equal<PercentageParser<''>, Case0>>,
  Expect<Equal<PercentageParser<'+'>, Case1>>,
  Expect<Equal<PercentageParser<'+1'>, Case2>>,
  Expect<Equal<PercentageParser<'+100'>, Case3>>,
  Expect<Equal<PercentageParser<'+100%'>, Case4>>,
  Expect<Equal<PercentageParser<'100%'>, Case5>>,
  Expect<Equal<PercentageParser<'-100%'>, Case6>>,
  Expect<Equal<PercentageParser<'-100'>, Case7>>,
  Expect<Equal<PercentageParser<'-1'>, Case8>>,
  Expect<Equal<PercentageParser<'%'>, Case9>>,
  Expect<Equal<PercentageParser<'1'>, Case10>>,
  Expect<Equal<PercentageParser<'100'>, Case11>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/1978/answer/zh-CN
  > 查看解答：https://tsch.js.org/1978/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
