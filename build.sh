#!/bin/bash

# chmod +x build.sh

gcloud auth configure-docker asia-southeast2-docker.pkg.dev &&
docker build -t asia-southeast2-docker.pkg.dev/peduli-ternak/node-api-repo/node-api . && \
docker push asia-southeast2-docker.pkg.dev/peduli-ternak/node-api-repo/node-api && \
gcloud config set run/region asia-southeast2 && \
gcloud run deploy node-api \
  --image=asia-southeast2-docker.pkg.dev/peduli-ternak/node-api-repo/node-api \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=3
