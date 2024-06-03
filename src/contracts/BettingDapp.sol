// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract NewBettingDapp is ChainlinkClient, ConfirmedOwner {
    uint256 constant PRECISION = 10 ** 18; // Precision constant for calculations
    address payable public owner; // Contract owner

    // Chainlink variables
    uint256 public fee; // Chainlink fee for requesting data
    bytes32 public jobId; // Chainlink job ID for requesting data

    constructor() ConfirmedOwner(msg.sender) {
        owner = payable(msg.sender);

        // Set Chainlink token and Oracle
        _setPublicChainlinkToken();
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD); // Sepolia testnet Oracle address
        jobId = "7223acbd01654282865b678924126013"; // Sepolia testnet Job ID
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0.1 LINK
    }

    // Structure to store bettor information
    struct Bettor {
        address add;
        uint256 amount;
        uint256 teamID;
    }

    // Structure to store event information
    struct Event {
        string name;
        uint256 eventID;
        Match[] matches;
        string[] tags;
        string description;
        string status;
        string endDate;
    }

    // Structure to store match information
    struct Match {
        uint256 eventID;
        uint256 matchID;
        string side1;
        string side2;
        uint256 ID1;
        uint256 ID2;
        uint256 duration;
        string status;
        bool resultAnnounced;
        uint256 winnerID;
        uint256 funds1;
        uint256 funds2;
        uint256 totalFunds;
    }

    // Mappings to store events and betting information
    mapping(uint256 => Event) public eventIDToEvent;
    mapping(address => bool[100][100]) public hasBetted;
    mapping(uint256 => mapping(uint256 => Bettor[])) public bettors;

    Event[] public events; // Array to store all events

    // Function to create a new event
    function createEvent(
        string memory _eventName,
        uint256 _eventID,
        string[] memory _tags,
        string memory _description,
        string memory _status,
        string memory _endDate
    ) public onlyOwner {
        Event storage newEvent = eventIDToEvent[_eventID];
        newEvent.name = _eventName;
        newEvent.eventID = _eventID;
        newEvent.tags = _tags;
        newEvent.description = _description;
        newEvent.status = _status;
        newEvent.endDate = _endDate;

        events.push(newEvent);
    }

    // Function to create a new match for an event
    function createMatch(
        uint256 _eventID,
        uint256 _matchID,
        string memory _side1,
        string memory _side2,
        uint256 _ID1,
        uint256 _ID2,
        uint256 _duration
    ) public onlyOwner {
        Event storage currentEvent = eventIDToEvent[_eventID];
        Match memory newMatch = Match(
            _eventID,
            _matchID,
            _side1,
            _side2,
            _ID1,
            _ID2,
            _duration,
            "Ongoing",
            false,
            115792089237316195423570985008687907853269984665640564039457584007913129639934, // Initial winnerID set to max uint value - 1
            0,
            0,
            0
        );
        currentEvent.matches.push(newMatch);
    }

    // Function to get all events
    function getEvents() external view returns (Event[] memory) {
        return events;
    }

    // Function to get all matches for a specific event
    function getMatches(
        uint256 _eventID
    ) external view returns (Match[] memory) {
        Event storage currentEvent = eventIDToEvent[_eventID];
        Match[] storage currentMatches = currentEvent.matches;
        return currentMatches;
    }

    // Function to place a bet on a match
    function createBet(
        uint256 _eventID,
        uint256 _matchID,
        uint256 _teamID
    ) external payable {
        require(msg.sender != owner, "Owner cannot place bets");
        require(msg.value >= 0.01 ether, "Insufficient amount");
        require(
            hasBetted[msg.sender][_eventID][_matchID] == false,
            "You have already placed your bet in this match"
        );
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        Match storage chosenMatch = chosenMatches[0]; // Initializing to any value to avoid error at line 165
        for (uint256 i = 0; i < chosenMatches.length; i++) {
            if (chosenMatches[i].matchID == _matchID) {
                chosenMatch = chosenMatches[i];
            }
        }

        // Update funds based on the team chosen
        if (_teamID == chosenMatch.ID1) {
            chosenMatch.funds1 += msg.value;
            chosenMatch.totalFunds += msg.value;
        } else if (_teamID == chosenMatch.ID2) {
            chosenMatch.funds2 += msg.value;
            chosenMatch.totalFunds += msg.value;
        }

        hasBetted[msg.sender][_eventID][_matchID] = true;

        Bettor memory newBettor = Bettor(msg.sender, msg.value, _teamID);
        bettors[_eventID][_matchID].push(newBettor);
    }

    // Function to get the total bet amount for a match
    function getTotalBetAmount(
        uint256 _eventID,
        uint256 _matchID
    ) public view returns (uint256) {
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        Match storage chosenMatch = chosenMatches[0]; // Initializing to any value to avoid error at line 150
        for (uint256 i = 0; i < chosenMatches.length; i++) {
            if (chosenMatches[i].matchID == _matchID) {
                chosenMatch = chosenMatches[i];
            }
        }
        return chosenMatch.totalFunds;
    }

    // Function to declare the winner and distribute the funds
    function declareWinnerAndDistribute(
        uint256 _eventID,
        uint256 _matchID,
        uint256 _teamID
    ) public payable onlyOwner {
        uint256 share;
        uint256 totalAmt = getTotalBetAmount(_eventID, _matchID);
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        Match storage chosenMatch = chosenMatches[0]; // Initializing to any value to avoid error at line 150
        for (uint256 i = 0; i < chosenMatches.length; i++) {
            if (chosenMatches[i].matchID == _matchID) {
                chosenMatch = chosenMatches[i];
            }
        }

        chosenMatch.resultAnnounced = true;
        chosenMatch.winnerID = _teamID;

        uint256 winningTeamAmount;
        if (chosenMatch.ID1 == _teamID) {
            winningTeamAmount = chosenMatch.funds1;
        } else if (chosenMatch.ID2 == _teamID) {
            winningTeamAmount = chosenMatch.funds2;
        }

        // Distribute funds to the winning bettors
        Bettor[] storage chosenBettors = bettors[_eventID][_matchID];
        for (uint256 i = 0; i < chosenBettors.length; i++) {
            Bettor storage currentBettor = chosenBettors[i];
            if (currentBettor.teamID == _teamID) {
                uint256 a = currentBettor.amount * PRECISION;
                uint256 b = totalAmt * PRECISION;
                uint256 c = winningTeamAmount * PRECISION;
                uint256 d = (a * b) / c;
                share = d / PRECISION;
                address payable receiver = payable(currentBettor.add);
                (bool callSuccess, ) = reciever.call{value: share}("");
                require(callSuccess, "Failed to send ether");
            }
        }
    }

    // Function to request data from the Chainlink oracle
    function requestData(
        string memory url,
        string memory path
    ) public onlyOwner returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );
        request.add("get", url);
        request.add("path", path);
        return sendChainlinkRequest(request, fee);
    }

    // Callback function to receive data from the Chainlink oracle
    function fulfill(
        bytes32 _requestId,
        uint256 _result
    ) public recordChainlinkFulfillment(_requestId) {
        // Handle the data received from the Chainlink oracle
        // For example, use the received data to update event or match results
    }

    // Function to withdraw LINK tokens from the contract
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }
}
