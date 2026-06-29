import os
import sys
from dotenv import load_dotenv
from mongoengine import connect

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ttc_project.settings')
import django
django.setup()

from apps.trainees.models import Trainee

try:
    print('Total Trainees:', Trainee.objects.count())
    for t in Trainee.objects:
        try:
            print(f'Roll: {t.roll_number}, First: {t.first_name}, Last: {t.last_name}')
        except Exception as e:
            print(f'Error reading Trainee: {e}')
except Exception as e:
    print(f'Error counting trainees: {e}')
