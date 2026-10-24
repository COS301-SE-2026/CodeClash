import boto3
import sys
import requests 
import time 
import os
from dotenv import load_dotenv, dotenv_values, find_dotenv
from getpass import getpass

# i am uncertain if the below will work, must test
load_dotenv(find_dotenv('.env.test')) 

API_URL = os.getenv("API_URL")
TOKEN = ""

# username_input = input("Enter username to retrieve token for: ")
# password_input = input("Enter password to retrieve token for: ")


def get_test_token(username: str, password: str) -> str:
    client = boto3.client("cognito-idp", region_name="eu-north-1")
    resp = client.initiate_auth(
        ClientId=os.getenv("COGNITO_CLIENT_ID"),
        AuthFlow="USER_AUTH",
        AuthParameters={
            "USERNAME": username,
            "PASSWORD": password,
            "PREFERRED_CHALLENGE" : "PASSWORD",
        },
    )

#USER_AUTH requires a challenge first for authentication, and we chose responding with a password for authenticating

    if resp.get("ChallengeName") == "PASSWORD":
        challenge_resp = client.respond_to_auth_challenge(
            ClientId=os.getenv("COGNITO_CLIENT_ID"),
            ChallengeName="PASSWORD",
            Session=resp["SESSION"],
            ChallengeResponses={
                "USERNAME": username,
                "PASSWORD": password,
            },
        )
        return challenge_resp["AuthenticationResult"]["IdToken"]

    else:
        return resp["AuthenticationResult"]["IdToken"]

if __name__ == "__main__":
    if sys.stdin.isatty():
        print("Enter username to retrieve token for: ", end="", file=sys.stderr, flush=True)
        username_input = input()
        password_input = getpass("Enter password to retrieve token for: ")
    else:
        username_input = os.getenv("INTEGRATION_TEST_USER")
        password_input = os.getenv("INTEGRATION_TEST_PASS")
    
    token = get_test_token(username_input, password_input)
    print(token)
