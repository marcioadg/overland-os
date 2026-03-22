import { useState, useCallback } from 'react';
import { searchAllCampsites, MOCK_BLM_SPOTS } from '../lib/api';
import type { Campsite } from '../lib/api';

export type FilterType = 'All' | 'Free' | 'BLM' | 'NFS' | 'Has Water' | 'Dispersed';

export function useCampsites() {
  const [results, setResults] = useState<Campsite[]>(MOCK_BLM_SPOTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [query, setQuery] = useState('');

  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setLoading(true);
    setError(null);
    try {
      const data = await searchAllCampsites(searchQuery);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch campsites. Check your connection.');
      setResults(MOCK_BLM_SPOTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = useCallback((): Campsite[] => {
    switch (activeFilter) {
      case 'Free':
        return results.filter((c) => c.isFree);
      case 'BLM':
        return results.filter((c) => c.type === 'BLM');
      case 'NFS':
        return results.filter((c) => c.type === 'NFS');
      case 'Has Water':
        return results.filter((c) => c.hasWater);
      case 'Dispersed':
        return results.filter((c) => c.isDispersed);
      default:
        return results;
    }
  }, [results, activeFilter]);

  return {
    results: filtered(),
    allResults: results,
    loading,
    error,
    query,
    activeFilter,
    setActiveFilter,
    search,
  };
}
