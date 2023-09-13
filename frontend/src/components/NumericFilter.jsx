import React from 'react';

const NumericFilter = ({ onChangeMin, onChangeMax, minValue, maxValue }) => {

  return (
    <div className="flex justify-center space-x-4">
      <div className="w-1/3">
        <label className="block text-gray-700 text-sm font-bold mb-2">Min Value:</label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Min bytes"
          value={minValue}
          onChange={(e) => onChangeMin(e.target.value)}
        />
      </div>
      <div className="w-1/3">
        <label className="block text-gray-700 text-sm font-bold mb-2">Max Value:</label>
        <input
          type="number"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Max bytes"
          value={maxValue}
          onChange={(e) => onChangeMax(e.target.value)}
        />
      </div>
      <div>
      </div>
    </div>
  );
};

export default NumericFilter;
