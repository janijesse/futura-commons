import { getXRPLClient } from "./clients";
import { Wallet, xrpToDrops } from "xrpl";

export async function createAmmWithToken() {
  const client = await getXRPLClient();

  const fundIssuer = await client.fundWallet();
  const fundLP = await client.fundWallet();

  const issuer = fundIssuer.wallet;
  const lp = fundLP.wallet;

  const TOKEN_HEX = Buffer.from("RETREAT", "ascii")
    .toString("hex")
    .padEnd(40, "0")
    .toUpperCase();

  // TrustLine + Token sending logic (same as before)…

  // AMM creation
  const ammTx = {
    TransactionType: "AMMCreate",
    Account: lp.address,
    Amount: { currency: TOKEN_HEX, issuer: issuer.address, value: "20" },
    Amount2: xrpToDrops("40"),
    TradingFee: 100,
  };

  const prepared = await client.autofill(ammTx);
  prepared.LastLedgerSequence += 100;
  const signed = lp.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);

  await client.disconnect();
  return {
    ammHash: result.result.hash,
    lpWallet: lp.address,
    issuerWallet: issuer.address,
    tokenHex: TOKEN_HEX,
  };
}
