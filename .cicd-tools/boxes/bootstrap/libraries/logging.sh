#!/bin/bash

# Library for logging functions and commands.
# The LOGGING_LEVEL environment variable controls verbosity.

set -eo pipefail

# shellcheck source=/dev/null
source "$(dirname -- "${BASH_SOURCE[0]}")/colours.sh"

LOGGING_LEVEL=${LOGGING_LEVEL-"DEBUG"}

function log() {
  # USAGE:
  # colour bg [CRITICAL|ERROR|WARNING|INFO|DEBUG] [MESSAGE CONTENTS]

  local LOGGING_SEVERITY_LEVELS=("DEBUG" "INFO" "WARNING" "ERROR" "CRITICAL")

  # shellcheck disable=SC2034
  local CRITICAL="RED"
  # shellcheck disable=SC2034
  local ERROR="RED"
  # shellcheck disable=SC2034
  local WARNING="YELLOW"
  # shellcheck disable=SC2034
  local INFO="GREEN"
  # shellcheck disable=SC2034
  local DEBUG="CYAN"
  # shellcheck disable=SC2034

  local LOGGING_MESSAGE_LEVEL="${1}"
  local MESSAGE_CONTENT="${2}"

  if [[ -z "${!LOGGING_LEVEL}" ]] ||
    [[ -z "${MESSAGE_CONTENT}" ]]; then
    log "ERROR" "Invalid logging statement!"
    return 127
  fi

  if [[ "$(_log_get_severity_level "${LOGGING_MESSAGE_LEVEL}")" -ge "$(_log_get_severity_level "${LOGGING_LEVEL}")" ]]; then
    echo "[$(date -u)] [$(colour fg "${!LOGGING_MESSAGE_LEVEL}")${LOGGING_MESSAGE_LEVEL}$(colour clear)] ${MESSAGE_CONTENT}" >> /dev/stderr
  fi

}

function _log_get_severity_level() {
  #1: The severity type as a string.
  local LOGGIN_SEVERITY_LEVEL
  for LOGGIN_SEVERITY_LEVEL in "${!LOGGING_SEVERITY_LEVELS[@]}"; do
    if [[ "${LOGGING_SEVERITY_LEVELS["${LOGGIN_SEVERITY_LEVEL}"]}" = "${1}" ]]; then
      echo "${LOGGIN_SEVERITY_LEVEL}"
    fi
  done
}
