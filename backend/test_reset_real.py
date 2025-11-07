# test_reset_real.py
import requests

response = requests.post(
    "http://127.0.0.1:8000/api/auth/users/reset_password/",
    json={"email": "alicia.norambuena@inacapmail.cl"}
)

print(f"Status: {response.status_code}")
if response.status_code == 204:
    print("✅ Email de reset enviado - Revisa interusihu@gmail.com (Spam/Promociones)")
else:
    print(f"Error: {response.text}")