import React, { useState, useEffect } from "react";
import File from "../components/File";
import Filter from "../components/Filter";
import SearchBar from "../components/SearchBar";
import config from "../config";
import NumericFilter from "../components/NumericFilter";
import isNumber from "lodash/isNumber";
import isNaN from "lodash/isNaN";


const MAX_PAGE_ELEMENTS = 10;
const MAX_BYTES = 1e9;


const Visualizer = () => {
  const [files, setFiles] = useState([]);
  const [limit, setLimit] = useState(MAX_PAGE_ELEMENTS);
  const [offset, setOffset] = useState(0);
  const [doSearch, setDoSearch] = useState(false);
  /* Hard-coded filetypes, better would be to receive a list from the backend */
  const [filetypeFilter, setFiletypeFilter] = useState({
    pdf: true,
    jpg: true,
    json: true,
  });
  const [searchName, setSearchName] = useState(undefined);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(MAX_BYTES);


  useEffect(() => {
    if (doSearch == true) {
      let url =
        `${config.ENDPOINT}/list_files?` +
        new URLSearchParams({
          offset: offset,
          limit: limit,
          lower_filesize_limit:
            isNumber(minValue) & !isNaN(minValue) ? minValue : 0,
          upper_filesize_limit:
            isNumber(maxValue) & !isNaN(maxValue) ? maxValue : MAX_BYTES,
          filetypes: Object.keys(filetypeFilter)
            .filter((key) => filetypeFilter[key])
            .join(","),
          filename: searchName,
        });

      fetch(url, { method: "POST" })
        .then((response) => response.json())
        .then((content) => {
          if ("error" in content) {
            console.log(content);
          } else {
            console.log(`Received ${content.data.length} files.`);
            setFiles(content.data);
          }
          setDoSearch(false);
        });
    }
  }, [offset, limit, doSearch]);


  /***************************************************************************
   START: Pagination
  ****************************************************************************/

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const showPrevious = () => {
    let newOffset = clamp(offset - MAX_PAGE_ELEMENTS, 0, Infinity);
    let newLimit = clamp(
      limit - MAX_PAGE_ELEMENTS,
      MAX_PAGE_ELEMENTS,
      Infinity
    );
    console.log(`newOffset: ${newOffset}`);
    console.log(`newLimit: ${newLimit}`);
    setOffset(newOffset);
    setLimit(newLimit);
    setDoSearch(true);
  };

  const showNext = () => {
    let newOffset = clamp(limit, 0, Infinity);
    let newLimit = clamp(
      limit + MAX_PAGE_ELEMENTS,
      MAX_PAGE_ELEMENTS,
      Infinity
    );
    console.log(`newOffset: ${newOffset}`);
    console.log(`newLimit: ${newLimit}`);
    setOffset(newOffset);
    setLimit(newLimit);
    setDoSearch(true);
  };

  /***************************************************************************
   END: Pagination
  ****************************************************************************/


  /***************************************************************************
   START: Filtering Component
  ****************************************************************************/

  /* Hard-coded filetypes, better would be to receive a list from the backend */
  let filterClasses = [
    {
      id: "jpg",
      label: "JPG",
      active: filetypeFilter.jpg,
    },
    {
      id: "pdf",
      label: "PDF",
      active: filetypeFilter.pdf,
    },
    {
      id: "json",
      label: "JSON",
      active: filetypeFilter.json,
    },
  ];

  const toggleFilter = (filterId) => {
    setFiletypeFilter((prevFilter) => {
      let newFilter = { ...prevFilter };
      newFilter[filterId] = !prevFilter[filterId];
      return newFilter;
    });
  };

  const onSearch = (searchTerm) => {
    setSearchName(searchTerm);
    setLimit(MAX_PAGE_ELEMENTS);
    setOffset(0);
    setDoSearch(true);
  };

  const onChangeMin = (value) => {
    if (!isNumber(parseInt(value)) || isNaN(parseInt(value))) {
      setMinValue(0);
    } else {
      setMinValue(clamp(parseInt(value), 0, MAX_BYTES));
    }
  };

  const onChangeMax = (value) => {
    if (!isNumber(parseInt(value)) || isNaN(parseInt(value))) {
      setMaxValue(MAX_BYTES);
    } else {
      setMaxValue(clamp(parseInt(value), 0, MAX_BYTES));
    }
  };

  /***************************************************************************
   END: Filtering component
  ****************************************************************************/

  let content = files.map((file, index) => (
    <File key={file.path} details={file} />
  ));

  return (
    <>
      <div className="uppercase text-gray-500 font-bold text-center">
        Filtering
      </div>
      <Filter filetypes={filterClasses} onToggleFilter={toggleFilter} />
      <NumericFilter
        onChangeMin={onChangeMin}
        onChangeMax={onChangeMax}
        minValue={minValue}
        maxValue={maxValue}
      />
      <SearchBar onSearch={onSearch} />

      <div className="flex flex-wrap justify-center lg:justify-start m-1 lg:m-3 p-0 lg:p-4">
        {content}
      </div>
      <ul className="flex space-x-4 justify-center mt-4">
        <li>
          <button
            onClick={showPrevious}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-300 ease-in-out focus:outline-none"
          >
            Previous {MAX_PAGE_ELEMENTS}
          </button>
        </li>
        <li>
          <button
            onClick={showNext}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-300 ease-in-out focus:outline-none"
          >
            Next {MAX_PAGE_ELEMENTS}
          </button>
        </li>
      </ul>
    </>
  );
};

export default Visualizer;
