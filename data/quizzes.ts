
export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export const PYTHON_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: "Python хэл дээр дэлгэцэнд мэдээлэл хэвлэх тушаал аль нь вэ?",
    options: [
      { id: 'a', text: "output()" },
      { id: 'b', text: "write()" },
      { id: 'c', text: "print()" },
      { id: 'd', text: "echo()" }
    ],
    correctOptionId: 'c',
    explanation: "print() бол Python-ийн хамгийн үндсэн тушаал юм. Энэ нь хаалтан доторх мэдээллийг дэлгэц рүү 'илгээдэг'. Жишээ нь: print('Сайн уу') гэвэл дэлгэцэнд Сайн уу гэж гарна."
  },
  {
    id: 'q2',
    question: "x = 5 гэж бичвэл 'x' нь юу болох вэ?",
    options: [
      { id: 'a', text: "Тогтмол тоо" },
      { id: 'b', text: "Хувьсагч" },
      { id: 'c', text: "Функц" },
      { id: 'd', text: "Тэмдэгт мөр" }
    ],
    correctOptionId: 'b',
    explanation: "Кодчилолд хувьсагч гэдэг нь мэдээлэл хадгалдаг 'хайрцаг' юм. x = 5 гэдэг нь x нэртэй хайрцагт 5 гэсэн тоог хийж байна гэсэн үг."
  },
  {
    id: 'q3',
    question: "Python-д нэр 'Anna' гэсэн мэдээллийг ямар төрлийн өгөгдөл гэж нэрлэдэг вэ?",
    options: [
      { id: 'a', text: "int (Бүхэл тоо)" },
      { id: 'b', text: "float (Бутархай тоо)" },
      { id: 'c', text: "str (Тэмдэгт мөр)" },
      { id: 'd', text: "bool (Логик утга)" }
    ],
    correctOptionId: 'c',
    explanation: "Хашилтанд (' ') бичигдсэн бүх бичвэрийг String буюу Тэмдэгт мөр (str) гэж нэрлэдэг. Энэ нь компьютер үүнийг тоо биш, зүгээр л бичиг гэж ойлгоно гэсэн үг."
  },
  {
    id: 'q4',
    question: "10 / 2 үйлдлийн үр дүн ямар төрөлтэй гарах вэ?",
    options: [
      { id: 'a', text: "int" },
      { id: 'b', text: "float" },
      { id: 'c', text: "str" },
      { id: 'd', text: "bool" }
    ],
    correctOptionId: 'b',
    explanation: "Python-д нэг ташуу зураас (/) ашиглан хуваахад үр дүн нь үргэлж float буюу бутархай тоо (жишээ нь: 5.0) гардаг."
  },
  {
    id: 'q5',
    question: "if нөхцөлийн дараа заавал бичих ёстой тэмдэг аль нь вэ?",
    options: [
      { id: 'a', text: "Цэг (.)" },
      { id: 'b', text: "Таслал (,)" },
      { id: 'c', text: "Цэгтэй таслал (;)" },
      { id: 'd', text: "Давхар цэг (:)" }
    ],
    correctOptionId: 'd',
    explanation: "Python-д if, for, while зэрэг бүтцийн нөхцөлийн ард заавал давхар цэг (:) тавьдаг. Энэ нь 'дараагийн мөрнөөс ажиллах блок эхэлж байна' гэсэн дохио юм."
  },
  {
    id: 'q6',
    question: "Python-д 'ба тэгээд' гэсэн утгатай логик оператор аль нь вэ?",
    options: [
      { id: 'a', text: "or" },
      { id: 'b', text: "and" },
      { id: 'c', text: "not" },
      { id: 'd', text: "&&" }
    ],
    correctOptionId: 'b',
    explanation: "and оператор нь хоёр нөхцөл хоёулаа үнэн байх үед 'True' утга буцаана. Жишээ нь: Нас > 10 and Нас < 20."
  },
  {
    id: 'q7',
    question: "Массив (List)-ын эхний элементийн индекс (дугаар) хэдээс эхэлдэг вэ?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "0" },
      { id: 'c', text: "-1" },
      { id: 'd', text: "Дурын тоо" }
    ],
    correctOptionId: 'b',
    explanation: "Програмчлалд тоолохдоо ихэвчлэн 0-ээс эхэлдэг. Хэрэв [10, 20, 30] гэсэн жагсаалт байвал 10-ын дугаар нь 0 юм."
  },
  {
    id: 'q8',
    question: "x = input() тушаал юу хийдэг вэ?",
    options: [
      { id: 'a', text: "Дэлгэцэнд хэвлэнэ" },
      { id: 'b', text: "Програмыг зогсооно" },
      { id: 'c', text: "Гараас утга авч хадгална" },
      { id: 'd', text: "Тоог үржүүлнэ" }
    ],
    correctOptionId: 'c',
    explanation: "input() нь хэрэглэгчээс ямар нэгэн мэдээлэл бичихийг хүлээж, бичсэн утгыг нь хувьсагчид хадгалдаг."
  },
  {
    id: 'q9',
    question: "5 ** 2 үйлдлийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "10" },
      { id: 'b', text: "7" },
      { id: 'c', text: "25" },
      { id: 'd', text: "3" }
    ],
    correctOptionId: 'c',
    explanation: "** тэмдэг нь 'зэрэг дэвшүүлэх' үйлдэл юм. 5-ын 2 зэрэг буюу 5-ыг 5-аар үржүүлж 25 гарна."
  },
  {
    id: 'q10',
    question: "Python хэлний файлыг ямар өргөтгөлтэй хадгалдаг вэ?",
    options: [
      { id: 'a', text: ".exe" },
      { id: 'b', text: ".txt" },
      { id: 'c', text: ".py" },
      { id: 'd', text: ".code" }
    ],
    correctOptionId: 'c',
    explanation: ".py бол Python програмын стандарт өргөтгөл юм. Компьютер үүнийг хараад 'Энэ бол Python код байна' гэж таньдаг."
  },
  {
    id: 'q11',
    question: "for i in range(5): гэвэл 'i' хэд хүртэл тоолох вэ?",
    options: [
      { id: 'a', text: "0, 1, 2, 3, 4, 5" },
      { id: 'b', text: "1, 2, 3, 4, 5" },
      { id: 'c', text: "0, 1, 2, 3, 4" },
      { id: 'd', text: "5, 5, 5" }
    ],
    correctOptionId: 'c',
    explanation: "range(5) нь 0-ээс эхлээд 5 хүртэлх (гэхдээ 5-ыг оролцуулахгүй) тоонуудыг үүсгэнэ. Өөрөөр хэлбэл 0, 1, 2, 3, 4."
  },
  {
    id: 'q12',
    question: "Хувьсагчийн нэр ямар тэмдэгтээр эхэлж болохгүй вэ?",
    options: [
      { id: 'a', text: "Үсэг" },
      { id: 'b', text: "Доогуур зураас (_)" },
      { id: 'c', text: "Тоо" },
      { id: 'd', text: "Том үсэг" }
    ],
    correctOptionId: 'c',
    explanation: "Python-д хувьсагчийн нэр тоогоор эхэлж болохгүй. Жишээ нь: 1name = 'A' гэвэл алдаа өгнө. Харин name1 = 'A' гэвэл болно."
  },
  {
    id: 'q13',
    question: "int('10') + 5 үйлдлийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "15" },
      { id: 'b', text: "'105'" },
      { id: 'c', text: "Алдаа өгнө" },
      { id: 'd', text: "10.5" }
    ],
    correctOptionId: 'a',
    explanation: "int() функц нь хашилтанд байгаа '10' гэсэн бичвэрийг жинхэнэ 10 гэсэн тоо болгож хувиргана. Тиймээс 10 + 5 = 15."
  },
  {
    id: 'q14',
    question: "Жагсаалтын төгсгөлд шинэ элемент нэмэх тушаал аль нь вэ?",
    options: [
      { id: 'a', text: "add()" },
      { id: 'b', text: "insert()" },
      { id: 'c', text: "append()" },
      { id: 'd', text: "plus()" }
    ],
    correctOptionId: 'c',
    explanation: "append() нь жагсаалтын хамгийн сүүлд шинэ гишүүн нэмдэг. Жишээ нь: list.append('шинэ')."
  },
  {
    id: 'q15',
    question: "len([1, 2, 3]) функц ямар хариу өгөх вэ?",
    options: [
      { id: 'a', text: "1" },
      { id: 'b', text: "2" },
      { id: 'c', text: "3" },
      { id: 'd', text: "0" }
    ],
    correctOptionId: 'c',
    explanation: "len() буюу 'length' функц нь жагсаалт дотор хэдэн ширхэг зүйл байгааг тоолж хэлж өгдөг."
  },
  {
    id: 'q16',
    question: "Нөхцөл буруу байвал ажилладаг хэсэг аль нь вэ?",
    options: [
      { id: 'a', text: "if" },
      { id: 'b', text: "else" },
      { id: 'c', text: "then" },
      { id: 'd', text: "when" }
    ],
    correctOptionId: 'b',
    explanation: "if (хэрвээ) нөхцөл биелэхгүй буюу буруу байвал else (үгүй бол) хэсэгт бичигдсэн код ажилладаг."
  },
  {
    id: 'q17',
    question: "10 % 3 үйлдлийн хариу хэд вэ?",
    options: [
      { id: 'a', text: "3" },
      { id: 'b', text: "3.33" },
      { id: 'c', text: "1" },
      { id: 'd', text: "0" }
    ],
    correctOptionId: 'c',
    explanation: "% тэмдэг нь 'үлдэгдэл олох' үйлдэл юм. 10-ыг 3-т хуваахад 3 удаа ороод, үлдэгдэл нь 1 гарна."
  },
  {
    id: 'q18',
    question: "Python-д тайлбар бичихдээ ямар тэмдэг ашигладаг вэ?",
    options: [
      { id: 'a', text: "//" },
      { id: 'b', text: "/*" },
      { id: 'c', text: "#" },
      { id: 'd', text: "--" }
    ],
    correctOptionId: 'c',
    explanation: "# тэмдгийн ард бичсэн зүйлийг компьютер уншдаггүй. Энэ нь зөвхөн хүмүүст зориулсан тайлбар (Comment) юм."
  },
  {
    id: 'q19',
    question: "x = 10, y = 20 бол print(x == y) юу гэж гарах вэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "10" },
      { id: 'd', text: "Алдаа" }
    ],
    correctOptionId: 'b',
    explanation: "== тэмдэг нь 'хоорондоо тэнцүү юу?' гэж асууж байна гэсэн үг. 10 ба 20 тэнцүү биш тул False (Худал) гэж хариулна."
  },
  {
    id: 'q20',
    question: "float(5) гэвэл ямар утга болох вэ?",
    options: [
      { id: 'a', text: "5" },
      { id: 'b', text: "'5'" },
      { id: 'c', text: "5.0" },
      { id: 'd', text: "0.5" }
    ],
    correctOptionId: 'c',
    explanation: "float() функц нь бүхэл тоог бутархай тоо болгож хувиргадаг. Тиймээс 5 нь 5.0 болно."
  },
  {
    id: 'q21',
    question: "Хувьсагчийн утгыг 1-ээр нэмэгдүүлэх товч хэлбэр аль нь вэ?",
    options: [
      { id: 'a', text: "x =+ 1" },
      { id: 'b', text: "x += 1" },
      { id: 'c', text: "x ++" },
      { id: 'd', text: "x = 1" }
    ],
    correctOptionId: 'b',
    explanation: "x += 1 гэдэг нь x = x + 1 гэсэн бичиглэлийн товчлол юм."
  },
  {
    id: 'q22',
    question: "while давталт хэзээ зогсдог вэ?",
    options: [
      { id: 'a', text: "Нөхцөл биелэх үед" },
      { id: 'b', text: "Нөхцөл биелэхээ болих үед" },
      { id: 'c', text: "10 удаа ажиллаад" },
      { id: 'd', text: "Хэзээ ч зогсохгүй" }
    ],
    correctOptionId: 'b',
    explanation: "while давталт нь нөхцөл 'True' байх хугацаанд ажиллаад, 'False' болох үед шууд зогсдог."
  },
  {
    id: 'q23',
    question: "'apple' in ['apple', 'banana'] үйлдлийн хариу?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "apple" },
      { id: 'd', text: "1" }
    ],
    correctOptionId: 'a',
    explanation: "in оператор нь тухайн зүйл жагсаалт дотор байгаа эсэхийг шалгана. 'apple' байгаа тул True гарна."
  },
  {
    id: 'q24',
    question: "bool(1) юуг илэрхийлэх вэ?",
    options: [
      { id: 'a', text: "True" },
      { id: 'b', text: "False" },
      { id: 'c', text: "Алдаа" },
      { id: 'd', text: "0" }
    ],
    correctOptionId: 'a',
    explanation: "Логик утгад 1-ийг үнэн (True), 0-ийг худал (False) гэж үздэг."
  },
  {
    id: 'q25',
    question: "str(100) + '2' үйлдлийн хариу?",
    options: [
      { id: 'a', text: "102" },
      { id: 'b', text: "'1002'" },
      { id: 'c', text: "Алдаа" },
      { id: 'd', text: "100" }
    ],
    correctOptionId: 'b',
    explanation: "str(100) нь 100-г бичвэр болгоно. Хоёр бичвэрийг + тэмдгээр нэгтгэвэл '100' болон '2' нийлээд '1002' болно."
  },
  {
    id: 'q26',
    question: "range(1, 4) гэвэл ямар тоонууд гарах вэ?",
    options: [
      { id: 'a', text: "1, 2, 3, 4" },
      { id: 'b', text: "1, 2, 3" },
      { id: 'c', text: "2, 3, 4" },
      { id: 'd', text: "1, 4" }
    ],
    correctOptionId: 'b',
    explanation: "range(эхлэх, дуусах) функц нь эхлэх тоог оролцуулаад, дуусах тоог оролцуулахгүй тоолдог."
  },
  {
    id: 'q27',
    question: "if 5 > 3 or 2 > 10: гэсэн нөхцөл биелэх үү?",
    options: [
      { id: 'a', text: "Тийм" },
      { id: 'b', text: "Үгүй" },
      { id: 'c', text: "Алдаа" },
      { id: 'd', text: "Зөвхөн хагаст" }
    ],
    correctOptionId: 'a',
    explanation: "or (эсвэл) оператор нь аль нэг талын нөхцөл үнэн байхад л бүхэлдээ үнэн болдог. 5 > 3 нь үнэн тул биелнэ."
  },
  {
    id: 'q28',
    question: "Python-ийг хэн зохиосон бэ?",
    options: [
      { id: 'a', text: "Гвидо ван Россум" },
      { id: 'b', text: "Билл Гейтс" },
      { id: 'c', text: "Стив Жобс" },
      { id: 'd', text: "Марк Цукерберг" }
    ],
    correctOptionId: 'a',
    explanation: "Гвидо ван Россум (Guido van Rossum) нь 1989 онд Python хэлийг зохиож эхэлсэн."
  },
  {
    id: 'q29',
    question: "break тушаал юу хийдэг вэ?",
    options: [
      { id: 'a', text: "Дараагийн алхам руу үсэрнэ" },
      { id: 'b', text: "Давталтыг шууд зогсооно" },
      { id: 'c', text: "Програмыг устгана" },
      { id: 'd', text: "Алхам алгасна" }
    ],
    correctOptionId: 'b',
    explanation: "break нь ажиллаж байгаа давталтыг хүчээр шууд зогсооход ашиглагддаг."
  },
  {
    id: 'q30',
    question: "print(type(10.5)) юу гэж хэвлэх вэ?",
    options: [
      { id: 'a', text: "<class 'int'>" },
      { id: 'b', text: "<class 'str'>" },
      { id: 'c', text: "<class 'float'>" },
      { id: 'd', text: "<class 'bool'>" }
    ],
    correctOptionId: 'c',
    explanation: "type() функц нь тухайн утгын ямар төрөл болохыг хэлж өгдөг. 10.5 бол бутархай тоо (float) юм."
  }
];
