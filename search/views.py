from django.shortcuts import render, get_object_or_404
from upload.models import Data, user_directory_path
from django.conf import settings
from django.http import HttpResponse
from django import forms

from upload.views import Data

def index(request):
    data = Data.objects.all()
    context = {
        'data': data
    }
    return render(request, 'search/index.html', context)