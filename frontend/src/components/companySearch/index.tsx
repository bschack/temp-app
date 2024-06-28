
import { useEffect, useState } from "react";

import { Spinner } from "@/lib/icons/spinner/Spinner";
import { querySearch } from "@/lib/rapid/search";
import { SearchData } from "@/lib/rapid/schema";

import styles from './index.module.css';

type SearchProps = {
  onSelect: (symbol: string) => void;
}

type SearchResultsProps = SearchProps & {
  results: SearchData[]
}

const SearchResults = ({ results, onSelect }: SearchResultsProps) => {
  return (
    <div className={styles.search_results}>
      {results.map((result, index) => (
        <div key={index} onClick={() => {onSelect(result.symbol)}}>
          <h3>{result.symbol}</h3>
          <p>{result.instrument_name}</p>
          <p>{result.exchange}</p>
        </div>
      ))}
    </div>
  );
}

export const CompanySearch = ({ onSelect }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          if (!searchTerm) {
            setSearchResults([]);
            return;
          }
          else if (searchTerm.length < 2) return;
          setLoading(true);
          const res = await querySearch(searchTerm);
          setLoading(false);
          setSearchResults(res ? res : []);
        } catch (error: any) {
          console.log(error.message);
        }
      }

      fetchSearchResults();
    }, 1000);

    return () => clearTimeout(delayDebounceFn); 

  }, [searchTerm]);

  return (
    <div className={styles.search}>
      <div className={styles.input_group}>
        <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
        {loading && <Spinner />}
      </div>
      {searchResults.length > 0 && <SearchResults results={searchResults} onSelect={onSelect} />}
    </div>
  );
}