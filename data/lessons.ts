
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
        body: "Нас хадгалах хайрцаг үүсгээд түүнийгээ дэлгэцэнд хэвлэе. Дебаггер ашиглан санах ойд утга хэрхэн өөрчлөгдөж байгааг харж болно шүү.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'age.py',
            template: "age = 13\n# Энд хэвлэх кодыг бичнэ үү\n",
            explanation: ["age = 13 - 'age' хайрцагт 13-ыг хийлээ."],
            expectedOutput: "Миний нас: 13"
          },
          {
            language: 'c',
            fileName: 'age.c',
            template: "#include <stdio.h>\n\nint main() {\n    int age = 13;\n    // printf ашиглан 'Миний нас: 13' гэж хэвлэнэ үү\n    return 0;\n}",
            explanation: ["int age - Бүхэл тоо хадгалах хайрцаг."],
            expectedOutput: "Миний нас: 13",
            debugSteps: [
              { lineIndex: 3, variables: { age: 13 }, comment: "age хувьсагчид 13 утга оноолоо." },
              { lineIndex: 5, variables: { age: 13 }, comment: "Энэ мөрөнд бид printf ашиглан утгыг хэвлэнэ." }
            ]
          },
          {
            language: 'cpp',
            fileName: 'age.cpp',
            template: "#include <iostream>\n\nint main() {\n    int age = 13;\n    // std::cout ашиглан 'Миний нас: 13' гэж хэвлэнэ үү\n    return 0;\n}",
            explanation: ["int age = 13; - Хувьсагч зарлаж утга оноолоо."],
            expectedOutput: "Миний нас: 13",
            debugSteps: [
              { lineIndex: 3, variables: { age: 13 }, comment: "C++ дээр int төрлийн хувьсагч санах ойд хадгалагдав." },
              { lineIndex: 5, variables: { age: 13 }, comment: "std::cout ашиглан гаралт руу илгээхэд бэлэн." }
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
            template: "score = 15\n# Хэрэв score 10-аас их бол 'Ялалт!' гэж хэвлэ\n",
            explanation: ["if score > 10 - Нөхцөл шалгаж байна."],
            expectedOutput: "Ялалт!"
          },
          {
            language: 'c',
            fileName: 'logic.c',
            template: "#include <stdio.h>\n\nint main() {\n    int score = 15;\n    // if нөхцөл ашиглан шалгана уу\n    return 0;\n}",
            explanation: ["if (score > 10) - Нөхцөл."],
            expectedOutput: "Ялалт!",
            debugSteps: [
              { lineIndex: 3, variables: { score: 15 }, comment: "Оноог 15 гэж тохирууллаа." },
              { lineIndex: 4, variables: { score: 15 }, comment: "Нөхцөл үнэн (15 > 10) тул доторх код ажиллана." }
            ]
          },
          {
            language: 'cpp',
            fileName: 'logic.cpp',
            template: "#include <iostream>\n\nint main() {\n    int score = 15;\n    // if ашиглан 'Ялалт!' гэж хэвлэх нөхцөл бичнэ үү\n    return 0;\n}",
            explanation: ["C++ дээр 'if' бүтэц нь C-тэй ижилхэн байдаг."],
            expectedOutput: "Ялалт!",
            debugSteps: [
              { lineIndex: 3, variables: { score: 15 }, comment: "score хувьсагч санах ойд хадгалагдлаа." },
              { lineIndex: 4, variables: { score: 15 }, comment: "Нөхцөл шалгаж байна..." }
            ]
          }
        ]
      }
    ]
  }
};
