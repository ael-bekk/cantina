from dataclasses import fields
from decimal import Clamped
from rest_framework import serializers
from manager.models import Registry, Breakfast, Lunch, Dinner, Identity, Person
from django.contrib.auth.models import User



class IdentitySerializer(serializers.ModelSerializer):
	class Meta:
		model = Identity
		fields = ['identity']

class BreakfastSerializer(serializers.ModelSerializer):
	class Meta:
		model = Breakfast
		fields = '__all__'

class LunchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Lunch
		fields = '__all__'

class DinnerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Dinner
		fields = '__all__'

class RegistrySerializer(serializers.ModelSerializer):
	class Meta:
		model = Registry
		fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'username', 'first_name', 'last_name', 'is_superuser', 'is_staff']

class PersonSerializer(serializers.ModelSerializer):
	class Meta:
		model = Person
		fields = '__all__'