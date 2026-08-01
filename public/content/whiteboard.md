# 不可压缩 Navier–Stokes 方程

> 当前白板示例 · 近期推导将以 Markdown 与 LaTeX 片段手动发布

对于密度恒定的不可压缩牛顿流体，动量守恒方程写作：

$$
\frac{\partial \mathbf{u}}{\partial t}
+ (\mathbf{u}\cdot\nabla)\mathbf{u}
= -\frac{1}{\rho}\nabla p
+ \nu\nabla^2\mathbf{u}
+ \mathbf{f}
$$

并满足连续性约束：

$$
\nabla\cdot\mathbf{u}=0
$$

## 当前关注

将非线性对流项与压力投影分开处理，并检查离散速度场是否始终满足散度约束。这里以后可以继续加入边界条件、无量纲化过程和本周尚待验证的假设。
