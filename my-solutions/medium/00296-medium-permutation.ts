/*
  296 - Permutation
  -------
  by Naoto Ikuno (@pandanoir) #中等 #union

  ### 题目

  实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。

  ```typescript
  type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']
  ```

  > 在 Github 上查看：https://tsch.js.org/296/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.30 15:34:17
/*
  知识点: 
  1. 分配式(分布式) 
    自动分布条件: 
      - 泛型
      - 联合类型
      - 等号右侧 + 泛型参数 写在extends左侧
        - 泛型参数需要是裸类型参数
      - 每个extends条件都是独立判断的，针对泛型参数都是根据以上的自动分配条件进行重新判断

    1.1 解除分配律, 使用[T]包裹泛型参数产生非裸类型参数 - 自动解除
      type Wrapped<T> = [T] extends [never] ? [] : [T]
      type Result = Wrapped<'a' | 'b'> // ['a' | 'b']
      type Result1 = Wrapped<never> // []

    1.2 使用Exclude过滤联合类型中的第一个类型 - Exclude搭配联合类型使用

    1.3 泛型参数如果不执行extends，不具有分布式特性
      1.3.1  <T, U = T> = T extends xx ? xx : xx
        T是具有分布式特性(参与extends)，U不具备分布式(没有参与extends)
        假设T = 'a' | 'b', 即: <T = 'a', U = 'a' | 'b'> | <T = 'b', U = 'a' | 'b'>
    
    1.4 元组中如果有子类型为联合类型，会自动展开为联合类型数组结构(TS中的隐式行为)
      例子1: 元组元素类型具有联合类型
        type z = ['a', ...(['b', 'c'] | ['c', 'b'])]
        结果: type z = ["a", "b", "c"] | ["a", "c", "b"]

    1.5 当TS无法确定一个有效的类型时, 会整个表达式推断为never
      type Permutation<T, U = T> = T extends any ? [T, ...Permutation<Exclude<U, T>>] : never
      type Result = Permutation<'B' | 'C'> // never

    1.6 每个extends条件判断中，泛型类型都是单独判断是否满足自动分配条件
      // 第一个extends条件判断([T] extends [never])，使用了非裸类型，所以T不具备自动分配
      // 第二个extends条件判断(any extends T)，T不在extends左侧，所以不具备自动分配，['a' | 'b']
      type Permutation<T, U = T> = [T] extends [never] ? [] : any extends T ? [T] : never

    1.7: 泛型类型参数 extends xx ? - 只有写在extends左侧的泛型类型参数才具有自动分配效果
*/

