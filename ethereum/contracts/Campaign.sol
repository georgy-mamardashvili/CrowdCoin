// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCompaign(uint minContribution) public {
        address newCampaign = address(new Campaign(minContribution, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct SpendRequest {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint public minContribution;
    SpendRequest[] public requests;
    mapping (address => bool) public contributors;
    uint public contributorsCount;
    
    constructor(uint minContr, address creator) {
        manager = creator;
        minContribution = minContr;
    }
    
    function contribute() public payable {
        require(msg.value > minContribution);
        contributors[msg.sender] = true;
        contributorsCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public onlyManager {
        SpendRequest storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = payable(recipient);
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint requestIndex) public {
        SpendRequest storage request = requests[requestIndex];

        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finilizeRequest(uint requestIndex) public onlyManager {
        SpendRequest storage request = requests[requestIndex];
        
        require(!request.complete);
        require(request.approvalCount > (contributorsCount / 2));

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }
}