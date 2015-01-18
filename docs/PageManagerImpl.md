# 页面管理框架实现

## 核心功能

1. 单页面中的虚拟页面的模块化，按需加载
2. 虚拟页面生命周期管理，~~
3. 页面切换效果
4. 页面路由	~~
5. 打包，项目级别的打包

## 结构

框架实现包括js和css，js位于`src/PageManager`, css位于`src/PageManager/page.css`。主要模块：

* Page 虚拟页面对象
* PageLoader, 负责页面加载，并生成Page对象
* PageManager, 页面管理、切换
* PageAnimation, 动画模块, 测试： test/PageAnimation.html

## 生命周期管理

加载新页面前，如果可用内存超过80%（`console.memory.usedJSHeapSize / console.memory.jsHeapSizeLimit`）,

## 页面切换
通过调整dom元素顺序显示当前页