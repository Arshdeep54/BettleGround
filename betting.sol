// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract NewBettingDapp is ChainlinkClient, ConfirmedOwner {
    uint256 constant PRECISION = 10**18; // Precision constant for calculations
    uint256 constant MAX_UINT256 = type(uint256).max;
    uint256 public newEventID = 1;

    // Chainlink variables
    uint256 public fee; // Chainlink fee for requesting data
    bytes32 public jobId; // Chainlink job ID for requesting data

    // Mappings to store requestId to eventId and matchId
    mapping(bytes32 => uint256) public requestIdToEventId;
    mapping(bytes32 => uint256) public requestIdToMatchId;

    constructor() ConfirmedOwner(msg.sender) {
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
        string uid;
        Match[] matches;
        string[] tags;
        string hostedBy;
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
        string memory _uid,
        string[] memory _tags,
        string memory _hostedBy,
        string memory _description,
        string memory _status,
        string memory _endDate
    ) public onlyOwner {
        uint256 _eventID = newEventID++;
        Event storage newEvent = eventIDToEvent[_eventID];
        newEvent.name = _eventName;
        newEvent.eventID = _eventID;
        newEvent.uid = _uid;
        newEvent.tags = _tags;
        newEvent.hostedBy = _hostedBy;
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
            MAX_UINT256, // Initial winnerID set to max uint value
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
    function getMatches(uint256 _eventID)
        external
        view
        returns (Match[] memory)
    {
        Event storage currentEvent = eventIDToEvent[_eventID];
        return currentEvent.matches;
    }

    // Function to place a bet on a match
    function createBet(
        uint256 _eventID,
        uint256 _matchID,
        uint256 _teamID
    ) external payable {
        require(msg.sender != owner(), "Owner cannot place bets");
        require(msg.value >= 0.01 ether, "Insufficient amount");
        require(
            !hasBetted[msg.sender][_eventID][_matchID],
            "You have already placed your bet in this match"
        );
        Match storage chosenMatch = getMatchByID(_eventID, _matchID);

        if (_teamID == chosenMatch.ID1) {
            chosenMatch.funds1 += msg.value;
        } else if (_teamID == chosenMatch.ID2) {
            chosenMatch.funds2 += msg.value;
        } else {
            revert("Invalid team ID");
        }
        chosenMatch.totalFunds += msg.value;

        hasBetted[msg.sender][_eventID][_matchID] = true;
        Bettor memory newBettor = Bettor(msg.sender, msg.value, _teamID);
        bettors[_eventID][_matchID].push(newBettor);
    }

    // Function to get the total bet amount for a match
    function getTotalBetAmount(uint256 _eventID, uint256 _matchID)
        public
        view
        returns (uint256)
    {
        Match storage chosenMatch = getMatchByID(_eventID, _matchID);
        return chosenMatch.totalFunds;
    }

    // Function to declare the winner and distribute the funds
    function declareWinnerAndDistribute(
        uint256 _eventID,
        uint256 _matchID,
        uint256 _teamID
    ) public payable onlyOwner {
        Match storage chosenMatch = getMatchByID(_eventID, _matchID);

        chosenMatch.resultAnnounced = true;
        chosenMatch.winnerID = _teamID;

        uint256 winningTeamAmount;
        if (chosenMatch.ID1 == _teamID) {
            winningTeamAmount = chosenMatch.funds1;
        } else if (chosenMatch.ID2 == _teamID) {
            winningTeamAmount = chosenMatch.funds2;
        }

        uint256 totalAmt = chosenMatch.totalFunds;
        Bettor[] storage chosenBettors = bettors[_eventID][_matchID];
        for (uint256 i = 0; i < chosenBettors.length; i++) {
            Bettor storage currentBettor = chosenBettors[i];
            if (currentBettor.teamID == _teamID) {
                uint256 share = (currentBettor.amount * totalAmt) /
                    winningTeamAmount;
                address payable receiver = payable(currentBettor.add);
                (bool callSuccess, ) = receiver.call{value: share}("");
                require(callSuccess, "Failed to send ether");
            }
        }
    }

    // Callback function to receive data from the Chainlink oracle
    function fulfill(bytes32 _requestId, uint256 _result)
        public
        recordChainlinkFulfillment(_requestId)
    {
        // Retrieve eventId and matchId based on the requestId
        uint256 eventId = requestIdToEventId[_requestId];
        uint256 matchId = requestIdToMatchId[_requestId];

        // Update the match with the received winner ID
        Match storage chosenMatch = getMatchByID(eventId, matchId);
        chosenMatch.resultAnnounced = true;
        chosenMatch.winnerID = _result;

        // Distribute funds to the winning bettors
        declareWinnerAndDistribute(eventId, matchId, _result);
    }

    // Function to request data from the Chainlink oracle
     function requestData(
         string memory url,
         string memory path,
         uint256 eventId,
         uint256 matchId
     ) public onlyOwner returns (bytes32 requestId) {
         Chainlink.Request memory request = _buildChainlinkRequest(
             jobId,
             address(this),
             this.fulfill.selector
         );
         request._add("get", url);
         request._add("path", path);
         requestId = _sendChainlinkRequest(request, fee);

    // Store the mapping of requestId to eventId and matchId
          requestIdToEventId[requestId] = eventId;
         requestIdToMatchId[requestId] = matchId;
         return requestId;
     }

    // Function to request cross-chain data from Chainlink CCIP
    function requestCrossChainData(uint256 eventId, uint256 matchId)
        public
        returns (bytes32 requestId)
    {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillCrossChainData.selector
        );
        req.add("eventId", uint256ToString(eventId));
        req.add("matchId", uint256ToString(matchId));
        return _sendChainlinkRequest(req, fee);
    }

    // Callback function to handle cross-chain data from Chainlink CCIP
    function fulfillCrossChainData(bytes32 _requestId, bytes memory data)
        public
        recordChainlinkFulfillment(_requestId)
    {
        // Parse the cross-chain data (assuming data format is known)
        // Example: Update event or match results based on the data
        (uint256 eventId, uint256 matchId, uint256 winnerId) = abi.decode(
            data,
            (uint256, uint256, uint256)
        );

        // Update the match with the received winner ID
        Match storage chosenMatch = getMatchByID(eventId, matchId);
        chosenMatch.resultAnnounced = true;
        chosenMatch.winnerID = winnerId;

        // Distribute funds to the winning bettors
        declareWinnerAndDistribute(eventId, matchId, winnerId);
    }

    // Function to withdraw LINK tokens from the contract
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    // Helper function to get match by ID
    function getMatchByID(uint256 _eventID, uint256 _matchID)
        internal
        view
        returns (Match storage)
    {
        Event storage chosenEvent = eventIDToEvent[_eventID];
        for (uint256 i = 0; i < chosenEvent.matches.length; i++) {
            if (chosenEvent.matches[i].matchID == _matchID) {
                return chosenEvent.matches[i];
            }
        }
        revert("Match not found");
    }

    // Helper function to convert uint256 to string
    function uint256ToString(uint256 value)
        internal
        pure
        returns (string memory)
    {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
