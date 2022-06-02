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

  
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());


  //Deploy Deposit
  const Deposit = await ethers.getContractFactory("Deposit");
  const deposit = await Deposit.deploy();
  await deposit.deployed();

  console.log("Deposit deployed at address:", deposit.address);


  //Deploy DepositFactory
  const DepositFactory = await ethers.getContractFactory("DepositFactory");
  const depositFactory = await DepositFactory.deploy();
  await depositFactory.deployed();
  //Set contract address of DepositFactory to be Deposit contract
  await depositFactory.setContractAddress(deposit.address);
 

  console.log("Deposit Factory deployed at address:", depositFactory.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(depositFactory);
}

function saveFrontendFiles(deposit) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Deposit: deposit.address }, undefined, 2)
  );

  const DepositFactoryArtifact = artifacts.readArtifactSync("DepositFactory");

  fs.writeFileSync(
    contractsDir + "/DepositFactory.json",
    JSON.stringify(DepositFactoryArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
