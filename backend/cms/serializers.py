from rest_framework import serializers
from .models import SiteImage
class SiteImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = SiteImage
        fields = ["id","location","image_url","title_handwritten","subtitle","link_url"]
    def get_image_url(self, obj):
        req = self.context.get('request')
        if obj.image:
            return req.build_absolute_uri(obj.image.url) if req else obj.image.url
        return None