/*
  43 - 实现 Exclude
  -------
  by Zheeeng (@zheeeng) #简单 #built-in #union

  ### 题目

  实现内置的 `Exclude<T, U>` 类型，但不能直接使用它本身。

  > 从联合类型 `T` 中排除 `U` 中的类型，来构造一个新的类型。

  例如：

  ```ts
  type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
  ```

  > 在 Github 上查看：https://tsch.js.org/43/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.03 11:09:49
/*
  知识点: 
  1. 联合类型获取每一个key
    1.1 不需要keyof，因为得到的并不是每一个key的展开
    1.2 直接使用extends即可 
    泛型联合类型推断过程例子: 
      type a = 'a' | 'b' | 'c'
      type MyExclude<T, U> = T extends U ? never : T
      type test = MyExclude<a, 'c'> // 'a' || 'b'
      执行过程: 
        'a' extends 'c' ? never : 'a'
        'b‘ extends 'c' ? never : 'b'
        'c' extends 'c' ? never : 'c'
        最终: 'a' | 'b' || never => 'a' || 'b'

  2. 分布式条件类型的分配性差异 - https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
    type MyExclude<T, U> = T extends U ? never : T
    type A = 's' | 'n' | 'q'
    type B = 's' | 'n'
    type C = A extends B ? never : A // 's' | 'n' | 'q'
    type D = MyExclude<A, B> // 'q'

    为什么type C不同于type D？

    在类型 C 中，A 不是泛型类型；它是字符串字面量 ('s' | 'n' | 'q') 的并集。在条件类型中使用非泛型类型时，它不具有分配性，并且条件会针对整个类型进行评估。因此，在 C 中，您要检查整个类型 A 是否扩展了整个类型 B。由于 'q' 不在 B 中，因此它会包含在结果中。

    在类型 D 中，您使用了泛型条件类型 MyExclude<T, U>，当您将此类型应用于类型 A 和 B 时，它就变为分布式的。对于联合类型 A 中的每个元素，都会分别检查条件。因此，“s”和“n”会被分别排除，而“q”不会被排除，因此最终结果是类型“q”。

    总而言之，差异在于条件类型应用于非泛型和泛型类型时的行为方式。非泛型类型不具有分配性，而泛型类型则可以具有分配性，只需分别考虑联合类型的每个元素即可。

    总结: Distributivity分配性 -> 非泛型类型不具有分配性，而泛型类型则可以具有分配性，只需分别考虑联合类型的每个元素即可
  
  3. Equal - 判断两个参数类型是否相等
    type myEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false

    原理: 使用了泛型的Distributivity分配性
      1. 把X, Y代入之后，变为: (<T>() => T extends { a: 1 } ? 1 : 2) extends (<T>() => T extends { a: 1, b: 2 } ? 1 : 2) ? true : false
      对于所有可能的类型 T: (T extends { a: 1 } ? 1 : 2) 必须兼容 (T extends {a: 1, b: 2} ? 1 : 2)
      2. 解释T的情况，当 T = { a: 1 } 时:
        ({ a: 1 } extends { a: 1 })       // true  → 左边返回 1
        ({ a: 1 } extends { a: 1, b:2 })  // false → 右边返回 2
      3. 所以返回false

*/

/*
  反思: 
    1. 一开始思路打算使用[k in keyof T as k extends U ? never : k]，其实不需要，联合类型只需要T extends U即可，TS内部会自动展开T和U进行判断
      1.1 或者使用 in 
        type U = 'a'|'b'|'c';
        type Foo = {
          [Prop in U]: number;
        };
        // 等同于
        type Foo = {
          a: number,
          b: number,
          c: number
        };
        
    2. 理解上述知识点中的Equal
*/

type MyExclude<T, U> = T extends U ? never : T // myself - 50%

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a'>, 'b' | 'c'>>,
  Expect<Equal<MyExclude<'a' | 'b' | 'c', 'a' | 'b'>, 'c'>>,
  Expect<Equal<MyExclude<string | number | (() => void), Function>, string | number>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/43/answer/zh-CN
  > 查看解答：https://tsch.js.org/43/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
