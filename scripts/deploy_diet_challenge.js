// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const DietChallenge = await ethers.getContractFactory("DietChallenge");

  // const DURATION = 30 * 24 * 60 * 60; // 30 days in sec
  // const WAIT = 1 * 24 * 60 * 60;
  const DURATION = 60; // sec
  const WAIT = 60;
  const dietChallengeContract = await DietChallenge.deploy(DURATION, WAIT);
  await dietChallengeContract.deployed();

  console.log("DietChallenge address:", dietChallengeContract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(dietChallengeContract);
}

function saveFrontendFiles(dietChallengeContract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      { DietChallenge: dietChallengeContract.address },
      undefined,
      2
    )
  );

  const DietChallengeArtifact = artifacts.readArtifactSync("DietChallenge");

  fs.writeFileSync(
    contractsDir + "/DietChallenge.json",
    JSON.stringify(DietChallengeArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
