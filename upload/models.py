from django.db import models
from django.urls import reverse
from .validator import validate_file_extension
from django.core.validators import RegexValidator


# Validator for regex
alphanumeric = RegexValidator(
    r'^[0-9a-zA-Z]+$', 'Only alphanumeric characters are allowed.')

# Set location for the upload
# e.g /uploads/dataset_{primary key}
def user_directory_path(self, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    folderName = self.dataname.replace(" ", "")
    return 'data_{0}/{1}'.format(folderName, filename)

class Data(models.Model):
    dataname = models.CharField(max_length=250, unique=True, validators=[alphanumeric])
    file_path = models.FileField(validators=[validate_file_extension], upload_to=user_directory_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_absolute_url(self):
        return "/display/%i/" % self.id    

    def __str__(self):
        return self.dataname
        
    class Meta:
        verbose_name_plural = "Data"
        

