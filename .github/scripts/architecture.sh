#!/bin/bash

# Takes a single argument
# Path to enforce architecture rules on: <ARG1>

set -eo pipefail

main() {
  
  # Enforce UI Separation

    # Limit hooks inside 'components' to useColour only.
    ! grep -r "= use" "$1"  | grep "component.ts" | grep -v useColour || false

    # Limit '@chakra-ui' imports to 'components'
    ! grep -r "@chakra-ui" "$1"  | grep "container.ts" || false

}

main "$@"