/*
  思路:
  错误的初始思路: 
    1. 考虑将联合类型转为字符串 + 翻转字符串 ×
    2. 考虑将联合类型转为数组 + 翻转数组 ×
  
  正确的思路:
    1. 返回值需要是数组
    2. 使用分配式(分布式): 一. 泛型 二. 裸类型参数 三. 联合类型
    3. 使用非裸类型参数解除分布式, 处理never的情况 [T] extends [never]
    4. 根据分布式的特点，使用Exclude先把第一个T从联合类型中过滤
    5. [T, ...递归<Exclude<U, T>>]
    6. myself总结计算过程: 
      6.1 先使用[T]解除分布式判断是否为never - [T] extends [never] ? [] : 正常逻辑
          例子: xx<never> => 结果: []
      6.2 T extends any ? [T] : never
          结果: ["a"] | ["b"] | ["c"]
      6.3 T extends any ? [T, Exclude<U, T>] : never
          结果: ["a", "b" | "c"] | ["b", "a" | "c"] | ["c", "a" | "b"]
      6.4 T extends any ? [T, ...Permutation<Exclude<U, T>>] : never
          结果: ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"] | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
          6.4.1 根据分布式(泛型+联合类型+裸类型参数)的计算过程: 
            [T, ...Permutation<Exclude<U, T>>] => ['a', ...Permutation<'b' | 'c'>]
            此时'a'已经被分布，那么剩下的是'b' | 'c': Permutation<T = 'b', U = 'b' | 'c'> | Permutation<T = 'c', U = 'b' | 'c'>
            先分配'b', 即 Permutation<T = 'b', U = 'b' | 'c'>
                ['b', ...Permutation<'c'>] 结果=> ['b', 'c'] 再把此结果展开到刚刚的'a'分布式中['a', 'b', 'c']
            再分配'c', 即 Permutation<T = 'c', U = 'b' | 'c'>
                ['c', ...Permutation<'b'>] 结果=> ['c', 'b'] 再把此结果展开到刚刚的'a'分布式中['a', 'c', 'b']
            代入首次分配的'a', 即 ['a', ...(['b', 'c'] | ['c', 'b'])] => ["a", "b", "c"] | ["a", "c", "b"]

    7. AI总结计算过程: 
      Permutation<'a' | 'b'>
      │
      ├─ 参数赋值: T = 'a' | 'b', U = 'a' | 'b'
      │
      ├─ [T] extends [never]?  → ['a'|'b'] extends [never] → false
      │
      └─ T extends any? (分布开始)
        │
        ├─ T = 'a' 分支:
        │   └─ ['a', ...Permutation<Exclude<'a'|'b', 'a'>>]
        │       └─ ['a', ...Permutation<'b'>]
        │           │
        │           ├─ T = 'b', U = 'b'
        │           ├─ ['b'] extends [never]? → false
        │           └─ 'b' extends any? → ['b', ...Permutation<never>]
        │               └─ ['b', ...[]] = ['b']
        │           
        │       └─ ['a', 'b']
        │
        └─ T = 'b' 分支:
            └─ ['b', ...Permutation<'a'>]
                └─ ['b', 'a']

      最终结果: ['a', 'b'] | ['b', 'a']
*/

/*
  issues
  type Permutation<All, Item = All> =
  [All] extends [never]
  ? []
  : Item extends All
  ? [Item, ...Permutation<Exclude<All, Item>>]
  : never
*/
















type Permutation<T, U = T> = [T] extends [never] ? [] : T extends any ? [T, ...Permutation<Exclude<U, T>>] : never

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Permutation<'A'>, ['A']>>,
  Expect<Equal<Permutation<'A' | 'B' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<'B' | 'A' | 'C'>, ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']>>,
  Expect<Equal<Permutation<boolean>, [false, true] | [true, false]>>,
  Expect<Equal<Permutation<never>, []>>,
]

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/296/answer/zh-CN
  > 查看解答：https://tsch.js.org/296/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/


