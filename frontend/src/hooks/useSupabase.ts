import { useMemo } from 'react';
import { supabase } from '../api/supabaseClient';

function useSupabase() {
  return useMemo(() => supabase, []);
}

export default useSupabase;