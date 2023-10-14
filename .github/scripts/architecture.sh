#!/bin/bash


set -eo pipefail

API_PATH_NAME_REGEX="([a-z0-9\./]+|\[[a-z0-9\./]+\])/"
API_ENDPOINT_NAME_REGEX="[A-Za-z0-9\./]+\.ts$|\[[A-Za-z0-9\./]+\]\.ts$"

PATH_NAME_REGEX="([a-z0-9\./]+/)"
FILENAME_REGEX="([a-z0-9\.]+)"

CLASS_FILENAME_REGEX="(${FILENAME_REGEX}+\.class\.(test\.)*ts)"
CLASS_MOCK_FILENAME_REGEX="(${FILENAME_REGEX}+\.class\.mock\.ts)"

COMPONENT_FILENAME_REGEX="src/web/${PATH_NAME_REGEX}+(components|providers|providers/tests/implementations)/${PATH_NAME_REGEX}*${FILENAME_REGEX}+\.(component|container|integration\.test|page|provider|style)"
COMPONENT_STYLE_FILENAME_REGEX="src/web/${PATH_NAME_REGEX}+components/${PATH_NAME_REGEX}*${FILENAME_REGEX}+\.style"
COMPONENT_FACTORY_FILENAME_REGEX="src/web/${PATH_NAME_REGEX}+${FILENAME_REGEX}+\.factory\.class"

FORM_COMPONENT_FILENAME_REGEX="src/web/forms/${PATH_NAME_REGEX}+.+\.form.(component|container)(\.test)*\.tsx"

HOOK_DEFINITION_REGEX="const use[A-Z]+|function use[A-Z]+"
HOOK_FILENAME_REGEX="(${FILENAME_REGEX}+\.hook\.(test\.)*tsx)"
HOOK_FACTORY_REGEX="(${FILENAME_REGEX}+\.hook\.factory\.(test\.)*tsx)"
HOOK_MOCK_FILENAME_REGEX="(${FILENAME_REGEX}+\.hook\.mock\.tsx)"
HOOK_FULL_PATH_REGEX="src/web/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*(${HOOK_FILENAME_REGEX}|${HOOK_FACTORY_REGEX}):"
HOOK_MOCK_LOCATOR_REGEX="src/web/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*__mocks__/.*"
HOOK_MOCK_FULL_PATH_REGEX="src/web/${PATH_NAME_REGEX}*(hooks|controllers)/${PATH_NAME_REGEX}*__mocks__/(${CLASS_FILENAME_REGEX}|${CLASS_MOCK_FILENAME_REGEX}|${HOOK_FILENAME_REGEX}|${HOOK_MOCK_FILENAME_REGEX})"

REPORT_FLIPCARD_COMPONENT_FILENAME_REGEX="src/web/reports/generics/components/report.base/flip.card/(tests)*.+\.component(\.test)*\.tsx"
REPORT_SUNBURST_COMPONENT_FILENAME_REGEX="src/web/reports/generics/components/report.base/sunburst/(tests)*.+\.component(\.test)*\.tsx"

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
  excludes "src/clients/$1|src/api/integrations/$1|src/vendors/integrations/$1" 
}

