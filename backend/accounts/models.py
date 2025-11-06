from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.exceptions import ValidationError

class CustomUserManager(BaseUserManager):  #Superusuario Personalizado
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_estudiante", False)  # opcional: superuser no es estudiante

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser debe tener is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser): #Usuario Estudiante o Admin Interu
    email = models.EmailField(unique=True)
    acepta_politicas = models.BooleanField(default=False)

    is_estudiante = models.BooleanField(default=True)
    is_admin_interu = models.BooleanField(default=False)

    username = None
    is_active = models.BooleanField(default=True)  # SIN ACTIVACIÓN POR EMAIL

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()  


    """ SE ACTIVA EN PRODUCCIÓN !!!!
    def clean(self):
        super().clean()
        if self.is_estudiante and not self.is_superuser:
            if not self.email.endswith("@inacapmail.cl"):
                raise ValidationError("Debe usar un correo institucional @inacapmail.cl") """

    def __str__(self):
        return self.email
