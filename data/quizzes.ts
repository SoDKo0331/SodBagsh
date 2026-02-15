export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export const PYTHON_QUIZ: QuizQuestion[] = [
  {
    id: 'p1',
    question: "Python хэл дээр дэлгэцэнд мэдээлэл хэвлэх тушаал аль нь vэ?",
    options: [
      { id: 'a', text: "output()" },
      { id: 'b', text: "write()" },
      { id: 'c', text: "print()" },
      { id: 'd', text: "echo()" }
    ],
    correctOptionId: 'c',
    explanation: "print() бол Python-ийн хамгийн vндсэн тушаал юм."
  },
  {
    id: 'p2',
    question: "Python-д тайлбар (comment) бичихдээ ямар тэмдэг ашигладаг vэ?",
    options: [
      { id: 'a', text: "//" },
      { id: 'b', text: "/* */" },
      { id: 'c', text: "#" },
      { id: 'd', text: "--" }
    ],
    correctOptionId: 'c',
    explanation: "# тэмдэг нь Python-д нэг мvрийн тайлбар бичихэд ашиглагддаг."
  },
  {
    id: 'p3',
    question: "Python-д жагсаалтад (list) шинэ элемент нэмэхдээ аль функцийг ашигладаг vэ?",
    options: [
      { id: 'a', text: "add()" },
      { id: 'b', text: "push()" },
      { id: 'c', text: "append()" },
      { id: 'd', text: "insert_last()" }
    ],
    correctOptionId: 'c',
    explanation: "append() функц нь жагсаалтын төгсгөлд нэг элемент нэмдэг."
  },
  {
    id: 'p4',
    question: "range(1, 5) функц ямар тоонуудыг vvсгэх vэ?",
    options: [
      { id: 'a', text: "1, 2, 3, 4, 5" },
      { id: 'b', text: "1, 2, 3, 4" },
      { id: 'c', text: "0, 1, 2, 3, 4" },
      { id: 'd', text: "1, 5" }
    ],
    correctOptionId: 'b',
    explanation: "range(start, stop) функц нь 'stop' утгыг оролцуулдаггvй тул 1-ээс 4 хvртэлх тоог vvсгэнэ."
  },
  {
    id: 'p5',
    question: "Python хэлний файлыг ямар өргөтгөлтэй (.extension) хадгалдаг vэ?",
    options: [
      { id: 'a', text: ".python" },
      { id: 'b', text: ".pt" },
      { id: 'c', text: ".py" },
      { id: 'd', text: ".pyt" }
    ],
    correctOptionId: 'c',
    explanation: ".py бол Python програмын стандарт файлын өргөтгөл юм."
  },
  {
    id: 'p6',
    question: "10 // 3 vйлдийн vр дvн хэд вэ?",
    options: [
      { id: 'a', text: "3.333" },
      { id: 'b', text: "3" },
      { id: 'c', text: "3.0" },
      { id: 'd', text: "1" }
    ],
    correctOptionId: 'b',
    explanation: "// оператор нь бvхэл тоон хуваалт (floor division) гvйцэтгэж бутархай хэсгийг хаядаг."
  },
  {
    id: 'p7',
    question: "Python-д утга нь өөрчлөгддөггvй (immutable) өгөгдлийн бvтцийг нэрлэнэ vv.",
    options: [
      { id: 'a', text: "list" },
      { id: 'b', text: "dictionary" },
      { id: 'c', text: "tuple" },
      { id: 'd', text: "set" }
    ],
    correctOptionId: 'c',
    explanation: "Tuple-ийг vvсгэсэн бол доторх элементvvдийг нь өөрчлөх боломжгvй байдаг."
  },
  {
    id: 'p8',
    question: "input() функцээр авсан мэдээлэл ямар төрөлтэй (type) байдаг vэ?",
    options: [
      { id: 'a', text: "int" },
      { id: 'b', text: "float" },
      { id: 'c', text: "string" },
      { id: 'd', text: "bool" }
    ],
    correctOptionId: 'c',
    explanation: "input() функц хэрэглэгчийн оруулсан утгыг vргэлж тэмдэгт мөр (string) болгож авдаг."
  },
  {
    id: 'p9',
    question: "Python хэлэнд 'And' логик операторыг хэрхэн бичдэг vэ?",
    options: [
      { id: 'a', text: "&&" },
      { id: 'b', text: "and" },
      { id: 'c', text: "&" },
      { id: 'd', text: "AND" }
    ],
    correctOptionId: 'b',
    explanation: "Python-д логик операторуудыг шууд англи vгээр (and, or, not) бичдэг."
  },
  {
    id: 'p10',
    question: "len('CodeQuest') vйлдийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "8" },
      { id: 'b', text: "9" },
      { id: 'c', text: "10" },
      { id: 'd', text: "7" }
    ],
    correctOptionId: 'b',
    explanation: "len() функц нь тэмдэгт мөр эсвэл жагсаалтын уртыг буцаадаг. 'CodeQuest' нь 9 тэмдэгттэй."
  },
  {
    id: 'p11',
    question: "bool(0) юу буцаах vэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "None" },
      { id: 'c', text: "False" },
      { id: 'd', text: "Error" }
    ],
    correctOptionId: 'c',
    explanation: "Тоон утга 0 байх нь логик утгаараа vргэлж False байдаг."
  },
  {
    id: 'p12',
    question: "Функц зарлахдаа ямар тvлхvvр vг (keyword) ашигладаг vэ?",
    options: [
      { id: 'a', text: "function" },
      { id: 'b', text: "func" },
      { id: 'c', text: "def" },
      { id: 'd', text: "define" }
    ],
    correctOptionId: 'c',
    explanation: "def (definition) тvлхvvр vгийг функц тодорхойлоход ашигладаг."
  },
  {
    id: 'p13',
    question: "Dictionary-аас утга авахдаа юуг ашигладаг vэ?",
    options: [
      { id: 'a', text: "Index (0, 1, ...)" },
      { id: 'b', text: "Key (Тvлхvvр)" },
      { id: 'c', text: "Value (Утга)" },
      { id: 'd', text: "Tag" }
    ],
    correctOptionId: 'b',
    explanation: "Dictionary бол Тvлхvvр-Утга (Key-Value) хослол дээр суурилдаг өгөгдлийн бvтэц юм."
  },
  {
    id: 'p14',
    question: "x = [1, 2, 3]; x[1] хэд вэ?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "2" },
      { id: 'c', text: "3" },
      { id: 'd', text: "Алдаа" }
    ],
    correctOptionId: 'b',
    explanation: "Python-д индекс 0-ээс эхэлдэг тул 1-р индекс дэх элемент нь 2 юм."
  },
  {
    id: 'p15',
    question: "2 ** 3 vйлдийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "6" },
      { id: 'b', text: "9" },
      { id: 'c', text: "8" },
      { id: 'd', text: "5" }
    ],
    correctOptionId: 'c',
    explanation: "** оператор нь зэрэг дэвшvvлэх vйлдэл гvйцэтгэнэ. 2-ын 3 зэрэг бол 8."
  },
  {
    id: 'p16',
    question: "Python-д блок кодыг хэрхэн ялгаж заагладаг vэ?",
    options: [
      { id: 'a', text: "{ } хаалтаар" },
      { id: 'b', text: "( ) хаалтаар" },
      { id: 'c', text: "Indentation (Догол мөрөөр)" },
      { id: 'd', text: "; тэмдэгтээр" }
    ],
    correctOptionId: 'c',
    explanation: "Python-д догол мөр (indentation) нь кодын бvтцийг тодорхойлдог маш чухал хэсэг юм."
  },
  {
    id: 'p17',
    question: "try...except блок юунд зориулагдсан бэ?",
    options: [
      { id: 'a', text: "Давталт хийх" },
      { id: 'b', text: "Алдааг барьж, боловсруулах" },
      { id: 'c', text: "Функц дуудах" },
      { id: 'd', text: "Хувьсагч зарлах" }
    ],
    correctOptionId: 'b',
    explanation: "Exception handling буюу програмын явцад гарч болзошгvй алдааг удирдахад ашигладаг."
  },
  {
    id: 'p18',
    question: "Жагсаалтаас элементийг индексээр нь устгахдаа юу ашиглах vэ?",
    options: [
      { id: 'a', text: "remove()" },
      { id: 'b', text: "delete()" },
      { id: 'c', text: "pop()" },
      { id: 'd', text: "clear()" }
    ],
    correctOptionId: 'c',
    explanation: "pop() функц нь өгөгдсөн индекс дэх элементийг устгаад, утгыг нь буцаадаг."
  },
  {
    id: 'p19',
    question: "'apple' in ['apple', 'banana'] юу буцаах vэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "None" },
      { id: 'd', text: "Error" }
    ],
    correctOptionId: 'a',
    explanation: "in оператор нь тухайн утга жагсаат дотор байгаа эсэхийг шалгадаг."
  },
  {
    id: 'p20',
    question: "x = lambda a : a + 10; x(5) vйлдийн хариу?",
    options: [
      { id: 'a', text: "5" },
      { id: 'b', text: "10" },
      { id: 'c', text: "15" },
      { id: 'd', text: "Алдаа" }
    ],
    correctOptionId: 'c',
    explanation: "Lambda бол нэрсгvй богино функц юм. 5 + 10 = 15."
  },
  {
    id: 'p21',
    question: "10 % 3 vйлдийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "3" },
      { id: 'b', text: "1" },
      { id: 'c', text: "0" },
      { id: 'd', text: "3.33" }
    ],
    correctOptionId: 'b',
    explanation: "% оператор нь хуваалтын vлдэгдлийг (modulo) олдог."
  },
  {
    id: 'p22',
    question: "random тоо гаргахын тулд аль модулийг import хийх в้?",
    options: [
      { id: 'a', text: "math" },
      { id: 'b', text: "rand" },
      { id: 'c', text: "random" },
      { id: 'd', text: "sys" }
    ],
    correctOptionId: 'c',
    explanation: "random модуль нь санамсаргvй тоотой ажиллах функцуудыг агуулдаг."
  },
  {
    id: 'p23',
    question: "None төрлийн хувьсагч юуг илэрхийлэх vэ?",
    options: [
      { id: 'a', text: "0 утгыг" },
      { id: 'b', text: "Хоосон мөрийг" },
      { id: 'c', text: "Утга байхгvйг (Null)" },
      { id: 'd', text: "False-ийг" }
    ],
    correctOptionId: 'c',
    explanation: "None нь Python-д 'утга байхгvй' эсвэл хоосон төлвийг илэрхийлэх тусгай объект юм."
  },
  {
    id: 'p24',
    question: "'Python'[0:2] юу буцаах vэ?",
    options: [
      { id: 'a', text: "Py" },
      { id: 'b', text: "Pyt" },
      { id: 'c', text: "y" },
      { id: 'd', text: "Pyth" }
    ],
    correctOptionId: 'a',
    explanation: "Slicing хийхэд 0-ээс эхлээд 2-р индекс хvртэл (2-ыг оролцуулахгvй) тэмдэгтvvдийг авна."
  },
  {
    id: 'p25',
    question: "Давталтыг хvчээр зогсоож гарахад аль тvлхvvр vгийг ашигладаг vэ?",
    options: [
      { id: 'a', text: "stop" },
      { id: 'b', text: "exit" },
      { id: 'c', text: "break" },
      { id: 'd', text: "continue" }
    ],
    correctOptionId: 'c',
    explanation: "break тvлхvvр vг нь хамгийн ойр байгаа давталтаас шууд гаргана."
  },
  {
    id: 'p26',
    question: "Сет (set) өгөгдлийн төрлийн гол онцлог юу вэ?",
    options: [
      { id: 'a', text: "Эрэмбэлэгдсэн байдаг" },
      { id: 'b', text: "Давхардсан утга хадгалдаггvй" },
      { id: 'c', text: "Индексээр хандаж болдог" },
      { id: 'd', text: "Өөрчлөх боломжгvй" }
    ],
    correctOptionId: 'b',
    explanation: "Set нь зөвхөн давтагдаагvй (unique) элементvvдийг хадгалдаг."
  },
  {
    id: 'p27',
    question: "Python-ийг хэн зохиосон бэ?",
    options: [
      { id: 'a', text: "Dennis Ritchie" },
      { id: 'b', text: "Bill Gates" },
      { id: 'c', text: "Guido van Rossum" },
      { id: 'd', text: "James Gosling" }
    ],
    correctOptionId: 'c',
    explanation: "Нидерландын програмч Guido van Rossum 1991 онд Python-ийг анх гаргасан."
  },
  {
    id: 'p28',
    question: "isinstance(5, int) юу буцаах vэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Error" },
      { id: 'd', text: "int" }
    ],
    correctOptionId: 'a',
    explanation: "isinstance() нь объект тухайн төрөлд хамаарч байгаа эсэхийг шалгадаг."
  },
  {
    id: 'p29',
    question: "x = {1, 2, 3}; x.add(2); len(x) хэд вэ?",
    options: [
      { id: 'a', text: "4" },
      { id: 'b', text: "2" },
      { id: 'c', text: "3" },
      { id: 'd', text: "Алдаа" }
    ],
    correctOptionId: 'c',
    explanation: "Set-д 2 аль хэдийн байгаа тул дахиж нэмэгдэхгvй, хэмжээ нь 3 хэвээр байна."
  },
  {
    id: 'p30',
    question: "global тvлхvvр vг ямар vvрэгтэй вэ?",
    options: [
      { id: 'a', text: "Програмыг дэлхий даяар тvгээх" },
      { id: 'b', text: "Функц дотроос гаднах хувьсагчийг өөрчлөх" },
      { id: 'c', text: "Интернетэд холбогдох" },
      { id: 'd', text: "Алдааг засах" }
    ],
    correctOptionId: 'b',
    explanation: "global тvлхvvр vгийг функц дотор ашиглаж, функцийн гаднах scope-д байгаа хувьсагчийг удирдахад ашигладаг."
  },
  {
    id: 'p31',
    question: "Dictionary-д тvлхvvр vгээр хандахад хугацааны хvндрэл (Time Complexity) дунджаар ямар байх вэ?",
    options: [
      { id: 'a', text: "O(1)" },
      { id: 'b', text: "O(n)" },
      { id: 'c', text: "O(log n)" },
      { id: 'd', text: "O(n^2)" }
    ],
    correctOptionId: 'a',
    explanation: "Dictionary нь Hash Table ашигладаг тул хайлтын хурд нь маш өндөр буюу O(1) байдаг."
  },
  {
    id: 'p32',
    question: "Python-д sort() болон sorted() функцуудын гол ялгаа юу вэ?",
    options: [
      { id: 'a', text: "sort() нь шинэ жагсаалт буцаадаг" },
      { id: 'b', text: "sort() нь байгаа жагсаалтыг өөрчилдөг (in-place)" },
      { id: 'c', text: "Ялгаа байхгvй" },
      { id: 'd', text: "sorted() нь зөвхөн тоон дээр ажилладаг" }
    ],
    correctOptionId: 'b',
    explanation: "sort() нь тухайн жагсаалтыг шууд өөрчилдөг бол sorted() нь эрэмбэлсэн шинэ жагсаалт буцаадаг."
  },
  {
    id: 'p33',
    question: "Stack өгөгдлийн бvтэц (LIFO) -ийг Python жагсаалт ашиглан хэрэгжvvлэхэд аль функцууд тохиромжтой вэ?",
    options: [
      { id: 'a', text: "append() ба pop()" },
      { id: 'b', text: "insert() ба remove()" },
      { id: 'c', text: "add() ба delete()" },
      { id: 'd', text: "push() ба shift()" }
    ],
    correctOptionId: 'a',
    explanation: "append() -ээр элемент нэмж, pop() -оор хамгийн сvvлд нэмсэн элементийг авснаар Stack (LIFO) бvтэц vvснэ."
  },
  {
    id: 'p34',
    question: "List comprehension ашиглан [1, 2, 3, 4] жагсаалтаас зөвхөн тэгш тоонуудыг яаж шvvх вэ?",
    options: [
      { id: 'a', text: "[x for x in nums if x % 2 == 0]" },
      { id: 'b', text: "filter(nums, x % 2 == 0)" },
      { id: 'c', text: "[x if x % 2 == 0]" },
      { id: 'd', text: "nums.filter(even)" }
    ],
    correctOptionId: 'a',
    explanation: "List comprehension-д 'if' нөхцөлийг төгсгөлд нь бичиж элементvvдийг шvvдэг."
  },
  {
    id: 'p35',
    question: "Хоёр сет (set)-ийн огтлолцол (intersection) буюу ижил элементvvдийг олоход ямар тэмдэг ашигладаг вэ?",
    options: [
      { id: 'a', text: "|" },
      { id: 'b', text: "&" },
      { id: 'c', text: "^" },
      { id: 'd', text: "-" }
    ],
    correctOptionId: 'b',
    explanation: "& оператор нь хоёр олонлогийн огтлолцлыг олдог бол | нь нэгдлийг (union) олдог."
  },
  {
    id: 'p36',
    question: "try...except...finally блокын finally хэсэг хэзээ ажиллах вэ?",
    options: [
      { id: 'a', text: "Зөвхөн алдаа гарсан үед" },
      { id: 'b', text: "Зөвхөн алдаа гараагүй үед" },
      { id: 'c', text: "Алдаа гарсан эсэхээс үл хамааран үргэлж" },
      { id: 'd', text: "Хэзээ ч ажиллахгүй" }
    ],
    correctOptionId: 'c',
    explanation: "finally блок нь нөөцийг чөлөөлөх зорилготой бөгөөд алдаа гарсан эсэхээс үл хамааран ажилладаг."
  },
  {
    id: 'p37',
    question: "Файлтай ажиллахдаа 'with' оператор ашиглахын давуу тал юу вэ?",
    options: [
      { id: 'a', text: "Файлыг хурдан уншдаг" },
      { id: 'b', text: "Файлыг автоматаар хаадаг (close)" },
      { id: 'c', text: "Файлыг нууцалдаг" },
      { id: 'd', text: "Файлын хэмжээг багасгадаг" }
    ],
    correctOptionId: 'b',
    explanation: "with оператор (Context Manager) нь файлыг ашиглаж дууссаны дараа автоматаар хаах үүрэгтэй."
  },
  {
    id: 'p38',
    question: "Dictionary-аас байхгүй түлхүүр (key) дуудахад алдаа гаргахгүй утга авахын тулд юу ашиглах вэ?",
    options: [
      { id: 'a', text: "dict[key]" },
      { id: 'b', text: "dict.fetch(key)" },
      { id: 'c', text: "dict.get(key)" },
      { id: 'd', text: "dict.find(key)" }
    ],
    correctOptionId: 'c',
    explanation: "get() функц нь түлхүүр байхгүй бол None эсвэл заасан утгыг буцаадаг."
  },
  {
    id: 'p39',
    question: "Хоёр сетийг хасах (difference) үйлдлийг яаж гүйцэтгэх вэ?",
    options: [
      { id: 'a', text: "set1 + set2" },
      { id: 'b', text: "set1 - set2" },
      { id: 'c', text: "set1 * set2" },
      { id: 'd', text: "set1 / set2" }
    ],
    correctOptionId: 'b',
    explanation: "- оператор нь set1-д байгаа боловч set2-т байхгүй элементүүдийг буцаана."
  },
  {
    id: 'p40',
    question: "Жагсаалтын бүх элемент дээр нэг функцийг зэрэг хэрэгжүүлэхэд юу ашиглах вэ?",
    options: [
      { id: 'a', text: "map()" },
      { id: 'b', text: "filter()" },
      { id: 'c', text: "apply()" },
      { id: 'd', text: "each()" }
    ],
    correctOptionId: 'a',
    explanation: "map(function, iterable) нь итератор болгон дээр заасан функцийг ажиллуулдаг."
  },
  {
    id: 'p41',
    question: "Жагсаалтаас тодорхой нөхцөл хангасан элементүүдийг шүүж авахад юу ашиглах вэ?",
    options: [
      { id: 'a', text: "map()" },
      { id: 'b', text: "filter()" },
      { id: 'c', text: "search()" },
      { id: 'd', text: "find()" }
    ],
    correctOptionId: 'b',
    explanation: "filter(function, iterable) нь нөхцөл (True) хангасан элементүүдийг шүүж авдаг."
  },
  {
    id: 'p42',
    question: "Давталт (for) дотор жагсаалтын индекс болон утгыг зэрэг авахад юу ашиглах вэ?",
    options: [
      { id: 'a', text: "range()" },
      { id: 'b', text: "enumerate()" },
      { id: 'c', text: "zip()" },
      { id: 'd', text: "list()" }
    ],
    correctOptionId: 'b',
    explanation: "enumerate() нь индекс болон утгыг tuple хэлбэрээр буцаадаг."
  },
  {
    id: 'p43',
    question: "Хоёр жагсаалтыг хос хосоор нь нэгтгэхэд (pairing) юу ашиглах вэ?",
    options: [
      { id: 'a', text: "combine()" },
      { id: 'b', text: "merge()" },
      { id: 'c', text: "zip()" },
      { id: 'd', text: "join()" }
    ],
    correctOptionId: 'c',
    explanation: "zip(list1, list2) нь ижил индекс дэх элементүүдийг хос болгодог."
  },
  {
    id: 'p44',
    question: "Жагсаалтын 'бүх' элемент True эсэхийг шалгахад аль функцийг ашиглах вэ?",
    options: [
      { id: 'a', text: "any()" },
      { id: 'b', text: "all()" },
      { id: 'c', text: "check_all()" },
      { id: 'd', text: "is_true()" }
    ],
    correctOptionId: 'b',
    explanation: "all() функц нь бүх элемент True бол True, үгүй бол False буцаана."
  },
  {
    id: 'p45',
    question: "Тэмдэгт мөрийн (string) хоёр талын хоосон зайг арилгахад юу ашиглах вэ?",
    options: [
      { id: 'a', text: "clean()" },
      { id: 'b', text: "trim()" },
      { id: 'c', text: "strip()" },
      { id: 'd', text: "replace()" }
    ],
    correctOptionId: 'c',
    explanation: "strip() функц нь мөрийн эхэн болон төгсгөл дэх хоосон зайг устгадаг."
  },
  {
    id: 'p46',
    question: "Жагсаалтын элементүүдийг нэг тэмдэгтээр зааглаж тэмдэгт мөр (string) болгоход юу ашиглах вэ?",
    options: [
      { id: 'a', text: "join()" },
      { id: 'b', text: "split()" },
      { id: 'c', text: "concat()" },
      { id: 'd', text: "append()" }
    ],
    correctOptionId: 'a',
    explanation: "'separator'.join(list) нь жагсаалтыг нэгтгэж текст болгоно."
  },
  {
    id: 'p47',
    question: "Файлыг нээхдээ 'a' (append) горим ашиглавал юу болох вэ?",
    options: [
      { id: 'a', text: "Файлыг шинээр үүсгэж бичнэ" },
      { id: 'b', text: "Файлын төгсгөлд мэдээлэл нэмж бичнэ" },
      { id: 'c', text: "Файлыг зөвхөн уншина" },
      { id: 'd', text: "Файлыг устгана" }
    ],
    correctOptionId: 'b',
    explanation: "'a' горим нь байгаа файлын ард шинэ мэдээлэл нэмэхэд зориулагдсан."
  },
  {
    id: 'p48',
    question: "Буруу төрлийн өгөгдөл дээр үйлдэл хийхэд (жишээ нь: int + string) ямар алдаа гардаг вэ?",
    options: [
      { id: 'a', text: "ValueError" },
      { id: 'b', text: "TypeError" },
      { id: 'c', text: "NameError" },
      { id: 'd', text: "SyntaxError" }
    ],
    correctOptionId: 'b',
    explanation: "TypeError нь тухайн үйлдлийг гүйцэтгэхэд өгөгдлийн төрөл тохирохгүй байгааг илтгэнэ."
  },
  {
    id: 'p49',
    question: "Класс (Class) дотор объект үүсэхэд автоматаар ажилладаг функцийг юу гэж нэрлэдэг вэ?",
    options: [
      { id: 'a', text: "__start__" },
      { id: 'b', text: "__init__" },
      { id: 'c', text: "__main__" },
      { id: 'd', text: "__new__" }
    ],
    correctOptionId: 'b',
    explanation: "__init__ бол Constructor функц бөгөөд объектын анхны төлвийг тодорхойлдог."
  },
  {
    id: 'p50',
    question: "Удамшсан (inheritance) класс эцэг классынхаа функцийг дуудахдаа юу ашигладаг вэ?",
    options: [
      { id: 'a', text: "this()" },
      { id: 'b', text: "parent()" },
      { id: 'c', text: "super()" },
      { id: 'd', text: "self()" }
    ],
    correctOptionId: 'c',
    explanation: "super() нь удамшсан хүү классаас эцэг классын методыг дуудахад ашиглагддаг."
  },
  {
    id: 'p51',
    question: "Функцэд хэдэн ч хамаагүй аргумент (positional arguments) дамжуулахын тулд юу ашиглах вэ?",
    options: [
      { id: 'a', text: "*args" },
      { id: 'b', text: "**kwargs" },
      { id: 'c', text: "*list" },
      { id: 'd', text: "&args" }
    ],
    correctOptionId: 'a',
    explanation: "*args (asterisk) нь дамжуулсан аргументүүдийг tuple болгож авдаг."
  },
  {
    id: 'p52',
    question: "Жагсаалтыг (list) урвуу болгох (reverse) хамгийн хурдан slicing синтакс аль нь вэ?",
    options: [
      { id: 'a', text: "list[0:-1]" },
      { id: 'b', text: "list[::-1]" },
      { id: 'c', text: "list[-1:0]" },
      { id: 'd', text: "list[1:1]" }
    ],
    correctOptionId: 'b',
    explanation: "[::-1] нь эхнээс нь дуустал -1 алхмаар (урвуу) явахыг заадаг."
  },
  {
    id: 'p53',
    question: "round(2.5) болон round(3.5) үйлдлүүдийн хариу Python 3-т хэд байх вэ?",
    options: [
      { id: 'a', text: "3, 4" },
      { id: 'b', text: "2, 4" },
      { id: 'c', text: "2, 3" },
      { id: 'd', text: "3, 3" }
    ],
    correctOptionId: 'b',
    explanation: "Python 3-т round() функц .5-ыг хамгийн ойрын ТЭГШ тоо руу бөөрөнхийлдөг (Banker's Rounding)."
  },
  {
    id: 'p54',
    question: "math.ceil(3.1) үйлдлийн үр дүн хэд вэ?",
    options: [
      { id: 'a', text: "3" },
      { id: 'b', text: "4" },
      { id: 'c', text: "3.0" },
      { id: 'd', text: "3.1" }
    ],
    correctOptionId: 'b',
    explanation: "ceil (ceiling) нь тоог дээшээ бүхэл болгож ахиулдаг."
  },
  {
    id: 'p55',
    question: "Хоёр хувьсагч 'нэг ижил объект' (identity) мөн эсэхийг яаж шалгах вэ?",
    options: [
      { id: 'a', text: "==" },
      { id: 'b', text: "is" },
      { id: 'c', text: "===" },
      { id: 'd', text: "equals" }
    ],
    correctOptionId: 'b',
    explanation: "is оператор нь санах ойн хаяг (memory address) ижил эсэхийг шалгадаг."
  },
  {
    id: 'p56',
    question: "Объектын санах ойн хаягийг (unique ID) мэдэхийн тулд аль функцийг ашиглах вэ?",
    options: [
      { id: 'a', text: "id()" },
      { id: 'b', text: "hex()" },
      { id: 'c', text: "ref()" },
      { id: 'd', text: "address()" }
    ],
    correctOptionId: 'a',
    explanation: "id() функц нь тухайн объектын дахин давтагдашгүй тоон кодыг буцаадаг."
  },
  {
    id: 'p57',
    question: "Объектын бүх метод болон атрибутуудыг жагсааж харахын тулд юу ашиглах вэ?",
    options: [
      { id: 'a', text: "help()" },
      { id: 'b', text: "list()" },
      { id: 'c', text: "dir()" },
      { id: 'd', text: "type()" }
    ],
    correctOptionId: 'c',
    explanation: "dir() функц нь тухайн объектын scope-д байгаа бүх нэрсийг жагсаадаг."
  },
  {
    id: 'p58',
    question: "Python-ийн зааварчилгаа болон баримт бичгийг консол дээрээс шууд уншихдаа юу ашиглах вэ?",
    options: [
      { id: 'a', text: "info()" },
      { id: 'b', text: "man()" },
      { id: 'c', text: "help()" },
      { id: 'd', text: "doc()" }
    ],
    correctOptionId: 'c',
    explanation: "help() нь интерактив тусламжийн системийг ажиллуулдаг."
  },
  {
    id: 'p59',
    question: "Програмыг ажиллуулах үед дамжуулсан аргументүүдийг (Command Line Arguments) авахын тулд юу ашиглах вэ?",
    options: [
      { id: 'a', text: "os.args" },
      { id: 'b', text: "sys.argv" },
      { id: 'c', text: "sys.input" },
      { id: 'd', text: "cli.args" }
    ],
    correctOptionId: 'b',
    explanation: "sys.argv жагсаалтад програмын нэр болон бүх дамжуулсан аргументүүд хадгалагддаг."
  },
  {
    id: 'p60',
    question: "Файл эсвэл хавтас байгаа эсэхийг шалгахын тулд аль функцийг ашиглах вэ?",
    options: [
      { id: 'a', text: "os.path.exists()" },
      { id: 'b', text: "os.file.check()" },
      { id: 'c', text: "sys.path.find()" },
      { id: 'd', text: "path.is_there()" }
    ],
    correctOptionId: 'a',
    explanation: "os.path.exists() нь заасан замд файл эсвэл хавтас байгаа бол True буцаана."
  },
  {
    id: 'p61',
    question: "JSON тэмдэгт мөрийг (string) Python dictionary болгон хувиргахад (Parsing) юу ашиглах вэ?",
    options: [
      { id: 'a', text: "json.dumps()" },
      { id: 'b', text: "json.loads()" },
      { id: 'c', text: "json.parse()" },
      { id: 'd', text: "json.dict()" }
    ],
    correctOptionId: 'b',
    explanation: "loads (load string) нь JSON-оос Python объект болгож хувиргадаг."
  },
  {
    id: 'p62',
    question: "Одоогийн цаг хугацааг (Date & Time) мэдэхийн тулд аль функцийг ашиглах вэ?",
    options: [
      { id: 'a', text: "time.time()" },
      { id: 'b', text: "datetime.now()" },
      { id: 'c', text: "date.current()" },
      { id: 'd', text: "clock.now()" }
    ],
    correctOptionId: 'b',
    explanation: "datetime модулийн datetime.now() нь одоогийн орон нутгийн цагийг буцаадаг."
  },
  {
    id: 'p63',
    question: "Программ дотроос албаар алдаа гаргаж (throwing an exception) зогсооход аль түлхүүр үгийг ашиглах вэ?",
    options: [
      { id: 'a', text: "error" },
      { id: 'b', text: "throw" },
      { id: 'c', text: "raise" },
      { id: 'd', text: "trigger" }
    ],
    correctOptionId: 'c',
    explanation: "raise түлхүүр үг нь тодорхой нэг алдааг (Exception) үүсгэж шидэхэд ашиглагддаг."
  },
  {
    id: 'p64',
    question: "Код бичиж амжаагүй байгаа хоосон блок (функц эсвэл класс) дотор алдаа гаргахгүй байхын тулд юу бичих вэ?",
    options: [
      { id: 'a', text: "nothing" },
      { id: 'b', text: "wait" },
      { id: 'c', text: "pass" },
      { id: 'd', text: "null" }
    ],
    correctOptionId: 'c',
    explanation: "pass нь Python-д 'юу ч хийхгүй' гэсэн утгатай бөгөөд бүтцийн хувьд хоосон байх боломжгүй хэсэгт ашиглагддаг."
  },
  {
    id: 'p65',
    question: "x = [[1, 2], [3, 4]]; x[1][0] үйлдлийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "2" },
      { id: 'c', text: "3" },
      { id: 'd', text: "4" }
    ],
    correctOptionId: 'c',
    explanation: "x[1] нь хоёр дахь жагсаалт бую [3, 4]-ыг заах ба [0] нь түүний эхний элемент болох 3-ыг авна."
  },
  {
    id: 'p66',
    question: "Python-д хэрэглэгчийн тодорхойлсон алдаа (Custom Exception) үүсгэхийн тулд ямар классыг удамшуулах вэ?",
    options: [
      { id: 'a', text: "Error" },
      { id: 'b', text: "Exception" },
      { id: 'c', text: "BaseError" },
      { id: 'd', text: "SystemExit" }
    ],
    correctOptionId: 'b',
    explanation: "Python-ийн бүх алдаанууд 'Exception' классаас удамшдаг."
  },
  {
    id: 'p67',
    question: "Файлаас нэг мөрийг уншихад аль функцийг ашиглах вэ?",
    options: [
      { id: 'a', text: "read()" },
      { id: 'b', text: "read_line()" },
      { id: 'c', text: "readline()" },
      { id: 'd', text: "readlines()" }
    ],
    correctOptionId: 'c',
    explanation: "readline() функц нь файлын одоогийн заагчаас эхлэн нэг мөрийг уншдаг."
  },
  {
    id: 'p68',
    question: "x = {'a': 1, 'b': 2}; x.pop('a'); print(x) юу хэвлэх вэ?",
    options: [
      { id: 'a', text: "{'a': 1, 'b': 2}" },
      { id: 'b', text: "{'b': 2}" },
      { id: 'c', text: "{'a': 1}" },
      { id: 'd', text: "{}" }
    ],
    correctOptionId: 'b',
    explanation: "pop() функц нь заасан түлхүүр (key)-тэй элементийг устгадаг."
  },
  {
    id: 'p69',
    question: "deque (Double-ended queue) өгөгдлийн бүтцийг аль модулиас авах вэ?",
    options: [
      { id: 'a', text: "collections" },
      { id: 'b', text: "queue" },
      { id: 'c', text: "datastructures" },
      { id: 'd', text: "sys" }
    ],
    correctOptionId: 'a',
    explanation: "collections модуль нь deque, Counter, namedtuple зэрэг ахисан түвшний бүтцийг агуулдаг."
  },
  {
    id: 'p70',
    question: "Python-д санах ойн менежментийг (Memory Management) юу хариуцдаг вэ?",
    options: [
      { id: 'a', text: "Auto-destructor" },
      { id: 'b', text: "Garbage Collector" },
      { id: 'c', text: "MemoryManager" },
      { id: 'd', text: "OS" }
    ],
    correctOptionId: 'b',
    explanation: "Garbage Collector нь ашиглагдахгүй байгаа объектуудыг санах ойгоос автоматаар цэвэрлэдэг."
  },
  {
    id: 'p71',
    question: "Файлд мэдээлэл нэмж бичихийн тулд (append) open() функцэд ямар горим өгөх вэ?",
    options: [
      { id: 'a', text: "'w'" },
      { id: 'b', text: "'r+'" },
      { id: 'c', text: "'a'" },
      { id: 'd', text: "'x'" }
    ],
    correctOptionId: 'c',
    explanation: "'a' (append) горим нь файлын төгсгөлд мэдээлэл нэмдэг."
  },
  {
    id: 'p72',
    question: "isinstance(True, int) юу буцаах вэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Error" },
      { id: 'd', text: "None" }
    ],
    correctOptionId: 'a',
    explanation: "Python-д bool төрөл нь int-ээс удамшдаг (True=1, False=0)."
  },
  {
    id: 'p73',
    question: "list.extend([1, 2]) болон list.append([1, 2]) хоёрын гол ялгаа юу вэ?",
    options: [
      { id: 'a', text: "Ялгаагүй" },
      { id: 'b', text: "extend нь элементүүдийг салгаж нэмдэг, append нь жагсаалтаар нь нэмдэг" },
      { id: 'c', text: "append нь хурдан" },
      { id: 'd', text: "extend нь утга буцаадаг" }
    ],
    correctOptionId: 'b',
    explanation: "extend нь нөгөө жагсаалтын элемент бүрийг салгаж нэмдэг бол append нь бүхэл жагсаалтыг нэг элемент болгож нэмнэ."
  },
  {
    id: 'p74',
    question: "Generator функц утга буцаахдаа ямар түлхүүр үг ашигладаг вэ?",
    options: [
      { id: 'a', text: "return" },
      { id: 'b', text: "produce" },
      { id: 'c', text: "yield" },
      { id: 'd', text: "give" }
    ],
    correctOptionId: 'c',
    explanation: "yield ашигласнаар функц нь итератор (generator) болж хувирдаг."
  },
  {
    id: 'p75',
    question: "zip([1, 2], ['a', 'b']) юу үүсгэх вэ?",
    options: [
      { id: 'a', text: "[(1, 'a'), (2, 'b')]" },
      { id: 'b', text: "[1, 2, 'a', 'b']" },
      { id: 'c', text: "{1: 'a', 2: 'b'}" },
      { id: 'd', text: "([1, 'a'], [2, 'b'])" }
    ],
    correctOptionId: 'a',
    explanation: "zip нь ижил индекс дэх элементүүдийг tuple болгож нэгтгэдэг."
  },
  {
    id: 'p76',
    question: "Файлын бүх мөрийг жагсаалт (list) болгож уншихад аль нь тохиромжтой вэ?",
    options: [
      { id: 'a', text: "read()" },
      { id: 'b', text: "readline()" },
      { id: 'c', text: "readlines()" },
      { id: 'd', text: "getlines()" }
    ],
    correctOptionId: 'c',
    explanation: "readlines() функц нь мөр бүрийг элементийн утга болгосон жагсаалт буцаадаг."
  },
  {
    id: 'p77',
    question: "getattr(obj, 'name') юу хийдэг вэ?",
    options: [
      { id: 'a', text: "Шинэ атрибут нэмнэ" },
      { id: 'b', text: "Атрибутын утгыг авна" },
      { id: 'c', text: "Атрибутыг устгана" },
      { id: 'd', text: "Объектыг нэрлэнэ" }
    ],
    correctOptionId: 'b',
    explanation: "getattr() нь объектоос нэрээр нь атрибутын утгыг авахад ашиглагддаг."
  },
  {
    id: 'p78',
    question: "Python-д 'Duck Typing' гэж юу вэ?",
    options: [
      { id: 'a', text: "Өгөгдлийн төрлийг хатуу заах" },
      { id: 'b', text: "Объектын төрлөөс илүү түүний чадвар (methods)-ыг чухалчлах" },
      { id: 'c', text: "Алдааг нуух" },
      { id: 'd', text: "Санах ойг хэмнэх" }
    ],
    correctOptionId: 'b',
    explanation: "Хэрэв объект нугас шиг дуугарч, нугас шиг алхаж байвал түүнийг нугас гэж үзэж болно (төрөл нь хамаагүй)."
  },
  {
    id: 'p79',
    question: "map(str, [1, 2, 3]) vр дvн юу байх вэ?",
    options: [
      { id: 'a', text: "[1, 2, 3]" },
      { id: 'b', text: "['1', '2', '3']" },
      { id: 'c', text: "Map объект (итератор)" },
      { id: 'd', text: "Error" }
    ],
    correctOptionId: 'c',
    explanation: "map() нь Python 3-т шууд жагсаалт биш, харин итератор буцаадаг."
  },
  {
    id: 'p80',
    question: "Python-д '__slots__' ямар зориулалттай вэ?",
    options: [
      { id: 'a', text: "Програмыг хурдасгах" },
      { id: 'b', text: "Объектын атрибутуудыг хязгаарлаж санах ой хэмнэх" },
      { id: 'c', text: "Классыг нууцлах" },
      { id: 'd', text: "Олон удамшил хийх" }
    ],
    correctOptionId: 'b',
    explanation: "__slots__ нь объект бүрт __dict__ үүсэхээс сэргийлж санах ойг маш их хэмнэдэг."
  },
  {
    id: 'p81',
    question: "filter(None, [0, 1, False, 2]) юу буцаах вэ?",
    options: [
      { id: 'a', text: "[0, 1, False, 2]" },
      { id: 'b', text: "[1, 2]" },
      { id: 'c', text: "[0, False]" },
      { id: 'd', text: "[]" }
    ],
    correctOptionId: 'b',
    explanation: "filter(None, ...) нь жагсаалтаас False утгатай (0, None, False, '') элементүүдийг шүүдэг."
  },
  {
    id: 'p82',
    question: "with open('file.txt') as f: ... блок дуусахад юу болох вэ?",
    options: [
      { id: 'a', text: "Файл устгагдана" },
      { id: 'b', text: "Файл автоматаар хаагдана" },
      { id: 'c', text: "Алдаа гарна" },
      { id: 'd', text: "Юу ч болохгүй" }
    ],
    correctOptionId: 'b',
    explanation: "Context manager (with) нь нөөцийг найдвартай чөлөөлдөг."
  },
  {
    id: 'p83',
    question: "Exception-ийг барьж авахдаа яаж нэрлэх (alias) вэ?",
    options: [
      { id: 'a', text: "except Error as e:" },
      { id: 'b', text: "except Error is e:" },
      { id: 'c', text: "except e from Error:" },
      { id: 'd', text: "catch e:" }
    ],
    correctOptionId: 'a',
    explanation: "'as' түлхүүр үгээр алдааны объектыг хувьсагчид оноодог."
  },
  {
    id: 'p84',
    question: "any([False, 0, '']) юу буцаах вэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "None" },
      { id: 'd', text: "Error" }
    ],
    correctOptionId: 'b',
    explanation: "any() нь ядаж нэг элемент True бол True, бүгд False бол False буцаана."
  },
  {
    id: 'p85',
    question: "Python-ийн стандарт номын санд JSON-той ажиллах модуль бий юу?",
    options: [
      { id: 'a', text: "Үгүй, суулгах хэрэгтэй" },
      { id: 'b', text: "Тийм, 'json' нэртэй" },
      { id: 'c', text: "Тийм, 'simplejson' нэртэй" },
      { id: 'd', text: "Зөвхөн Python 2-т бий" }
    ],
    correctOptionId: 'b',
    explanation: "import json гэж шууд ашиглаж болно."
  },
  {
    id: 'p86',
    question: "x = 1 / 0 vйлдэл ямар алдаа гаргах вэ?",
    options: [
      { id: 'a', text: "ArithmeticError" },
      { id: 'b', text: "ZeroDivisionError" },
      { id: 'c', text: "MathError" },
      { id: 'd', text: "A ба B хоёулаа" }
    ],
    correctOptionId: 'd',
    explanation: "ZeroDivisionError нь ArithmeticError-оос удамшдаг тул хоёуланд нь баригдаж болно."
  },
  {
    id: 'p87',
    question: "sys.exit() ажиллахад ямар алдаа (exception) шидэгддэг вэ?",
    options: [
      { id: 'a', text: "ExitError" },
      { id: 'b', text: "SystemExit" },
      { id: 'c', text: "StopIteration" },
      { id: 'd', text: "KeyboardInterrupt" }
    ],
    correctOptionId: 'b',
    explanation: "SystemExit нь програмыг зогсоох зориулалттай тусгай exception юм."
  },
  {
    id: 'p88',
    question: "Complex (цогцолбор) тоо Python-д дэмжигддэг үү?",
    options: [
      { id: 'a', text: "Үгүй" },
      { id: 'b', text: "Тийм, 'j' тэмдэгтээр (жишээ нь: 1+2j)" },
      { id: 'c', text: "Тийм, 'i' тэмдэгтээр" },
      { id: 'd', text: "Зөвхөн math модулиар" }
    ],
    correctOptionId: 'b',
    explanation: "Python-д 'j' нь хуурмаг нэгжийг илэрхийлдэг."
  },
  {
    id: 'p89',
    question: "itertools.cycle([1, 2]) юу хийх вэ?",
    options: [
      { id: 'a', text: "[1, 2, 1, 2]" },
      { id: 'b', text: "Төгсгөлгүй 1, 2, 1, 2... гэж давтагдах итератор" },
      { id: 'c', text: "[2, 1]" },
      { id: 'd', text: "Error" }
    ],
    correctOptionId: 'b',
    explanation: "cycle() нь өгөгдсөн цувааг төгсгөлгүй давтдаг."
  },
  {
    id: 'p90',
    question: "vars(obj) функц юу буцаадаг вэ?",
    options: [
      { id: 'a', text: "Объектын атрибутуудын жагсаалт" },
      { id: 'b', text: "Объектын __dict__ атрибут (dictionary)" },
      { id: 'c', text: "Бүх локал хувьсагчид" },
      { id: 'd', text: "Объектын төрөл" }
    ],
    correctOptionId: 'b',
    explanation: "vars() нь объектын атрибут болон утгуудыг dictionary хэлбэрээр харуулдаг."
  },
  {
    id: 'p91',
    question: "Python-д 'Memoryview' гэж юу вэ?",
    options: [
      { id: 'a', text: "Санах ойн зургийг харах" },
      { id: 'b', text: "Өгөгдлийг хуулбарлахгүйгээр (zero-copy) санах ой руу хандах" },
      { id: 'c', text: "RAM-ийн хэмжээг шалгах" },
      { id: 'd', text: "Алдаа засах хэрэгсэл" }
    ],
    correctOptionId: 'b',
    explanation: "Их хэмжээний өгөгдөлтэй (байтын цуваа) ажиллахад хурдыг нэмэгдүүлдэг."
  },
  {
    id: 'p92',
    question: "OrderedDict (collections) ердийн dictionary-аас юугаараа ялгаатай вэ?",
    options: [
      { id: 'a', text: "Хурдан" },
      { id: 'b', text: "Элемент нэмсэн дарааллыг санадаг (Python 3.7+ -д ердийн dict мөн адил)" },
      { id: 'c', text: "Бага санах ой эзэлнэ" },
      { id: 'd', text: "Түлхүүрийг автоматаар эрэмбэлнэ" }
    ],
    correctOptionId: 'b',
    explanation: "Хуучин хувилбарт dict дараалал хадгалдаггүй байсан бол OrderedDict үүнийг баталгаажуулдаг байв."
  },
  {
    id: 'p93',
    question: "heapq модуль ямар алгоритмыг хэрэгжүүлдэг вэ?",
    options: [
      { id: 'a', text: "Binary Search" },
      { id: 'b', text: "Min-Heap (Priority Queue)" },
      { id: 'c', text: "Quick Sort" },
      { id: 'd', text: "Hash Table" }
    ],
    correctOptionId: 'b',
    explanation: "heapq нь дарааллын хамгийн бага элементийг үргэлж O(1) хугацаанд авахад зориулагдсан."
  },
  {
    id: 'p94',
    question: "Python-д 'Pickle' модуль юунд ашиглагддаг вэ?",
    options: [
      { id: 'a', text: "Мэдээллийг нууцлахад" },
      { id: 'b', text: "Объектыг байтын цуваа болгож хадгалах (Serialization)" },
      { id: 'c', text: "Зураг боловсруулахад" },
      { id: 'd', text: "Програмыг хурдасгахад" }
    ],
    correctOptionId: 'b',
    explanation: "Pickle ашиглан Python объектыг файлд хадгалаад дараа нь буцааж сэргээж болно."
  },
  {
    id: 'p95',
    question: "itertools.groupby() ашиглахын өмнө цувааг яах ёстой вэ?",
    options: [
      { id: 'a', text: "Хуулах" },
      { id: 'b', text: "Эрэмбэлэх (Sorted)" },
      { id: 'c', text: "Урвуу болгох" },
      { id: 'd', text: "Юу ч хийх шаардлагагүй" }
    ],
    correctOptionId: 'b',
    explanation: "groupby() нь зөвхөн зэргэлдээх ижил элементүүдийг бүлэглэдэг тул эхлээд эрэмбэлэх шаардлагатай."
  }
];

