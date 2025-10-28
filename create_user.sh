#!/bin/bash
#
# This script automates the creation and licensing of a new user in Xolo
# based on the provided user management guide.
#
# It performs 4 steps:
# 1. Create User (ensuring 'role' matches 'username')
# 2. Create Scope
# 3. Assign Scope to User
# 4. Create and Assign License

# --- Exit script on any error ---
set -euo pipefail

# === 1. PARAMETERS TO CONFIGURE ===

# -- Server Configuration --
XOLO_HOST="http://localhost" # Or your Xolo hostname (e.g., http://192.168.1.10)
XOLO_PORT="10000"             # Your Xolo port
ADMIN_SECRET="ed448c7a5449e9603058ce630e26c9e3befb2b15e3692411c001e0b4256852d2" # The secret for admin-level endpoints

# -- User Details --
USERNAME=${1:-"root"}
FIRST_NAME="Test"
LAST_NAME="Test"
EMAIL="test@cinvestav.mx"
PASSWORD=${2:-"root"}
# Note: The 'role' will be automatically set to match USERNAME per the guide's warning.

# -- Scope & License Details --
SCOPE_NAME="xolo"
LICENSE_EXPIRES_IN="1y"

# === END OF CONFIGURATION ===


# --- 2. SCRIPT LOGIC ---

# Construct the base URL
BASE_URL="${XOLO_HOST}:${XOLO_PORT}"
CURL_OPTS="-s -f" # -s: silent, -f: fail fast with an error code

# Simple helper for pretty printing
step() {
  echo "" # Newline
  echo "--- $1 ---"
}

# --- Step 1: Create a User ---
step "1. Creating User: $USERNAME"
# Per warning, "role" MUST match "username"
USER_PAYLOAD=$(printf '{"username":"%s","first_name":"%s","last_name":"%s","email":"%s","password":"%s","profile":"","role":"%s"}' \
  "$USERNAME" "$FIRST_NAME" "$LAST_NAME" "$EMAIL" "$PASSWORD" "$USERNAME")

curl $CURL_OPTS -X POST "$BASE_URL/api/v4/users" \
  -H "Content-Type: application/json" \
  -d "$USER_PAYLOAD"
echo "User '$USERNAME' created."


# --- Step 2: Create a Scope ---
step "2. Creating Scope: $SCOPE_NAME"
SCOPE_PAYLOAD=$(printf '{"name":"%s"}' "$SCOPE_NAME")

curl $CURL_OPTS -X POST "$BASE_URL/api/v4/scopes" \
  -H "Content-Type: application/json" \
  -d "$SCOPE_PAYLOAD" \
  || echo "Scope '$SCOPE_NAME' may already exist. Continuing..."
# We add '|| ...' to allow the script to continue if the scope already exists,
# which is a common (and non-fatal) error.


# --- Step 3: Assign Scope to User ---
step "3. Assigning Scope '$SCOPE_NAME' to User '$USERNAME'"
ASSIGN_PAYLOAD=$(printf '{"name":"%s","username":"%s"}' "$SCOPE_NAME" "$USERNAME")

curl $CURL_OPTS -X POST "$BASE_URL/api/v4/scopes/assign" \
  -H "Content-Type: application/json" \
  -H "Secret: $ADMIN_SECRET" \
  -d "$ASSIGN_PAYLOAD"
echo "Scope assigned."


# --- Step 4: Create and Assign a License ---
step "4. Creating License for '$USERNAME' on Scope '$SCOPE_NAME'"
LICENSE_PAYLOAD=$(printf '{"username":"%s","scope":"%s","expires_in":"%s","force":true}' \
  "$USERNAME" "$SCOPE_NAME" "$LICENSE_EXPIRES_IN")

# We print the output of this command, as it contains the license token
echo "License response:"
curl $CURL_OPTS -X POST "$BASE_URL/api/v4/licenses/" \
  -H "Content-Type: application/json" \
  -H "Secret: $ADMIN_SECRET" \
  -d "$LICENSE_PAYLOAD"

echo ""
echo "--- Xolo user setup complete! ---"