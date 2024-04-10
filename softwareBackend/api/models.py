from django.db import models
from django.contrib.auth.models import User

class Route(models.Model):
    location = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    logged_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="route")

    def __str__(self):
        return f"{self.location} to {self.destination}"
