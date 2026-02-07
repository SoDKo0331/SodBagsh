
import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  // --- EASY PROBLEMS ---
  {
    id: 'p1',
    title: 'Хоёр тооны нийлбэр',
    description: 'Өгөгдсөн хоёр бүхэл тооны нийлбэрийг олж хэвлэ.',
    difficulty: 'easy',
    category: 'Basic',
    constraints: ['Тоонууд 0-ээс 1000-ын хооронд байна.'],
    examples: [
      { input: 'a = 5, b = 3', output: '8' },
      { input: 'a = 0, b = 0', output: '0' },
      { input: 'a = 100, b = 250', output: '350' },
      { input: 'a = 999, b = 1', output: '1000' }
    ],
    templates: {
      python: "a = 5\nb = 3\n# Энд кодоо бичнэ үү\n",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 5, b = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int a = 5, b = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '8'
  },
  {
    id: 'p2',
    title: 'Тэгш тоог ол',
    description: 'Өгөгдсөн тоо тэгш бол "Even", сондгой бол "Odd" гэж хэвлэ.',
    difficulty: 'easy',
    category: 'Logic',
    constraints: ['Тоо эерэг бүхэл тоо байна.'],
    examples: [
      { input: 'n = 4', output: 'Even' },
      { input: 'n = 7', output: 'Odd' },
      { input: 'n = 0', output: 'Even' },
      { input: 'n = 101', output: 'Odd' }
    ],
    templates: {
      python: "n = 4\n# Энд кодоо бичнэ үү\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Even'
  },

  // --- MEDIUM PROBLEMS (10 New Problems) ---
  {
    id: 'm1',
    title: 'Тэмдэгт мөрийг урвуулах',
    description: 'Өгөгдсөн үгийг урвуу болгон хэвлэ. Жишээ нь: "hello" -> "olleh"',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Зөвхөн латин үсэг байна.'],
    examples: [
      { input: '"hello"', output: 'olleh' },
      { input: '"world"', output: 'dlrow' }
    ],
    templates: {
      python: "s = 'hello'\n# Урвуулан хэвлэх\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"hello\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string s = \"hello\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'olleh'
  },
  {
    id: 'm2',
    title: 'Хоёр дахь их утга',
    description: 'Өгөгдсөн тоон цувааны хоёр дахь хамгийн их элементийг ол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Цуваанд заавал 2-оос дээш элемент байна.'],
    examples: [
      { input: '[10, 5, 20, 8]', output: '10' },
      { input: '[1, 2, 3]', output: '2' }
    ],
    templates: {
      python: "nums = [10, 5, 20, 8]\n# Хоёр дахь ихийг ол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {10, 5, 20, 8};\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {10, 5, 20, 8};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '10'
  },
  {
    id: 'm3',
    title: 'Факториал олох',
    description: 'Өгөгдсөн n тооны факториалыг (n!) ол. (n! = 1 * 2 * ... * n)',
    difficulty: 'medium',
    category: 'Math',
    constraints: ['n нь 0-ээс 12-ын хооронд.'],
    examples: [
      { input: 'n = 5', output: '120' },
      { input: 'n = 3', output: '6' }
    ],
    templates: {
      python: "n = 5\n# n! олох\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '120'
  },
  {
    id: 'm4',
    title: 'Цифрүүдийн нийлбэр',
    description: 'Бүхэл тооны цифрүүдийн нийлбэрийг ол. Жишээ: 123 -> 1+2+3 = 6',
    difficulty: 'medium',
    category: 'Math',
    constraints: ['Тоо эерэг бүхэл.'],
    examples: [
      { input: '123', output: '6' },
      { input: '405', output: '9' }
    ],
    templates: {
      python: "n = 123\n# Нийлбэрийг ол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 123;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 123;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '6'
  },
  {
    id: 'm5',
    title: 'Анаграм мөн үү?',
    description: 'Хоёр үг ижил үсгүүдээс бүтсэн бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Зөвхөн жижиг үсэг.'],
    examples: [
      { input: '"listen", "silent"', output: 'Yes' },
      { input: '"hello", "world"', output: 'No' }
    ],
    templates: {
      python: "s1, s2 = 'listen', 'silent'\n# Анаграм шалгах\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s1[] = \"listen\", s2[] = \"silent\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string s1 = \"listen\", s2 = \"silent\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'm6',
    title: 'Давхардлыг устгах',
    description: 'Цуваан дахь давхардсан тоонуудыг устгаж, зөвхөн давхардаагүй тоонуудыг хэвлэ.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Эрэмбэлэгдсэн байх албагүй.'],
    examples: [
      { input: '[1, 2, 2, 3, 1]', output: '1 2 3' }
    ],
    templates: {
      python: "nums = [1, 2, 2, 3, 1]\n# Давхардлыг устгах\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 2, 3, 1};\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <set>\n\nint main() {\n    std::vector<int> nums = {1, 2, 2, 3, 1};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '1 2 3'
  },
  {
    id: 'm7',
    title: 'Эгшиг тоолох',
    description: 'Өгөгдсөн өгүүлбэрт хэдэн эгшиг үсэг (a, e, i, o, u) байгааг тоол.',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Зөвхөн англи хэл дээр.'],
    examples: [
      { input: '"coding is fun"', output: '4' }
    ],
    templates: {
      python: "s = 'coding is fun'\n# Эгшиг тоолох\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"coding is fun\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <string>\n\nint main() {\n    std::string s = \"coding is fun\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '4'
  },
  {
    id: 'm8',
    title: 'Цуваа эрэмбэлэгдсэн үү?',
    description: 'Тоон цуваа багаас их рүү эрэмбэлэгдсэн бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Давхардсан тоо байж болно.'],
    examples: [
      { input: '[1, 2, 3, 5]', output: 'Yes' },
      { input: '[1, 5, 2]', output: 'No' }
    ],
    templates: {
      python: "nums = [1, 2, 3, 5]\n# Шалгах\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 3, 5};\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3, 5};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'm9',
    title: 'Цувааны огтлолцол',
    description: 'Хоёр тоон цуваанд хоёуланд нь байгаа тоонуудыг ол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Огтлолцохгүй байж болно.'],
    examples: [
      { input: '[1, 2, 3], [2, 3, 4]', output: '2 3' }
    ],
    templates: {
      python: "arr1, arr2 = [1, 2, 3], [2, 3, 4]\n# Огтлолцол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int arr1[] = {1, 2, 3}, arr2[] = {2, 3, 4};\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> v1 = {1, 2, 3}, v2 = {2, 3, 4};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '2 3'
  },
  {
    id: 'm10',
    title: 'Хөрөнгө оруулалт',
    description: 'Хадгаламжийн хүүг тооц. Үндсэн мөнгө P, жилийн хүү R, хугацаа T бол энгийн хүүг (P*R*T/100) ол.',
    difficulty: 'medium',
    category: 'Math',
    constraints: ['Бүх тоо эерэг.'],
    examples: [
      { input: 'P=1000, R=5, T=2', output: '100' }
    ],
    templates: {
      python: "p, r, t = 1000, 5, 2\n# Хүүг тооц\n",
      c: "#include <stdio.h>\n\nint main() {\n    int p = 1000, r = 5, t = 2;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int p = 1000, r = 5, t = 2;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '100'
  },

  // --- HARD PROBLEMS (10 New Problems) ---
  {
    id: 'h1',
    title: 'Хоёртын хайлт',
    description: 'Эрэмбэлэгдсэн цуваанаас өгөгдсөн тооны индексийг О(log n) хугацаанд ол. Байхгүй бол -1.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['Цуваа заавал эрэмбэлэгдсэн.'],
    examples: [
      { input: '[1, 3, 5, 7, 9], target=7', output: '3' }
    ],
    templates: {
      python: "nums, target = [1, 3, 5, 7, 9], 7\n# Binary Search\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 3, 5, 7, 9}, target = 7, n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 3, 5, 7, 9};\n    int target = 7;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '3'
  },
  {
    id: 'h2',
    title: 'Хамгийн урт ижил эхлэл',
    description: 'Үгсийн цуваанаас хамгийн урт ижил эхлэлийг (prefix) ол.',
    difficulty: 'hard',
    category: 'Strings',
    constraints: ['Үгс байхгүй бол хоосон мөр.'],
    examples: [
      { input: '["flower", "flow", "flight"]', output: 'fl' }
    ],
    templates: {
      python: "strs = ['flower', 'flow', 'flight']\n# Longest Common Prefix\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <string>\n\nint main() {\n    std::vector<std::string> strs = {\"flower\", \"flow\", \"flight\"};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'fl'
  },
  {
    id: 'h3',
    title: 'Хоёр тооны нийлбэр',
    description: 'Цуваан дотроос нийлбэр нь target-тай тэнцэх хоёр тооны индексийг ол.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['Зөвхөн нэг шийд бий.'],
    examples: [
      { input: '[2, 7, 11, 15], target=9', output: '0 1' }
    ],
    templates: {
      python: "nums, target = [2, 7, 11, 15], 9\n# Two Sum\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {2, 7, 11, 15}, target = 9, n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nint main() {\n    std::vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '0 1'
  },
  {
    id: 'h4',
    title: 'Матрицыг эргүүлэх',
    description: 'N x N матрицыг цагийн зүүний дагуу 90 градус эргүүл.',
    difficulty: 'hard',
    category: 'Arrays',
    constraints: ['In-place эргүүлэх.'],
    examples: [
      { input: '[[1,2],[3,4]]', output: '[[3,1],[4,2]]' }
    ],
    templates: {
      python: "matrix = [[1,2],[3,4]]\n# Rotate 90 deg\n",
      c: "#include <stdio.h>\n\nint main() {\n    int matrix[2][2] = {{1, 2}, {3, 4}};\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<std::vector<int>> matrix = {{1, 2}, {3, 4}};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '[[3,1],[4,2]]'
  },
  {
    id: 'h5',
    title: 'Паскалийн гурвалжин',
    description: 'Паскалийн гурвалжны эхний n мөрийг үүсгэ.',
    difficulty: 'hard',
    category: 'Math',
    constraints: ['n > 0'],
    examples: [
      { input: 'n = 3', output: '[[1],[1,1],[1,2,1]]' }
    ],
    templates: {
      python: "n = 3\n# Pascal Triangle\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n\nint main() {\n    int n = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '[[1],[1,1],[1,2,1]]'
  },
  {
    id: 'h6',
    title: 'Хаалтны тэнцвэр',
    description: 'Нээсэн хаалт болгон зөв дарааллаар хаагдсан эсэхийг шалга. (), [], {}',
    difficulty: 'hard',
    category: 'Strings',
    constraints: ['Хоосон мөр зөвд тооцогдоно.'],
    examples: [
      { input: '"()[]{}"', output: 'Yes' },
      { input: '"(]"', output: 'No' }
    ],
    templates: {
      python: "s = '()[]{}'\n# Valid Parentheses\n",
      c: "#include <stdio.h>\n#include <stdbool.h>\n\nint main() {\n    char s[] = \"()[]{}\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <stack>\n#include <string>\n\nint main() {\n    std::string s = \"()[]{}\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'h7',
    title: 'Цуваа нэгтгэх',
    description: 'Хоёр эрэмбэлэгдсэн цувааг нэг эрэмбэлэгдсэн цуваа болгон нэгтгэ.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['O(n+m) хугацаанд.'],
    examples: [
      { input: '[1,3], [2,4]', output: '1 2 3 4' }
    ],
    templates: {
      python: "arr1, arr2 = [1, 3], [2, 4]\n# Merge Sorted Arrays\n",
      c: "#include <stdio.h>\n\nint main() {\n    int a1[] = {1, 3}, a2[] = {2, 4};\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> v1 = {1, 3}, v2 = {2, 4};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '1 2 3 4'
  },
  {
    id: 'h8',
    title: 'Анхны тоон задаргаа',
    description: 'Тооны анхны тоон үржигдэхүүнүүдийг ол. Жишээ: 12 = 2 * 2 * 3',
    difficulty: 'hard',
    category: 'Math',
    constraints: ['n > 1'],
    examples: [
      { input: '12', output: '2 2 3' }
    ],
    templates: {
      python: "n = 12\n# Prime Factors\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 12;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 12;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '2 2 3'
  },
  {
    id: 'h9',
    title: 'Дутуу тоог ол',
    description: '1-ээс n хүртэлх тооны цуваанаас нэг тоо дутуу байна. Тэр тоог ол.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['n нь цувааны урт + 1.'],
    examples: [
      { input: '[1, 2, 4, 5], n=5', output: '3' }
    ],
    templates: {
      python: "nums, n = [1, 2, 4, 5], 5\n# Missing Number\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 4, 5}, n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <numeric>\n\nint main() {\n    std::vector<int> nums = {1, 2, 4, 5};\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '3'
  },
  {
    id: 'h10',
    title: 'Хамгийн их дэд цуваа',
    description: 'Массивын хамгийн их нийлбэртэй дэд цувааны нийлбэрийг ол (Kadane algorithm).',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['Сөрөг тоо байж болно.'],
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1]', output: '6' }
    ],
    templates: {
      python: "nums = [-2, 1, -3, 4, -1, 2, 1]\n# Max Subarray Sum\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {-2, 1, -3, 4, -1, 2, 1};\n    int n = 7;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {-2, 1, -3, 4, -1, 2, 1};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '6'
  }
];
