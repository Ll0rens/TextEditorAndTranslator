import React, { useRef } from "react";
import JoditEditor from "jodit-react";

const config = {
  buttons: ["bold", "italic", "link", "unlink", "underline", "source"],
};

const RichTextEditor = ({ initialValue}) => {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={initialValue}
      config={config}
      tabIndex={1}
    />
  );
};

export default RichTextEditor;
