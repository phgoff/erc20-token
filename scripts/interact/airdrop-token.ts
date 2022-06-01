import { formatEther, parseEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";
import { Airdrop__factory, ERC20__factory } from "../../typechain";
import { getAddressList } from "../../utils/addressUtils";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const addressList = await getAddressList(hre.network.name);
  const AIRDROP_CONTRACT = addressList["Airdrop"];

  // CHANGE ME
  const airdropToken = addressList["YES"];
  const amount = parseEther("0.09");
  const receipient = ["0xcdCc562088F99f221B0C3BB1EDcFD5A9646D0B25"];
  // ----

  const tokenContract = (await hre.ethers.getContractFactory(
    "ERC20"
  )) as ERC20__factory;
  const token = tokenContract.attach(airdropToken);

  const allowance = formatEther(
    await token.allowance(owner.address, AIRDROP_CONTRACT)
  );

  if (Number(allowance) === 0) {
    // Approve contract
    await token
      .approve(AIRDROP_CONTRACT, ethers.constants.MaxUint256)
      .then((tx) => tx.wait());
    console.log("approve token successfully");
  }

  const receipientAmount = new Array(receipient.length).fill(amount);

  const AirdropFactory = Airdrop__factory.connect(AIRDROP_CONTRACT, owner);

  const tx = await AirdropFactory.dropTokens(
    airdropToken,
    receipient,
    receipientAmount
  );
  await tx.wait();

  console.log("Airdrop token successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
