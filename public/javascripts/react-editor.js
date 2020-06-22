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
    value: "function myScript(){return 100;}\n",
    mode: "javascript",
    lineNumbers: true,
  });
  editorState.setEditor(editor);
});

const runningjavascript = ((d) => (code) => {
  const script = d.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  console.log("code::", code);
  script.innerText = code;
})(document);

const runJs = () => {
  const editor = editorState.getEditor();
  runningjavascript(editor.getValue());
};
