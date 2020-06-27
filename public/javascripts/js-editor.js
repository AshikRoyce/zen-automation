ace.require("ace/ext/language_tools");
class Editor {
  constructor(editor) {
    this.editor = editor;
  }
  getEditor() {
    return this.editor;
  }
}
class Question {
  constructor(questions) {
    this.page = 0;
    this.questions = questions;
    this.topic = Object.keys(questions)[0];
    this.questionsCount = this.questions[this.topic].length;
  }
  nextPage() {
    if (this.page < this.questionsCount - 1) {
      this.page++;
      return true;
    } else {
      return false;
    }
  }
  prevPage() {
    if (this.page > 0) {
      this.page--;
      return true;
    } else {
      return false;
    }
  }
  getPage() {
    return this.page;
  }
  getQuestion() {
    return this.questions[this.topic][this.page];
  }
  getTestCases() {
    return this.questions[this.topic][this.page].testCases.map(
      (val) => val.output
    );
  }
  setTopic(topic) {
    this.topic = topic;
    this.page = 0;
    this.questionsCount = this.questions[this.topic].length;
  }
  getTopics() {
    return Object.keys(this.questions);
  }
  getCurrentTopic() {
    return this.topic;
  }
  updateTemplate(code) {
    this.questions[this.topic][this.page].template = code;
  }
}

let myEditor = new Editor(
  ace.edit("editor", {
    theme: "ace/theme/dracula",
    mode: "ace/mode/javascript",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    wrap: true,
    fontSize: 16,
    autoScrollEditorIntoView: true,
  })
);

let myQuestions;

window.onload = async () => {
  var responce = await fetch(
    "https://raw.githubusercontent.com/AshikRoyce/zen-automation/master/src/questions.json"
  );
  var respoceJson = await responce.json();
  myQuestions = new Question(respoceJson);
  //console.log(respoceJson);
  let dropDown = document.getElementById("topics");
  myQuestions.getTopics().forEach((topic) => {
    let option = document.createElement("option");
    option.value = topic;
    option.innerHTML = topic;
    dropDown.appendChild(option);
  });
  dropDown.firstChild.selected = true;
  feedQuestion();
};

let changeTopic = (val) => {
  myQuestions.setTopic(val);
  feedQuestion(val);
};

let feedQuestion = () => {
  let questionDiv = document.getElementById("question");
  let testcaseDiv = document.getElementById("testcase");
  testcaseDiv.innerHTML = "";
  let question = myQuestions.getQuestion();
  questionDiv.innerHTML = question.question;
  question.testCases.forEach((testcase, ind) => {
    let myDiv = document.createElement("div");
    myDiv.className = "p-2 bd-highlight";
    myDiv.id = "test" + ind;
    myDiv.innerHTML = testcase.output;
    testcaseDiv.appendChild(myDiv);
  });
  myEditor.getEditor().setValue(question.template);
};

let prevPage = () => {
  if (myQuestions.prevPage()) feedQuestion();
  else {
    document.getElementById("modalText").innerHTML = "First Question";
    $("#notifyModal").modal("show");
  }
};

let nextPage = () => {
  if (myQuestions.nextPage()) feedQuestion();
  else {
    document.getElementById("modalText").innerHTML = "Last Question";
    $("#notifyModal").modal("show");
  }
};

let defaultLog = console.log;
let count = 0;
let ind = 0;
let testcases;
let runCode = () => {
  ind = 0;
  count = 0;
  testcases = myQuestions.getTestCases();
  let runScript = document.getElementById("console");
  runScript.innerHTML = "";
  let newScript = document.createElement("script");
  let myCode = myEditor.getEditor().getValue();
  myCode = myCode.replace(/document.write/g, "defaultLog");
  newScript.innerHTML = myCode;
  myQuestions.updateTemplate(myCode);
  runScript.appendChild(newScript);
};
console.log = (value) => {
  if (testcases[ind] === value) {
    count++;
    document.getElementById("test" + ind).className = "p-2 bd-highlight pass";
  } else {
    document.getElementById("test" + ind).className = "p-2 bd-highlight fail";
  }
  ind++;
  if (count === testcases.length) {
    $("#doneModal").modal("show");
  }
};
