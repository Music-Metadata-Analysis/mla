#!/bin/bash


set -eo pipefail

main() {
  
  # Enforce Analytics Framework Isolation
  ! grep -E -r "react-ga" src | grep -E -v "src/clients/analytics" || false

  # Enforce Auth Framework Isolation
  ! grep -E -r "next-auth" src | grep -E -v "src/clients/auth|src/backend/integrations/auth" || false

  # Enforce Flag Framework Isolation
  ! grep -E -r "flagsmith" src | grep -E -v "src/clients/flags|src/backend/integrations/flags" || false

  # Enforce Lastfm Framework Isolation
  ! grep -E -r "@toplast/lastfm" src | grep -E -v "src/backend/integrations/lastfm|src/tests/api/.*end2end.*" || false

  # Enforce Locale Framework Isolation
  ! grep -E -r "next-i18next" src | grep -E -v "src/clients/locale" || false

  # Enforce Persistance Framework Isolation
  ! grep -E -r "@aws-sdk/client-s3" src | grep -E -v "src/backend/integrations/persistance" || false

  # Enforce UI Framework Isolation
  # In Progress...
  #! grep -E -r "@chakra-ui" src | grep -E -v "component.ts|component.test.ts|src/clients/ui.framework" || false

  # Enforce Web Framework Isolation
  ! grep -E -r "next/" src | grep -E -v "next-i18next" | grep -E -v "src/clients/web.framework|src/tests/_app.page.components.test.tsx|src/tests/_document.page.components.test.tsx|_document.tsx|_app.tsx" || false


}

main "$@"
