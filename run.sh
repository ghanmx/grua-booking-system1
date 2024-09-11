#!/bin/bash
npm install
node scripts/update-package-json.js
npm run build:dev
npm run dev