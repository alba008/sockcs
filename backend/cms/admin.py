from django.contrib import admin
from.models import SiteImage
@admin.register(SiteImage)
class SiteImageAdmin(admin.ModelAdmin):
    list_display = ["location","title_handwritten","is_active","order"]
    list_filter = ["location","is_active"]
    list_editable = ["is_active","order","title_handwritten"]