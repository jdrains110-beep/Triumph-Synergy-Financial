#!/bin/bash
# Composite action to check deployed validation keys
mkdir -p validation-logs
npm run check-deployed-validation 2>&1 | tee validation-logs/validation-check.log || true
