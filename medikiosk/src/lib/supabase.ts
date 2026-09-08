import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://mvfubhhqgomlqzbttxph.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12ZnViaGhxZ29tbHF6YnR0eHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4MzQ4NDgsImV4cCI6MjEwNDQxMDg0OH0.uRr4DEDUt7m39vpEV_zhcDMZpi4ovVsgZQGddh6lFs8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
