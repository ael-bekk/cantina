from statistics import mode
from time import time
from django.db import models
from solo.models import SingletonModel


# Global Variables
BREAKFAST = "breakfast"
LUNCH = "lunch"
DINNER = "dinner"


class Identity(SingletonModel):
    identity = models.CharField(max_length=100, default="benguerir")

    def __str__(self):
        return self.identity


class Breakfast(SingletonModel):
    name = models.CharField(max_length=50, default=BREAKFAST)
    start_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='07:00')
    end_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='09:00')
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Lunch(SingletonModel):
    name = models.CharField(max_length=50, default=LUNCH)
    start_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='12:00')
    end_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='15:00')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Dinner(SingletonModel):
    name = models.CharField(max_length=50, default=DINNER)
    start_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='19:00')
    end_time = models.TimeField(
        auto_now=False, auto_now_add=False, default='22:00')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Registry(models.Model):
    meals = (
        (BREAKFAST, BREAKFAST),
        (LUNCH, LUNCH),
        (DINNER, DINNER),
    )
    cashier = models.CharField(max_length=150, null=False, blank=False)
    badge = models.CharField(max_length=50, null=False, blank=False)
    login = models.CharField(max_length=50, null=False, blank=False)
    profile = models.CharField(max_length=50, null=False, blank=False)
    first_name = models.CharField(max_length=50, default="")
    last_name = models.CharField(max_length=50, default="")
    image_url = models.URLField(max_length=255, null=False, blank=False)
    meal = models.CharField(max_length=50, choices=meals,
                            null=False, blank=False)
    time = models.DateTimeField(auto_now_add=True, auto_now=False)

    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name.upper()}"

    def __str__(self) -> str:
        return f"{self.login}__{self.meal}"


class Person(models.Model):

    KINDS = (
        ('staff', 'staff'),
        ('student', 'student'),
        ('pooler', 'pooler'),
        ('prestataire', 'prestataire'),
    )

    badge = models.CharField(max_length=50, null=False,
                             blank=False, unique=True)
    login = models.CharField(max_length=50, null=False,
                             blank=False, unique=True)
    full_name = models.CharField(max_length=100, null=False, blank=False)
    kind = models.CharField(max_length=50, choices=KINDS,
                            null=False, blank=False)
    authorized = models.BooleanField(default=True)
    superuser = models.BooleanField(default=False)
    # add limit of each user
    limit = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)

    def get_full_name(self) -> str:
        return self.full_name

    def __str__(self) -> str:
        return f"{self.login}__{self.badge}"


class Close(models.Model):
    login = models.CharField(max_length=50, null=False, blank=False)
    reason = models.TextField(max_length=2000, default="")
    kind = models.CharField(max_length=100, null=False, blank=False)
    state = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self) -> str:
        return f"{self.login}"

class Logs(models.Model):
    KINDS = (
        ('Not found', 'Not found'),
        ('Not authorized', 'Not authorized'),
        ('Already badged', 'Already badged'),
        ('Limit reached', 'Limit reached'),
    )
    login = models.CharField(max_length=50, null=True, blank=True)
    badge_id = models.CharField(max_length=50, null=False, blank=False)
    kind = models.CharField(max_length=50, choices=KINDS,
                            null=False, blank=False)
    meal = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __str__(self) -> str:
        return f"{self.badge_id} {self.login} : {self.kind}"
