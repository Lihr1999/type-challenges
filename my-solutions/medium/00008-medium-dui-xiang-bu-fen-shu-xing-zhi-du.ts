/*
  8 - 对象部分属性只读
  -------
  by Anthony Fu (@antfu) #中等 #readonly #object-keys

  ### 题目

  实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。

  类型 `K` 指定 `T` 中要被设置为只读 (readonly) 的属性。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。

  例如

  ```ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  const todo: MyReadonly2<Todo, 'title' | 'description'> = {
    title: "Hey",
    description: "foobar",
    completed: false,
  }

  todo.title = "Hello" // Error: cannot reassign a readonly property
  todo.description = "barFoo" // Error: cannot reassign a readonly property
  todo.completed = true // OK
  ```

  > 在 Github 上查看：https://tsch.js.org/8/zh-CN
*/

/* _____________ 你的代码 _____________ */

// 2025.12.09 10:20:07
/*
  知识点: 
  1. 泛型设置默认值
    type MyReadonly2<T, U extends keyof T = keyof T>
  2. 更正"xx | never"的思维: 这是联合类型，并且任意类型和never组成的联合类型，结果都是前面的类型
  3. 更正"= 默认值"的思维: 如果其中一个泛型参数不传是取前一个泛型参数的key，那么这个泛型参数可以直接固定默认值keyof 前一个泛型参数即可，不需要判断是否传值为never
  4. 更正泛型参数中，"T extends never ? true : false"的思维: 当参数不传的时候，这个表达式返回的结果是never，并非是boolean
    type Test<T extends string = never> = T extends never ? true : false
    type test = Test // never
  5. 当描述对象结构类型时，遇到readonly(只读)、?(可选)根据条件不同进行定义的时候，一次表达式无法完成，需要使用 & 合并两个对象结构
    例子: 可以实现部分readonly、部分正常描述
    {  readonly [k in U]: T[k] } & { [k in keyof T as k extends U ? never : k]: T[k] }
  6. 构建映射类型注意事项
    6.1 同态映射类型 - 直接使用 [k in keyof OriginalType] 会保留所有修饰符
    6.2 非同态映射类型 - 使用 条件类型 或 类型操作 生成的键会丢失修饰符 - [k in MyExlude<keyof Todo2, 'desciprtion'>]: Todo2[k]
  7. 交叉类型进行合并时，同名属性会优先保留不带有修饰符的
    type r3 = { test: string, test1: string } & { readonly test: string, test1?: string }
    const r3: r3 = { 'test': '1', 'test1': '2' } // 会自动把readonly和?去掉 即 test是可修改、test1是必填的

  反思: 
  1. 泛型参数类型判断误区
    1.1 当时的思路: U可以是keyof T(考虑到智能提示，如果有内容的话智能是T的key值) 或者是 never(完全不传第二个参数)
      1.1.1 会导致问题: 
        1.1.1.1 U extends的是一个联合类型
        1.1.1.2 当U不传时，U就是never 即：U extends never 这个条件类型不会返回 true 分支，而是直接返回 never 本身
          type Test<T extends string, U extends never = never> = U extends never ? true : false
          type test = Test<'abc'> // never
          解决方法: type IsNever<T> = [T] extends [never] ? true : false // 需要使用类型包装技巧来避免 never 的短路行为
    1.2 当时的U extends (keyof T | never)
      1.1.1 keyof T | never其实就是keyofT
        解决方法: keyof T = never // "U 必须是 keyof T 的子类型，如果不指定则默认为 never"

  2. type MyReadonly2<T, U extends keyof T = keyof T>
    2.1 此方法直接让U传不传参数都是extends T，那么就可以获得U的所有情况了，不需要另外判断U是否为没传值never

    // 错误写法
    type MyReadonly2<T, U extends (keyof T | never) = never> = U extends never ? {
      readonly [k in U]: T[k]
    } : {
      readonly [k in U]: T[k]
    } & {
        [k in keyof T as k extends U ? never : k]: T[k]
      }
    type result1 = MyReadonly2<Todo1> // never
*/


// myself
type MyReadonly2<T, U extends keyof T = keyof T> = {
  readonly [k in U]: T[k]
} & {
  [k in keyof T as k extends U ? never : k]: T[k]
}

/*
  issues
  type MyExlude<T, K> = T extends K ? never : T
  type MyReadonly2<T, U extends keyof T = keyof T> = { readonly [k in U]: T[k] } & { [k in MyExlude<keyof T, U>]: T[k] }
  错误: Todo2中原本的title是readonly，使用MyExclude之后，导致readonly丢失
  type z = MyReadonly2<Todo2, 'description'> // { readonly description?: string | undefined } & { title: string, completed: boolean }
*/

/* _____________ 测试用例 _____________ */
import type { Alike, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'description'>, Expected>>,
]

// @ts-expect-error
type error = MyReadonly2<Todo1, 'title' | 'invalid'>

interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

interface Expected {
  readonly title: string
  readonly description?: string
  completed: boolean
}

/* _____________ 下一步 _____________ */
/*
  > 分享你的解答：https://tsch.js.org/8/answer/zh-CN
  > 查看解答：https://tsch.js.org/8/solutions
  > 更多题目：https://tsch.js.org/zh-CN
*/
