---
title: 写作示例
description: 这篇是草稿，只在本地预览时出现，用来参考 Markdown 的各种写法。
pubDate: 2026-11-20
tags:
  - 示例
draft: true
---

这篇文章标了 `draft: true`，所以只会在 `npm run dev` 的本地预览里出现，不会发布到线上。可以照着它的写法写新文章。

## Frontmatter

每篇文章开头的这一段决定标题、日期和标签：

```yaml
---
title: 文章标题
description: 一句话简介，会显示在列表和搜索结果里
pubDate: 2026-11-24
updatedDate: 2026-11-30   # 可选
tags:
  - 音游
  - Unity
cover: ./images/cover.jpg # 可选，文章顶部横幅
draft: true               # 可选，草稿不会发布
---
```

## 代码

代码块写上语言名就会高亮：

```cpp
Vec3 radiance(const Ray& ray, int depth) {
    Hit hit;
    if (!scene.intersect(ray, hit)) return Vec3(0.0);
    if (depth >= maxDepth) return hit.material.emission;

    Vec3 dir = sampleHemisphere(hit.normal);
    float cosTheta = dot(dir, hit.normal);
    return hit.material.emission
         + hit.material.albedo * radiance(Ray(hit.point, dir), depth + 1) * cosTheta * 2.0f;
}
```

行内代码用反引号，比如 `GOGC=100`。

## 数学公式

行内公式用单个美元符号：$L_o = L_e + \int_{\Omega} f_r L_i \cos\theta \, d\omega$。

独立公式用两个美元符号：

$$
L_o(x, \omega_o) = L_e(x, \omega_o) + \int_{\Omega} f_r(x, \omega_i, \omega_o)\, L_i(x, \omega_i)\, (\omega_i \cdot n)\, d\omega_i
$$

### 引用和列表

> 引用的文字会显示成这样，适合摘录。

1. 有序列表
2. 第二项

- 无序列表
- 第二项

### 表格

| 配置      | 平均延迟 | P99 延迟 |
| --------- | -------- | -------- |
| 默认 GC   | 1.2 ms   | 9.8 ms   |
| 自适应 GC | 1.1 ms   | 6.4 ms   |

（表格里的数字只是示例。）

---

## 图片

把图片放在 `src/content/blog/` 下，用相对路径引用，构建时会自动压缩：

![首页头图](../../assets/hero-oc.jpg)
