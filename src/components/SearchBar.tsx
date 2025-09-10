import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md p-2 w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className="flex-grow bg-transparent outline-none px-4 text-gray-900 dark:text-white placeholder-gray-500"
      />
      <button type="submit" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition">
        <FiSearch size={20} />
      </button>
    </form>
  );
};

export default SearchBar;