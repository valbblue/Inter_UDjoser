# test_email.py
import os
import django

# Configura Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'interu_backend.settings')
django.setup()

from django.core.mail import send_mail

print("="*60)
print("INICIANDO PRUEBA DE EMAIL...")
print("="*60)

try:
    print("1. Enviando email...")
    send_mail(
        'PRUEBA SMTP Inter-U',
        'Si ves esto, SMTP funciona correctamente.',
        'interusihu@gmail.com',
        ['interusihu@gmail.com'],  # Enviar a ti mismo
        fail_silently=False,
    )
    print("✅ EMAIL ENVIADO CON ÉXITO")
    print("2. Revisa tu bandeja de interusihu@gmail.com (incluido Spam)")
    print("="*60)
except Exception as e:
    print(f"❌ ERROR CRÍTICO: {e}")
    print(f"TIPO DE ERROR: {type(e).__name__}")
    print("="*60)