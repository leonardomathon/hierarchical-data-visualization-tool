from django.db import models
from django.urls import reverse

class Data(models.Model):
    dataname = models.CharField(max_length=250)
    file_path = models.FileField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        return "/display/%i/" % self.id

    def __str__(self):
        return self.dataname
    class Meta:
        verbose_name_plural = "Data"

