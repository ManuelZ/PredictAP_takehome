import React, { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { PiClipboard } from "react-icons/pi";

const IconButton = ({ onClick, label }) => {
  return (
    <button
      className="bg-blue-300 hover:bg-blue-400 text-white font-normal text-sm py-2 px-2 mr-2 rounded-full"
      onClick={onClick}
    >
      <PiClipboard className="" size={18} />
      <span className="align-middle">{label}</span>
    </button>
  );
};

const File = ({ details, handler }) => {
  const [copy, setCopy] = useCopyToClipboard();
  const { path, filename, filesize, filetype } = details;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-64 ml-4 mb-4 lg:mb-8 lg:m-8">
      <div className="flex flex-row items-center">
        <IconButton
          onClick={() => {
            setCopy(path);
          }}
          label={""}
        />
        <h2 className="text-xl font-normal lg:font-normal mb-2">{filename}</h2>
      </div>
      <div className="text-gray-600">
        <p>
          <span className="font-medium">Size:</span> {filesize}
        </p>
        <p>
          <span className="font-medium">Content Type:</span> {filetype}
        </p>
      </div>
    </div>
  );
};

export default File;
