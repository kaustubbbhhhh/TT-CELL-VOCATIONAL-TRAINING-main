import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient

sys.path.append(os.getcwd())
load_dotenv()
client = MongoClient(os.getenv('MONGODB_URI'))
db = client.get_database()
trainees = db.trainees.find()
for t in trainees:
    print(t)
