from django.shortcuts import render, get_object_or_404
from upload.models import Data, user_directory_path
from django.conf import settings
from django.http import HttpResponse

def index(request):
    context = {
        'data': Data.objects.all().order_by('-pk')
    }
    return render(request, 'search/index.html', context)

def results(request, name):
    context = {
        'data': Data.objects.all().order_by('dataname')
    }
    return render(request, 'search/results.html', context)