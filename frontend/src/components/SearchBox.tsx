import React from 'react'

type SearchProps = {
  query: string;
  onChange: (newQuery: string) => void;
  placeholder?: string;
  className?: string;
};

const SearchBox: React.FC<SearchProps> = ({ query, onChange, placeholder, className }) => {
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => onChange(e.target.value)}
      className={`border-2 border-neutral-400 rounded-md px-4 py-1 ${className}`}
      placeholder={placeholder ? placeholder : "Search ..."}
    />
  );
};

export default SearchBox;