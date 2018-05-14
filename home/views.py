# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.files.storage import default_storage

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models.fields.files import FieldFile
from django.views.generic import FormView
from django.views.generic.base import TemplateView
from django.contrib import messages
from django.views.generic.edit import CreateView

from .forms import FilesForm
from upload.models import Data

class HomePageView(TemplateView):
    template_name = 'home/index.html'
    data = Data.objects.all()

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        context['latest_uploads'] = Data.objects.all().order_by('-pk')[:5]
        context['model'] = Data
        context['fields'] = ['dataname', 'file_path']

        return context
