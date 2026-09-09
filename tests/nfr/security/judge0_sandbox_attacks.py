import boto3
import requests 
import time 

API_URL = "http://localhost:3001/api/"
TOKEN = ""


def get_test_token(username, password, client_id):
    client = boto3.client("cognito-idp", region_name="eu-north-1")