
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
          },
          {
            language: 'cpp',
            fileName: 'hello.cpp',
            template: "#include <iostream>\n\nint main() {\n    std::___ << \"Hello\";\n    return 0;\n}",
            explanation: ["cout - C++ хэлний стандарт гаралтын урсгал"],
            expectedOutput: "Hello"
          },
          {
            language: 'python',
            fileName: 'hello.py',
            template: "___(\"Hello\")",
            explanation: ["print() - Python-ий хэвлэх функц"],
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
          },
          {
            language: 'cpp',
            fileName: 'vars.cpp',
            template: "#include <iostream>\n\nint main() {\n    ___ age = 15;\n    std::cout << ___;\n    return 0;\n}",
            explanation: ["int - бүхэл тоо", "age - хувьсагчийн нэр"],
            expectedOutput: "15"
          },
          {
            language: 'python',
            fileName: 'vars.py',
            template: "age = ___\nprint(___)",
            explanation: ["Python-д төрөл заах шаардлагагүй"],
            expectedOutput: "15"
          }
        ]
      }
    ]
  },
  'm6': {
    id: 'm6',
    title: 'LEVEL 4: OOP - Класс ба Объект',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Объект Хандалтат Програмчлал',
        body: "C++ бол объект хандалтат хэл юм. Класс гэдэг нь объектын загвар (blueprint) бөгөөд дотроо өгөгдөл болон функцуудыг багтаадаг.",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Класс үүсгэх',
        body: "Robot нэртэй класс үүсгэж, 'greet' функцийг гүйцээнэ үү. Дэлгэцэнд 'Beep Boop' гэж хэвлэх ёстой.",
        codingTasks: [
          {
            language: 'cpp',
            fileName: 'oop.cpp',
            template: "#include <iostream>\n#include <string>\n\nclass Robot {\n___:\n    void greet() {\n        std::cout << \"Beep Boop\";\n    }\n};\n\nint main() {\n    Robot myBot;\n    myBot.___();\n    return 0;\n}",
            explanation: ["public - хандах эрх", "greet() - гишүүн функц"],
            expectedOutput: "Beep Boop"
          }
        ]
      }
    ]
  },
  'm7': {
    id: 'm7',
    title: 'LEVEL 4: Удамшил - Inheritance',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Эцэг ба Хүү класс',
        body: "Удамшил ашиглан нэг классын шинж чанарыг нөгөөд шилжүүлж болно. Ингэснээр кодыг дахин ашиглах боломжтой болно.",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Удамшлыг нөхөж бичих',
        body: "Animal классаас Dog классыг удамшуулж, 'bark' функцийг дуудна уу.",
        codingTasks: [
          {
            language: 'cpp',
            fileName: 'inheritance.cpp',
            template: "#include <iostream>\n\nclass Animal {\npublic:\n    void eat() { std::cout << \"Eating...\"; }\n};\n\nclass Dog : ___ Animal {\npublic:\n    void bark() { std::cout << \"Woof!\"; }\n};\n\nint main() {\n    Dog myDog;\n    myDog.___();\n    return 0;\n}",
            explanation: [": public - удамших синтакс", "bark() - Dog-ийн функц"],
            expectedOutput: "Woof!"
          }
        ]
      }
    ]
  },
  'm8': {
    id: 'm8',
    title: 'LEVEL 5: STL - Vector',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Standard Template Library',
        body: "STL-ийн 'vector' нь динамик массив юм. Массивын хэмжээг урьдчилан заах шаардлагагүйгээр элемент нэмж болно.",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Vector-т элемент нэмэх',
        body: "Vector үүсгэж, push_back функц ашиглан 42-ыг нэмээд хэвлэ.",
        codingTasks: [
          {
            language: 'cpp',
            fileName: 'stl_vector.cpp',
            template: "#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums;\n    nums.___(___);\n    std::cout << nums[0];\n    return 0;\n}",
            explanation: ["push_back - элемент нэмэх", "nums[0] - эхний элемент"],
            expectedOutput: "42"
          }
        ]
      }
    ]
  },
  'm9': {
    id: 'm9',
    title: 'LEVEL 6: Холбоост жагсаалт',
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Linked Lists & Pointers',
        body: "Холбоост жагсаалт нь санах ойд тархсан 'Node'-үүдээс бүрдэнэ. Node бүр дараагийнхаа Node-ийн хаягийг (pointer) хадгалдаг.",
      },
      {
        id: 2,
        type: 'coding',
        title: 'Node үүсгэх',
        body: "Node бүтэц (struct) доторх заагч (pointer) хувьсагчийг нөхөж бич.",
        codingTasks: [
          {
            language: 'cpp',
            fileName: 'linked_list.cpp',
            template: "#include <iostream>\n\nstruct Node {\n    int data;\n    Node* ___;\n};\n\nint main() {\n    Node head;\n    head.data = 101;\n    head.next = nullptr;\n    std::cout << head.data;\n    return 0;\n}",
            explanation: ["Node* next - дараагийн зангилаа руу заах"],
            expectedOutput: "101"
          }
        ]
      }
    ]
  }
};
