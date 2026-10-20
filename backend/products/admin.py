from django.contrib import admin
from.models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "is_featured", "is_bestseller", "is_new", "is_active", "stock", "created_at"]
    list_filter = ["category", "is_featured", "is_bestseller", "is_new", "is_active"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ["price", "is_featured", "is_bestseller", "is_new", "is_active", "stock"]
    inlines = [ProductImageInline]

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ["product", "order"]