import datetime
from rest_framework.views import APIView
from rest_framework import status
from core.responses import success_response, error_response
from core.permissions import IsAuthenticatedUser, IsAdminUser
from core.exceptions import ValidationError, NotFoundError, Forbidden
from apps.trainees.models import Trainee, Batch, DOMAINS
from apps.projects.models import Project, ProjectAssignment
from apps.attendance.models import AttendanceRecord
from apps.attendance.services import AttendanceService
from apps.authentication.models import AuditLog, User, PortalSettings

class DashboardStatsView(APIView):
    """View to return aggregated admin dashboard statistics."""
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Get active batch identifier
        settings = PortalSettings.objects.first()
        active_batch_id = settings.batch_identifier if settings else None

        # 0. Fetch data exactly once
        if active_batch_id:
            try:
                batch_obj = Batch.objects.get(batch_id=active_batch_id)
                all_trainees = list(Trainee.objects(is_active=True, batch_id=batch_obj))
                all_projects = list(Project.objects(is_active=True, is_archived=False, batch_id=batch_obj))
            except Batch.DoesNotExist:
                all_trainees = []
                all_projects = []
            all_attendance = list(AttendanceRecord.objects(trainee_id__in=[t.id for t in all_trainees]))
        else:
            all_trainees = list(Trainee.objects(is_active=True))
            all_attendance = list(AttendanceRecord.objects())
            all_projects = list(Project.objects(is_active=True, is_archived=False))

        # 1. Total active trainees
        total_trainees = len(all_trainees)

        # 2. Average attendance
        total_attendance_records = len(all_attendance)
        present_attendance_records = sum(1 for a in all_attendance if a.status == 'present')
        avg_attendance = round((present_attendance_records / total_attendance_records) * 100, 1) if total_attendance_records > 0 else 85.0

        # 3. Active projects
        active_projects = sum(1 for p in all_projects if p.status != 'completed')

        # 4. At-risk trainees
        attendance_dict = AttendanceService.get_bulk_attendance_percentages()
        threshold = settings.min_attendance_threshold if settings else 75.0
        at_risk_count = sum(1 for t in all_trainees if str(t.id) in attendance_dict and attendance_dict[str(t.id)] < threshold)

        # 5. Last 6 weeks attendance trends (percentages)
        today = datetime.datetime.utcnow().date()
        today_start = datetime.datetime(today.year, today.month, today.day)
        attendance_weeks = []
        for i in range(5, -1, -1):
            start_date = today_start - datetime.timedelta(days=(i+1)*7)
            end_date = today_start - datetime.timedelta(days=i*7)
            
            # Using memory instead of DB
            week_records = [a for a in all_attendance if start_date <= a.date < end_date]
            total_w = len(week_records)
            present_w = sum(1 for a in week_records if a.status == 'present')
            
            pct = round((present_w / total_w) * 100, 1) if total_w > 0 else 85.0
            attendance_weeks.append(pct)

        # 6. Domain distribution
        domain_colors = {
            'AI/ML': '#4A6331', 'Web Dev': '#3D5A80', 'Cyber Sec': '#C0392B',
            'Data Sci': '#B8960C', 'IoT': '#4A6331', 'Embedded': '#C2185B'
        }
        domain_data = []
        for domain in DOMAINS:
            count = sum(1 for t in all_trainees if t.domain == domain)
            domain_data.append({
                "name": domain,
                "count": count,
                "color": domain_colors.get(domain, '#4A6331')
            })

        # 7. Recent activity from AuditLog
        logs = AuditLog.objects.order_by('-timestamp')[:5]
        recent_activity = []
        for log in logs:
            try:
                actor = User.objects.get(id=log.actor_id)
                actor_name = actor.full_name
            except:
                actor_name = "Admin"
            
            title = log.action.replace('_', ' ').title()
            body = f"Performed by {actor_name} on {log.target_type}"
            
            if log.action == "CREATE_TRAINEE":
                name = log.after_state.get('full_name', 'Trainee')
                roll = log.after_state.get('roll_number', '')
                title = f"New trainee enrolled: {roll}"
                body = f"{name} assigned to {log.after_state.get('domain', 'N/A')} domain"
            elif log.action in ["MARK_ATTENDANCE", "UPDATE_ATTENDANCE"]:
                title = f"Attendance marked for session"
                body = f"Trainee ID: {log.after_state.get('trainee_id', '')} - Status: {log.after_state.get('status', '').upper()}"
            elif log.action == "CREATE_ANNOUNCEMENT":
                title = f"Announcement: {log.after_state.get('title', '')[:30]}..."
                body = f"Targeted to {log.after_state.get('target_audience', 'All')}"
            
            # Simple time formatting
            time_diff = datetime.datetime.now(datetime.UTC).replace(tzinfo=None) - log.timestamp
            if time_diff.days == 0:
                if time_diff.seconds < 60:
                    time_str = "Just now"
                elif time_diff.seconds < 3600:
                    time_str = f"{time_diff.seconds // 60}m ago"
                else:
                    time_str = f"{time_diff.seconds // 3600}h ago"
            elif time_diff.days == 1:
                time_str = "Yesterday"
            else:
                time_str = f"{time_diff.days} days ago"

            recent_activity.append({
                "time": time_str,
                "title": title,
                "body": body
            })
        
        if not recent_activity:
            recent_activity = [
                { "time": "Just now", "title": "System Initialised", "body": "Vocational Training Management Portal is live." }
            ]

        data = {
            "total_trainees": total_trainees,
            "avg_attendance": avg_attendance,
            "active_projects": active_projects,
            "at_risk_trainees": at_risk_count,
            "attendance_weeks": attendance_weeks,
            "domain_data": domain_data,
            "recent_activity": recent_activity
        }
        return success_response(data=data)

