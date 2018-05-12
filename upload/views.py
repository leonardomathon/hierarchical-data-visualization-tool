from django.http import HttpResponse
from django.views.generic.edit import CreateView
from django.shortcuts import render
from .models import Data

def index(request):
    return render(request, 'upload/data_form.html')

class DataUpload(CreateView):
    model = Data
    fields = ['dataname', 'file_path']
