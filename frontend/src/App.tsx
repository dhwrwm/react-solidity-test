import { Contract } from '@ethersproject/contracts'
import React, { useEffect, useState } from 'react'
// if you have successfuly compiled the smart contract in the backend folder, typechain should have created an interface that we can use here
// import {ExampleContract} from '../../backend/typechain/ExampleContract';
import getContract from './utils/useGetContract'

function App() {
  /*-----------STATES---------------*/
  const [contract, setContract] = useState<Contract | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [candidates, setCandidates] = useState([])
  const [candidateFormData, setCandidateFormData] = useState({
    name: '',
    imageHash: ''
  })
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  /*-----------SIDE EFFECTS---------------*/
  useEffect(() => {
    const getContractFromBlockchain = async () => {
      const contract = await getContract(contractAddress)
      setContract(contract)
    }
    // wild wild west version of setting contract
    getContractFromBlockchain()
    // gentlemen version of setting contract
    //setTypedContract( (getContract(contractAddress) as ExampleContract))
  }, [])

  useEffect(() => {
    getAllCandidates()
  }, [contract])

  /*-----------FUNCTIONS---------------*/
  async function addAccount() {
    // if you want to use the typed contract

    //   await (await typedContract?.addAccount("XamHans"));
    //   typedContract?.on("accountCreatedEvent", async function (event:any) {
    //     console.log('Recieved event from smart contract ',event)
    // })

    await contract?.addAccount('XamHans')
    contract?.on('accountCreatedEvent', async function (event: any) {
      console.log('Recieved event from smart contract ', event)
    })
  }

  async function registerCandidate() {
    // get the name from formdata
    const name = candidateFormData.name

    // getting the IPFS Image Hash from the Pinata API Service

    // call the VoteManager registerCandidate Contract Function
    contract?.registerCandidate(name)

    // response from the contract / the candidateCreated Event
    contract?.on('candidateCreated', async function (evt) {
      getAllCandidates()
    })
  }

  function vote(address: string) {
    if (!address) {
      throw Error('no address defined')
    }
    contract?.vote(address)

    contract?.on('Voted', async function (evt) {
      getAllCandidates()
    })
  }

  async function getAllCandidates() {
    const retrievedCandidates = await contract?.fetchCandidates()
    console.log('retrievedCandidates 1', retrievedCandidates)
    const tempArray: any = []
    retrievedCandidates?.forEach((candidate: any) => {
      tempArray.push({
        id: candidate.id,
        name: candidate.name,
        totalVote: candidate.totalVote,
        imageHash: candidate.imageHash,
        candidateAddress: candidate.candidateAddress
      })
    })
    setCandidates(tempArray)
  }

  const handleChange = (event: any) => {
    setCandidateFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    })
  }

  console.log('candidates', candidates)

  return (
    <div className="w-full h-full bg-white dark:bg-gray-700 p-10">
      <div className="mb-10">
        <div className="w-full flex">
          <input
            className="block w-9/12 mr-2 shadow-sm ring-1 rounded-md border-0 py-1.5 text-gray-900 "
            id="filled-basic"
            name="name"
            value={candidateFormData.name}
            onChange={handleChange}
          />

          <button
            className="w-3/12 border rounded"
            onClick={() => registerCandidate()}
          >
            Register as Candidate
          </button>
        </div>
      </div>
      {candidates.length > 0 && (
        <div style={{ backgroundColor: '#F0F3F7' }}>
          <div style={{ flexGrow: 1, padding: '3rem' }}>
            <div>
              {candidates.map((candidate: any, index) => (
                <div key={index}>
                  <h1>{candidate?.name}</h1>
                  <span>{Number(candidate?.totalVote) ?? 0}</span>
                  <button onClick={(e) => vote(candidate.candidateAddress)}>
                    Vote
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
