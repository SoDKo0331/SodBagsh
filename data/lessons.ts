
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
        body: "Код бичнэ гэдэг нь компьютерт юу хийхийг нь ойлгомжтойгоор зааж өгөх үйл явц юм. Компьютер маш хурдан боловч 'яг юу хийхээ' биднээр хэлүүлэхгүй бол юу ч хийж чадахгүй. Хамгийн анхны тушаал бол дэлгэц дээр үг хэвлэх!",
        analogy: { icon: 'campaign', text: "Энэ бол компьютерт 'Энийг чангаар хэл!' гэж хэлж байгаатай адилхан. Бид 'print' гэж хэлээд хаалтан дотор үгээ бичдэг." },
        visualAid: 'logic'
      },
      {
        id: 2,
        type: 'coding',
        title: 'Сайн уу, Дэлхий!',
        body: "Python хэл дээр print() тушаалыг ашиглан хүссэн үгээ хэвлэж болно. Хашилт (' ') ашиглахаа бүү мартаарай! Хашилт нь компьютерт 'Энэ бол зүгээр л бичвэр шүү' гэж хэлж байгаа хэрэг юм.",
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
            explanation: ["printf - C хэл дээр хэвлэх үндсэн тушаал."],
            expectedOutput: "Сайн уу, Дэлхий!",
          },
          {
            language: 'cpp',
            fileName: 'hello.cpp',
            template: "#include <iostream>\n\nint main() {\n    std::cout << \"Сайн уу, Дэлхий!\" << std::endl;\n    return 0;\n}",
            explanation: ["std::cout - C++ хэл дээрх гаралтын урсгал."],
            expectedOutput: "Сайн уу, Дэлхий!",
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
        title: 'Санах ой гэж юу вэ?',
        body: "Хувьсагч бол дотроо мэдээлэл хадгалдаг шошготой хайрцаг юм. Компьютер бүх зүйлийг санах ойдоо хадгалдаг. Бид тэр санах ойн хэсэгт нэр өгөөд (жишээ нь: 'nas'), дотор нь утга хийчихвэл дараа нь тэр нэрээрээ дуудаж ашиглаж болдог.",
        visualAid: 'box',
        analogy: { icon: 'inventory_2', text: "Хайрцаг дээр 'nas' гэж бичээд дотор нь 13 гэсэн тоо хийчихвэл, дараа нь компьютер 'nas' хаана байна? гэхэд доторх 13-ыг нь гаргаж ирнэ." }
      },
      {
        id: 2,
        type: 'concept',
        title: 'Өгөгдлийн төрлүүд',
        body: "Компьютер хайрцагт юу байгааг мэдэх хэрэгтэй. Бүхэл тоог 'int' (integer), бичвэрийг 'str' (string), бутархай тоог 'float' гэж нэрлэдэг. Python-д энийг автоматаар таньдаг бол C хэлэнд заавал хэлж өгөх ёстой.",
        visualAid: 'hardware'
      },
      {
        id: 3,
        type: 'coding',
        title: 'Хайрцаглаж суръя',
        body: "Одоо 'age' нэртэй хувьсагч үүсгээд дотор нь өөрийнхөө насыг хийгээд хэвлэж үзээрэй. Python-д: age = 13",
        codingTasks: [
          {
            language: 'python',
            fileName: 'age.py',
            template: "age = 13\n# Энд 'Миний нас: 13' гэж гарахаар хэвлэ\n",
            explanation: ["age = 13 - Хувьсагч үүсгэж утга оноолоо."],
            expectedOutput: "Миний нас: 13"
          },
          {
            language: 'c',
            fileName: 'age.c',
            template: "#include <stdio.h>\n\nint main() {\n    int age = 13;\n    // printf(\"Миний нас: %d\\n\", age);\n    return 0;\n}",
            explanation: ["int age - Бүхэл тоон хувьсагч зарлаж байна."],
            expectedOutput: "Миний нас: 13",
          },
          {
            language: 'cpp',
            fileName: 'age.cpp',
            template: "#include <iostream>\n\nint main() {\n    int age = 13;\n    // std::cout << \"Миний нас: \" << age << std::endl;\n    return 0;\n}",
            explanation: ["std::cout - Олон утгыг нэгтгэн хэвлэж болно."],
            expectedOutput: "Миний нас: 13",
          }
        ]
      }
    ]
  },
  'm3': {
    id: 'm3',
    title: 'LEVEL 1: IF/ELSE - Логик Шийдвэр',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Зам сонгох',
        body: "Компьютер зөвхөн тоо боддоггүй, бас шийдвэр гаргаж чаддаг! Хэрэв нэг нөхцөл биелвэл (True) нэг үйлдлийг, биелэхгүй бол (False) өөр үйлдлийг хийнэ.",
        visualAid: 'logic',
        analogy: { icon: 'alt_route', text: "Тоглоом дээр 'Хэрэв түлхүүр байгаа бол хаалгыг нээ, үгүй бол 'Түлхүүр хэрэгтэй' гэж хэл' гэдэгтэй адилхан." }
      },
      {
        id: 2,
        type: 'coding',
        title: 'Дүн шалгагч',
        body: "Оноо 60-аас их бол 'Тэнцлээ', үгүй бол 'Уналаа' гэж хэлэх код бичье. 'if' болон 'else' ашиглана.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'logic.py',
            template: "score = 75\nif score >= 60:\n    # Тэнцлээ гэж хэвлэ\nelse:\n    # Уналаа гэж хэвлэ\n",
            explanation: ["if - 'Хэрэв' гэсэн утгатай.", "else - 'Үгүй бол' гэсэн утгатай."],
            expectedOutput: "Тэнцлээ"
          }
        ]
      }
    ]
  },
  'm4': {
    id: 'm4',
    title: 'LEVEL 2: Давталт - Уйтгартай ажлыг хурдсгах',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'For ба While',
        body: "Хэрэв чи 'Би залхуу биш' гэж 100 удаа бичих хэрэгтэй болсон бол гараараа бичих үү? Үгүй ээ! Компьютерт ердөө 'Энийг 100 удаа давт' гэж хэлэхэд л хангалттай. Үүнийг 'Loop' буюу Давталт гэдэг.",
        analogy: { icon: 'rebase_edit', text: "Гүйлтийн зам дээр 10 тойрог гүйхтэй адил. Тойрог болгон дээр тоолуур 1-ээр нэмэгдэнэ." }
      },
      {
        id: 2,
        type: 'coding',
        title: '1-ээс 5 хүртэл тоолох',
        body: "range() функцийг ашиглан 5 удаа давтаж, тоог хэвлэе.",
        codingTasks: [
          {
            language: 'python',
            fileName: 'loop.py',
            template: "for i in range(5):\n    print(i + 1)",
            explanation: ["range(5) - 0-ээс 4 хүртэлх тоо үүсгэнэ."],
            expectedOutput: "1\n2\n3\n4\n5"
          }
        ]
      }
    ]
  }
};
