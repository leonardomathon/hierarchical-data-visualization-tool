def validate_dataname(value):
    import os
    from django.core.exceptions import ValidationError
    from django.core.validators import RegexValidator
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z]+$', 'Only alphanumeric characters are allowed.')

def validate_file_extension(value):
    import os
    from django.core.exceptions import ValidationError
    valid_extensions = ['.tre']
    path = os.path.splitext(value.name)[1]
    if not path.lower() in valid_extensions:
        raise ValidationError(u'Unsupported file extension, make sure the file format is ' + str(valid_extensions))


