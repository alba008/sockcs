from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    lookup_field = "slug"
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        
        # ?category=kit
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)
        
        # ?featured=true
        if self.request.query_params.get("featured") == "true":
            queryset = queryset.filter(is_featured=True)
        
        # ?bestseller=true
        if self.request.query_params.get("bestseller") == "true":
            queryset = queryset.filter(is_bestseller=True)
        
        # ?new=true
        if self.request.query_params.get("new") == "true":
            queryset = queryset.filter(is_new=True)
            
        # ?q=cream
        q = self.request.query_params.get("q")
        if q:
            queryset = queryset.filter(name__icontains=q)
            
        return queryset

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ["price", "created_at", "name"]
    ordering = ["-created_at"]