const editorState = (() => {
  let editor;
  const setEditor = (obj) => {
    editor = obj;
  };
  const getEditor = () => editor;

  return { setEditor, getEditor };
})();

$(document).ready(function () {
  const editor = CodeMirror.fromTextArea($(".codemirror-textarea")[0], {
    lineNumbers: true,
    mode: "javascript",
  });

  editorState.setEditor(editor);
});

const runnning = () => {
  const editor = editorState.getEditor();
  const runScript = document.getElementById("runScript");

  runScript.innerHTML = "";

  const scriptTag = document.createElement("script");
  // scriptTag.setAttribute("type", "text/babel");
  scriptTag.innerHTML = editor.getValue();
  runScript.appendChild(scriptTag);
};
