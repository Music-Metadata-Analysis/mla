#!/bin/bash

# Manifest file reader.
# Requires the jq binary: https://stedolan.github.io/jq/download/

# CICD-Tools script.

set -eo pipefail

# shellcheck source=./.cicd-tools/boxes/bootstrap/libraries/logging.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/../boxes/bootstrap/libraries/logging.sh"

manifest() {
  local MANIFEST_FILE
  _manifest_args "$@"
}

_manifest_args() {
  while getopts "m:" OPTION; do
    case "$OPTION" in
      m)
        MANIFEST_FILE="${OPTARG}"
        ;;
      \?)
        _manifest_usage
        ;;
      :)
        _manifest_usage
        ;;
      *)
        _manifest_usage
        ;;
    esac
  done
  shift $((OPTIND - 1))
  if [[ -z "${MANIFEST_FILE}" ]]; then
    _manifest_usage
  fi
  _manifest_commands "$@"
}

_manifest_commands() {
  case "$1" in
    security)
      [[ -n "${2}" ]] && _manifest_usage
      log "DEBUG" "MANIFEST > Reading security status from manifest."
      _manifest_security
      ;;
    toolbox_url)
      [[ -z "${2}" ]] && _manifest_usage
      log "DEBUG" "MANIFEST > Reading toolbox url for '${2}' from manifest."
      _manifest_toolbox_url "${2}"
      ;;
    toolbox_sha)
      [[ -z "${2}" ]] && _manifest_usage
      log "DEBUG" "MANIFEST > Reading toolbox checksum for '${2}' from manifest."
      _manifest_toolbox_sha "${2}"
      ;;
    *)
      _manifest_usage
      ;;
  esac
}

_manifest_usage() {
  log "ERROR" "manifest.sh -- interact with the CICD-Tools manifest file."
  log "ERROR" "USAGE: manifest.sh -p [PATH TO MANIFEST] [COMMAND]"
  log "ERROR" "  COMMANDS:"
  log "ERROR" "  toolbox_url [VERSION]   - Retrieves the URL of the given toolbox version."
  log "ERROR" "  toolbox_sha [FILENAME]  - Retrieves the checksum of the given file."
  log "ERROR" "  security                - Indicates if hash validation is enabled or disabled."
  exit 127
}

_manifest_security() {
  jq -rM ".disable_security" "${MANIFEST_FILE}"
}

_manifest_toolbox_prefix() {
  local REMOTE_SHA
  local REMOTE_SOURCE
  local REMOTE_PATH
  REMOTE_SHA="$(jq -erM '.version' "${MANIFEST_FILE}")"
  REMOTE_SOURCE="$(jq -erM '.source' "${MANIFEST_FILE}")"
  REMOTE_PATH="$(jq -erM '.toolbox_path' "${MANIFEST_FILE}")"
  echo "${REMOTE_SOURCE}/${REMOTE_SHA}/${REMOTE_PATH}"
}

_manifest_toolbox_is_present() {
  jq --arg version "${1}.tar.gz" -erM '.manifest[$version]' "${MANIFEST_FILE}"
}

_manifest_toolbox_url() {
  if ! _manifest_toolbox_is_present "${1}" > /dev/null; then
    log "ERROR" "MANIFEST > Toolbox version '${1}' is not in the manifest."
    exit 127
  fi
  echo "$(_manifest_toolbox_prefix)/${1}.tar.gz"
}

_manifest_toolbox_sha() {
  if ! _manifest_toolbox_is_present "${1}" > /dev/null; then
    log "ERROR" "MANIFEST > Toolbox version '${1}' is not in the manifest."
    exit 127
  fi
  jq --arg version "${1}.tar.gz" -erM '.manifest[$version]' "${MANIFEST_FILE}"
}

manifest "$@"
