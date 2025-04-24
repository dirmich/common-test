// const sample =
//   '{\n  "word": {\n    "word": "座談会",\n    "pronunciation": "ざだんかい"\n  },\n  "usage": [\n    {\n      "ex": "（会社/かいしゃ）で<（座談会/ざだんかい）>を（開/ひら）くことにしました。",\n      "mean": "회사에서 좌담회를 열기로 했습니다."\n    },\n    {\n      "ex": "（学部/がくぶ）の<（座談会/ざだんかい）>に（参加/さんか）しました。",\n      "mean": "학부의 좌담회에 참가했습니다."\n    },\n    {\n      "ex": "<（座談会/ざだんかい）>では（自由/じゆう）に（意見/いけん）を（述/の）べられる。",\n      "mean": "좌담회에서는 자유롭게 의견을 말할 수 있습니다."\n    },\n    {\n      "ex": "（次/つぎ）の<（座談会/ざだんかい）>の（議題/ぎだい）は（環境問題/かんきょうもんだい）です。",\n      "mean": "다음 좌담회의 의제는 환경문제입니다."\n    },\n    {\n      "ex": "<（座談会/ざだんかい）>で（皆/みな）の（声/こえ）を（聞/き）きました。",\n      "mean": "좌담회에서 모두의 목소리를 들었습니다."\n    },\n    {\n      "ex": "（新入社員/しんにゅうしゃいん）のための<（座談会/ざだんかい）>が（行/おこな）われました。",\n      "mean": "신입사원을 위한 좌담회가 열렸습니다."\n    },\n    {\n      "ex": "（学生/がくせい）の<（座談会/ざだんかい）>が（活発/かっぱつ）になっています。",\n      "mean": "학생들의 좌담회가 활발해지고 있습니다."\n    },\n    {\n      "ex": "（専門家/せんもんか）を（招/まね）いて<（座談会/ざだんかい）>を（開/ひら）きました。",\n      "mean": "전문가를 초대해 좌담회를 열었습니다."\n    },\n    {\n      "ex": "<（座談会/ざだんかい）>で（新/あたら）しい（意見/いけん）が（出/で）てきました。",\n      "mean": "좌담회에서 새로운 의견이 나왔습니다."\n    },\n    {\n      "ex": "（来週/らいしゅう）、（国際問題/こくさいもんだい）についての<（座談会/ざだんかい）>が（開/ひら）かれます。",\n      "mean": "다음 주에 국제문제에 대한 좌담회가 열립니다."\n    }\n  ],\n  "kanjiList": [\n    {\n      "word": "(会社/かいしゃ)",\n      "mean": "회사"\n    },\n    {\n      "word": "(開/ひら)",\n      "mean": "열다"\n    },\n    {\n      "word": "(学部/がくぶ)",\n      "mean": "학부"\n    },\n    {\n      "word": "(参加/さんか)",\n      "mean": "참가"\n    },\n    {\n      "word": "(自由/じゆう)",\n      "mean": "자유"\n    },\n    {\n      "word": "(意見/いけん)",\n      "mean": "의견"\n    },\n    {\n      "word": "(述/の)",\n      "mean": "말하다"\n    },\n    {\n      "word": "(次/つぎ)",\n      "mean": "다음"\n    },\n    {\n      "word": "(議題/ぎだい)",\n      "mean": "의제"\n    },\n    {\n      "word": "(環境問題/かんきょうもんだい)",\n      "mean": "환경문제"\n    },\n    {\n      "word": "(皆/みな)",\n      "mean": "모두"\n    },\n    {\n      "word": "(声/こえ)",\n      "mean": "목소리"\n    },\n    {\n      "word": "(新入社員/しんにゅうしゃいん)",\n      "mean": "신입사원"\n    },\n    {\n      "word": "(行/おこな)",\n      "mean": "행하다 (열다)"\n    },\n    {\n      "word": "(学生/がくせい)",\n      "mean": "학생"\n    },\n    {\n      "word": "(活発/かっぱつ)",\n      "mean": "활발"\n    },\n    {\n      "word": "(専門家/せんもんか)",\n      "mean": "전문가"\n    },\n    {\n      "word": "(招/まね)",\n      "mean": "초대하다"\n    },\n    {\n      "word": "(出/で)",\n      "mean": "나오다"\n    },\n    {\n      "word": "(新/あたら)",\n      "mean": "새로운"\n    },\n    {\n      "word": "(来週/らいしゅう)",\n      "mean": "다음 주"\n    },\n    {\n      "word": "(国際問題/こくさいもんだい)",\n      "mean": "국제문제"\n    }\n  ]\n}\r'
const sample = `{\"usernameSelector\":\"#username\",\"passwordSelector\":\"#password\",\"loginSelector\":\"input[type='submit'].btn.btn-primary\"}`
const parsed = JSON.parse(sample.toString())
// console.log(parsed['usernameSelector'])

const test = (param, useParam) => {
  const tip = {
    ...{ _page: 1, _cat: null, _subcat: null, _keyword: null },
    ...param,
  }
  //   const { _page = 1, _cat, _subcat, _keyword } = param
  //   const tip = { _page, _cat, _subcat, _keyword }
  const exists = Object.keys(tip).filter((k) => !!tip[k])
  const field = {}
  exists.map((i) => (field[i] = tip[i]))
  console.log(field)
  if (useParam) {
    console.log(exists.map((i) => `${i}=${tip[i]}`).join('&'))
  }
}
test({ _subcat: 12 }, true)
// const sample = {
//   name: '\rJohn',
//   age: 30,
// }

// console.log(
//   JSON.stringify(sample).replace(/\\r/g, '').replace(/\\n/g, '<newline>')
// )
