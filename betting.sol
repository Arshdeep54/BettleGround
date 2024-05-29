//SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

contract NewBettingDapp
{
    uint256 constant PRECISION = 10**18;

    address payable owner;
    //address payable storingAccount;

    constructor() payable 
    {
        owner = payable(msg.sender);
        //storingAccount = payable(_add);
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
        string[] tags;
        string description;
        string status;
        string endDate;
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
        bool resultAnnounced;
        uint256 winnerID; 

        uint256 funds1; // monies :)
        uint256 funds2;
        uint256 totalFunds;
    }

    mapping(uint256 eventID => Event) public eventIDToEvent;
    mapping(address => bool[100][100]) public hasBetted;
    mapping(uint256 eventID => mapping(uint256 matchID => Bettor[])) public bettors ; // :) used to distribute funds

    Event[] public events;

    function createEvent(string memory _eventName, uint256 _eventID , string[] memory _tags , string memory _description ) public onlyOwner
    {
        //events.push(Event(_eventName,_eventID,new Match[](0))); // this is giving error , hence instead just leave that Match array field , it is already initialised to a dynamic array 
        Event storage newEvent = eventIDToEvent[_eventID];
        newEvent.name = _eventName;
        newEvent.eventID = _eventID;
        newEvent.tags = _tags ; 
        newEvent.description = _description ; 
        events.push(newEvent);
    }

    function createMatch(uint256 _eventID,uint256 _matchID, string memory _side1, string memory _side2 , uint256 _ID1, uint256 _ID2, uint256 _duration ) public onlyOwner
    {
        Event storage currentEvent = eventIDToEvent[_eventID];
        Match memory newMatch = Match(_eventID,_matchID,_side1,_side2,_ID1,_ID2,_duration,"Ongoing",false,115792089237316195423570985008687907853269984665640564039457584007913129639934,0,0,0); // storing (max value - 1)  of uint as winnerID initially
        currentEvent.matches.push(newMatch);
    }

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

    function createBet(uint256 _eventID, uint256 _matchID , uint256 _teamID ) external payable 
    {
        require(msg.sender != owner,"Owner cannot place bets");
        require(msg.value >= 0.01 ether , "Insufficient amount");
        require(hasBetted[msg.sender][_eventID][_matchID] == false,"You have already placed your bet in this match");
        Event storage chosenEvent = eventIDToEvent[_eventID];
        Match[] storage chosenMatches = chosenEvent.matches;
        // bruteforcing because cant place a mapping inside a struct :(
        Match storage chosenMatch = chosenMatches[0]; //initialising to any value otherwise it give error at line 165
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

        hasBetted[msg.sender][_eventID][_matchID] = true;

        // (bool callSuccess,) = owner.call{value : msg.value}("");
        // require(callSuccess,"Failed to send ether");

        Bettor memory newBettor = Bettor(msg.sender,msg.value,_teamID);
        bettors[_eventID][_matchID].push(newBettor);

    }

    function getTotalBetAmount(uint256 _eventID,uint256 _matchID) public view returns(uint256)
    {
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
        return chosenMatch.totalFunds;
    }

    function declareWinnerAndDistribute(uint256 _eventID,uint256 _matchID, uint256 _teamID) public payable onlyOwner
    {

        uint256 share;
        uint256 totalAmt = getTotalBetAmount (_eventID,_matchID) ;
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


        chosenMatch.resultAnnounced = true;
        chosenMatch.winnerID = _teamID;

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
            if(currentBettor.teamID == _teamID) // if the bettor chose the winning team
            {
                uint256 a = currentBettor.amount * PRECISION; // convert all 3 to wei , so that no issues of decimals in calculation
                uint256 b =totalAmt * PRECISION;
                uint256 c = winningTeamAmount * PRECISION;
                //share = (currentBettor.amount * chosenMatch.totalFunds)/winningTeamAmount;
                uint256 d = (a*b)/c;
                share = d/PRECISION; // convert back to ether
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
