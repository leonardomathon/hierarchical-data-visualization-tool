from django.shortcuts import render, get_object_or_404
from upload.models import Data

def index(request):
    context = {
        'data': Data.objects.all().order_by('-pk')
    }
    return render(request, 'display/index.html', context)

def display(request, data_id):
    data = get_object_or_404(Data, pk=data_id)
    return render(request, 'display/display.html', {'data': data})
