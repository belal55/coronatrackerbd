from django.contrib import admin
from django.urls import path,include
from .views import home,getData,tabularData,fetchData

urlpatterns = [
    path('',home,name='home' ),
    path('getData/',getData,name='getData' ),
    path('fetchData/',fetchData,name='fetchData' ),
    path('tabularData/',tabularData,name='tabularData' ),

]
