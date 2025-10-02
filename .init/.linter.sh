#!/bin/bash
cd /home/kavia/workspace/code-generation/noteshare-platform-171072-171082/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

