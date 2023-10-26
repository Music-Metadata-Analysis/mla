#!/bin/bash

# Library for reading the CICD-Tools manifest.

# CICD_TOOLS_COLOUR_DISABLE:  Optionally disable coloured messages.

set -eo pipefail

# shellcheck disable=SC2034
colour() {
  local PREFIX
  local COMMAND

  local BLACK=0
  local RED=1
  local GREEN=2
  local YELLOW=3
  local BLUE=4
  local PURPLE=5
  local CYAN=6
  local WHITE=7

  if [[ -z "${CICD_TOOLS_COLOUR_DISABLE}" ]]; then
    PREFIX="_colour"
    COMMAND="${PREFIX}_${1}"
    if [[ $(type -t "${COMMAND}") == function ]]; then
      shift
      "${COMMAND}" "$@"
    else
      "${PREFIX}_usage"
    fi
  fi
}

_colour_bg() {
  tput setab "${!1}" 2> /dev/null
}

_colour_bold() {
  tput setab bold 2> /dev/null
}

_colour_fg() {
  tput setaf "${!1}" 2> /dev/null
}

_colour_clear() {
  tput sgr0 2> /dev/null
}

_colour_usage() {
  {
    echo "colour.sh -- set the desired terminal colour."
    echo "USAGE: colour.sh [COMMAND]"
    echo "  COMMANDS:"
    echo "  bg [BLACK|RED|GREEN|YELLOW|BLUE|PURPLE|CYAN|WHITE]   -- set background colour"
    echo "  bold                                                 -- set bold text"
    echo "  fg [BLACK|RED|GREEN|YELLOW|BLUE|PURPLE|CYAN|WHITE]   -- set foreground colour"
    echo "  clear                                                -- set default terminal colours"
  } >> /dev/stderr
}
