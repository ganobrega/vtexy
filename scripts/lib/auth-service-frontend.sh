#!/bin/bash

if [ "$1" ]; then
  case "$1" in
    start)
      ../../node_modules/.bin/parcel start src/index.html --open
      exit 0
      ;;

    build)
      ../../node_modules/.bin/parcel build src/index.html
      exit 0
      ;;
    *) echo "Command not found"
  esac
else
  echo "Enter an argument with the values:"
  echo "start - Development"
  echo "build - Production"
  exit 0;
fi