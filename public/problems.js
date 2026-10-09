/* 本文件由 tools/build.py 自动生成，重新运行脚本会覆盖。
   小改文案可以直接手改，但下次 build 会被 meta.json 里的值覆盖。 */
window.__PROBLEMS__ = {
  "generatedAt": "2026-10-09 16:12:15",
  "site": {
    "title": "代码随想录刷题同步算法原理可视化site",
    "subtitle": "",
    "description": "本地 LeetCode / 卡玛网 算法题的可视化演示合集，支持逐帧单步、变量追踪与代码行高亮联动。"
  },
  "problems": [
    {
      "id": "344-reverse-string",
      "order": 1,
      "no": "344",
      "platform": "LeetCode",
      "title": "反转字符串",
      "subtitle": "双指针 · temp 中转站",
      "categories": [
        "字符串",
        "双指针法"
      ],
      "tags": [
        "双指针",
        "原地交换",
        "temp 中转站"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "dark",
      "summary": "i 与 j 相向夹逼，每轮只看三件事：判断 i < j、把 s[i] 存进 temp、再用 temp 回填 s[j]。逐帧观察字符如何原地互换，看懂少了 temp 为什么会丢字符。",
      "complexity": "时间 O(n) · 空间 O(1)",
      "category": "字符串",
      "file": "problems/344-reverse-string.html",
      "bytes": 26098,
      "fingerprint": "437f09ad17",
      "updated": "2026-10-08 16:10",
      "source": "leetcode_344_反转字符串.html"
    },
    {
      "id": "541-reverse-string-ii",
      "order": 2,
      "no": "541",
      "platform": "LeetCode",
      "title": "反转字符串 Ⅱ",
      "subtitle": "变量变化动画",
      "category": "字符串",
      "tags": [
        "双指针",
        "分段处理"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "每 2k 个字符为一组，只反转每组的前 k 个字符。逐帧观察 i、start、end、temp 的取值与边界计算。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "categories": [
        "字符串"
      ],
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
      "category": "字符串",
      "tags": [
        "三次反转",
        "异或交换"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "整体反转 → 反转前 n 个字符 → 反转后半段，三段动画逐次播放，交换方式为异或实现。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "categories": [
        "字符串"
      ],
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
      "category": "字符串",
      "tags": [
        "KMP",
        "next 前缀表"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "先构造 next 前缀表，再让主串指针 i 只前进不回退，直观看到每一次失配时 j 的回退落点。",
      "complexity": "时间 O(n+m) · 空间 O(m)",
      "categories": [
        "字符串"
      ],
      "file": "problems/leetcode-28-strstr.html",
      "bytes": 15155,
      "fingerprint": "1bc2d7b432",
      "updated": "2026-10-06 19:50",
      "source": "leetcode.28.找出字符串中第一个匹配项的下标_静态网页.html"
    },
    {
      "id": "leetcode-459-repeated-substring",
      "order": 5,
      "no": "459",
      "platform": "LeetCode",
      "title": "重复的子字符串",
      "subtitle": "KMP next 表演示",
      "category": "字符串",
      "tags": [
        "KMP",
        "next 前缀表"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "light",
      "summary": "构造 next 前缀表，观察最后一个元素的值与字符串长度的关系，理解为什么可以判断是否存在重复子串。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "categories": [
        "字符串"
      ],
      "file": "problems/leetcode-459-repeated-substring.html",
      "bytes": 12075,
      "fingerprint": "600e5c9751",
      "updated": "2026-10-07 16:16",
      "source": "leetcode.459.重复的子字符串_算法逻辑原理动画展示静态网页.html"
    },
    {
      "id": "leetcode-27-remove-element",
      "order": 6,
      "no": "27",
      "platform": "LeetCode",
      "title": "移除元素",
      "subtitle": "快慢指针原地覆盖",
      "categories": [
        "数组",
        "双指针法"
      ],
      "tags": [
        "快慢指针",
        "原地覆盖"
      ],
      "level": "简单",
      "language": "Java",
      "theme": "dark",
      "summary": "fastIndex 只读不回头，slowIndex 只写不后退。逐步观察需要保留的元素如何原地搬到数组前段，以及被跳过的 val 是如何被覆盖掉的。",
      "complexity": "时间 O(n) · 空间 O(1)",
      "category": "数组",
      "file": "problems/leetcode-27-remove-element.html",
      "bytes": 21779,
      "fingerprint": "943393e167",
      "updated": "2026-10-08 15:30",
      "source": "leetcode_27_移除元素.html"
    },
    {
      "id": "151-reverse-words-in-a-string",
      "order": 7,
      "no": "151",
      "platform": "LeetCode",
      "title": "反转字符串中的单词",
      "subtitle": "三步走 · 下标指针",
      "categories": [
        "字符串",
        "双指针法"
      ],
      "tags": [
        "双指针",
        "整体反转",
        "逐词反转",
        "去除多余空格"
      ],
      "level": "中等",
      "language": "Java",
      "theme": "dark",
      "summary": "禁用 split / trim / reverse，只用 StringBuilder 和几个下标指针：先去首尾与中间多余空格，再整体反转，最后逐词反转回来。每一步都摆出 start、end、c、sb 的真实取值，看清「两次反转 = 位置颠倒而字母复原」这个不变量。",
      "complexity": "时间 O(n) · 空间 O(n)",
      "category": "字符串",
      "file": "problems/151-reverse-words-in-a-string.html",
      "bytes": 44197,
      "fingerprint": "d9b6dce069",
      "updated": "2026-10-09 15:37",
      "source": "leetcode_151_反转字符串中的单词.html"
    }
  ]
};
