import { Client } from "xrpl";

export async function getXRPLClient() {
  const client = new Client("wss://s.devnet.rippletest.net:51233");
  await client.connect();
  return client;
}
