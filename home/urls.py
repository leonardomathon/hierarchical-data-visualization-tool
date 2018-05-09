from django.urls import path

from . import views

urlpatterns = [
    path('', HomePageView.as_view(), name='index'),
]
