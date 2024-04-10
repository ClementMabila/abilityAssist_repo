from django.urls import path
from .import views

urlpatterns = [
    path("routes/", views.RouteListCreate.as_view(), name="route-list"),
    path("routes/delete/<int:pk>", views.RouteDelete.as_view(), name="delete-route")
]