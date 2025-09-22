#!/bin/bash

REQUIRED_AUTHOR="Niall Byrne"
REQUIRED_AUTHOR_EMAIL="nbyrne416@gmail.com"

main() {
  git config user.name "${REQUIRED_AUTHOR}"
  git config user.email "${REQUIRED_AUTHOR_EMAIL}"

  echo "VERCEL DEPLOYMENT" > DEPLOYMENT
  git stage DEPLOYMENT
  git commit -m "ci(VERCEL): latest deployment to vercel"
}

main
