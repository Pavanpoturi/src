import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
  ],
};

const RichTextEditor = ({ onChange, readOnly, value, height }) => {
  return (
    <ReactQuill
      modules={modules}
      theme="snow"
      onChange={onChange}
      readOnly={readOnly}
      value={value}
      style={{ height: height }}
    />
  );
};

export default RichTextEditor;
