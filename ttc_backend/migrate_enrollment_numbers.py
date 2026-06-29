import os
import sys
import re
from dotenv import load_dotenv
from mongoengine import connect

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ttc_project.settings')
import django
django.setup()

from apps.trainees.models import Trainee

try:
    print('Starting migration of roll_number to enrollment_number...')
    count = 0
    for t in Trainee.objects:
        if t.enrollment_number is None:
            # Extract trailing digits from roll_number
            match = re.search(r'(\d+)$', t.roll_number)
            if match:
                enrollment_val = int(match.group(1))
                t.enrollment_number = enrollment_val
                t.save(validate=False)
                print(f"Updated Trainee {t.roll_number} -> enrollment_number: {enrollment_val}")
                count += 1
            else:
                print(f"Skipped Trainee {t.roll_number} (no trailing digits found)")
    print(f'Successfully updated {count} trainees.')
except Exception as e:
    print(f'Error updating trainees: {e}')
