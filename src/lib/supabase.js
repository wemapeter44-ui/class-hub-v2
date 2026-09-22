import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jiqokcgmigxjtnfkyofh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcW9rY2dtaWd4anRuZmt5b2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODk2NzIsImV4cCI6MjEwNTY2NTY3Mn0.h1Ig5nMocCO1qlpkdRWZmR44_AR-YsoTqtHGGfPQy0Y';

export const supabase = createClient(supabaseUrl, supabaseKey);