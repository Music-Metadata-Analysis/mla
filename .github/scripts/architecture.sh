#!/bin/bash


set -eo pipefail

API_PATH_NAME_REGEX="([a-z0-9\./]+|\[[a-z0-9\./]+\])/"
API_ENDPOINT_NAME_REGEX="[A-Za-z0-9\./]+\.ts$|\[[A-Za-z0-9\./]+\]\.ts$"

PATH_NAME_REGEX="([a-z0-9\./]+/)"
FILENAME_REGEX="([a-z0-9\.]+)"

CLASS_FILENAME_REGEX="(${FILENAME_REGEX}+\.class\.(test\.)*ts)"
CLASS_MOCK_FILENAME_REGEX="(${FILENAME_REGEX}+\.class\.mock\.ts)"

COMPONENT_FILENAME_REGEX="src/components/${PATH_NAME_REGEX}+${FILENAME_REGEX}+\.(component|container|integration\.test|page|style)"

HOOK_DEFINITION_REGEX="const use[A-Z]+|function use[A-Z]+"
HOOK_FILENAME_REGEX="(${FILENAME_REGEX}+\.hook\.(test\.)*tsx)"
HOOK_FACTORY_REGEX="(${FILENAME_REGEX}+\.hook\.factory\.(test\.)*tsx)"
HOOK_MOCK_FILENAME_REGEX="(${FILENAME_REGEX}+\.hook\.mock\.tsx)"
HOOK_FULL_PATH_REGEX="src/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*(${HOOK_FILENAME_REGEX}|${HOOK_FACTORY_REGEX}):"
HOOK_MOCK_LOCATOR_REGEX="src/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*__mocks__/.*"
HOOK_MOCK_FULL_PATH_REGEX="src/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*__mocks__/(${CLASS_FILENAME_REGEX}|${CLASS_MOCK_FILENAME_REGEX}|${HOOK_FILENAME_REGEX}|${HOOK_MOCK_FILENAME_REGEX})"

TYPE_DEFINITION_WHITELIST_REGEX="tContentType|tFunctionType"

UI_FRAMEWORK_WHITELIST_REGEX="src/pages/_document\.tsx|src/tests/_document.*\.test\.tsx"
WEB_FRAMEWORK_WHITELIST_REGEX="_app.tsx|_document.tsx|src/tests/_app.page.components.test.tsx|src/tests/_document.page.components.test.tsx"

allows() {
  excludes "$1"
}

error_decoupling() {
  (echo "** $1 framework usage is not decoupled." && false)
}

error_naming_convention() {
  (echo "** File Naming convention violation." && false)
}

error_type_imports() {
  (echo "** Type import violation." && false)
}

error_restricted() {
  (echo "This component has a restricted set of dependencies." && false)
}


excludes() {
  grep -Ev "$1"
}

includes() {
  grep -E "$1"
}

search() {
  grep -Er "$1" "$2"
}

excludes_vendor_locations() {
  excludes "src/clients/$1|src/backend/api/integrations/$1|src/vendors/integrations/$1" 
}

