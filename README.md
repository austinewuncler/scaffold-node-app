# ScafNode

## Description

This is a simple command line utility to create a configured NodeJS project from scratch.
It is designed to help configuring new NodeJS projects and sets up common patetrns such as linting.

## Installation

With `node` and `npm` installed on the system, run the following commands

```sh
git clone https://github.com/austinewuncler/scaffold-node-app
cd scaffold-node-app
npm install
npm run build
npm install -g .
```

## Usage

Navigate to the directory where you keep your projects, then run

```sh
scafnode <name>
```

where `<name>` is the name of your project. This will create a new directory and configure your new project.
There is an optional `-t` or `--typescript` flag that when supplied, scaffolds a TypeScript project.

## Features

- NodeJS
- TypeScript
- ESLint
