import React, { useState, useRef } from "react";
import Button from "../components/Button";
import config from "../config";

const Indexer = () => {
  const [totalFiles, setTotalFiles] = useState(undefined);
  const [indexing, setIndexing] = useState(false);

  const buttonRef = useRef(null);

  const createindex = () => {
    if (buttonRef.current) {
      buttonRef.current.setAttribute("disabled", "disabled");
    }

    setIndexing(true);

    fetch(`${config.ENDPOINT}/create_index`, { method: "POST" })
      .then((response) => response.json())
      .then((content) => {
        setIndexing(false);
        setTotalFiles(content.total_files);
        if (buttonRef.current) {
          buttonRef.current.removeAttribute("disabled");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        onClick={createindex}
        disabled={indexing}
        buttonRef={buttonRef}
        text="Start indexing"
      />
    
      {totalFiles ? `Total indexed files: ${totalFiles}` : ""}
    </div>
  );
};

export default Indexer;
