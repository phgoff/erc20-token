import hre, { ethers } from "hardhat";
import addressUtils from "../../utils/addressUtils";
import { Airdrop__factory } from "../../typechain";

export async function deployAirdrop() {
  const Airdrop = (await ethers.getContractFactory(
    "Airdrop"
  )) as Airdrop__factory;
  const airdrop = await Airdrop.deploy();

  console.log(`Airdrop deployed to:`, airdrop.address);
  await addressUtils.saveAddresses(hre.network.name, {
    Airdrop: airdrop.address,
  });

  return airdrop;
}
