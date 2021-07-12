import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Editor() {
  const _onChange = (e, editor) => {
    console.log("event", editor);

    window.ee = editor;
  };

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        config={{
          // plugins: [ Paragraph, Bold, Italic, Essentials ],
          toolbar: [],
        }}
        onChange={_onChange}
      />
    </div>
  );
}

export default Editor;
