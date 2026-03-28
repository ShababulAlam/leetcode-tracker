import { Problem } from "./types";

export const PROBLEMS: Problem[] = [
  // Arrays & Hashing
  { id: "two-sum", name: "Two Sum", difficulty: "easy", topic: "Arrays & Hashing", pattern: "Hash Map", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/two-sum/" },
  { id: "best-time-to-buy-and-sell-stock", name: "Best Time to Buy and Sell Stock", difficulty: "easy", topic: "Arrays & Hashing", pattern: "Sliding Window", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: "contains-duplicate", name: "Contains Duplicate", difficulty: "easy", topic: "Arrays & Hashing", pattern: "Hash Map", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/" },
  { id: "product-of-array-except-self", name: "Product of Array Except Self", difficulty: "medium", topic: "Arrays & Hashing", pattern: "Prefix Sum", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: "longest-consecutive-sequence", name: "Longest Consecutive Sequence", difficulty: "medium", topic: "Arrays & Hashing", pattern: "Hash Set", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/longest-consecutive-sequence/" },
  { id: "group-anagrams", name: "Group Anagrams", difficulty: "medium", topic: "Arrays & Hashing", pattern: "Hash Map", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/" },

  // Stack
  { id: "valid-parentheses", name: "Valid Parentheses", difficulty: "easy", topic: "Stack", pattern: "Stack", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/" },
  { id: "min-stack", name: "Min Stack", difficulty: "medium", topic: "Stack", pattern: "Stack", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/min-stack/" },
  { id: "daily-temperatures", name: "Daily Temperatures", difficulty: "medium", topic: "Stack", pattern: "Monotonic Stack", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/" },
  { id: "car-fleet", name: "Car Fleet", difficulty: "medium", topic: "Stack", pattern: "Monotonic Stack", frequency: "Medium", leetcodeUrl: "https://leetcode.com/problems/car-fleet/" },
  { id: "largest-rectangle-in-histogram", name: "Largest Rectangle in Histogram", difficulty: "hard", topic: "Stack", pattern: "Monotonic Stack", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },

  // Binary Search
  { id: "binary-search", name: "Binary Search", difficulty: "easy", topic: "Binary Search", pattern: "Binary Search", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/binary-search/" },
  { id: "search-a-2d-matrix", name: "Search a 2D Matrix", difficulty: "medium", topic: "Binary Search", pattern: "Binary Search", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: "koko-eating-bananas", name: "Koko Eating Bananas", difficulty: "medium", topic: "Binary Search", pattern: "Binary Search on Answer", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: "find-minimum-in-rotated-sorted-array", name: "Find Minimum in Rotated Sorted Array", difficulty: "medium", topic: "Binary Search", pattern: "Binary Search", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: "search-in-rotated-sorted-array", name: "Search in Rotated Sorted Array", difficulty: "medium", topic: "Binary Search", pattern: "Binary Search", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: "median-of-two-sorted-arrays", name: "Median of Two Sorted Arrays", difficulty: "hard", topic: "Binary Search", pattern: "Binary Search", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },

  // Linked List
  { id: "reverse-linked-list", name: "Reverse Linked List", difficulty: "easy", topic: "Linked List", pattern: "Two Pointers", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "easy", topic: "Linked List", pattern: "Two Pointers", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: "linked-list-cycle", name: "Linked List Cycle", difficulty: "easy", topic: "Linked List", pattern: "Fast & Slow Pointers", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: "reorder-list", name: "Reorder List", difficulty: "medium", topic: "Linked List", pattern: "Two Pointers", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/reorder-list/" },
  { id: "remove-nth-node-from-end-of-list", name: "Remove Nth Node From End", difficulty: "medium", topic: "Linked List", pattern: "Two Pointers", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: "lru-cache", name: "LRU Cache", difficulty: "medium", topic: "Linked List", pattern: "Hash Map + DLL", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/lru-cache/" },
  { id: "merge-k-sorted-lists", name: "Merge K Sorted Lists", difficulty: "hard", topic: "Linked List", pattern: "Heap / Divide & Conquer", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/" },

  // Trees
  { id: "invert-binary-tree", name: "Invert Binary Tree", difficulty: "easy", topic: "Trees", pattern: "DFS/BFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: "maximum-depth-of-binary-tree", name: "Maximum Depth of Binary Tree", difficulty: "easy", topic: "Trees", pattern: "DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: "balanced-binary-tree", name: "Balanced Binary Tree", difficulty: "easy", topic: "Trees", pattern: "DFS", frequency: "Medium", leetcodeUrl: "https://leetcode.com/problems/balanced-binary-tree/" },
  { id: "lowest-common-ancestor-of-a-binary-search-tree", name: "Lowest Common Ancestor of BST", difficulty: "medium", topic: "Trees", pattern: "DFS", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: "binary-tree-level-order-traversal", name: "Binary Tree Level Order Traversal", difficulty: "medium", topic: "Trees", pattern: "BFS", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: "binary-tree-right-side-view", name: "Binary Tree Right Side View", difficulty: "medium", topic: "Trees", pattern: "BFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: "validate-binary-search-tree", name: "Validate Binary Search Tree", difficulty: "medium", topic: "Trees", pattern: "DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: "kth-smallest-element-in-a-bst", name: "Kth Smallest Element in BST", difficulty: "medium", topic: "Trees", pattern: "Inorder DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: "construct-binary-tree-from-preorder-and-inorder-traversal", name: "Construct BT from Preorder & Inorder", difficulty: "medium", topic: "Trees", pattern: "Divide & Conquer", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: "serialize-and-deserialize-binary-tree", name: "Serialize and Deserialize Binary Tree", difficulty: "hard", topic: "Trees", pattern: "BFS/DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { id: "binary-tree-maximum-path-sum", name: "Binary Tree Maximum Path Sum", difficulty: "hard", topic: "Trees", pattern: "DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },

  // Graphs
  { id: "number-of-islands", name: "Number of Islands", difficulty: "medium", topic: "Graphs", pattern: "DFS/BFS", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/" },
  { id: "clone-graph", name: "Clone Graph", difficulty: "medium", topic: "Graphs", pattern: "DFS + Hash Map", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/clone-graph/" },
  { id: "pacific-atlantic-water-flow", name: "Pacific Atlantic Water Flow", difficulty: "medium", topic: "Graphs", pattern: "Multi-source BFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: "course-schedule", name: "Course Schedule", difficulty: "medium", topic: "Graphs", pattern: "Topological Sort", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/course-schedule/" },
  { id: "course-schedule-ii", name: "Course Schedule II", difficulty: "medium", topic: "Graphs", pattern: "Topological Sort", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: "graph-valid-tree", name: "Graph Valid Tree", difficulty: "medium", topic: "Graphs", pattern: "Union Find", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: "word-ladder", name: "Word Ladder", difficulty: "hard", topic: "Graphs", pattern: "BFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/word-ladder/" },

  // Dynamic Programming
  { id: "climbing-stairs", name: "Climbing Stairs", difficulty: "easy", topic: "Dynamic Programming", pattern: "1D DP", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/" },
  { id: "house-robber", name: "House Robber", difficulty: "medium", topic: "Dynamic Programming", pattern: "1D DP", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/house-robber/" },
  { id: "longest-palindromic-substring", name: "Longest Palindromic Substring", difficulty: "medium", topic: "Dynamic Programming", pattern: "Expand Around Center", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: "coin-change", name: "Coin Change", difficulty: "medium", topic: "Dynamic Programming", pattern: "Unbounded Knapsack", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/coin-change/" },
  { id: "longest-increasing-subsequence", name: "Longest Increasing Subsequence", difficulty: "medium", topic: "Dynamic Programming", pattern: "1D DP / Patience Sort", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: "word-break", name: "Word Break", difficulty: "medium", topic: "Dynamic Programming", pattern: "1D DP", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/word-break/" },
  { id: "unique-paths", name: "Unique Paths", difficulty: "medium", topic: "Dynamic Programming", pattern: "2D DP", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/unique-paths/" },
  { id: "edit-distance", name: "Edit Distance", difficulty: "medium", topic: "Dynamic Programming", pattern: "2D DP", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/edit-distance/" },
  { id: "burst-balloons", name: "Burst Balloons", difficulty: "hard", topic: "Dynamic Programming", pattern: "Interval DP", frequency: "Medium", leetcodeUrl: "https://leetcode.com/problems/burst-balloons/" },

  // Heap / Priority Queue
  { id: "kth-largest-element-in-an-array", name: "Kth Largest Element in Array", difficulty: "medium", topic: "Heap / Priority Queue", pattern: "Min-Heap", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id: "find-median-from-data-stream", name: "Find Median from Data Stream", difficulty: "hard", topic: "Heap / Priority Queue", pattern: "Two Heaps", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { id: "task-scheduler", name: "Task Scheduler", difficulty: "medium", topic: "Heap / Priority Queue", pattern: "Greedy + Heap", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/task-scheduler/" },
  { id: "design-twitter", name: "Design Twitter", difficulty: "medium", topic: "Heap / Priority Queue", pattern: "Heap + OOP", frequency: "Medium", leetcodeUrl: "https://leetcode.com/problems/design-twitter/" },

  // Tries
  { id: "implement-trie-prefix-tree", name: "Implement Trie (Prefix Tree)", difficulty: "medium", topic: "Tries", pattern: "Trie", frequency: "Extremely High", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: "design-add-and-search-words-data-structure", name: "Design Add and Search Words", difficulty: "medium", topic: "Tries", pattern: "Trie + DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id: "word-search-ii", name: "Word Search II", difficulty: "hard", topic: "Tries", pattern: "Trie + Backtracking", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/word-search-ii/" },

  // Backtracking
  { id: "subsets", name: "Subsets", difficulty: "medium", topic: "Backtracking", pattern: "Backtracking", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/subsets/" },
  { id: "permutations", name: "Permutations", difficulty: "medium", topic: "Backtracking", pattern: "Backtracking", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/permutations/" },
  { id: "combination-sum", name: "Combination Sum", difficulty: "medium", topic: "Backtracking", pattern: "Backtracking", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/combination-sum/" },
  { id: "word-search", name: "Word Search", difficulty: "medium", topic: "Backtracking", pattern: "Backtracking + DFS", frequency: "High", leetcodeUrl: "https://leetcode.com/problems/word-search/" },
  { id: "n-queens", name: "N-Queens", difficulty: "hard", topic: "Backtracking", pattern: "Backtracking", frequency: "Medium", leetcodeUrl: "https://leetcode.com/problems/n-queens/" },
];
