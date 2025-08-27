// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Karrot Mesh Oracle - Quorum Median Oracle for Multi-Chain Feeds
contract KarrotMeshOracle {
    struct Report {
        uint256 value;
        uint256 timestamp;
    }

    uint256 public quorum;
    mapping(address => bool) public reporters;
    mapping(uint256 => Report[]) public reports; // roundId => reports
    uint256 public latestValue;
    uint256 public latestRound;

    event ReporterAdded(address reporter);
    event ValueSubmitted(address reporter, uint256 roundId, uint256 value);
    event ValueFinalized(uint256 roundId, uint256 median);

    constructor(uint256 _quorum) {
        quorum = _quorum;
    }

    modifier onlyReporter() {
        require(reporters[msg.sender], "Not authorized reporter");
        _;
    }

    function addReporter(address r) external {
        reporters[r] = true;
        emit ReporterAdded(r);
    }

    function submit(uint256 roundId, uint256 value) external onlyReporter {
        reports[roundId].push(Report(value, block.timestamp));
        emit ValueSubmitted(msg.sender, roundId, value);

        if (reports[roundId].length >= quorum) {
            finalize(roundId);
        }
    }

    function finalize(uint256 roundId) internal {
        Report[] storage r = reports[roundId];
        require(r.length >= quorum, "Not enough reports");

        uint256[] memory values = new uint256[](r.length);
        for (uint256 i = 0; i < r.length; i++) {
            values[i] = r[i].value;
        }

        // sort values
        for (uint256 i = 0; i < values.length; i++) {
            for (uint256 j = i + 1; j < values.length; j++) {
                if (values[j] < values[i]) {
                    uint256 temp = values[i];
                    values[i] = values[j];
                    values[j] = temp;
                }
            }
        }

        uint256 median = values[values.length / 2];
        latestValue = median;
        latestRound = roundId;

        emit ValueFinalized(roundId, median);
    }
}
