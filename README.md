# disco-explorer
**An admin ui for managing a disco-node**

***HINT: This is currently just a port from the [previous disco explorer prototype on CodePlex](https://disco.codeplex.com/SourceControl/latest#Implementation/Trunc/Disco.Prototype/Disco.Web.Client/)!*** 

[`disco-node`](https://github.com/disco-network/disco-node) is an OData and SPARQL endpoint to be part of the d!sco network!

[The d!sco network](https://disco-network.org) is the implementation of a meta discussion system. We rapid prototype an Ontology and Web API to serve as a data hub inside a P2P network. Be involved!

The [`disco-explorer`](https://github.com/disco-network/disco-explorer) repository is where we do development and there are many ways you can participate in the project, for example:

* [Submit bugs and feature requests](https://github.com/disco-network/disco-explorer/issues) and help us verify as they are checked in
* Review [source code changes](https://github.com/disco-network/disco-explorer/pulls)
* Review the [documentation](https://github.com/disco-network/disco-explorer-docs) and make pull requests for anything from typos to new content

## Prerequisites

### For Development

We are using [`vscode`](https://code.visualstudio.com/) for development.

#### Setup

Currently we do use `localhost` as the default hostname. You could either change this in the configuration files `./bs-config.json` for the disco-explorer and `./source/config/settings.ts` for the odata endpoint.

## Get the Code

```shell
git clone https://github.com/disco-network/disco-explorer.git disco-explorer
cd disco-explorer
npm install
```
You also need to run a local [`disco-node`](https://github.com/disco-network/disco-node) installation to connect disco-explorer to the data.

## Usage

```shell
npm run server
```

## License

[MIT](https://github.com/disco-network/disco-explorer/blob/master/LICENSE)