export const C_QUIZ: QuizQuestion[] = [
  { id: 'c1', question: "С хэлний програмын хамгийн анх ажиллаж эхэлдэг функц?", options: [{ id: 'a', text: "start()" }, { id: 'b', text: "begin()" }, { id: 'c', text: "main()" }, { id: 'd', text: "init()" }], correctOptionId: 'c', explanation: "main() функц бол С програмын орох цэг юм." },
  { id: 'c2', question: "printf() функцийг ашиглахын тулд аль санг include хийх вэ?", options: [{ id: 'a', text: "math.h" }, { id: 'b', text: "stdlib.h" }, { id: 'c', text: "stdio.h" }, { id: 'd', text: "conio.h" }], correctOptionId: 'c', explanation: "Standard Input Output (stdio.h) сан нь printf-ийг агуулдаг." },
  { id: 'c3', question: "Бvхэл тоо зарлахад ямар тvлхvvр vг ашиглах вэ?", options: [{ id: 'a', text: "float" }, { id: 'b', text: "double" }, { id: 'c', text: "int" }, { id: 'd', text: "char" }], correctOptionId: 'c', explanation: "int нь бvхэл тоо (Integer)-д зориулагдсан." },
  { id: 'c4', question: "Тушаал болгоны ард ямар тэмдэг тавих ёстой вэ?", options: [{ id: 'a', text: "." }, { id: 'b', text: ":" }, { id: 'c', text: ";" }, { id: 'd', text: "," }], correctOptionId: 'c', explanation: "С хэлний тушаал цэгтэй таслалаар дуусдаг." },
  { id: 'c5', question: "float төрөл хэдэн байт зай эзэлдэг вэ (ерөнхийдөө)?", options: [{ id: 'a', text: "1" }, { id: 'b', text: "2" }, { id: 'c', text: "4" }, { id: 'd', text: "8" }], correctOptionId: 'c', explanation: "float нь ихэвчэн 4 байт санах ой эзэлдэг." },
  { id: 'c6', question: "scanf(\"%d\", &x); vйлдийн '&' ямар vvрэгтэй вэ?", options: [{ id: 'a', text: "Нэмэх" }, { id: 'b', text: "Хаяг заах" }, { id: 'c', text: "Үржих" }, { id: 'd', text: "Индекс" }], correctOptionId: 'b', explanation: "Утгыг санах ойн хаягт хадгалахын тулд & ашиглана." },
  { id: 'c7', question: "Тэмдэгт зарлахад аль төрлийг ашиглах вэ?", options: [{ id: 'a', text: "string" }, { id: 'b', text: "text" }, { id: 'c', text: "char" }, { id: 'd', text: "letter" }], correctOptionId: 'c', explanation: "char (character) нь ганц тэмдэгтэд зориулагдсан." },
  { id: 'c8', question: "10 / 3 vйлдийн vр дvн бvхэл тоон хуваалтаар хэд гарах вэ?", options: [{ id: 'a', text: "3.33" }, { id: 'b', text: "4" }, { id: 'c', text: "3" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "Бvхэл тоон хуваалтад бутархай хэсэг хаягдана." },
  { id: 'c9', question: "Тэнцvv биш гэдгийг яаж шалгах вэ?", options: [{ id: 'a', text: "<>" }, { id: 'b', text: "!= " }, { id: 'c', text: "==" }, { id: 'd', text: "not=" }], correctOptionId: 'b', explanation: "!= оператор нь тэнцvv биш эсэхийг шалгана." },
  { id: 'c10', question: "Массивын эхний элементийн индекс хэд вэ?", options: [{ id: 'a', text: "1" }, { id: 'b', text: "-1" }, { id: 'c', text: "0" }, { id: 'd', text: "2" }], correctOptionId: 'c', explanation: "Массив vргэлж 0-ээс тоолж эхэлнэ." },
  { id: 'c11', question: "for(int i=0; i<5; i++) давталт хэд удаа ажиллах вэ?", options: [{ id: 'a', text: "4" }, { id: 'b', text: "6" }, { id: 'c', text: "5" }, { id: 'd', text: "Төгсгөлгvй" }], correctOptionId: 'c', explanation: "i=0, 1, 2, 3, 4 vед ажиллана." },
  { id: 'c12', question: "if(5 == 5) нөхцөл юу буцаах vэ?", options: [{ id: 'a', text: "False" }, { id: 'b', text: "True (1)" }, { id: 'c', text: "0" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'b', explanation: "5 нь 5-тай тэнцvv тул vнэн утга буцаана." },
  { id: 'c13', question: "double төрөл float-аас юугаараа ялгаатай вэ?", options: [{ id: 'a', text: "Бага зай эзэлдэг" }, { id: 'b', text: "Илvv нарийвчлалтай" }, { id: 'c', text: "Бvхэл тоо хадгалдаг" }, { id: 'd', text: "Ялгаагvй" }], correctOptionId: 'b', explanation: "double нь 8 байт эзэлдэг тул илvv нарийвчлалтай." },
  { id: 'c14', question: "sizeof(char) хэдэн байт байдаг вэ?", options: [{ id: 'a', text: "2" }, { id: 'b', text: "4" }, { id: 'c', text: "1" }, { id: 'd', text: "8" }], correctOptionId: 'c', explanation: "char төрөл ердийн vед 1 байт байдаг." },
  { id: 'c15', question: "while(0) давталт хэд удаа ажиллах вэ?", options: [{ id: 'a', text: "1" }, { id: 'b', text: "Хэзээ ч vгvй" }, { id: 'c', text: "Төгсгөлгvй" }, { id: 'd', text: "Алдаа өгнө" }], correctOptionId: 'b', explanation: "0 утга нь 'False' тул нөхцөл биелэхгvй." },
  { id: 'c16', question: "%d формат юунд ашиглагддаг вэ?", options: [{ id: 'a', text: "Бутархай тоо" }, { id: 'b', text: "Тэмдэгт" }, { id: 'c', text: "Бvхэл тоо" }, { id: 'd', text: "Үг" }], correctOptionId: 'c', explanation: "%d нь decimal буюу бvхэл тоо хэвлэхэд ашиглагдана." },
  { id: 'c17', question: "С хэлэнд 'Ба' логик оператор аль нь вэ?", options: [{ id: 'a', text: "||" }, { id: 'b', text: "|" }, { id: 'c', text: "&&" }, { id: 'd', text: "&" }], correctOptionId: 'c', explanation: "&& оператор нь хоёр нөхцөл зэрэг биелэхийг шалгана." },
  { id: 'c18', question: "break тушаал юу хийдэг вэ?", options: [{ id: 'a', text: "Давталтыг алгасах" }, { id: 'b', text: "Давталтыг хvчээр зогсоох" }, { id: 'c', text: "Програмыг зогсоох" }, { id: 'd', text: "Буцаах" }], correctOptionId: 'b', explanation: "break нь ажиллаж буй давталтаас шууд гаргана." },
  { id: 'c19', question: "/* тайлбар */ нь ямар тайлбар вэ?", options: [{ id: 'a', text: "Нэг мөр" }, { id: 'b', text: "Олон мөр" }, { id: 'c', text: "Алдаатай" }, { id: 'd', text: "Гарчиг" }], correctOptionId: 'b', explanation: "/* */ тэмдэг нь олон мөрт тайлбарт зориулагдсан." },
  { id: 'c20', question: "Тэмдэгт мөрийн төгсгөлийг ямар тэмдэг заадаг вэ?", options: [{ id: 'a', text: "\\n" }, { id: 'b', text: "\\t" }, { id: 'c', text: "\\0" }, { id: 'd', text: "\\s" }], correctOptionId: 'c', explanation: "\\0 буюу Null character нь vг дууссаныг илтгэнэ." },
  { id: 'c21', question: "switch дотор тодорхойгvй утггыг юу гэж заадаг вэ?", options: [{ id: 'a', text: "else" }, { id: 'b', text: "other" }, { id: 'c', text: "default" }, { id: 'd', text: "break" }], correctOptionId: 'c', explanation: "default нь case-vvд таарахгvй vед ажиллана." },
  { id: 'c22', question: "x = 5; y = x++; y хэд байх вэ?", options: [{ id: 'a', text: "6" }, { id: 'b', text: "4" }, { id: 'c', text: "5" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "Post-increment тул утгыг оноосны дараа нэмэгдvvлнэ." },
  { id: 'c23', question: "|| оператор юуг илэрхийлэх vэ?", options: [{ id: 'a', text: "Ба" }, { id: 'b', text: "Үгvй" }, { id: 'c', text: "Эсвэл" }, { id: 'd', text: "Тэнцvv" }], correctOptionId: 'c', explanation: "|| бол Logical OR буюу 'Эсвэл' оператор." },
  { id: 'c24', question: "return 0; нь юуг илэрхийлэх vэ?", options: [{ id: 'a', text: "Програм амжилттай дууссан" }, { id: 'b', text: "Алдаа гарсан" }, { id: 'c', text: "Дахин эхлэх" }, { id: 'd', text: "Зогсохгvй" }], correctOptionId: 'a', explanation: "0 буцаах нь системд програмыг зөв ажиллаж дууссаныг хэлдэг." },
  { id: 'c25', question: "int a[3] = {1, 2, 3}; a[2] хэд вэ?", options: [{ id: 'a', text: "1" }, { id: 'b', text: "2" }, { id: 'c', text: "3" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "0, 1, 2-р индекс тул 3 дахь утга нь 3 байна." },
  { id: 'c26', question: "printf(\"%.2f\", 3.1415); юу хэвлэх vэ?", options: [{ id: 'a', text: "3" }, { id: 'b', text: "3.1" }, { id: 'c', text: "3.14" }, { id: 'd', text: "3.1415" }], correctOptionId: 'c', explanation: "%.2f нь таслалаас хойш 2 орноор тасална." },
  { id: 'c27', question: "x = 10 % 3; x хэд вэ?", options: [{ id: 'a', text: "3" }, { id: 'b', text: "0" }, { id: 'c', text: "1" }, { id: 'd', text: "3.33" }], correctOptionId: 'c', explanation: "10-ыг 3-т хуваахад 1 vлдэнэ." },
  { id: 'c28', question: "char x = 'A'; printf(\"%d\", x); юу хэвлэх vэ?", options: [{ id: 'a', text: "A" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "65 (ASCII)" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "Тэмдэгтийг %d-ээр хэвлэвэл ASCII кодыг нь гаргана." },
  { id: 'c29', question: "do-while давталт хамгийн багадаа хэд ажиллах вэ?", options: [{ id: 'a', text: "0" }, { id: 'b', text: "2" }, { id: 'c', text: "1" }, { id: 'd', text: "Төгсгөлгvй" }], correctOptionId: 'c', explanation: "Нөхцөл шалгахаас өмнө vйлдлийг нэг удаа хийдэг." },
  { id: 'c30', question: "sqrt() функц аль санд байдаг вэ?", options: [{ id: 'a', text: "stdio.h" }, { id: 'b', text: "string.h" }, { id: 'c', text: "math.h" }, { id: 'd', text: "stdlib.h" }], correctOptionId: 'c', explanation: "Математикийн vйлдлvvд math.h санд байдаг." },
  { id: 'c31', question: "const тvлхvvр vг юуг илэрхийлэх vэ?", options: [{ id: 'a', text: "Хувьсах" }, { id: 'b', text: "Тvр зуурын" }, { id: 'c', text: "Тогтмол" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "const нь утга нь өөрчлөгдөхгvй тогтмол гэсэн vг." },
  { id: 'c32', question: "continue тушаал юу хийдэг вэ?", options: [{ id: 'a', text: "Зогсоно" }, { id: 'b', text: "Гарна" }, { id: 'c', text: "Дараагийн алхам руу vсэрнэ" }, { id: 'd', text: "Буцна" }], correctOptionId: 'c', explanation: "Доорх кодуудыг алгасаад шууд дараагийн эргэлт рvv явна." },
  { id: 'c33', question: "С хэлэнд 'Үгvй' логик оператор аль нь вэ?", options: [{ id: 'a', text: "~" }, { id: 'b', text: "NOT" }, { id: 'c', text: "!" }, { id: 'd', text: "!!" }], correctOptionId: 'c', explanation: "! оператор нь утгыг эсрэгээр нь болгоно." },
  { id: 'c34', question: "scanf-д олон хувьсагч нэг дор уншиж болох уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Зөвхөн 2-ыг" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Тийм, scanf(\"%d %d\", &a, &b); гэж уншиж болно." },
  { id: 'c35', question: "int x=5, y=5; if(x == y) нөхцөл vнэн vv?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "Хоёр утга ижил тул тэнцvv байна." },
  { id: 'c36', question: "x = 10; x += 5; x-ийн эцсийн утга?", options: [{ id: 'a', text: "10" }, { id: 'b', text: "5" }, { id: 'c', text: "15" }, { id: 'd', text: "50" }], correctOptionId: 'c', explanation: "x = x + 5 гэсэн vг." },
  { id: 'c37', question: "С хэлний нэг мөрт тайлбар?", options: [{ id: 'a', text: "#" }, { id: 'b', text: "--" }, { id: 'c', text: "//" }, { id: 'd', text: "/*" }], correctOptionId: 'c', explanation: "// тэмдэг нь зөвхөн нэг мөрийг тайлбар болгоно." },
  { id: 'c38', question: "Бvхэл тоог хуваахад vлдэгдэл олох оператор?", options: [{ id: 'a', text: "/" }, { id: 'b', text: "div" }, { id: 'c', text: "%" }, { id: 'd', text: "rem" }], correctOptionId: 'c', explanation: "% (Modulo) нь хуваалтын vлдэгдэл олдог." },
  { id: 'c39', question: "int x; printf(\"%d\", x); юу хэвлэх vэ (утга оноогоогvй бол)?", options: [{ id: 'a', text: "0" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "Санамсаргvй тоо (Garbage)" }, { id: 'd', text: "null" }], correctOptionId: 'c', explanation: "Утга оноогоогvй бол санах ойд байсан хуучин утгыг хэвлэнэ." },
  { id: 'c40', question: "ASCII кодоор жижиг 'a' хэд вэ?", options: [{ id: 'a', text: "65" }, { id: 'b', text: "48" }, { id: 'c', text: "97" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "97 бол жижиг 'a' vсгийн код юм." },
  { id: 'c41', question: "pow(2, 3) ямар хариу өгөх vэ?", options: [{ id: 'a', text: "6" }, { id: 'b', text: "9" }, { id: 'c', text: "8" }, { id: 'd', text: "5" }], correctOptionId: 'c', explanation: "2-ын 3 зэрэг нь 8 юм." },
  { id: 'c42', question: "printf(\"Hello\\nWorld\"); юу хэвлэх vэ?", options: [{ id: 'a', text: "HelloWorld" }, { id: 'b', text: "Hello World" }, { id: 'c', text: "Hello (дараагийн мөр) World" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "\\n нь шинэ мөрөнд шилжvvлдэг." },
  { id: 'c43', question: "10 > 5 && 3 < 1 нөхцөл юу буцаах vэ?", options: [{ id: 'a', text: "True" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "False" }, { id: 'd', text: "1" }], correctOptionId: 'c', explanation: "3 < 1 нь худал тул &&-ийн vр дvн худал гарна." },
  { id: 'c44', question: "int nums[10]; массивын сvvлийн индекс хэд вэ?", options: [{ id: 'a', text: "10" }, { id: 'b', text: "0" }, { id: 'c', text: "9" }, { id: 'd', text: "1" }], correctOptionId: 'c', explanation: "0-ээс эхэлдэг тул 10 элементийн svvльчийнх нь 9 байна." },
  { id: 'c45', question: "void функц юу буцаах vэ?", options: [{ id: 'a', text: "0" }, { id: 'b', text: "null" }, { id: 'c', text: "Утга буцаахгvй" }, { id: 'd', text: "1" }], correctOptionId: 'c', explanation: "void гэдэг нь хоосон буюу утга буцаахгvй гэсэн утгатай." },
  { id: 'c46', question: "main функц заавал int байх ёстой юу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Стандарт ёсоор тийм" }, { id: 'c', text: "Заавал биш" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'b', explanation: "Орчин vеийн стандартаар int main() гэж бичих нь зөв юм." },
  { id: 'c47', question: "abs(-5) ямар хариу өгөх vэ?", options: [{ id: 'a', text: "-5" }, { id: 'b', text: "0" }, { id: 'c', text: "5" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "abs нь тооны модулийг олдог." },
  { id: 'c48', question: "string.h санд аль функц байдаг вэ?", options: [{ id: 'a', text: "printf" }, { id: 'b', text: "sqrt" }, { id: 'c', text: "strlen" }, { id: 'd', text: "scanf" }], correctOptionId: 'c', explanation: "strlen нь тэмдэгт мөрийн уртыг олдог." },
  { id: 'c49', question: "if...else if...else-ийн else хэзээ ажиллах вэ?", options: [{ id: 'a', text: "Үргэлж" }, { id: 'b', text: "Эхний нөхцөл биелэхэд" }, { id: 'c', text: "Өмнөх бvх нөхцөл биелэхгvй бол" }, { id: 'd', text: "Хэзээ ч vгvй" }], correctOptionId: 'c', explanation: "Дээрх бvх нөхцөл худал байвал else ажиллана." },
  { id: 'c50', question: "1 бол 'True' гэсэн утгатай юу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Заримдаа" }], correctOptionId: 'c', explanation: "С хэлэнд 0 биш бvх утга Үнэн (True) болдог." },
  { id: 'c51', question: "exit(0) юу хийдэг вэ?", options: [{ id: 'a', text: "Давталтаас гарна" }, { id: 'b', text: "Функцээс гарна" }, { id: 'c', text: "Програмыг шууд зогсооно" }, { id: 'd', text: "Алдаа өгнө" }], correctOptionId: 'c', explanation: "Програмыг бvрэн зогсооход ашигладаг." },
  { id: 'c52', question: "int x = 10 / 4; x хэд вэ?", options: [{ id: 'a', text: "2.5" }, { id: 'b', text: "3" }, { id: 'c', text: "2" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "int тул бутархай хэсэг нь таслагдана." },
  { id: 'c53', question: "&& оператор 'Битийн БА' мөн vv?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Үгvй (Логик БА)" }, { id: 'd', text: "Хоёулаа" }], correctOptionId: 'c', explanation: "Ганц & бол битийн БА, давхар && бол логик БА юм." },
  { id: 'c54', question: "scanf-д %s юунд ашиглагддаг вэ?", options: [{ id: 'a', text: "Тоо" }, { id: 'b', text: "Тэмдэгт" }, { id: 'c', text: "Тэмдэгт мөр (Үг)" }, { id: 'd', text: "Бутархай" }], correctOptionId: 'c', explanation: "%s нь string буюу vг уншихад ашиглагдана." },
  { id: 'c55', question: "switch дотор float ашиглаж болох уу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Үгvй (Зөвхөн бvхэл төрөл)" }, { id: 'd', text: "Заримдаа" }], correctOptionId: 'c', explanation: "switch нь зөвхөн бvхэл тоо эсвэл тэмдэгт дээр ажилладаг." },
  { id: 'c56', question: "sizeof(int) заавал 4 байт байх ёстой юу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Архитектураас хамаарна" }, { id: 'd', text: "Үгvй, vргэлж 2" }], correctOptionId: 'c', explanation: "Процессорын төрлөөс хамаарч өөр байж болно." },
  { id: 'c57', question: "C хэл хэдэн онд vvссэн бэ?", options: [{ id: 'a', text: "1990" }, { id: 'b', text: "1985" }, { id: 'c', text: "1972" }, { id: 'd', text: "2000" }], correctOptionId: 'c', explanation: "Деннис Ритчи 1972 онд Bell Labs-т зохиосон." },
  { id: 'c58', question: "toupper() функц юу хийдэг вэ?", options: [{ id: 'a', text: "Томруулна" }, { id: 'b', text: "Жижигрvvлнэ" }, { id: 'c', text: "Тэмдэгтийг том vсэг болгоно" }, { id: 'd', text: "Устгана" }], correctOptionId: 'c', explanation: "Жижиг vсгийг том болгож хувиргадаг." },
  { id: 'c59', question: "int x = 2; x = x << 1; x хэд вэ?", options: [{ id: 'a', text: "2" }, { id: 'b', text: "1" }, { id: 'c', text: "4" }, { id: 'd', text: "8" }], correctOptionId: 'c', explanation: "Битийн зvvн тийш шилжилт нь 2-оор vржсэнтэй ижил (2 * 2 = 4)." },
  { id: 'c60', question: "char-д сөрөг утга хадгалж болох уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм (signed char)" }, { id: 'd', text: "Заримдаа" }], correctOptionId: 'c', explanation: "char нь -128-аас 127 хvртэл утга авч болно." },
  { id: 'c61', question: "С хэлний тvлхvvр vг (keyword) аль нь вэ?", options: [{ id: 'a', text: "integer" }, { id: 'b', text: "real" }, { id: 'c', text: "volatile" }, { id: 'd', text: "string" }], correctOptionId: 'c', explanation: "volatile нь С-ийн 32 vндсэн тvлхvvр vгийн нэг." },
  { id: 'c62', question: "printf(\"%%\", ...); юу хэвлэх vэ?", options: [{ id: 'a', text: "Алдаа" }, { id: 'b', text: "Юу ч vгvй" }, { id: 'c', text: "% тэмдэг" }, { id: 'd', text: "Хоосон зай" }], correctOptionId: 'c', explanation: "Хувь тэнцvv тэмдэг өөрөө хэвлэхэд %% ашигладаг." },
  { id: 'c63', question: "while болон do-while-ийн гол ялгаа?", options: [{ id: 'a', text: "Хурд" }, { id: 'b', text: "Ялгаагvй" }, { id: 'c', text: "Нөхцөл шалгах дараалал" }, { id: 'd', text: "Санах ой" }], correctOptionId: 'c', explanation: "while нөхцөлийг эхэнд нь, do-while төгсгөлд нь шалгадаг." },
  { id: 'c64', question: "char str[] = \"Hi\"; strlen(str) хэд вэ?", options: [{ id: 'a', text: "3" }, { id: 'b', text: "1" }, { id: 'c', text: "2" }, { id: 'd', text: "4" }], correctOptionId: 'c', explanation: "strlen нь төгсгөлийн \\0-ийг тоолдоггvй." },
  { id: 'c65', question: "fabs() функц ямар төрөлд ажилладаг вэ?", options: [{ id: 'a', text: "int" }, { id: 'b', text: "char" }, { id: 'c', text: "float/double" }, { id: 'd', text: "void" }], correctOptionId: 'c', explanation: "Бутархай тооны модулийг олоход fabs() ашиглана." },
  { id: 'c66', question: "x = 5; printf(\"%d\", ++x); юу хэвлэх vэ?", options: [{ id: 'a', text: "5" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "6" }, { id: 'd', text: "4" }], correctOptionId: 'c', explanation: "Pre-increment тул нэмээд шууд хэвлэнэ." },
  { id: 'c67', question: "if (x = 0) бол нөхцөл vнэн vv?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "Үгvй (Худал)" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "x-д 0 утга оноогдох тул vр дvн нь 0 буюу False болно." },
  { id: 'c68', question: "Массивыг int a[3] = {1, 2, 3, 4}; гэж зарлаж болох уу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Үгvй (Хэмжээ хэтэрсэн)" }, { id: 'd', text: "Заримдаа" }], correctOptionId: 'c', explanation: "Заасан хэмжээнээс их утга өгч болохгvй." },
  { id: 'c69', question: "isdigit() юу шалгадаг вэ?", options: [{ id: 'a', text: "Үсэг" }, { id: 'b', text: "Тэмдэг" }, { id: 'c', text: "Цифр мөн эсэх" }, { id: 'd', text: "Хоосон зай" }], correctOptionId: 'c', explanation: "Тэмдэгт нь тоо (0-9) мөн эсэхийг шалгана." },
  { id: 'c70', question: "C хэл 'case-sensitive' мөн vv?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Заримдаа" }, { id: 'c', text: "Тийм (Том жижиг vсэг ялгаатай)" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Main болон main нь өөр утгатай." },
  { id: 'c71', question: "bool төрөл С хэлний анхны стандартад байсан уу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Үгvй (C99 онд нэмэгдсэн)" }, { id: 'd', text: "Тийм, 1 байт" }], correctOptionId: 'c', explanation: "Анх 0 болон 1-ээр л илэрхийлдэг байсан." },
  { id: 'c72', question: "printf-д %X юу хэвлэх vэ?", options: [{ id: 'a', text: "X vсэг" }, { id: 'b', text: "Бутархай" }, { id: 'c', text: "16-тын тоо (Том vсгээр)" }, { id: 'd', text: "8-тын тоо" }], correctOptionId: 'c', explanation: "Hexadecimal буюу 16-тын системийг хэвлэнэ." },
  { id: 'c73', question: "int x = 1, 2, 3; алдаатай юу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм, таслал буруу" }, { id: 'd', text: "Үгvй" }], correctOptionId: 'c', explanation: "Зөвхөн нэг утга оноох эсвэл массив ашиглана." },
  { id: 'c74', question: "pow() функц double утга буцаадаг уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Заримдаа" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Математикийн ихэнх функцууд double буцаадаг." },
  { id: 'c75', question: "C хэл 'Low-level' vv 'High-level' vv?", options: [{ id: 'a', text: "Low" }, { id: 'b', text: "High" }, { id: 'c', text: "Middle-level (Дунд)" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Техник болон хvний хэлний аль алинд ойр тул дунд гэдэг." },
  { id: 'c76', question: "enum гэж юу вэ?", options: [{ id: 'a', text: "Тоо" }, { id: 'b', text: "Функц" }, { id: 'c', text: "Нэрлэсэн тогтмол" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "Enumeration буюу хэрэглэгчийн тодорхойлсон тогтмолууд." },
  { id: 'c77', question: "void main() бичих нь алдаа юу?", options: [{ id: 'a', text: "Тийм" }, { id: 'b', text: "Зарим системд зөвшөөрнө" }, { id: 'c', text: "Тийм, int байх ёстой" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'b', explanation: "Стандарт бус ч олон хөрвvvлэгч дээр ажилладаг." },
  { id: 'c78', question: "strcmp(s1, s2) == 0 бол юу гэсэн vг вэ?", options: [{ id: 'a', text: "Ялгаатай" }, { id: 'b', text: "Алдаатай" }, { id: 'c', text: "Хоёр vг ижил" }, { id: 'd', text: "Хоосон" }], correctOptionId: 'c', explanation: "Ижил vед 0 утга буцаадаг." },
  { id: 'c79', question: "int x = 5 / 2.0; x хэд вэ?", options: [{ id: 'a', text: "2.5" }, { id: 'b', text: "3" }, { id: 'c', text: "2" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "Бутархай гараад int-д оноогдохдоо таслагдана." },
  { id: 'c80', question: "fflush(stdin) юу хийдэг вэ?", options: [{ id: 'a', text: "Цэвэрлэнэ" }, { id: 'b', text: "Уншина" }, { id: 'c', text: "Оролтын буферийг цэвэрлэнэ" }, { id: 'd', text: "Гарна" }], correctOptionId: 'c', explanation: "scanf-ийн дараа vлдсэн тэмдэгтvvдийг арилгана." },
  { id: 'c81', question: "long long төрөл хэдэн байт вэ?", options: [{ id: 'a', text: "4" }, { id: 'b', text: "2" }, { id: 'c', text: "8" }, { id: 'd', text: "16" }], correctOptionId: 'c', explanation: "Ихэвчлэн 64 бит буюу 8 байт эзэлнэ." },
  { id: 'c82', question: "С хэлэнд 'Structure' ашиглаж болох уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Заримдаа" }, { id: 'c', text: "Тийм (struct)" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Өгөгдлийг багцлахад struct ашигладаг." },
  { id: 'c83', question: "scanf-д %f уншихдаа & хэрэгтэй юу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Заримдаа" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Массив биш бол бvх төрөлд & хэрэгтэй." },
  { id: 'c84', question: "10 == 10.0 vнэн vv?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "Тийм" }, { id: 'd', text: "Мэдэхгvй" }], correctOptionId: 'c', explanation: "Утгууд нь ижил тул С хөрвvvлээд жишиж чадна." },
  { id: 'c85', question: "printf-д \\r юу хийдэг вэ?", options: [{ id: 'a', text: "Шинэ мөр" }, { id: 'b', text: "Таб" }, { id: 'c', text: "Мөрийн эхэнд шилжих" }, { id: 'd', text: "Устгах" }], correctOptionId: 'c', explanation: "Carriage Return буюу курсорыг мөрийн эхэнд аваачна." },
  { id: 'c86', question: "int x = (5 > 2) ? 10 : 20; x хэд вэ?", options: [{ id: 'a', text: "20" }, { id: 'b', text: "0" }, { id: 'c', text: "10" }, { id: 'd', text: "5" }], correctOptionId: 'c', explanation: "Нөхцөл vнэн тул эхний утга болох 10-ыг авна." },
  { id: 'c87', question: "srand() функц юунд ашиглагддаг вэ?", options: [{ id: 'a', text: "Язгуур" }, { id: 'b', text: "Гаралт" }, { id: 'c', text: "Санамсаргvй тооны эхлэлийг тавих" }, { id: 'd', text: "Уншина" }], correctOptionId: 'c', explanation: "rand() функцийн эхлэл утгыг тохируулна." },
  { id: 'c88', question: "getchar() юу хийдэг вэ?", options: [{ id: 'a', text: "Тоо уншина" }, { id: 'b', text: "Үг уншина" }, { id: 'c', text: "Ганц тэмдэгт уншина" }, { id: 'd', text: "Гарна" }], correctOptionId: 'c', explanation: "Гарнаас ганц тэмдэгт аваад буцаана." },
  { id: 'c89', question: "extern юуг илэрхийлэх vэ?", options: [{ id: 'a', text: "Дотоод" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "Гадны хувьсагч" }, { id: 'd', text: "Тvр зуурын" }], correctOptionId: 'c', explanation: "Өөр файлд зарлагдсан хувьсагчийг ашиглахад хэрэглэнэ." },
  { id: 'c90', question: "floor(3.9) ямар хариу өгөх vэ?", options: [{ id: 'a', text: "4" }, { id: 'b', text: "3.9" }, { id: 'c', text: "3" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "Доош нь бvхэл болгож орхино." },
  { id: 'c91', question: "C хэлэнд 'boolean' сан аль нь вэ?", options: [{ id: 'a', text: "bool.h" }, { id: 'b', text: "logic.h" }, { id: 'c', text: "stdbool.h" }, { id: 'd', text: "stdlib.h" }], correctOptionId: 'c', explanation: "true, false ашиглахын тулд stdbool.h хэрэгтэй." },
  { id: 'c92', question: "main(int argc, char *argv[]) дахь argc юу вэ?", options: [{ id: 'a', text: "Тэмдэгт" }, { id: 'b', text: "Алдаа" }, { id: 'c', text: "Аргументийн тоо" }, { id: 'd', text: "Нэр" }], correctOptionId: 'c', explanation: "Програм ажиллуулахад дамжуулсан аргументийн тоо." },
  { id: 'c93', question: "printf-д %o юунд ашиглагддаг вэ?", options: [{ id: 'a', text: "10-тын тоо" }, { id: 'b', text: "16-тын тоо" }, { id: 'c', text: "8-тын тоо" }, { id: 'd', text: "2-тын тоо" }], correctOptionId: 'c', explanation: "Octal буюу 8-тын системийг илэрхийлнэ." },
  { id: 'c94', question: "int x = 10; x >>= 1; x хэд вэ?", options: [{ id: 'a', text: "10" }, { id: 'b', text: "20" }, { id: 'c', text: "5" }, { id: 'd', text: "0" }], correctOptionId: 'c', explanation: "Баруун тийш шилжилт нь 2-т хуваасныг хэлнэ (10 / 2 = 5)." },
  { id: 'c95', question: "time(NULL) хаана тодорхойлогдсон бэ?", options: [{ id: 'a', text: "stdio.h" }, { id: 'b', text: "math.h" }, { id: 'c', text: "time.h" }, { id: 'd', text: "stdlib.h" }], correctOptionId: 'c', explanation: "Цаг хугацааны функцууд time.h-д бий." },
  { id: 'c96', question: "static хувьсагч утгаа хадгалдаг уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм (Функц дуусахад устахгvй)" }, { id: 'd', text: "Заримдаа" }], correctOptionId: 'c', explanation: "Програмыг дуустал утгаа санах ойд хадгална." },
  { id: 'c97', question: "rand() % 10 юу буцаах vэ?", options: [{ id: 'a', text: "0-10" }, { id: 'b', text: "1-10" }, { id: 'c', text: "0-9" }, { id: 'd', text: "Санамсаргvй" }], correctOptionId: 'c', explanation: "10-т хуваагаад vлдэгдэл авч байгаа тул 0-ээс 9 хvртэл тоо гарна." },
  { id: 'c98', question: "void func(int a); нь юу вэ?", options: [{ id: 'a', text: "Дуудалт" }, { id: 'b', text: "Зарлалт (Prototype)" }, { id: 'c', text: "Тодорхойлолт" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'b', explanation: "Функцийг ашиглахаас өмнө биеийг нь бичилгvй зарлахыг хэлнэ." },
  { id: 'c99', question: "ceil(3.1) ямар хариу өгөх vэ?", options: [{ id: 'a', text: "3" }, { id: 'b', text: "3.1" }, { id: 'c', text: "4" }, { id: 'd', text: "Алдаа" }], correctOptionId: 'c', explanation: "Дээш нь бvхэл болгож ахиулна." },
  { id: 'c100', question: "Эцсийн асуулт: C хэл сурах гоё байна уу?", options: [{ id: 'a', text: "Үгvй" }, { id: 'b', text: "Мэдэхгvй" }, { id: 'c', text: "Тийм (Мэдээж!)" }, { id: 'd', text: "Хэцvv байна" }], correctOptionId: 'c', explanation: "Мэдээж гоё шvv дээ! Амжилт хvсье." },
  {
    id: 'c101',
    question: "Linear Search (Шууд хайлт) алгоритмын хугацааны хvндрэл (Time Complexity) дунджаар ямар байх вэ?",
    options: [
      { id: 'a', text: "O(1)" },
      { id: 'b', text: "O(n)" },
      { id: 'c', text: "O(log n)" },
      { id: 'd', text: "O(n^2)" }
    ],
    correctOptionId: 'b',
    explanation: "Шууд хайлт нь жагсаалтын элемент болгоныг нэг нэгээр нь шалгадаг тул элементvvдийн тооноос (n) хамаарч O(n) байдаг."
  },
  {
    id: 'c102',
    question: "Bubble Sort (Хөөсөн эрэмбэ) алгоритмын гол зарчим юу вэ?",
    options: [
      { id: 'a', text: "Хамгийн бага тоог олж эхэнд авчрах" },
      { id: 'b', text: "Зэргэлдээх хоёр элементийг жишиж байр солих" },
      { id: 'c', text: "Цувааг хоёр хувааж тус тусад нь эрэмбэлэх" },
      { id: 'd', text: "Санамсаргvйгээр холих" }
    ],
    correctOptionId: 'b',
    explanation: "Bubble Sort нь зэргэлдээх элементvvдийг жишиж, хэрэв буруу дараалалтай байвал солих замаар эрэмбэлдэг."
  },
  {
    id: 'c103',
    question: "Binary Tree (Хоёртын мод)-ийн нэг зангилаа (node) дээд тал нь хэдэн хvvхэдтэй (child) байж болох вэ?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "2" },
      { id: 'c', text: "3" },
      { id: 'd', text: "Хязгааргvй" }
    ],
    correctOptionId: 'b',
    explanation: "Binary Tree-ийн зангилаа бvр зvvн ба баруун гэсэн дээд тал нь 2 хvvхэдтэй байдаг."
  },
  {
    id: 'c104',
    question: "Linked List (Холбоост жагсаалт) нь Array (Массив)-аас юугаараа давуу талтай вэ?",
    options: [
      { id: 'a', text: "Индексээр хандахад илvv хурдан" },
      { id: 'b', text: "Дунд нь элемент нэмэх/устгахад санах ойд шилжилт бага хийдэг" },
      { id: 'c', text: "Бага санах ой эзэлдэг" },
      { id: 'd', text: "Бvх хэл дээр байдаг" }
    ],
    correctOptionId: 'b',
    explanation: "Linked List-д элемент нэмэхэд зөвхөн хаягийг өөрчлөхөд хангалттай байдаг бол массивын бусад элементийг зөөх шаардлага гардаг."
  },
  {
    id: 'c105',
    question: "Recursion (Рекурс) функц ашиглахад заавал байх ёстой нөхцөл юу вэ?",
    options: [
      { id: 'a', text: "For давталт" },
      { id: 'b', text: "Base Case (Зогсох нөхцөл)" },
      { id: 'c', text: "Return 0;" },
      { id: 'd', text: "Global хувьсагч" }
    ],
    correctOptionId: 'b',
    explanation: "Рекурс функц өөрийгөө дуудахаа хэзээ зогсоохыг заасан Base Case байхгvй бол төгсгөлгvй давталт (Stack Overflow) vвснэ."
  }
];