#!/bin/bash

# Library for enforcing optional and mandatory environment variables.

set -eo pipefail

# shellcheck source=/dev/null
source "$(dirname -- "${BASH_SOURCE[0]}")/logging.sh"

environment() {
  local MANDATORY=()
  local OPTIONAL=()
  local DEFAULTS=()

  log "DEBUG" "${BASH_SOURCE[0]} '$*'"

  _environment_args "$@"
  _environment_defaults
}

_environment_args() {
  while getopts "m:o:d:" OPTION; do
    case "$OPTION" in
      m)
        _environment_parse_mandatory "${OPTARG}"
        ;;
      o)
        _environment_parse_optional "${OPTARG}"
        ;;
      d)
        _environment_parse_defaults "${OPTARG}"
        ;;
      \?)
        _environment_usage
        ;;
      :)
        _environment_usage
        ;;
    esac
  done

  if [[ "${#OPTIONAL[@]}" -ne "${#DEFAULTS[@]}" ]]; then
    log "ERROR" "ENVIRONMENT > You must specify the same number of DEFAULT values and OPTIONAL environment variables!"
    exit 127
  fi
}

_environment_defaults() {
  log "DEBUG" "ENVIRONMENT > Setting DEFAULT environment variable values."
  local INDEX=-1
  for VARIABLE in "${DEFAULTS[@]}"; do
    ((INDEX++)) || true
    if [[ -z "${!OPTIONAL[${INDEX}]}" ]]; then
      export "${OPTIONAL[${INDEX}]}"
      eval "${OPTIONAL[${INDEX}]}"="${DEFAULTS[${INDEX}]}"
      log "INFO" "ENVIRONMENT > Default: '${DEFAULTS[${INDEX}]}' is being used for: '${OPTIONAL[${INDEX}]}'."
    fi
  done
}

_environment_parse_mandatory() {
  log "DEBUG" "ENVIRONMENT > Parsing MANDATORY environment variables."
  # shellcheck disable=SC2034
  IFS=' ' read -r -a MANDATORY <<< "${1}"
  for VARIABLE in "${MANDATORY[@]}"; do
    if [[ -z ${!VARIABLE} ]]; then
      log "ERROR" "ENVIRONMENT > The environment variable '${VARIABLE}' is required!"
      exit 127
    fi
  done
}

_environment_parse_optional() {
  log "DEBUG" "ENVIRONMENT > Parsing OPTIONAL environment variables."
  # shellcheck disable=SC2034
  IFS=' ' read -r -a OPTIONAL <<< "${1}"
}

_environment_parse_defaults() {
  log "DEBUG" "ENVIRONMENT > Parsing DEFAULT environment variable values."
  # shellcheck disable=SC2034
  IFS=' ' read -r -a DEFAULTS <<< "${1}"
}

_environment_usage() {
  log "ERROR" "environment.sh -- enforce environment variables."
  log "ERROR" "USAGE: source environment.sh -m [MANDATORY] -o [OPTIONAL] -d [DEFAULTS]"
  log "ERROR" "  Multiple items should be specified as space separated quoted strings."
  exit 127
}

environment "$@"
