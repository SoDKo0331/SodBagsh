
import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  // --- EASY PROBLEMS (Already existing + more) ---
  {
    id: 'p1',
    title: 'Хоёр тооны нийлбэр',
    description: 'Өгөгдсөн хоёр бүхэл тооны нийлбэрийг олж хэвлэ.',
    difficulty: 'easy',
    category: 'Basic',
    constraints: ['Тоонууд 0-ээс 1000-ын хооронд байна.'],
    examples: [{ input: 'a = 5, b = 3', output: '8' }],
    templates: {
      python: "a = 5\nb = 3\n# Энд кодоо бичнэ үү\n",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 5, b = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
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
    examples: [{ input: 'n = 4', output: 'Even' }],
    templates: {
      python: "n = 4\n# Энд кодоо бичнэ үү\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Even'
  },

  // --- MEDIUM PROBLEMS (10 Tasks) ---
  {
    id: 'm1',
    title: 'Массивын хамгийн их утга',
    description: 'Өгөгдсөн тоон цувааны хамгийн их элементийг ол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Цуваа 5-аас ихгүй элементтэй.'],
    examples: [{ input: '[1, 5, 2, 8, 3]', output: '8' }],
    templates: {
      python: "nums = [1, 5, 2, 8, 3]\n# Хамгийн ихийг олоорой\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 5, 2, 8, 3};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '8'
  },
  {
    id: 'm2',
    title: 'Эгшиг үсэг тоолох',
    description: 'Өгөгдсөн тэмдэгт мөрөнд хэдэн эгшиг үсэг (a, e, i, o, u) байгааг тоол.',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Зөвхөн жижиг үсэг өгөгдөнө.'],
    examples: [{ input: '"hello"', output: '2' }],
    templates: {
      python: "s = 'hello'\n# Эгшиг тоолох\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"hello\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '2'
  },
  {
    id: 'm3',
    title: 'Тоог урвуулах',
    description: 'Бүхэл тоог урвуугаар нь хэвлэ. (Жишээ нь: 123 -> 321)',
    difficulty: 'medium',
    category: 'Math',
    constraints: ['Тоо 3 оронтой.'],
    examples: [{ input: 'n = 123', output: '321' }],
    templates: {
      python: "n = 123\n# Урвуулах\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 123;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '321'
  },
  {
    id: 'm4',
    title: 'Факториал ол',
    description: 'N тооны факториалыг ол. (N!)',
    difficulty: 'medium',
    category: 'Loops',
    constraints: ['N < 10'],
    examples: [{ input: 'N = 5', output: '120' }],
    templates: {
      python: "n = 5\n# n! ол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '120'
  },
  {
    id: 'm5',
    title: 'Анхны тоо мөн үү?',
    description: 'Өгөгдсөн тоо анхны тоо бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Logic',
    constraints: ['Тоо 2-оос их.'],
    examples: [{ input: 'n = 7', output: 'Yes' }],
    templates: {
      python: "n = 7\n# Анхны тоо шалгах\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 7;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'm6',
    title: 'Массивын дундаж',
    description: 'Тоон массивын дундаж утгыг бүхэл хэсгээр нь ол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Нийлбэр нь бүхэл тоо байна.'],
    examples: [{ input: '[10, 20, 30]', output: '20' }],
    templates: {
      python: "nums = [10, 20, 30]\n# Дундаж ол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {10, 20, 30};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '20'
  },
  {
    id: 'm7',
    title: 'Палиндром мөр',
    description: 'Өгөгдсөн үг урдаасаа болон ардаасаа ижил уншигддаг бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Жижиг үсгүүд.'],
    examples: [{ input: '"radar"', output: 'Yes' }],
    templates: {
      python: "s = 'radar'\n# Палиндром шалгах\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"radar\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'm8',
    title: 'Үржүүлэхийн хүрд',
    description: 'Өгөгдсөн N тооны 5 хүртэлх үржүүлэхийг зайтай хэвлэ.',
    difficulty: 'medium',
    category: 'Loops',
    constraints: ['N = 3'],
    examples: [{ input: '3', output: '3 6 9 12 15' }],
    templates: {
      python: "n = 3\n# 3*1 3*2 .. 3*5\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '3 6 9 12 15'
  },
  {
    id: 'm9',
    title: 'Давтагдсан тоо',
    description: 'Массивт 5-ын тоо хэдэн удаа орж байгааг тоол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Массив 10 хүртэлх урттай.'],
    examples: [{ input: '[5, 1, 5, 2, 5]', output: '3' }],
    templates: {
      python: "nums = [5, 1, 5, 2, 5]\n# 5-ыг тоол\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {5, 1, 5, 2, 5};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '3'
  },
  {
    id: 'm10',
    title: 'Цифрүүдийн нийлбэр',
    description: 'Өгөгдсөн тооны бүх цифрүүдийн нийлбэрийг ол.',
    difficulty: 'medium',
    category: 'Math',
    constraints: ['Тоо 3 оронтой.'],
    examples: [{ input: '123', output: '6' }],
    templates: {
      python: "n = 123\n# 1+2+3\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 123;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '6'
  },

  // --- HARD PROBLEMS (10 Tasks) ---
  {
    id: 'h1',
    title: 'Фибоначчийн дараалал',
    description: 'Фибоначчийн дарааллын эхний 6 гишүүнийг зайтай хэвлэ.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['0-ээс эхэлнэ.'],
    examples: [{ input: 'n=6', output: '0 1 1 2 3 5' }],
    templates: {
      python: "n = 6\n# 0, 1, 1, 2, 3, 5\n",
      c: "#include <stdio.h>\n\nint main() {\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '0 1 1 2 3 5'
  },
  {
    id: 'h2',
    title: 'Гурвалжин зурах',
    description: 'N=3 үед одоор гурвалжин зур.',
    difficulty: 'hard',
    category: 'Loops',
    constraints: ['N = 3'],
    examples: [{ input: '3', output: '*\n**\n***' }],
    templates: {
      python: "n = 3\n# *\n# **\n# ***\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 3;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '*\n**\n***'
  },
  {
    id: 'h3',
    title: 'Bubble Sort (Simulated)',
    description: '[3, 1, 2] массивыг эрэмбэлж хэвлэ.',
    difficulty: 'hard',
    category: 'Sorting',
    constraints: ['Багаас их рүү.'],
    examples: [{ input: '[3, 1, 2]', output: '1 2 3' }],
    templates: {
      python: "nums = [3, 1, 2]\n# Sort and print with space\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {3, 1, 2};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '1 2 3'
  },
  {
    id: 'h4',
    title: 'Матрицын диагональ нийлбэр',
    description: '2x2 матрицын гол диагоналийн нийлбэрийг ол.',
    difficulty: 'hard',
    category: 'Matrix',
    constraints: ['[[1, 2], [3, 4]]'],
    examples: [{ input: 'matrix', output: '5' }],
    templates: {
      python: "matrix = [[1, 2], [3, 4]]\n# 1 + 4\n",
      c: "#include <stdio.h>\n\nint main() {\n    int m[2][2] = {{1, 2}, {3, 4}};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '5'
  },
  {
    id: 'h5',
    title: 'ХИЕГ ол',
    description: 'Хоёр тооны хамгийн их ерөнхий хуваагчийг ол.',
    difficulty: 'hard',
    category: 'Math',
    constraints: ['12 ба 8.'],
    examples: [{ input: '12, 8', output: '4' }],
    templates: {
      python: "a, b = 12, 8\n# GCD\n",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 12, b = 8;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '4'
  },
  {
    id: 'h6',
    title: 'Хоёртын систем рүү шилжүүлэх',
    description: '10-тын тоог 2-тын систем рүү шилжүүлж хэвлэ.',
    difficulty: 'hard',
    category: 'Math',
    constraints: ['n = 5'],
    examples: [{ input: '5', output: '101' }],
    templates: {
      python: "n = 5\n# Binary format\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '101'
  },
  {
    id: 'h7',
    title: 'Хоёр дахь их утга',
    description: 'Массивын хоёр дахь хамгийн их утгыг ол.',
    difficulty: 'hard',
    category: 'Arrays',
    constraints: ['[10, 5, 8, 20]'],
    examples: [{ input: 'nums', output: '10' }],
    templates: {
      python: "nums = [10, 5, 8, 20]\n# Second largest\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {10, 5, 8, 20};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '10'
  },
  {
    id: 'h8',
    title: 'Анаграм шалгах',
    description: 'Хоёр үг нэг ижил үсгүүдээс бүтсэн бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'hard',
    category: 'Strings',
    constraints: ['"silent", "listen"'],
    examples: [{ input: 'silent, listen', output: 'Yes' }],
    templates: {
      python: "s1, s2 = 'silent', 'listen'\n# Check anagram\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'h9',
    title: 'Массив эргүүлэх',
    description: '[1, 2, 3] массивыг нэгээр баруун тийш эргүүлж хэвлэ.',
    difficulty: 'hard',
    category: 'Arrays',
    constraints: ['Rotate right by 1.'],
    examples: [{ input: '[1, 2, 3]', output: '3 1 2' }],
    templates: {
      python: "nums = [1, 2, 3]\n# Result: [3, 1, 2]\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 3};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '3 1 2'
  },
  {
    id: 'h10',
    title: 'Давтагдсан элементийг устгах',
    description: 'Массивын зөвхөн ялгаатай элементүүдийг зайтай хэвлэ.',
    difficulty: 'hard',
    category: 'Arrays',
    constraints: ['[1, 2, 2, 3, 1]'],
    examples: [{ input: 'nums', output: '1 2 3' }],
    templates: {
      python: "nums = [1, 2, 2, 3, 1]\n# Unique elements only\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 2, 2, 3, 1};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '1 2 3'
  }
];
