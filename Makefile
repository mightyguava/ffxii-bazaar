SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

clean:
	rm -rf dist/
.PHONY: clean

dist: clean
	npm run build

watch:
	npm run serve

deploy: dist
	firebase deploy
