import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtime(tableName, onChange) {
  useEffect(() => {
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log(`Realtime ${tableName}:`, payload);
          if (onChange) onChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName]);
}