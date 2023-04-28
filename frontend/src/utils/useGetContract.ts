import { Contract, ethers } from 'ethers'
import VoteManagerContract from '../../../backend/artifacts/contracts/VoteManager.sol/VoteManager.json'

export default async function getContract(
  contractAddress: string
): Promise<Contract> {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum)
  await provider.send('eth_requestAccounts', [])
  const signer = provider.getSigner()
  const contract = new ethers.Contract(
    contractAddress,
    VoteManagerContract.abi,
    signer
  )
  return contract
}
