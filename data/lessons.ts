
import { FullLesson } from '../types';

export const LESSON_DATA: Record<string, FullLesson> = {
  'm1': {
    id: 'm1',
    title: 'LEVEL 1: Эхлэл - Print & Код',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Код гэж юу вэ?',
        body: "Код бол компьютерт өгч буй тушаал юм. Хамгийн эхний тушаал бол дэлгэц дээр үг хэвлэх! Бид дэлгэцэнд 'Сайн уу' гэж хэлэхийг зааж өгнө.",
        analogy: { icon: 'campaign', text: "Энэ бол компьютерт 'Энийг чангаар хэл!' гэж хэлж байгаатай адилхан." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Сайн уу, Дэлхий!',
        body: "Одоо чи өөрөө туршаад үз. Python, C болон C++ хэл дээр яаж бичдэгийг харьцуулж хараарай.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'hello.py',
            template: "print('Сайн уу, Дэлхий!')",
            explanation: ["print() - Энэ бол дэлгэцэнд хэвлэх тушаал."],
            expectedOutput: "Сайн уу, Дэлхий!"
          },
          {
            language: 'c',
            fileName: 'hello.c',
            template: "#include <stdio.h>\n\nint main() {\n    printf(\"Сайн уу, Дэлхий!\\n\");\n    return 0;\n}",
            explanation: [
              "#include - Сангуудыг дуудаж байна.",
              "int main() - Програм эндээс эхэлдэг.",
              "printf - Дэлгэцэнд хэвлэх тушаал."
            ],
            expectedOutput: "Сайн уу, Дэлхий!",
          },
          {
            language: 'cpp',
            fileName: 'hello.cpp',
            template: "#include <iostream>\n\nint main() {\n    std::cout << \"Сайн уу, Дэлхий!\" << std::endl;\n    return 0;\n}",
            explanation: [
              "#include <iostream> - Оролт гаралт (std::cout) ашиглах сан.",
              "std::cout << - Дэлгэц рүү 'урсгах' буюу хэвлэх тушаал."
            ],
            expectedOutput: "Сайн уу, Дэлхий!",
          }
        ]
      }
    ]
  },
  'm2': {
    id: 'm2',
    title: 'LEVEL 1: Хувьсагч - Шидэт хайрцаг',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Мэдээлэл хадгалах',
        body: "Хувьсагч бол дотроо юм хийдэг шошготой хайрцаг юм. C болон C++ хэл дээр хайрцагт юу хийхээ (бүхэл тоо, үсэг г.м) заавал хэлж өгөх ёстой байдаг.",
        visualAid: 'box',
        analogy: { icon: 'inventory_2', text: "Хайрцаг дээр 'нас' гэж бичээд дотор нь 13 гэсэн тоо хийчихвэл, дараа нь 'нас' хаана байна? гэхэд компьютер 13-ыг гаргаж ирнэ." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Миний хайрцаг',
        body: "Нас хадгалах хайрцаг үүсгээд түүнийгээ дэлгэцэнд хэвлэе. Одоо чи!",
        codingTasks: [
          {
            language: 'python',
            fileName: 'age.py',
            template: "age = 13\nprint('Миний нас: ' + str(age))",
            explanation: ["age = 13 - 'age' хайрцагт 13-ыг хийлээ."],
            expectedOutput: "Миний нас: 13"
          },
          {
            language: 'c',
            fileName: 'age.c',
            template: "#include <stdio.h>\n\nint main() {\n    int age = 13;\n    printf(\"Миний нас: %d\\n\", age);\n    return 0;\n}",
            explanation: ["int age - Бүхэл тоо хадгалах хайрцаг."],
            expectedOutput: "Миний нас: 13",
          },
          {
            language: 'cpp',
            fileName: 'age.cpp',
            template: "#include <iostream>\n\nint main() {\n    int age = 13;\n    std::cout << \"Миний нас: \" << age << std::endl;\n    return 0;\n}",
            explanation: ["int age = 13; - Хувьсагч зарлаж утга оноолоо."],
            expectedOutput: "Миний нас: 13",
          }
        ]
      }
    ]
  },
  'm3': {
    id: 'm3',
    title: 'LEVEL 1: IF/ELSE - Шийдвэр гаргах',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Хэрвээ...',
        body: "Компьютер шийдвэр гаргаж чадна! 'Хэрвээ бороо орвол шүхэр ав, үгүй бол нарны шил ав' гэж бид хэлдэг.",
        visualAid: 'logic',
        analogy: { icon: 'alt_route', text: "Видео тоглоом дээр хангалттай оноо авсан бол дараагийн шат руу явуулдагтай адил." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Оноо шалгагч',
        body: "Оноо 10-аас их бол 'Ялалт' гэж хэвлэх код бичиж үзье.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'logic.py',
            template: "score = 15\nif score > 10:\n    print('Ялалт!')",
            explanation: ["if score > 10 - Нөхцөл шалгаж байна."],
            expectedOutput: "Ялалт!"
          },
          {
            language: 'c',
            fileName: 'logic.c',
            template: "#include <stdio.h>\n\nint main() {\n    int score = 15;\n    if (score > 10) {\n        printf(\"Ялалт!\\n\");\n    }\n    return 0;\n}",
            explanation: ["if (score > 10) - Нөхцөл."],
            expectedOutput: "Ялалт!",
          },
          {
            language: 'cpp',
            fileName: 'logic.cpp',
            template: "#include <iostream>\n\nint main() {\n    int score = 15;\n    if (score > 10) {\n        std::cout << \"Ялалт!\" << std::endl;\n    }\n    return 0;\n}",
            explanation: ["C++ дээр 'if' бүтэц нь C-тэй ижилхэн байдаг."],
            expectedOutput: "Ялалт!",
          }
        ]
      }
    ]
  },
  'm4': {
    id: 'm4',
    title: 'LEVEL 2: Loop - Давталт',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Уйтгартай ажлыг компьютерээр хийлгэ',
        body: "Нэг зүйлийг 100 удаа хийх хэцүү тийм ээ? Давталт (Loop) ашиглаад компьютерээр хэд ч хамаагүй хийлгэж болно.",
        analogy: { icon: 'rebase_edit', text: "Дууг 'repeat' дээр тавихтай адил. Зогсоох хүртэл дахиад л явна." }
      },
      {
        id: 2,
        type: 'coding',
        title: '3 удаа тоолох',
        body: "1-ээс 3 хүртэл тоолох давталт бичиж үзье. Одоо чи!",
        codingTasks: [
          {
            language: 'python',
            fileName: 'loop.py',
            template: "for i in range(1, 4):\n    print('Тоо: ' + str(i))",
            explanation: ["range(1, 4) - 1-ээс 3 хүртэл."],
            expectedOutput: "Тоо: 1\nТоо: 2\nТоо: 3"
          },
          {
            language: 'c',
            fileName: 'loop.c',
            template: "#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        printf(\"Тоо: %d\\n\", i);\n    }\n    return 0;\n}",
            explanation: ["for (эхлэл; нөхцөл; өөрчлөлт)"],
            expectedOutput: "Тоо: 1\nТоо: 2\nТоо: 3",
          },
          {
            language: 'cpp',
            fileName: 'loop.cpp',
            template: "#include <iostream>\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        std::cout << \"Тоо: \" << i << std::endl;\n    }\n    return 0;\n}",
            explanation: ["C++ дээр мөн л 'for' давталт C-тэй ижил ажиллана."],
            expectedOutput: "Тоо: 1\nТоо: 2\nТоо: 3",
          }
        ]
      }
    ]
  },
  'm5': {
    id: 'm5',
    title: 'LEVEL 3: Функц - Шидэт тушаал',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Өөрийн тушаалыг үүсгэ',
        body: "Функц бол олон кодыг нэг нэрэн дор багцалж байгаа хэрэг юм. Дараа нь зөвхөн нэрийг нь дуудахад тэр бүх код ажиллана.",
        analogy: { icon: 'function', text: "Роботдоо 'цай чана' гэж зааж өгөхтэй адил." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Мэндчилгээний функц',
        body: "Мэндчилдэг функц үүсгээд дуудаж ажиллуулж үзье.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'func.py',
            template: "def greet():\n    print('Сайн уу, Багшаа!')\n\ngreet()",
            explanation: ["def greet() - Тодорхойлох."],
            expectedOutput: "Сайн уу, Багшаа!"
          },
          {
            language: 'c',
            fileName: 'func.c',
            template: "#include <stdio.h>\n\nvoid greet() {\n    printf(\"Сайн уу, Багшаа!\\n\");\n}\n\nint main() {\n    greet();\n    return 0;\n}",
            explanation: ["void greet() - Буцаах утгагүй функц."],
            expectedOutput: "Сайн уу, Багшаа!",
          },
          {
            language: 'cpp',
            fileName: 'func.cpp',
            template: "#include <iostream>\n\nvoid greet() {\n    std::cout << \"Сайн уу, Багшаа!\" << std::endl;\n}\n\nint main() {\n    greet();\n    return 0;\n}",
            explanation: ["C++ хэлний функц зарлах хэлбэр."],
            expectedOutput: "Сайн уу, Багшаа!",
          }
        ]
      }
    ]
  }
};
