import xrpl from "xrpl";


// Configuration for the token
const TOKEN_NAME = "RETREAT";
const TOKEN_HEX = Buffer.from(TOKEN_NAME, "ascii")
  .toString("hex")
  .padEnd(40, "0")
  .toUpperCase();

// Adjustable parameters
const AMM_CONFIG = {
  TOKEN_AMOUNT: "20",    // Amount of RETREAT for the pool
  XRP_AMOUNT: "20",      // Amount of XRP for the pool (adjusted to 20)
  TRADING_FEE: 100,      // Fee 1% (in basis points)
  LAST_LEDGER_BUFFER: 10 // Reduced buffer for LastLedgerSequence
};

async function main() {
  const client = new xrpl.Client("wss://s.devnet.rippletest.net:51233");
  
  try {
    await client.connect();
    console.log("🔗 Connected to XRPL Devnet");

    // Handle connection events
    client.on("error", (err) => console.error("🚨 XRPL client error:", err));
    client.on("reconnect", () => console.warn("🔁 XRPL client reconnecting..."));

    // ==========================================================================
    // Step 0: Create and fund accounts
    // ==========================================================================
    console.log("\n💧 Creating accounts...");
    
    // Create issuer account
    const fundIssuer = await client.fundWallet();
    const issuerWallet = fundIssuer.wallet;
    console.log("🔑 Issuer:", issuerWallet.address);
    
    // Create LP account
    const fundLP = await client.fundWallet();
    const lpWallet = fundLP.wallet;
    console.log("👛 LP Provider:", lpWallet.address);

    // ==========================================================================
    // Step 1: Configure issuer account
    // ==========================================================================
    console.log("\n⚙️ Configuring issuer account...");
    
    // Check if Default Ripple is enabled
    const issuerSettings = await client.request({
      command: "account_info",
      account: issuerWallet.address
    });
    
    const DEFAULT_RIPPLE_FLAG = 0x00800000;
    if (!(issuerSettings.result.account_data.Flags & DEFAULT_RIPPLE_FLAG)) {
      console.log("🔄 Enabling Default Ripple...");
      const enableRippleTx = {
        TransactionType: "AccountSet",
        Account: issuerWallet.address,
        SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple
      };
      
      const preparedTx = await client.autofill(enableRippleTx);
      const signedTx = issuerWallet.sign(preparedTx);
      await client.submitAndWait(signedTx.tx_blob);
    }
    console.log("✅ Configuration completed");

    // ==========================================================================
    // Step 2: Create TrustLine
    // ==========================================================================
    console.log("\n🤝 Creating TrustLine...");
    const trustTx = {
      TransactionType: "TrustSet",
      Account: lpWallet.address,
      LimitAmount: {
        currency: TOKEN_HEX,
        issuer: issuerWallet.address,
        value: "100"
      }
    };

    const preparedTrust = await client.autofill(trustTx);
    const signedTrust = lpWallet.sign(preparedTrust);
    await client.submitAndWait(signedTrust.tx_blob);
    console.log("✅ TrustLine established");

    // ==========================================================================
    // Step 3: Send tokens
    // ==========================================================================
    console.log("\n💸 Sending RETREAT tokens...");
    const paymentTx = {
      TransactionType: "Payment",
      Account: issuerWallet.address,
      Destination: lpWallet.address,
      Amount: {
        currency: TOKEN_HEX,
        issuer: issuerWallet.address,
        value: "50"
      }
    };

    const preparedPayment = await client.autofill(paymentTx);
    const signedPayment = issuerWallet.sign(preparedPayment);
    await client.submitAndWait(signedPayment.tx_blob);
    console.log("✅ Tokens sent");

    // ==========================================================================
    // Step 4: Create AMM
    // ==========================================================================
    console.log("\n🌀 Creating liquidity pool...");
    
    // Check XRP balance
    const lpBalance = await client.getXrpBalance(lpWallet.address);
    console.log(`💰 LP XRP Balance: ${lpBalance}`);
    
    if (Number(lpBalance) < Number(AMM_CONFIG.XRP_AMOUNT)) {
      throw `❌ Insufficient balance: LP needs at least ${AMM_CONFIG.XRP_AMOUNT} XRP`;
    }

    // Create AMM transaction
    const ammTx = {
      TransactionType: "AMMCreate",
      Account: lpWallet.address,
      Amount: {
        currency: TOKEN_HEX,
        issuer: issuerWallet.address,
        value: AMM_CONFIG.TOKEN_AMOUNT
      },
      Amount2: xrpl.xrpToDrops(AMM_CONFIG.XRP_AMOUNT),
      TradingFee: AMM_CONFIG.TRADING_FEE
    };

    let preparedAMM = await client.autofill(ammTx);
    preparedAMM.LastLedgerSequence += AMM_CONFIG.LAST_LEDGER_BUFFER;

    console.log("📦 Submitting AMM transaction...");
    const signedAMM = lpWallet.sign(preparedAMM);
    const result = await client.submitAndWait(signedAMM.tx_blob);
    
    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      console.log("✅ Pool created:", result.result.hash);
    } else {
      throw `❌ Transaction error: ${result.result.meta.TransactionResult}`;
    }

    // ==========================================================================
    // Step 5: Check pool status
    // ==========================================================================
    console.log("\n🔍 Checking pool status...");
    try {
      const ammInfo = await client.request({
        command: "amm_info",
        asset: { currency: TOKEN_HEX, issuer: issuerWallet.address },
        asset2: { currency: "XRP" }
      });
      console.log("📊 Pool details:", ammInfo.result);
    } catch (err) {
      console.warn("⚠️ Could not fetch pool info:", err.message);
    }

  } catch (err) {
    console.error("\n❌ Critical error:", {
      message: err.message,
      data: err.data || "No additional details"
    });
  } finally {
    await client.disconnect();
    console.log("\n🔌 Disconnected from XRPL Devnet");
  }
}

main();
