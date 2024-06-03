// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract NewBettingDapp is ChainlinkClient, ConfirmedOwner {
    uint256 constant PRECISION = 10**18; // Precision constant for calculations
    address payable public ownerAddr; // Contract owner
    uint256 constant MAX_UINT256 = type(uint256).max;
    uint256 public newEventID = 1;

    // Chainlink variables
    uint256 public fee; // Chainlink fee for requesting data
    bytes32 public jobId; // Chainlink job ID for requesting data

    // Mappings to store requestId to eventId and matchId
    mapping(bytes32 => uint256) public requestIdToEventId;
    mapping(bytes32 => uint256) public requestIdToMatchId;

    constructor() ConfirmedOwner(msg.sender) {
        ownerAddr = payable(msg.sender);

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
    ) public onlyowner {
        //events.push(Event(_eventName,_eventID,new Match[](0))); // this is giving error , hence instead just leave that Match array field , it is already initialised to a dynamic array
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
    ) public onlyowner {
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
        returns (
            Match[] memory // want to see matches
        )
    {
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
        require(msg.sender != ownerAddr, "Owner cannot place bets");
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
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        // bruteforcing because cant place a mapping inside a struct :(
        Match storage chosenMatch = chosenMatches[0]; //initialising to any value otherwise it give error at line 150
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
    ) public payable onlyowner {
        uint256 share;
        uint256 totalAmt = getTotalBetAmount(_eventID, _matchID);
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        // bruteforcing because cant place a mapping inside a struct :(
        Match storage chosenMatch = chosenMatches[0]; //initialising to any value otherwise it give error at line 150
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

        Bettor[] storage chosenBettors = bettors[_eventID][_matchID];

        for (uint256 i = 0; i < chosenBettors.length; i++) {
            Bettor storage currentBettor = chosenBettors[i];
            if (
                currentBettor.teamID == _teamID
            ) // if the bettor chose the winning team
            {
                uint256 a = currentBettor.amount * PRECISION; // convert all 3 to wei , so that no issues of decimals in calculation
                uint256 b = totalAmt * PRECISION;
                uint256 c = winningTeamAmount * PRECISION;
                //share = (currentBettor.amount * chosenMatch.totalFunds)/winningTeamAmount;
                uint256 d = (a * b) / c;
                share = d / PRECISION; // convert back to ether
                address payable reciever = payable(currentBettor.add);
                (bool callSuccess, ) = reciever.call{value: share}("");
                require(callSuccess, "Failed to send ether");
            }
        }
    }

    // Function to request data from the Chainlink oracle
    // function requestData(
    //     string memory url,
    //     string memory path,
    //     uint256 eventId,
    //     uint256 matchId
    // ) public onlyOwner returns (bytes32 requestId) {
    //     Chainlink.Request memory request = _buildChainlinkRequest(
    //         jobId,
    //         address(this),
    //         this.fulfill.selector
    //     );
    //     request.add("get", url);
    //     request.add("path", path);
    //     requestId = _sendChainlinkRequest(request, fee);

    //     // Store the mapping of requestId to eventId and matchId
    //     requestIdToEventId[requestId] = eventId;
    //     requestIdToMatchId[requestId] = matchId;
    //     return requestId;
    // }

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

    // Function to request cross-chain data from Chainlink CCIP
    function requestCrossChainData(uint256 eventId, uint256 matchId)
        public
        returns (bytes32 requestId)
    {
        Chainlink.Request memory request = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfillCrossChainData.selector
        );
        request.add("eventId", eventId);
        request.addUint("matchId", matchId);
        return _sendChainlinkRequest(request, fee);
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
    function withdrawLink() public onlyowner {
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

    // Modifier to restrict access to the owner
    modifier onlyowner() {
        require(msg.sender == ownerAddr, "Must be owner!");
        _;
    }
}
