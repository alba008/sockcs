from django.db import models
class SiteImage(models.Model):
    LOCATION = [("hero","Hero"),("shop_strip","Shop Strip"),("pdp_bottom","PDP Bottom")]
    location = models.CharField(max_length=20, choices=LOCATION, default="hero", db_index=True)
    image = models.ImageField(upload_to="site_images/")
    title_handwritten = models.CharField(max_length=120, blank=True, default="Built line by line")
    subtitle = models.CharField(max_length=120, blank=True, default="City System 11377")
    link_url = models.CharField(max_length=200, blank=True, default="/")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return f"{self.location} - {self.title_handwritten}"
    class Meta:
        ordering = ["order","-created_at"]