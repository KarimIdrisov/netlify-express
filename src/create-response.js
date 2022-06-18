const { pick, last } = require("ramda");

var questionId = 0;
var rightAnswers = 0;
var answers = [];
var lastAnswer = "";
var questions = [
  {
    text: "1. Операционная система это набор взаимосвязанных программ, осуществляющих управление компьютером и взаимодействие с пользователем?",
    tts: "Первый вопрос. Операционная система это набор взаимосвязанных программ, осуществляющих управление компьютером и взаимодействие с пользователем?",
    right: "да",
    variants: ["да", "нет"],
    image_id: 457239025,
  },
  {
    text: "2. Можно ли на Django написать backend?",
    tts: "Второй вопрос.  Можно ли на Django написать backend?",
    right: "да",
    variants: ["да", "нет"],
    image_id: 457239021,
  },
  {
    text: "3. Unity это межплатформенная среда разработки компьютерных игр?",
    tts: "Третий вопрос. Unity это межплатформенная среда разработки компьютерных игр?",
    right: "да",
    variants: ["да", "нет"],
    image_id: 457239020,
  },
  {
    text: "4. Кто разработал ЯП Kotlin?",
    tts: "Четвертый вопрос. Кто разработал язык программирования Kotlin?",
    right: "Jetbrains",
    variants: ["JetBrains", "Microsoft", "Yandex"],
    image_id: 457239022,
  },
  {
    text: "5. На чём написан Pandas?",
    tts: "Пятый вопрос. На чём написан Pandas?",
    right: "python",
    variants: ["java", "c#", "python"],
    image_id: 457239018,
  },
  {
    text: "6. Что такое Маруся?",
    tts: "Шестой вопрос. Что такое Маруся?",
    right: "голосовой помощник",
    variants: ["машина", "мессенджер", "голосовой помощник"],
    image_id: 457239023,
  },
  {
    text: "7. Чем отличается Javasript от Typescript?",
    tts: "Седьмой вопрос. Чем отличается Javasript от Typescript?",
    right: "типизацией",
    variants: ["названием", "типизацией"],
    image_id: 457239024,
  },
  {
    text: "8. Для чего создан Redux?",
    tts: "Восьмой вопрос. Что такое Redux?",
    right: "для управления состоянием приложения",
    variants: [
      "для управления состоянием приложения",
      "для настройки роутинга",
    ],
  },
];
let recommendations = [];

