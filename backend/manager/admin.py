from django.contrib import admin
from .models import Breakfast, Lunch, Dinner, Registry, Identity, Person, Close

admin.site.register(Close)
admin.site.register(Person)
admin.site.register(Identity)
admin.site.register(Breakfast)
admin.site.register(Lunch)
admin.site.register(Dinner)
admin.site.register(Registry)
