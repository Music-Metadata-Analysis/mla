#!/bin/bash

# Runs vale on the specified commit message file, with the Git content filtered out.

# 1:  The Docker image and tag to use.
# 2:  The commit message file to lint.

# pre-commit script.

set -eo pipefail

# shellcheck source=/dev/null
source "$(dirname -- "${BASH_SOURCE[0]}")/../libraries/logging.sh"

main() {
  local PRECOMMIT_GIT_COMMIT_MESSAGE_FILE
  local PRECOMMIT_GIT_CONTENT_REGEX
  local PRECOMMIT_VALE_DOCKER_IMAGE

  PRECOMMIT_GIT_COMMIT_MESSAGE_FILE="${2}"
  PRECOMMIT_GIT_CONTENT_REGEX='/^#[[:blank:]]*.*$/d'
  PRECOMMIT_VALE_DOCKER_IMAGE="${1}"

  log "DEBUG" "PRE_COMMIT > Docker Image: '${PRECOMMIT_VALE_DOCKER_IMAGE}'"
  log "DEBUG" "PRE_COMMIT > Commit Message: '${PRECOMMIT_GIT_COMMIT_MESSAGE_FILE}'"
  sed "${PRECOMMIT_GIT_CONTENT_REGEX}" "${PRECOMMIT_GIT_COMMIT_MESSAGE_FILE}"
  log "DEBUG" "PRE_COMMIT > Running vale ..."
  sed "${PRECOMMIT_GIT_CONTENT_REGEX}" "${PRECOMMIT_GIT_COMMIT_MESSAGE_FILE}" |
    docker run -i --rm -v "$(pwd)":/mnt --workdir /mnt "${PRECOMMIT_VALE_DOCKER_IMAGE}" vale
  log "INFO" "PRE-COMMIT > Commit message spelling has passed!"
}

main "$@"
