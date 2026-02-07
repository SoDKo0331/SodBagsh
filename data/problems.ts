
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
      { input: 'a = 100, b = 250', output: '350' }
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
      { input: 'n = 100', output: 'Even' }
    ],
    templates: {
      python: "n = 4\n# Энд кодоо бичнэ үү\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 4;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Even'
  },

  // --- MEDIUM PROBLEMS ---
  {
    id: 'm1',
    title: 'Массивын хамгийн их утга',
    description: 'Өгөгдсөн тоон цувааны хамгийн их элементийг ол.',
    difficulty: 'medium',
    category: 'Arrays',
    constraints: ['Цуваа 1-ээс 10 элементтэй.', 'Тоонууд сөрөг байж болно.'],
    examples: [
      { input: '[1, 5, 2, 8, 3]', output: '8' },
      { input: '[-10, -5, -20]', output: '-5' },
      { input: '[100]', output: '100' }
    ],
    templates: {
      python: "nums = [1, 5, 2, 8, 3]\n# Хамгийн ихийг олоорой\n",
      c: "#include <stdio.h>\n\nint main() {\n    int nums[] = {1, 5, 2, 8, 3};\n    int n = 5;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::vector<int> nums = {1, 5, 2, 8, 3};\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '8'
  },
  {
    id: 'm5',
    title: 'Анхны тоо мөн үү?',
    description: 'Өгөгдсөн тоо анхны тоо бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Logic',
    constraints: ['Тоо 1-ээс 1000-ын хооронд.'],
    examples: [
      { input: 'n = 7', output: 'Yes' },
      { input: 'n = 10', output: 'No' },
      { input: 'n = 2', output: 'Yes' },
      { input: 'n = 1', output: 'No' }
    ],
    templates: {
      python: "n = 7\n# Анхны тоо шалгах\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 7;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 7;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },
  {
    id: 'm7',
    title: 'Палиндром мөр',
    description: 'Өгөгдсөн үг урдаасаа болон ардаасаа ижил уншигддаг бол "Yes", үгүй бол "No" гэж хэвлэ.',
    difficulty: 'medium',
    category: 'Strings',
    constraints: ['Зөвхөн жижиг латин үсэг.'],
    examples: [
      { input: '"radar"', output: 'Yes' },
      { input: '"hello"', output: 'No' },
      { input: '"a"', output: 'Yes' },
      { input: '"racecar"', output: 'Yes' }
    ],
    templates: {
      python: "s = 'radar'\n# Палиндром шалгах\n",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"radar\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\n\nint main() {\n    std::string s = \"radar\";\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: 'Yes'
  },

  // --- HARD PROBLEMS ---
  {
    id: 'h1',
    title: 'Фибоначчийн дараалал',
    description: 'Фибоначчийн дарааллын эхний N гишүүнийг зайтай хэвлэ.',
    difficulty: 'hard',
    category: 'Algorithms',
    constraints: ['N = 6', '0-ээс эхэлнэ.'],
    examples: [
      { input: 'n = 6', output: '0 1 1 2 3 5' },
      { input: 'n = 1', output: '0' },
      { input: 'n = 3', output: '0 1 1' }
    ],
    templates: {
      python: "n = 6\n# 0 1 1 2 3 5 гэж хэвлэ\n",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 6;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 6;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '0 1 1 2 3 5'
  },
  {
    id: 'h5',
    title: 'ХИЕГ ол',
    description: 'Хоёр тооны хамгийн их ерөнхий хуваагчийг (GCD) ол.',
    difficulty: 'hard',
    category: 'Math',
    constraints: ['Тоонууд эерэг бүхэл.'],
    examples: [
      { input: '12, 8', output: '4' },
      { input: '7, 5', output: '1' },
      { input: '100, 25', output: '25' }
    ],
    templates: {
      python: "a, b = 12, 8\n# GCD\n",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 12, b = 8;\n    // Энд кодоо бичнэ үү\n    return 0;\n}",
      cpp: "#include <iostream>\n#include <numeric>\n\nint main() {\n    int a = 12, b = 8;\n    // Энд кодоо бичнэ үү\n    return 0;\n}"
    },
    expectedOutput: '4'
  }
];
