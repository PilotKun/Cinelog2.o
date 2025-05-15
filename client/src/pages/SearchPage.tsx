import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast"; // For user feedback

// Define a type for TMDB search results (simplified)
interface TmdbResult {
  id: number;
  title?: string; // Movies have title
  name?: string; // TV shows have name
  overview: string;
  poster_path: string | null;
  release_date?: string; // Movies
  first_air_date?: string; // TV
  vote_average?: number;
}

interface TmdbApiResponse {
  page: number;
  results: TmdbResult[];
  total_pages: number;
  total_results: number;
}

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');
  const [results, setResults] = useState<TmdbResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a search term.');
      setResults([]);
      return;
    }
    setError(null);
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchTerm.trim())}&type=${searchType}`);
      const data: TmdbApiResponse | { message: string } = await response.json();

      if (!response.ok) {
        throw new Error((data as { message: string }).message || 'Failed to fetch search results.');
      }
      setResults((data as TmdbApiResponse).results || []);
      if (((data as TmdbApiResponse).results || []).length === 0) {
        // toast({ title: "No Results", description: "Your search didn't return any results." });
        setError("No results found for your search.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Search error:', errorMessage);
      setError(errorMessage);
      // toast({ variant: "destructive", title: "Search Failed", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Debounce search term input to avoid excessive API calls

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Search Movies & TV Shows</h1>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          type="text"
          placeholder="e.g., Inception, Breaking Bad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
          disabled={isLoading}
        />
        <Select value={searchType} onValueChange={(value: 'movie' | 'tv') => setSearchType(value)} disabled={isLoading}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="movie">Movies</SelectItem>
            <SelectItem value="tv">TV Shows</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && <p className="text-destructive text-center">{error}</p>}

      {/* Results Display Area */} 
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
          {results.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-lg shadow-lg flex flex-col">
              {item.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="rounded-md mb-4 w-full h-auto aspect-[2/3] object-cover"
                />
              ) : (
                <div className="rounded-md mb-4 w-full h-auto aspect-[2/3] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">No Image</p>
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1 truncate">{item.title || item.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {searchType === 'movie' ? item.release_date?.substring(0,4) : item.first_air_date?.substring(0,4)}
              </p>
              <p className="text-sm text-muted-foreground_ mb-3_ overflow-hidden text-ellipsis_ h-10_ leading-5_ line-clamp-2">
                {item.overview || 'No overview available.'}
              </p>
              {/* TODO: Add to List Button - This will be the Quick Add Feature */}
              <Button variant="outline" size="sm" className="mt-auto w-full">
                 Add to List (Not Implemented)
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 