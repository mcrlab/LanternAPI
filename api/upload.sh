#!/bin/bash

echo Login to ECR
eval $(aws ecr get-login --no-include-email --region $REGION)

echo Docker Build and Push
docker build -t $REPO:latest --build-arg HOST=$HOST --build-arg CLIENT=$CLIENT  --no-cache=true .
docker push $REPO:latest
