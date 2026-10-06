/* 本文件由 tools/build.py 自动生成，重新运行脚本会覆盖。
   小改文案可以直接手改，但下次 build 会被 meta.json 里的值覆盖。 */
window.__PROBLEMS__ = {
  "generatedAt": "2026-10-06 20:48:44",
  "site": {
    "title": "算法可视化题库",
    "subtitle": "字符串专题 · 逐帧看懂双指针与 KMP",
    "description": "本地 LeetCode / 卡玛网 算法题的可视化演示合集，支持逐帧单步、变量追踪与代码行高亮联动。"
  },
  "problems": [
    {
      "id": "344-reverse-string",
      "order": 1,
      "no": "344",
      "platform": "LeetCode",
      "title": "反转字符串",
      "subtitle": "变量可视化",
      "category": "字符串 · 双指针",
      "tags": [
        "双指针",
        "原地交换"
      ],
      "level": "简单",
      "language": "Python",
      "theme": "dark",
      "summary": "观察 left、right 两个指针与字符数组在每一步如何变化，理解 O(1) 空间的原地交换为什么只需走一半。",
      "complexity": "时间 O(n) · 空间 O(1)",
      "file": "problems/344-reverse-string.html",
      "bytes": 10904,
      "fingerprint": "150e50f004",
      "updated": "2026-09-25 14:35",
      "source": "344.反转字符串.html"
    },
    {
      "id": "541-reverse-string-ii",
      "order": 2,
      "no": "541",
      "platform": "LeetCode",
      "title": "反转字符串 Ⅱ",
      "subtitle": "变量变化动画",
      "category": "字符串 · 双指针",
      "tags": [
        "双指针",
        "分段处理"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "每 2k 个字符为一组，只反转每组的前 k 个字符。逐帧观察 i、start、end、temp 的取值与边界计算。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "file": "problems/541-reverse-string-ii.html",
      "bytes": 14716,
      "fingerprint": "21314dd040",
      "updated": "2026-09-25 14:53",
      "source": "541.反转字符串Ⅱ.html"
    },
    {
      "id": "kamacoder-55-right-rotate",
      "order": 3,
      "no": "55",
      "platform": "卡玛网",
      "title": "右旋字符串",
      "subtitle": "变量变化动画",
      "category": "字符串 · 三次反转",
      "tags": [
        "三次反转",
        "异或交换"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "整体反转 → 反转前 n 个字符 → 反转后半段，三段动画逐次播放，交换方式为异或实现。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "file": "problems/kamacoder-55-right-rotate.html",
      "bytes": 14742,
      "fingerprint": "2a5800d1d7",
      "updated": "2026-10-06 19:26",
      "source": "卡玛网.55.右旋字符串_静态网页.html"
    },
    {
      "id": "leetcode-28-strstr",
      "order": 4,
      "no": "28",
      "platform": "LeetCode",
      "title": "找出字符串中第一个匹配项的下标",
      "subtitle": "KMP 演示",
      "category": "字符串 · KMP",
      "tags": [
        "KMP",
        "next 前缀表"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "先构造 next 前缀表，再让主串指针 i 只前进不回退，直观看到每一次失配时 j 的回退落点。",
      "complexity": "时间 O(n+m) · 空间 O(m)",
      "file": "problems/leetcode-28-strstr.html",
      "bytes": 15155,
      "fingerprint": "1bc2d7b432",
      "updated": "2026-10-06 19:50",
      "source": "leetcode.28.找出字符串中第一个匹配项的下标_静态网页.html"
    }
  ]
};
