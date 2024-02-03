import { queryStudents } from "@api/student-api";
import { useState } from "react";
import Autosuggest from "react-autosuggest";

type SearchProps = {
  query: string;
  onChange: (newQuery: string) => void;
  placeholder?: string;
};

const SearchBox: React.FC<SearchProps> = ({ query, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query: string) => {
    try {
      const data = await queryStudents(query);
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
    const inputValue = value.trim().toLowerCase();
    if (inputValue.length > 0) {
      await fetchSuggestions(inputValue);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: placeholder || "Search ...",
    value: query,
    onChange: (_: any, { newValue }: { newValue: string }) =>
      onChange(newValue),
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
      inputProps={inputProps}
    />
  );
};

export default SearchBox;