main() {

  echo "*** Architecture Enforcement ***"

  echo "Component Decoupling ..."

  # Enforce API Component Isolation (No imports from API unless deliberately exported.)
  echo "  Checking Imports from the BACKEND/API Component..."
  ! search 'from "@src/backend/api/.+' src        | 
    excludes "^src/backend/api/"                  |
    excludes 'from "@src/backend/api/exports'     || 
    (echo "API elements should not be imported unless deliberately exported." && false)

  echo "  Checking Imports into the BACKEND/API Component..."
  ! search 'from "@src/.+' src/backend/api      | 
    allows 'from "@src/backend/api/.+'          |
    allows 'from "@src/__mocks__/.+'            |    
    allows 'from "@src/contracts/.+'            |
    allows 'from "@src/types/.+'                | # Generic Types Can Be Used
    allows 'from "@src/utils/.+'                |
    allows 'from "@src/__mocks__/.+'            |    
    allows 'from "@src/config/.+'               ||
    error_restricted

  echo "  Checking Imports into the CONTRACTS Component..."
  ! search 'from "@src/.+' src/contracts        | 
    allows 'from "@src/contracts/.+'            ||
    error_restricted

  echo "  Checking Imports into the VENDORS Component..."
  ! search 'from "@src/.+' src/vendors          | 
    allows 'from "@src/vendors/.+'              |
    allows 'from "@src/config/.+'               |
    allows 'from "@src/contracts/.+'            |    
    allows 'from "@src/hooks/.+'                |   # Add to UTILITIES component   
    allows 'from "@src/tests/.+'                |   # Create a FIXTURES component
    allows 'from "@src/utils/.+'                ||
    error_restricted

  # Enforce Contracts Component Isolation (No imports from Contracts unless deliberately exported.)
  echo "  Checking Imports from the CONTRACTS Component..."
  ! search 'from "@src/contracts/api/.+' src      | 
    excludes "^src/contracts/api/"                |
    excludes 'from "@src/contracts/api/exports'   || 
    (echo "CONTRACTS elements should not be imported unless deliberately exported." && false)

  # Enforce WEB Component Isolation (No imports into WEB except from designated points.)
  echo "  Checking Imports into the FRONTEND/WEB Component..."
  ! search 'from "(@src/contracts/api.+|@src/backend/.+)' src      | 
    excludes "^src/backend/"                                    |
    excludes "^src/config/"                                     |
    excludes "^src/contracts/"                                  |
    excludes "^src/pages/"                                      |
    excludes "^src/tests/api/"                                  |
    excludes "^src/tests/_app\..+"                              |
    excludes "^src/types/clients/api"                           |
    excludes "^src/types/reports/"                              ||
    (echo "WEB should not be importing directly from external components." && false)

  echo "Framework Decoupling..."

  # Enforce Analytics Framework Isolation
  echo "  Checking Analytics Framework Isolation..."
  ! search 'from "react-ga' src | 
    excludes_vendor_locations "analytics" || 
    error_decoupling "Analytics"

  # Enforce API Handler Framework Isolation
  echo "  Checking API Handler Framework Isolation..."
  ! search 'from "next-connect"' src | 
    excludes_vendor_locations "api.handler" || 
    error_decoupling "API Handler"

 # Enforce Auth Framework Isolation
  echo "  Checking Auth Framework Isolation..."
  ! search 'from "next-auth' src | 
    excludes_vendor_locations "auth" || 
    error_decoupling "Auth"

  # Enforce Flag Framework Isolation
  echo "  Checking Feature Flags Framework Isolation..."
  ! search 'from "flagsmith' src | 
    excludes_vendor_locations "flags" || 
    error_decoupling "Feature Flags"

  # Enforce Lastfm Framework Isolation
  echo "  Checking Lastfm Framework Isolation..."
  #! search 'from "@toplast/lastfm' src | excludes_vendor_locations "lastfm" || error_decoupling "Last FM"

  # Enforce Lastfm Scraper Framework Isolation
  echo "  Checking Lastfm Scraper Framework Isolation..."
  ! search 'from "cheerio' src | 
    excludes_vendor_locations "lastfm" || 
    error_decoupling "Last FM Scraper"

  # Enforce Locale Framework Isolation
  echo "  Checking Locale Framework Isolation..."
  ! search 'from "next-i18next' src | 
    excludes_vendor_locations "locale" || 
    error_decoupling "Locale"

  # Enforce Persistence Framework Isolation
  echo "  Checking Persistence Framework Isolation..."
  ! search 'from "@aws-sdk' src | 
    excludes_vendor_locations "persistence" || 
    error_decoupling "Persistence"

  # Enforce UI Framework Isolation
  echo "  Checking UI Framework Isolation..."
  ! search 'from "@chakra-ui' src | 
    excludes_vendor_locations "ui.framework" | 
    excludes "${UI_FRAMEWORK_WHITELIST_REGEX}" | 
    excludes "${COMPONENT_FILENAME_REGEX}" || 
    error_decoupling "UI"

  # Enforce Web Framework Isolation
  echo "  Checking Web Framework Isolation..."
  ! search 'from "next"|^import .+ from "next/' src | 
    excludes "${WEB_FRAMEWORK_WHITELIST_REGEX}" | 
    excludes_vendor_locations "web.framework" | 
    excludes_vendor_locations "api.framework" || 
    error_decoupling "WEB"
  
  # Enforce Separation of Business Logic (No hook usage inside component level files.)
  echo "  Checking Hook Usage Patterns..."
  ! search " = use" src  | 
    excludes_vendor_locations "ui.framework" | 
    includes "component\.ts" | 
    excludes "useColour" || 
    false

  echo "File Name Conventions..."

  # Enforce General Naming Convention (lowercase, . seperator)
  echo "  Checking General Naming Conventions..."
  ! find src -type f | 
    excludes "^src/pages/api|^src/tests/api" | 
    excludes "^src/(${PATH_NAME_REGEX})+${FILENAME_REGEX}|.DS_Store|__mocks__|_app|_document" || 
    error_naming_convention
  
  # Enforce API Naming Convention (paths are lower case, with square brackets, endpoints are camel case with brackets)
  echo "  Checking Pages Naming Conventions..."
  ! find src/pages/api -type f | 
    excludes "^src/pages/api/(${API_PATH_NAME_REGEX})+${API_ENDPOINT_NAME_REGEX}" || 
    error_naming_convention

  # Component File Naming Convention
  echo "  Checking Component File Naming Conventions..."
  ! find src/components -type f -regex ".*tsx$" | 
    excludes "(${HOOK_FILENAME_REGEX}|${HOOK_MOCK_FILENAME_REGEX})" | 
    excludes "${COMPONENT_FILENAME_REGEX}" || 
    false

  # Enforce Hook Naming Conventions
  echo "  Checking Hook Naming Conventions..."
  ! search "${HOOK_DEFINITION_REGEX}" {src/hooks,src/components} | 
    excludes "${HOOK_FULL_PATH_REGEX}" || 
    error_naming_convention

  # Enforce Hook Naming Conventions
  echo "  Checking Hook Mock Naming Conventions..."
  ! find src -type f | includes "${HOOK_MOCK_LOCATOR_REGEX}" | 
    excludes "${HOOK_MOCK_FULL_PATH_REGEX}" || 
    error_naming_convention

  echo "Type Definitions..."

  # Enforce Hook Type Exports (Must export it's own type definition.)
  echo "  Checking Hook Exports..."
  readarray -t HOOK_FILES < <(search "${HOOK_DEFINITION_REGEX}" {src/hooks,src/components} | cut -d":" -f1)
  for HOOK_FILE in "${HOOK_FILES[@]}"; do
    ! search "^export type" "$HOOK_FILE" > /dev/null && 
    echo "${HOOK_FILE}: missing hook type export"
  done

  # Enforce Type Definition Flow (No references to vendor types directly.)
  echo "  Checking Vendor Type Imports..."
  readarray -t IMPORT_FILES < <(search 'from "(@src/clients/.+|@src/backend/api/integrations.+)' src | cut -d":" -f1 | excludes "^src/types|^src/backend/api/types")
  for IMPORT_FILE in "${IMPORT_FILES[@]}"; do
    ! tr -d '\n'  < "$IMPORT_FILE" | 
      grep -Eo '(import type .*? from \"(@src/clients/.+|@src/backend/api/integrations.+))' > /dev/null || 
      (echo "${IMPORT_FILE}: should not be importing types directly from a vendor folder." && exit 1) || 
      false
  done

  # Enforce Vendor Type Exports (Must be named consistenly: [vendor type]Vendor[type name](Interface|Type))
  echo "  Checking Vendor Type Definitions..."
  readarray -t VENDOR_TYPE_FILES < <(find {src/types,src/backend/api/types} | grep "vendor.types.ts" | cut -d":" -f1)
  for VENDOR_TYPE_FILE in "${VENDOR_TYPE_FILES[@]}"; do
    ! tr -d '\n' < "$VENDOR_TYPE_FILE" | 
      grep -Eo "((export|import )*type [A-Za-z]+)|(export )*interface ([A-Z]{1}[A-Za-z]+) {|export type \{(.+?)\}" |
      sed 's/export//g'                             | 
      sed 's/interface//g'                          | 
      sed 's/type//g'                               |
      tr , '\n'                                     |
      tr -d " "                                     |
      tr -d "{"                                     | 
      tr -d "}"                                     |
      sed '/^$/d'                                   |
      excludes "import"                             |
      excludes "${TYPE_DEFINITION_WHITELIST_REGEX}" |
      excludes "[A-Z]{1}[a-zA-Z]+Vendor([a-zA-Z]+)*(Interface|Props|Type){1}" ||
      (echo "WARN: ${VENDOR_TYPE_FILE}: has improperly formatted types defined") || 
      false
  done

  echo "*** Complete ***"

}


main "$@"
