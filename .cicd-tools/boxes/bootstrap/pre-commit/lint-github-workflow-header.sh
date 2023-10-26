#!/bin/bash

# Verifies the correct headers are present on GitHub workflow files.

# @:  An array of GitHub workflow files to lint.

# pre-commit script.

set -eo pipefail

# shellcheck source=/dev/null
source "$(dirname -- "${BASH_SOURCE[0]}")/../libraries/logging.sh"

main() {
  for WORKFLOW_FILE_PATH in "$@"; do

    log "INFO" "Checking header for: '${WORKFLOW_FILE_PATH}' ... "

    WORKFLOW_BASENAME="$(basename "${WORKFLOW_FILE_PATH}")"

    log "DEBUG" "Basename: '${WORKFLOW_BASENAME}' ... "

    if [[ "${WORKFLOW_BASENAME}" == job-* ]]; then
      log "DEBUG" "Checking Job Header ..."
      HEADER_NAME="$(echo "${WORKFLOW_BASENAME}" | cut -d. -f1)"
    else
      log "DEBUG" "Checking Workflow Header ..."
      HEADER_NAME=".+-github-$(echo "${WORKFLOW_BASENAME}" | cut -d. -f1)"
    fi

    if ! grep -E "^name: ${HEADER_NAME}$" "${WORKFLOW_FILE_PATH}" >> /dev/null; then
      log "ERROR" "Incorrect Header on '${WORKFLOW_FILE_PATH}'"
      log "ERROR" "EXPECTED PATTERN: ^${HEADER_NAME}$"
      exit 127
    fi

  done
}

main "$@"
