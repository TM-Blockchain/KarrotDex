// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Errors {
    error NotAuthorized();
    error StaleData();
    error DeadlineExceeded();
    error Slippage();
    error ZeroAddress();
    error InvalidParam();
}
