// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract VoteManager {
    using Counters for Counters.Counter;
    Counters.Counter private candidatesIds;

    event candidateCreated(address _address, string name);
    event Voted(address _forCandidate, address _votedBy, uint256 totalVote);

    struct Candidate {
      uint256 id;
      uint256 totalVote;
      string name;
      address candidateAddress;
    }

    mapping(address => Candidate) private candidates;
    mapping(uint256 => address) private accounts;

    function registerCandidate(
        string calldata _name
    ) external {
        require(msg.sender != address(0), "Sender address must be valid");
        candidatesIds.increment();
        uint256 candidateId = candidatesIds.current();
        address _address = address(msg.sender);
        Candidate memory newCandidate = Candidate(
            candidateId,
            0,
            _name,
            _address
        );
        candidates[_address] = newCandidate;
        accounts[candidateId] = msg.sender;
        emit candidateCreated(_address, _name);
    }

    function vote(address _forCandidate) external {
        candidates[_forCandidate].totalVote += 1;
        emit Voted(
            _forCandidate,
            msg.sender,
            candidates[_forCandidate].totalVote
        );
    }

    function fetchCandidates() external view returns (Candidate[] memory) {
        uint256 itemCount = candidatesIds.current();
        Candidate[] memory candidatesArray = new Candidate[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            Candidate memory currentCandidate = candidates[accounts[currentId]];
            candidatesArray[i] = currentCandidate;
        }
        return candidatesArray;
    }
}