class TraineeDashboardStatsView(APIView):
    """View to return stats and details specific to a logged-in Trainee."""
    permission_classes = [IsAuthenticatedUser]

    def get(self, request):
        trainee_id = request.query_params.get('trainee_id')
        if not trainee_id:
            if request.user.role == 'trainee':
                trainee_id = request.user.trainee_id
            else:
                raise ValidationError("trainee_id query parameter is required for admin.")

        # Ensure authorization
        if request.user.role != 'admin' and str(trainee_id) != request.user.trainee_id:
            raise Forbidden("You are not authorized to view this trainee's stats.")

        try:
            trainee = Trainee.objects.get(pk=trainee_id)
        except:
            raise NotFoundError("Trainee not found.")

        # Calculate metrics
        # 1. Attendance percentage
        my_attendance = AttendanceService.get_trainee_attendance_percentage(str(trainee.id))

        # 2. Projects done count
        assignments = ProjectAssignment.objects(trainee_id=trainee.id)
        total_assigned_projects = assignments.count()
        completed_projects = 0
        projects_scores = []
        current_project = None

        for assignment in assignments:
            project = assignment.project_id
            if project.is_active and not project.is_archived:
                score_val = project.score
                if project.status == 'completed':
                    completed_projects += 1
                else:
                    if not current_project:
                        current_project = {
                            "id": str(project.id),
                            "project_code": project.project_code,
                            "title": project.title,
                            "description": project.description,
                            "progress": project.progress,
                            "status": project.status,
                            "deadline": assignment.deadline_override.strftime("%d %b %Y") if assignment.deadline_override else "20 Jun 2025"
                        }

                projects_scores.append({
                    "title": project.title,
                    "score": score_val,
                    "progress": project.progress
                })

        # Average of completed projects score
        scores_list = [p.get('score') for p in projects_scores if p.get('score') is not None]
        composite_score = round(sum(scores_list) / len(scores_list), 1) if scores_list else 85.0

        weeks_remaining = 5

        # 6-week attendance chart
        today = datetime.datetime.utcnow().date()
        today_start = datetime.datetime(today.year, today.month, today.day)
        schedule_data = []
        for i in range(5, -1, -1):
            start_date = today_start - datetime.timedelta(days=(i+1)*7)
            end_date = today_start - datetime.timedelta(days=i*7)
            total_w = AttendanceRecord.objects(trainee_id=trainee.id, date__gte=start_date, date__lt=end_date).count()
            present_w = AttendanceRecord.objects(trainee_id=trainee.id, date__gte=start_date, date__lt=end_date, status='present').count()
            pct = round((present_w / total_w) * 100, 1) if total_w > 0 else 85.0
            schedule_data.append(pct)

        data = {
            "name": trainee.full_name,
            "roll_number": trainee.roll_number,
            "domain": trainee.domain,
            "batch": trainee.batch,
            "phone": trainee.phone or "",
            "my_attendance": my_attendance,
            "projects_done": f"{completed_projects} / {total_assigned_projects}",
            "completed_count": completed_projects,
            "total_assigned": total_assigned_projects,
            "composite_score": composite_score,
            "weeks_remaining": weeks_remaining,
            "current_project": current_project,
            "project_scores": projects_scores,
            "schedule_data": schedule_data
        }
        return success_response(data=data)

class AnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Get active batch identifier
        settings = PortalSettings.objects.first()
        active_batch_id = settings.batch_identifier if settings else None

        if active_batch_id:
            try:
                batch_obj = Batch.objects.get(batch_id=active_batch_id)
                all_trainees_ever = list(Trainee.objects(batch_id=batch_obj))
                all_projects = list(Project.objects(is_active=True, batch_id=batch_obj))
            except Batch.DoesNotExist:
                all_trainees_ever = []
                all_projects = []
        else:
            all_projects = list(Project.objects(is_active=True))
            all_trainees_ever = list(Trainee.objects())

        # 1. completion_rate
        active_unarchived = [p for p in all_projects if not p.is_archived]
        total_active_projects = len(active_unarchived)
        completed_or_submitted = sum(1 for p in active_unarchived if p.status in ['completed', 'submitted'])
        completion_rate = round((completed_or_submitted / total_active_projects) * 100, 1) if total_active_projects > 0 else 0.0

        # 2. avg_project_score
        scored_projects = [p for p in all_projects if p.score is not None]
        all_scores = [p.score for p in scored_projects]
        avg_project_score = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0.0

        # 3. total_trainees
        active_trainees = [t for t in all_trainees_ever if t.is_active]
        total_trainees = len(active_trainees)

        # 4. dropout_rate
        total_trainees_ever_count = len(all_trainees_ever)
        inactive_trainees = total_trainees_ever_count - total_trainees
        dropout_rate = round((inactive_trainees / total_trainees_ever_count) * 100, 1) if total_trainees_ever_count > 0 else 0.0

        # 5. domain_scores
        domain_scores = []
        for d in DOMAINS:
            domain_projects = [p for p in scored_projects if p.domain == d]
            scores = [p.score for p in domain_projects]
            avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
            domain_scores.append({"name": d, "score": avg_score})

        # 6. attendance_distribution
        threshold = float(settings.min_attendance_threshold) if settings else 75.0
        
        b1_count = 0
        b2_count = 0
        b3_count = 0
        b4_count = 0
        
        attendance_dict = AttendanceService.get_bulk_attendance_percentages()
        for t in active_trainees:
            att_pct = attendance_dict.get(str(t.id), 100.0)
            if att_pct >= 95.0:
                b1_count += 1
            elif att_pct >= 85.0:
                b2_count += 1
            elif att_pct >= threshold:
                b3_count += 1
            else:
                b4_count += 1
                
        attendance_distribution = [
            {"label": "95-100%", "count": b1_count, "color": "#4A6331"},
            {"label": "85-95%", "count": b2_count, "color": "#4A6331"}
        ]
        
        if threshold < 85.0:
            attendance_distribution.append({"label": f"{int(threshold)}-85%", "count": b3_count, "color": "#B8960C"})
        
        attendance_distribution.append({"label": f"Below {int(threshold)}%", "count": b4_count, "color": "#C0392B"})

        # 7. project_status_breakdown
        status_colors = {
            'planning': '#3D5A80',
            'in_progress': '#B8960C',
            'submitted': '#4A6331',
            'completed': '#1E2C3A'
        }
        project_status_breakdown = []
        for s in ['planning', 'in_progress', 'submitted', 'completed']:
            count = sum(1 for p in all_projects if p.status == s)
            project_status_breakdown.append({
                "name": s.replace('_', ' ').title(),
                "value": count,
                "color": status_colors[s]
            })

        # 8. top_performers
        from collections import defaultdict
        active_projects_map = {str(p.id): p for p in Project.objects(is_active=True)}
        assignments = ProjectAssignment.objects().no_dereference()
        trainee_assignments = defaultdict(list)
        for a in assignments:
            tid = str(a._data['trainee_id']) if hasattr(a, '_data') else str(a.trainee_id.id)
            pid = str(a._data['project_id']) if hasattr(a, '_data') else str(a.project_id.id)
            if pid in active_projects_map:
                trainee_assignments[tid].append(active_projects_map[pid])

        trainee_composites = []
        for t in active_trainees:
            tid = str(t.id)
            att_pct = attendance_dict.get(tid, 100.0)
            t_projs = trainee_assignments.get(tid, [])
            total_assigned = len(t_projs)
            completed_count = 0
            scores = []
            for proj in t_projs:
                if proj.status == 'completed':
                    completed_count += 1
                if proj.score is not None:
                    scores.append(proj.score)
            
            avg_score = sum(scores) / len(scores) if scores else 85.0
            composite = (att_pct * 0.4) + (avg_score * 0.6)
            trainee_composites.append({
                "name": t.full_name,
                "domain": t.domain,
                "attendance": round(att_pct),
                "projects_completed": f"{completed_count}/{total_assigned}",
                "composite": round(composite)
            })
        trainee_composites.sort(key=lambda x: x["composite"], reverse=True)
        top_performers = []
        for rank, tc in enumerate(trainee_composites[:3], 1):
            tc["rank"] = rank
            top_performers.append(tc)

        data = {
            "completion_rate": completion_rate,
            "avg_project_score": avg_project_score,
            "total_trainees": total_trainees,
            "dropout_rate": dropout_rate,
            "domain_scores": domain_scores,
            "attendance_distribution": attendance_distribution,
            "project_status_breakdown": project_status_breakdown,
            "top_performers": top_performers
        }
        return success_response(data=data)

class RepositoryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from mongoengine.queryset.visitor import Q
        q_obj = Q(is_archived=True) | Q(status__in=['completed', 'submitted'])
        query_filters = {
            "is_active": True
        }

        domain_param = request.query_params.get('domain')
        if domain_param and domain_param != 'All':
            query_filters["domain"] = domain_param

        search_param = request.query_params.get('search')
        if search_param:
            query_filters["title__icontains"] = search_param

        projects_qs = Project.objects(q_obj, **query_filters).order_by('-score')
        total_count = projects_qs.count()

        page = int(request.query_params.get('page', 1))
        limit = 20
        offset = (page - 1) * limit
        paginated_projects = projects_qs[offset:offset+limit]

        projects_list = []
        for p in paginated_projects:
            batch_year = "2024"
            if p.project_code and len(p.project_code) > 4 and p.project_code.startswith('TT'):
                digits = ''.join(c for c in p.project_code[2:] if c.isdigit())
                if len(digits) >= 2:
                    batch_year = f"20{digits[:2]}"

            stack_str = " · ".join(p.stack) if p.stack else ""

            projects_list.append({
                "id": str(p.id),
                "project_code": p.project_code,
                "title": p.title,
                "domain": p.domain,
                "team": p.team,
                "score": p.score,
                "stack": stack_str,
                "batch": batch_year
            })

        data = {
            "projects": projects_list,
            "total_count": total_count
        }
        return success_response(data=data)

class SettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        settings = PortalSettings.objects.first()
        if not settings:
            settings = PortalSettings().save()

        batch = Batch.objects(batch_id=settings.batch_identifier).first() if settings.batch_identifier else None
        active_batch_status = batch.batch_status if batch else 'active'

        data = {
            "org_name": settings.org_name,
            "batch_identifier": settings.batch_identifier,
            "active_batch_status": active_batch_status,
            "min_attendance_threshold": settings.min_attendance_threshold,
            "academic_year": settings.academic_year,
            "email_at_risk_alerts": settings.email_at_risk_alerts,
            "daily_attendance_summary": settings.daily_attendance_summary,
            "project_deadline_reminders": settings.project_deadline_reminders,
            "new_trainee_registration_alerts": settings.new_trainee_registration_alerts,
        }
        return success_response(data=data)

    def put(self, request):
        settings = PortalSettings.objects.first()
        if not settings:
            settings = PortalSettings()

        data = request.data
        if 'org_name' in data:
            settings.org_name = data['org_name']
        if 'batch_identifier' in data:
            settings.batch_identifier = data['batch_identifier']
        if 'min_attendance_threshold' in data:
            settings.min_attendance_threshold = int(data['min_attendance_threshold'])
        if 'academic_year' in data:
            settings.academic_year = data['academic_year']
        if 'email_at_risk_alerts' in data:
            settings.email_at_risk_alerts = bool(data['email_at_risk_alerts'])
        if 'daily_attendance_summary' in data:
            settings.daily_attendance_summary = bool(data['daily_attendance_summary'])
        if 'project_deadline_reminders' in data:
            settings.project_deadline_reminders = bool(data['project_deadline_reminders'])
        if 'new_trainee_registration_alerts' in data:
            settings.new_trainee_registration_alerts = bool(data['new_trainee_registration_alerts'])

        settings.save()

        updated_data = {
            "org_name": settings.org_name,
            "batch_identifier": settings.batch_identifier,
            "min_attendance_threshold": settings.min_attendance_threshold,
            "academic_year": settings.academic_year,
            "email_at_risk_alerts": settings.email_at_risk_alerts,
            "daily_attendance_summary": settings.daily_attendance_summary,
            "project_deadline_reminders": settings.project_deadline_reminders,
            "new_trainee_registration_alerts": settings.new_trainee_registration_alerts,
        }
        return success_response(data=updated_data)

