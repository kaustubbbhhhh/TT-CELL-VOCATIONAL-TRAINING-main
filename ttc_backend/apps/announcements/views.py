from rest_framework.views import APIView
from rest_framework import status
from core.responses import success_response, error_response
from core.permissions import IsAuthenticatedUser, IsAdminUser
from apps.announcements.models import Announcement
from apps.announcements.serializers import AnnouncementSerializer
from apps.authentication.models import AuditLog, User
from apps.trainees.models import Trainee
from core.exceptions import ValidationError, NotFoundError, Forbidden

class AnnouncementListCreateView(APIView):
    """View to list announcements (filtered by role targeting) and create announcements."""
    permission_classes = [IsAuthenticatedUser]

    def get(self, request):
        query_filters = {'is_active': True}
        
        # If user is a Trainee, filter out drafts and restrict to targeted audience
        if request.user.role == 'trainee':
            query_filters['is_draft'] = False
            
            # Fetch trainee domain to check targeted audience
            trainee_domain = None
            if request.user.trainee_id:
                try:
                    trainee = Trainee.objects.get(id=request.user.trainee_id)
                    trainee_domain = trainee.domain
                except:
                    pass
            
            # Match audience: 'All Batches', or specific domain name, or matching sub-string
            # We can retrieve all announcements and filter programmatically, or do a Mongo Q check.
            from mongoengine import Q
            audience_q = Q(target_audience__iexact='All Batches')
            if trainee_domain:
                audience_q |= Q(target_audience__icontains=trainee_domain)
                
            queryset = Announcement.objects(**query_filters).filter(audience_q).order_by('-created_at')
        else:
            # Admins can see everything (including drafts)
            queryset = Announcement.objects(**query_filters).order_by('-created_at')

        serializer = AnnouncementSerializer(queryset, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        # Only admins can create announcements
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        serializer = AnnouncementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        announcement = Announcement(
            title=serializer.validated_data['title'],
            body=serializer.validated_data['body'],
            priority=serializer.validated_data.get('priority', 'normal'),
            target_audience=serializer.validated_data.get('target_audience', 'All Batches'),
            is_draft=serializer.validated_data.get('is_draft', False),
            created_by=request.user.id
        )
        announcement.save()

        # Audit Log
        AuditLog(
            actor_id=request.user.id,
            action="CREATE_ANNOUNCEMENT",
            target_type="Announcement",
            target_id=str(announcement.id),
            after_state=serializer.validated_data
        ).save()

        output_data = AnnouncementSerializer(announcement).data
        return success_response(
            data=output_data,
            message="Announcement created successfully.",
            status_code=status.HTTP_201_CREATED
        )

class AnnouncementDetailView(APIView):
    """View to retrieve, update, or soft-delete announcements."""
    permission_classes = [IsAuthenticatedUser]

    def get_object(self, pk):
        try:
            return Announcement.objects.get(id=pk, is_active=True)
        except:
            raise NotFoundError("Announcement not found.")

    def get(self, request, pk):
        announcement = self.get_object(pk)
        
        # Trainees cannot view draft announcements
        if request.user.role == 'trainee' and announcement.is_draft:
            raise Forbidden("You are not authorized to view this draft announcement.")
            
        serializer = AnnouncementSerializer(announcement)
        return success_response(data=serializer.data)

    def put(self, request, pk):
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        announcement = self.get_object(pk)
        serializer = AnnouncementSerializer(data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)

        before_state = {
            "title": announcement.title,
            "body": announcement.body,
            "priority": announcement.priority,
            "target_audience": announcement.target_audience,
            "is_draft": announcement.is_draft
        }

        announcement.title = serializer.validated_data['title']
        announcement.body = serializer.validated_data['body']
        announcement.priority = serializer.validated_data.get('priority', announcement.priority)
        announcement.target_audience = serializer.validated_data.get('target_audience', announcement.target_audience)
        announcement.is_draft = serializer.validated_data.get('is_draft', announcement.is_draft)
        announcement.save()

        # Audit Log
        AuditLog(
            actor_id=request.user.id,
            action="UPDATE_ANNOUNCEMENT",
            target_type="Announcement",
            target_id=str(announcement.id),
            before_state=before_state,
            after_state=serializer.validated_data
        ).save()

        return success_response(data=AnnouncementSerializer(announcement).data, message="Announcement updated successfully.")

    def delete(self, request, pk):
        self.permission_classes = [IsAdminUser]
        self.check_permissions(request)

        announcement = self.get_object(pk)
        announcement.soft_delete()

        # Audit Log
        AuditLog(
            actor_id=request.user.id,
            action="DELETE_ANNOUNCEMENT",
            target_type="Announcement",
            target_id=str(announcement.id)
        ).save()

        return success_response(message="Announcement soft-deleted successfully.")
