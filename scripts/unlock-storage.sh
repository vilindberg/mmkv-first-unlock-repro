#!/usr/bin/env bash
# Stand-in for "user unlocked the phone": the files open again. The running app is
# NOT restarted, which is the point: a real unlock does not restart the app either.
set -euo pipefail
UDID=${1:?usage: unlock-storage.sh <simulator udid> [bundle id]}
BUNDLE=${2:-com.example.mmkvfirstunlockrepro}
DIR="$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)/Documents/mmkv"
chmod 600 "$DIR"/*
ls -l "$DIR"
echo "unlocked. Tap 'read again' in the still-running app."
