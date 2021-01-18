#!/bin/bash -e

if aws s3api head-bucket --bucket "${BUCKET_NAME}" 2>/dev/null; then
  echo "### Bucket exists: $BUCKET_NAME"
else
  echo "### Bucket does not exist, creating: ${BUCKET_NAME}"
  aws s3 mb s3://"${BUCKET_NAME}"
  aws s3api put-bucket-cors --bucket "${BUCKET_NAME}" --cors-configuration file://./bucket-cors.json
fi

LAMBDA_FUNCTIONS=$(aws lambda list-functions)
PARLAY_GENERATOR_LAMBDA=$(echo "$LAMBDA_FUNCTIONS" | jq -r '.Functions[] | select(.FunctionName | contains("ParlayGeneratorFunction"))' | jq '.FunctionName')

echo "### Creating environment variables..."
{
  echo "AWS_KEY=$AWS_ACCESS_KEY_ID"
  echo "AWS_SECRET=$AWS_SECRET_ACCESS_KEY"
  echo "PARLAY_GENERATOR_LAMBDA=$PARLAY_GENERATOR_LAMBDA"
} >.env
cat .env

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILE_NAME="sportsbook-scraper-$TIMESTAMP.zip"

zip -r -qq "$FILE_NAME" build node_modules .env
echo "### Zipped $FILE_NAME successfully."

aws s3 rm "s3://${BUCKET_NAME}" --recursive --exclude "*" --include "*.zip"
aws s3 cp "${FILE_NAME}" "s3://${BUCKET_NAME}/"

echo "### Initiating Cloudformation Deploy..."
STACK_NAME="sportsbook-scraper-stack"

if aws cloudformation describe-stacks --stack-name "${STACK_NAME}"; then
  echo "Updating stack..."
  aws cloudformation update-stack \
    --stack-name "${STACK_NAME}" \
    --template-body file://./template.yaml \
    --capabilities CAPABILITY_IAM \
    --parameters ParameterKey=BucketName,ParameterValue="${BUCKET_NAME}" ParameterKey=CodeKey,ParameterValue="${FILE_NAME}"
else
  echo "Creating stack..."
  aws cloudformation create-stack \
    --stack-name "${STACK_NAME}" \
    --template-body file://./template.yaml \
    --capabilities CAPABILITY_IAM \
    --parameters ParameterKey=BucketName,ParameterValue="${BUCKET_NAME}" ParameterKey=CodeKey,ParameterValue="${FILE_NAME}"
fi