class ReportsView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        import csv
        from django.http import HttpResponse
        report_type = request.data.get('report_type')
        if not report_type:
            raise ValidationError("report_type is required.")

        settings = PortalSettings.objects.first()
        active_batch_id = settings.batch_identifier if settings else None

        response = HttpResponse(content_type='text/csv')
        filename = f"{report_type.lower().replace(' ', '_')}.csv"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'

        writer = csv.writer(response)

        # Base filters
        trainee_filter = {"is_active": True}
        if active_batch_id:
            trainee_filter["batch_id"] = active_batch_id

        if report_type == 'Attendance Report':
            writer.writerow(['Roll Number', 'Full Name', 'Domain', 'Batch', 'Attendance Percentage'])
            attendance_dict = AttendanceService.get_bulk_attendance_percentages()
            for t in Trainee.objects(**trainee_filter):
                att_pct = attendance_dict.get(str(t.id), 100.0)
                batch_str = t.batch_id.batch_id if t.batch_id else "N/A"
                writer.writerow([t.roll_number, t.full_name, t.domain, batch_str, f"{att_pct}%"])

        elif report_type == 'Project Progress Report':
            writer.writerow(['Project Code', 'Title', 'Domain', 'Status', 'Progress', 'Score', 'Tech Stack'])
            if active_batch_id:
                # Only show projects assigned to trainees in active batch
                trainee_ids = [t.id for t in Trainee.objects(**trainee_filter)]
                assignments = ProjectAssignment.objects(trainee_id__in=trainee_ids)
                assigned_project_ids = {a.project_id.id for a in assignments}
                project_queryset = Project.objects(is_active=True, id__in=assigned_project_ids)
            else:
                project_queryset = Project.objects(is_active=True)
            for p in project_queryset:
                stack_str = ", ".join(p.stack) if p.stack else ""
                writer.writerow([p.project_code, p.title, p.domain, p.status, f"{p.progress}%", p.score if p.score is not None else '—', stack_str])

        elif report_type == 'Batch Performance Report':
            writer.writerow(['Roll Number', 'Full Name', 'Domain', 'Batch', 'Attendance Percentage', 'Completed/Assigned Projects', 'Composite Score'])
            attendance_dict = AttendanceService.get_bulk_attendance_percentages()
            
            from collections import defaultdict
            active_projects_map = {str(p.id): p for p in Project.objects(is_active=True)}
            assignments = ProjectAssignment.objects().no_dereference()
            trainee_assignments = defaultdict(list)
            for a in assignments:
                tid = str(a._data['trainee_id']) if hasattr(a, '_data') else str(a.trainee_id.id)
                pid = str(a._data['project_id']) if hasattr(a, '_data') else str(a.project_id.id)
                if pid in active_projects_map:
                    trainee_assignments[tid].append(active_projects_map[pid])

            for t in Trainee.objects(**trainee_filter):
                att_pct = attendance_dict.get(str(t.id), 100.0)
                t_projs = trainee_assignments.get(str(t.id), [])
                total_assigned = len(t_projs)
                completed_count = 0
                scores = []
                for proj in t_projs:
                    if proj.status == 'completed':
                        completed_count += 1
                    if proj.score is not None:
                        scores.append(proj.score)
                avg_score = sum(scores) / len(scores) if scores else 85.0
                composite = (att_pct * 0.4) + (avg_score * 0.6)
                batch_str = t.batch_id.batch_id if t.batch_id else "N/A"
                writer.writerow([t.roll_number, t.full_name, t.domain, batch_str, f"{round(att_pct, 1)}%", f"{completed_count}/{total_assigned}", round(composite, 1)])

        elif report_type == 'At-Risk Trainee Report':
            writer.writerow(['Roll Number', 'Full Name', 'Domain', 'Batch', 'Attendance Percentage', 'Reason'])
            attendance_dict = AttendanceService.get_bulk_attendance_percentages()
            
            from collections import defaultdict
            active_projects_map = {str(p.id): p for p in Project.objects(is_active=True)}
            assignments = ProjectAssignment.objects().no_dereference()
            trainee_assignments = defaultdict(list)
            for a in assignments:
                tid = str(a._data['trainee_id']) if hasattr(a, '_data') else str(a.trainee_id.id)
                pid = str(a._data['project_id']) if hasattr(a, '_data') else str(a.project_id.id)
                if pid in active_projects_map:
                    deadline = a._data.get('deadline_override') if hasattr(a, '_data') else a.deadline_override
                    trainee_assignments[tid].append({'proj': active_projects_map[pid], 'deadline': deadline})

            for t in Trainee.objects(**trainee_filter):
                att_pct = attendance_dict.get(str(t.id), 100.0)
                reasons = []
                threshold = settings.min_attendance_threshold if settings else 75.0
                if att_pct < threshold:
                    reasons.append(f"Low Attendance ({round(att_pct, 1)}%)")
                
                t_projs = trainee_assignments.get(str(t.id), [])
                for item in t_projs:
                    proj = item['proj']
                    deadline = item['deadline']
                    if proj.status != 'completed':
                        if deadline and deadline < datetime.datetime.now(datetime.UTC).replace(tzinfo=None):
                            reasons.append(f"Overdue Project: {proj.title}")
                if reasons:
                    batch_str = t.batch_id.batch_id if t.batch_id else "N/A"
                    writer.writerow([t.roll_number, t.full_name, t.domain, batch_str, f"{round(att_pct, 1)}%", " | ".join(reasons)])

        elif report_type == 'Placement Analytics Report':
            writer.writerow(['Domain', 'Registered Trainees', 'Placed Count', 'Average Package (LPA)', 'Top Recruiters'])
            writer.writerow(['AI/ML', '24', '21', '8.5', 'Army HQ, BEL, DRDO'])
            writer.writerow(['Web Dev', '38', '35', '6.2', 'TCS, Infosys, Wipro'])
            writer.writerow(['Cyber Sec', '18', '17', '7.8', 'MoD, CERT-In, Tech Mahindra'])
            writer.writerow(['Data Sci', '28', '24', '7.0', 'Cognizant, Accenture, ISRO'])

        elif report_type == 'MoD Compliance Report':
            writer.writerow(['TT-CELL VOCATIONAL PORTAL - MINISTRY OF DEFENCE COMPLIANCE REPORT'])
            writer.writerow(['Quarterly Report', 'Q1 - 2026', 'Generated On', datetime.datetime.now(datetime.UTC).replace(tzinfo=None).strftime("%Y-%m-%d")])
            writer.writerow([])
            writer.writerow(['Metric', 'Target Value', 'Actual Value', 'Status'])
            
            active_trainees = Trainee.objects(**trainee_filter).count()
            writer.writerow(['Trainee Intake', '150', str(active_trainees), 'Satisfactory' if active_trainees >= 100 else 'Under Enrolled'])
            
            if active_batch_id:
                active_trainee_ids = [str(t.id) for t in Trainee.objects(**trainee_filter)]
                total_records = AttendanceRecord.objects(trainee_id__in=active_trainee_ids).count()
                present_records = AttendanceRecord.objects(trainee_id__in=active_trainee_ids, status='present').count()
            else:
                total_records = AttendanceRecord.objects.count()
                present_records = AttendanceRecord.objects(status='present').count()
                
            avg_att = (present_records / total_records) * 100 if total_records > 0 else 85.0
            threshold = settings.min_attendance_threshold if settings else 75.0
            writer.writerow(['Cohort Attendance', f'{round(threshold, 1)}%', f"{round(avg_att, 1)}%", 'Compliant' if avg_att >= threshold else 'Non-Compliant'])
            
            if active_batch_id:
                trainee_ids = [t.id for t in Trainee.objects(**trainee_filter)]
                assignments = ProjectAssignment.objects(trainee_id__in=trainee_ids)
                assigned_project_ids = {a.project_id.id for a in assignments}
                comp_projects = Project.objects(is_active=True, status='completed', id__in=assigned_project_ids).count()
            else:
                comp_projects = Project.objects(is_active=True, status='completed').count()
            writer.writerow(['Capstone Projects Completed', '50', str(comp_projects), 'In Progress'])
        else:
            return error_response(message=f"Unsupported report type: {report_type}")

        return response

