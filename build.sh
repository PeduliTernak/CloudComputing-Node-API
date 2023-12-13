#!/bin/bash

# chmod +x build.sh

gcloud builds submit --config=cloudbuild.yaml
