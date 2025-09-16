// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library OracleUtils {
    struct Price {
        uint256 value;
        uint256 updatedAt;
    }

    function isStale(Price memory p, uint256 heartbeat) internal view returns (bool) {
        return p.updatedAt == 0 || block.timestamp - p.updatedAt > heartbeat;
    }
}
