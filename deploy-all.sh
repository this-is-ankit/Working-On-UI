#!/bin/bash

SUPABASE="/c/Users/adijh/scoop/apps/supabase/current/supabase.exe"

for dir in supabase/functions/*; do
  if [ -d "$dir" ]; then
    fname=$(basename "$dir")
    echo "🚀 Deploying function: $fname"
    "$SUPABASE" functions deploy "$fname"
  fi
done
