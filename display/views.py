from django.shortcuts import render, get_object_or_404
from upload.models import Data, user_directory_path
from django.conf import settings
import json
from django.http import HttpResponse
from ete3 import Tree
import sys
import random
import os.path


def index(request):
    context = {
        'data': Data.objects.all().order_by('-pk')
    }
    return render(request, 'display/index.html', context)

def display(request, data_id):
    data = get_object_or_404(Data, pk=data_id)
    generate_json(data_id)
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
    data = get_object_or_404(Data, pk=data_id)
    return HttpResponse(open(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json", "r"), content_type="application/json")


def generate_json(data_id):
    data = get_object_or_404(Data, pk=data_id)
    if os.path.isfile(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json"):
        return 0
    else:
        data_name = data.dataname
        t = Tree(settings.BASE_DIR + data.file_path.url, format=1)
        f= open(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json","w+")
        f.write(str(get_json(t)).replace("'", '"'))

def get_json(node):
    node.name = node.name.replace("'", '')

    #If node has no name, assign random name
    if node.name == "":
        node.name = random.randint(0,10000)
        
    # JSON format
    json = { "name": node.name, 
             "type": "node" if node.children else "leaf",
             "branch_length": str(node.dist),
             }  
    
    # Get children
    if node.children:
        json["children"] = []
        for ch in node.children:
            json["children"].append(get_json(ch))
    return json

