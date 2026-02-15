
import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: 'Хоёр тооны нийлбэр',
    description: 'Өгөгдсөн a, b хоёр тооны нийлбэрийг олж хэвлэ.',
    difficulty: 'easy',
    category: 'Basic',
    constraints: ['0 <= a, b <= 1000'],
    examples: [{ input: 'a=5, b=3', output: '8' }],
    templates: {
      python: "a = 5\nb = 3\n# Энд кодоо бичнэ үү\nprint(a + b)",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 5, b = 3;\n    printf(\"%d\", a + b);\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int a = 5, b = 3;\n    std::cout << a + b;\n    return 0;\n}"
    },
    expectedOutput: '8'
  },
  {
    id: 'p2',
    title: 'Тэгш сондгой',
    description: 'Өгөгдсөн тоо тэгш бол "Even", сондгой бол "Odd" гэж хэвлэ.',
    difficulty: 'easy',
    category: 'Logic',
    constraints: ['n >= 0'],
    examples: [{ input: 'n=4', output: 'Even' }],
    templates: {
      python: "n = 4\n# Logic check\nif n % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')",
      c: "#include <stdio.h>\n\nint main() {\n    int n = 4;\n    if(n%2==0) printf(\"Even\"); else printf(\"Odd\");\n    return 0;\n}",
      cpp: "#include <iostream>\n\nint main() {\n    int n = 4;\n    if(n%2==0) std::cout << \"Even\"; else std::cout << \"Odd\";\n    return 0;\n}"
    },
    expectedOutput: 'Even'
  }
];