const getButtons = (variants) => {
  return variants.map((variant) => {
    return {
      title: variant,
    };
  });
};

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
    if (
      (req.request.command === "нет" && questionId === 0) ||
      req.request.command === "on_interrupt"
    )
      return this.clientStop(req);
    if (req.request.command === "да" && questionId === 0) {
      questionId = 1;
      return this.startTest(req);
    }
    if (questionId > 0 && questionId <= 7) {
      lastAnswer = req.request.command;
      if (
        req.request.command === questions[questionId - 1]["right"].toLowerCase()
      ) {
        questionId += 1;
        rightAnswers += 1;
        return this.startTest(req);
      } else {
        questionId += 1;
        return this.startTest(req);
      }
    }
    if (questionId >= 8) {
      if (
        req.request.command === questions[questionId - 1]["right"].toLowerCase()
      ) {
        rightAnswers += 1;
      }
      if (recommendations.length === 0) {
        if (rightAnswers <= 2) {
          recommendations.push({
            text: "Маруся\nVK Mini Apps",
            tts: "Маруся\nVK Mini Apps",
          });
        } else if (rightAnswers > 2 && rightAnswers <= 4) {
          recommendations.push({
            text: "Маруся\nVK Mini Apps\nGamede\nДизайн интерфейсов",
            tts: "Маруся\nVK Mini Apps\nGame dev\nДизайн интерфейсов",
          });
        } else if (rightAnswers > 4 && rightAnswers <= 6) {
          recommendations.push({
            text: "Маруся\nVK Mini Apps\nGamedev\nДизайн интерфейсов\nBack End\nАнализ данных\nMobile",
            tts: "Маруся\nVK Mini Apps\nGame dev\nДизайн интерфейсов\nBack End\nАнализ данных\nMobile",
          });
        } else {
          recommendations.push({
            text: "Маруся\nVK Mini Apps\nGamedev\nДизайн интерфейсов\nBack End\nАнализ данных\nОптимизация и RL\nMobile\nComputer Vision",
            tts: "Маруся\nVK Mini Apps\nGamedev\nДизайн интерфейсов\nBack End\nАнализ данных\nОптимизация и RL\nMobile\nComputer Vision",
          });
        }
      }
      return this.endTest(req);
    }

    return this.clientStart(req);
  },
  team_response: function ({ request, session, version }) {
    return {
      response: {
        text: ["Привет вездекодерам!"],
        tts: "<speaker audio=marusia-sounds/music-drums-3> Привет вездекодерам!",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  clientStart: function ({ request, session, version }) {
    return {
      response: {
        text: [
          "Привет, как же прекрасно море Владивостока! Мы подготовили для вас тест по выбору категории Вездекода. Начнём?",
        ],
        tts: "<speaker audio=marusia-sounds/nature-sea-2> Привет, как же прекрасно море Владивостока! Мы подготовили для вас тест по выбору категории Вездекода. ^Начнём^?",
        buttons: [
          {
            title: "Да!",
          },
          {
            title: "Нет",
          },
        ],
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  clientStop: function ({ request, session, version }) {
    return {
      response: {
        text: "Было приятно с вами поболтать! Возвращайтесь, когда будет удобно!",
        tts: "<speaker audio=marusia-sounds/game-loss-2> Было приятно с вами поболтать! Возвращайтесь, когда будет удобно!",
        end_session: true,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  startTest: function ({ request, session, version }) {
    if (questionId > 1) {
      if (questions[questionId - 2]["right"].toLowerCase() === lastAnswer) {
        return {
          response: {
            text: [`Ответ верный!\n` + questions[questionId - 1]["text"]],
            tts:
              `Ответ верный! <speaker audio=marusia-sounds/game-win-1>` +
              questions[questionId - 1]["tts"],
            card: {
              type: 'BigImage',
              image_id: questions[questionId-1]['image_id']
            },
            buttons: getButtons(questions[questionId - 1]["variants"]),
            end_session: false,
          },
          session: pick(["session_id", "message_id", "user_id"], session),
          version,
        };
      } else {
        return {
          response: {
            text: [`Ответ неверный!\n` + questions[questionId - 1]["text"]],
            tts:
              `Ответ неверный! <speaker audio=marusia-sounds/game-loss-2> ` +
              questions[questionId - 1]["tts"],
            card: {
              type: 'BigImage',
              image_id: questions[questionId-1]['image_id']
            },
            buttons: getButtons(questions[questionId - 1]["variants"]),
            end_session: false,
          },
          session: pick(["session_id", "message_id", "user_id"], session),
          version,
        };
      }
    }
    return {
      response: {
        text: [questions[questionId - 1]["text"]],
        tts: questions[questionId - 1]["tts"],
        card: {
          'type': 'BigImage',
          'image_id': questions[questionId-1]['image_id']
        },
        buttons: getButtons(questions[questionId - 1]["variants"]),
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  endTest: function ({ request, session, version }) {
    return {
      response: {
        text: [
          `Тест завершен. Правильных ответов - ${rightAnswers}. Рекомендуемые категории:` +
            recommendations[0].text,
        ],
        tts:
          `Тест завершен <speaker audio=marusia-sounds/game-win-1> Правильных ответов - ${rightAnswers}. Рекомендуемые категории: ` +
          recommendations[0].tts,
          commands: [
            {
                "type":"BigImage",
                "image_id":457239026
            },
            {
                "type": "MiniApp",
                "url": "https://vk.com/app7923597",
            } 
        ],
        end_session: true,
      },
      session: {
        ...pick(["session_id", "message_id", "user_id"], session),
        skill_id: '5a3b63e1-d1a4-4951-b5fc-6d8f57f4ef4b',
      },
      version,
    };
  },
  rightAnswer: function ({ request, session, version }) {
    return {
      response: {
        text: ["Ответ верный!"],
        tts: "<speaker audio=marusia-sounds/game-win-1> Ответ верный!",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  wrongAnswer: function ({ request, session, version }) {
    return {
      response: {
        text: ["Ответ неверный!"],
        tts: "<speaker audio=marusia-sounds/game-loss-2> Ответ неверный!",
        end_session: false,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
  test: function ({ request, session, version, question }) {
    return {
      response: {
        text: ["Тест завершен. Рекомендуемые категории: " + recommendations],
        tts: "Поздравляю! <speaker audio=marusia-sounds/nature-sea-2>   Вы правильно ответили на все мои вопросы!",
        end_session: true,
      },
      session: pick(["session_id", "message_id", "user_id"], session),
      version,
    };
  },
};
