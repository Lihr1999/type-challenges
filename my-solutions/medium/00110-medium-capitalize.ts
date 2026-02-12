/*
  110 - Capitalize
  -------
  by Anthony Fu (@antfu) #中等 #template-literal

  ### 题目

  实现 `Capitalize<T>` 它将字符串的第一个字母转换为大写，其余字母保持原样。

  例如

  ```ts
  type capitalized = Capitalize<'hello world'> // expected to be 'Hello world'
  ```

  > 在 Github 上查看：https://tsch.js.org/110/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.25 16:30:59
/*
  知识点: 
  1. Uppercase<T> - TS内置方法 - 小写字符转大写
  2. 模板字符串中T extends `${infer xx}`推断的变量可以使用extends xx，限制推断变量类型，不需要在里面再次extends
    2.1 例子: `${infer First extends keyof AlphaMap}`
    限制First只能是AlphaMap的key值组成的联合类型
*/
/*
  思路: 
  1. 使用模板字符串infer推断首字符串First
  2. 调用TS内置Uppercase方法转换大写
*/
// type MyCapitalize<T extends string> = T extends `${infer Frist}${infer Rest}` ? `${Uppercase<Frist>}${Rest}` : T // myself

/*
  issues
  type AlphaMap = {
    a: "A";
    b: "B";
    c: "C";
    d: "D";
    e: "E";
    f: "F";
    g: "G";
    h: "H";
    i: "I";
    j: "J";
    k: "K";
    l: "L";
    m: "M";
    n: "N";
    o: "O";
    p: "P";
    q: "Q";
    r: "R";
    s: "S";
    t: "T";
    u: "U";
    v: "V";
    w: "W";
    x: "X";
    y: "Y";
    z: "Z";
  };

type Alpha = keyof AlphaMap;

type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? F extends Alpha
    ? `${AlphaMap[F]}${R}`
    : S
  : S;

type MyCapitalize<T extends string> = T extends `${infer First extends keyof AlphaMap}${infer Rest}` ? `${AlphaMap[First]}${Rest}` : T // myself
*/

type AlphaMap = {
  a: "A"
  b: "B"
  c: "C"
  d: "D"
  e: "E"
  f: "F"
  g: "G"
  h: "H"
  i: "I"
  j: "J"
  k: "K"
  l: "L"
  m: "M"
  n: "N"
  o: "O"
  p: "P"
  q: "Q"
  r: "R"
  s: "S"
  t: "T"
  u: "U"
  v: "V"
  w: "W"
  x: "X"
  y: "Y"
  z: "Z"
}

type Alpha = keyof AlphaMap

type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? F extends Alpha
  ? `${AlphaMap[F]}${R}`
  : S
  : S

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyCapitalize<'foobar'>, 'Foobar'>>,
  Expect<Equal<MyCapitalize<'FOOBAR'>, 'FOOBAR'>>,
  Expect<Equal<MyCapitalize<'foo bar'>, 'Foo bar'>>,
  Expect<Equal<MyCapitalize<''>, ''>>,
  Expect<Equal<MyCapitalize<'a'>, 'A'>>,
  Expect<Equal<MyCapitalize<'b'>, 'B'>>,
  Expect<Equal<MyCapitalize<'c'>, 'C'>>,
  Expect<Equal<MyCapitalize<'d'>, 'D'>>,
  Expect<Equal<MyCapitalize<'e'>, 'E'>>,
  Expect<Equal<MyCapitalize<'f'>, 'F'>>,
  Expect<Equal<MyCapitalize<'g'>, 'G'>>,
  Expect<Equal<MyCapitalize<'h'>, 'H'>>,
  Expect<Equal<MyCapitalize<'i'>, 'I'>>,
  Expect<Equal<MyCapitalize<'j'>, 'J'>>,
  Expect<Equal<MyCapitalize<'k'>, 'K'>>,
  Expect<Equal<MyCapitalize<'l'>, 'L'>>,
  Expect<Equal<MyCapitalize<'m'>, 'M'>>,
  Expect<Equal<MyCapitalize<'n'>, 'N'>>,
  Expect<Equal<MyCapitalize<'o'>, 'O'>>,
  Expect<Equal<MyCapitalize<'p'>, 'P'>>,
  Expect<Equal<MyCapitalize<'q'>, 'Q'>>,
  Expect<Equal<MyCapitalize<'r'>, 'R'>>,
  Expect<Equal<MyCapitalize<'s'>, 'S'>>,
  Expect<Equal<MyCapitalize<'t'>, 'T'>>,
  Expect<Equal<MyCapitalize<'u'>, 'U'>>,
  Expect<Equal<MyCapitalize<'v'>, 'V'>>,
  Expect<Equal<MyCapitalize<'w'>, 'W'>>,
  Expect<Equal<MyCapitalize<'x'>, 'X'>>,
  Expect<Equal<MyCapitalize<'y'>, 'Y'>>,
  Expect<Equal<MyCapitalize<'z'>, 'Z'>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/110/answer/zh-CN
  > 查看解答：https://tsch.js.org/110/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
