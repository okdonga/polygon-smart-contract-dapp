//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";

// This is the main building block for smart contracts.
// Diet Challenge
contract DietChallenge {
    string public name = "DietChallenge";
    string public symbol = "DIET";
    // uint256 public DECIMAL_POINTS = 2; // allow up to 2 decimal points

    bool public isLocked = false;
    bool public isRoundOver = false;

    uint256 public dueDate;

    // Related to deposits
    uint256 public totalValueLocked;
    uint256 public totalUsers;

    // Related to withdraw
    uint256 public totalResultsSubmitted;
    uint256 public totalWinners;
    uint256 public winningAmount;
    address[] public userAddresses;

    address public adminAddress;

    struct Result {
        uint256 weight; // weight multiplied by 100 to account up to 2 decimal points
        string ipfsHash;
    }

    struct UserAttributes {
        address payable owner;
        Result goal;
        Result actual;
        uint256 valueLocked;
        bool reached;
    }

    mapping(address => UserAttributes) public tvlByUser;

    //                  REGISTERING_BETS     ChallengePeriod          ResultSubmissionPeriod                                                Withdraw
    //                                     (DIET_CHALLENGE_STARTED~)       (wait period)      (~RESULTS_TALLIED & DIET_CHALLENGE_ENDED)
    //  ====================================================================================================================================================
    //  isLocked        false               true                     true                                                                   false
    //  isRoundOver     false               false                    false                                                                  true
    enum WorkflowStatus {
        REGISTERING_BETS,
        DIET_CHALLENGE_STARTED,
        DIET_CHALLENGE_ENDED
    }

    uint256 duration; // duration of the game
    uint256 wait; // submit result period
    WorkflowStatus public workflowStatus;

    constructor(uint256 _duration, uint256 _wait) {
        adminAddress = msg.sender;
        duration = _duration;
        wait = _wait;

        // restart
        isLocked = false;
        isRoundOver = false;

        workflowStatus = WorkflowStatus.REGISTERING_BETS;
    }

    event DepositCreated(
        uint256 valueLocked,
        uint256 totalValueLocked,
        uint256 totalUsers
    );
    event ResultSubmitted(uint256 totalResultsSubmitted);
    event ResultsTallied(uint256 totalWinners, uint256 winningAmount);
    event WithdrawCreated(uint256 valueWithdrawn, uint256 remainingValue);
    event WorkflowStatusChanged(WorkflowStatus newStatus);

    function getWorkflowStatus()
        public
        view
        returns (
            WorkflowStatus,
            bool,
            bool
        )
    {
        return (workflowStatus, isLocked, isRoundOver);
    }

    function getTotalValueLocked() public view returns (uint256) {
        return address(this).balance;
    }

    /// @notice This returns a list of all the user info
    /// @dev    This data is used to render the list of deposits
    function getAllUserInfo() public view returns (UserAttributes[] memory) {
        UserAttributes[] memory result = new UserAttributes[](
            userAddresses.length
        );
        for (uint256 i = 0; i < userAddresses.length; i++) {
            result[i] = tvlByUser[userAddresses[i]];
        }
        return result;
    }

    /// @notice User can deposit ether and specify their weight goal
    /// @dev    Once all the deposits are made, `freezeFunds()`
    ///         is called to lock the funds and start off the challenge
    function deposit(string memory ipfsHash, uint256 weightGoal)
        public
        payable
        canDeposit
    {
        uint256 valueLocked = msg.value;
        require(valueLocked > 0, "You must submit an amount");

        UserAttributes storage user = tvlByUser[msg.sender];
        require(user.valueLocked == 0, "You already made your deposits");

        user.owner = payable(msg.sender);
        user.goal = Result(weightGoal, ipfsHash);
        user.valueLocked = valueLocked;
        user.reached = false;

        totalValueLocked += valueLocked;
        totalUsers++;

        userAddresses.push(msg.sender);
        emit DepositCreated(valueLocked, totalValueLocked, totalUsers);
    }

    /// @notice User who succeeded in the challenge can withdraw ether
    ///         However, user has to wait until the end of the challenge
    ///         and meet the following requirements:
    ///         1) 2 days (wait period) have passed from the end of the deadline and
    /// @dev    2) `releaseFunds()` has to be called before user can start withdrawing
    function withdraw() public canWithdraw {
        // require(dueDate < block.timestamp, "It must pass the duedate");

        // If the results are not submitted in the next 2 days after the challenge, then
        // the withdrawl those who submitted will occur
        // require(
        //     block.timestamp - dueDate > wait,
        //     "You have to wait until the end of the submission period"
        // );

        require(
            tvlByUser[msg.sender].reached == true,
            "You are not eligible for withdraw"
        );

        require(
            tvlByUser[msg.sender].valueLocked > 0,
            "You have already made your withdrawal"
        );

        require(totalValueLocked > 0, "There is no funds left to claim");
        require(winningAmount > 0, "Wait until the funds are released");
        // pay back to the actual user
        if (totalValueLocked >= winningAmount) {
            payable(msg.sender).transfer(winningAmount);
        } else {
            payable(msg.sender).transfer(totalValueLocked);
        }

        totalValueLocked -= winningAmount;

        tvlByUser[msg.sender].valueLocked = 0; // Mark that the user has made the withdrawal

        emit WithdrawCreated(winningAmount, totalValueLocked);
    }

    function withdrawAll() public onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
        totalValueLocked = 0;
        winningAmount = 0;

        emit WithdrawCreated(winningAmount, totalValueLocked);
    }

    /// @notice User submit their results at the end of the challenge
    /// @dev    The result on whether a user succeeded or not is saved
    ///         Also count the total number of users who succeeded the challenge
    ///         The total number of users who submitted the result are saved too
    function submitResult(string memory ipfsHash, uint256 weightActual) public {
        require(
            dueDate < block.timestamp,
            "You must wait until the due date to submit a result"
        );
        require(
            isLocked == true && isRoundOver == false,
            "You must wait for the admin to confirm"
        );
        UserAttributes storage user = tvlByUser[msg.sender];
        require(
            user.owner == msg.sender,
            "You can only submit your own result"
        );

        // TODO: You can only submit once
        user.actual = Result(weightActual, ipfsHash);
        if (user.goal.weight >= weightActual) {
            user.reached = true;
            totalWinners++;
        }

        totalResultsSubmitted++;

        emit ResultSubmitted(totalResultsSubmitted);
    }

    /// @notice  This locks the funds, and starts the diet challenge
    /// @dev     This is called after all the deposits are made
    function freezeFunds() public onlyAdmin canDeposit {
        setDueDate();
        lock();
        start();
        workflowStatus = WorkflowStatus.DIET_CHALLENGE_STARTED;

        emit WorkflowStatusChanged(workflowStatus);
    }

    /// @notice This calculates amount to distribute to the winners
    /// @dev    This is called after results are submitted
    ///         This will be registered in the upkeep - to be called 2 days after the dueDate
    function releaseFunds() public onlyAdmin {
        // passed deadline
        require(
            isLocked == true && isRoundOver == false,
            "The game has not even started"
        );
        require(
            dueDate + wait < block.timestamp,
            "You must wait until the end of the submission period"
        );

        if (totalWinners > 0) {
            winningAmount = totalValueLocked / totalWinners;
        } else {
            winningAmount = totalValueLocked;
        }

        unlock();
        end();
        workflowStatus = WorkflowStatus.DIET_CHALLENGE_ENDED;

        emit ResultsTallied(totalWinners, winningAmount);
        emit WorkflowStatusChanged(workflowStatus);
    }

    /// @notice This indicates when the funds are locked for both deposit and withdraw
    /// @dev    The fund is locked during the period of the challenge (challenge ~ )
    ///         It is not locked during the deposit period
    ///         Then 'locked' during the challenge and until the results are submitted
    ///         (up to 2 days after the end of the challenge)
    ///         Then finally during withdrawal, the fund is unlocked
    function lock() private {
        isLocked = true;
    }

    function unlock() private {
        isLocked = false;
    }

    /// @notice This indicates the status of the game
    /// @dev    It is set false by default, and only set to true
    ///         to allow withdrawl after all the results are submitted
    function start() private {
        isRoundOver = false;
    }

    /// @notice This indicates the status of the game
    /// @dev    It is set false by default, and only set to true
    ///         to allow withdrawl after all the results are submitted
    function end() private {
        isRoundOver = true;
    }

    /// @notice  This kicks off a new round of challenge
    //           Users can start depositing
    /// @dev     This resets all the values
    function restart() public onlyAdmin canWithdraw {
        unlock();
        start();

        // totalValueLocked = 0; // accumulates
        totalUsers = 0;
        totalResultsSubmitted = 0;
        totalWinners = 0;
        winningAmount = 0;
        dueDate = 0;

        for (uint256 i = 0; i < userAddresses.length; i++) {
            delete tvlByUser[userAddresses[i]];
        }

        delete userAddresses;

        workflowStatus = WorkflowStatus.REGISTERING_BETS;

        emit WorkflowStatusChanged(workflowStatus);
    }

    /// @notice This sets the period of the challenge
    /// @dev    This is set after all the deposits are made and kicks off the timer
    function setDueDate() private {
        dueDate = block.timestamp + duration;
    }

    /// @notice This simulates that a due date is over, and ready to accept results
    ///         from users
    /// @dev    This is added for testing purpose only
    function forceDueDate() public onlyAdmin {
        dueDate = block.timestamp - 1 days;
    }

    /// @notice User can withdraw once challenge is over and the results are submitted
    ///         There is a 2 day wait after the deadline, to allow time for users to
    ///         submit results
    /// @dev    This is used to check game status before withdraw function is called
    modifier canWithdraw() {
        require(
            isRoundOver == true && isLocked == false,
            "NOT_ELIGITBLE_TO_WITHDRAW"
        );
        _;
    }

    /// @notice User can deposit only when the previous round is finished
    /// @dev    It is required that the `restart()` is called
    ///         to restart the challenge and start accepting new deposits
    modifier canDeposit() {
        require(
            isRoundOver == false && isLocked == false,
            "NOT_ELIGIBLE_TO_DEPOSIT"
        );
        _;
    }

    /// @dev The address with which the contract is deployed becomes the admin
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "ADMIN_ONLY");
        _;
    }
}
