import React, { useState, FormEvent } from "react";
import style from "./searchBar.module.css";
import { SearchBarProps } from "./iNavbar";

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    apiEndpoint = "/api/search" // Default API endpoint
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!searchQuery.trim()) return;

        setIsLoading(true);

        try {
            // Send the search query to the backend
            const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(searchQuery.trim())}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Search request failed with status: ${response.status}`);
            }

            const data = await response.json();

            // Call the onSearch callback with both the query and results
            if (onSearch) {
                onSearch(searchQuery.trim(), data);
            }
        } catch (error) {
            console.error("Search error:", error);
            // You could add error handling here, such as displaying an error message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={style.search_bar}>
            <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search input"
                disabled={isLoading}
            />
            <button
                type="submit"
                title="Search"
                aria-label="Submit search"
                disabled={isLoading}
            >
                <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-magnifying-glass'}`}></i>
            </button>
        </form>
    );
};

export default SearchBar;
