/*
  62 - 查找类型
  -------
  by Anthony Fu (@antfu) #中等 #union #map

  ### 题目

  有时，您可能希望根据某个属性在联合类型中查找类型。

  在此挑战中，我们想通过在联合类型`Cat | Dog`中通过指定公共属性`type`的值来获取相应的类型。换句话说，在以下示例中，`LookUp<Dog | Cat, 'dog'>`的结果应该是`Dog`，`LookUp<Dog | Cat, 'cat'>`的结果应该是`Cat`。

  ```ts
  interface Cat {
    type: 'cat'
    breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
  }

  interface Dog {
    type: 'dog'
    breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
    color: 'brown' | 'white' | 'black'
  }

  type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
  ```

  > 在 Github 上查看：https://tsch.js.org/62/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.18 17:58:15
/*
  知识点: 
  1. 泛型 extends 触发自动分布式 | 分配律
    1.1 分布式
      1.1.1 满足要求: 
        - 参数必须是泛型类型
        - 参数必须是联合类型
        - extends必须要写在等式的右边，(不能放在<T extends xx>，等式左边仅仅是泛型的约束)
        - extends左侧参数必须是裸类型参数，即不能被 []、{}、() 等包裹
      1.1.2 例子: 
        - 分布式
        // 真正的分布行为
        type TrulyDistributive<T> = T extends string ? T : never;
        type R3 = TrulyDistributive<'a' | 'b' | number>;
        // = TrulyDistributive<'a'> | TrulyDistributive<'b'> | TrulyDistributive<number>
        // = 'a' | 'b' | never
        // = 'a' | 'b'  // number 被过滤掉

        - 非分布式
        // 真正的分布行为
        type TrulyDistributive<T> = [T] extends [string] ? T : never;
        type R3 = TrulyDistributive<'a' | 'b' | number>;
        // = TrulyDistributive<'a'> | TrulyDistributive<'b'> | TrulyDistributive<number>
        // = never
    1.2 防止分布式
      1.2.1 要求: 泛型参数不能被 []、{}、() 等包裹
      例子1: 防止分布式（展示不分布的效果）
        type NonDistributive2<T> = [T] extends [string] ? T : never;
        type D3 = NonDistributive2<string | number>; // [string | number] extends [string] -> never

      例子2: 防止分布式 - 看起来是没有防止，但实际上是一个联合类型
        type NonDistributive<T> = [T] extends [string] ? `${T}!` : never;
        type D2 = NonDistributive<'a' | 'b'>; ['a' | 'b'] extends [string]  -> !a | !b
        type TemplateResult = `${'a' | 'b'}!`; // 'a!' | 'b!' // 并没有出现分布式，这是模板字面量类型的固有行为：当模板中包含联合类型时，TypeScript会自动分布计算结果。这与条件类型的分布机制完全不同。
  2. 当遇到对象映射结构时，如果出现目标泛型参数对象(T)的某个键值和第二个泛型参数U有关联，可直接使用泛型推断
    2.1 例子: type LookUp<T, U> = T extends { type: U } ? T : never
      T ↓
      interface Cat { 
        type: 'cat' 
      }
      U ↓
      'cat'
      
      U的值跟T['type']的值有关，可以直接把U放在extends { type: U }中，这样就不需要使用T['type'] extends U来具体推断了

*/


/*
  myself1 - no pass
  反思:
    1. 没有学习分配律之前，以为extends只需要写在泛型约束处
      1.1 泛型必须是联合类型
      1.2 实际上在泛型中定义的extends只是泛型约束
      1.2 等式右侧的extends + T裸参数类型的约束(非[] | {} | ()包裹) 才能触发分配律
    type LookUp<T extends { type: string, [key: string]: any }, U extends T['type']> = T['type'] extends U ? T : never
    
    2. 多个泛型参数，如果某个泛型结构和另一个泛型参数有关联，可以直接使用泛型推断，不需要再通过某个结构中的某个属性判断是否extends另一个泛型参数
      2.1 例子: 泛型参数2和泛型参数1对象结构的属性值有关，则直接可以把泛型参数2代入到结构中进行extends
      type LookUp<T, U> = T extends { type: U } ? T : never


  myself2 - 学习 泛型约束 + 分配律(必须要在等式右边写extends)
  type LookUp<T extends { type: string, [key: string]: any }, U extends T['type']> = T extends { type: string, [key: string]: any } ? T['type'] extends U ? T : never : never

  myself3 - 学习 当遇到对象映射结构时，如果出现目标泛型参数对象(T)的某个键值和第二个泛型参数U有关联，可直接使用泛型推断
  type LookUp<T extends { type: string }, U extends T['type']> = T extends { type: U } ? T : never
*/

/*
  issues1 - all pass
  type LookUp<T, U> = T extends { type: U } ? T : never

  issues2 - all pass
  type LookUp<T extends { type: string }, U extends T['type']> = Extract<T, {type: U}> // 使用内置工具Extract
  type LookUp<U extends { type: string }, T extends U["type"]> = U extends { type: T } ? U : never // 不使用内置工具Extract
*/

type LookUp<T extends { type: string }, U extends T['type']> = T extends { type: U } ? T : never

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type Animal = Cat | Dog

type cases = [
  Expect<Equal<LookUp<Animal, 'dog'>, Dog>>,
  Expect<Equal<LookUp<Animal, 'cat'>, Cat>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/62/answer/zh-CN
  > 查看解答：https://tsch.js.org/62/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
