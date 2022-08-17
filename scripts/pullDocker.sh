#!/bin/bash

for s in $(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:ap-northeast-2:231159564116:secret:DockerHubSecret-kjRgny --query 'SecretString' --output text | jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" ); do
  export $s
done
DOCKERHUB_USERNAME=$dockerhub_username
DOCKERHUB_PASSWORD=$dockerhub_password
DOCKERHUB_IMAGE_NAME=$dockerhub_image_name
# docker login

docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD

echo "DOCKERHUB_USERNAME=$DOCKERHUB_USERNAME" >> .env
echo "DOCKERHUB_IMAGE_NAME=$DOCKERHUB_IMAGE_NAME" >> .env

source .env
docker-compose --env-file .env -f /deploy/docker-compose.yml pull
