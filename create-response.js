const { pick } = require("ramda");

var question = 0;
var answers = [];
var questions = [
  {
    'text': "1. Знаете ли вы HTML и СSS?",
    'tts': "Первый вопрос. Знаете ли вы HTML и СSS?",
    'recommend': 'Web'
  },
  {
    'text': "2. Можно ли на Django написать backend?",
    'tts': "Второй вопрос.  Можно ли на Django написать backend?",
    'recommend': 'Backend'
  },
  {
    'text': "3. Изучали ли вы Unity?",
    'tts': "Третий вопрос. Изучали ли вы Unity?",
    'recommend': 'Gamedev'
  },
  {
    'text': "4. Знаете ли вы Kotlin или Java?",
    'tts': "Четвертый вопрос. Знаете ли вы Kotlin или Java?",
    'recommend': 'Mobile'
  },
  {
    'text': "5. Знакомы ли вы c Pandas и Python?",
    'tts': "Пятый вопрос. Знакомы ли вы Pandas и Python?",
    'recommend': 'Анализ данных'
  },
  {
    'text': "6. Занимались ли разработкой скиллов для Маруси?",
    'tts': "Шестой вопрос. Занимались ли разработкой скиллов для Маруси?",
    'recommend': 'Маруся'
  },
  {
    'text': "7. Занимались ли разработкой VK Mini Apps?",
    'tts': "Шестой вопрос. Занимались ли разработкой VK Mini Apps?",
    'recommend': 'VK Mini Apps'
  },
  {
    'text': "8. Знаете ли вы как создавать удобный и современный интерфейс?",
    'tts': "Восьмой вопрос. Знаете ли вы как создавать удобный и современный интерфейс?",
    'recommend': 'Дизайн интерфейсов'
  },
]
let recommendations = []

module.exports = {
  get_response: function (req) {
    if (req.request.command === "cofefu.ru вездеход") {
      return this.team_response(req);
    }
    if (req.request.command === "test") {
      return this.test(req);
    }
    if (req.session.new) {
      return this.clientStart(req);
    }
    if ((req.request.command === "нет" && question === 0) || req.request.command === "on_interrupt")
          return this.clientStop(req);
    if (req.request.command === "да" && question === 0) {
      question = 1;
      return this.startTest(req);
    }
    if (question > 0 && question <= 7) {
        question += 1
        if (req.request.command.includes('да')) {
          recommendations.push(questions[question-1]['recommend']);
          answers.push(1);
          return this.startTest(req);
        } else {
          answers.push(0);
          return this.startTest(req);
        }
    }
    if (question >= 8) {
      if (recommendations.length === 0) {
        recommendations.push('Мы не смогли подобрать вам рекомендации.')
      }
      return this.endTest(req);
    }
  },
  team_response: function ({ request, session, version }) {
    return {
      response: {
        text:
          ["Привет вездекодерам!"],
        tts:
          "<speaker audio=marusia-sounds/music-drums-3> Привет ^вездекодерам!^",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  clientStart: function ({ request, session, version }) {
    return {
      response: {
        text:
          ["<speaker audio=marusia-sounds/nature-sea-2> Привет, как же прекрасно море Владивостока! Мы подготовили для вас тест по выбору категории Вездекода. Начнём?"],
        tts:
          "Привет! Мы подготовили для вас тест по выбору категории Вездекода. ^Начнём^?",
        buttons: [
          {
            title: "Да!",
            payload: {},
            url: "",
          },
          {
            title: "Нет",
            payload: {},
            url: ""
          }
        ],
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  clientStop: function ({ request, session, version }) {
    return {
      response: {
        text:
          "Было приятно с вами поболтать! Возвращайтесь, когда будет удобно!",
        tts:
          "<speaker audio=marusia-sounds/game-loss-2> Было приятно с вами поболтать! Возвращайтесь, когда будет удобно!",
        end_session: true
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  startTest: function ({ request, session, version }) {
    return {
      response: {
        text:
          [questions[question-1]['text']],
        tts:
          questions[question-1]['tts'],
        buttons: [
          {
            title: "Да",
            payload: {},
            url: "",
          },
          {
            title: "Нет",
            payload: {},
            url: ""
          }
        ],
        end_session: false
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  endTest: function ({ request, session, version, question }) {
    return {
      response: {
        text:
            ['Тест завершен. Рекомендуемые категории: ' + recommendations],
        tts:
            'Тест завершен <speaker audio=marusia-sounds/game-win-1>. Рекомендуемые категории: ' + recommendations,
        end_session: true
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
  test: function ({ request, session, version, question }) {
    return {
      response: {
        text:
            ['Тест завершен. Рекомендуемые категории: ' + recommendations],
        tts:
            'Поздравляю! <speaker audio=marusia-sounds/nature-sea-2>   Вы правильно ответили на все мои вопросы!',
        end_session: true
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version
    };
  },
};
