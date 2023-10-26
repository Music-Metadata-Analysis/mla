#!/bin/bash

# Commitizen 'pre_bump_hook' script to make TOML quotes compatible with tomll.

# Commitizen pre_bump_hook script only.

set -eo pipefail

main() {
  # sed compatible with Linux and BSD
  sed -i.bak "s,\"${CZ_PRE_NEW_VERSION}\",'${CZ_PRE_NEW_VERSION}',g" pyproject.toml
  rm pyproject.toml.bak
}

main
