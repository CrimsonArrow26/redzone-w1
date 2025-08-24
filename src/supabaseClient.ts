import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shqfvfjsxtdeknqncjfa.supabase.co'; // <-- Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWZ2ZmpzeHRkZWtucW5jamZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDgzNzMsImV4cCI6MjA2ODQ4NDM3M30.enzNuGiPvfMZLUPLPeDPBlMsHBOP9foFOjbGjQhLsnc'; // <-- Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey); 