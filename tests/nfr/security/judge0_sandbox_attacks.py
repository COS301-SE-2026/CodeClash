import boto3
import requests 
import time 
import os
from dotenv import load_dotenv, dotenv_values


load_dotenv()

API_URL = os.getenv("API_URL")
TOKEN = ""


def get_test_token(username, password):
    client = boto3.client("cognito-idp", region_name="eu-north-1")
    resp = client.initiate.auth(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        AuthFlow="USER_AUTH",
        AuthParameters={
            "USERNAME": username,
            "PREFERRED_CHALLENGE" : "PASSWORD",
        },
    )