from django.db import models

class Data(models.Model):
    dataname = models.CharField(max_length=250)
    file_path = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.dataname + ' @ ' + self.file_path
    class Meta:
        verbose_name_plural = "Data"
