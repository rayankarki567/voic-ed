# Database Seeding Scripts

This folder contains scripts to populate your Supabase database with sample data for testing the petitions functionality.

## Files

- `seed-petitions.js` - Node.js script to seed the database via Supabase client
- `seed-petitions.sql` - SQL script to run directly in Supabase SQL editor

## What Gets Seeded

### Profiles (5 users)
- Alex Johnson (Computer Science, Year 2)
- Sarah Davis (Business Administration, Year 3)  
- Michael Chen (Engineering, Year 4)
- Emma Wilson (Psychology, Year 2)
- David Kumar (Management, Year 1)

### Petitions (5 petitions)
1. **Improve Campus WiFi Infrastructure** (Active, 234/500 signatures)
2. **Extended Library Hours** (Active, 187/300 signatures)
3. **Better Food Options in Cafeteria** (Completed, 312/250 signatures)
4. **Mental Health Support Services** (Active, 156/400 signatures)
5. **Improved Parking Facilities** (Active, 89/200 signatures)

### Signatures (978 total)
- Randomly distributed across the 5 petitions
- Random dates within the last 30 days

## Running the Scripts

### Option 1: Node.js Script (Recommended)

1. Make sure your `.env.local` file has these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the seeding script:
   ```bash
   npm run seed:petitions
   ```

3. The script will:
   - Insert user profiles
   - Insert petitions
   - Generate and insert signatures
   - Show a summary of inserted data

### Option 2: SQL Script

1. Copy the contents of `seed-petitions.sql`
2. Go to your Supabase dashboard
3. Navigate to the SQL editor
4. Paste and run the script
5. Check the output for verification

## Environment Variables Required

For the Node.js script to work, you need:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (not the anon key)

You can find these in your Supabase dashboard under Settings > API.

## Troubleshooting

### Common Issues

1. **Missing environment variables**
   - Make sure your `.env.local` file exists and has the correct variables
   - Check that the variable names match exactly

2. **Permission errors**
   - Make sure you're using the service role key, not the anon key
   - Check your RLS policies if they're blocking inserts

3. **Unique constraint violations**
   - The script uses `upsert` operations to handle existing data
   - If you see conflicts, the script will update existing records

### Verifying the Data

After running the script, check your Supabase dashboard:

1. Go to Table Editor
2. Check the `profiles`, `petitions`, and `signatures` tables
3. You should see the sample data inserted

Or run this query in the SQL editor:
```sql
SELECT 
    p.title,
    p.status,
    p.goal,
    COUNT(s.id) as signatures
FROM petitions p
LEFT JOIN signatures s ON p.id = s.petition_id
GROUP BY p.id, p.title, p.status, p.goal;
```

## Clean Up

To remove all seeded data, run:
```sql
DELETE FROM signatures WHERE petition_id LIKE 'petition%';
DELETE FROM petitions WHERE id LIKE 'petition%';
DELETE FROM profiles WHERE id LIKE 'user%';
```
