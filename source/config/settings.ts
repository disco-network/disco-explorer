module disco.config {
  export interface IOdataEndpoint {
    protocol: String;
    hostname: String;
    port: Number;
    root: String;
  }

  export class Settings {
    public static readonly endpoint: IOdataEndpoint = {
      protocol: "http",
      hostname: "disco-node.local",
      port: 3000,
      root: "/api/odata/"
    };

    public static get endpointRootUrl(): string {
      return Settings.endpoint.protocol
        + "://" + Settings.endpoint.hostname
        + ":" + Settings.endpoint.port
        + Settings.endpoint.root;
    }
  }
}