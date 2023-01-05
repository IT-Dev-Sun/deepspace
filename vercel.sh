#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_ENV: $VERCEL_ENV"
echo "NEXT_PUBLIC_ENVIRONMENT: $NEXT_PUBLIC_ENVIRONMENT"
echo "BUILD_REPO: $BUILD_REPO"

if [[ "$VERCEL_GIT_COMMIT_REF" == "$BUILD_REPO" ]] ; then
  # Proceed with the build
    echo "Build can proceed"
  exit 1;

else
  # Don't build
  echo "Build cancelled"
  exit 0;
fi
