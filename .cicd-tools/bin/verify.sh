#!/bin/bash

# Remote gpg key verification.
# Requires gpg binary: https://gnupg.org/

# CICD-Tools script.

set -eo pipefail

# shellcheck source=./.cicd-tools/boxes/bootstrap/libraries/logging.sh
source "$(dirname -- "${BASH_SOURCE[0]}")/../boxes/bootstrap/libraries/logging.sh"

main() {
  local CICD_TOOLS_GPG_KEY

  _verify_args "$@"
  _verify_check_key
  _verify_trust_key
}

_verify_args() {
  while getopts "k:" OPTION; do
    case "$OPTION" in
      k)
        CICD_TOOLS_GPG_KEY="${OPTARG}"
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

  if [[ -z "${CICD_TOOLS_GPG_KEY}" ]]; then
    _verify_usage
  fi
}

_verify_check_key() {
  gpg \
    --verify "$(dirname -- "${BASH_SOURCE[0]}")/../pgp/verification.sign" \
    "$(dirname -- "${BASH_SOURCE[0]}")/../pgp/verification.txt"
}

_verify_trust_key() {
  echo "${CICD_TOOLS_GPG_KEY}:6:" | gpg --import-ownertrust
}

_verify_usage() {
  log "ERROR" "verify.sh -- verify the CICD-Tools gpg key."
  log "ERROR" "USAGE: verify.sh -k [GPG KEY ID]"
  exit 127
}

main "$@"
