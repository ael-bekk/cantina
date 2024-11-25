from manager.models import Logs
from dataclasses import fields
from decimal import Clamped
from rest_framework import serializers

class LogsSerializer(serializers.ModelSerializer):
	class Meta:
		model = Logs
		fields = '__all__'