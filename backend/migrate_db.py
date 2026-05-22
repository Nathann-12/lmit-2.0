"""
Migrate all data from old MongoDB Atlas to new MongoDB Atlas.
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

OLD_URL = "mongodb+srv://lmit:lmit2026@lmit.zrjpmhb.mongodb.net/?appName=lmit"
NEW_URL = "mongodb+srv://lmit:lmit2026@cluster0.vgre76m.mongodb.net/?appName=Cluster0"
DB_NAME = "lmit"

COLLECTIONS = [
    "lab_info",
    "research_focus",
    "publications",
    "lab_members",
    "news",
    "youtube_videos",
    "counters",
]

async def migrate():
    old_client = AsyncIOMotorClient(OLD_URL)
    new_client = AsyncIOMotorClient(NEW_URL)
    
    old_db = old_client[DB_NAME]
    new_db = new_client[DB_NAME]
    
    print("Connected to both databases!\n")
    
    for col_name in COLLECTIONS:
        old_col = old_db[col_name]
        new_col = new_db[col_name]
        
        docs = await old_col.find({}).to_list(1000)
        
        if not docs:
            print(f"  {col_name}: empty (skipped)")
            continue
        
        # Clear new collection first
        await new_col.delete_many({})
        
        # Insert all docs
        await new_col.insert_many(docs)
        print(f"  {col_name}: copied {len(docs)} documents")
    
    print("\n Migration complete!")
    
    # Verify
    print("\n--- Verification ---")
    for col_name in COLLECTIONS:
        old_count = await old_db[col_name].count_documents({})
        new_count = await new_db[col_name].count_documents({})
        status = "✓" if old_count == new_count else "✗ MISMATCH"
        print(f"  {col_name}: old={old_count} new={new_count} {status}")
    
    old_client.close()
    new_client.close()

if __name__ == "__main__":
    asyncio.run(migrate())
