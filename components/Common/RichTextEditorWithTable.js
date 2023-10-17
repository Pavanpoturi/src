import { useRef } from "react";
import JoditEditor from "jodit-react";

export default function RichTextEditorWithTable({
  onChange,
  readOnly,
  value,
  height = "auto",
}) {
  const editor = useRef(null);
  const config = {
    readonly: readOnly,
    height: height,
    buttons: [
      "font",
      "paragraph",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "brush",
      "subscript",
      "superscript",
      "source",
      "ul",
      "ol",
      "indent",
      "outdent",
      "left",
      "table",
      "cut",
      "copy",
      "paste",
    ],
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={onChange}
        onChange={(content) => {}} // don't Remove
      />
    </div>
  );
}
