#!/bin/bash

# Remote toolbox downloader.
# Requires gpg binary: https://gnupg.org/

# CICD-Tools script.

set -eo pipefail

TOOLBOX_PATH="$(pwd)/.cicd-tools"
TOOLBOX_REMOTES_FOLDER="boxes"
TOOLBOX_MANIFEST_FILE="${TOOLBOX_PATH}/manifest.json"

# shellcheck source=./.cicd-tools/boxes/bootstrap/libraries/logging.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/../boxes/bootstrap/libraries/logging.sh"

# shellcheck source=./.cicd-tools/boxes/bootstrap/libraries/environment.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/../boxes/bootstrap/libraries/environment.sh" \
  -o "DOWNLOAD_RETRIES DOWNLOAD_MAX_TIME" \
  -d "3 30"

main() {
  OPTIND=1

  local MANIFEST_ASC
  local MANIFEST_DISABLE_SECURITY="false"
  local TARGET_TOOLBOX_VERSION
  local TARGET_TOOLBOX_URL
  local TEMP_DIRECTORY

  TEMP_DIRECTORY="$(mktemp -d)"

  _toolbox_args "$@"
  _toolbox_manifest_download
  _toolbox_manifest_load
  _toolbox_box_download
  _toolbox_box_checksum
  _toolbox_box_install
}

_toolbox_args() {
  while getopts "b:m:r:t:" OPTION; do
    case "$OPTION" in
      b)
        TARGET_TOOLBOX_VERSION="${OPTARG}"
        TARGET_TOOLBOX_FILENAME="${TARGET_TOOLBOX_VERSION}.tar.gz"
        ;;
      m)
        MANIFEST_ASC="${OPTARG}"
        ;;
      r)
        DOWNLOAD_RETRIES="${OPTARG}"
        ;;
      t)
        DOWNLOAD_MAX_TIME="${OPTARG}"
        ;;
      \?)
        _toolbox_usage
        ;;
      :)
        _toolbox_usage
        ;;
      *)
        _toolbox_usage
        ;;
    esac
  done
  shift $((OPTIND - 1))

  if [[ -z "${TARGET_TOOLBOX_VERSION}" ]] ||
    [[ -z "${MANIFEST_ASC}" ]]; then
    _toolbox_usage
  fi
}

_toolbox_box_checksum() {
  pushd "${TEMP_DIRECTORY}" >> /dev/null
  if [[ "${MANIFEST_DISABLE_SECURITY}" == "false" ]]; then
    if ! echo "${TARGET_TOOLBOX_SHA}  ${TARGET_TOOLBOX_FILENAME}" | sha256sum -c; then
      log "ERROR" "CHECKSUM > Hash of remote file does not match!"
      log "ERROR" "CHECKSUM > Cannot proceed."
      exit 127
    else
      log "INFO" "CHECKSUM > Hash verification has passed."
    fi
  else
    log "WARNING" "CHECKSUM > The manifest has DISABLED all checksum validation."
  fi
  cp "${TARGET_TOOLBOX_FILENAME}" "${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}"
  popd >> /dev/null
}

_toolbox_box_download() {
  if [[ -f "${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}/${TARGET_TOOLBOX_FILENAME}" ]]; then
    mv "${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}/${TARGET_TOOLBOX_FILENAME}" "${TEMP_DIRECTORY}"
    log "INFO" "BOX > Toolbox Version ${TARGET_TOOLBOX_VERSION} has already been downloaded."
  else
    _toolbox_box_fetch
  fi
}

_toolbox_box_fetch() {
  log "DEBUG" "BOX > Target Toolbox Version: ${TARGET_TOOLBOX_VERSION}"
  log "DEBUG" "BOX > Target Toolbox SHA: ${TARGET_TOOLBOX_SHA}"
  log "DEBUG" "BOX > Target Toolbox URL: ${TARGET_TOOLBOX_URL}"

  mkdir -p "${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}"

  pushd "${TEMP_DIRECTORY}" >> /dev/null
  _toolbox_fetch "${TARGET_TOOLBOX_URL}" > "${TARGET_TOOLBOX_FILENAME}"
  popd >> /dev/null

  log "INFO" "BOX > Remote toolbox retrieved."
}

_toolbox_box_install() {
  pushd "${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}" >> /dev/null
  tar xvzf "${TARGET_TOOLBOX_FILENAME}"
  log "DEBUG" "BOX > Toolbox Version ${TARGET_TOOLBOX_VERSION} has been installed to ${TOOLBOX_PATH}/${TOOLBOX_REMOTES_FOLDER}."
  ln -sf "${TARGET_TOOLBOX_VERSION}" active
  log "INFO" "BOX > Toolbox Version ${TARGET_TOOLBOX_VERSION} has been activated."
  popd >> /dev/null
}

_toolbox_fetch() {
  # 1: url
  log "DEBUG" "FETCH > URL: ${1}"
  log "DEBUG" "FETCH > Retries: ${DOWNLOAD_RETRIES}"
  log "DEBUG" "FETCH > Max Time: ${DOWNLOAD_MAX_TIME}"

  set -x
  curl --fail \
    --location \
    --silent \
    --show-error \
    --retry "${DOWNLOAD_RETRIES}" \
    --retry-max-time "${DOWNLOAD_MAX_TIME}" \
    "${1}"
  { set +x; } 2> /dev/null

  log "DEBUG" "FETCH > Fetch complete."
}

_toolbox_manifest_download() {
  gpg --yes --output "${TOOLBOX_MANIFEST_FILE}" --verify <(_toolbox_fetch "${MANIFEST_ASC}")
  log "INFO" "MANIFEST > Remote manifest retrieved."
}

_toolbox_manifest_load() {
  TARGET_TOOLBOX_SHA="$(./.cicd-tools/bin/manifest.sh -m "${TOOLBOX_MANIFEST_FILE}" toolbox_sha "${TARGET_TOOLBOX_VERSION}")"
  MANIFEST_DISABLE_SECURITY="$(./.cicd-tools/bin/manifest.sh -m "${TOOLBOX_MANIFEST_FILE}" security)"
  TARGET_TOOLBOX_URL="$(./.cicd-tools/bin/manifest.sh -m "${TOOLBOX_MANIFEST_FILE}" toolbox_url "${TARGET_TOOLBOX_VERSION}")"
  log "INFO" "MANIFEST > Remote manifest loaded."
}

_toolbox_usage() {
  log "ERROR" "toolbox.sh -- download a remote toolbox from the CICD-Tools manifest."
  log "ERROR" "USAGE: toolbox.sh -b [TOOLBOX VERSION] -m [REMOTE MANIFEST URL]"
  log "ERROR" "  Optional: -r [OPTIONAL RETRY COUNT] -m [OPTIONAL MAX RETRY TIME]"
  exit 127
}

main "$@"
