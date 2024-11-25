from django.contrib import admin
from django.urls import path
from django.conf import settings
from manager.api.endpoints import HomePage, LoginView, RegistryViews, MealData
from manager.api.dashboard import (
    DashboardMealsView,
    DashboardMealsAnalyticsView,
    DashboardMealsAnalyticsDownloadView,
    DashboardManageUsersView,
    DashboardDownloadMealsAnalyticsView,
    DashboardIdentityView,
    DashboardPersonView,
    DashboardPersonViewSearch,
    DashboardRecordsSearchView,
    DashboardRecordsSearchEagleEyeView
)
from manager.api.hooks import HookCloseCreateView, HookCloseUpdateView, HookCloseGetView, HookUpdateBadgeId, HookLogGetView, HookLoginGetView

urlpatterns = [
    path('api/auth/login/', LoginView.as_view()),

    path('api/meals-data/', HomePage.as_view()),
    path('api/meals/<str:meal>/', MealData.as_view()),
    path('api/create-registry/', RegistryViews.as_view()),

    path('api/dashboard/identity/', DashboardIdentityView.as_view()),

    path('api/dashboard/users/', DashboardManageUsersView.as_view()),

    path('api/dashboard/meals/', DashboardMealsView.as_view()),
    path('api/dashboard/meals/analytics/',
         DashboardMealsAnalyticsView.as_view()),
    path('api/dashboard/meals/analytics/download/',
         DashboardMealsAnalyticsDownloadView.as_view()),
    path('api/dashboard/meals/analytics/export/',
         DashboardDownloadMealsAnalyticsView.as_view()),

    path('api/dashboard/meals/<str:meal_name>/', DashboardMealsView.as_view()),

    path('api/dashboard/persons/', DashboardPersonView.as_view()),
    path('api/dashboard/persons/search/', DashboardPersonViewSearch.as_view()),
    path('api/dashboard/records/', DashboardRecordsSearchView.as_view()),
    
    path('api/dashboard/eagle-eye/search/', DashboardRecordsSearchEagleEyeView.as_view()),

    path('api/hooks/close/', HookCloseCreateView.as_view()),
    path('api/hooks/unclose/', HookCloseUpdateView.as_view()),
    path('api/hooks/close/get/', HookCloseGetView.as_view()),
    path('api/hooks/logs/get/', HookLogGetView.as_view()),
    path('api/hooks/badge_id/update/', HookUpdateBadgeId.as_view()),
    path('api/hooks/badge_id/<str:badge_id>/', HookLoginGetView.as_view()),
]

if settings.DEBUG:
    urlpatterns.append(path('admin/', admin.site.urls))
