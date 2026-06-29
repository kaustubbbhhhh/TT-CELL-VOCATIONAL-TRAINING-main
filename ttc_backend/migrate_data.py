import os
import django
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ttc_project.settings')
django.setup()

client = MongoClient(os.getenv('MONGO_HOST'))
db = client[os.getenv('MONGO_DB_NAME', 'ttcell_db')]

trainees_col = db.trainees
batches_col = db.batches

print("Starting data migration...")

# Get unique batches from existing trainees
# We might need to check if 'batch' key exists because we changed the field name
distinct_batches = trainees_col.distinct('batch')
print(f"Found distinct batches: {distinct_batches}")

for b_name in distinct_batches:
    if not b_name:
        continue
    # Extract year if possible, default to 2024
    year = 2024
    if "2024" in b_name:
        year = 2024
    elif "2025" in b_name:
        year = 2025
    
    # Create batch if it doesn't exist
    if not batches_col.find_one({"_id": b_name}):
        batches_col.insert_one({
            "_id": b_name,
            "batch_year": year,
            "batch_status": "active"
        })
        print(f"Created batch {b_name}")

# Now migrate trainees
trainees = trainees_col.find({})
count = 0
for t in trainees:
    updates = {}
    unsets = {}
    
    # Rename batch to batch_id
    if 'batch' in t:
        updates['batch_id'] = t['batch']
        unsets['batch'] = ""
    
    # Split full_name
    if 'full_name' in t and 'first_name' not in t:
        parts = t['full_name'].strip().split(' ', 1)
        updates['first_name'] = parts[0]
        if len(parts) > 1:
            updates['last_name'] = parts[1]
        else:
            updates['last_name'] = ""
        # Don't unset full_name if we want to be safe, but mongoengine will ignore it. Let's unset it.
        unsets['full_name'] = ""
        
    # Add section if missing
    if 'section' not in t:
        updates['section'] = 'A'
        
    if updates or unsets:
        update_op = {}
        if updates:
            update_op['$set'] = updates
        if unsets:
            update_op['$unset'] = unsets
            
        trainees_col.update_one({"_id": t["_id"]}, update_op)
        count += 1

print(f"Migrated {count} trainees successfully.")
