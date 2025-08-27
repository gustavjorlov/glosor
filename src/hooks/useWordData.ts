import { useState, useEffect, useCallback } from 'react';
import type { WeekData } from '../types';

export function useWordData() {
  const [weekData, setWeekData] = useState<WeekData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeekData = async (week: number): Promise<WeekData | null> => {
    try {
      const response = await fetch(`/data/vecka${week}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load week ${week} data`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Error loading week ${week}:`, err);
      return null;
    }
  };

  const loadAllWeeks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const loadedWeeks: WeekData[] = [];
    
    // Try to load weeks 1-50 (expanded range), but don't break on missing weeks
    for (let week = 1; week <= 50; week++) {
      const data = await loadWeekData(week);
      if (data) {
        loadedWeeks.push(data);
      }
    }
    
    // Sort by week number to ensure proper ordering
    loadedWeeks.sort((a, b) => a.week - b.week);
    
    setWeekData(loadedWeeks);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllWeeks();
  }, [loadAllWeeks]);

  const getWeekData = (week: number): WeekData | undefined => {
    return weekData.find(w => w.week === week);
  };

  const getAvailableWeeks = (): number[] => {
    return weekData.map(w => w.week);
  };

  return {
    weekData,
    loading,
    error,
    loadWeekData,
    getWeekData,
    getAvailableWeeks,
    refreshData: loadAllWeeks
  };
}