import time
import math
import base64
import token
from wsgiref import headers
import requests
from datetime import datetime
from requests.auth import HTTPBasicAuth


consumer_key="R7YAQpGwXUNgGCGG6d4wE6oa0GWAHjhYC1GSr1DeM5Px9Qtr"
consumer_secret="Ba8hh6i9UWKrcEAxqxkAcP9Xc15LLMHuNkdAAdLp6fHrNUAHcXYEZhfNZyRcF6SF"
saf_short_code="174379"
saf_stk_push_url="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
saf_api_url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
saf_passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
saf_callback_url = "https://mydomain.com/mpesa-express-simulate/"  # Replace with your actual callback URL

# time will be sent to stk push as part of the password, so we need to generate it in the format yyyymmddhhmmss
# the request is for sending http like axios
# math is for converting into an integer
# base 64 is for hashing for security
# http basicAuth is used to get token for authentication


def get_mpesa_access_token():
    try:
        res = requests.get(
            saf_api_url,
            auth=HTTPBasicAuth(consumer_key, consumer_secret),
        )
        token = res.json()['access_token']

       
    except Exception as e:
        print(str(e), "error getting access token")
        raise e

    return token

myToken = get_mpesa_access_token()
print(myToken)

headers = {
            "Authorization": f"Bearer {myToken}",
            "Content-Type": "application/json"
        }

timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
def generate_password():
    
        password_str = saf_short_code + saf_passkey + timestamp
        password_bytes = password_str.encode()

        return base64.b64encode(password_bytes).decode("utf-8")

password = generate_password()
print(password)

def make_stk_push( payload):
        amount = payload['amount']
        phone_number = payload['phone_number']

        push_data = {
            "BusinessShortCode": saf_short_code,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": math.ceil(float(amount)),
            "PartyA": phone_number,
            "PartyB": saf_short_code,
            "PhoneNumber": phone_number,
            "CallBackURL": saf_callback_url,
            "AccountReference": "Whatever you call your app",
            "TransactionDesc": "description of the transaction",
        }

        response = requests.post(
            saf_stk_push_url,
            json=push_data,
            headers=headers)

        response_data = response.json()

        return response_data

make_stk_push({
    "amount": 1,
    "phone_number": "254792213329"
})