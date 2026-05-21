#!/bin/sh
set -eu

rm -rf output
mkdir output

git archive HEAD | tar -x -C output
rm -rf output/.github
