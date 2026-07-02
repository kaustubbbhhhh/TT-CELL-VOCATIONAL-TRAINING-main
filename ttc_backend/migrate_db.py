import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

print("Connecting to local database...")
try:
    client_local = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    # Check if connected
    client_local.server_info() 
    db_local = client_local["ttcell_db"]
except Exception as e:
    print("\n[ERROR] Could not connect to your local MongoDB.")
    print("Please make sure your local MongoDB service is running!")
    exit(1)

print("Connecting to MongoDB Atlas (Cloud)...")
mongo_host = os.getenv("MONGO_HOST")
if not mongo_host:
    print("\n[ERROR] MONGO_HOST not found in .env file.")
    exit(1)

try:
    client_atlas = pymongo.MongoClient(mongo_host, serverSelectionTimeoutMS=5000)
    client_atlas.server_info()
    db_atlas = client_atlas.get_database() # Uses the DB defined in the connection string
except Exception as e:
    print(f"\n[ERROR] Could not connect to MongoDB Atlas: {e}")
    exit(1)

collections = db_local.list_collection_names()

if not collections:
    print("\nNo collections found in your local database 'ttcell_db'!")
    exit(0)

print(f"\nFound {len(collections)} collections in local DB. Starting data transfer...\n")

for coll_name in collections:
    local_coll = db_local[coll_name]
    atlas_coll = db_atlas[coll_name]
    
    docs = list(local_coll.find())
    if not docs:
        print(f"⏩ Local '{coll_name}' is empty. Skipping. (Cloud data not modified)")
        continue
    
    # Only clear the cloud collection if we actually have data to replace it with
    print(f"Clearing existing cloud collection: {coll_name}...")
    atlas_coll.delete_many({})
    
    atlas_coll.insert_many(docs)
    print(f"✅ Copied {len(docs)} documents into '{coll_name}'.")

print("\n🎉 Migration Complete! Safely transferred local data to cloud.")