main() {

  echo "*** Architecture Enforcement ***"

  echo "********** Component Level Decoupling **********"

  echo "  Checking Imports into the API Component..."
  ! search 'from "@src/.+' src/api                                                                                  | 
    allows 'from "@src/api/.+'                                                                                      |
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                |
    allows 'from "@src/utilities/.+'                                                                                |
    allows 'from "@src/vendors/.+'                                                                                  ||
    error_restricted

  echo "  Checking Imports into the CONFIG Component..."
  ! search 'from "@src/.+' src/config                                                                               | 
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                ||
    error_restricted

  echo "  Checking Imports into the CONTRACTS Component..."
  ! search 'from "@src/.+' src/contracts                                                                            | 
    allows 'from "@src/contracts/.+'                                                                                ||
    error_restricted
  
  echo "  Checking Imports into the FIXTURES Component..."
  ! search 'from "@src/.+' src/fixtures                                                                             | 
    allows 'from "@src/fixtures/.+'                                                                                 ||
    error_restricted

  echo "  Checking Imports into the PAGES Component..."
  ! search 'from "@src/.+' src/pages                                                                                | 
    allows 'from "@src/api/.+'                                                                                      |
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                |
    allows 'from "@src/pages/.+'                                                                                    |
    allows 'from "@src/utilities/.+'                                                                                |
    allows 'from "@src/vendors/.+'                                                                                  |
    allows 'from "@src/web/.+'                                                                                      ||
    error_restricted

  # The PAGES component has it's tests in src/tests (next framework design)

  ! search 'from "@src/.+' src/tests                                                                                | 
    allows 'from "@src/api/.+'                                                                                  |
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                |
    allows 'from "@src/fixtures/.+'                                                                                 |
    allows 'from "@src/pages/.+'                                                                                    |
    allows 'from "@src/utilities/.+'                                                                                |
    allows 'from "@src/vendors/.+'                                                                                  |
    allows 'from "@src/web/.+'                                                                                      ||
    error_restricted

  echo "  Checking Imports into the UTILITIES Component..."
  ! search 'from "@src/.+' src/utilities                                                                            | 
    allows 'from "@src/fixtures/.+'                                                                                 |
    allows 'from "@src/utilities/.+'                                                                                ||
    error_restricted

  echo "  Checking Imports into the VENDORS Component..."
  ! search 'from "@src/.+' src/vendors                                                                              | 
    allows 'from "@src/__mocks__/.+'                                                                                |    
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                |    
    allows 'from "@src/fixtures/.+'                                                                                 | 
    allows 'from "@src/utilities/.+'                                                                                |
    allows 'from "@src/vendors/.+'                                                                                  ||
    error_restricted

  # Enforce WEB Component Isolation (No imports into WEB except from designated points.)
  echo "  Checking Imports into the WEB Component..."
  ! search 'from "@src/.+' src/web                                                                                  | 
    allows 'from "@src/web/.+'                                                                                      |
    allows 'from "@src/config/.+'                                                                                   |
    allows 'from "@src/contracts/.+'                                                                                |
    allows 'from "@src/fixtures/.+'                                                                                 |
    allows 'from "@src/utilities/.+'                                                                                |
    allows 'from "@src/vendors/.+'                                                                                  ||
    error_restricted

  echo "********** Framework Decoupling **********"

  # Enforce Analytics Framework Vendors Isolation
  echo "  Checking Analytics Framework Vendors Isolation..."
  ! search 'from "react-ga' src                                                                                     | 
    excludes_vendor_locations "analytics"                                                                           || 
    error_decoupling "Analytics"

  ! search 'from "js-cookie' src                                                                                    |
    excludes_vendor_locations "analytics"                                                                           ||
    error_decoupling "Analytics"

  ! search 'from "react-cookie-consent' src                                                                         |
    excludes_vendor_locations "analytics"                                                                           ||
    error_decoupling "Analytics"

  # Enforce API Framework Vendors Isolation
  echo "  Checking API Framework Vendors Isolation..."

  # Enforce API Handler Framework Vendors Isolation
  echo "  Checking API Handler Framework Vendors Isolation..."
  ! search 'from "next-connect"' src                                                                                | 
    excludes_vendor_locations "api.handler"                                                                         || 
    error_decoupling "API Handler"

  # Enforce API Logger Framework Vendors Isolation
  echo "  Checking API Logger Framework Vendors Isolation..."

  # Enforce API Validation Framework Vendors Isolation
  echo "  Checking API Validation Framework Vendors Isolation..."
  ! search 'from "ajv' src                                                                                          | 
    excludes_vendor_locations "api.validation"                                                                      || 
    error_decoupling "Validation"

  # Enforce Auth Framework Vendors Isolation
  echo "  Checking Auth Framework Vendors Isolation..."
  ! search 'from "next-auth' src                                                                                    | 
    excludes_vendor_locations "auth"                                                                                || 
    error_decoupling "Auth"

  # Enforce Auth Buttons Framework Vendors Isolation
  echo "  Checking Auth Buttons Framework Vendors Isolation..."
  ! search 'from "react-social-login-buttons' src                                                                   | 
    excludes_vendor_locations "auth.buttons"                                                                        || 
    error_decoupling "Auth Buttons"

  # Enforce Cache Framework Vendors Isolation
  echo "  Checking Cache Framework Vendor Isolation..."

  # Enforce Errors Framework Vendors Isolation
  echo "  Checking Errors Framework Vendors Isolation..."
  ! search 'from "react-error-boundary' src                                                                         | 
    excludes_vendor_locations "errors"                                                                              || 
    error_decoupling "Errors"

  # Enforce Flag Framework Vendors Isolation
  echo "  Checking Feature Flags Framework Vendors Isolation..."
  ! search 'from "flagsmith' src                                                                                    | 
    excludes_vendor_locations "flags"                                                                               || 
    error_decoupling "Feature Flags"

  ! search 'from "flagsmith-nodejs' src                                                                             | 
    excludes_vendor_locations "flags"                                                                               || 
    error_decoupling "Feature Flags"

  # Enforce Lastfm Framework Vendors Isolation
  echo "  Checking Lastfm Framework Vendors Isolation..."
  ! search 'from "@toplast/lastfm' src                                                                              | 
    excludes_vendor_locations "lastfm"                                                                              || 
    error_decoupling "Last FM"

  ! search 'from "cheerio' src                                                                                      | 
    excludes_vendor_locations "lastfm"                                                                              || 
    error_decoupling "Last FM"

  # Enforce Locale Framework Vendors Isolation
  echo "  Checking Locale Framework Vendors Isolation..."
  ! search 'from "next-i18next' src                                                                                 | 
    excludes_vendor_locations "locale"                                                                              || 
    error_decoupling "Locale"

  ! search 'from "react-i18next' src                                                                                || 
    error_decoupling "Locale"

  ! search 'from "i18next' src                                                                                      || 
    error_decoupling "Locale"

  # Enforce Persistence Framework Vendors solation
  echo "  Checking Persistence Framework Vendors Isolation..."
  ! search 'from "@aws-sdk' src                                                                                     | 
    excludes_vendor_locations "persistence"                                                                         || 
    error_decoupling "Persistence"

  ! search 'from "use-persisted-reducer' src                                                                        | 
    excludes_vendor_locations "persistence"                                                                         || 
    error_decoupling "Persistence"

  # Enforce UI Framework Vendors Isolation
  echo "  Checking UI Framework Vendors Isolation..."
  ! search 'from "@chakra-ui' src                                                                                   | 
    excludes_vendor_locations "analytics"                                                                           |
    excludes_vendor_locations "ui.framework"                                                                        |  
    excludes "${UI_FRAMEWORK_WHITELIST_REGEX}"                                                                      | 
    excludes "${COMPONENT_FILENAME_REGEX}"                                                                          || 
    error_decoupling "UI"

  ! search 'from "@emotion' src                                                                                     | 
    excludes "${COMPONENT_STYLE_FILENAME_REGEX}"                                                                    ||
    error_decoupling "UI"

  echo "    COMPONENTS: Checking Form Vendors Isolation..."
  ! search 'from "formik' src                                                                                       | 
    excludes "${FORM_COMPONENT_FILENAME_REGEX}"                                                                     ||
    error_decoupling "FORMS COMPONENTS"

  echo "    COMPONENTS: Checking Icon Vendors Isolation..."
  ! search 'from "react-icons| from "@chackra-ui/icons' src                                                         | 
    excludes "${COMPONENT_FILENAME_REGEX}"                                                                          ||
    error_decoupling "ICON COMPONENTS"

  echo "    COMPONENTS: Checking Report Vendors Isolation..."
  ! search 'from "react-card-flip' src                                                                              |
    excludes "${REPORT_FLIPCARD_COMPONENT_FILENAME_REGEX}"                                                          ||
    error_decouple "REPORT COMPONENTS"

  ! search 'from "d3' src                                                                                           |
    excludes "${REPORT_SUNBURST_COMPONENT_FILENAME_REGEX}"                                                          ||
    error_decouple "REPORT COMPONENTS"

  # Enforce Web Framework Vendors Isolation
  echo "  Checking Web Framework Vendors Isolation..."
  ! search 'from "next"|^import .+ from "next/' src                                                                 | 
    excludes "${WEB_FRAMEWORK_WHITELIST_REGEX}"                                                                     | 
    excludes_vendor_locations "web.framework"                                                                       | 
    excludes_vendor_locations "api.framework"                                                                       || 
    error_decoupling "WEB"

  echo "  Checking React Framework Isolation..."
  ! search 'from "react"|from "react/' src                                                                          | 
    excludes "${WEB_FRAMEWORK_WHITELIST_REGEX}"                                                                     | 
    excludes "src/fixtures"                                                                                         |
    excludes "src/web"                                                                                              |
    excludes "src/vendors"                                                                                          ||
    error_decoupling "REACT"

  # Enforce Test Framework Isolation
    echo "  Checking Test Framework Vendors Isolation..."
  ! search 'from "node-fetch' src                                                                                   ||
    error_decoupling "TEST"

  # Enforce Security Framework Isolation
    echo "  Checking Security Framework Vendors Isolation..."
  ! search 'from "ci"' src                                                                                          ||
    error_decoupling "SECURITY"

  echo "********** Buisiness Logic Separation in UI **********"

  # Enforce Separation of Business Logic (No hook usage inside component level files.)
  echo "  Checking Hook Usage Patterns..."
  ! search " = use" src                                                                                             | 
    excludes_vendor_locations "ui.framework"                                                                        | 
    includes "component\.ts"                                                                                        | 
    excludes "useColour"                                                                                            || 
    false

  echo "********** File Name Conventions **********"

  # Enforce General Naming Convention (lowercase, . seperator)
  echo "  Checking General Naming Conventions..."
  ! find src -type f                                                                                                | 
    excludes "^src/pages/api|^src/tests/api"                                                                        | 
    excludes "^src/(${PATH_NAME_REGEX})+${FILENAME_REGEX}|.DS_Store|__mocks__|_app|_document"                       || 
    error_naming_convention
  
  # Enforce API Naming Convention (paths are lower case, with square brackets, endpoints are camel case with brackets)
  echo "  Checking Pages Naming Conventions..."
  ! find src/pages/api -type f                                                                                      | 
    excludes "^src/pages/api/(${API_PATH_NAME_REGEX})+${API_ENDPOINT_NAME_REGEX}"                                   || 
    error_naming_convention

  # Component File Naming Convention
  echo "  Checking Component File Naming Conventions..."
  ! find src/web -type f -regex ".*tsx$"                                                                            | 
    excludes "${COMPONENT_FACTORY_FILENAME_REGEX}"                                                                  |
    excludes "(${HOOK_FILENAME_REGEX}|${HOOK_MOCK_FILENAME_REGEX})"                                                 | 
    excludes "${COMPONENT_FILENAME_REGEX}"                                                                          ||
    false

  # Enforce Hook Naming Conventions
  echo "  Checking Hook Naming Conventions..."
  ! search "${HOOK_DEFINITION_REGEX}" src/web                                                                       |   
    excludes "${HOOK_FULL_PATH_REGEX}"                                                                              || 
    error_naming_convention

  # Enforce Hook Naming Conventions
  echo "  Checking Hook Mock Naming Conventions..."
  ! find src -type f | includes "${HOOK_MOCK_LOCATOR_REGEX}"                                                        | 
    excludes "${HOOK_MOCK_FULL_PATH_REGEX}"                                                                         || 
    error_naming_convention

  echo "********** Type Definitions **********"

  # Enforce Hook Type Exports (Must export it's own type definition.)
  echo "  Checking Hook Exports..."
  readarray -t HOOK_FILES < <(
    search "${HOOK_DEFINITION_REGEX}" src/web                                                                       | 
    cut -d":" -f1                                                                                                   |
    excludes "test"
  )
  for HOOK_FILE in "${HOOK_FILES[@]}"; do
    ! search "^export type" "$HOOK_FILE" > /dev/null && 
      echo "${HOOK_FILE}: missing hook type export" &&
      exit 127   
  done

  # Enforce Vendor Type Exports (Must be named consistenly: [vendor type]Vendor[type name](Interface|Type))
  echo "  Checking Vendor Type Definitions..."
  readarray -t VENDOR_TYPE_FILES < <(
    find src/vendors/types                                                                                          | 
    grep "vendor.types.ts"                                                                                          | 
    cut -d":" -f1
  )
  for VENDOR_TYPE_FILE in "${VENDOR_TYPE_FILES[@]}"; do
    ! tr -d '\n' < "$VENDOR_TYPE_FILE"                                                                              | 
      grep -Eo "((export|import )*type [A-Za-z]+)|(export )*interface ([A-Z]{1}[A-Za-z]+) {|export type \{(.+?)\}"  |
      sed 's/export//g'                                                                                             | 
      sed 's/interface//g'                                                                                          | 
      sed 's/type//g'                                                                                               |
      tr , '\n'                                                                                                     |
      tr -d " "                                                                                                     |
      tr -d "{"                                                                                                     | 
      tr -d "}"                                                                                                     |
      sed '/^$/d'                                                                                                   |
      excludes "import"                                                                                             |
      excludes "${TYPE_DEFINITION_WHITELIST_REGEX}"                                                                 |
      excludes "[A-Z]{1}[a-zA-Z]+Vendor([a-zA-Z]+)*(Interface|Props|Type){1}"                                       ||
      (echo "WARN: ${VENDOR_TYPE_FILE}: has improperly formatted types defined")                                    || 
      false
  done

  echo "*** Complete ***"

}


main "$@"
