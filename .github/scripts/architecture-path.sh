#!/bin/bash

# Takes a single argument
# Path to enforce architecture rules on: <ARG1>

set -eo pipefail

main() {
  
  # Enforce UI Separation Progressively

    # Limit hooks inside 'components' to useColour only.
    ! grep -E -r "= use" "$1"  | grep -E "component.ts" | grep -E -v useColour || false

    # Limit '@chakra-ui' imports to 'components', 'styles' and relevant tests
    ! grep -E -r "@chakra-ui" "$1" | grep -E -v "component.ts|component.test.ts|integration.test.ts|style.ts" || false

}

main "$@"
