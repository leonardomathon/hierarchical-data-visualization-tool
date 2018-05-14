from django.shortcuts import render, get_object_or_404
from upload.models import Data
from django.conf import settings
import json

from django.http import HttpResponse

def index(request):
    context = {
        'data': Data.objects.all().order_by('-pk')
    }
    return render(request, 'display/index.html', context)

def display(request, data_id):
    data = get_object_or_404(Data, pk=data_id)
    return render(request, 'display/display.html', {'data': data})


def read(request, data_id):
    datafile = []
    data = get_object_or_404(Data, pk=data_id)
    file = open(settings.BASE_DIR + data.file_path.url, "r")
    for line in file:
        datafile.append(line)
    context = {
        'file': datafile
    }
    return render(request, 'display/read.html', context)

def returnJson(request, data_id):
    datafile = []
    data = get_object_or_404(Data, pk=data_id)
    file = open(settings.BASE_DIR + data.file_path.url, "r")
    for line in file:
            datafile.append(line)
    context = {
            'file': datafile
        }

    return HttpResponse(json.dumps(context), content_type="application/json")
