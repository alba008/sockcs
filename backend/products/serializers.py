from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "image_url", "alt_text", "order"]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

class ProductSerializer(serializers.ModelSerializer):
    gallery = ProductImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    image_hover_url = serializers.SerializerMethodField()
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    
    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "category_display",
            "price", "compare_at_price", "description", "materials",
            "is_featured", "is_bestseller", "is_new", "is_active",
            "image", "image_url", "image_hover", "image_hover_url",
            "gallery", "stock", "created_at"
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None

    def get_image_hover_url(self, obj):
        if obj.image_hover:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image_hover.url)
            return f"http://127.0.0.1:8000{obj.image_hover.url}"
        return None