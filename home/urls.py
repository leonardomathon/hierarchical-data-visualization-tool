from django.urls import path
# from django.conf.urls import handler404, handler500

from . import views

urlpatterns = [
    path('', HomePageView.as_view(), name='index'),
]

def handler404(request):
    data = {}
    return render(request,'404.html', data)

# def error_404(request):

#
# def error_500(request):
#         data = {}
#         return render(request,'500.html', data)
#
# handler404 = error_404
# handler500 = error_500