/* 做题过程
// 思路:
// 1. 排除keyof
// 2. 使用分配式: 一. 泛型 二. 裸类型参数 三. 联合类型
// 3. 拆分步骤:
// 3.1 
// 最后返回一个数组，自动有条件分配，所以只需要考虑怎么把T组合起来
// 4. 思考如何把每一个T给下一个
// 3.1 ['a'] | ['b'] | ['c'] =>
// 3.2 'a' | 'b' | 'c' => 
// 3.3 ['a' | 'b', 'c'] =>

// type Test<T extends string> = T extends `${infer First}${infer Rest}` ? Rest extends '' ? [T] : [First, ...Test<Rest>] : never
// type r1 = Test<'A' | 'B'> // ['A', 'B'] | ['B' | 'A']
// type r2 = Test<'A' | 'B' | 'C'>
// // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

// type zzz<T = ''> = T extends string ? `${T}` : T
// type result = zzz<'a' | 'b' | 'c'>

// type hh<T extends string> = [T] extends [string] ? `${T}` : never
// type hhResult = hh<'a' | 'b' | 'c'>

// type obj<T> = T[] extends unknown[] ? [T] : never
// type reverseArr<T> = T extends [infer First, ...infer Rest] ? First : T
// type a = reverseArr<['a' | 'b' | 'c']>
// type m = obj<'a' | 'b' | 'c'> extends [infer First, ...infer Rest] ? [...Rest, First] : []

// 逆变 推断 params
// type Contravariance<in T> = (v: T) => void
// type generateByFn<T> = Contravariance<T> extends Contravariance<any> ? T : never
// type result = generateByFn<'a' | 'b' | 'c'>

// 测试使用[...T] - no work
// type z<T> = (<T>() => T) extends (<T>(args: [T]) => T) ? & T : never
// type result = z<'a' | 'b' | 'c'>

type Permutation<T, U = T> = [T] extends [never] ? [] : T extends any ? [T, ...Permutation<Exclude<U, T>>] : never
type result = Permutation<'a' | 'b' | 'c'>

type Test<T, U = T> = T extends any ? U : never
type test = Test<'a' | 'b' | 'c'>


    过程: 
        1. 先使用[T]解除分布式判断是否为never - [T] extends [never] ? [] : 正常逻辑
            例子: xx<never> => 结果: []
        2. T extends any ? [T] : never
            结果: ["a"] | ["b"] | ["c"]
        3. T extends any ? [T, Exclude<U, T>] : never
            结果: ["a", "b" | "c"] | ["b", "a" | "c"] | ["c", "a" | "b"]
        4. T extends any ? [T, ...Permutation<Exclude<U, T>>] : never
            结果: ["a", "b", "c"] | ["a", "c", "b"] | ["b", "a", "c"] | ["b", "c", "a"] | ["c", "a", "b"] | ["c", "b", "a"]
            4.1 根据分布式(泛型+联合类型+裸类型参数)的计算过程: 
                [T, ...Permutation<Exclude<U, T>>] => ['a', ...Permutation<'b' | 'c'>]
                此时'a'已经被分布，那么剩下的是'b' | 'c': Permutation<T = 'b', U = 'b' | 'c'> | Permutation<T = 'c', U = 'b' | 'c'>
                先分配'b', 即 Permutation<T = 'b', U = 'b' | 'c'>
                    ['b', ...Permutation<'c'>] 结果=> ['b', 'c'] 再把此结果展开到刚刚的'a'分布式中['a', 'b', 'c']
                再分配'c', 即 Permutation<T = 'c', U = 'b' | 'c'>
                    ['c', ...Permutation<'b'>] 结果=> ['c', 'b'] 再把此结果展开到刚刚的'a'分布式中['a', 'c', 'b']
                代入首次分配的'a', 即 ['a', ...(['b', 'c'] | ['c', 'b'])] => ["a", "b", "c"] | ["a", "c", "b"]


// type z = ['a', ...(['b', 'c'] | ['c', 'b'])]

// 现在我已经实现Permutation类了，但是有几个问题需要你解答
// ## 问题:
// 1. 分布特性的疑问
//     1.1 是不是只要是联合类型+extends+裸类型参数就会自动分布？比如下面的U = T，没有在条件判断中使用extends，那么T就是每次联合类型按顺序拆分的具体类型，然后U不变，一直是T的这个联合类型
//         <T, U = T> = T extends any ? xx : xx 此处U没有参与条件判断，所以就是整个联合类型？
    
//     1.2 如果1.1的疑问成立，Exclude<U, T>是不是可以理解为Exclude<'a' | 'b' | 'c', 'a'> | <'a' | 'b' | 'c', 'b'> | <'a' | 'b' | 'c', 'c'>

//     1.3 如果1.1和1.2都成立，此处的计算逻辑[T, ...Permutation<Exclude<U, T>>]
//         假如: T = 'a' | 'b' | 'c'
//         相当于: ['a', ...Permutation<Exclude<U, T>>] | ['b', ...Permutation<Exclude<U, T>>] | ['c', ...Permutation<Exclude<U, T>>]
//         假设首次分配'a'，结果就是: ['a', ...(['b', 'c'] | ['c', 'b'])]
//         我这里不太理解的是，只要数组出现联合类型，最终TS也会自动拆开得出 ["a", "b", "c"] | ["a", "c", "b"]嘛？

*/