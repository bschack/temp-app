import { querySearch } from "@/lib/finnhub/queries";
import { SearchResponse } from "@/lib/finnhub/schema";
import { useEffect, useState } from "react";

import styles from './index.module.css';
import { Spinner } from "@/lib/icons/spinner/Spinner";

const SearchResults = ({ results }: { results: SearchResponse }) => {
  return (
    <div className={styles.search_results}>
      {results.result.map((result, index) => (
        <div key={index}>
          <h3>{result.displaySymbol}</h3>
          <p>{result.description}</p>
        </div>
      ))}
    </div>
  );
}

export const CompanySearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResponse>({ count: 0, result: [] });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchSearchResults = async () => {
        try {
          if (!searchTerm) {
            setSearchResults({ count: 0, result: [] });
            return;
          }
          else if (searchTerm.length < 2) return;
          setLoading(true);
          const res = await querySearch(searchTerm);
          setLoading(false);
          setSearchResults(res);
        } catch (error: any) {
          console.log(error.message);
        }
      }

      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn); 

  }, [searchTerm]);

  return (
    <div className={styles.search}>
      <div className={styles.input_group}>
        <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
        {loading && <Spinner />}
      </div>
      {searchResults.count > 0 && <SearchResults results={searchResults} />}
    </div>
  );
}