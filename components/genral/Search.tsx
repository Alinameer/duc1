"use client";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchDocuments } from '@/api/api';

interface SearchResult {
  id: string;
  title: string;
  content: string;
}

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery<SearchResult[]>({
    queryKey: ['search', debouncedSearchTerm],
    queryFn: () => searchDocuments(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    staleTime: 1000 * 60 * 5, 
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading && (
          <div className="absolute right-3 top-3">
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>

      {isError && <div className="mt-2 text-red-500">Error loading results</div>}

      {data && Array.isArray(data) && (
  <div className="mt-4 space-y-2">
    {data.length === 0 ? (
      <div className="text-gray-500">No results found</div>
    ) : (
      data.map((result: SearchResult) => (
        <div
          key={result.id}
          className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-medium text-lg">{result.title}</h3>
          <p className="text-gray-600">{result.content}</p>
        </div>
      ))
    )}
  </div>
)}

    </div>
  );
};

export default SearchComponent;
