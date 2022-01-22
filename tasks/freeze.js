const fs = require("fs");

task("freeze", "Freezes funds for the diet challenge to start").setAction(
  async () => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the freeze task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.DietChallenge)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    const contract = await ethers.getContractAt("DietChallenge", address.Token);
    const [sender] = await ethers.getSigners();

    const tx = await contract.freezeFunds();
    await tx.wait();

    console.log(`Froze funds for the contract: ${contract.address}`);
  }
);
