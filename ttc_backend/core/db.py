import os
from mongoengine import connect, disconnect_all
from django.conf import settings

def connect_db():
    """Establish MongoEngine connection if not already connected."""
    # Check if we are running in tests
    if getattr(settings, 'MONGO_DATABASE_NAME', None) is None:
        db_name = os.environ.get('MONGO_DB_NAME', 'ttcell_db')
        host = os.environ.get('MONGO_HOST', 'localhost')
        port = int(os.environ.get('MONGO_PORT', 27017))
        username = os.environ.get('MONGO_USERNAME', None)
        password = os.environ.get('MONGO_PASSWORD', None)
    else:
        db_name = settings.MONGO_DATABASE_NAME
        host = settings.MONGO_HOST
        port = settings.MONGO_PORT
        username = settings.MONGO_USERNAME
        password = settings.MONGO_PASSWORD

    connect_args = {
        'db': db_name,
        'host': host,
        'port': port,
    }
    if username and password:
        connect_args['username'] = username
        connect_args['password'] = password

    return connect(alias='default', **connect_args)

def disconnect_db():
    """Disconnect all MongoEngine connections."""
    disconnect_all()
