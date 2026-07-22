/*
  612 - KebabCase
  -------
  by Johnson Chu (@johnsoncodehk) #中等 #template-literal

  ### 题目

  Replace the `camelCase` or `PascalCase` string with `kebab-case`.

  `FooBarBaz` -> `foo-bar-baz`

  For example

  ```ts
  type FooBarBaz = KebabCase<"FooBarBaz">
  const foobarbaz: FooBarBaz = "foo-bar-baz"

  type DoNothing = KebabCase<"do-nothing">
  const doNothing: DoNothing = "do-nothing"
  ```

  > 在 Github 上查看：https://tsch.js.org/612/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2026.02.26 17:57:34
/*
  知识点: 
    1. 判断是否为emoji表情、短横线等字符 - 判断目标字符是否extends Capitalize<目标字符>
      type isSame<T extends string> = Uncapitalize<T> extends Capitalize<T> ? true : false
    2. 
*/

/*
  思路: 
    1. myself
      1.1 首字母转为小写
      1.2 后续有大写则转为`-${Capitalize<First>}$KebabCase<Rest>}`
        1.2.1 需要有边界判断, '_' extends Capitalize<'_'> === true
    
    2. myself + issues
      2.1 不需要判断特殊emoji表情、边界字符串，如: '_' 😎
      2.2 判断Rest extends UnCapitalize<Rest>
          2.2.1 此处不使用Rest extends Capitalize<Rest>
          例子: type z = KebabCaseWrong<'F'> // 'f-'
          解释: 'F' => 'f-'
            1. 原因: 当Rest为空字符串时，会出现`${First}-${空Rest}`，就会多出了'-'，因为当Rest为空时，就不应该添加'-'。
            2. 修复: 
              2.1 当取反判断extends UnCapitalize<Rest>时，`${小写First}${递归Rest}`, 就可以确保出现'f'
              2.2 其实就是限制了: 
                2.2.1. 当Rest无值&&上一个是大写时，则保持该结构`${Uncapitalize<First>}${KebabCaseWrong<Rest>}`
                2.2.2. 当Rest有值&&上一个是大写时，则保持该结构`${Uncapitalize<First>}-${KebabCaseWrong<Rest>}`
*/

/*
  反思: 
    1. 当接近答案时，多出了字符串'-'，可以往边界情况是否没判断好的角度思考
*/

/*
  myself: 
    1. 思路: `${非第一次的后续大写字符才在前面添加'-'}${Capitalize<First>}$KebabCase<Rest>}`
      type isSame<T extends string> = Capitalize<T> extends Uncapitalize<T> ? true : false
      type KebabCase<T extends string, U = true> = Uppercase<T> extends Lowercase<T> ? T
      : T extends `${infer First}${infer Rest}`
      ? `${U extends true ? '' : First extends Capitalize<First> ? `${isSame<First> extends true ? '' : '-'}` : ''}${Uncapitalize<First>}${KebabCase<Rest, false>}`
      : T

    2. 多了一个'-'字符版本
      type KebabCaseWrong<T extends string> =
      T extends `${infer First}${infer Rest}`
      ? Rest extends Capitalize<Rest> ? `${Uncapitalize<First>}-${KebabCaseWrong<Rest>}` : `${Uncapitalize<First>}${KebabCaseWrong<Rest>}`
      : T
      修正版本一: 判断Rest是否为空
      type KebabCaseWrongFixRestEmpty<T extends string> =
      T extends `${infer First}${infer Rest}`
      ? Rest extends Capitalize<Rest> ? Rest extends '' ? First : `${Uncapitalize<First>}-${KebabCaseWrongFixRestEmpty<Rest>}` : `${Uncapitalize<First>}${KebabCaseWrongFixRestEmpty<Rest>}`
      : T
      修正版本二: 
      type KebabCaseRight<T extends string> =
      T extends `${infer First}${infer Rest}`
      ? Rest extends Uncapitalize<Rest> ? `${Uncapitalize<First>}${KebabCaseWrong<Rest>}` : `${Uncapitalize<First>}-${KebabCaseWrong<Rest>}`
      : T

*/

type KebabCaseWrong<T extends string> =
  T extends `${infer First}${infer Rest}`
  ? Rest extends Capitalize<Rest> ? `${Uncapitalize<First>}-${KebabCaseWrong<Rest>}` : `${Uncapitalize<First>}${KebabCaseWrong<Rest>}`
  : T

type KebabCaseWrongFixRestEmpty<T extends string> =
  T extends `${infer First}${infer Rest}`
  ? Rest extends Capitalize<Rest> ? Rest extends '' ? First : `${Uncapitalize<First>}-${KebabCaseWrongFixRestEmpty<Rest>}` : `${Uncapitalize<First>}${KebabCaseWrongFixRestEmpty<Rest>}`
  : T

type KebabCaseRight<T extends string> =
  T extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest> ? `${Uncapitalize<First>}${KebabCaseWrong<Rest>}` : `${Uncapitalize<First>}-${KebabCaseWrong<Rest>}`
  : T
type z = KebabCaseRight<'F'>

type isSame<T extends string> = T extends Uncapitalize<T> ? true : false
type testEmoji = isSame<'😎'>
type resultWrong = KebabCaseWrong<'oBarBaz'> // "foo-bar-baz-"
type resultWrongFixRestEmpty = KebabCaseWrongFixRestEmpty<'oBarBaz'> // "foo-bar-baz"
type resultRight = KebabCaseRight<'oBarBaz'> // "foo-bar-baz"
type test = "" extends `${infer First}${infer Rest}` ? true : false // false


// issues
type KebabCase<S extends string> = S extends `${infer S1}${infer S2}`
  ? S2 extends Uncapitalize<S2>
  ? `${Uncapitalize<S1>}${KebabCase<S2>}`
  : `${Uncapitalize<S1>}-${KebabCase<S2>}`
  : S

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<KebabCase<'FooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'fooBarBaz'>, 'foo-bar-baz'>>,
  Expect<Equal<KebabCase<'oBarBaz'>, 'o-bar-baz'>>,
  Expect<Equal<KebabCase<'foo-bar'>, 'foo-bar'>>,
  Expect<Equal<KebabCase<'foo_bar'>, 'foo_bar'>>,
  Expect<Equal<KebabCase<'Foo-Bar'>, 'foo--bar'>>,
  Expect<Equal<KebabCase<'ABC'>, 'a-b-c'>>,
  Expect<Equal<KebabCase<'-'>, '-'>>,
  Expect<Equal<KebabCase<''>, ''>>,
  Expect<Equal<KebabCase<'😎'>, '😎'>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/612/answer/zh-CN
  > 查看解答：https://tsch.js.org/612/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
