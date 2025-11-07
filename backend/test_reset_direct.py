# test_reset_direct.py
import requests

# Prueba con un email que SÍ existe
response = requests.post(
    "http://127.0.0.1:8000/api/auth/users/reset_password/",
    json={"email": "alicia.norambuena@inacapmail.cl"}
)

print(f"Status: {response.status_code}")
print(f"Headers: {response.headers}")
print(f"Text: {response.text}")

# Si es 204, revisa el backend EN LA MISMA CONSOLA donde corre runserver
# Deberías ver algo como:
# [06/Nov/2025 20:10:00] "POST /api/auth/users/reset_password/ HTTP/1.1" 204 0
# Y posiblemente un error SMTP debajo