#!/bin/bash
set -e
cd "$(dirname "$0")"
npx cypress run --spec "cypress/e2e/api/users.cy.js" --browser electron
