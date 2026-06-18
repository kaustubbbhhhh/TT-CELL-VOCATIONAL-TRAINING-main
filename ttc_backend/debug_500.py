import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ttc_project.settings')
django.setup()

from apps.trainees.models import Trainee
from apps.authentication.models import User
from apps.authentication.services import AuthService
from django.test import Client
import traceback

Trainee.drop_collection()
t = Trainee(roll_number='TT24-001', full_name='T', email='t@t', domain='AI/ML', batch='b')
t.save()

User.drop_collection()
u = User(email='t@t', password_hash='hash', role='trainee', full_name='T', trainee_id='TT24-001')
u.save()

token, r = AuthService.issue_tokens(u)
c = Client()

try:
    c.raise_request_exception = False
    res = c.get('/api/v1/trainees/TT24-001/', HTTP_AUTHORIZATION='Bearer ' + token)
    if res.status_code == 500:
        print(res.content.decode('utf-8'))
except Exception as e:
    traceback.print_exc()
