import os
import sys

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.abspath('.'))

from mongoengine import connect
from django.conf import settings
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ttc_project.settings')
django.setup()

from apps.projects.models import Project
from apps.authentication.models import PortalSettings
from apps.trainees.models import Batch

def migrate():
    print("Connecting to DB...")
    # Assuming the default connection is already established by django.setup() through MongoEngine
    
    settings = PortalSettings.objects.first()
    if not settings or not settings.batch_identifier:
        print("No active batch identifier found in PortalSettings. Defaulting to B_01.")
        active_batch_id = "B_01"
    else:
        active_batch_id = settings.batch_identifier
        
    try:
        batch_obj = Batch.objects.get(batch_id=active_batch_id)
    except Batch.DoesNotExist:
        print(f"Batch {active_batch_id} does not exist. Please create it first.")
        return

    projects = Project.objects()
    updated = 0
    for p in projects:
        if not hasattr(p, 'batch_id') or p.batch_id is None:
            p.batch_id = batch_obj
            p.save()
            updated += 1
            print(f"Updated project {p.project_code} with batch_id={active_batch_id}")
            
    print(f"Migration completed. {updated} projects updated.")

if __name__ == "__main__":
    migrate()
