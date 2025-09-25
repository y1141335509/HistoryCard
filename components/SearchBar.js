function SearchBar({ onSearch }) {
  try {
    const [query, setQuery] = React.useState('');
    const [suggestions] = React.useState([
      'Ancient civilizations',
      'Space exploration',
      'Human biology',
      'Climate science',
      'Art history',
      'Programming concepts'
    ]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (query.trim()) {
        onSearch(query);
      }
    };

    const handleSuggestionClick = (suggestion) => {
      setQuery(suggestion);
      onSearch(suggestion);
    };

    return (
      <div className="max-w-2xl mx-auto" data-name="search-bar" data-file="components/SearchBar.js">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <div className="icon-search text-lg text-[var(--text-secondary)]"></div>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What would you like to learn about today?"
              className="input pl-10 pr-4 text-lg h-12"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <div className="btn btn-primary px-4 py-2">
                Generate Cards
              </div>
            </button>
          </div>
        </form>

        <div className="mt-4">
          <p className="text-sm text-[var(--text-secondary)] mb-3">Popular topics:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-white border border-[var(--border-color)] rounded-full hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('SearchBar component error:', error);
    return null;
  }
}