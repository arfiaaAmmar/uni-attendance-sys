import { useState } from "react";
import Autosuggest from "react-autosuggest";

type SearchProps = {
  query: string;
  onChange: (newQuery: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
};

const SearchBox: React.FC<SearchProps> = ({
  query,
  onChange,
  suggestions,
  placeholder,
  className,
}) => {
  const [suggestionsState, setSuggestionsState] = useState(suggestions);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const inputValue = value.trim().toLowerCase();
    const filteredSuggestions = suggestions?.filter((suggestion) =>
      suggestion.toLowerCase().includes(inputValue)
    );

    if (filteredSuggestions) setSuggestionsState(filteredSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestionsState([]);
  };

  const inputProps = {
    placeholder: placeholder || "Search ...",
    value: query,
    onChange: (_: any, { newValue }: { newValue: string }) =>
      onChange(newValue),
  };

  return (
    <Autosuggest
      suggestions={suggestionsState}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion) => suggestion}
      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
      inputProps={inputProps}
    />
  );
};

export default SearchBox;
