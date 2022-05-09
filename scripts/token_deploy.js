const { ethers, upgrades } = require("hardhat");

async function main() {

  const WIToken = await ethers.getContractFactory("WIToken");
  console.log('Deploying Witoken...');
  const token = await upgrades.deployProxy(WIToken, ['WIToken', 'WIT', '100000000000000000000000']);
  await token.deployed();
  console.log("WIToken deployed to:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

