import boto3
import requests 
import time 
import os
from dotenv import load_dotenv, dotenv_values

# i am uncertain if the below will work, must test
load_dotenv(find_dotenv('.env.test')) 

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

#USER_AUTH requires a challenge first for authentication, and we chose responding with a password for authenticating

if resp.get("ChallengeName") == "PASSWORD":
    challenge_resp = client.respond_to_auth_challenge(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        ChallengeName="PASSWORD",
        
    )