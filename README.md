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
