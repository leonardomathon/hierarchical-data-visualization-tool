from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.DataUpload.as_view(), name='data-add'),
]
