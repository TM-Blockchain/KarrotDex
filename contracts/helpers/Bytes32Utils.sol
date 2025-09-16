// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Bytes32Utils {
    function toBytes32(string memory s) internal pure returns (bytes32 r) {
        bytes memory b = bytes(s);
        if (b.length == 0) return bytes32(0);
        assembly {
            r := mload(add(s, 32))
        }
    }
}
