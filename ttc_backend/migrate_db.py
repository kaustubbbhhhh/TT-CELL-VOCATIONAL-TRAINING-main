import pymongo
import os

print("Connecting to local database...")
try:
    client_local = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    # Check if connected
    client_local.server_info() 
    db_local = client_local["ttcell_db"]
except Exception as e:
    print("\n[ERROR] Could not connect to your local MongoDB.")
    print("Please make sure your local MongoDB service is running (jaise humne pehle start kiya tha)!")
    exit(1)

print("Connecting to MongoDB Atlas (Cloud)...")
try:
    client_atlas = pymongo.MongoClient("mongodb+srv://kaustubhraj2005_db_user:Kaustubh%4008@cluster0.pco0kkx.mongodb.net/")
    db_atlas = client_atlas["ttcell_db"]
except Exception as e:
    print("\n[ERROR] Could not connect to MongoDB Atlas. Check your internet connection.")
    exit(1)

collections = db_local.list_collection_names()

if not collections:
    print("\nNo data found in your local database 'ttcell_db'!")
    exit(0)

print(f"\nFound {len(collections)} collections in local DB. Starting data transfer...\n")

for coll_name in collections:
    local_coll = db_local[coll_name]
    atlas_coll = db_atlas[coll_name]
    
    # Pehle cloud wali existing collection ko clear karte hain
    atlas_coll.delete_many({})
    
    docs = list(local_coll.find())
    if docs:
        atlas_coll.insert_many(docs)
        print(f"✅ Copied {len(docs)} documents into '{coll_name}'.")
    else:
        print(f"⏩ '{coll_name}' is empty. Skipped.")

print("\n🎉 Migration Complete! Aapka saara purana local data ab cloud pe aa gaya hai.")
