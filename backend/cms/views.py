from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SiteImage
from .serializers import SiteImageSerializer
import random

class SiteImageListView(APIView):
    def get(self, request):
        loc = request.query_params.get("location", "hero")
        qs = list(SiteImage.objects.filter(location=loc, is_active=True))
        random.shuffle(qs)
        serializer = SiteImageSerializer(qs[:5], many=True, context={'request': request})
        return Response(serializer.data)