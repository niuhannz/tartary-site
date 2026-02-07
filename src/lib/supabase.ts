'use client';

import { createClient } from '@supabase/supabase-js';

// Public anon key — safe for client-side use (RLS policies protect data)
const supabaseUrl = 'https://ehzlxilsdpvguqripcxv.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoemx4aWxzZHB2Z3VxcmlwY3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjIzNjEsImV4cCI6MjA4NTk5ODM2MX0.ucVqXup51eLNvAFbg5LyzV9F9Yz6JDxI0jjap4WfHYc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
