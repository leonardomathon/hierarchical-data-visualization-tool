from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<data_id>[0-9]+)/$', views.display, name='display'),
    url(r'^(?P<data_id>[0-9]+)/read$', views.read, name='display'),
    url(r'^(?P<data_id>[0-9]+)/json$', views.returnJson, name='display'),
]
