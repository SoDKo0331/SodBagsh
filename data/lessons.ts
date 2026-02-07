
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
        body: "Одоо чи өөрөө туршаад үз. Python болон C хэл дээр яаж бичдэгийг харьцуулж хараарай.",
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
              "printf - Дэлгэцэнд хэвлэх тушаал.",
              "return 0 - Програм амжилттай дууссаныг илтгэнэ."
            ],
            expectedOutput: "Сайн уу, Дэлхий!",
            debugSteps: [
              { lineIndex: 2, variables: {}, comment: "Програм main функцээс эхэлж байна." },
              { lineIndex: 3, variables: {}, comment: "printf ажиллаж, текст дэлгэцэнд хэвлэгдэнэ." },
              { lineIndex: 4, variables: {}, comment: "Програм амжилттай дууслаа." }
            ]
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
        body: "Хувьсагч бол дотроо юм хийдэг шошготой хайрцаг юм. C хэл дээр хайрцагт юу хийхээ (бүхэл тоо, үсэг г.м) заавал хэлж өгөх ёстой байдаг.",
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
            explanation: ["age = 13 - 'age' хайрцагт 13-ыг хийлээ.", "str(age) - Тоог үг болгон хувиргаж байна."],
            expectedOutput: "Миний нас: 13"
          },
          {
            language: 'c',
            fileName: 'age.c',
            template: "#include <stdio.h>\n\nint main() {\n    int age = 13;\n    printf(\"Миний нас: %d\\n\", age);\n    return 0;\n}",
            explanation: [
              "int age - Бүхэл тоо (Integer) хадгалах хайрцаг бэлдлээ.",
              "%d - Энд бүхэл тоо хэвлэнэ гэсэн тэмдэглэгээ."
            ],
            expectedOutput: "Миний нас: 13",
            debugSteps: [
              { lineIndex: 2, variables: {}, comment: "main() эхэллээ." },
              { lineIndex: 3, variables: { age: 13 }, comment: "age нэртэй хайрцагт 13-ыг хийлээ." },
              { lineIndex: 4, variables: { age: 13 }, comment: "age-ийн утгыг %d-ийн оронд орлуулан хэвлэж байна." },
              { lineIndex: 5, variables: { age: 13 }, comment: "Дууслаа." }
            ]
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
            explanation: ["if score > 10 - Оноо 10-аас их эсэхийг шалгаж байна."],
            expectedOutput: "Ялалт!"
          },
          {
            language: 'c',
            fileName: 'logic.c',
            template: "#include <stdio.h>\n\nint main() {\n    int score = 15;\n    if (score > 10) {\n        printf(\"Ялалт!\\n\");\n    }\n    return 0;\n}",
            explanation: [
              "if (нөхцөл) { ... } - C хэл дээр нөхцөлийг заавал хаалтанд бичдэг."
            ],
            expectedOutput: "Ялалт!",
            debugSteps: [
              { lineIndex: 3, variables: { score: 15 }, comment: "score хувьсагчид 15-ыг оноолоо." },
              { lineIndex: 4, variables: { score: 15 }, comment: "15 > 10 үнэн тул if доторх код ажиллана." },
              { lineIndex: 5, variables: { score: 15 }, comment: "Мессежийг хэвлэж байна." },
              { lineIndex: 7, variables: { score: 15 }, comment: "Дууслаа." }
            ]
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
            explanation: ["range(1, 4) - 1-ээс 3 хүртэлх тоог гаргана."],
            expectedOutput: "Тоо: 1\nТоо: 2\nТоо: 3"
          },
          {
            language: 'c',
            fileName: 'loop.c',
            template: "#include <stdio.h>\n\nint main() {\n    for (int i = 1; i <= 3; i++) {\n        printf(\"Тоо: %d\\n\", i);\n    }\n    return 0;\n}",
            explanation: [
              "i = 1 - 1-ээс эхэлнэ.",
              "i <= 3 - 3 хүртэл үргэлжилнэ.",
              "i++ - Нэг нэгээр нэмэгдэнэ."
            ],
            expectedOutput: "Тоо: 1\nТоо: 2\nТоо: 3",
            debugSteps: [
              { lineIndex: 3, variables: { i: 1 }, comment: "i-г 1-ээр эхлүүллээ." },
              { lineIndex: 4, variables: { i: 1 }, comment: "Эхний давталт: 1-ийг хэвлэв." },
              { lineIndex: 3, variables: { i: 2 }, comment: "i-г 1-ээр нэмэгдүүлээд 2 боллоо." },
              { lineIndex: 4, variables: { i: 2 }, comment: "Хоёр дахь давталт: 2-ыг хэвлэв." },
              { lineIndex: 3, variables: { i: 3 }, comment: "i-г 1-ээр нэмэгдүүлээд 3 боллоо." },
              { lineIndex: 4, variables: { i: 3 }, comment: "Гурав дахь давталт: 3-ыг хэвлэв." },
              { lineIndex: 3, variables: { i: 4 }, comment: "i = 4 болсон тул i <= 3 худал болж давталт зогсоно." }
            ]
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
        analogy: { icon: 'function', text: "Роботдоо 'цай чана' гэж зааж өгөхтэй адил. Нэг заачихвал дараа нь 'цай чана' гэхэд л робот бүгдийг хийнэ." }
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
            explanation: ["def greet() - Шинэ 'greet' тушаал үүсгэж байна.", "greet() - Үүсгэсэн тушаалаа ажиллууллаа."],
            expectedOutput: "Сайн уу, Багшаа!"
          },
          {
            language: 'c',
            fileName: 'func.c',
            template: "#include <stdio.h>\n\nvoid greet() {\n    printf(\"Сайн уу, Багшаа!\\n\");\n}\n\nint main() {\n    greet();\n    return 0;\n}",
            explanation: [
              "void greet() - Хариу буцаадаггүй функц.",
              "greet() - main дотор дуудаж ажиллуулж байна."
            ],
            expectedOutput: "Сайн уу, Багшаа!",
            debugSteps: [
              { lineIndex: 7, variables: {}, comment: "Програм main() функцээс эхэлнэ." },
              { lineIndex: 8, variables: {}, comment: "greet() функцийг дуудлаа. Одоо дээшээ шилжинэ." },
              { lineIndex: 3, variables: {}, comment: "Функц доторх printf ажиллаж байна." },
              { lineIndex: 9, variables: {}, comment: "Функц дуусаад буцаж ирлээ." }
            ]
          }
        ]
      }
    ]
  },
  'm6': {
    id: 'm6',
    title: 'LEVEL 4: Эрэмблэх - Цэгцлэх',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Sorting гэж юу вэ?',
        body: "Эрэмблэх гэдэг нь замбараагүй зүйлсийг дараалалд оруулахыг хэлнэ. Хамгийн энгийн нь 'Bubble Sort' юм.",
        analogy: { icon: 'format_list_numbered', text: "Ангийн хүүхдүүдийг өндрөөр нь жагсаахтай адил. Хажуу дахь хүнээсээ өндөр бол байраа солиод л байна." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Bubble Sort-ын эхлэл',
        body: "Хоёр тоог байрыг нь сольж сурвал эрэмбэлж чадна. Эхлээд тоонуудыг хэвлэе.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'sort.py',
            template: "numbers = [3, 1]\nprint('Эхлээд: ' + str(numbers))\nnumbers.sort()\nprint('Дараа нь: ' + str(numbers))",
            explanation: ["numbers.sort() - Python-д бэлэн эрэмбэлэх тушаал байдаг."],
            expectedOutput: "Эхлээд: [3, 1]\nДараа нь: [1, 3]"
          },
          {
            language: 'c',
            fileName: 'sort.c',
            template: "#include <stdio.h>\n\nint main() {\n    int a = 3, b = 1;\n    printf(\"Эхлээд: %d %d\\n\", a, b);\n    int temp = a;\n    a = b;\n    b = temp;\n    printf(\"Дараа нь: %d %d\\n\", a, b);\n    return 0;\n}",
            explanation: [
              "int temp = a - Байр солихын тулд гуравдагч хайрцаг (temp) хэрэгтэй.",
              "a = b - b-г а руу хийлээ.",
              "b = temp - Хуучин а-г b руу хийлээ."
            ],
            expectedOutput: "Эхлээд: 3 1\nДараа нь: 1 3",
            debugSteps: [
              { lineIndex: 3, variables: { a: 3, b: 1 }, comment: "Хувьсагчуудыг оноолоо." },
              { lineIndex: 5, variables: { a: 3, b: 1, temp: 3 }, comment: "temp хайрцагт a-гийн утгыг хадгалав." },
              { lineIndex: 6, variables: { a: 1, b: 1, temp: 3 }, comment: "a-гийн утгыг b-гийн утгаар солилоо." },
              { lineIndex: 7, variables: { a: 1, b: 3, temp: 3 }, comment: "b-д хадгалсан temp-ийг хийв. Байр солигдлоо!" }
            ]
          }
        ]
      }
    ]
  }
};
