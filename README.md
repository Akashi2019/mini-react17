# mini-react17
手写一个mini版的react

## react virtual dom
用javascript对象标识DOM信息和结构，当状态变更的时候，重新渲染这个javascript的对象结构。这个javascript都西昂称为virtual dom;

### why? 
DOM操作很慢，轻微的操作都可能导致页面重新排版，非常好性能。相对于DOM对象，js对象处理起来更快而且更简单。通过diff算法对比新旧vdom之间的差异，可以批量的，最小化的执行dom操作，从而提高性能。

### where? 
React中用JSX语法描述视图，通过babel-loader转以后他们变为React.createElement(...)形式，该函数将生成vdom来描述真实dom。将来如果状态变化，vdom将作出相应变化，在通过diff算法对比新老vdom区别从而做出最终的dom操作。

## JSX
### 什么事JSX
语法糖，React使用JSX来替代常规的javascript。
JSX是一个看起来很像XML的javscript语法扩展

### 为什么需要JSX

- 开发效率：使用JSX编写模板简单快速。
- 执行效率：JSX编译为javascrip代码后进行优化，执行更快。
- 类型安全：在编译过程中发现错误。

## React16 原理
babel-loader会编译JSX为React.createElement(...)

## React17 原理
React17中的JSX转换不会将JSX转换为React.createElement(...),而是自动从React的package中引入新的入口函数并调用。JSX语法没有改变，可以继续工作

## 环境搭建
npm install webpack webpack-cli -D
npm install @babel/core @babel/preset-env babel-loader -D
npm install @babel/plugin-transform-react-jsx -D

## fiber架构
### reconciliation协调
#### 设计动力
在某一时间节点调用React的render()方法，会创建一棵由React元素组成的树，在下一次state或props更新时，相同的render()方法会返回一棵不同的树。React需要基于这两棵树之间的差别来判断如何有效率的更新UI以保证当前UI与最新的树保持同步

这个算法问题有一些通用的解决方案，即生成将一棵树转换成另一棵树的最小操作数，然后，即使在最前沿的算法中，该算法的复杂度为O(n3)，其中n是元素的数量。

如果在React中使用了该算法，那么展示1000个元素所需要的执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。于是React在一下亮哥假设的基础之上提出了一套O(n)的启发式算法：
1.两个不同类型的元素会产生出不同的树；
2.开发者可以通过key prop 来暗示哪些元素在不同的渲染下能保持稳定；
在实践中，我们发现以上假设几乎所有实用的场景下都成立。

## diff算法
算法复杂度O(n)
### diff策略
1.同级比较，Web UI中DOM节点跨层级的移动操作特别少，可以忽略不计；
2.拥有不同类型的亮哥组件将会生成不同的树形结构；
3.开发者可以通过key prop来暗示哪些子元素在不同的渲染下能保持稳定；
### diff过程
#### 比对亮哥虚拟dom时会有三种操作：删除、替换和更新
vnode是现在的虚拟dom，newVnode是新虚拟dom。
删除：newVnode不存在时
替换：vnode和newVnode类型不同或key不同时
更新：有相同类型和key但vnode和newVnode不同时
在实践中页证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。

## 为什么需要fiber
### React的killer feature: virtual dom
1.为什么需要fiber
  对于大型项目，组件树会很大，这个时候递归遍历的成本就会很高，会造成主线程被持续占用，结果就是主线程上的布局、动画等周期性任务就法务立即得到处理，造成视觉上的卡顿，影响用户体验。
2.任务分解的意义
  解决上面的问题
3.增量渲染（把渲染人物拆分成块，匀到多帧）
4.更新时能够暂停，终止，复用渲染任务
5.给不同类型的更新赋予优先级
6.并发方面新的基础能力
7.更流畅

### 实现fiber
#### window.requestIdleCallback(callback[, options])
window.requestIdleCallback()方法将在浏览器的空闲时段内调用函数排队。这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数制定了执行超时时间timeout，则有可能为了在超时钱执行函数而打乱执行顺序

你可以在空闲回调函数中调用requestIdleCallback()，以使在下一次通过事件循环之前调度另一个回调。

callback

一个在事件循环空闲即将被调用的函数的引用。函数会受到一个名为IdleDeadline的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态

options 可选

包括可选的配置参数，具有如下属性：
timeout：如果制定了timeout并具有一个正值，并且尚未通过超时毫秒数调用回调，那么回调会在下一次空闲时期被强制执行，尽管这样很可能会对性能造成负面影响。

react中requestIdleCallback的hack在
react/packages/scheduler/src/forks/ScheduleHostConfig.default.js

### fiber链表结构




