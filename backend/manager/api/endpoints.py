from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from datetime import date, datetime, timedelta, timezone

from .serializers import RegistrySerializer
from ..utils import BREAKFAST, DINNER, LUNCH, solo_to_json
from manager.models import Breakfast, Lunch, Dinner, Registry, Person


class LoginView(ObtainAuthToken):
    permission_classes = [permissions.AllowAny]
    renderer_classes = [renderers.JSONRenderer]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff,
            'username': user.username
        })


class HomePage(APIView):
    """"""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [renderers.JSONRenderer]

    def get(self, request):
        """
        Return the meals data
        """
        data = {
            'breakfast' : solo_to_json(Breakfast.get_solo()),
            'lunch' : solo_to_json(Lunch.get_solo()),
            'dinner' : solo_to_json(Dinner.get_solo())
        }
        return Response(data, status=status.HTTP_200_OK)


class MealData(APIView):
    """"""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [renderers.JSONRenderer]

    def get(self, request, meal):
        today = datetime.now()

        if not meal in [BREAKFAST, LUNCH, DINNER]:
            return Response({'detail': "Invalid meal name."}, status=status.HTTP_400_BAD_REQUEST)

        meal = self.get_meal_by_name(meal)
        meal_data = Registry.objects.filter(meal=meal, time__year=today.year, time__month=today.month, time__day=today.day).order_by('-id')
        count = meal_data.count()
        history = []
        if count > 0:
            history = RegistrySerializer(instance=meal_data, many=True).data[:5]
        data = {
            'count': count,
            'history': history,
            'is_active': meal.is_active,
            'is_available': meal.start_time <= datetime.now().time() <= meal.end_time
            }
        return Response(data, status=status.HTTP_200_OK)

    def get_meal_by_name(self, meal):
        if meal == BREAKFAST:
            return Breakfast.get_solo()
        elif meal == LUNCH:
            return Lunch.get_solo()
        elif meal == DINNER:
            return Dinner.get_solo()


class RegistryViews(APIView):
    """"""

    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [renderers.JSONRenderer]

    def post(self, request):
        """
        Return a ...
        """

        data = request.data

        today = datetime.now()

        meal = data.get('meal', "")
        login = data.get('login', "")


        is_staff = Person.objects.filter(login=login, superuser=True, authorized=True).exists()
            
        # check if the user has reached the limit
        if is_staff:
            user_limit = Person.objects.get(login=login)
            # get number of registries for this user
            registries_count = Registry.objects.filter(
                login=login,
                time__year=today.year,
                time__month=today.month,
                time__day=today.day,
                meal=meal
            ).count()

            print('meal name', meal)

            # print('registries_count', registries_count)
            if registries_count >= user_limit.limit:
                return Response({'detail': 'USER_LIMIT_REACHED'}, status.HTTP_400_BAD_REQUEST)

        is_exist = Registry.objects.filter(
            time__year=today.year,
            time__month=today.month,
            time__day=today.day,
            meal=meal,
            login=login
        ).exists()

        if Registry.objects.filter(
            meal=meal,
            login=login,
            time__gte=today - timedelta(seconds=1)
        ).exists():
            is_staff = False

        if not is_staff:
            if is_exist:
                return Response({'detail': 'USER_ALREADY'}, status.HTTP_400_BAD_REQUEST)

        

        cashier = f"{request.user.first_name} {request.user.last_name}"
        cashier = cashier if cashier != " " else request.user.username
        data['cashier'] = cashier
        serializer = RegistrySerializer(data=data)
        if serializer.is_valid():
            registery = serializer.save()
            ################
            # Ramadan time
            # minus timedelta to the time
            # registery.time = registery.time - timedelta(hours=5)
            # registery.save()
            ################
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

