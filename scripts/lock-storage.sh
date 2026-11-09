#!/usr/bin/env bash
# Stand-in for "device rebooted, not yet unlocked": make the MMKV files unreadable
# before a cold start, so open() fails the same way data protection makes it fail.
# (Real device: EPERM, errno 1. Simulator chmod: EACCES, errno 13. Same MMKV code path.)
set -euo pipefail
UDID=${1:?usage: lock-storage.sh <simulator udid> [bundle id]}
BUNDLE=${2:-com.example.mmkvfirstunlockrepro}
DIR="$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)/Documents/mmkv"
xcrun simctl terminate "$UDID" "$BUNDLE" 2>/dev/null || true
chmod 000 "$DIR"/*
ls -l "$DIR"
echo "locked. Now relaunch the app: xcrun simctl launch $UDID $BUNDLE"
