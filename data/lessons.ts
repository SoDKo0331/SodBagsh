
import { FullLesson } from '../types';

export const LESSON_DATA: Record<string, FullLesson> = {
  'm1': {
    id: 'm1',
    title: 'LEVEL 1: Эхлэл - Print & Код',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Компьютертэй ярилцаж суръя',
        body: "Код бичнэ гэдэг нь компьютерт юу хийхийг нь ойлгомжтойгоор зааж өгөх үйл явц юм. Хамгийн анхны тушаал бол дэлгэц дээр үг хэвлэх!",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Нөхөж бичих: Сайн уу!',
        body: "Доорх кодын дутуу хэсгийг нөхөж бичээд дэлгэцэнд 'Hello' гэж хэвлээрэй.",
        codingTasks: [
          {
            language: 'c',
            fileName: 'hello.c',
            template: "#include <stdio.h>\n\nint main() {\n    ___(\"Hello\");\n    return 0;\n}",
            explanation: ["printf - С хэлний хэвлэх функц"],
            expectedOutput: "Hello"
          }
        ]
      }
    ]
  },
  'm2': {
    id: 'm2',
    title: 'LEVEL 1: Хувьсагч - Мэдээллийн Хайрцаг',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Санах ойн нууц',
        body: "Хувьсагч бол тоо эсвэл үгийг түр хадгалах хайрцаг юм. Хайрцаг бүр өөрийн гэсэн нэр, төрөлтэй байдаг.",
      },
      {
        id: 2,
        type: 'minigame',
        title: 'Кодын Дараалал',
        body: "Эдгээр мөрүүдийг зөв дараалалд оруулж хувьсагч зарлан, утга оноож, хэвлэх үйлдлийг гүйцэтгэ.",
        minigame: {
          type: 'sorter',
          question: "Зөв дарааллыг ол:",
          items: [
            { id: '1', text: 'int x;' },
            { id: '2', text: 'x = 10;' },
            { id: '3', text: 'printf("%d", x);' }
          ],
          correctOrder: ['1', '2', '3']
        }
      },
      {
        id: 3,
        type: 'coding',
        title: 'Дутууг нөх: Нас тооцоолох',
        body: "Нас (age) гэдэг бүхэл тоон хувьсагч зарлаад 15 гэсэн утга оноож хэвлэ.",
        codingTasks: [
          {
            language: 'c',
            fileName: 'vars.c',
            template: "#include <stdio.h>\n\nint main() {\n    ___ age = 15;\n    printf(\"%d\", ___);\n    return 0;\n}",
            explanation: ["int - бүхэл тоо", "age - хувьсагчийн нэр"],
            expectedOutput: "15"
          }
        ]
      }
    ]
  },
  'm3': {
    id: 'm3',
    title: 'LEVEL 1: IF/ELSE - Сонголт',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Шийдвэр гаргах',
        body: "Компьютер нөхцөл шалгаж шийдвэр гаргадаг. Хэрэв (if) оноо 60-аас их бол тэнцэнэ, үгүй бол (else) унана.",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Нөхөж бич: Тэнцсэн үү?',
        body: "Оноо 60-аас их бол 'PASS' гэж хэвлэх нөхцөлийг бич.",
        codingTasks: [
          {
            language: 'c',
            fileName: 'if.c',
            template: "#include <stdio.h>\n\nint main() {\n    int score = 70;\n    ___ (score > 60) {\n        printf(\"PASS\");\n    }\n    return 0;\n}",
            explanation: ["if - хэрэв гэсэн нөхцөл"],
            expectedOutput: "PASS"
          }
        ]
      }
    ]
  },
  'm4': {
    id: 'm4',
    title: 'LEVEL 2: Давталт - For Loop',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Уйтгартай ажлыг давтах',
        body: "For давталт нь нэг үйлдлийг олон удаа давтахад ашиглагддаг. i++ гэдэг нь i-ийн утгыг нэгээр нэмэгдүүлнэ гэсэн үг.",
      },
      {
        id: 2,
        type: 'minigame',
        title: 'Логик Таавар',
        body: "Давталт 3 удаа ажиллахын тулд нөхцөл ямар байх ёстой вэ?",
        minigame: {
          type: 'sorter',
          question: "3 удаа 'Hi' хэвлэх дараалал:",
          items: [
            { id: 'a', text: 'for(int i=0; i<3; i++) {' },
            { id: 'b', text: '  printf("Hi");' },
            { id: 'c', text: '}' }
          ],
          correctOrder: ['a', 'b', 'c']
        }
      },
      {
        id: 3,
        type: 'coding',
        title: 'Нөхөж бич: 5 удаа тоолох',
        body: "0-ээс 4 хүртэл тоолох давталтын дутууг нөх.",
        codingTasks: [
          {
            language: 'c',
            fileName: 'loop.c',
            template: "#include <stdio.h>\n\nint main() {\n    for(int i=0; ___ < 5; i___) {\n        printf(\"%d \", i);\n    }\n    return 0;\n}",
            explanation: ["i < 5 - зогсох нөхцөл", "i++ - нэмэгдүүлэлт"],
            expectedOutput: "0 1 2 3 4 "
          }
        ]
      }
    ]
  },
  'm5': {
    id: 'm5',
    title: 'LEVEL 3: Массив - Олон хайрцаг',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Массив гэж юу вэ?',
        body: "Массив бол олон тоог нэг дор хадгалах урт хайрцаг юм. Индекс нь 0-ээс эхэлдэг гэдгийг санаарай!",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Массивын утга оноох',
        body: "Массивын эхний элемент буюу 0-р индекст 100 гэсэн утга оноож хэвлэ.",
        codingTasks: [
          {
            language: 'c',
            fileName: 'array.c',
            template: "#include <stdio.h>\n\nint main() {\n    int nums[3] = {1, 2, 3};\n    nums[___] = 100;\n    printf(\"%d\", nums[0]);\n    return 0;\n}",
            explanation: ["0 - эхний индекс"],
            expectedOutput: "100"
          }
        ]
      }
    ]
  }
};
