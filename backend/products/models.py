
from django.db import models
from django.utils.text import slugify

class Category(models.TextChoices):
    KIT = "kit", "Kit $89 — Tee + Jorts + Socks"
    TEE = "tee", "Tee"
    JORTS = "jorts", "Jorts"
    SOCKS = "socks", "Socks"
    ACCESSORY = "accessory", "Accessory"

class Product(models.Model):
    # Identity — matches your mockup "Cream Kit", "Noir Kit"
    name = models.CharField(max_length=120, help_text="e.g. Cream Kit, Noir Socks")
    slug = models.SlugField(max_length=140, unique=True, blank=True, db_index=True)
    category = models.CharField(
        max_length=10, 
        choices=Category.choices, 
        default=Category.KIT,
        db_index=True
    )
    
    # Pricing — your $89 kit logic
    price = models.DecimalField(max_digits=6, decimal_places=2, default=89.00)
    compare_at_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="For sale badge, e.g. 120.00")

    # Content — for light editorial cards
    description = models.TextField(blank=True, default="Tee. Jorts. Socks. Designed in Brooklyn, NY.")
    materials = models.CharField(max_length=200, blank=True, default="Heavyweight cotton, French terry")

    # Merchandising flags — drives Home sections
    is_featured = models.BooleanField(default=False, db_index=True, help_text="Show in Featured section")
    is_bestseller = models.BooleanField(default=False, db_index=True, help_text="Show in Best Sellers")
    is_new = models.BooleanField(default=False, help_text="New drop badge")
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide without deleting")

    # Media — 1 main + 1 hover for light look
    image = models.ImageField(upload_to="products/%Y/%m/", blank=True)
    image_hover = models.ImageField(upload_to="products/%Y/%m/", blank=True, help_text="Second image on hover")

    # Inventory simple — you had full inventory app, we keep simple count for v2
    stock = models.PositiveIntegerField(default=100)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "is_featured"]),
            models.Index(fields=["category", "is_bestseller"]),
        ]

    def save(self, *args, **kwargs):
        # Auto slug from name: "Cream Kit" -> "cream-kit"
        if not self.slug:
            base = slugify(self.name)
            slug = base
            counter = 1
            while Product.objects.filter(slug=slug).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - ${self.price} [{self.get_category_display()}]"

class ProductImage(models.Model):
    """Optional gallery — for product detail page carousel"""
    product = models.ForeignKey(Product, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/gallery/%Y/%m/")
    alt_text = models.CharField(max_length=120, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} gallery #{self.order}"