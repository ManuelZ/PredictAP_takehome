import React, { useState } from "react";


const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="flex items-center border-b-2 border-indigo-500 py-2">
      <input
        type="text"
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-700 text-sm text-white py-1 px-2 rounded-full"
        type="button"
        onClick={() => {onSearch(searchTerm)}}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
