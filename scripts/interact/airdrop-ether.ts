import { ContractTransaction } from "ethers/lib/ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import hre from "hardhat";
import { Airdrop__factory } from "../../typechain";
import { getAddressList } from "../../utils/addressUtils";

async function main() {
  let tx: ContractTransaction;
  const [owner] = await hre.ethers.getSigners();
  const addressList = await getAddressList(hre.network.name);
  const AIRDROP_CONTRACT = addressList["Airdrop"];
  const AirdropFactory = Airdrop__factory.connect(AIRDROP_CONTRACT, owner);

  const amount = parseEther("0.2");
  const receipient = [""];
  const receipientAmount = new Array(receipient.length).fill(amount);

    tx = await owner.sendTransaction({
      to: AIRDROP_CONTRACT,
      value: parseEther("10"),
    });
    await tx.wait();
    console.log("Send Ether to contract successfully!");

  tx = await AirdropFactory.dropEther(receipient, receipientAmount, {
    value: amount,
  });
  await tx.wait();
  console.log("Airdrop Ether successfully!");

  tx = await AirdropFactory.withdrawEther(owner.address);
  await tx.wait();
  console.log("Withdraw Ether successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
