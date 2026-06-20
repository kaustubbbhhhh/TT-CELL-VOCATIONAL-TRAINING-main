from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

class ResetPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)

class ResetPasswordTokenSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=8)

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    full_name = serializers.CharField(read_only=True)
    trainee_id = serializers.CharField(read_only=True, required=False)
    must_change_password = serializers.BooleanField(read_only=True)
