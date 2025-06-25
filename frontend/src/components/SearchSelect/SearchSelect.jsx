import React, { useState, useEffect, useRef } from "react";
import "./SearchSelect.css";

const SearchSelect = ({
  name,
  options,
  value,
  onChange,
  placeholder = "",
  className = "",
  getCompareKey,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (option) =>
          typeof option.label === "string" &&
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log(options);
    const selected = options.find(
      (opt) => (opt.value) === value
    );
    if (selected) {
      setSearchTerm(selected.label);
    }
  }, [value, options, getCompareKey]);

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  return (
    <div className="searchSelect" ref={containerRef}>
      <input
        type="text"
        ref={inputRef}
        value={searchTerm || ""}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        name={name}
        autoComplete="off"
      />
      {isOpen && (
        <ul className="optionsList">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={(option.value)}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="noOptions">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchSelect;
