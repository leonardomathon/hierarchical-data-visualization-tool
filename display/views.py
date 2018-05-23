from django.shortcuts import render, get_object_or_404
from upload.models import Data, user_directory_path
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib import messages

from ete3 import Tree

import os.path
import sys
import random
import json
import datetime

def index(request):
    context = {
        'data': Data.objects.all().order_by('-pk')
    }
    return render(request, 'display/index.html', context)

def display(request, data_id):
    data = get_object_or_404(Data, pk=data_id)
    generate_json(data_id)

    # Check if uploaded file has right newick format
    if check_json(data_id):
        return render(request, 'display/display.html', {'data': data})
    else:
        # Return redirect to home page with message
        messages.add_message(request, messages.INFO, "You tried to upload a invalid tree. Make sure the file format corresponds with the <a href='https://en.wikipedia.org/wiki/Newick_format' style='color:white;'><u>example</u></a>")

        # Remove uploaded file from database
        data = Data.objects.get(pk=data_id)
        data.delete()
        # Return redirect to home
        return redirect('../../')
        

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

def get_json(node):
    node.name = node.name.replace("'", '')

    #If node has no name, assign random name
    if node.name == "":
        node.name = random.randint(0, 10000)

    # JSON format
    json = {"name": node.name,
            "type": "node" if node.children else "leaf",
            "branch_length": str(node.dist),
            }

    # Get children
    if node.children:
        json["children"] = []
        for ch in node.children:
            json["children"].append(get_json(ch))

    return json

def generate_json(data_id):
    data = get_object_or_404(Data, pk=data_id)
    if os.path.isfile(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json"):
        return 0
    else:
        data_name = data.dataname
        try:
            t = Tree(settings.BASE_DIR + data.file_path.url, format=1)
            f= open(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json","w+")
            f.write(str(get_json(t)).replace("'", '"'))
        except:
            f = open(settings.BASE_DIR + "/uploads/data_" +
                     data.dataname+"/"+data.dataname+".json", "w+")
            f.write("Invalid tree")

def check_json(data_id):
    data = get_object_or_404(Data, pk=data_id)
    f= open(settings.BASE_DIR + "/uploads/data_"+data.dataname+"/"+data.dataname+".json","r")
    if "Invalid tree" in f.read():
        return False
    else:
        return True

