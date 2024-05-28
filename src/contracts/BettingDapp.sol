//SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

contract BettingDapp
{
    address  owner;
    address payable storingAccount;

    constructor(address _add) payable 
    {
        owner = msg.sender;
        storingAccount = payable(_add);
    }
    // owner will make addEvent function, which will add an event and its details.
    // then getEvents function will display all ongoing matches. player will choose event and his outcome and bet.
    // at end of event , owner will announce result and rewards will be distributed

    struct User
    {
        string name;
        address add;
    }

    struct Bettor
    {
        address add;
        uint256 amount;
        uint256 teamID;
    }

    struct Event
    {
        string name;
        uint256 eventID;
        Match[] matches;
    }

    struct Match
    {
        uint256 eventID;
        uint256 matchID;
        string side1;
        string side2;
        uint256 ID1;
        uint256 ID2;
        uint256 duration;
        string status;

        uint256 funds1; // monies :)
        uint256 funds2;
        uint256 totalFunds;
    }

    struct EventDetails 
    {
        string eventName;
        uint256 eventID;
        MatchDetails[] matches;
    }

    struct MatchDetails  
    {
        uint256 matchID;
        string side1;
        string side2;
        string status;
    }

    
    mapping(address => User) public users;
    mapping(uint256 eventID => Event) public eventIDToEvent;
    mapping(address => bool[100][100]) public hasBetted;
    //mapping(uint256[100][100] => Bettor[1000]) public bettors ;  
    mapping(uint256 eventID => mapping(uint256 matchID => Bettor[])) public bettors ; // :) used to distribute funds

    Event[] public events;

    function registerUser(string memory _name) public 
    {
        require(users[msg.sender].add == address(0), "User already registered");
        users[msg.sender] = User(_name, msg.sender);
    }

    function isRegistered() public view returns(bool)
    {
        return users[msg.sender].add !=address(0);
    }

    function createEvent(string memory _eventName, uint256 _eventID) public onlyOwner
    {
        //events.push(Event(_eventName,_eventID,new Match[](0))); // this is giving error , hence instead just leave that Match array field , it is already initialised to a dynamic array 
        Event storage newEvent = eventIDToEvent[_eventID];
        newEvent.name = _eventName;
        newEvent.eventID = _eventID;
        events.push(newEvent);
    }

    function createMatch(uint256 _eventID,uint256 _matchID, string memory _side1, string memory _side2 , uint256 _ID1, uint256 _ID2, uint256 _duration) public onlyOwner
    {
        Event storage currentEvent = eventIDToEvent[_eventID];
        Match memory newMatch = Match(_eventID,_matchID,_side1,_side2,_ID1,_ID2,_duration,"Ongoing",0,0,0);
        currentEvent.matches.push(newMatch);
    }

    // function getEvents() external view returns (EventDetails[] memory) 
    // {
    //     EventDetails[] memory eventDetails = new EventDetails[](events.length);
    //     for (uint256 i = 0; i < events.length; i++) 
    //     {
    //         Event storage currentEvent = events[i];
    //         MatchDetails[] memory matchDetails = new MatchDetails[](currentEvent.matches.length);
    //         for (uint256 j = 0; j < currentEvent.matches.length; j++) 
    //         {
    //             Match memory currentMatch = currentEvent.matches[j];
    //             matchDetails[j] = MatchDetails({
    //                 matchID: currentMatch.matchID,
    //                 side1: currentMatch.side1,
    //                 side2: currentMatch.side2,
    //                 status: currentMatch.status
    //             });
    //         }
    //         eventDetails[i] = EventDetails({
    //             eventName: currentEvent.name,
    //             eventID: currentEvent.eventID,
    //             matches: matchDetails
    //         });
    //     }
    // return eventDetails;
    // }

    function getEvents() external view returns (Event[] memory)         // want to see events and their ID
    {
        return events;
    } 

    function getMatches(uint256 _eventID) external view returns(Match[] memory)         // want to see matches 
    {
        Event storage currentEvent = eventIDToEvent[_eventID];
        Match[] storage currentMatches = currentEvent.matches;
        return currentMatches;
    }

    // now i have made events and their matches 
    //now i have to write function to bet on any match of any event 
    // also, function where owner declares result and prozes are distributed

    function createBet(uint256 _eventID, uint256 _matchID , uint256 _teamID) external payable 
    {
        require(msg.sender != owner,"Owner cannot place bets");
        require(msg.value >= 0.01 ether , "Insufficient amount");
        require(hasBetted[msg.sender][_eventID][_matchID] == false,"You have already placed your bet in this match");
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        // bruteforcing because cant place a mapping inside a struct :(
        Match storage chosenMatch = chosenMatches[0]; //initialising to any value otherwise it give error at line 150
        for(uint i = 0;i<chosenMatches.length;i++)
        {
            if(chosenMatches[i].matchID == _matchID)
            {
                chosenMatch = chosenMatches[i] ;
            }
        }
        // again bruteforce
        if(_teamID == chosenMatch.ID1)
        {
            chosenMatch.funds1 += msg.value ;
            chosenMatch.totalFunds += msg.value ;
        }
        else if (_teamID == chosenMatch.ID2)
        {
            chosenMatch.funds2 += msg.value ;
            chosenMatch.totalFunds += msg.value ;
        }

        hasBetted[msg.sender][_eventID][_matchID] == true;

        (bool callSuccess,) = storingAccount.call{value : msg.value}("");
        require(callSuccess,"Failed to send ether");

    }

    function declareWinnerAndDistribute(uint256 _eventID,uint256 _matchID, uint256 _teamID) public payable onlyOwner
    {

        uint256 share;

        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        // bruteforcing because cant place a mapping inside a struct :(
        Match storage chosenMatch = chosenMatches[0]; //initialising to any value otherwise it give error at line 150
        for(uint i = 0;i<chosenMatches.length;i++)
        {
            if(chosenMatches[i].matchID == _matchID)
            {
                chosenMatch = chosenMatches[i] ;
            }
        }

        uint256 winningTeamAmount;
        if(chosenMatch.ID1 == _teamID)
        {
            winningTeamAmount = chosenMatch.funds1;
        }
        else if(chosenMatch.ID2 == _teamID)
        {
            winningTeamAmount = chosenMatch.funds2;
        }

        Bettor[] storage chosenBettors = bettors[_eventID][_matchID];
        for(uint256 i=0;i<chosenBettors.length;i++)
        {
            Bettor storage currentBettor = chosenBettors[i];
            if(currentBettor.teamID == _teamID)
            {
                share = (currentBettor.amount * chosenMatch.totalFunds)/winningTeamAmount;
                address payable reciever = payable(currentBettor.add);
                (bool callSuccess,) = reciever.call{value : share}("");
                require(callSuccess,"Failed to send ether");
            }
        }
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Must be owner! ");
        _;
    }
}