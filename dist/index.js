'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var starknet = require('starknet');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

const wallets = [
    {
        id: "braavos",
        name: "Braavos",
        icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgLz4KICAgIDxtYXNrIGlkPSJwYXRoLTEtaW5zaWRlLTFfMTc0XzEyOTEiID4KICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzMi40OTkgMzYuMjQ5OEMxMzIuMDEyIDM2LjIyMDQgMTMxLjUyMiAzNi4yMDU0IDEzMS4wMjggMzYuMjA1NEMxMTguMDE0IDM2LjIwNTQgMTA3LjQzNSA0Ni41NzY0IDEwNy4xODUgNTkuNDY0MUMxMDIuNzI4IDU4LjYyNTcgOTguMTA4OCA1OC41NjIyIDkzLjU0NTkgNTkuMzM1NkM5My4yMjg5IDQ2LjUwNzYgODIuNjc2NSAzNi4yMDU0IDY5LjcwNTQgMzYuMjA1NEM2OS4yMTE4IDM2LjIwNTQgNjguNzIxNiAzNi4yMjAzIDY4LjIzNTQgMzYuMjQ5OEM3NC4zMzM2IDI0Ljc5OTkgODYuNDM0NyAxNyAxMDAuMzY3IDE3QzExNC4yOTkgMTcgMTI2LjQgMjQuNzk5OSAxMzIuNDk5IDM2LjI0OThaIi8+CiAgICA8L21hc2s+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzMi40OTkgMzYuMjQ5OEMxMzIuMDEyIDM2LjIyMDQgMTMxLjUyMiAzNi4yMDU0IDEzMS4wMjggMzYuMjA1NEMxMTguMDE0IDM2LjIwNTQgMTA3LjQzNSA0Ni41NzY0IDEwNy4xODUgNTkuNDY0MUMxMDIuNzI4IDU4LjYyNTcgOTguMTA4OCA1OC41NjIyIDkzLjU0NTkgNTkuMzM1NkM5My4yMjg5IDQ2LjUwNzYgODIuNjc2NSAzNi4yMDU0IDY5LjcwNTQgMzYuMjA1NEM2OS4yMTE4IDM2LjIwNTQgNjguNzIxNiAzNi4yMjAzIDY4LjIzNTQgMzYuMjQ5OEM3NC4zMzM2IDI0Ljc5OTkgODYuNDM0NyAxNyAxMDAuMzY3IDE3QzExNC4yOTkgMTcgMTI2LjQgMjQuNzk5OSAxMzIuNDk5IDM2LjI0OThaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTc0XzEyOTEpIi8+CiAgICA8cGF0aCBkPSJNMTMyLjQ5OSAzNi4yNDk4TDEzMi40MjggMzcuNDI0MUwxMzQuNTI1IDM3LjU1MUwxMzMuNTM3IDM1LjY5NjdMMTMyLjQ5OSAzNi4yNDk4Wk0xMDcuMTg1IDU5LjQ2NDFMMTA2Ljk2OCA2MC42MjAzTDEwOC4zMzQgNjAuODc3NEwxMDguMzYxIDU5LjQ4NjlMMTA3LjE4NSA1OS40NjQxWk05My41NDU5IDU5LjMzNTZMOTIuMzY5OCA1OS4zNjQ3TDkyLjQwMzQgNjAuNzIyNUw5My43NDI1IDYwLjQ5NTVMOTMuNTQ1OSA1OS4zMzU2Wk02OC4yMzU0IDM2LjI0OThMNjcuMTk3IDM1LjY5NjdMNjYuMjA5NCAzNy41NTFMNjguMzA2NCAzNy40MjQxTDY4LjIzNTQgMzYuMjQ5OFpNMTMxLjAyOCAzNy4zODE5QzEzMS40OTggMzcuMzgxOSAxMzEuOTY1IDM3LjM5NjEgMTMyLjQyOCAzNy40MjQxTDEzMi41NyAzNS4wNzU1QzEzMi4wNiAzNS4wNDQ2IDEzMS41NDYgMzUuMDI5IDEzMS4wMjggMzUuMDI5VjM3LjM4MTlaTTEwOC4zNjEgNTkuNDg2OUMxMDguNTk4IDQ3LjI0NDMgMTE4LjY1MSAzNy4zODE5IDEzMS4wMjggMzcuMzgxOVYzNS4wMjlDMTE3LjM3NyAzNS4wMjkgMTA2LjI3MSA0NS45MDg2IDEwNi4wMDkgNTkuNDQxNEwxMDguMzYxIDU5LjQ4NjlaTTkzLjc0MjUgNjAuNDk1NUM5OC4xNjU5IDU5Ljc0NTggMTAyLjY0NCA1OS44MDcyIDEwNi45NjggNjAuNjIwM0wxMDcuNDAzIDU4LjMwNzlDMTAyLjgxMSA1Ny40NDQyIDk4LjA1MTcgNTcuMzc4NiA5My4zNDkzIDU4LjE3NTdMOTMuNzQyNSA2MC40OTU1Wk02OS43MDU0IDM3LjM4MTlDODIuMDQyIDM3LjM4MTkgOTIuMDY4NiA0Ny4xNzg4IDkyLjM2OTggNTkuMzY0N0w5NC43MjIgNTkuMzA2NkM5NC4zODkxIDQ1LjgzNjMgODMuMzExIDM1LjAyOSA2OS43MDU0IDM1LjAyOVYzNy4zODE5Wk02OC4zMDY0IDM3LjQyNDFDNjguNzY5IDM3LjM5NjEgNjkuMjM1NSAzNy4zODE5IDY5LjcwNTQgMzcuMzgxOVYzNS4wMjlDNjkuMTg4IDM1LjAyOSA2OC42NzQyIDM1LjA0NDYgNjguMTY0MyAzNS4wNzU0TDY4LjMwNjQgMzcuNDI0MVpNMTAwLjM2NyAxNS44MjM1Qzg1Ljk4NTEgMTUuODIzNSA3My40OTI1IDIzLjg3NjQgNjcuMTk3IDM1LjY5NjdMNjkuMjczNyAzNi44MDI4Qzc1LjE3NDcgMjUuNzIzNCA4Ni44ODQyIDE4LjE3NjUgMTAwLjM2NyAxOC4xNzY1VjE1LjgyMzVaTTEzMy41MzcgMzUuNjk2N0MxMjcuMjQxIDIzLjg3NjQgMTE0Ljc0OSAxNS44MjM1IDEwMC4zNjcgMTUuODIzNVYxOC4xNzY1QzExMy44NSAxOC4xNzY1IDEyNS41NTkgMjUuNzIzNCAxMzEuNDYgMzYuODAyOEwxMzMuNTM3IDM1LjY5NjdaIiAgbWFzaz0idXJsKCNwYXRoLTEtaW5zaWRlLTFfMTc0XzEyOTEpIi8+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQzLjg0NDkgMTA3LjYxN0w5OS45OTk2IDkwLjcyMTJMMTU3LjUzMSAxMDguMDMxQzE1OC4zMTggMTEwLjI3NCAxNTguNzQ5IDExMS44NzMgMTU4LjkxMSAxMTIuNTEyQzE1OC45NjggMTEyLjczOCAxNTguOTk0IDExMi45MjQgMTU5LjAxMSAxMTMuMTU3QzE1OS4xOTggMTE1LjczNCAxNjAuMzY4IDEzMi41MjMgMTU5Ljg4MyAxNDMuNjE3QzE1OS41OTEgMTUwLjI5IDE1OS4xMDEgMTYwLjI0OCAxNTkuMDAzIDE2Mi4yMjJDMTU4Ljk5MiAxNjIuNDU3IDE1OC45OTcgMTYyLjY3NCAxNTkuMDExIDE2Mi45MDlDMTU5LjE3MSAxNjUuNTk3IDE1OS40ODggMTgzLjMwNiAxNDAuMTcxIDE4My4zMDZDMTIzLjA2NSAxODMuMzA2IDExOS4wNzIgMTc0LjkwMyAxMTguMzM1IDE3Mi43NzhDMTE4LjIyNSAxNzIuNDYgMTE4LjE5IDE3Mi4xMjQgMTE4LjE5IDE3MS43ODdWMTU1LjM2MkMxMTguMTkgMTUzLjYwNCAxMTkuMTc0IDE1MS45OTUgMTIwLjcyNSAxNTEuMTY4QzEyMy43MDMgMTQ5LjU3OSAxMjYuMDggMTQ4LjIyNyAxMjguNDU3IDE0Ni44NzRDMTMxLjQ3MSAxNDUuMTYgMTM0LjQ4NCAxNDMuNDQ1IDEzOC43MjQgMTQxLjI0OEMxNDcuMjAyIDEzNi44NTMgMTQ4LjEzMSAxMjUuMjU3IDE0OC4xMzEgMTI1LjI1N0MxNDguMTMxIDEyNS4yNTcgMTM1LjY2NSAxMjIuMDQyIDEyOC4wMzQgMTIzLjMxNEMxMjIuMyAxMjQuMjcgMTE0LjQ2NCAxMjguNTY2IDExMC45MjUgMTMwLjY0MkMxMDkuNzI4IDEzMS4zNDQgMTA4Ljk0NSAxMzIuNTY1IDEwOC43NTYgMTMzLjkzOUwxMDUuOTkzIDE1NC4wODdDMTA1LjY3MyAxNTYuNDE3IDEwMy42ODMgMTU4LjE1MyAxMDEuMzMxIDE1OC4xNTNIOTkuNTIxOEM5Ny4xMjE0IDE1OC4xNTMgOTUuMTA1OCAxNTYuMzQ3IDk0Ljg0NCAxNTMuOTYxTDkyLjY3MiAxMzQuMTY2QzkyLjUwNzEgMTMyLjY2MyA5MS42MzE1IDEzMS4zMzEgOTAuMjk0NSAxMzAuNjI0Qzg2LjM5MDkgMTI4LjU2MSA3Ny45MTE0IDEyNC4zNDUgNzEuOTgxMSAxMjMuMzE0QzYzLjYxNDYgMTIxLjg2IDUxLjg4NDUgMTI1LjI1NyA1MS44ODQ1IDEyNS4yNTdDNTEuODg0NSAxMjUuMjU3IDU2LjA2MDUgMTM2LjAzNSA2MS4yOTIgMTQxLjI0OEM2Ni4wOTgzIDE0Ni4wMzcgNzUuMzcyNCAxNDkuNjk0IDgwLjM1ODUgMTUxLjQxNUM4Mi4zNDE5IDE1Mi4xIDgzLjcyNTQgMTUzLjk0NiA4My43MjU0IDE1Ni4wNDRWMTcwLjk4QzgzLjcyNTQgMTcxLjg0IDgzLjQ5MzcgMTcyLjY4MiA4Mi45NjU3IDE3My4zNkM4MC44MTI5IDE3Ni4xMjQgNzMuOTcyOSAxODMuMzA2IDYxLjAyMTIgMTgzLjMwNkM0NC40MTgxIDE4My4zMDYgNDEuMTYwOCAxNjUuMzk4IDQwLjgwNTEgMTYzLjA1MUM0MC43NzkyIDE2Mi44OCA0MC43Njg3IDE2Mi43MTUgNDAuNzY2NiAxNjIuNTQyQzQwLjc0NTkgMTYwLjgzMiA0MC42MDg5IDE1MC45MjEgNDAuMTMyNSAxNDMuNjE3QzM5LjM4NDUgMTMyLjE0NyA0Mi4wMzYgMTE0LjU1NSA0Mi4yODQ5IDExMi45NEM0Mi4yOTg1IDExMi44NTEgNDIuMzExOCAxMTIuNzgxIDQyLjMzMiAxMTIuNjk0QzQyLjQ0NDcgMTEyLjIwOSA0Mi45MDAxIDExMC4zNDQgNDMuODQ0OSAxMDcuNjE3WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzE3NF8xMjkxKSIvPgogICAgPHBhdGggZD0iTTQzLjg0NDkgMTA3LjYxN0w0My42NzU0IDEwNy4wNTNMNDMuMzg3NSAxMDcuMTRMNDMuMjg5MSAxMDcuNDI0TDQzLjg0NDkgMTA3LjYxN1pNOTkuOTk5NiA5MC43MjEyTDEwMC4xNjkgOTAuMTU3OUw5OS45OTk2IDkwLjEwNjlMOTkuODMwMSA5MC4xNTc5TDk5Ljk5OTYgOTAuNzIxMlpNMTU3LjUzMSAxMDguMDMxTDE1OC4wODYgMTA3LjgzNkwxNTcuOTg3IDEwNy41NTRMMTU3LjcwMSAxMDcuNDY3TDE1Ny41MzEgMTA4LjAzMVpNMTU4LjkxMSAxMTIuNTEyTDE1OS40ODEgMTEyLjM2N0wxNTkuNDgxIDExMi4zNjdMMTU4LjkxMSAxMTIuNTEyWk0xNTkuMDExIDExMy4xNTdMMTU5LjU5OCAxMTMuMTE0TDE1OS41OTggMTEzLjExNEwxNTkuMDExIDExMy4xNTdaTTE1OS44ODMgMTQzLjYxN0wxNTkuMjk1IDE0My41OTFMMTU5LjI5NSAxNDMuNTkxTDE1OS44ODMgMTQzLjYxN1pNMTU5LjAwMyAxNjIuMjIyTDE1OC40MTYgMTYyLjE5M0wxNTguNDE2IDE2Mi4xOTNMMTU5LjAwMyAxNjIuMjIyWk0xNTkuMDExIDE2Mi45MDlMMTU4LjQyNCAxNjIuOTQ0TDE1OC40MjQgMTYyLjk0NEwxNTkuMDExIDE2Mi45MDlaTTExOC4zMzUgMTcyLjc3OEwxMTguODkxIDE3Mi41ODVMMTE4Ljg5MSAxNzIuNTg1TDExOC4zMzUgMTcyLjc3OFpNMTIwLjcyNSAxNTEuMTY4TDEyMC40NDggMTUwLjY0OUwxMjAuNDQ4IDE1MC42NDlMMTIwLjcyNSAxNTEuMTY4Wk0xMjguNDU3IDE0Ni44NzRMMTI4Ljc0OCAxNDcuMzg2TDEyOC43NDggMTQ3LjM4NkwxMjguNDU3IDE0Ni44NzRaTTEzOC43MjQgMTQxLjI0OEwxMzguOTk0IDE0MS43N0wxMzguOTk0IDE0MS43N0wxMzguNzI0IDE0MS4yNDhaTTE0OC4xMzEgMTI1LjI1N0wxNDguNzE3IDEyNS4zMDRMMTQ4Ljc1NyAxMjQuODExTDE0OC4yNzggMTI0LjY4OEwxNDguMTMxIDEyNS4yNTdaTTEyOC4wMzQgMTIzLjMxNEwxMjguMTMxIDEyMy44OTRMMTI4LjEzMSAxMjMuODk0TDEyOC4wMzQgMTIzLjMxNFpNMTEwLjkyNSAxMzAuNjQyTDExMC42MjcgMTMwLjEzNUwxMTAuNjI3IDEzMC4xMzVMMTEwLjkyNSAxMzAuNjQyWk0xMDguNzU2IDEzMy45MzlMMTA5LjMzOSAxMzQuMDE5TDEwOS4zMzkgMTM0LjAxOUwxMDguNzU2IDEzMy45MzlaTTEwNS45OTMgMTU0LjA4N0wxMDYuNTc2IDE1NC4xNjdMMTA2LjU3NiAxNTQuMTY3TDEwNS45OTMgMTU0LjA4N1pNOTQuODQ0IDE1My45NjFMOTQuMjU5MiAxNTQuMDI1TDk0LjI1OTIgMTU0LjAyNUw5NC44NDQgMTUzLjk2MVpNOTIuNjcyIDEzNC4xNjZMOTIuMDg3MyAxMzQuMjNMOTIuMDg3MyAxMzQuMjNMOTIuNjcyIDEzNC4xNjZaTTkwLjI5NDUgMTMwLjYyNEw5MC4wMTk2IDEzMS4xNDRMOTAuMDE5NiAxMzEuMTQ0TDkwLjI5NDUgMTMwLjYyNFpNNzEuOTgxMSAxMjMuMzE0TDcxLjg4MDMgMTIzLjg5NEw3MS44ODAzIDEyMy44OTRMNzEuOTgxMSAxMjMuMzE0Wk01MS44ODQ1IDEyNS4yNTdMNTEuNzIwOCAxMjQuNjkyTDUxLjEwMzkgMTI0Ljg3MUw1MS4zMzU5IDEyNS40N0w1MS44ODQ1IDEyNS4yNTdaTTYxLjI5MiAxNDEuMjQ4TDYwLjg3NjggMTQxLjY2NUw2MC44NzY4IDE0MS42NjVMNjEuMjkyIDE0MS4yNDhaTTgwLjM1ODUgMTUxLjQxNUw4MC4xNjY1IDE1MS45NzFMODAuMTY2NSAxNTEuOTcxTDgwLjM1ODUgMTUxLjQxNVpNODIuOTY1NyAxNzMuMzZMODIuNTAxNiAxNzIuOTk5TDgyLjUwMTYgMTcyLjk5OUw4Mi45NjU3IDE3My4zNlpNNDAuODA1MSAxNjMuMDUxTDQwLjIyMzUgMTYzLjEzOUw0MC4yMjM1IDE2My4xMzlMNDAuODA1MSAxNjMuMDUxWk00MC43NjY2IDE2Mi41NDJMNDEuMzU0OCAxNjIuNTM1TDQxLjM1NDggMTYyLjUzNUw0MC43NjY2IDE2Mi41NDJaTTQwLjEzMjUgMTQzLjYxN0w0MC43MTk1IDE0My41NzlMNDAuNzE5NSAxNDMuNTc5TDQwLjEzMjUgMTQzLjYxN1pNNDIuMjg0OSAxMTIuOTRMNDIuODY2MyAxMTMuMDI5TDQyLjg2NjMgMTEzLjAyOUw0Mi4yODQ5IDExMi45NFpNNDIuMzMyIDExMi42OTRMNDEuNzU5IDExMi41NjFMNDEuNzU5IDExMi41NjFMNDIuMzMyIDExMi42OTRaTTQ0LjAxNDQgMTA4LjE4TDEwMC4xNjkgOTEuMjg0NUw5OS44MzAxIDkwLjE1NzlMNDMuNjc1NCAxMDcuMDUzTDQ0LjAxNDQgMTA4LjE4Wk05OS44MzAxIDkxLjI4NDVMMTU3LjM2MiAxMDguNTk0TDE1Ny43MDEgMTA3LjQ2N0wxMDAuMTY5IDkwLjE1NzlMOTkuODMwMSA5MS4yODQ1Wk0xNTkuNDgxIDExMi4zNjdDMTU5LjMxNiAxMTEuNzE0IDE1OC44OCAxMTAuMDk4IDE1OC4wODYgMTA3LjgzNkwxNTYuOTc2IDEwOC4yMjZDMTU3Ljc1NiAxMTAuNDQ5IDE1OC4xODIgMTEyLjAzMSAxNTguMzQgMTEyLjY1NkwxNTkuNDgxIDExMi4zNjdaTTE1OS41OTggMTEzLjExNEMxNTkuNTc5IDExMi44NTUgMTU5LjU0OCAxMTIuNjM0IDE1OS40ODEgMTEyLjM2N0wxNTguMzQgMTEyLjY1NkMxNTguMzg3IDExMi44NDIgMTU4LjQwOSAxMTIuOTk0IDE1OC40MjQgMTEzLjE5OUwxNTkuNTk4IDExMy4xMTRaTTE2MC40NzEgMTQzLjY0M0MxNjAuOTU4IDEzMi41MDkgMTU5Ljc4NSAxMTUuNjg2IDE1OS41OTggMTEzLjExNEwxNTguNDI0IDExMy4xOTlDMTU4LjYxMiAxMTUuNzgyIDE1OS43NzkgMTMyLjUzNyAxNTkuMjk1IDE0My41OTFMMTYwLjQ3MSAxNDMuNjQzWk0xNTkuNTkxIDE2Mi4yNTFDMTU5LjY4OCAxNjAuMjc3IDE2MC4xNzkgMTUwLjMxOCAxNjAuNDcxIDE0My42NDNMMTU5LjI5NSAxNDMuNTkxQzE1OS4wMDMgMTUwLjI2MiAxNTguNTEzIDE2MC4yMTggMTU4LjQxNiAxNjIuMTkzTDE1OS41OTEgMTYyLjI1MVpNMTU5LjU5OCAxNjIuODc0QzE1OS41ODUgMTYyLjY1MiAxNTkuNTggMTYyLjQ1NyAxNTkuNTkxIDE2Mi4yNTFMMTU4LjQxNiAxNjIuMTkzQzE1OC40MDMgMTYyLjQ1NiAxNTguNDA5IDE2Mi42OTYgMTU4LjQyNCAxNjIuOTQ0TDE1OS41OTggMTYyLjg3NFpNMTQwLjE3MSAxODMuODk0QzE0NS4wOTMgMTgzLjg5NCAxNDguODA4IDE4Mi43NjUgMTUxLjYwMiAxODAuOTk0QzE1NC4zOTQgMTc5LjIyMiAxNTYuMjI4IDE3Ni44MzMgMTU3LjQyNCAxNzQuMzcyQzE1OS44MDYgMTY5LjQ3MiAxNTkuNjggMTY0LjI1IDE1OS41OTggMTYyLjg3NEwxNTguNDI0IDE2Mi45NDRDMTU4LjUwMiAxNjQuMjU2IDE1OC42MTQgMTY5LjIzMiAxNTYuMzY2IDE3My44NThDMTU1LjI0NyAxNzYuMTYgMTUzLjU0NyAxNzguMzY3IDE1MC45NzIgMTgwQzE0OC4zOTcgMTgxLjYzMyAxNDQuOTA4IDE4Mi43MTggMTQwLjE3MSAxODIuNzE4VjE4My44OTRaTTExNy43NzkgMTcyLjk3QzExOC4xNzcgMTc0LjExNyAxMTkuNDIgMTc2Ljg2IDEyMi43NjcgMTc5LjMxM0MxMjYuMTE1IDE4MS43NjggMTMxLjUxOSAxODMuODk0IDE0MC4xNzEgMTgzLjg5NFYxODIuNzE4QzEzMS43MTcgMTgyLjcxOCAxMjYuNTcxIDE4MC42NDMgMTIzLjQ2MiAxNzguMzY0QzEyMC4zNTIgMTc2LjA4NSAxMTkuMjMgMTczLjU2MyAxMTguODkxIDE3Mi41ODVMMTE3Ljc3OSAxNzIuOTdaTTExNy42MDIgMTcxLjc4N0MxMTcuNjAyIDE3Mi4xNjIgMTE3LjY0IDE3Mi41NjkgMTE3Ljc3OSAxNzIuOTdMMTE4Ljg5MSAxNzIuNTg1QzExOC44MSAxNzIuMzUxIDExOC43NzggMTcyLjA4NyAxMTguNzc4IDE3MS43ODdIMTE3LjYwMlpNMTE3LjYwMiAxNTUuMzYyVjE3MS43ODdIMTE4Ljc3OFYxNTUuMzYySDExNy42MDJaTTEyMC40NDggMTUwLjY0OUMxMTguNzEgMTUxLjU3NiAxMTcuNjAyIDE1My4zODMgMTE3LjYwMiAxNTUuMzYySDExOC43NzhDMTE4Ljc3OCAxNTMuODI2IDExOS42MzkgMTUyLjQxNCAxMjEuMDAyIDE1MS42ODdMMTIwLjQ0OCAxNTAuNjQ5Wk0xMjguMTY2IDE0Ni4zNjNDMTI1Ljc4OSAxNDcuNzE1IDEyMy40MTggMTQ5LjA2NCAxMjAuNDQ4IDE1MC42NDlMMTIxLjAwMiAxNTEuNjg3QzEyMy45ODggMTUwLjA5NCAxMjYuMzcxIDE0OC43MzggMTI4Ljc0OCAxNDcuMzg2TDEyOC4xNjYgMTQ2LjM2M1pNMTM4LjQ1MyAxNDAuNzI2QzEzNC4yMDMgMTQyLjkyOSAxMzEuMTgxIDE0NC42NDggMTI4LjE2NiAxNDYuMzYzTDEyOC43NDggMTQ3LjM4NkMxMzEuNzYxIDE0NS42NzIgMTM0Ljc2NiAxNDMuOTYyIDEzOC45OTQgMTQxLjc3TDEzOC40NTMgMTQwLjcyNlpNMTQ4LjEzMSAxMjUuMjU3QzE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxQzE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxQzE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxIDE0Ny41NDUgMTI1LjIxMUMxNDcuNTQ1IDEyNS4yMTIgMTQ3LjU0NCAxMjUuMjEzIDE0Ny41NDQgMTI1LjIxNUMxNDcuNTQ0IDEyNS4yMiAxNDcuNTQzIDEyNS4yMjcgMTQ3LjU0MiAxMjUuMjM3QzE0Ny41NDEgMTI1LjI1NyAxNDcuNTM4IDEyNS4yODcgMTQ3LjUzMyAxMjUuMzI4QzE0Ny41MjUgMTI1LjQwOSAxNDcuNTEyIDEyNS41MzEgMTQ3LjQ5MSAxMjUuNjg5QzE0Ny40NTEgMTI2LjAwNCAxNDcuMzgzIDEyNi40NjMgMTQ3LjI3NiAxMjcuMDI4QzE0Ny4wNjEgMTI4LjE1OSAxNDYuNjg3IDEyOS43MTMgMTQ2LjA1NiAxMzEuMzk4QzE0NC43ODggMTM0Ljc4MiAxNDIuNTA4IDEzOC42MjQgMTM4LjQ1MyAxNDAuNzI2TDEzOC45OTQgMTQxLjc3QzE0My40MTcgMTM5LjQ3OCAxNDUuODQxIDEzNS4zMjUgMTQ3LjE1NyAxMzEuODExQzE0Ny44MTggMTMwLjA0OCAxNDguMjA3IDEyOC40MjggMTQ4LjQzMSAxMjcuMjQ4QzE0OC41NDQgMTI2LjY1NyAxNDguNjE1IDEyNi4xNzUgMTQ4LjY1OCAxMjUuODM5QzE0OC42OCAxMjUuNjcxIDE0OC42OTQgMTI1LjU0IDE0OC43MDQgMTI1LjQ0OUMxNDguNzA4IDEyNS40MDQgMTQ4LjcxMiAxMjUuMzY4IDE0OC43MTQgMTI1LjM0NEMxNDguNzE1IDEyNS4zMzIgMTQ4LjcxNiAxMjUuMzIzIDE0OC43MTYgMTI1LjMxNkMxNDguNzE3IDEyNS4zMTMgMTQ4LjcxNyAxMjUuMzEgMTQ4LjcxNyAxMjUuMzA4QzE0OC43MTcgMTI1LjMwNyAxNDguNzE3IDEyNS4zMDYgMTQ4LjcxNyAxMjUuMzA2QzE0OC43MTcgMTI1LjMwNSAxNDguNzE3IDEyNS4zMDUgMTQ4LjcxNyAxMjUuMzA1QzE0OC43MTcgMTI1LjMwNCAxNDguNzE3IDEyNS4zMDQgMTQ4LjEzMSAxMjUuMjU3Wk0xMjguMTMxIDEyMy44OTRDMTMxLjg0NiAxMjMuMjc1IDEzNi43OSAxMjMuNzQ2IDE0MC44NTIgMTI0LjM5QzE0Mi44NzMgMTI0LjcxIDE0NC42NTkgMTI1LjA3IDE0NS45MzggMTI1LjM0OUMxNDYuNTc4IDEyNS40ODkgMTQ3LjA5MSAxMjUuNjA5IDE0Ny40NDMgMTI1LjY5NEMxNDcuNjE5IDEyNS43MzYgMTQ3Ljc1NSAxMjUuNzY5IDE0Ny44NDcgMTI1Ljc5MkMxNDcuODkzIDEyNS44MDQgMTQ3LjkyNyAxMjUuODEyIDE0Ny45NSAxMjUuODE4QzE0Ny45NjIgMTI1LjgyMSAxNDcuOTcxIDEyNS44MjMgMTQ3Ljk3NiAxMjUuODI1QzE0Ny45NzkgMTI1LjgyNSAxNDcuOTgxIDEyNS44MjYgMTQ3Ljk4MiAxMjUuODI2QzE0Ny45ODMgMTI1LjgyNyAxNDcuOTg0IDEyNS44MjcgMTQ3Ljk4NCAxMjUuODI3QzE0Ny45ODQgMTI1LjgyNyAxNDcuOTg0IDEyNS44MjcgMTQ3Ljk4NCAxMjUuODI3QzE0Ny45ODQgMTI1LjgyNyAxNDcuOTg0IDEyNS44MjcgMTQ4LjEzMSAxMjUuMjU3QzE0OC4yNzggMTI0LjY4OCAxNDguMjc4IDEyNC42ODggMTQ4LjI3OCAxMjQuNjg4QzE0OC4yNzggMTI0LjY4OCAxNDguMjc3IDEyNC42ODcgMTQ4LjI3NyAxMjQuNjg3QzE0OC4yNzcgMTI0LjY4NyAxNDguMjc2IDEyNC42ODcgMTQ4LjI3NSAxMjQuNjg3QzE0OC4yNzMgMTI0LjY4NiAxNDguMjcxIDEyNC42ODYgMTQ4LjI2OCAxMjQuNjg1QzE0OC4yNjEgMTI0LjY4MyAxNDguMjUyIDEyNC42ODEgMTQ4LjI0IDEyNC42NzhDMTQ4LjIxNSAxMjQuNjcyIDE0OC4xNzkgMTI0LjY2MiAxNDguMTMyIDEyNC42NTFDMTQ4LjAzNyAxMjQuNjI3IDE0Ny44OTggMTI0LjU5MyAxNDcuNzE4IDEyNC41NUMxNDcuMzU5IDEyNC40NjMgMTQ2LjgzOCAxMjQuMzQyIDE0Ni4xOSAxMjQuMkMxNDQuODkzIDEyMy45MTcgMTQzLjA4NSAxMjMuNTUyIDE0MS4wMzYgMTIzLjIyOEMxMzYuOTU4IDEyMi41ODEgMTMxLjg1MyAxMjIuMDgxIDEyNy45MzggMTIyLjczNEwxMjguMTMxIDEyMy44OTRaTTExMS4yMjIgMTMxLjE0OUMxMTIuOTgzIDEzMC4xMTcgMTE1LjgxIDEyOC41MzQgMTE4LjkwNSAxMjcuMDkxQzEyMi4wMSAxMjUuNjQ0IDEyNS4zNDQgMTI0LjM1OSAxMjguMTMxIDEyMy44OTRMMTI3LjkzOCAxMjIuNzM0QzEyNC45OSAxMjMuMjI1IDEyMS41NCAxMjQuNTY2IDExOC40MDggMTI2LjAyNUMxMTUuMjY3IDEyNy40ODggMTEyLjQwNiAxMjkuMDkxIDExMC42MjcgMTMwLjEzNUwxMTEuMjIyIDEzMS4xNDlaTTEwOS4zMzkgMTM0LjAxOUMxMDkuNTA0IDEzMi44MTUgMTEwLjE4OSAxMzEuNzU2IDExMS4yMjIgMTMxLjE0OUwxMTAuNjI3IDEzMC4xMzVDMTA5LjI2OCAxMzAuOTMyIDEwOC4zODUgMTMyLjMxNSAxMDguMTc0IDEzMy44NTlMMTA5LjMzOSAxMzQuMDE5Wk0xMDYuNTc2IDE1NC4xNjdMMTA5LjMzOSAxMzQuMDE5TDEwOC4xNzQgMTMzLjg1OUwxMDUuNDEgMTU0LjAwN0wxMDYuNTc2IDE1NC4xNjdaTTEwMS4zMzEgMTU4Ljc0MUMxMDMuOTc3IDE1OC43NDEgMTA2LjIxNiAxNTYuNzg4IDEwNi41NzYgMTU0LjE2N0wxMDUuNDEgMTU0LjAwN0MxMDUuMTMxIDE1Ni4wNDYgMTAzLjM4OSAxNTcuNTY1IDEwMS4zMzEgMTU3LjU2NVYxNTguNzQxWk05OS41MjE4IDE1OC43NDFIMTAxLjMzMVYxNTcuNTY1SDk5LjUyMThWMTU4Ljc0MVpNOTQuMjU5MiAxNTQuMDI1Qzk0LjU1MzggMTU2LjcwOSA5Ni44MjE0IDE1OC43NDEgOTkuNTIxOCAxNTguNzQxVjE1Ny41NjVDOTcuNDIxNSAxNTcuNTY1IDk1LjY1NzggMTU1Ljk4NCA5NS40Mjg3IDE1My44OTZMOTQuMjU5MiAxNTQuMDI1Wk05Mi4wODczIDEzNC4yM0w5NC4yNTkyIDE1NC4wMjVMOTUuNDI4NyAxNTMuODk2TDkzLjI1NjcgMTM0LjEwMkw5Mi4wODczIDEzNC4yM1pNOTAuMDE5NiAxMzEuMTQ0QzkxLjE3NzYgMTMxLjc1NiA5MS45NDI4IDEzMi45MTMgOTIuMDg3MyAxMzQuMjNMOTMuMjU2NyAxMzQuMTAyQzkzLjA3MTMgMTMyLjQxMiA5Mi4wODU0IDEzMC45MDUgOTAuNTY5NCAxMzAuMTA0TDkwLjAxOTYgMTMxLjE0NFpNNzEuODgwMyAxMjMuODk0Qzc3LjcwNDMgMTI0LjkwNiA4Ni4xMDMzIDEyOS4wNzQgOTAuMDE5NiAxMzEuMTQ0TDkwLjU2OTQgMTMwLjEwNEM4Ni42Nzg0IDEyOC4wNDcgNzguMTE4NSAxMjMuNzg0IDcyLjA4MTggMTIyLjczNEw3MS44ODAzIDEyMy44OTRaTTUxLjg4NDUgMTI1LjI1N0M1Mi4wNDgxIDEyNS44MjIgNTIuMDQ4IDEyNS44MjIgNTIuMDQ4MSAxMjUuODIyQzUyLjA0ODEgMTI1LjgyMiA1Mi4wNDgyIDEyNS44MjIgNTIuMDQ4MyAxMjUuODIyQzUyLjA0ODUgMTI1LjgyMiA1Mi4wNDkgMTI1LjgyMiA1Mi4wNDk2IDEyNS44MjJDNTIuMDUwNyAxMjUuODIxIDUyLjA1MjcgMTI1LjgyMSA1Mi4wNTUzIDEyNS44MkM1Mi4wNjA1IDEyNS44MTkgNTIuMDY4NSAxMjUuODE2IDUyLjA3OTIgMTI1LjgxM0M1Mi4xMDA4IDEyNS44MDcgNTIuMTMzMiAxMjUuNzk4IDUyLjE3NjIgMTI1Ljc4NkM1Mi4yNjIyIDEyNS43NjIgNTIuMzkwMyAxMjUuNzI3IDUyLjU1NjYgMTI1LjY4MkM1Mi44ODk0IDEyNS41OTMgNTMuMzc1NSAxMjUuNDY4IDUzLjk4NTUgMTI1LjMyMUM1NS4yMDU4IDEyNS4wMjggNTYuOTE5OSAxMjQuNjUxIDU4Ljg5MjcgMTI0LjMyQzYyLjg1MzQgMTIzLjY1NiA2Ny43OTc3IDEyMy4xODQgNzEuODgwMyAxMjMuODk0TDcyLjA4MTggMTIyLjczNEM2Ny43OTggMTIxLjk5IDYyLjY5MzkgMTIyLjQ5IDU4LjY5OCAxMjMuMTZDNTYuNjkyNSAxMjMuNDk3IDU0Ljk1MTEgMTIzLjg3OSA1My43MTA1IDEyNC4xNzdDNTMuMDkwMSAxMjQuMzI2IDUyLjU5NDQgMTI0LjQ1NSA1Mi4yNTMgMTI0LjU0NkM1Mi4wODIzIDEyNC41OTEgNTEuOTUwMSAxMjQuNjI4IDUxLjg2MDIgMTI0LjY1M0M1MS44MTUzIDEyNC42NjUgNTEuNzgwOSAxMjQuNjc1IDUxLjc1NzUgMTI0LjY4MkM1MS43NDU4IDEyNC42ODUgNTEuNzM2OCAxMjQuNjg4IDUxLjczMDcgMTI0LjY4OUM1MS43Mjc2IDEyNC42OSA1MS43MjUzIDEyNC42OTEgNTEuNzIzNiAxMjQuNjkxQzUxLjcyMjggMTI0LjY5MiA1MS43MjIyIDEyNC42OTIgNTEuNzIxNyAxMjQuNjkyQzUxLjcyMTUgMTI0LjY5MiA1MS43MjEyIDEyNC42OTIgNTEuNzIxMSAxMjQuNjkyQzUxLjcyMDkgMTI0LjY5MiA1MS43MjA4IDEyNC42OTIgNTEuODg0NSAxMjUuMjU3Wk02MS43MDcyIDE0MC44MzFDNTkuMTYxMSAxMzguMjk0IDU2Ljg0MzYgMTM0LjM2NyA1NS4xNTEgMTMxLjAzMkM1NC4zMDg2IDEyOS4zNzEgNTMuNjI4MSAxMjcuODcyIDUzLjE1ODQgMTI2Ljc4OUM1Mi45MjM2IDEyNi4yNDcgNTIuNzQxNyAxMjUuODEgNTIuNjE4NyAxMjUuNTA4QzUyLjU1NzMgMTI1LjM1OCA1Mi41MTA1IDEyNS4yNDEgNTIuNDc5MyAxMjUuMTYyQzUyLjQ2MzcgMTI1LjEyMyA1Mi40NTIgMTI1LjA5MyA1Mi40NDQyIDEyNS4wNzNDNTIuNDQwMyAxMjUuMDY0IDUyLjQzNzQgMTI1LjA1NiA1Mi40MzU2IDEyNS4wNTFDNTIuNDM0NiAxMjUuMDQ5IDUyLjQzMzkgMTI1LjA0NyA1Mi40MzM1IDEyNS4wNDZDNTIuNDMzMyAxMjUuMDQ2IDUyLjQzMzEgMTI1LjA0NSA1Mi40MzMgMTI1LjA0NUM1Mi40MzMgMTI1LjA0NSA1Mi40MzMgMTI1LjA0NSA1Mi40MzI5IDEyNS4wNDVDNTIuNDMyOSAxMjUuMDQ1IDUyLjQzMyAxMjUuMDQ1IDUxLjg4NDUgMTI1LjI1N0M1MS4zMzU5IDEyNS40NyA1MS4zMzYgMTI1LjQ3IDUxLjMzNjEgMTI1LjQ3QzUxLjMzNjEgMTI1LjQ3IDUxLjMzNjIgMTI1LjQ3IDUxLjMzNjIgMTI1LjQ3QzUxLjMzNjQgMTI1LjQ3MSA1MS4zMzY2IDEyNS40NzIgNTEuMzM2OSAxMjUuNDcyQzUxLjMzNzUgMTI1LjQ3NCA1MS4zMzgzIDEyNS40NzYgNTEuMzM5NCAxMjUuNDc5QzUxLjM0MTYgMTI1LjQ4NCA1MS4zNDQ4IDEyNS40OTIgNTEuMzQ5IDEyNS41MDNDNTEuMzU3MyAxMjUuNTI0IDUxLjM2OTcgMTI1LjU1NiA1MS4zODU5IDEyNS41OTdDNTEuNDE4NSAxMjUuNjc5IDUxLjQ2NjUgMTI1Ljc5OSA1MS41Mjk1IDEyNS45NTNDNTEuNjU1MyAxMjYuMjYxIDUxLjg0MDUgMTI2LjcwNiA1Mi4wNzkgMTI3LjI1N0M1Mi41NTU4IDEyOC4zNTcgNTMuMjQ2MyAxMjkuODc4IDU0LjEwMTkgMTMxLjU2NEM1NS44MDUyIDEzNC45MjEgNTguMTkxNCAxMzguOTg5IDYwLjg3NjggMTQxLjY2NUw2MS43MDcyIDE0MC44MzFaTTgwLjU1MDQgMTUwLjg1OUM3OC4wNzAyIDE1MC4wMDMgNzQuNTI5MyAxNDguNjY3IDcxLjAxNTcgMTQ2Ljk1M0M2Ny40OTI2IDE0NS4yMzUgNjQuMDQxNSAxNDMuMTU3IDYxLjcwNzIgMTQwLjgzMUw2MC44NzY4IDE0MS42NjVDNjMuMzQ4OCAxNDQuMTI4IDY2LjkzNzkgMTQ2LjI3MyA3MC40OTk5IDE0OC4wMTFDNzQuMDcxNSAxNDkuNzUzIDc3LjY2MDYgMTUxLjEwNiA4MC4xNjY1IDE1MS45NzFMODAuNTUwNCAxNTAuODU5Wk04NC4zMTM3IDE1Ni4wNDRDODQuMzEzNyAxNTMuNjgyIDgyLjc1ODQgMTUxLjYyMSA4MC41NTA0IDE1MC44NTlMODAuMTY2NSAxNTEuOTcxQzgxLjkyNTQgMTUyLjU3OCA4My4xMzcyIDE1NC4yMSA4My4xMzcyIDE1Ni4wNDRIODQuMzEzN1pNODQuMzEzNyAxNzAuOThWMTU2LjA0NEg4My4xMzcyVjE3MC45OEg4NC4zMTM3Wk04My40Mjk3IDE3My43MjJDODQuMDUzOSAxNzIuOTIgODQuMzEzNyAxNzEuOTQzIDg0LjMxMzcgMTcwLjk4SDgzLjEzNzJDODMuMTM3MiAxNzEuNzM3IDgyLjkzMzQgMTcyLjQ0NCA4Mi41MDE2IDE3Mi45OTlMODMuNDI5NyAxNzMuNzIyWk02MS4wMjEyIDE4My44OTRDNzQuMjE5OSAxODMuODk0IDgxLjIxMzMgMTc2LjU2NyA4My40Mjk3IDE3My43MjJMODIuNTAxNiAxNzIuOTk5QzgwLjQxMjUgMTc1LjY4MSA3My43MjU4IDE4Mi43MTggNjEuMDIxMiAxODIuNzE4VjE4My44OTRaTTQwLjIyMzUgMTYzLjEzOUM0MC40MDU5IDE2NC4zNDIgNDEuMzI0MiAxNjkuNDk3IDQ0LjMxOTMgMTc0LjM2N0M0Ny4zMjc5IDE3OS4yNTggNTIuNDU5OSAxODMuODk0IDYxLjAyMTIgMTgzLjg5NFYxODIuNzE4QzUyLjk3OTQgMTgyLjcxOCA0OC4xODEyIDE3OC40IDQ1LjMyMTQgMTczLjc1QzQyLjQ0ODIgMTY5LjA3OSA0MS41NjAxIDE2NC4xMDcgNDEuMzg2NyAxNjIuOTYzTDQwLjIyMzUgMTYzLjEzOVpNNDAuMTc4NCAxNjIuNTQ5QzQwLjE4MDcgMTYyLjc0MiA0MC4xOTI2IDE2Mi45MzUgNDAuMjIzNSAxNjMuMTM5TDQxLjM4NjcgMTYyLjk2M0M0MS4zNjU4IDE2Mi44MjUgNDEuMzU2NiAxNjIuNjg4IDQxLjM1NDggMTYyLjUzNUw0MC4xNzg0IDE2Mi41NDlaTTM5LjU0NTUgMTQzLjY1NUM0MC4wMjA4IDE1MC45NDIgNDAuMTU3NyAxNjAuODM4IDQwLjE3ODQgMTYyLjU0OUw0MS4zNTQ4IDE2Mi41MzVDNDEuMzM0MSAxNjAuODI2IDQxLjE5NyAxNTAuOSA0MC43MTk1IDE0My41NzlMMzkuNTQ1NSAxNDMuNjU1Wk00MS43MDM1IDExMi44NUM0MS40NTY0IDExNC40NTQgMzguNzkyNiAxMzIuMTEgMzkuNTQ1NSAxNDMuNjU1TDQwLjcxOTUgMTQzLjU3OUMzOS45NzY0IDEzMi4xODQgNDIuNjE1NiAxMTQuNjU3IDQyLjg2NjMgMTEzLjAyOUw0MS43MDM1IDExMi44NVpNNDEuNzU5IDExMi41NjFDNDEuNzM1MiAxMTIuNjY0IDQxLjcxOTIgMTEyLjc0OCA0MS43MDM1IDExMi44NUw0Mi44NjYzIDExMy4wMjlDNDIuODc3OCAxMTIuOTU0IDQyLjg4ODQgMTEyLjg5OSA0Mi45MDUgMTEyLjgyN0w0MS43NTkgMTEyLjU2MVpNNDMuMjg5MSAxMDcuNDI0QzQyLjMzNjQgMTEwLjE3NCA0MS44NzU2IDExMi4wNTkgNDEuNzU5IDExMi41NjFMNDIuOTA1IDExMi44MjdDNDMuMDEzOSAxMTIuMzU4IDQzLjQ2MzggMTEwLjUxNCA0NC40MDA4IDEwNy44MDlMNDMuMjg5MSAxMDcuNDI0WiIgLz4KICAgIDxtYXNrIGlkPSJwYXRoLTUtaW5zaWRlLTJfMTc0XzEyOTEiID4KICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1MS4wMjMgMTAwLjI4MkMxNTEuMjA2IDk5LjExNDggMTUxLjMgOTcuOTI5OSAxNTEuMyA5Ni43MzA1QzE1MS4zIDc4LjAzNjcgMTI4LjQ5MSA2Mi44ODIzIDEwMC4zNTYgNjIuODgyM0M3Mi4yMjAxIDYyLjg4MjMgNDkuNDExNiA3OC4wMzY3IDQ5LjQxMTYgOTYuNzMwNUM0OS40MTE2IDk3LjkyOTkgNDkuNTA1NSA5OS4xMTQ3IDQ5LjY4ODcgMTAwLjI4MkwxMDAuMzU2IDg1LjAzNzdMMTUxLjAyMyAxMDAuMjgyWiIvPgogICAgPC9tYXNrPgogICAgPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNTEuMDIzIDEwMC4yODJDMTUxLjIwNiA5OS4xMTQ4IDE1MS4zIDk3LjkyOTkgMTUxLjMgOTYuNzMwNUMxNTEuMyA3OC4wMzY3IDEyOC40OTEgNjIuODgyMyAxMDAuMzU2IDYyLjg4MjNDNzIuMjIwMSA2Mi44ODIzIDQ5LjQxMTYgNzguMDM2NyA0OS40MTE2IDk2LjczMDVDNDkuNDExNiA5Ny45Mjk5IDQ5LjUwNTUgOTkuMTE0NyA0OS42ODg3IDEwMC4yODJMMTAwLjM1NiA4NS4wMzc3TDE1MS4wMjMgMTAwLjI4MloiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl8xNzRfMTI5MSkiLz4KICAgIDxwYXRoIGQ9Ik0xNTEuMDIzIDEwMC4yODJMMTUwLjY4NCAxMDEuNDA5TDE1MS45NzYgMTAxLjc5N0wxNTIuMTg1IDEwMC40NjRMMTUxLjAyMyAxMDAuMjgyWk00OS42ODg3IDEwMC4yODJMNDguNTI2NCAxMDAuNDY0TDQ4LjczNTYgMTAxLjc5N0w1MC4wMjc2IDEwMS40MDhMNDkuNjg4NyAxMDAuMjgyWk0xMDAuMzU2IDg1LjAzNzdMMTAwLjY5NCA4My45MTExTDEwMC4zNTYgODMuODA5MUwxMDAuMDE3IDgzLjkxMTFMMTAwLjM1NiA4NS4wMzc3Wk0xNTAuMTIzIDk2LjczMDVDMTUwLjEyMyA5Ny44NjgzIDE1MC4wMzQgOTguOTkyMiAxNDkuODYxIDEwMC4xTDE1Mi4xODUgMTAwLjQ2NEMxNTIuMzc4IDk5LjIzNzMgMTUyLjQ3NiA5Ny45OTE1IDE1Mi40NzYgOTYuNzMwNUgxNTAuMTIzWk0xMDAuMzU2IDY0LjA1ODhDMTE0LjIyNSA2NC4wNTg4IDEyNi43MjcgNjcuNzk1OSAxMzUuNzI4IDczLjc3NjFDMTQ0LjczNyA3OS43NjIgMTUwLjEyMyA4Ny45MDEyIDE1MC4xMjMgOTYuNzMwNUgxNTIuNDc2QzE1Mi40NzYgODYuODY2IDE0Ni40NTkgNzguMDgxIDEzNy4wMyA3MS44MTYzQzEyNy41OTIgNjUuNTQ1OSAxMTQuNjIzIDYxLjcwNTkgMTAwLjM1NiA2MS43MDU5VjY0LjA1ODhaTTUwLjU4ODEgOTYuNzMwNUM1MC41ODgxIDg3LjkwMTIgNTUuOTc0NiA3OS43NjIgNjQuOTgzOSA3My43NzYxQzczLjk4NDYgNjcuNzk1OSA4Ni40ODcgNjQuMDU4OCAxMDAuMzU2IDY0LjA1ODhWNjEuNzA1OUM4Ni4wODg4IDYxLjcwNTkgNzMuMTE5MiA2NS41NDU5IDYzLjY4MTggNzEuODE2M0M1NC4yNTI5IDc4LjA4MSA0OC4yMzUyIDg2Ljg2NiA0OC4yMzUyIDk2LjczMDVINTAuNTg4MVpNNTAuODUwOSAxMDAuMDk5QzUwLjY3NzEgOTguOTkyMSA1MC41ODgxIDk3Ljg2ODMgNTAuNTg4MSA5Ni43MzA1SDQ4LjIzNTJDNDguMjM1MiA5Ny45OTE1IDQ4LjMzMzkgOTkuMjM3MiA0OC41MjY0IDEwMC40NjRMNTAuODUwOSAxMDAuMDk5Wk01MC4wMjc2IDEwMS40MDhMMTAwLjY5NCA4Ni4xNjQyTDEwMC4wMTcgODMuOTExMUw0OS4zNDk3IDk5LjE1NTNMNTAuMDI3NiAxMDEuNDA4Wk0xMDAuMDE3IDg2LjE2NDJMMTUwLjY4NCAxMDEuNDA5TDE1MS4zNjIgOTkuMTU1NEwxMDAuNjk0IDgzLjkxMTFMMTAwLjAxNyA4Ni4xNjQyWiIgIG1hc2s9InVybCgjcGF0aC01LWluc2lkZS0yXzE3NF8xMjkxKSIvPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE3NF8xMjkxIiB4MT0iMTAwLjM2NyIgeTE9IjE3IiB4Mj0iMTAwLjM2NyIgeTI9IjU5LjQ2NDEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y3Q0I1QyIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCRDg4MDAiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xNzRfMTI5MSIgeDE9IjEwMCIgeTE9IjkwLjcyMTIiIHgyPSIxMDAiIHkyPSIxODMuMzA2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGN0NCNUMiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkQ4ODAwIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50Ml9saW5lYXJfMTc0XzEyOTEiIHgxPSIxMDAuMzU2IiB5MT0iNjIuODgyMyIgeDI9IjEwMC4zNTYiIHkyPSIxMDAuMjgyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGN0NCNUMiLz4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkQ4ODAwIi8+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KPC9zdmc+Cg==",
        downloads: {
            chrome: "https://chrome.google.com/webstore/detail/tbd",
        },
    },
    {
        id: "argentX",
        name: "Argent X",
        icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjQwIiBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgNDAgMzYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNC43NTgyIC0zLjk3MzY0ZS0wN0gxNC42MjM4QzE0LjI4NTEgLTMuOTczNjRlLTA3IDE0LjAxMzggMC4yODExNzggMTQuMDA2NCAwLjYzMDY4M0MxMy44MDE3IDEwLjQ1NDkgOC44MjIzNCAxOS43NzkyIDAuMjUxODkzIDI2LjM4MzdDLTAuMDIwMjA0NiAyNi41OTMzIC0wLjA4MjE5NDYgMjYuOTg3MiAwLjExNjczNCAyNy4yNzA5TDYuMDQ2MjMgMzUuNzM0QzYuMjQ3OTYgMzYuMDIyIDYuNjQwOTkgMzYuMDg3IDYuOTE3NjYgMzUuODc1NEMxMi4yNzY1IDMxLjc3MjggMTYuNTg2OSAyNi44MjM2IDE5LjY5MSAyMS4zMzhDMjIuNzk1MSAyNi44MjM2IDI3LjEwNTcgMzEuNzcyOCAzMi40NjQ2IDM1Ljg3NTRDMzIuNzQxIDM2LjA4NyAzMy4xMzQxIDM2LjAyMiAzMy4zMzYxIDM1LjczNEwzOS4yNjU2IDI3LjI3MDlDMzkuNDY0MiAyNi45ODcyIDM5LjQwMjIgMjYuNTkzMyAzOS4xMzA0IDI2LjM4MzdDMzAuNTU5NyAxOS43NzkyIDI1LjU4MDQgMTAuNDU0OSAyNS4zNzU5IDAuNjMwNjgzQzI1LjM2ODUgMC4yODExNzggMjUuMDk2OSAtMy45NzM2NGUtMDcgMjQuNzU4MiAtMy45NzM2NGUtMDdaIiBmaWxsPSIjRkY4NzVCIi8+Cjwvc3ZnPgo=",
        downloads: {
            chrome: "https://chrome.google.com/webstore/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb",
        },
    },
];
var discoveryWallets = Array.from(wallets);

/**
 * @see https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/generateUniqueID.ts
 */
const generateUID = () => `${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};
/**
 * filters given wallets array, return only preAuthorized instances
 * @param wallets
 */
const filterPreAuthorized = (wallets) => Promise.all(wallets.map(w => w
    .isPreauthorized()
    .then(authorized => (authorized ? w : undefined))
    .catch(() => undefined))).then(result => result.filter(res => !!res));
const isWalletObj = (key, wallet) => {
    try {
        if (wallet &&
            [
                // wallet's must have methods/members, see IStarknetWindowObject
                "request",
                "isConnected",
                "provider",
                "enable",
                "isPreauthorized",
                "on",
                "off",
                "version",
            ].every(key => key in wallet)) {
            if (key === "starknet" && (!wallet.id || !wallet.name || !wallet.icon)) {
                try {
                    // attempt to add missing metadata to legacy wallet
                    // object (enriched from wallets-discovery list)
                    const argentDiscovery = discoveryWallets.find(dw => dw.id === "argentX");
                    if (argentDiscovery) {
                        wallet.id = argentDiscovery.id;
                        wallet.name = argentDiscovery.name;
                        wallet.icon = argentDiscovery.icon;
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
            // test for new fields only after attempting
            // to enrich the legacy wallet ->
            return ["id", "name", "icon"].every(key => key in wallet);
        }
    }
    catch (err) { }
    return false;
};

var _StorageWrapper_instances, _StorageWrapper_key, _StorageWrapper_prefix, _StorageWrapper_validateValue;
/**
 * attempt to make default-overriding hard
 * todo improve/test concept
 */
class StorageWrapper {
    constructor(key) {
        _StorageWrapper_instances.add(this);
        _StorageWrapper_key.set(this, undefined);
        _StorageWrapper_prefix.set(this, void 0);
        this.value = undefined;
        __classPrivateFieldSet(this, _StorageWrapper_prefix, key, "f");
        // init with prev key/value
        __classPrivateFieldSet(this, _StorageWrapper_key, Object.keys(localStorage).find(sk => sk.startsWith(key)), "f");
        if (__classPrivateFieldGet(this, _StorageWrapper_key, "f")) {
            this.set(localStorage.getItem(__classPrivateFieldGet(this, _StorageWrapper_key, "f")));
        }
    }
    set(value) {
        this.delete(); // clear current key
        this.value = value;
        if (value) {
            __classPrivateFieldSet(this, _StorageWrapper_key, `${__classPrivateFieldGet(this, _StorageWrapper_prefix, "f")}-${generateUID()}`, "f");
            localStorage.setItem(__classPrivateFieldGet(this, _StorageWrapper_key, "f"), value);
        }
    }
    get() {
        __classPrivateFieldGet(this, _StorageWrapper_instances, "m", _StorageWrapper_validateValue).call(this);
        return this.value;
    }
    delete() {
        this.value = null;
        if (__classPrivateFieldGet(this, _StorageWrapper_key, "f"))
            localStorage.removeItem(__classPrivateFieldGet(this, _StorageWrapper_key, "f"));
    }
}
_StorageWrapper_key = new WeakMap(), _StorageWrapper_prefix = new WeakMap(), _StorageWrapper_instances = new WeakSet(), _StorageWrapper_validateValue = function _StorageWrapper_validateValue() {
    if (this.value) {
        this.set(this.value);
    }
};

const defaultWallet = new StorageWrapper("gsw-default");

const lastConnected = new StorageWrapper("gsw-last");

function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
        src_url_equal_anchor = document.createElement('a');
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function exclude_internal_props(props) {
    const result = {};
    for (const k in props)
        if (k[0] !== '$')
            result[k] = props[k];
    return result;
}
function compute_rest_props(props, keys) {
    const rest = {};
    keys = new Set(keys);
    for (const k in props)
        if (!keys.has(k) && k[0] !== '$')
            rest[k] = props[k];
    return rest;
}
function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function stop_propagation(fn) {
    return function (event) {
        event.stopPropagation();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_attributes(node, attributes) {
    // @ts-ignore
    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
    for (const key in attributes) {
        if (attributes[key] == null) {
            node.removeAttribute(key);
        }
        else if (key === 'style') {
            node.style.cssText = attributes[key];
        }
        else if (key === '__value') {
            node.value = node[key] = attributes[key];
        }
        else if (descriptors[key] && descriptors[key].set) {
            node[key] = attributes[key];
        }
        else {
            attr(node, key, attributes[key]);
        }
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_style(node, key, value, important) {
    if (value === null) {
        node.style.removeProperty(key);
    }
    else {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
        // @ts-ignore
        callbacks.slice().forEach(fn => fn.call(this, event));
    }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function add_flush_callback(fn) {
    flush_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}

function bind(component, name, callback) {
    const index = component.$$.props[name];
    if (index !== undefined) {
        component.$$.bound[index] = callback;
        callback(component.$$.ctx[index]);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function createFocusTrapInstance(surfaceEl, focusTrapFactory, initialFocusEl) {
    return focusTrapFactory(surfaceEl, { initialFocusEl: initialFocusEl });
}
function isScrollable(el) {
    return el ? el.scrollHeight > el.offsetHeight : false;
}
/**
 * For scrollable content, returns true if the content has not been scrolled
 * (that is, the scroll content is as the "top"). This is used in full-screen
 * dialogs, where the scroll divider is expected only to appear once the
 * content has been scrolled "underneath" the header bar.
 */
function isScrollAtTop(el) {
    return el ? el.scrollTop === 0 : false;
}
/**
 * For scrollable content, returns true if the content has been scrolled all the
 * way to the bottom. This is used in full-screen dialogs, where the footer
 * scroll divider is expected only to appear when the content is "cut-off" by
 * the footer bar.
 */
function isScrollAtBottom(el) {
    return el ? Math.ceil(el.scrollHeight - el.scrollTop) === el.clientHeight :
        false;
}
function areTopsMisaligned(els) {
    var tops = new Set();
    [].forEach.call(els, function (el) { return tops.add(el.offsetTop); });
    return tops.size > 1;
}

var util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createFocusTrapInstance: createFocusTrapInstance,
    isScrollable: isScrollable,
    isScrollAtTop: isScrollAtTop,
    isScrollAtBottom: isScrollAtBottom,
    areTopsMisaligned: areTopsMisaligned
});

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFoundation = /** @class */ (function () {
    function MDCFoundation(adapter) {
        if (adapter === void 0) { adapter = {}; }
        this.adapter = adapter;
    }
    Object.defineProperty(MDCFoundation, "cssClasses", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports every
            // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "strings", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "numbers", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "defaultAdapter", {
        get: function () {
            // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
            // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
            // validation.
            return {};
        },
        enumerable: false,
        configurable: true
    });
    MDCFoundation.prototype.init = function () {
        // Subclasses should override this method to perform initialization routines (registering events, etc.)
    };
    MDCFoundation.prototype.destroy = function () {
        // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    };
    return MDCFoundation;
}());

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var FOCUS_SENTINEL_CLASS = 'mdc-dom-focus-sentinel';
/**
 * Utility to trap focus in a given root element, e.g. for modal components such
 * as dialogs. The root should have at least one focusable child element,
 * for setting initial focus when trapping focus.
 * Also tracks the previously focused element, and restores focus to that
 * element when releasing focus.
 */
var FocusTrap = /** @class */ (function () {
    function FocusTrap(root, options) {
        if (options === void 0) { options = {}; }
        this.root = root;
        this.options = options;
        // Previously focused element before trapping focus.
        this.elFocusedBeforeTrapFocus = null;
    }
    /**
     * Traps focus in `root`. Also focuses on either `initialFocusEl` if set;
     * otherwises sets initial focus to the first focusable child element.
     */
    FocusTrap.prototype.trapFocus = function () {
        var focusableEls = this.getFocusableElements(this.root);
        if (focusableEls.length === 0) {
            throw new Error('FocusTrap: Element must have at least one focusable child.');
        }
        this.elFocusedBeforeTrapFocus =
            document.activeElement instanceof HTMLElement ? document.activeElement :
                null;
        this.wrapTabFocus(this.root);
        if (!this.options.skipInitialFocus) {
            this.focusInitialElement(focusableEls, this.options.initialFocusEl);
        }
    };
    /**
     * Releases focus from `root`. Also restores focus to the previously focused
     * element.
     */
    FocusTrap.prototype.releaseFocus = function () {
        [].slice.call(this.root.querySelectorAll("." + FOCUS_SENTINEL_CLASS))
            .forEach(function (sentinelEl) {
            sentinelEl.parentElement.removeChild(sentinelEl);
        });
        if (!this.options.skipRestoreFocus && this.elFocusedBeforeTrapFocus) {
            this.elFocusedBeforeTrapFocus.focus();
        }
    };
    /**
     * Wraps tab focus within `el` by adding two hidden sentinel divs which are
     * used to mark the beginning and the end of the tabbable region. When
     * focused, these sentinel elements redirect focus to the first/last
     * children elements of the tabbable region, ensuring that focus is trapped
     * within that region.
     */
    FocusTrap.prototype.wrapTabFocus = function (el) {
        var _this = this;
        var sentinelStart = this.createSentinel();
        var sentinelEnd = this.createSentinel();
        sentinelStart.addEventListener('focus', function () {
            var focusableEls = _this.getFocusableElements(el);
            if (focusableEls.length > 0) {
                focusableEls[focusableEls.length - 1].focus();
            }
        });
        sentinelEnd.addEventListener('focus', function () {
            var focusableEls = _this.getFocusableElements(el);
            if (focusableEls.length > 0) {
                focusableEls[0].focus();
            }
        });
        el.insertBefore(sentinelStart, el.children[0]);
        el.appendChild(sentinelEnd);
    };
    /**
     * Focuses on `initialFocusEl` if defined and a child of the root element.
     * Otherwise, focuses on the first focusable child element of the root.
     */
    FocusTrap.prototype.focusInitialElement = function (focusableEls, initialFocusEl) {
        var focusIndex = 0;
        if (initialFocusEl) {
            focusIndex = Math.max(focusableEls.indexOf(initialFocusEl), 0);
        }
        focusableEls[focusIndex].focus();
    };
    FocusTrap.prototype.getFocusableElements = function (root) {
        var focusableEls = [].slice.call(root.querySelectorAll('[autofocus], [tabindex], a, input, textarea, select, button'));
        return focusableEls.filter(function (el) {
            var isDisabledOrHidden = el.getAttribute('aria-disabled') === 'true' ||
                el.getAttribute('disabled') != null ||
                el.getAttribute('hidden') != null ||
                el.getAttribute('aria-hidden') === 'true';
            var isTabbableAndVisible = el.tabIndex >= 0 &&
                el.getBoundingClientRect().width > 0 &&
                !el.classList.contains(FOCUS_SENTINEL_CLASS) && !isDisabledOrHidden;
            var isProgrammaticallyHidden = false;
            if (isTabbableAndVisible) {
                var style = getComputedStyle(el);
                isProgrammaticallyHidden =
                    style.display === 'none' || style.visibility === 'hidden';
            }
            return isTabbableAndVisible && !isProgrammaticallyHidden;
        });
    };
    FocusTrap.prototype.createSentinel = function () {
        var sentinel = document.createElement('div');
        sentinel.setAttribute('tabindex', '0');
        // Don't announce in screen readers.
        sentinel.setAttribute('aria-hidden', 'true');
        sentinel.classList.add(FOCUS_SENTINEL_CLASS);
        return sentinel;
    };
    return FocusTrap;
}());

var domFocusTrap = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FocusTrap: FocusTrap
});

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @fileoverview A "ponyfill" is a polyfill that doesn't modify the global prototype chain.
 * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.
 */
function closest(element, selector) {
    if (element.closest) {
        return element.closest(selector);
    }
    var el = element;
    while (el) {
        if (matches$1(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}
function matches$1(element, selector) {
    var nativeMatches = element.matches
        || element.webkitMatchesSelector
        || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
}
/**
 * Used to compute the estimated scroll width of elements. When an element is
 * hidden due to display: none; being applied to a parent element, the width is
 * returned as 0. However, the element will have a true width once no longer
 * inside a display: none context. This method computes an estimated width when
 * the element is hidden or returns the true width when the element is visble.
 * @param {Element} element the element whose width to estimate
 */
function estimateScrollWidth(element) {
    // Check the offsetParent. If the element inherits display: none from any
    // parent, the offsetParent property will be null (see
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent).
    // This check ensures we only clone the node when necessary.
    var htmlEl = element;
    if (htmlEl.offsetParent !== null) {
        return htmlEl.scrollWidth;
    }
    var clone = htmlEl.cloneNode(true);
    clone.style.setProperty('position', 'absolute');
    clone.style.setProperty('transform', 'translate(-9999px, -9999px)');
    document.documentElement.appendChild(clone);
    var scrollWidth = clone.scrollWidth;
    document.documentElement.removeChild(clone);
    return scrollWidth;
}

var ponyfill = /*#__PURE__*/Object.freeze({
    __proto__: null,
    closest: closest,
    matches: matches$1,
    estimateScrollWidth: estimateScrollWidth
});

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * Determine whether the current browser supports passive event listeners, and
 * if so, use them.
 */
function applyPassive$1(globalObj) {
    if (globalObj === void 0) { globalObj = window; }
    return supportsPassiveOption(globalObj) ?
        { passive: true } :
        false;
}
function supportsPassiveOption(globalObj) {
    if (globalObj === void 0) { globalObj = window; }
    // See
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    var passiveSupported = false;
    try {
        var options = {
            // This function will be called when the browser
            // attempts to access the passive property.
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        var handler = function () { };
        globalObj.document.addEventListener('test', handler, options);
        globalObj.document.removeEventListener('test', handler, options);
    }
    catch (err) {
        passiveSupported = false;
    }
    return passiveSupported;
}

var events = /*#__PURE__*/Object.freeze({
    __proto__: null,
    applyPassive: applyPassive$1
});

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$2 = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
    FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
    FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
    ROOT: 'mdc-ripple-upgraded',
    UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
};
var strings$2 = {
    VAR_FG_SCALE: '--mdc-ripple-fg-scale',
    VAR_FG_SIZE: '--mdc-ripple-fg-size',
    VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
    VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
    VAR_LEFT: '--mdc-ripple-left',
    VAR_TOP: '--mdc-ripple-top',
};
var numbers$2 = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
};

/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
var supportsCssVariables_;
function supportsCssVariables(windowObj, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    var CSS = windowObj.CSS;
    var supportsCssVars = supportsCssVariables_;
    if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {
        return supportsCssVariables_;
    }
    var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';
    if (!supportsFunctionPresent) {
        return false;
    }
    var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes');
    // See: https://bugs.webkit.org/show_bug.cgi?id=154669
    // See: README section on Safari
    var weAreFeatureDetectingSafari10plus = (CSS.supports('(--css-vars: yes)') &&
        CSS.supports('color', '#00000000'));
    supportsCssVars =
        explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus;
    if (!forceRefresh) {
        supportsCssVariables_ = supportsCssVars;
    }
    return supportsCssVars;
}
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
    if (!evt) {
        return { x: 0, y: 0 };
    }
    var x = pageOffset.x, y = pageOffset.y;
    var documentX = x + clientRect.left;
    var documentY = y + clientRect.top;
    var normalizedX;
    var normalizedY;
    // Determine touch point relative to the ripple container.
    if (evt.type === 'touchstart') {
        var touchEvent = evt;
        normalizedX = touchEvent.changedTouches[0].pageX - documentX;
        normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    }
    else {
        var mouseEvent = evt;
        normalizedX = mouseEvent.pageX - documentX;
        normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES = [
    'touchstart', 'pointerdown', 'mousedown', 'keydown',
];
// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES = [
    'touchend', 'pointerup', 'mouseup', 'contextmenu',
];
// simultaneous nested activations
var activatedTargets = [];
var MDCRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCRippleFoundation, _super);
    function MDCRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded = false;
        _this.activationTimer = 0;
        _this.fgDeactivationRemovalTimer = 0;
        _this.fgScale = '0';
        _this.frame = { width: 0, height: 0 };
        _this.initialSize = 0;
        _this.layoutFrame = 0;
        _this.maxRadius = 0;
        _this.unboundedCoords = { left: 0, top: 0 };
        _this.activationState = _this.defaultActivationState();
        _this.activationTimerCallback = function () {
            _this.activationAnimationHasEnded = true;
            _this.runDeactivationUXLogicIfReady();
        };
        _this.activateHandler = function (e) {
            _this.activateImpl(e);
        };
        _this.deactivateHandler = function () {
            _this.deactivateImpl();
        };
        _this.focusHandler = function () {
            _this.handleFocus();
        };
        _this.blurHandler = function () {
            _this.handleBlur();
        };
        _this.resizeHandler = function () {
            _this.layout();
        };
        return _this;
    }
    Object.defineProperty(MDCRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "strings", {
        get: function () {
            return strings$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "numbers", {
        get: function () {
            return numbers$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                browserSupportsCssVars: function () { return true; },
                computeBoundingRect: function () {
                    return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                },
                containsEventTarget: function () { return true; },
                deregisterDocumentInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                isSurfaceActive: function () { return true; },
                isSurfaceDisabled: function () { return true; },
                isUnbounded: function () { return true; },
                registerDocumentInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                removeClass: function () { return undefined; },
                updateCssVariable: function () { return undefined; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCRippleFoundation.prototype.init = function () {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple();
        this.registerRootHandlers(supportsPressRipple);
        if (supportsPressRipple) {
            var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.addClass(ROOT_1);
                if (_this.adapter.isUnbounded()) {
                    _this.adapter.addClass(UNBOUNDED_1);
                    // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                    _this.layoutInternal();
                }
            });
        }
    };
    MDCRippleFoundation.prototype.destroy = function () {
        var _this = this;
        if (this.supportsPressRipple()) {
            if (this.activationTimer) {
                clearTimeout(this.activationTimer);
                this.activationTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
            }
            if (this.fgDeactivationRemovalTimer) {
                clearTimeout(this.fgDeactivationRemovalTimer);
                this.fgDeactivationRemovalTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
            }
            var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.removeClass(ROOT_2);
                _this.adapter.removeClass(UNBOUNDED_2);
                _this.removeCssVars();
            });
        }
        this.deregisterRootHandlers();
        this.deregisterDeactivationHandlers();
    };
    /**
     * @param evt Optional event containing position information.
     */
    MDCRippleFoundation.prototype.activate = function (evt) {
        this.activateImpl(evt);
    };
    MDCRippleFoundation.prototype.deactivate = function () {
        this.deactivateImpl();
    };
    MDCRippleFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame) {
            cancelAnimationFrame(this.layoutFrame);
        }
        this.layoutFrame = requestAnimationFrame(function () {
            _this.layoutInternal();
            _this.layoutFrame = 0;
        });
    };
    MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
        var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
        if (unbounded) {
            this.adapter.addClass(UNBOUNDED);
        }
        else {
            this.adapter.removeClass(UNBOUNDED);
        }
    };
    MDCRippleFoundation.prototype.handleFocus = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    MDCRippleFoundation.prototype.handleBlur = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     */
    MDCRippleFoundation.prototype.supportsPressRipple = function () {
        return this.adapter.browserSupportsCssVars();
    };
    MDCRippleFoundation.prototype.defaultActivationState = function () {
        return {
            activationEvent: undefined,
            hasDeactivationUXRun: false,
            isActivated: false,
            isProgrammatic: false,
            wasActivatedByPointer: false,
            wasElementMadeActive: false,
        };
    };
    /**
     * supportsPressRipple Passed from init to save a redundant function call
     */
    MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
        var e_1, _a;
        if (supportsPressRipple) {
            try {
                for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.adapter.isUnbounded()) {
                this.adapter.registerResizeHandler(this.resizeHandler);
            }
        }
        this.adapter.registerInteractionHandler('focus', this.focusHandler);
        this.adapter.registerInteractionHandler('blur', this.blurHandler);
    };
    MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
        var e_2, _a;
        if (evt.type === 'keydown') {
            this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
        }
        else {
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
        var e_3, _a;
        try {
            for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
        this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
        if (this.adapter.isUnbounded()) {
            this.adapter.deregisterResizeHandler(this.resizeHandler);
        }
    };
    MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
        var e_4, _a;
        this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
        try {
            for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    MDCRippleFoundation.prototype.removeCssVars = function () {
        var _this = this;
        var rippleStrings = MDCRippleFoundation.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function (key) {
            if (key.indexOf('VAR_') === 0) {
                _this.adapter.updateCssVariable(rippleStrings[key], null);
            }
        });
    };
    MDCRippleFoundation.prototype.activateImpl = function (evt) {
        var _this = this;
        if (this.adapter.isSurfaceDisabled()) {
            return;
        }
        var activationState = this.activationState;
        if (activationState.isActivated) {
            return;
        }
        // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
        var previousActivationEvent = this.previousActivationEvent;
        var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
            return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === undefined;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
        var hasActivatedChild = evt !== undefined &&
            activatedTargets.length > 0 &&
            activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
        if (hasActivatedChild) {
            // Immediately reset activation state, while preserving logic that prevents touch follow-on events
            this.resetActivationState();
            return;
        }
        if (evt !== undefined) {
            activatedTargets.push(evt.target);
            this.registerDeactivationHandlers(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
            this.animateActivation();
        }
        requestAnimationFrame(function () {
            // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
            activatedTargets = [];
            if (!activationState.wasElementMadeActive
                && evt !== undefined
                && (evt.key === ' ' || evt.keyCode === 32)) {
                // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                // active states inconsistently when they're called within event handling code:
                // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                // variable is set within a rAF callback for a submit button interaction (#2241).
                activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                if (activationState.wasElementMadeActive) {
                    _this.animateActivation();
                }
            }
            if (!activationState.wasElementMadeActive) {
                // Reset activation state immediately if element was not made active.
                _this.activationState = _this.defaultActivationState();
            }
        });
    };
    MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
        return (evt !== undefined && evt.type === 'keydown') ?
            this.adapter.isSurfaceActive() :
            true;
    };
    MDCRippleFoundation.prototype.animateActivation = function () {
        var _this = this;
        var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var translateStart = '';
        var translateEnd = '';
        if (!this.adapter.isUnbounded()) {
            var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
            translateStart = startPoint.x + "px, " + startPoint.y + "px";
            translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        // Cancel any ongoing activation/deactivation animations
        clearTimeout(this.activationTimer);
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.rmBoundedActivationClasses();
        this.adapter.removeClass(FG_DEACTIVATION);
        // Force layout in order to re-trigger the animation.
        this.adapter.computeBoundingRect();
        this.adapter.addClass(FG_ACTIVATION);
        this.activationTimer = setTimeout(function () {
            _this.activationTimerCallback();
        }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
        var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
            startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
        }
        else {
            startPoint = {
                x: this.frame.width / 2,
                y: this.frame.height / 2,
            };
        }
        // Center the element around the start point.
        startPoint = {
            x: startPoint.x - (this.initialSize / 2),
            y: startPoint.y - (this.initialSize / 2),
        };
        var endPoint = {
            x: (this.frame.width / 2) - (this.initialSize / 2),
            y: (this.frame.height / 2) - (this.initialSize / 2),
        };
        return { startPoint: startPoint, endPoint: endPoint };
    };
    MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
        var _this = this;
        // This method is called both when a pointing device is released, and when the activation animation ends.
        // The deactivation animation should only run after both of those occur.
        var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
        var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded) {
            this.rmBoundedActivationClasses();
            this.adapter.addClass(FG_DEACTIVATION);
            this.fgDeactivationRemovalTimer = setTimeout(function () {
                _this.adapter.removeClass(FG_DEACTIVATION);
            }, numbers$2.FG_DEACTIVATION_MS);
        }
    };
    MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded = false;
        this.adapter.computeBoundingRect();
    };
    MDCRippleFoundation.prototype.resetActivationState = function () {
        var _this = this;
        this.previousActivationEvent = this.activationState.activationEvent;
        this.activationState = this.defaultActivationState();
        // Touch devices may fire additional events for the same interaction within a short time.
        // Store the previous event until it's safe to assume that subsequent events are for new interactions.
        setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation.prototype.deactivateImpl = function () {
        var _this = this;
        var activationState = this.activationState;
        // This can happen in scenarios such as when you have a keyup event that blurs the element.
        if (!activationState.isActivated) {
            return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
            requestAnimationFrame(function () {
                _this.animateDeactivation(state);
            });
            this.resetActivationState();
        }
        else {
            this.deregisterDeactivationHandlers();
            requestAnimationFrame(function () {
                _this.activationState.hasDeactivationUXRun = true;
                _this.animateDeactivation(state);
                _this.resetActivationState();
            });
        }
    };
    MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
        var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
            this.runDeactivationUXLogicIfReady();
        }
    };
    MDCRippleFoundation.prototype.layoutInternal = function () {
        var _this = this;
        this.frame = this.adapter.computeBoundingRect();
        var maxDim = Math.max(this.frame.height, this.frame.width);
        // Surface diameter is treated differently for unbounded vs. bounded ripples.
        // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
        // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
        // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
        // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
        // `overflow: hidden`.
        var getBoundedRadius = function () {
            var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
            return hypotenuse + MDCRippleFoundation.numbers.PADDING;
        };
        this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
        // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
        var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
        // Unbounded ripple size should always be even number to equally center align.
        if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
            this.initialSize = initialSize - 1;
        }
        else {
            this.initialSize = initialSize;
        }
        this.fgScale = "" + this.maxRadius / this.initialSize;
        this.updateLayoutCssVars();
    };
    MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
        var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
        this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
        this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
        if (this.adapter.isUnbounded()) {
            this.unboundedCoords = {
                left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
            };
            this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
            this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
        }
    };
    return MDCRippleFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * AnimationFrame provides a user-friendly abstraction around requesting
 * and canceling animation frames.
 */
var AnimationFrame = /** @class */ (function () {
    function AnimationFrame() {
        this.rafIDs = new Map();
    }
    /**
     * Requests an animation frame. Cancels any existing frame with the same key.
     * @param {string} key The key for this callback.
     * @param {FrameRequestCallback} callback The callback to be executed.
     */
    AnimationFrame.prototype.request = function (key, callback) {
        var _this = this;
        this.cancel(key);
        var frameID = requestAnimationFrame(function (frame) {
            _this.rafIDs.delete(key);
            // Callback must come *after* the key is deleted so that nested calls to
            // request with the same key are not deleted.
            callback(frame);
        });
        this.rafIDs.set(key, frameID);
    };
    /**
     * Cancels a queued callback with the given key.
     * @param {string} key The key for this callback.
     */
    AnimationFrame.prototype.cancel = function (key) {
        var rafID = this.rafIDs.get(key);
        if (rafID) {
            cancelAnimationFrame(rafID);
            this.rafIDs.delete(key);
        }
    };
    /**
     * Cancels all queued callback.
     */
    AnimationFrame.prototype.cancelAll = function () {
        var _this = this;
        // Need to use forEach because it's the only iteration method supported
        // by IE11. Suppress the underscore because we don't need it.
        // tslint:disable-next-line:enforce-name-casing
        this.rafIDs.forEach(function (_, key) {
            _this.cancel(key);
        });
    };
    /**
     * Returns the queue of unexecuted callback keys.
     */
    AnimationFrame.prototype.getQueue = function () {
        var queue = [];
        // Need to use forEach because it's the only iteration method supported
        // by IE11. Suppress the underscore because we don't need it.
        // tslint:disable-next-line:enforce-name-casing
        this.rafIDs.forEach(function (_, key) {
            queue.push(key);
        });
        return queue;
    };
    return AnimationFrame;
}());

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$1 = {
    CLOSING: 'mdc-dialog--closing',
    OPEN: 'mdc-dialog--open',
    OPENING: 'mdc-dialog--opening',
    SCROLLABLE: 'mdc-dialog--scrollable',
    SCROLL_LOCK: 'mdc-dialog-scroll-lock',
    STACKED: 'mdc-dialog--stacked',
    FULLSCREEN: 'mdc-dialog--fullscreen',
    // Class for showing a scroll divider on full-screen dialog header element.
    // Should only be displayed on scrollable content, when the dialog content is
    // scrolled "underneath" the header.
    SCROLL_DIVIDER_HEADER: 'mdc-dialog-scroll-divider-header',
    // Class for showing a scroll divider on a full-screen dialog footer element.
    // Should only be displayed on scrolalble content, when the dialog content is
    // obscured "underneath" the footer.
    SCROLL_DIVIDER_FOOTER: 'mdc-dialog-scroll-divider-footer',
    // The "surface scrim" is a scrim covering only the surface of a dialog. This
    // is used in situations where a confirmation dialog is shown over an already
    // opened full-screen dialog. On larger screen-sizes, the full-screen dialog
    // is sized as a modal and so in these situations we display a "surface scrim"
    // to prevent a "double scrim" (where the scrim from the secondary
    // confirmation dialog would overlap with the scrim from the full-screen
    // dialog).
    SURFACE_SCRIM_SHOWN: 'mdc-dialog__surface-scrim--shown',
    // "Showing" animating class for the surface-scrim.
    SURFACE_SCRIM_SHOWING: 'mdc-dialog__surface-scrim--showing',
    // "Hiding" animating class for the surface-scrim.
    SURFACE_SCRIM_HIDING: 'mdc-dialog__surface-scrim--hiding',
    // Class to hide a dialog's scrim (used in conjunction with a surface-scrim).
    // Note that we only hide the original scrim rather than removing it entirely
    // to prevent interactions with the content behind this scrim, and to capture
    // scrim clicks.
    SCRIM_HIDDEN: 'mdc-dialog__scrim--hidden',
};
var strings$1 = {
    ACTION_ATTRIBUTE: 'data-mdc-dialog-action',
    BUTTON_DEFAULT_ATTRIBUTE: 'data-mdc-dialog-button-default',
    BUTTON_SELECTOR: '.mdc-dialog__button',
    CLOSED_EVENT: 'MDCDialog:closed',
    CLOSE_ACTION: 'close',
    CLOSING_EVENT: 'MDCDialog:closing',
    CONTAINER_SELECTOR: '.mdc-dialog__container',
    CONTENT_SELECTOR: '.mdc-dialog__content',
    DESTROY_ACTION: 'destroy',
    INITIAL_FOCUS_ATTRIBUTE: 'data-mdc-dialog-initial-focus',
    OPENED_EVENT: 'MDCDialog:opened',
    OPENING_EVENT: 'MDCDialog:opening',
    SCRIM_SELECTOR: '.mdc-dialog__scrim',
    SUPPRESS_DEFAULT_PRESS_SELECTOR: [
        'textarea',
        '.mdc-menu .mdc-list-item',
        '.mdc-menu .mdc-deprecated-list-item',
    ].join(', '),
    SURFACE_SELECTOR: '.mdc-dialog__surface',
};
var numbers$1 = {
    DIALOG_ANIMATION_CLOSE_TIME_MS: 75,
    DIALOG_ANIMATION_OPEN_TIME_MS: 150,
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var AnimationKeys;
(function (AnimationKeys) {
    AnimationKeys["POLL_SCROLL_POS"] = "poll_scroll_position";
    AnimationKeys["POLL_LAYOUT_CHANGE"] = "poll_layout_change";
})(AnimationKeys || (AnimationKeys = {}));
var MDCDialogFoundation = /** @class */ (function (_super) {
    __extends(MDCDialogFoundation, _super);
    function MDCDialogFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCDialogFoundation.defaultAdapter), adapter)) || this;
        _this.dialogOpen = false;
        _this.isFullscreen = false;
        _this.animationFrame = 0;
        _this.animationTimer = 0;
        _this.escapeKeyAction = strings$1.CLOSE_ACTION;
        _this.scrimClickAction = strings$1.CLOSE_ACTION;
        _this.autoStackButtons = true;
        _this.areButtonsStacked = false;
        _this.suppressDefaultPressSelector = strings$1.SUPPRESS_DEFAULT_PRESS_SELECTOR;
        _this.animFrame = new AnimationFrame();
        _this.contentScrollHandler = function () {
            _this.handleScrollEvent();
        };
        _this.windowResizeHandler = function () {
            _this.layout();
        };
        _this.windowOrientationChangeHandler = function () {
            _this.layout();
        };
        return _this;
    }
    Object.defineProperty(MDCDialogFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "numbers", {
        get: function () {
            return numbers$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCDialogFoundation, "defaultAdapter", {
        get: function () {
            return {
                addBodyClass: function () { return undefined; },
                addClass: function () { return undefined; },
                areButtonsStacked: function () { return false; },
                clickDefaultButton: function () { return undefined; },
                eventTargetMatches: function () { return false; },
                getActionFromEvent: function () { return ''; },
                getInitialFocusEl: function () { return null; },
                hasClass: function () { return false; },
                isContentScrollable: function () { return false; },
                notifyClosed: function () { return undefined; },
                notifyClosing: function () { return undefined; },
                notifyOpened: function () { return undefined; },
                notifyOpening: function () { return undefined; },
                releaseFocus: function () { return undefined; },
                removeBodyClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                reverseButtons: function () { return undefined; },
                trapFocus: function () { return undefined; },
                registerContentEventHandler: function () { return undefined; },
                deregisterContentEventHandler: function () { return undefined; },
                isScrollableContentAtTop: function () { return false; },
                isScrollableContentAtBottom: function () { return false; },
                registerWindowEventHandler: function () { return undefined; },
                deregisterWindowEventHandler: function () { return undefined; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCDialogFoundation.prototype.init = function () {
        if (this.adapter.hasClass(cssClasses$1.STACKED)) {
            this.setAutoStackButtons(false);
        }
        this.isFullscreen = this.adapter.hasClass(cssClasses$1.FULLSCREEN);
    };
    MDCDialogFoundation.prototype.destroy = function () {
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
            this.handleAnimationTimerEnd();
        }
        if (this.isFullscreen) {
            this.adapter.deregisterContentEventHandler('scroll', this.contentScrollHandler);
        }
        this.animFrame.cancelAll();
        this.adapter.deregisterWindowEventHandler('resize', this.windowResizeHandler);
        this.adapter.deregisterWindowEventHandler('orientationchange', this.windowOrientationChangeHandler);
    };
    MDCDialogFoundation.prototype.open = function (dialogOptions) {
        var _this = this;
        this.dialogOpen = true;
        this.adapter.notifyOpening();
        this.adapter.addClass(cssClasses$1.OPENING);
        if (this.isFullscreen) {
            // A scroll event listener is registered even if the dialog is not
            // scrollable on open, since the window resize event, or orientation
            // change may make the dialog scrollable after it is opened.
            this.adapter.registerContentEventHandler('scroll', this.contentScrollHandler);
        }
        if (dialogOptions && dialogOptions.isAboveFullscreenDialog) {
            this.adapter.addClass(cssClasses$1.SCRIM_HIDDEN);
        }
        this.adapter.registerWindowEventHandler('resize', this.windowResizeHandler);
        this.adapter.registerWindowEventHandler('orientationchange', this.windowOrientationChangeHandler);
        // Wait a frame once display is no longer "none", to establish basis for
        // animation
        this.runNextAnimationFrame(function () {
            _this.adapter.addClass(cssClasses$1.OPEN);
            _this.adapter.addBodyClass(cssClasses$1.SCROLL_LOCK);
            _this.layout();
            _this.animationTimer = setTimeout(function () {
                _this.handleAnimationTimerEnd();
                _this.adapter.trapFocus(_this.adapter.getInitialFocusEl());
                _this.adapter.notifyOpened();
            }, numbers$1.DIALOG_ANIMATION_OPEN_TIME_MS);
        });
    };
    MDCDialogFoundation.prototype.close = function (action) {
        var _this = this;
        if (action === void 0) { action = ''; }
        if (!this.dialogOpen) {
            // Avoid redundant close calls (and events), e.g. from keydown on elements
            // that inherently emit click
            return;
        }
        this.dialogOpen = false;
        this.adapter.notifyClosing(action);
        this.adapter.addClass(cssClasses$1.CLOSING);
        this.adapter.removeClass(cssClasses$1.OPEN);
        this.adapter.removeBodyClass(cssClasses$1.SCROLL_LOCK);
        if (this.isFullscreen) {
            this.adapter.deregisterContentEventHandler('scroll', this.contentScrollHandler);
        }
        this.adapter.deregisterWindowEventHandler('resize', this.windowResizeHandler);
        this.adapter.deregisterWindowEventHandler('orientationchange', this.windowOrientationChangeHandler);
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = 0;
        clearTimeout(this.animationTimer);
        this.animationTimer = setTimeout(function () {
            _this.adapter.releaseFocus();
            _this.handleAnimationTimerEnd();
            _this.adapter.notifyClosed(action);
        }, numbers$1.DIALOG_ANIMATION_CLOSE_TIME_MS);
    };
    /**
     * Used only in instances of showing a secondary dialog over a full-screen
     * dialog. Shows the "surface scrim" displayed over the full-screen dialog.
     */
    MDCDialogFoundation.prototype.showSurfaceScrim = function () {
        var _this = this;
        this.adapter.addClass(cssClasses$1.SURFACE_SCRIM_SHOWING);
        this.runNextAnimationFrame(function () {
            _this.adapter.addClass(cssClasses$1.SURFACE_SCRIM_SHOWN);
        });
    };
    /**
     * Used only in instances of showing a secondary dialog over a full-screen
     * dialog. Hides the "surface scrim" displayed over the full-screen dialog.
     */
    MDCDialogFoundation.prototype.hideSurfaceScrim = function () {
        this.adapter.removeClass(cssClasses$1.SURFACE_SCRIM_SHOWN);
        this.adapter.addClass(cssClasses$1.SURFACE_SCRIM_HIDING);
    };
    /**
     * Handles `transitionend` event triggered when surface scrim animation is
     * finished.
     */
    MDCDialogFoundation.prototype.handleSurfaceScrimTransitionEnd = function () {
        this.adapter.removeClass(cssClasses$1.SURFACE_SCRIM_HIDING);
        this.adapter.removeClass(cssClasses$1.SURFACE_SCRIM_SHOWING);
    };
    MDCDialogFoundation.prototype.isOpen = function () {
        return this.dialogOpen;
    };
    MDCDialogFoundation.prototype.getEscapeKeyAction = function () {
        return this.escapeKeyAction;
    };
    MDCDialogFoundation.prototype.setEscapeKeyAction = function (action) {
        this.escapeKeyAction = action;
    };
    MDCDialogFoundation.prototype.getScrimClickAction = function () {
        return this.scrimClickAction;
    };
    MDCDialogFoundation.prototype.setScrimClickAction = function (action) {
        this.scrimClickAction = action;
    };
    MDCDialogFoundation.prototype.getAutoStackButtons = function () {
        return this.autoStackButtons;
    };
    MDCDialogFoundation.prototype.setAutoStackButtons = function (autoStack) {
        this.autoStackButtons = autoStack;
    };
    MDCDialogFoundation.prototype.getSuppressDefaultPressSelector = function () {
        return this.suppressDefaultPressSelector;
    };
    MDCDialogFoundation.prototype.setSuppressDefaultPressSelector = function (selector) {
        this.suppressDefaultPressSelector = selector;
    };
    MDCDialogFoundation.prototype.layout = function () {
        var _this = this;
        this.animFrame.request(AnimationKeys.POLL_LAYOUT_CHANGE, function () {
            _this.layoutInternal();
        });
    };
    /** Handles click on the dialog root element. */
    MDCDialogFoundation.prototype.handleClick = function (evt) {
        var isScrim = this.adapter.eventTargetMatches(evt.target, strings$1.SCRIM_SELECTOR);
        // Check for scrim click first since it doesn't require querying ancestors.
        if (isScrim && this.scrimClickAction !== '') {
            this.close(this.scrimClickAction);
        }
        else {
            var action = this.adapter.getActionFromEvent(evt);
            if (action) {
                this.close(action);
            }
        }
    };
    /** Handles keydown on the dialog root element. */
    MDCDialogFoundation.prototype.handleKeydown = function (evt) {
        var isEnter = evt.key === 'Enter' || evt.keyCode === 13;
        if (!isEnter) {
            return;
        }
        var action = this.adapter.getActionFromEvent(evt);
        if (action) {
            // Action button callback is handled in `handleClick`,
            // since space/enter keydowns on buttons trigger click events.
            return;
        }
        // `composedPath` is used here, when available, to account for use cases
        // where a target meant to suppress the default press behaviour
        // may exist in a shadow root.
        // For example, a textarea inside a web component:
        // <mwc-dialog>
        //   <horizontal-layout>
        //     #shadow-root (open)
        //       <mwc-textarea>
        //         #shadow-root (open)
        //           <textarea></textarea>
        //       </mwc-textarea>
        //   </horizontal-layout>
        // </mwc-dialog>
        var target = evt.composedPath ? evt.composedPath()[0] : evt.target;
        var isDefault = this.suppressDefaultPressSelector ?
            !this.adapter.eventTargetMatches(target, this.suppressDefaultPressSelector) :
            true;
        if (isEnter && isDefault) {
            this.adapter.clickDefaultButton();
        }
    };
    /** Handles keydown on the document. */
    MDCDialogFoundation.prototype.handleDocumentKeydown = function (evt) {
        var isEscape = evt.key === 'Escape' || evt.keyCode === 27;
        if (isEscape && this.escapeKeyAction !== '') {
            this.close(this.escapeKeyAction);
        }
    };
    /**
     * Handles scroll event on the dialog's content element -- showing a scroll
     * divider on the header or footer based on the scroll position. This handler
     * should only be registered on full-screen dialogs with scrollable content.
     */
    MDCDialogFoundation.prototype.handleScrollEvent = function () {
        var _this = this;
        // Since scroll events can fire at a high rate, we throttle these events by
        // using requestAnimationFrame.
        this.animFrame.request(AnimationKeys.POLL_SCROLL_POS, function () {
            _this.toggleScrollDividerHeader();
            _this.toggleScrollDividerFooter();
        });
    };
    MDCDialogFoundation.prototype.layoutInternal = function () {
        if (this.autoStackButtons) {
            this.detectStackedButtons();
        }
        this.toggleScrollableClasses();
    };
    MDCDialogFoundation.prototype.handleAnimationTimerEnd = function () {
        this.animationTimer = 0;
        this.adapter.removeClass(cssClasses$1.OPENING);
        this.adapter.removeClass(cssClasses$1.CLOSING);
    };
    /**
     * Runs the given logic on the next animation frame, using setTimeout to
     * factor in Firefox reflow behavior.
     */
    MDCDialogFoundation.prototype.runNextAnimationFrame = function (callback) {
        var _this = this;
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(function () {
            _this.animationFrame = 0;
            clearTimeout(_this.animationTimer);
            _this.animationTimer = setTimeout(callback, 0);
        });
    };
    MDCDialogFoundation.prototype.detectStackedButtons = function () {
        // Remove the class first to let us measure the buttons' natural positions.
        this.adapter.removeClass(cssClasses$1.STACKED);
        var areButtonsStacked = this.adapter.areButtonsStacked();
        if (areButtonsStacked) {
            this.adapter.addClass(cssClasses$1.STACKED);
        }
        if (areButtonsStacked !== this.areButtonsStacked) {
            this.adapter.reverseButtons();
            this.areButtonsStacked = areButtonsStacked;
        }
    };
    MDCDialogFoundation.prototype.toggleScrollableClasses = function () {
        // Remove the class first to let us measure the natural height of the
        // content.
        this.adapter.removeClass(cssClasses$1.SCROLLABLE);
        if (this.adapter.isContentScrollable()) {
            this.adapter.addClass(cssClasses$1.SCROLLABLE);
            if (this.isFullscreen) {
                // If dialog is full-screen and scrollable, check if a scroll divider
                // should be shown.
                this.toggleScrollDividerHeader();
                this.toggleScrollDividerFooter();
            }
        }
    };
    MDCDialogFoundation.prototype.toggleScrollDividerHeader = function () {
        if (!this.adapter.isScrollableContentAtTop()) {
            this.adapter.addClass(cssClasses$1.SCROLL_DIVIDER_HEADER);
        }
        else if (this.adapter.hasClass(cssClasses$1.SCROLL_DIVIDER_HEADER)) {
            this.adapter.removeClass(cssClasses$1.SCROLL_DIVIDER_HEADER);
        }
    };
    MDCDialogFoundation.prototype.toggleScrollDividerFooter = function () {
        if (!this.adapter.isScrollableContentAtBottom()) {
            this.adapter.addClass(cssClasses$1.SCROLL_DIVIDER_FOOTER);
        }
        else if (this.adapter.hasClass(cssClasses$1.SCROLL_DIVIDER_FOOTER)) {
            this.adapter.removeClass(cssClasses$1.SCROLL_DIVIDER_FOOTER);
        }
    };
    return MDCDialogFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * KEY provides normalized string values for keys.
 */
var KEY = {
    UNKNOWN: 'Unknown',
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    SPACEBAR: 'Spacebar',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    END: 'End',
    HOME: 'Home',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
    TAB: 'Tab',
};
var normalizedKeys = new Set();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
normalizedKeys.add(KEY.BACKSPACE);
normalizedKeys.add(KEY.ENTER);
normalizedKeys.add(KEY.SPACEBAR);
normalizedKeys.add(KEY.PAGE_UP);
normalizedKeys.add(KEY.PAGE_DOWN);
normalizedKeys.add(KEY.END);
normalizedKeys.add(KEY.HOME);
normalizedKeys.add(KEY.ARROW_LEFT);
normalizedKeys.add(KEY.ARROW_UP);
normalizedKeys.add(KEY.ARROW_RIGHT);
normalizedKeys.add(KEY.ARROW_DOWN);
normalizedKeys.add(KEY.DELETE);
normalizedKeys.add(KEY.ESCAPE);
normalizedKeys.add(KEY.TAB);
var KEY_CODE = {
    BACKSPACE: 8,
    ENTER: 13,
    SPACEBAR: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    DELETE: 46,
    ESCAPE: 27,
    TAB: 9,
};
var mappedKeyCodes = new Map();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
mappedKeyCodes.set(KEY_CODE.BACKSPACE, KEY.BACKSPACE);
mappedKeyCodes.set(KEY_CODE.ENTER, KEY.ENTER);
mappedKeyCodes.set(KEY_CODE.SPACEBAR, KEY.SPACEBAR);
mappedKeyCodes.set(KEY_CODE.PAGE_UP, KEY.PAGE_UP);
mappedKeyCodes.set(KEY_CODE.PAGE_DOWN, KEY.PAGE_DOWN);
mappedKeyCodes.set(KEY_CODE.END, KEY.END);
mappedKeyCodes.set(KEY_CODE.HOME, KEY.HOME);
mappedKeyCodes.set(KEY_CODE.ARROW_LEFT, KEY.ARROW_LEFT);
mappedKeyCodes.set(KEY_CODE.ARROW_UP, KEY.ARROW_UP);
mappedKeyCodes.set(KEY_CODE.ARROW_RIGHT, KEY.ARROW_RIGHT);
mappedKeyCodes.set(KEY_CODE.ARROW_DOWN, KEY.ARROW_DOWN);
mappedKeyCodes.set(KEY_CODE.DELETE, KEY.DELETE);
mappedKeyCodes.set(KEY_CODE.ESCAPE, KEY.ESCAPE);
mappedKeyCodes.set(KEY_CODE.TAB, KEY.TAB);
var navigationKeys = new Set();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand.
navigationKeys.add(KEY.PAGE_UP);
navigationKeys.add(KEY.PAGE_DOWN);
navigationKeys.add(KEY.END);
navigationKeys.add(KEY.HOME);
navigationKeys.add(KEY.ARROW_LEFT);
navigationKeys.add(KEY.ARROW_UP);
navigationKeys.add(KEY.ARROW_RIGHT);
navigationKeys.add(KEY.ARROW_DOWN);
/**
 * normalizeKey returns the normalized string for a navigational action.
 */
function normalizeKey(evt) {
    var key = evt.key;
    // If the event already has a normalized key, return it
    if (normalizedKeys.has(key)) {
        return key;
    }
    // tslint:disable-next-line:deprecation
    var mappedKey = mappedKeyCodes.get(evt.keyCode);
    if (mappedKey) {
        return mappedKey;
    }
    return KEY.UNKNOWN;
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

function classMap(classObj) {
    return Object.entries(classObj)
        .filter(([name, value]) => name !== '' && value)
        .map(([name]) => name)
        .join(' ');
}

function dispatch(element, eventType, detail, eventInit = { bubbles: true }, 
/** This is an internal thing used by SMUI to duplicate some SMUI events as MDC events. */
duplicateEventForMDC = false) {
    if (typeof Event !== 'undefined' && element) {
        const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
        element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
        if (duplicateEventForMDC && eventType.startsWith('SMUI')) {
            const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => 'MDC'), Object.assign(Object.assign({}, eventInit), { detail }));
            element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
            if (duplicateEvent.defaultPrevented) {
                event.preventDefault();
            }
        }
        return event;
    }
}

function exclude(obj, keys) {
    let names = Object.getOwnPropertyNames(obj);
    const newObj = {};
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const cashIndex = name.indexOf('$');
        if (cashIndex !== -1 &&
            keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
            continue;
        }
        if (keys.indexOf(name) !== -1) {
            continue;
        }
        newObj[name] = obj[name];
    }
    return newObj;
}

// Match old modifiers. (only works on DOM events)
const oldModifierRegex = /^[a-z]+(?::(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
// Match new modifiers.
const newModifierRegex = /^[^$]+(?:\$(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$/;
function forwardEventsBuilder(component) {
    // This is our pseudo $on function. It is defined on component mount.
    let $on;
    // This is a list of events bound before mount.
    let events = [];
    // And we override the $on function to forward all bound events.
    component.$on = (fullEventType, callback) => {
        let eventType = fullEventType;
        let destructor = () => { };
        if ($on) {
            // The event was bound programmatically.
            destructor = $on(eventType, callback);
        }
        else {
            // The event was bound before mount by Svelte.
            events.push([eventType, callback]);
        }
        const oldModifierMatch = eventType.match(oldModifierRegex);
        if (oldModifierMatch && console) {
            console.warn('Event modifiers in SMUI now use "$" instead of ":", so that ' +
                'all events can be bound with modifiers. Please update your ' +
                'event binding: ', eventType);
        }
        return () => {
            destructor();
        };
    };
    function forward(e) {
        // Internally bubble the event up from Svelte components.
        bubble(component, e);
    }
    return (node) => {
        const destructors = [];
        const forwardDestructors = {};
        // This function is responsible for listening and forwarding
        // all bound events.
        $on = (fullEventType, callback) => {
            let eventType = fullEventType;
            let handler = callback;
            // DOM addEventListener options argument.
            let options = false;
            const oldModifierMatch = eventType.match(oldModifierRegex);
            const newModifierMatch = eventType.match(newModifierRegex);
            const modifierMatch = oldModifierMatch || newModifierMatch;
            if (eventType.match(/^SMUI:\w+:/)) {
                const newEventTypeParts = eventType.split(':');
                let newEventType = '';
                for (let i = 0; i < newEventTypeParts.length; i++) {
                    newEventType +=
                        i === newEventTypeParts.length - 1
                            ? ':' + newEventTypeParts[i]
                            : newEventTypeParts[i]
                                .split('-')
                                .map((value) => value.slice(0, 1).toUpperCase() + value.slice(1))
                                .join('');
                }
                console.warn(`The event ${eventType.split('$')[0]} has been renamed to ${newEventType.split('$')[0]}.`);
                eventType = newEventType;
            }
            if (modifierMatch) {
                // Parse the event modifiers.
                // Supported modifiers:
                // - preventDefault
                // - stopPropagation
                // - passive
                // - nonpassive
                // - capture
                // - once
                const parts = eventType.split(oldModifierMatch ? ':' : '$');
                eventType = parts[0];
                const eventOptions = Object.fromEntries(parts.slice(1).map((mod) => [mod, true]));
                if (eventOptions.passive) {
                    options = options || {};
                    options.passive = true;
                }
                if (eventOptions.nonpassive) {
                    options = options || {};
                    options.passive = false;
                }
                if (eventOptions.capture) {
                    options = options || {};
                    options.capture = true;
                }
                if (eventOptions.once) {
                    options = options || {};
                    options.once = true;
                }
                if (eventOptions.preventDefault) {
                    handler = prevent_default(handler);
                }
                if (eventOptions.stopPropagation) {
                    handler = stop_propagation(handler);
                }
            }
            // Listen for the event directly, with the given options.
            const off = listen(node, eventType, handler, options);
            const destructor = () => {
                off();
                const idx = destructors.indexOf(destructor);
                if (idx > -1) {
                    destructors.splice(idx, 1);
                }
            };
            destructors.push(destructor);
            // Forward the event from Svelte.
            if (!(eventType in forwardDestructors)) {
                forwardDestructors[eventType] = listen(node, eventType, forward);
            }
            return destructor;
        };
        for (let i = 0; i < events.length; i++) {
            // Listen to all the events added before mount.
            $on(events[i][0], events[i][1]);
        }
        return {
            destroy: () => {
                // Remove all event listeners.
                for (let i = 0; i < destructors.length; i++) {
                    destructors[i]();
                }
                // Remove all event forwarders.
                for (let entry of Object.entries(forwardDestructors)) {
                    entry[1]();
                }
            },
        };
    };
}

function prefixFilter(obj, prefix) {
    let names = Object.getOwnPropertyNames(obj);
    const newObj = {};
    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.substring(0, prefix.length) === prefix) {
            newObj[name.substring(prefix.length)] = obj[name];
        }
    }
    return newObj;
}

function useActions(node, actions) {
    let actionReturns = [];
    if (actions) {
        for (let i = 0; i < actions.length; i++) {
            const actionEntry = actions[i];
            const action = Array.isArray(actionEntry) ? actionEntry[0] : actionEntry;
            if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                actionReturns.push(action(node, actionEntry[1]));
            }
            else {
                actionReturns.push(action(node));
            }
        }
    }
    return {
        update(actions) {
            if (((actions && actions.length) || 0) != actionReturns.length) {
                throw new Error('You must not change the length of an actions array.');
            }
            if (actions) {
                for (let i = 0; i < actions.length; i++) {
                    const returnEntry = actionReturns[i];
                    if (returnEntry && returnEntry.update) {
                        const actionEntry = actions[i];
                        if (Array.isArray(actionEntry) && actionEntry.length > 1) {
                            returnEntry.update(actionEntry[1]);
                        }
                        else {
                            returnEntry.update();
                        }
                    }
                }
            }
        },
        destroy() {
            for (let i = 0; i < actionReturns.length; i++) {
                const returnEntry = actionReturns[i];
                if (returnEntry && returnEntry.destroy) {
                    returnEntry.destroy();
                }
            }
        },
    };
}

/* node_modules/@smui/dialog/dist/Dialog.svelte generated by Svelte v3.46.6 */

const { document: document_1, window: window_1 } = globals;

const file$a = "node_modules/@smui/dialog/dist/Dialog.svelte";
const get_over_slot_changes = dirty => ({});
const get_over_slot_context = ctx => ({});

// (47:6) {#if fullscreen}
function create_if_block$2(ctx) {
	let div;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div = element("div");
			attr_dev(div, "class", "mdc-dialog__surface-scrim");
			add_location(div, file$a, 47, 8, 1330);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (!mounted) {
				dispose = listen_dev(div, "transitionend", /*transitionend_handler*/ ctx[31], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(47:6) {#if fullscreen}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let t0;
	let div3;
	let div1;
	let div0;
	let t1;
	let div0_class_value;
	let div1_class_value;
	let t2;
	let div2;
	let div3_class_value;
	let useActions_action;
	let t3;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[27].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[26], null);
	let if_block = /*fullscreen*/ ctx[5] && create_if_block$2(ctx);

	let div0_levels = [
		{
			class: div0_class_value = classMap({
				[/*surface$class*/ ctx[7]]: true,
				'mdc-dialog__surface': true
			})
		},
		{ role: "alertdialog" },
		{ "aria-modal": "true" },
		prefixFilter(/*$$restProps*/ ctx[17], 'surface$')
	];

	let div0_data = {};

	for (let i = 0; i < div0_levels.length; i += 1) {
		div0_data = assign(div0_data, div0_levels[i]);
	}

	let div1_levels = [
		{
			class: div1_class_value = classMap({
				[/*container$class*/ ctx[6]]: true,
				'mdc-dialog__container': true
			})
		},
		prefixFilter(/*$$restProps*/ ctx[17], 'container$')
	];

	let div1_data = {};

	for (let i = 0; i < div1_levels.length; i += 1) {
		div1_data = assign(div1_data, div1_levels[i]);
	}

	let div3_levels = [
		{
			class: div3_class_value = classMap({
				[/*className*/ ctx[2]]: true,
				'mdc-dialog': true,
				'mdc-dialog--stacked': !/*autoStackButtons*/ ctx[4],
				'mdc-dialog--fullscreen': /*fullscreen*/ ctx[5],
				'smui-dialog--selection': /*selection*/ ctx[3],
				.../*internalClasses*/ ctx[10]
			})
		},
		{ role: "alertdialog" },
		{ "aria-modal": "true" },
		exclude(/*$$restProps*/ ctx[17], ['container$', 'surface$'])
	];

	let div3_data = {};

	for (let i = 0; i < div3_levels.length; i += 1) {
		div3_data = assign(div3_data, div3_levels[i]);
	}

	const over_slot_template = /*#slots*/ ctx[27].over;
	const over_slot = create_slot(over_slot_template, ctx, /*$$scope*/ ctx[26], get_over_slot_context);

	const block = {
		c: function create() {
			t0 = space();
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");
			if (default_slot) default_slot.c();
			t1 = space();
			if (if_block) if_block.c();
			t2 = space();
			div2 = element("div");
			t3 = space();
			if (over_slot) over_slot.c();
			set_attributes(div0, div0_data);
			add_location(div0, file$a, 36, 4, 1073);
			set_attributes(div1, div1_data);
			add_location(div1, file$a, 29, 2, 913);
			attr_dev(div2, "class", "mdc-dialog__scrim");
			add_location(div2, file$a, 55, 2, 1526);
			set_attributes(div3, div3_data);
			add_location(div3, file$a, 8, 0, 250);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div3, anchor);
			append_dev(div3, div1);
			append_dev(div1, div0);

			if (default_slot) {
				default_slot.m(div0, null);
			}

			append_dev(div0, t1);
			if (if_block) if_block.m(div0, null);
			append_dev(div3, t2);
			append_dev(div3, div2);
			/*div3_binding*/ ctx[32](div3);
			insert_dev(target, t3, anchor);

			if (over_slot) {
				over_slot.m(target, anchor);
			}

			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(window_1, "resize", /*resize_handler*/ ctx[28], false, false, false),
					listen_dev(window_1, "orientationchange", /*orientationchange_handler*/ ctx[29], false, false, false),
					listen_dev(document_1.body, "keydown", /*keydown_handler*/ ctx[30], false, false, false),
					action_destroyer(useActions_action = useActions.call(null, div3, /*use*/ ctx[1])),
					action_destroyer(/*forwardEvents*/ ctx[11].call(null, div3)),
					listen_dev(div3, "SMUIDialog:opening", /*handleDialogOpening*/ ctx[14], false, false, false),
					listen_dev(div3, "SMUIDialog:opened", /*handleDialogOpened*/ ctx[15], false, false, false),
					listen_dev(div3, "SMUIDialog:closed", /*handleDialogClosed*/ ctx[16], false, false, false),
					listen_dev(div3, "click", /*click_handler*/ ctx[33], false, false, false),
					listen_dev(div3, "keydown", /*keydown_handler_1*/ ctx[34], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[26],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[26], dirty, null),
						null
					);
				}
			}

			if (/*fullscreen*/ ctx[5]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
					if_block.c();
					if_block.m(div0, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
				(!current || dirty[0] & /*surface$class*/ 128 && div0_class_value !== (div0_class_value = classMap({
					[/*surface$class*/ ctx[7]]: true,
					'mdc-dialog__surface': true
				}))) && { class: div0_class_value },
				{ role: "alertdialog" },
				{ "aria-modal": "true" },
				dirty[0] & /*$$restProps*/ 131072 && prefixFilter(/*$$restProps*/ ctx[17], 'surface$')
			]));

			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
				(!current || dirty[0] & /*container$class*/ 64 && div1_class_value !== (div1_class_value = classMap({
					[/*container$class*/ ctx[6]]: true,
					'mdc-dialog__container': true
				}))) && { class: div1_class_value },
				dirty[0] & /*$$restProps*/ 131072 && prefixFilter(/*$$restProps*/ ctx[17], 'container$')
			]));

			set_attributes(div3, div3_data = get_spread_update(div3_levels, [
				(!current || dirty[0] & /*className, autoStackButtons, fullscreen, selection, internalClasses*/ 1084 && div3_class_value !== (div3_class_value = classMap({
					[/*className*/ ctx[2]]: true,
					'mdc-dialog': true,
					'mdc-dialog--stacked': !/*autoStackButtons*/ ctx[4],
					'mdc-dialog--fullscreen': /*fullscreen*/ ctx[5],
					'smui-dialog--selection': /*selection*/ ctx[3],
					.../*internalClasses*/ ctx[10]
				}))) && { class: div3_class_value },
				{ role: "alertdialog" },
				{ "aria-modal": "true" },
				dirty[0] & /*$$restProps*/ 131072 && exclude(/*$$restProps*/ ctx[17], ['container$', 'surface$'])
			]));

			if (useActions_action && is_function(useActions_action.update) && dirty[0] & /*use*/ 2) useActions_action.update.call(null, /*use*/ ctx[1]);

			if (over_slot) {
				if (over_slot.p && (!current || dirty[0] & /*$$scope*/ 67108864)) {
					update_slot_base(
						over_slot,
						over_slot_template,
						ctx,
						/*$$scope*/ ctx[26],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[26])
						: get_slot_changes(over_slot_template, /*$$scope*/ ctx[26], dirty, get_over_slot_changes),
						get_over_slot_context
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			transition_in(over_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			transition_out(over_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div3);
			if (default_slot) default_slot.d(detaching);
			if (if_block) if_block.d();
			/*div3_binding*/ ctx[32](null);
			if (detaching) detach_dev(t3);
			if (over_slot) over_slot.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance_1$1($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"use","class","open","selection","escapeKeyAction","scrimClickAction","autoStackButtons","fullscreen","container$class","surface$class","isOpen","setOpen","layout","getElement"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);
	let $aboveFullscreenShown;
	let $actionButtonsReversed;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Dialog', slots, ['default','over']);
	var _a;
	const { FocusTrap } = domFocusTrap;
	const { closest, matches } = ponyfill;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let { use = [] } = $$props;
	let { class: className = '' } = $$props;
	let { open = false } = $$props;
	let { selection = false } = $$props;
	let { escapeKeyAction = 'close' } = $$props;
	let { scrimClickAction = 'close' } = $$props;
	let { autoStackButtons = true } = $$props;
	let { fullscreen = false } = $$props;
	let { container$class = '' } = $$props;
	let { surface$class = '' } = $$props;
	let element;
	let instance;
	let internalClasses = {};
	let focusTrap;
	let actionButtonsReversed = writable(false);
	validate_store(actionButtonsReversed, 'actionButtonsReversed');
	component_subscribe($$self, actionButtonsReversed, value => $$invalidate(38, $actionButtonsReversed = value));
	let aboveFullscreen = getContext('SMUI:dialog:aboveFullscreen');

	let aboveFullscreenShown = (_a = getContext('SMUI:dialog:aboveFullscreenShown')) !== null && _a !== void 0
	? _a
	: writable(false);

	validate_store(aboveFullscreenShown, 'aboveFullscreenShown');
	component_subscribe($$self, aboveFullscreenShown, value => $$invalidate(25, $aboveFullscreenShown = value));
	let addLayoutListener = getContext('SMUI:addLayoutListener');
	let removeLayoutListener;
	let layoutListeners = [];

	let addLayoutListenerFn = listener => {
		layoutListeners.push(listener);

		return () => {
			const idx = layoutListeners.indexOf(listener);

			if (idx >= 0) {
				layoutListeners.splice(idx, 1);
			}
		};
	};

	setContext('SMUI:dialog:actions:reversed', actionButtonsReversed);
	setContext('SMUI:addLayoutListener', addLayoutListenerFn);
	setContext('SMUI:dialog:selection', selection);
	setContext('SMUI:dialog:aboveFullscreen', aboveFullscreen || fullscreen);
	setContext('SMUI:dialog:aboveFullscreenShown', aboveFullscreenShown);

	if (addLayoutListener) {
		removeLayoutListener = addLayoutListener(layout);
	}

	let previousAboveFullscreenShown = $aboveFullscreenShown;

	onMount(() => {
		var _a;

		focusTrap = new FocusTrap(element,
		{
				initialFocusEl: (_a = getInitialFocusEl()) !== null && _a !== void 0
				? _a
				: undefined
			});

		$$invalidate(8, instance = new MDCDialogFoundation({
				addBodyClass: className => document.body.classList.add(className),
				addClass,
				areButtonsStacked: () => areTopsMisaligned(getButtonEls()),
				clickDefaultButton: () => {
					const defaultButton = getDefaultButtonEl();

					if (defaultButton) {
						defaultButton.click();
					}
				},
				eventTargetMatches: (target, selector) => target ? matches(target, selector) : false,
				getActionFromEvent: evt => {
					if (!evt.target) {
						return '';
					}

					const element = closest(evt.target, '[data-mdc-dialog-action]');
					return element && element.getAttribute('data-mdc-dialog-action');
				},
				getInitialFocusEl,
				hasClass,
				isContentScrollable: () => isScrollable(getContentEl()),
				notifyClosed: action => {
					$$invalidate(0, open = false);
					dispatch(getElement(), 'SMUIDialog:closed', action ? { action } : {}, undefined, true);
				},
				notifyClosing: action => dispatch(getElement(), 'SMUIDialog:closing', action ? { action } : {}, undefined, true),
				notifyOpened: () => dispatch(getElement(), 'SMUIDialog:opened', {}, undefined, true),
				notifyOpening: () => dispatch(getElement(), 'SMUIDialog:opening', {}, undefined, true),
				releaseFocus: () => focusTrap.releaseFocus(),
				removeBodyClass: className => document.body.classList.remove(className),
				removeClass,
				reverseButtons: () => {
					set_store_value(actionButtonsReversed, $actionButtonsReversed = true, $actionButtonsReversed);
				},
				trapFocus: () => focusTrap.trapFocus(),
				registerContentEventHandler: (evt, handler) => {
					const content = getContentEl();

					if (content instanceof HTMLElement) {
						content.addEventListener(evt, handler);
					}
				},
				deregisterContentEventHandler: (evt, handler) => {
					const content = getContentEl();

					if (content instanceof HTMLElement) {
						content.removeEventListener(evt, handler);
					}
				},
				isScrollableContentAtTop: () => {
					return isScrollAtTop(getContentEl());
				},
				isScrollableContentAtBottom: () => {
					return isScrollAtBottom(getContentEl());
				},
				registerWindowEventHandler: (evt, handler) => {
					window.addEventListener(evt, handler);
				},
				deregisterWindowEventHandler: (evt, handler) => {
					window.removeEventListener(evt, handler);
				}
			}));

		instance.init();

		return () => {
			instance.destroy();
		};
	});

	onDestroy(() => {
		if (removeLayoutListener) {
			removeLayoutListener();
		}
	});

	function hasClass(className) {
		return className in internalClasses
		? internalClasses[className]
		: getElement().classList.contains(className);
	}

	function addClass(className) {
		if (!internalClasses[className]) {
			$$invalidate(10, internalClasses[className] = true, internalClasses);
		}
	}

	function removeClass(className) {
		if (!(className in internalClasses) || internalClasses[className]) {
			$$invalidate(10, internalClasses[className] = false, internalClasses);
		}
	}

	function getButtonEls() {
		return [].slice.call(element.querySelectorAll('.mdc-dialog__button'));
	}

	function getDefaultButtonEl() {
		return element.querySelector('[data-mdc-dialog-button-default');
	}

	function getContentEl() {
		return element.querySelector('.mdc-dialog__content');
	}

	function getInitialFocusEl() {
		return element.querySelector('[data-mdc-dialog-initial-focus]');
	}

	function handleDialogOpening() {
		if (aboveFullscreen) {
			set_store_value(aboveFullscreenShown, $aboveFullscreenShown = true, $aboveFullscreenShown);
		}

		requestAnimationFrame(() => {
			layoutListeners.forEach(listener => listener());
		});
	}

	function handleDialogOpened() {
		layoutListeners.forEach(listener => listener());
	}

	function handleDialogClosed() {
		if (aboveFullscreen) {
			set_store_value(aboveFullscreenShown, $aboveFullscreenShown = false, $aboveFullscreenShown);
		}
	}

	function isOpen() {
		return open;
	}

	function setOpen(value) {
		$$invalidate(0, open = value);
	}

	function layout() {
		return instance.layout();
	}

	function getElement() {
		return element;
	}

	const resize_handler = () => open && instance && instance.layout();
	const orientationchange_handler = () => open && instance && instance.layout();
	const keydown_handler = event => open && instance && instance.handleDocumentKeydown(event);
	const transitionend_handler = () => instance && instance.handleSurfaceScrimTransitionEnd();

	function div3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(9, element);
		});
	}

	const click_handler = event => instance && instance.handleClick(event);
	const keydown_handler_1 = event => instance && instance.handleKeydown(event);

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(1, use = $$new_props.use);
		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
		if ('selection' in $$new_props) $$invalidate(3, selection = $$new_props.selection);
		if ('escapeKeyAction' in $$new_props) $$invalidate(18, escapeKeyAction = $$new_props.escapeKeyAction);
		if ('scrimClickAction' in $$new_props) $$invalidate(19, scrimClickAction = $$new_props.scrimClickAction);
		if ('autoStackButtons' in $$new_props) $$invalidate(4, autoStackButtons = $$new_props.autoStackButtons);
		if ('fullscreen' in $$new_props) $$invalidate(5, fullscreen = $$new_props.fullscreen);
		if ('container$class' in $$new_props) $$invalidate(6, container$class = $$new_props.container$class);
		if ('surface$class' in $$new_props) $$invalidate(7, surface$class = $$new_props.surface$class);
		if ('$$scope' in $$new_props) $$invalidate(26, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		_a,
		MDCDialogFoundation,
		util,
		domFocusTrap,
		ponyfill,
		onMount,
		onDestroy,
		getContext,
		setContext,
		writable,
		get_current_component,
		forwardEventsBuilder,
		classMap,
		exclude,
		prefixFilter,
		useActions,
		dispatch,
		FocusTrap,
		closest,
		matches,
		forwardEvents,
		use,
		className,
		open,
		selection,
		escapeKeyAction,
		scrimClickAction,
		autoStackButtons,
		fullscreen,
		container$class,
		surface$class,
		element,
		instance,
		internalClasses,
		focusTrap,
		actionButtonsReversed,
		aboveFullscreen,
		aboveFullscreenShown,
		addLayoutListener,
		removeLayoutListener,
		layoutListeners,
		addLayoutListenerFn,
		previousAboveFullscreenShown,
		hasClass,
		addClass,
		removeClass,
		getButtonEls,
		getDefaultButtonEl,
		getContentEl,
		getInitialFocusEl,
		handleDialogOpening,
		handleDialogOpened,
		handleDialogClosed,
		isOpen,
		setOpen,
		layout,
		getElement,
		$aboveFullscreenShown,
		$actionButtonsReversed
	});

	$$self.$inject_state = $$new_props => {
		if ('_a' in $$props) _a = $$new_props._a;
		if ('use' in $$props) $$invalidate(1, use = $$new_props.use);
		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
		if ('selection' in $$props) $$invalidate(3, selection = $$new_props.selection);
		if ('escapeKeyAction' in $$props) $$invalidate(18, escapeKeyAction = $$new_props.escapeKeyAction);
		if ('scrimClickAction' in $$props) $$invalidate(19, scrimClickAction = $$new_props.scrimClickAction);
		if ('autoStackButtons' in $$props) $$invalidate(4, autoStackButtons = $$new_props.autoStackButtons);
		if ('fullscreen' in $$props) $$invalidate(5, fullscreen = $$new_props.fullscreen);
		if ('container$class' in $$props) $$invalidate(6, container$class = $$new_props.container$class);
		if ('surface$class' in $$props) $$invalidate(7, surface$class = $$new_props.surface$class);
		if ('element' in $$props) $$invalidate(9, element = $$new_props.element);
		if ('instance' in $$props) $$invalidate(8, instance = $$new_props.instance);
		if ('internalClasses' in $$props) $$invalidate(10, internalClasses = $$new_props.internalClasses);
		if ('focusTrap' in $$props) focusTrap = $$new_props.focusTrap;
		if ('actionButtonsReversed' in $$props) $$invalidate(12, actionButtonsReversed = $$new_props.actionButtonsReversed);
		if ('aboveFullscreen' in $$props) $$invalidate(42, aboveFullscreen = $$new_props.aboveFullscreen);
		if ('aboveFullscreenShown' in $$props) $$invalidate(13, aboveFullscreenShown = $$new_props.aboveFullscreenShown);
		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
		if ('layoutListeners' in $$props) layoutListeners = $$new_props.layoutListeners;
		if ('addLayoutListenerFn' in $$props) addLayoutListenerFn = $$new_props.addLayoutListenerFn;
		if ('previousAboveFullscreenShown' in $$props) $$invalidate(24, previousAboveFullscreenShown = $$new_props.previousAboveFullscreenShown);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*instance, escapeKeyAction*/ 262400) {
			if (instance && instance.getEscapeKeyAction() !== escapeKeyAction) {
				instance.setEscapeKeyAction(escapeKeyAction);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, scrimClickAction*/ 524544) {
			if (instance && instance.getScrimClickAction() !== scrimClickAction) {
				instance.setScrimClickAction(scrimClickAction);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, autoStackButtons*/ 272) {
			if (instance && instance.getAutoStackButtons() !== autoStackButtons) {
				instance.setAutoStackButtons(autoStackButtons);
			}
		}

		if ($$self.$$.dirty[0] & /*autoStackButtons*/ 16) {
			if (!autoStackButtons) {
				set_store_value(actionButtonsReversed, $actionButtonsReversed = true, $actionButtonsReversed);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, open*/ 257) {
			if (instance && instance.isOpen() !== open) {
				if (open) {
					instance.open({
						isAboveFullscreenDialog: !!aboveFullscreen
					});
				} else {
					instance.close();
				}
			}
		}

		if ($$self.$$.dirty[0] & /*fullscreen, instance, previousAboveFullscreenShown, $aboveFullscreenShown*/ 50331936) {
			if (fullscreen && instance && previousAboveFullscreenShown !== $aboveFullscreenShown) {
				$$invalidate(24, previousAboveFullscreenShown = $aboveFullscreenShown);

				if ($aboveFullscreenShown) {
					instance.showSurfaceScrim();
				} else {
					instance.hideSurfaceScrim();
				}
			}
		}
	};

	return [
		open,
		use,
		className,
		selection,
		autoStackButtons,
		fullscreen,
		container$class,
		surface$class,
		instance,
		element,
		internalClasses,
		forwardEvents,
		actionButtonsReversed,
		aboveFullscreenShown,
		handleDialogOpening,
		handleDialogOpened,
		handleDialogClosed,
		$$restProps,
		escapeKeyAction,
		scrimClickAction,
		isOpen,
		setOpen,
		layout,
		getElement,
		previousAboveFullscreenShown,
		$aboveFullscreenShown,
		$$scope,
		slots,
		resize_handler,
		orientationchange_handler,
		keydown_handler,
		transitionend_handler,
		div3_binding,
		click_handler,
		keydown_handler_1
	];
}

class Dialog extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance_1$1,
			create_fragment$c,
			safe_not_equal,
			{
				use: 1,
				class: 2,
				open: 0,
				selection: 3,
				escapeKeyAction: 18,
				scrimClickAction: 19,
				autoStackButtons: 4,
				fullscreen: 5,
				container$class: 6,
				surface$class: 7,
				isOpen: 20,
				setOpen: 21,
				layout: 22,
				getElement: 23
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dialog",
			options,
			id: create_fragment$c.name
		});
	}

	get use() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get open() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set open(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selection() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selection(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get escapeKeyAction() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set escapeKeyAction(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get scrimClickAction() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set scrimClickAction(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get autoStackButtons() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set autoStackButtons(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get fullscreen() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set fullscreen(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get container$class() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set container$class(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get surface$class() {
		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set surface$class(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isOpen() {
		return this.$$.ctx[20];
	}

	set isOpen(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setOpen() {
		return this.$$.ctx[21];
	}

	set setOpen(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get layout() {
		return this.$$.ctx[22];
	}

	set layout(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[23];
	}

	set getElement(value) {
		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/Div.svelte generated by Svelte v3.46.6 */
const file$9 = "node_modules/@smui/common/dist/elements/Div.svelte";

function create_fragment$b(ctx) {
	let div;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let div_levels = [/*$$restProps*/ ctx[3]];
	let div_data = {};

	for (let i = 0; i < div_levels.length; i += 1) {
		div_data = assign(div_data, div_levels[i]);
	}

	const block = {
		c: function create() {
			div = element("div");
			if (default_slot) default_slot.c();
			set_attributes(div, div_data);
			add_location(div, file$9, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (default_slot) {
				default_slot.m(div, null);
			}

			/*div_binding*/ ctx[7](div);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, div, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, div))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (default_slot) default_slot.d(detaching);
			/*div_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Div', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		div_binding
	];
}

class Div$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$b, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Div",
			options,
			id: create_fragment$b.name
		});
	}

	get use() {
		throw new Error("<Div>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<Div>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/classadder/ClassAdder.svelte generated by Svelte v3.46.6 */

// (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>
function create_default_slot$3(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[10].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[12],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
						null
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$3.name,
		type: "slot",
		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     [smuiClass]: true,     ...smuiClassMap,   })}   {...props}   {...$$restProps}>",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;

	const switch_instance_spread_levels = [
		{
			use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
		},
		{
			class: classMap({
				[/*className*/ ctx[1]]: true,
				[/*smuiClass*/ ctx[5]]: true,
				.../*smuiClassMap*/ ctx[4]
			})
		},
		/*props*/ ctx[6],
		/*$$restProps*/ ctx[8]
	];

	var switch_value = /*component*/ ctx[2];

	function switch_props(ctx) {
		let switch_instance_props = {
			$$slots: { default: [create_default_slot$3] },
			$$scope: { ctx }
		};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		/*switch_instance_binding*/ ctx[11](switch_instance);
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			const switch_instance_changes = (dirty & /*forwardEvents, use, classMap, className, smuiClass, smuiClassMap, props, $$restProps*/ 499)
			? get_spread_update(switch_instance_spread_levels, [
					dirty & /*forwardEvents, use*/ 129 && {
						use: [/*forwardEvents*/ ctx[7], .../*use*/ ctx[0]]
					},
					dirty & /*classMap, className, smuiClass, smuiClassMap*/ 50 && {
						class: classMap({
							[/*className*/ ctx[1]]: true,
							[/*smuiClass*/ ctx[5]]: true,
							.../*smuiClassMap*/ ctx[4]
						})
					},
					dirty & /*props*/ 64 && get_spread_object(/*props*/ ctx[6]),
					dirty & /*$$restProps*/ 256 && get_spread_object(/*$$restProps*/ ctx[8])
				])
			: {};

			if (dirty & /*$$scope*/ 4096) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (switch_value !== (switch_value = /*component*/ ctx[2])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					/*switch_instance_binding*/ ctx[11](switch_instance);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			/*switch_instance_binding*/ ctx[11](null);
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const internals = {
	component: Div$1,
	class: '',
	classMap: {},
	contexts: {},
	props: {}
};

function instance$9($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","class","component","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ClassAdder', slots, ['default']);
	let { use = [] } = $$props;
	let { class: className = '' } = $$props;
	let element;
	const smuiClass = internals.class;
	const smuiClassMap = {};
	const smuiClassUnsubscribes = [];
	const contexts = internals.contexts;
	const props = internals.props;
	let { component = internals.component } = $$props;

	Object.entries(internals.classMap).forEach(([name, context]) => {
		const store = getContext(context);

		if (store && 'subscribe' in store) {
			smuiClassUnsubscribes.push(store.subscribe(value => {
				$$invalidate(4, smuiClassMap[name] = value, smuiClassMap);
			}));
		}
	});

	const forwardEvents = forwardEventsBuilder(get_current_component());

	for (let context in contexts) {
		if (contexts.hasOwnProperty(context)) {
			setContext(context, contexts[context]);
		}
	}

	onDestroy(() => {
		for (const unsubscribe of smuiClassUnsubscribes) {
			unsubscribe();
		}
	});

	function getElement() {
		return element.getElement();
	}

	function switch_instance_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(3, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
		if ('component' in $$new_props) $$invalidate(2, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		Div: Div$1,
		internals,
		onDestroy,
		getContext,
		setContext,
		get_current_component,
		forwardEventsBuilder,
		classMap,
		use,
		className,
		element,
		smuiClass,
		smuiClassMap,
		smuiClassUnsubscribes,
		contexts,
		props,
		component,
		forwardEvents,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
		if ('element' in $$props) $$invalidate(3, element = $$new_props.element);
		if ('component' in $$props) $$invalidate(2, component = $$new_props.component);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		className,
		component,
		element,
		smuiClassMap,
		smuiClass,
		props,
		forwardEvents,
		$$restProps,
		getElement,
		slots,
		switch_instance_binding,
		$$scope
	];
}

class ClassAdder extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$a, safe_not_equal, {
			use: 0,
			class: 1,
			component: 2,
			getElement: 9
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ClassAdder",
			options,
			id: create_fragment$a.name
		});
	}

	get use() {
		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<ClassAdder>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[9];
	}

	set getElement(value) {
		throw new Error("<ClassAdder>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

// @ts-ignore: Internals is exported... argh.
const defaults = Object.assign({}, internals);
function classAdderBuilder(props) {
    return new Proxy(ClassAdder, {
        construct: function (target, args) {
            Object.assign(internals, defaults, props);
            // @ts-ignore: Need spread arg.
            return new target(...args);
        },
        get: function (target, prop) {
            Object.assign(internals, defaults, props);
            return target[prop];
        },
    });
}

/* node_modules/@smui/common/dist/elements/A.svelte generated by Svelte v3.46.6 */
const file$8 = "node_modules/@smui/common/dist/elements/A.svelte";

function create_fragment$9(ctx) {
	let a;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[7].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
	let a_levels = [{ href: /*href*/ ctx[1] }, /*$$restProps*/ ctx[4]];
	let a_data = {};

	for (let i = 0; i < a_levels.length; i += 1) {
		a_data = assign(a_data, a_levels[i]);
	}

	const block = {
		c: function create() {
			a = element("a");
			if (default_slot) default_slot.c();
			set_attributes(a, a_data);
			add_location(a, file$8, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, a, anchor);

			if (default_slot) {
				default_slot.m(a, null);
			}

			/*a_binding*/ ctx[8](a);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, a, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[3].call(null, a))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[6],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
						null
					);
				}
			}

			set_attributes(a, a_data = get_spread_update(a_levels, [
				(!current || dirty & /*href*/ 2) && { href: /*href*/ ctx[1] },
				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
			]));

			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(a);
			if (default_slot) default_slot.d(detaching);
			/*a_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","href","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('A', slots, ['default']);
	let { use = [] } = $$props;
	let { href = 'javascript:void(0);' } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function a_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(2, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		href,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		href,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		a_binding
	];
}

class A$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$9, safe_not_equal, { use: 0, href: 1, getElement: 5 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "A",
			options,
			id: create_fragment$9.name
		});
	}

	get use() {
		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<A>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[5];
	}

	set getElement(value) {
		throw new Error("<A>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/H2.svelte generated by Svelte v3.46.6 */
const file$7 = "node_modules/@smui/common/dist/elements/H2.svelte";

function create_fragment$8(ctx) {
	let h2;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let h2_levels = [/*$$restProps*/ ctx[3]];
	let h2_data = {};

	for (let i = 0; i < h2_levels.length; i += 1) {
		h2_data = assign(h2_data, h2_levels[i]);
	}

	const block = {
		c: function create() {
			h2 = element("h2");
			if (default_slot) default_slot.c();
			set_attributes(h2, h2_data);
			add_location(h2, file$7, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h2, anchor);

			if (default_slot) {
				default_slot.m(h2, null);
			}

			/*h2_binding*/ ctx[7](h2);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, h2, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, h2))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(h2, h2_data = get_spread_update(h2_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h2);
			if (default_slot) default_slot.d(detaching);
			/*h2_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('H2', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function h2_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		h2_binding
	];
}

class H2$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$8, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "H2",
			options,
			id: create_fragment$8.name
		});
	}

	get use() {
		throw new Error("<H2>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<H2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<H2>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/H3.svelte generated by Svelte v3.46.6 */
const file$6 = "node_modules/@smui/common/dist/elements/H3.svelte";

function create_fragment$7(ctx) {
	let h3;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let h3_levels = [/*$$restProps*/ ctx[3]];
	let h3_data = {};

	for (let i = 0; i < h3_levels.length; i += 1) {
		h3_data = assign(h3_data, h3_levels[i]);
	}

	const block = {
		c: function create() {
			h3 = element("h3");
			if (default_slot) default_slot.c();
			set_attributes(h3, h3_data);
			add_location(h3, file$6, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, h3, anchor);

			if (default_slot) {
				default_slot.m(h3, null);
			}

			/*h3_binding*/ ctx[7](h3);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, h3, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, h3))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(h3, h3_data = get_spread_update(h3_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(h3);
			if (default_slot) default_slot.d(detaching);
			/*h3_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('H3', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function h3_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		h3_binding
	];
}

class H3$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$7, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "H3",
			options,
			id: create_fragment$7.name
		});
	}

	get use() {
		throw new Error("<H3>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<H3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<H3>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/Li.svelte generated by Svelte v3.46.6 */
const file$5 = "node_modules/@smui/common/dist/elements/Li.svelte";

function create_fragment$6(ctx) {
	let li;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let li_levels = [/*$$restProps*/ ctx[3]];
	let li_data = {};

	for (let i = 0; i < li_levels.length; i += 1) {
		li_data = assign(li_data, li_levels[i]);
	}

	const block = {
		c: function create() {
			li = element("li");
			if (default_slot) default_slot.c();
			set_attributes(li, li_data);
			add_location(li, file$5, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);

			if (default_slot) {
				default_slot.m(li, null);
			}

			/*li_binding*/ ctx[7](li);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, li, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, li))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(li, li_data = get_spread_update(li_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (default_slot) default_slot.d(detaching);
			/*li_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Li', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function li_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		li_binding
	];
}

class Li$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$5, create_fragment$6, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Li",
			options,
			id: create_fragment$6.name
		});
	}

	get use() {
		throw new Error("<Li>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Li>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<Li>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/Nav.svelte generated by Svelte v3.46.6 */
const file$4 = "node_modules/@smui/common/dist/elements/Nav.svelte";

function create_fragment$5(ctx) {
	let nav;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let nav_levels = [/*$$restProps*/ ctx[3]];
	let nav_data = {};

	for (let i = 0; i < nav_levels.length; i += 1) {
		nav_data = assign(nav_data, nav_levels[i]);
	}

	const block = {
		c: function create() {
			nav = element("nav");
			if (default_slot) default_slot.c();
			set_attributes(nav, nav_data);
			add_location(nav, file$4, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, nav, anchor);

			if (default_slot) {
				default_slot.m(nav, null);
			}

			/*nav_binding*/ ctx[7](nav);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, nav, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, nav))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(nav, nav_data = get_spread_update(nav_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(nav);
			if (default_slot) default_slot.d(detaching);
			/*nav_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Nav', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function nav_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		nav_binding
	];
}

class Nav$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$4, create_fragment$5, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Nav",
			options,
			id: create_fragment$5.name
		});
	}

	get use() {
		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/Span.svelte generated by Svelte v3.46.6 */
const file$3 = "node_modules/@smui/common/dist/elements/Span.svelte";

function create_fragment$4(ctx) {
	let span;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let span_levels = [/*$$restProps*/ ctx[3]];
	let span_data = {};

	for (let i = 0; i < span_levels.length; i += 1) {
		span_data = assign(span_data, span_levels[i]);
	}

	const block = {
		c: function create() {
			span = element("span");
			if (default_slot) default_slot.c();
			set_attributes(span, span_data);
			add_location(span, file$3, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);

			if (default_slot) {
				default_slot.m(span, null);
			}

			/*span_binding*/ ctx[7](span);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, span, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, span))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(span, span_data = get_spread_update(span_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
			if (default_slot) default_slot.d(detaching);
			/*span_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Span', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function span_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		span_binding
	];
}

class Span$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$4, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Span",
			options,
			id: create_fragment$4.name
		});
	}

	get use() {
		throw new Error("<Span>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<Span>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* node_modules/@smui/common/dist/elements/Ul.svelte generated by Svelte v3.46.6 */
const file$2 = "node_modules/@smui/common/dist/elements/Ul.svelte";

function create_fragment$3(ctx) {
	let ul;
	let useActions_action;
	let current;
	let mounted;
	let dispose;
	const default_slot_template = /*#slots*/ ctx[6].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
	let ul_levels = [/*$$restProps*/ ctx[3]];
	let ul_data = {};

	for (let i = 0; i < ul_levels.length; i += 1) {
		ul_data = assign(ul_data, ul_levels[i]);
	}

	const block = {
		c: function create() {
			ul = element("ul");
			if (default_slot) default_slot.c();
			set_attributes(ul, ul_data);
			add_location(ul, file$2, 0, 0, 0);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			if (default_slot) {
				default_slot.m(ul, null);
			}

			/*ul_binding*/ ctx[7](ul);
			current = true;

			if (!mounted) {
				dispose = [
					action_destroyer(useActions_action = useActions.call(null, ul, /*use*/ ctx[0])),
					action_destroyer(/*forwardEvents*/ ctx[2].call(null, ul))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[5],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
						null
					);
				}
			}

			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
			if (useActions_action && is_function(useActions_action.update) && dirty & /*use*/ 1) useActions_action.update.call(null, /*use*/ ctx[0]);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			if (default_slot) default_slot.d(detaching);
			/*ul_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
	const omit_props_names = ["use","getElement"];
	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Ul', slots, ['default']);
	let { use = [] } = $$props;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let element;

	function getElement() {
		return element;
	}

	function ul_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(1, element);
		});
	}

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		get_current_component,
		forwardEventsBuilder,
		useActions,
		use,
		forwardEvents,
		element,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		use,
		element,
		forwardEvents,
		$$restProps,
		getElement,
		$$scope,
		slots,
		ul_binding
	];
}

class Ul$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$2, create_fragment$3, safe_not_equal, { use: 0, getElement: 4 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Ul",
			options,
			id: create_fragment$3.name
		});
	}

	get use() {
		throw new Error("<Ul>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Ul>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[4];
	}

	set getElement(value) {
		throw new Error("<Ul>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const A = A$1;
const Div = Div$1;
const H2 = H2$1;
const H3 = H3$1;
const Li = Li$1;
const Nav = Nav$1;
const Span = Span$1;
const Ul = Ul$1;

var Header = classAdderBuilder({
    class: 'mdc-dialog__header',
    component: Div,
    contexts: {
        'SMUI:icon-button:context': 'dialog:header',
    },
});

var Title = classAdderBuilder({
    class: 'mdc-dialog__title',
    component: H2,
});

var Content = classAdderBuilder({
    class: 'mdc-dialog__content',
    component: Div,
});

classAdderBuilder({
    class: 'mdc-dialog__actions',
    component: Div,
    classMap: {
        'smui-dialog__actions--reversed': 'SMUI:dialog:actions:reversed',
    },
    contexts: {
        'SMUI:button:context': 'dialog:action',
    },
});

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var _a, _b;
var cssClasses = {
    LIST_ITEM_ACTIVATED_CLASS: 'mdc-list-item--activated',
    LIST_ITEM_CLASS: 'mdc-list-item',
    LIST_ITEM_DISABLED_CLASS: 'mdc-list-item--disabled',
    LIST_ITEM_SELECTED_CLASS: 'mdc-list-item--selected',
    LIST_ITEM_TEXT_CLASS: 'mdc-list-item__text',
    LIST_ITEM_PRIMARY_TEXT_CLASS: 'mdc-list-item__primary-text',
    ROOT: 'mdc-list',
};
(_a = {},
    _a["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-list-item--activated',
    _a["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-list-item',
    _a["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-list-item--disabled',
    _a["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-list-item--selected',
    _a["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-list-item__primary-text',
    _a["" + cssClasses.ROOT] = 'mdc-list',
    _a);
var deprecatedClassNameMap = (_b = {},
    _b["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-deprecated-list-item--activated',
    _b["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-deprecated-list-item',
    _b["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-deprecated-list-item--disabled',
    _b["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-deprecated-list-item--selected',
    _b["" + cssClasses.LIST_ITEM_TEXT_CLASS] = 'mdc-deprecated-list-item__text',
    _b["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-deprecated-list-item__primary-text',
    _b["" + cssClasses.ROOT] = 'mdc-deprecated-list',
    _b);
var strings = {
    ACTION_EVENT: 'MDCList:action',
    ARIA_CHECKED: 'aria-checked',
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: 'aria-current',
    ARIA_DISABLED: 'aria-disabled',
    ARIA_ORIENTATION: 'aria-orientation',
    ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: 'aria-selected',
    ARIA_INTERACTIVE_ROLES_SELECTOR: '[role="listbox"], [role="menu"]',
    ARIA_MULTI_SELECTABLE_SELECTOR: '[aria-multiselectable="true"]',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"], input[type="radio"]',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a\n  ",
    DEPRECATED_SELECTOR: '.mdc-deprecated-list',
    FOCUSABLE_CHILD_ELEMENTS: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"radio\"]:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"checkbox\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"radio\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"checkbox\"]:not(:disabled)\n  ",
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]',
};
var numbers = {
    UNSET_INDEX: -1,
    TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300
};

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];
/**
 * Ensures that preventDefault is only called if the containing element
 * doesn't consume the event, and it will cause an unintended scroll.
 *
 * @param evt keyboard event to be prevented.
 */
var preventDefaultEvent = function (evt) {
    var target = evt.target;
    if (!target) {
        return;
    }
    var tagName = ("" + target.tagName).toLowerCase();
    if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
        evt.preventDefault();
    }
};

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * Initializes a state object for typeahead. Use the same reference for calls to
 * typeahead functions.
 *
 * @return The current state of the typeahead process. Each state reference
 *     represents a typeahead instance as the reference is typically mutated
 *     in-place.
 */
function initState() {
    var state = {
        bufferClearTimeout: 0,
        currentFirstChar: '',
        sortedIndexCursor: 0,
        typeaheadBuffer: '',
    };
    return state;
}
/**
 * Initializes typeahead state by indexing the current list items by primary
 * text into the sortedIndexByFirstChar data structure.
 *
 * @param listItemCount numer of items in the list
 * @param getPrimaryTextByItemIndex function that returns the primary text at a
 *     given index
 *
 * @return Map that maps the first character of the primary text to the full
 *     list text and it's index
 */
function initSortedIndex(listItemCount, getPrimaryTextByItemIndex) {
    var sortedIndexByFirstChar = new Map();
    // Aggregate item text to index mapping
    for (var i = 0; i < listItemCount; i++) {
        var primaryText = getPrimaryTextByItemIndex(i).trim();
        if (!primaryText) {
            continue;
        }
        var firstChar = primaryText[0].toLowerCase();
        if (!sortedIndexByFirstChar.has(firstChar)) {
            sortedIndexByFirstChar.set(firstChar, []);
        }
        sortedIndexByFirstChar.get(firstChar).push({ text: primaryText.toLowerCase(), index: i });
    }
    // Sort the mapping
    // TODO(b/157162694): Investigate replacing forEach with Map.values()
    sortedIndexByFirstChar.forEach(function (values) {
        values.sort(function (first, second) {
            return first.index - second.index;
        });
    });
    return sortedIndexByFirstChar;
}
/**
 * Given the next desired character from the user, it attempts to find the next
 * list option matching the buffer. Wraps around if at the end of options.
 *
 * @param opts Options and accessors
 *   - nextChar - the next character to match against items
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - skipFocus - whether or not to focus the matched item
 *   - isItemAtIndexDisabled - function that determines whether an item at a
 *        given index is disabled
 * @param state The typeahead state instance. See `initState`.
 *
 * @return The index of the matched item, or -1 if no match.
 */
function matchItem(opts, state) {
    var nextChar = opts.nextChar, focusItemAtIndex = opts.focusItemAtIndex, sortedIndexByFirstChar = opts.sortedIndexByFirstChar, focusedItemIndex = opts.focusedItemIndex, skipFocus = opts.skipFocus, isItemAtIndexDisabled = opts.isItemAtIndexDisabled;
    clearTimeout(state.bufferClearTimeout);
    state.bufferClearTimeout = setTimeout(function () {
        clearBuffer(state);
    }, numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);
    state.typeaheadBuffer = state.typeaheadBuffer + nextChar;
    var index;
    if (state.typeaheadBuffer.length === 1) {
        index = matchFirstChar(sortedIndexByFirstChar, focusedItemIndex, isItemAtIndexDisabled, state);
    }
    else {
        index = matchAllChars(sortedIndexByFirstChar, isItemAtIndexDisabled, state);
    }
    if (index !== -1 && !skipFocus) {
        focusItemAtIndex(index);
    }
    return index;
}
/**
 * Matches the user's single input character in the buffer to the
 * next option that begins with such character. Wraps around if at
 * end of options. Returns -1 if no match is found.
 */
function matchFirstChar(sortedIndexByFirstChar, focusedItemIndex, isItemAtIndexDisabled, state) {
    var firstChar = state.typeaheadBuffer[0];
    var itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
        return -1;
    }
    // Has the same firstChar been recently matched?
    // Also, did starting index remain the same between key presses?
    // If both hold true, simply increment index.
    if (firstChar === state.currentFirstChar &&
        itemsMatchingFirstChar[state.sortedIndexCursor].index ===
            focusedItemIndex) {
        state.sortedIndexCursor =
            (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
        var newIndex = itemsMatchingFirstChar[state.sortedIndexCursor].index;
        if (!isItemAtIndexDisabled(newIndex)) {
            return newIndex;
        }
    }
    // If we're here, it means one of the following happened:
    // - either firstChar or startingIndex has changed, invalidating the
    // cursor.
    // - The next item of typeahead is disabled, so we have to look further.
    state.currentFirstChar = firstChar;
    var newCursorPosition = -1;
    var cursorPosition;
    // Find the first non-disabled item as a fallback.
    for (cursorPosition = 0; cursorPosition < itemsMatchingFirstChar.length; cursorPosition++) {
        if (!isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
            newCursorPosition = cursorPosition;
            break;
        }
    }
    // Advance cursor to first item matching the firstChar that is positioned
    // after starting item. Cursor is unchanged from fallback if there's no
    // such item.
    for (; cursorPosition < itemsMatchingFirstChar.length; cursorPosition++) {
        if (itemsMatchingFirstChar[cursorPosition].index > focusedItemIndex &&
            !isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
            newCursorPosition = cursorPosition;
            break;
        }
    }
    if (newCursorPosition !== -1) {
        state.sortedIndexCursor = newCursorPosition;
        return itemsMatchingFirstChar[state.sortedIndexCursor].index;
    }
    return -1;
}
/**
 * Attempts to find the next item that matches all of the typeahead buffer.
 * Wraps around if at end of options. Returns -1 if no match is found.
 */
function matchAllChars(sortedIndexByFirstChar, isItemAtIndexDisabled, state) {
    var firstChar = state.typeaheadBuffer[0];
    var itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
    if (!itemsMatchingFirstChar) {
        return -1;
    }
    // Do nothing if text already matches
    var startingItem = itemsMatchingFirstChar[state.sortedIndexCursor];
    if (startingItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0 &&
        !isItemAtIndexDisabled(startingItem.index)) {
        return startingItem.index;
    }
    // Find next item that matches completely; if no match, we'll eventually
    // loop around to same position
    var cursorPosition = (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
    var nextCursorPosition = -1;
    while (cursorPosition !== state.sortedIndexCursor) {
        var currentItem = itemsMatchingFirstChar[cursorPosition];
        var matches = currentItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0;
        var isEnabled = !isItemAtIndexDisabled(currentItem.index);
        if (matches && isEnabled) {
            nextCursorPosition = cursorPosition;
            break;
        }
        cursorPosition = (cursorPosition + 1) % itemsMatchingFirstChar.length;
    }
    if (nextCursorPosition !== -1) {
        state.sortedIndexCursor = nextCursorPosition;
        return itemsMatchingFirstChar[state.sortedIndexCursor].index;
    }
    return -1;
}
/**
 * Whether or not the given typeahead instaance state is currently typing.
 *
 * @param state The typeahead state instance. See `initState`.
 */
function isTypingInProgress(state) {
    return state.typeaheadBuffer.length > 0;
}
/**
 * Clears the typeahaed buffer so that it resets item matching to the first
 * character.
 *
 * @param state The typeahead state instance. See `initState`.
 */
function clearBuffer(state) {
    state.typeaheadBuffer = '';
}
/**
 * Given a keydown event, it calculates whether or not to automatically focus a
 * list item depending on what was typed mimicing the typeahead functionality of
 * a standard <select> element that is open.
 *
 * @param opts Options and accessors
 *   - event - the KeyboardEvent to handle and parse
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - isItemAtFocusedIndexDisabled - whether or not the currently focused item
 *      is disabled
 *   - isTargetListItem - whether or not the event target is a list item
 * @param state The typeahead state instance. See `initState`.
 *
 * @returns index of the item matched by the keydown. -1 if not matched.
 */
function handleKeydown(opts, state) {
    var event = opts.event, isTargetListItem = opts.isTargetListItem, focusedItemIndex = opts.focusedItemIndex, focusItemAtIndex = opts.focusItemAtIndex, sortedIndexByFirstChar = opts.sortedIndexByFirstChar, isItemAtIndexDisabled = opts.isItemAtIndexDisabled;
    var isArrowLeft = normalizeKey(event) === 'ArrowLeft';
    var isArrowUp = normalizeKey(event) === 'ArrowUp';
    var isArrowRight = normalizeKey(event) === 'ArrowRight';
    var isArrowDown = normalizeKey(event) === 'ArrowDown';
    var isHome = normalizeKey(event) === 'Home';
    var isEnd = normalizeKey(event) === 'End';
    var isEnter = normalizeKey(event) === 'Enter';
    var isSpace = normalizeKey(event) === 'Spacebar';
    if (event.ctrlKey || event.metaKey || isArrowLeft || isArrowUp ||
        isArrowRight || isArrowDown || isHome || isEnd || isEnter) {
        return -1;
    }
    var isCharacterKey = !isSpace && event.key.length === 1;
    if (isCharacterKey) {
        preventDefaultEvent(event);
        var matchItemOpts = {
            focusItemAtIndex: focusItemAtIndex,
            focusedItemIndex: focusedItemIndex,
            nextChar: event.key.toLowerCase(),
            sortedIndexByFirstChar: sortedIndexByFirstChar,
            skipFocus: false,
            isItemAtIndexDisabled: isItemAtIndexDisabled,
        };
        return matchItem(matchItemOpts, state);
    }
    if (!isSpace) {
        return -1;
    }
    if (isTargetListItem) {
        preventDefaultEvent(event);
    }
    var typeaheadOnListItem = isTargetListItem && isTypingInProgress(state);
    if (typeaheadOnListItem) {
        var matchItemOpts = {
            focusItemAtIndex: focusItemAtIndex,
            focusedItemIndex: focusedItemIndex,
            nextChar: ' ',
            sortedIndexByFirstChar: sortedIndexByFirstChar,
            skipFocus: false,
            isItemAtIndexDisabled: isItemAtIndexDisabled,
        };
        // space participates in typeahead matching if in rapid typing mode
        return matchItem(matchItemOpts, state);
    }
    return -1;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function isNumberArray(selectedIndex) {
    return selectedIndex instanceof Array;
}
var MDCListFoundation = /** @class */ (function (_super) {
    __extends(MDCListFoundation, _super);
    function MDCListFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCListFoundation.defaultAdapter), adapter)) || this;
        _this.wrapFocus = false;
        _this.isVertical = true;
        _this.isSingleSelectionList = false;
        _this.selectedIndex = numbers.UNSET_INDEX;
        _this.focusedItemIndex = numbers.UNSET_INDEX;
        _this.useActivatedClass = false;
        _this.useSelectedAttr = false;
        _this.ariaCurrentAttrValue = null;
        _this.isCheckboxList = false;
        _this.isRadioList = false;
        _this.hasTypeahead = false;
        // Transiently holds current typeahead prefix from user.
        _this.typeaheadState = initState();
        _this.sortedIndexByFirstChar = new Map();
        return _this;
    }
    Object.defineProperty(MDCListFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClassForElementIndex: function () { return undefined; },
                focusItemAtIndex: function () { return undefined; },
                getAttributeForElementIndex: function () { return null; },
                getFocusedElementIndex: function () { return 0; },
                getListItemCount: function () { return 0; },
                hasCheckboxAtIndex: function () { return false; },
                hasRadioAtIndex: function () { return false; },
                isCheckboxCheckedAtIndex: function () { return false; },
                isFocusInsideList: function () { return false; },
                isRootFocused: function () { return false; },
                listItemAtIndexHasClass: function () { return false; },
                notifyAction: function () { return undefined; },
                removeClassForElementIndex: function () { return undefined; },
                setAttributeForElementIndex: function () { return undefined; },
                setCheckedCheckboxOrRadioAtIndex: function () { return undefined; },
                setTabIndexForListItemChildren: function () { return undefined; },
                getPrimaryTextAtIndex: function () { return ''; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCListFoundation.prototype.layout = function () {
        if (this.adapter.getListItemCount() === 0) {
            return;
        }
        // TODO(b/172274142): consider all items when determining the list's type.
        if (this.adapter.hasCheckboxAtIndex(0)) {
            this.isCheckboxList = true;
        }
        else if (this.adapter.hasRadioAtIndex(0)) {
            this.isRadioList = true;
        }
        else {
            this.maybeInitializeSingleSelection();
        }
        if (this.hasTypeahead) {
            this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
        }
    };
    /** Returns the index of the item that was last focused. */
    MDCListFoundation.prototype.getFocusedItemIndex = function () {
        return this.focusedItemIndex;
    };
    /** Toggles focus wrapping with keyboard navigation. */
    MDCListFoundation.prototype.setWrapFocus = function (value) {
        this.wrapFocus = value;
    };
    /**
     * Toggles orientation direction for keyboard navigation (true for vertical,
     * false for horizontal).
     */
    MDCListFoundation.prototype.setVerticalOrientation = function (value) {
        this.isVertical = value;
    };
    /** Toggles single-selection behavior. */
    MDCListFoundation.prototype.setSingleSelection = function (value) {
        this.isSingleSelectionList = value;
        if (value) {
            this.maybeInitializeSingleSelection();
            this.selectedIndex = this.getSelectedIndexFromDOM();
        }
    };
    /**
     * Automatically determines whether the list is single selection list. If so,
     * initializes the internal state to match the selected item.
     */
    MDCListFoundation.prototype.maybeInitializeSingleSelection = function () {
        var selectedItemIndex = this.getSelectedIndexFromDOM();
        if (selectedItemIndex === numbers.UNSET_INDEX)
            return;
        var hasActivatedClass = this.adapter.listItemAtIndexHasClass(selectedItemIndex, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
        if (hasActivatedClass) {
            this.setUseActivatedClass(true);
        }
        this.isSingleSelectionList = true;
        this.selectedIndex = selectedItemIndex;
    };
    /** @return Index of the first selected item based on the DOM state. */
    MDCListFoundation.prototype.getSelectedIndexFromDOM = function () {
        var selectedIndex = numbers.UNSET_INDEX;
        var listItemsCount = this.adapter.getListItemCount();
        for (var i = 0; i < listItemsCount; i++) {
            var hasSelectedClass = this.adapter.listItemAtIndexHasClass(i, cssClasses.LIST_ITEM_SELECTED_CLASS);
            var hasActivatedClass = this.adapter.listItemAtIndexHasClass(i, cssClasses.LIST_ITEM_ACTIVATED_CLASS);
            if (!(hasSelectedClass || hasActivatedClass)) {
                continue;
            }
            selectedIndex = i;
            break;
        }
        return selectedIndex;
    };
    /**
     * Sets whether typeahead is enabled on the list.
     * @param hasTypeahead Whether typeahead is enabled.
     */
    MDCListFoundation.prototype.setHasTypeahead = function (hasTypeahead) {
        this.hasTypeahead = hasTypeahead;
        if (hasTypeahead) {
            this.sortedIndexByFirstChar = this.typeaheadInitSortedIndex();
        }
    };
    /**
     * @return Whether typeahead is currently matching a user-specified prefix.
     */
    MDCListFoundation.prototype.isTypeaheadInProgress = function () {
        return this.hasTypeahead &&
            isTypingInProgress(this.typeaheadState);
    };
    /** Toggle use of the "activated" CSS class. */
    MDCListFoundation.prototype.setUseActivatedClass = function (useActivated) {
        this.useActivatedClass = useActivated;
    };
    /**
     * Toggles use of the selected attribute (true for aria-selected, false for
     * aria-checked).
     */
    MDCListFoundation.prototype.setUseSelectedAttribute = function (useSelected) {
        this.useSelectedAttr = useSelected;
    };
    MDCListFoundation.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };
    MDCListFoundation.prototype.setSelectedIndex = function (index, _a) {
        var _b = _a === void 0 ? {} : _a, forceUpdate = _b.forceUpdate;
        if (!this.isIndexValid(index)) {
            return;
        }
        if (this.isCheckboxList) {
            this.setCheckboxAtIndex(index);
        }
        else if (this.isRadioList) {
            this.setRadioAtIndex(index);
        }
        else {
            this.setSingleSelectionAtIndex(index, { forceUpdate: forceUpdate });
        }
    };
    /**
     * Focus in handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusIn = function (listItemIndex) {
        if (listItemIndex >= 0) {
            this.focusedItemIndex = listItemIndex;
            this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '0');
            this.adapter.setTabIndexForListItemChildren(listItemIndex, '0');
        }
    };
    /**
     * Focus out handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusOut = function (listItemIndex) {
        var _this = this;
        if (listItemIndex >= 0) {
            this.adapter.setAttributeForElementIndex(listItemIndex, 'tabindex', '-1');
            this.adapter.setTabIndexForListItemChildren(listItemIndex, '-1');
        }
        /**
         * Between Focusout & Focusin some browsers do not have focus on any
         * element. Setting a delay to wait till the focus is moved to next element.
         */
        setTimeout(function () {
            if (!_this.adapter.isFocusInsideList()) {
                _this.setTabindexToFirstSelectedOrFocusedItem();
            }
        }, 0);
    };
    /**
     * Key handler for the list.
     */
    MDCListFoundation.prototype.handleKeydown = function (event, isRootListItem, listItemIndex) {
        var _this = this;
        var isArrowLeft = normalizeKey(event) === 'ArrowLeft';
        var isArrowUp = normalizeKey(event) === 'ArrowUp';
        var isArrowRight = normalizeKey(event) === 'ArrowRight';
        var isArrowDown = normalizeKey(event) === 'ArrowDown';
        var isHome = normalizeKey(event) === 'Home';
        var isEnd = normalizeKey(event) === 'End';
        var isEnter = normalizeKey(event) === 'Enter';
        var isSpace = normalizeKey(event) === 'Spacebar';
        // Have to check both upper and lower case, because having caps lock on
        // affects the value.
        var isLetterA = event.key === 'A' || event.key === 'a';
        if (this.adapter.isRootFocused()) {
            if (isArrowUp || isEnd) {
                event.preventDefault();
                this.focusLastElement();
            }
            else if (isArrowDown || isHome) {
                event.preventDefault();
                this.focusFirstElement();
            }
            if (this.hasTypeahead) {
                var handleKeydownOpts = {
                    event: event,
                    focusItemAtIndex: function (index) {
                        _this.focusItemAtIndex(index);
                    },
                    focusedItemIndex: -1,
                    isTargetListItem: isRootListItem,
                    sortedIndexByFirstChar: this.sortedIndexByFirstChar,
                    isItemAtIndexDisabled: function (index) {
                        return _this.adapter.listItemAtIndexHasClass(index, cssClasses.LIST_ITEM_DISABLED_CLASS);
                    },
                };
                handleKeydown(handleKeydownOpts, this.typeaheadState);
            }
            return;
        }
        var currentIndex = this.adapter.getFocusedElementIndex();
        if (currentIndex === -1) {
            currentIndex = listItemIndex;
            if (currentIndex < 0) {
                // If this event doesn't have a mdc-list-item ancestor from the
                // current list (not from a sublist), return early.
                return;
            }
        }
        if ((this.isVertical && isArrowDown) ||
            (!this.isVertical && isArrowRight)) {
            preventDefaultEvent(event);
            this.focusNextElement(currentIndex);
        }
        else if ((this.isVertical && isArrowUp) || (!this.isVertical && isArrowLeft)) {
            preventDefaultEvent(event);
            this.focusPrevElement(currentIndex);
        }
        else if (isHome) {
            preventDefaultEvent(event);
            this.focusFirstElement();
        }
        else if (isEnd) {
            preventDefaultEvent(event);
            this.focusLastElement();
        }
        else if (isLetterA && event.ctrlKey && this.isCheckboxList) {
            event.preventDefault();
            this.toggleAll(this.selectedIndex === numbers.UNSET_INDEX ?
                [] :
                this.selectedIndex);
        }
        else if (isEnter || isSpace) {
            if (isRootListItem) {
                // Return early if enter key is pressed on anchor element which triggers
                // synthetic MouseEvent event.
                var target = event.target;
                if (target && target.tagName === 'A' && isEnter) {
                    return;
                }
                preventDefaultEvent(event);
                if (this.adapter.listItemAtIndexHasClass(currentIndex, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
                    return;
                }
                if (!this.isTypeaheadInProgress()) {
                    if (this.isSelectableList()) {
                        this.setSelectedIndexOnAction(currentIndex);
                    }
                    this.adapter.notifyAction(currentIndex);
                }
            }
        }
        if (this.hasTypeahead) {
            var handleKeydownOpts = {
                event: event,
                focusItemAtIndex: function (index) {
                    _this.focusItemAtIndex(index);
                },
                focusedItemIndex: this.focusedItemIndex,
                isTargetListItem: isRootListItem,
                sortedIndexByFirstChar: this.sortedIndexByFirstChar,
                isItemAtIndexDisabled: function (index) { return _this.adapter.listItemAtIndexHasClass(index, cssClasses.LIST_ITEM_DISABLED_CLASS); },
            };
            handleKeydown(handleKeydownOpts, this.typeaheadState);
        }
    };
    /**
     * Click handler for the list.
     */
    MDCListFoundation.prototype.handleClick = function (index, toggleCheckbox) {
        if (index === numbers.UNSET_INDEX) {
            return;
        }
        if (this.adapter.listItemAtIndexHasClass(index, cssClasses.LIST_ITEM_DISABLED_CLASS)) {
            return;
        }
        if (this.isSelectableList()) {
            this.setSelectedIndexOnAction(index, toggleCheckbox);
        }
        this.adapter.notifyAction(index);
    };
    /**
     * Focuses the next element on the list.
     */
    MDCListFoundation.prototype.focusNextElement = function (index) {
        var count = this.adapter.getListItemCount();
        var nextIndex = index + 1;
        if (nextIndex >= count) {
            if (this.wrapFocus) {
                nextIndex = 0;
            }
            else {
                // Return early because last item is already focused.
                return index;
            }
        }
        this.focusItemAtIndex(nextIndex);
        return nextIndex;
    };
    /**
     * Focuses the previous element on the list.
     */
    MDCListFoundation.prototype.focusPrevElement = function (index) {
        var prevIndex = index - 1;
        if (prevIndex < 0) {
            if (this.wrapFocus) {
                prevIndex = this.adapter.getListItemCount() - 1;
            }
            else {
                // Return early because first item is already focused.
                return index;
            }
        }
        this.focusItemAtIndex(prevIndex);
        return prevIndex;
    };
    MDCListFoundation.prototype.focusFirstElement = function () {
        this.focusItemAtIndex(0);
        return 0;
    };
    MDCListFoundation.prototype.focusLastElement = function () {
        var lastIndex = this.adapter.getListItemCount() - 1;
        this.focusItemAtIndex(lastIndex);
        return lastIndex;
    };
    MDCListFoundation.prototype.focusInitialElement = function () {
        var initialIndex = this.getFirstSelectedOrFocusedItemIndex();
        this.focusItemAtIndex(initialIndex);
        return initialIndex;
    };
    /**
     * @param itemIndex Index of the list item
     * @param isEnabled Sets the list item to enabled or disabled.
     */
    MDCListFoundation.prototype.setEnabled = function (itemIndex, isEnabled) {
        if (!this.isIndexValid(itemIndex)) {
            return;
        }
        if (isEnabled) {
            this.adapter.removeClassForElementIndex(itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.setAttributeForElementIndex(itemIndex, strings.ARIA_DISABLED, 'false');
        }
        else {
            this.adapter.addClassForElementIndex(itemIndex, cssClasses.LIST_ITEM_DISABLED_CLASS);
            this.adapter.setAttributeForElementIndex(itemIndex, strings.ARIA_DISABLED, 'true');
        }
    };
    MDCListFoundation.prototype.setSingleSelectionAtIndex = function (index, _a) {
        var _b = _a === void 0 ? {} : _a, forceUpdate = _b.forceUpdate;
        if (this.selectedIndex === index && !forceUpdate) {
            return;
        }
        var selectedClassName = cssClasses.LIST_ITEM_SELECTED_CLASS;
        if (this.useActivatedClass) {
            selectedClassName = cssClasses.LIST_ITEM_ACTIVATED_CLASS;
        }
        if (this.selectedIndex !== numbers.UNSET_INDEX) {
            this.adapter.removeClassForElementIndex(this.selectedIndex, selectedClassName);
        }
        this.setAriaForSingleSelectionAtIndex(index);
        this.setTabindexAtIndex(index);
        if (index !== numbers.UNSET_INDEX) {
            this.adapter.addClassForElementIndex(index, selectedClassName);
        }
        this.selectedIndex = index;
    };
    /**
     * Sets aria attribute for single selection at given index.
     */
    MDCListFoundation.prototype.setAriaForSingleSelectionAtIndex = function (index) {
        // Detect the presence of aria-current and get the value only during list
        // initialization when it is in unset state.
        if (this.selectedIndex === numbers.UNSET_INDEX) {
            this.ariaCurrentAttrValue =
                this.adapter.getAttributeForElementIndex(index, strings.ARIA_CURRENT);
        }
        var isAriaCurrent = this.ariaCurrentAttrValue !== null;
        var ariaAttribute = isAriaCurrent ? strings.ARIA_CURRENT : strings.ARIA_SELECTED;
        if (this.selectedIndex !== numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, ariaAttribute, 'false');
        }
        if (index !== numbers.UNSET_INDEX) {
            var ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue : 'true';
            this.adapter.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue);
        }
    };
    /**
     * Returns the attribute to use for indicating selection status.
     */
    MDCListFoundation.prototype.getSelectionAttribute = function () {
        return this.useSelectedAttr ? strings.ARIA_SELECTED : strings.ARIA_CHECKED;
    };
    /**
     * Toggles radio at give index. Radio doesn't change the checked state if it
     * is already checked.
     */
    MDCListFoundation.prototype.setRadioAtIndex = function (index) {
        var selectionAttribute = this.getSelectionAttribute();
        this.adapter.setCheckedCheckboxOrRadioAtIndex(index, true);
        if (this.selectedIndex !== numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, selectionAttribute, 'false');
        }
        this.adapter.setAttributeForElementIndex(index, selectionAttribute, 'true');
        this.selectedIndex = index;
    };
    MDCListFoundation.prototype.setCheckboxAtIndex = function (index) {
        var selectionAttribute = this.getSelectionAttribute();
        for (var i = 0; i < this.adapter.getListItemCount(); i++) {
            var isChecked = false;
            if (index.indexOf(i) >= 0) {
                isChecked = true;
            }
            this.adapter.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
            this.adapter.setAttributeForElementIndex(i, selectionAttribute, isChecked ? 'true' : 'false');
        }
        this.selectedIndex = index;
    };
    MDCListFoundation.prototype.setTabindexAtIndex = function (index) {
        if (this.focusedItemIndex === numbers.UNSET_INDEX && index !== 0) {
            // If some list item was selected set first list item's tabindex to -1.
            // Generally, tabindex is set to 0 on first list item of list that has no
            // preselected items.
            this.adapter.setAttributeForElementIndex(0, 'tabindex', '-1');
        }
        else if (this.focusedItemIndex >= 0 && this.focusedItemIndex !== index) {
            this.adapter.setAttributeForElementIndex(this.focusedItemIndex, 'tabindex', '-1');
        }
        // Set the previous selection's tabindex to -1. We need this because
        // in selection menus that are not visible, programmatically setting an
        // option will not change focus but will change where tabindex should be 0.
        if (!(this.selectedIndex instanceof Array) &&
            this.selectedIndex !== index) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex, 'tabindex', '-1');
        }
        if (index !== numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(index, 'tabindex', '0');
        }
    };
    /**
     * @return Return true if it is single selectin list, checkbox list or radio
     *     list.
     */
    MDCListFoundation.prototype.isSelectableList = function () {
        return this.isSingleSelectionList || this.isCheckboxList ||
            this.isRadioList;
    };
    MDCListFoundation.prototype.setTabindexToFirstSelectedOrFocusedItem = function () {
        var targetIndex = this.getFirstSelectedOrFocusedItemIndex();
        this.setTabindexAtIndex(targetIndex);
    };
    MDCListFoundation.prototype.getFirstSelectedOrFocusedItemIndex = function () {
        // Action lists retain focus on the most recently focused item.
        if (!this.isSelectableList()) {
            return Math.max(this.focusedItemIndex, 0);
        }
        // Single-selection lists focus the selected item.
        if (typeof this.selectedIndex === 'number' &&
            this.selectedIndex !== numbers.UNSET_INDEX) {
            return this.selectedIndex;
        }
        // Multiple-selection lists focus the first selected item.
        if (isNumberArray(this.selectedIndex) && this.selectedIndex.length > 0) {
            return this.selectedIndex.reduce(function (minIndex, currentIndex) { return Math.min(minIndex, currentIndex); });
        }
        // Selection lists without a selection focus the first item.
        return 0;
    };
    MDCListFoundation.prototype.isIndexValid = function (index) {
        var _this = this;
        if (index instanceof Array) {
            if (!this.isCheckboxList) {
                throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
            }
            if (index.length === 0) {
                return true;
            }
            else {
                return index.some(function (i) { return _this.isIndexInRange(i); });
            }
        }
        else if (typeof index === 'number') {
            if (this.isCheckboxList) {
                throw new Error("MDCListFoundation: Expected array of index for checkbox based list but got number: " + index);
            }
            return this.isIndexInRange(index) ||
                this.isSingleSelectionList && index === numbers.UNSET_INDEX;
        }
        else {
            return false;
        }
    };
    MDCListFoundation.prototype.isIndexInRange = function (index) {
        var listSize = this.adapter.getListItemCount();
        return index >= 0 && index < listSize;
    };
    /**
     * Sets selected index on user action, toggles checkbox / radio based on
     * toggleCheckbox value. User interaction should not toggle list item(s) when
     * disabled.
     */
    MDCListFoundation.prototype.setSelectedIndexOnAction = function (index, toggleCheckbox) {
        if (toggleCheckbox === void 0) { toggleCheckbox = true; }
        if (this.isCheckboxList) {
            this.toggleCheckboxAtIndex(index, toggleCheckbox);
        }
        else {
            this.setSelectedIndex(index);
        }
    };
    MDCListFoundation.prototype.toggleCheckboxAtIndex = function (index, toggleCheckbox) {
        var selectionAttribute = this.getSelectionAttribute();
        var isChecked = this.adapter.isCheckboxCheckedAtIndex(index);
        if (toggleCheckbox) {
            isChecked = !isChecked;
            this.adapter.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
        }
        this.adapter.setAttributeForElementIndex(index, selectionAttribute, isChecked ? 'true' : 'false');
        // If none of the checkbox items are selected and selectedIndex is not
        // initialized then provide a default value.
        var selectedIndexes = this.selectedIndex === numbers.UNSET_INDEX ?
            [] :
            this.selectedIndex.slice();
        if (isChecked) {
            selectedIndexes.push(index);
        }
        else {
            selectedIndexes = selectedIndexes.filter(function (i) { return i !== index; });
        }
        this.selectedIndex = selectedIndexes;
    };
    MDCListFoundation.prototype.focusItemAtIndex = function (index) {
        this.adapter.focusItemAtIndex(index);
        this.focusedItemIndex = index;
    };
    MDCListFoundation.prototype.toggleAll = function (currentlySelectedIndexes) {
        var count = this.adapter.getListItemCount();
        // If all items are selected, deselect everything.
        if (currentlySelectedIndexes.length === count) {
            this.setCheckboxAtIndex([]);
        }
        else {
            // Otherwise select all enabled options.
            var allIndexes = [];
            for (var i = 0; i < count; i++) {
                if (!this.adapter.listItemAtIndexHasClass(i, cssClasses.LIST_ITEM_DISABLED_CLASS) ||
                    currentlySelectedIndexes.indexOf(i) > -1) {
                    allIndexes.push(i);
                }
            }
            this.setCheckboxAtIndex(allIndexes);
        }
    };
    /**
     * Given the next desired character from the user, adds it to the typeahead
     * buffer. Then, attempts to find the next option matching the buffer. Wraps
     * around if at the end of options.
     *
     * @param nextChar The next character to add to the prefix buffer.
     * @param startingIndex The index from which to start matching. Only relevant
     *     when starting a new match sequence. To start a new match sequence,
     *     clear the buffer using `clearTypeaheadBuffer`, or wait for the buffer
     *     to clear after a set interval defined in list foundation. Defaults to
     *     the currently focused index.
     * @return The index of the matched item, or -1 if no match.
     */
    MDCListFoundation.prototype.typeaheadMatchItem = function (nextChar, startingIndex, skipFocus) {
        var _this = this;
        if (skipFocus === void 0) { skipFocus = false; }
        var opts = {
            focusItemAtIndex: function (index) {
                _this.focusItemAtIndex(index);
            },
            focusedItemIndex: startingIndex ? startingIndex : this.focusedItemIndex,
            nextChar: nextChar,
            sortedIndexByFirstChar: this.sortedIndexByFirstChar,
            skipFocus: skipFocus,
            isItemAtIndexDisabled: function (index) { return _this.adapter.listItemAtIndexHasClass(index, cssClasses.LIST_ITEM_DISABLED_CLASS); }
        };
        return matchItem(opts, this.typeaheadState);
    };
    /**
     * Initializes the MDCListTextAndIndex data structure by indexing the current
     * list items by primary text.
     *
     * @return The primary texts of all the list items sorted by first character.
     */
    MDCListFoundation.prototype.typeaheadInitSortedIndex = function () {
        return initSortedIndex(this.adapter.getListItemCount(), this.adapter.getPrimaryTextAtIndex);
    };
    /**
     * Clears the typeahead buffer.
     */
    MDCListFoundation.prototype.clearTypeaheadBuffer = function () {
        clearBuffer(this.typeaheadState);
    };
    return MDCListFoundation;
}(MDCFoundation));

/* node_modules/@smui/list/dist/List.svelte generated by Svelte v3.46.6 */

// (1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-deprecated-list': true,     'mdc-deprecated-list--non-interactive': nonInteractive,     'mdc-deprecated-list--dense': dense,     'mdc-deprecated-list--textual-list': textualList,     'mdc-deprecated-list--avatar-list': avatarList || selectionDialog,     'mdc-deprecated-list--icon-list': iconList,     'mdc-deprecated-list--image-list': imageList,     'mdc-deprecated-list--thumbnail-list': thumbnailList,     'mdc-deprecated-list--video-list': videoList,     'mdc-deprecated-list--two-line': twoLine,     'smui-list--three-line': threeLine && !twoLine,   })}   {role}   on:keydown={(event) =>     instance &&     instance.handleKeydown(       event,       event.target.classList.contains('mdc-deprecated-list-item'),       getListItemIndex(event.target)     )}   on:focusin={(event) =>     instance && instance.handleFocusIn(getListItemIndex(event.target))}   on:focusout={(event) =>     instance && instance.handleFocusOut(getListItemIndex(event.target))}   on:click={(event) =>     instance &&     instance.handleClick(       getListItemIndex(event.target),       !matches(event.target, 'input[type="checkbox"], input[type="radio"]')     )}   on:SMUIListItem:mount={handleItemMount}   on:SMUIListItem:unmount={handleItemUnmount}   on:SMUI:action={handleAction}   {...$$restProps} >
function create_default_slot$2(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[37].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);

	const block = {
		c: function create() {
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[43],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
						null
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$2.name,
		type: "slot",
		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[forwardEvents, ...use]}   class={classMap({     [className]: true,     'mdc-deprecated-list': true,     'mdc-deprecated-list--non-interactive': nonInteractive,     'mdc-deprecated-list--dense': dense,     'mdc-deprecated-list--textual-list': textualList,     'mdc-deprecated-list--avatar-list': avatarList || selectionDialog,     'mdc-deprecated-list--icon-list': iconList,     'mdc-deprecated-list--image-list': imageList,     'mdc-deprecated-list--thumbnail-list': thumbnailList,     'mdc-deprecated-list--video-list': videoList,     'mdc-deprecated-list--two-line': twoLine,     'smui-list--three-line': threeLine && !twoLine,   })}   {role}   on:keydown={(event) =>     instance &&     instance.handleKeydown(       event,       event.target.classList.contains('mdc-deprecated-list-item'),       getListItemIndex(event.target)     )}   on:focusin={(event) =>     instance && instance.handleFocusIn(getListItemIndex(event.target))}   on:focusout={(event) =>     instance && instance.handleFocusOut(getListItemIndex(event.target))}   on:click={(event) =>     instance &&     instance.handleClick(       getListItemIndex(event.target),       !matches(event.target, 'input[type=\\\"checkbox\\\"], input[type=\\\"radio\\\"]')     )}   on:SMUIListItem:mount={handleItemMount}   on:SMUIListItem:unmount={handleItemUnmount}   on:SMUI:action={handleAction}   {...$$restProps} >",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;

	const switch_instance_spread_levels = [
		{
			use: [/*forwardEvents*/ ctx[17], .../*use*/ ctx[0]]
		},
		{
			class: classMap({
				[/*className*/ ctx[1]]: true,
				'mdc-deprecated-list': true,
				'mdc-deprecated-list--non-interactive': /*nonInteractive*/ ctx[2],
				'mdc-deprecated-list--dense': /*dense*/ ctx[3],
				'mdc-deprecated-list--textual-list': /*textualList*/ ctx[4],
				'mdc-deprecated-list--avatar-list': /*avatarList*/ ctx[5] || /*selectionDialog*/ ctx[18],
				'mdc-deprecated-list--icon-list': /*iconList*/ ctx[6],
				'mdc-deprecated-list--image-list': /*imageList*/ ctx[7],
				'mdc-deprecated-list--thumbnail-list': /*thumbnailList*/ ctx[8],
				'mdc-deprecated-list--video-list': /*videoList*/ ctx[9],
				'mdc-deprecated-list--two-line': /*twoLine*/ ctx[10],
				'smui-list--three-line': /*threeLine*/ ctx[11] && !/*twoLine*/ ctx[10]
			})
		},
		{ role: /*role*/ ctx[15] },
		/*$$restProps*/ ctx[23]
	];

	var switch_value = /*component*/ ctx[12];

	function switch_props(ctx) {
		let switch_instance_props = {
			$$slots: { default: [create_default_slot$2] },
			$$scope: { ctx }
		};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		/*switch_instance_binding*/ ctx[38](switch_instance);
		switch_instance.$on("keydown", /*keydown_handler*/ ctx[39]);
		switch_instance.$on("focusin", /*focusin_handler*/ ctx[40]);
		switch_instance.$on("focusout", /*focusout_handler*/ ctx[41]);
		switch_instance.$on("click", /*click_handler*/ ctx[42]);
		switch_instance.$on("SMUIListItem:mount", /*handleItemMount*/ ctx[19]);
		switch_instance.$on("SMUIListItem:unmount", /*handleItemUnmount*/ ctx[20]);
		switch_instance.$on("SMUI:action", /*handleAction*/ ctx[21]);
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty[0] & /*forwardEvents, use, className, nonInteractive, dense, textualList, avatarList, selectionDialog, iconList, imageList, thumbnailList, videoList, twoLine, threeLine, role, $$restProps*/ 8818687)
			? get_spread_update(switch_instance_spread_levels, [
					dirty[0] & /*forwardEvents, use*/ 131073 && {
						use: [/*forwardEvents*/ ctx[17], .../*use*/ ctx[0]]
					},
					dirty[0] & /*className, nonInteractive, dense, textualList, avatarList, selectionDialog, iconList, imageList, thumbnailList, videoList, twoLine, threeLine*/ 266238 && {
						class: classMap({
							[/*className*/ ctx[1]]: true,
							'mdc-deprecated-list': true,
							'mdc-deprecated-list--non-interactive': /*nonInteractive*/ ctx[2],
							'mdc-deprecated-list--dense': /*dense*/ ctx[3],
							'mdc-deprecated-list--textual-list': /*textualList*/ ctx[4],
							'mdc-deprecated-list--avatar-list': /*avatarList*/ ctx[5] || /*selectionDialog*/ ctx[18],
							'mdc-deprecated-list--icon-list': /*iconList*/ ctx[6],
							'mdc-deprecated-list--image-list': /*imageList*/ ctx[7],
							'mdc-deprecated-list--thumbnail-list': /*thumbnailList*/ ctx[8],
							'mdc-deprecated-list--video-list': /*videoList*/ ctx[9],
							'mdc-deprecated-list--two-line': /*twoLine*/ ctx[10],
							'smui-list--three-line': /*threeLine*/ ctx[11] && !/*twoLine*/ ctx[10]
						})
					},
					dirty[0] & /*role*/ 32768 && { role: /*role*/ ctx[15] },
					dirty[0] & /*$$restProps*/ 8388608 && get_spread_object(/*$$restProps*/ ctx[23])
				])
			: {};

			if (dirty[1] & /*$$scope*/ 4096) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (switch_value !== (switch_value = /*component*/ ctx[12])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					/*switch_instance_binding*/ ctx[38](switch_instance);
					switch_instance.$on("keydown", /*keydown_handler*/ ctx[39]);
					switch_instance.$on("focusin", /*focusin_handler*/ ctx[40]);
					switch_instance.$on("focusout", /*focusout_handler*/ ctx[41]);
					switch_instance.$on("click", /*click_handler*/ ctx[42]);
					switch_instance.$on("SMUIListItem:mount", /*handleItemMount*/ ctx[19]);
					switch_instance.$on("SMUIListItem:unmount", /*handleItemUnmount*/ ctx[20]);
					switch_instance.$on("SMUI:action", /*handleAction*/ ctx[21]);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			/*switch_instance_binding*/ ctx[38](null);
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance_1($$self, $$props, $$invalidate) {
	const omit_props_names = [
		"use","class","nonInteractive","dense","textualList","avatarList","iconList","imageList","thumbnailList","videoList","twoLine","threeLine","vertical","wrapFocus","singleSelection","selectedIndex","radioList","checkList","hasTypeahead","component","layout","setEnabled","getTypeaheadInProgress","getSelectedIndex","getFocusedItemIndex","getElement"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('List', slots, ['default']);
	var _a;
	const { closest, matches } = ponyfill;
	const forwardEvents = forwardEventsBuilder(get_current_component());
	let { use = [] } = $$props;
	let { class: className = '' } = $$props;
	let { nonInteractive = false } = $$props;
	let { dense = false } = $$props;
	let { textualList = false } = $$props;
	let { avatarList = false } = $$props;
	let { iconList = false } = $$props;
	let { imageList = false } = $$props;
	let { thumbnailList = false } = $$props;
	let { videoList = false } = $$props;
	let { twoLine = false } = $$props;
	let { threeLine = false } = $$props;
	let { vertical = true } = $$props;

	let { wrapFocus = (_a = getContext('SMUI:list:wrapFocus')) !== null && _a !== void 0
	? _a
	: false } = $$props;

	let { singleSelection = false } = $$props;
	let { selectedIndex = -1 } = $$props;
	let { radioList = false } = $$props;
	let { checkList = false } = $$props;
	let { hasTypeahead = false } = $$props;
	let element;
	let instance;
	let items = [];
	let role = getContext('SMUI:list:role');
	let nav = getContext('SMUI:list:nav');
	const itemAccessorMap = new WeakMap();
	let selectionDialog = getContext('SMUI:dialog:selection');
	let addLayoutListener = getContext('SMUI:addLayoutListener');
	let removeLayoutListener;
	let { component = nav ? Nav : Ul } = $$props;
	setContext('SMUI:list:nonInteractive', nonInteractive);
	setContext('SMUI:separator:context', 'list');

	if (!role) {
		if (singleSelection) {
			role = 'listbox';
			setContext('SMUI:list:item:role', 'option');
		} else if (radioList) {
			role = 'radiogroup';
			setContext('SMUI:list:item:role', 'radio');
		} else if (checkList) {
			role = 'group';
			setContext('SMUI:list:item:role', 'checkbox');
		} else {
			role = 'list';
			setContext('SMUI:list:item:role', undefined);
		}
	}

	if (addLayoutListener) {
		removeLayoutListener = addLayoutListener(layout);
	}

	onMount(() => {
		$$invalidate(13, instance = new MDCListFoundation({
				addClassForElementIndex,
				focusItemAtIndex,
				getAttributeForElementIndex: (index, name) => {
					var _a, _b;

					return (_b = (_a = getOrderedList()[index]) === null || _a === void 0
					? void 0
					: _a.getAttr(name)) !== null && _b !== void 0
					? _b
					: null;
				},
				getFocusedElementIndex: () => document.activeElement
				? getOrderedList().map(accessor => accessor.element).indexOf(document.activeElement)
				: -1,
				getListItemCount: () => items.length,
				getPrimaryTextAtIndex,
				hasCheckboxAtIndex: index => {
					var _a, _b;

					return (_b = (_a = getOrderedList()[index]) === null || _a === void 0
					? void 0
					: _a.hasCheckbox) !== null && _b !== void 0
					? _b
					: false;
				},
				hasRadioAtIndex: index => {
					var _a, _b;

					return (_b = (_a = getOrderedList()[index]) === null || _a === void 0
					? void 0
					: _a.hasRadio) !== null && _b !== void 0
					? _b
					: false;
				},
				isCheckboxCheckedAtIndex: index => {
					var _a;
					const listItem = getOrderedList()[index];

					return (_a = (listItem === null || listItem === void 0
					? void 0
					: listItem.hasCheckbox) && listItem.checked) !== null && _a !== void 0
					? _a
					: false;
				},
				isFocusInsideList: () => element != null && getElement() !== document.activeElement && getElement().contains(document.activeElement),
				isRootFocused: () => element != null && document.activeElement === getElement(),
				listItemAtIndexHasClass,
				notifyAction: index => {
					$$invalidate(24, selectedIndex = index);

					if (element != null) {
						dispatch(getElement(), 'SMUIList:action', { index }, undefined, true);
					}
				},
				removeClassForElementIndex,
				setAttributeForElementIndex,
				setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
					getOrderedList()[index].checked = isChecked;
				},
				setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
					const listItem = getOrderedList()[listItemIndex];
					const selector = 'button:not(:disabled), a';

					Array.prototype.forEach.call(listItem.element.querySelectorAll(selector), el => {
						el.setAttribute('tabindex', tabIndexValue);
					});
				}
			}));

		const accessor = {
			get element() {
				return getElement();
			},
			get items() {
				return items;
			},
			get typeaheadInProgress() {
				return instance.isTypeaheadInProgress();
			},
			typeaheadMatchItem(nextChar, startingIndex) {
				return instance.typeaheadMatchItem(nextChar, startingIndex, /** skipFocus */
				true);
			},
			getOrderedList,
			focusItemAtIndex,
			addClassForElementIndex,
			removeClassForElementIndex,
			setAttributeForElementIndex,
			removeAttributeForElementIndex,
			getAttributeFromElementIndex,
			getPrimaryTextAtIndex
		};

		dispatch(getElement(), 'SMUIList:mount', accessor);
		instance.init();

		return () => {
			instance.destroy();
		};
	});

	onDestroy(() => {
		if (removeLayoutListener) {
			removeLayoutListener();
		}
	});

	function handleItemMount(event) {
		items.push(event.detail);
		itemAccessorMap.set(event.detail.element, event.detail);

		if (singleSelection && event.detail.selected) {
			$$invalidate(24, selectedIndex = getListItemIndex(event.detail.element));
		}

		event.stopPropagation();
	}

	function handleItemUnmount(event) {
		var _a;

		const idx = (_a = event.detail && items.indexOf(event.detail)) !== null && _a !== void 0
		? _a
		: -1;

		if (idx !== -1) {
			items.splice(idx, 1);
			items = items;
			itemAccessorMap.delete(event.detail.element);
		}

		event.stopPropagation();
	}

	function handleAction(event) {
		if (radioList || checkList) {
			const index = getListItemIndex(event.target);

			if (index !== -1) {
				const item = getOrderedList()[index];

				if (item && (radioList && !item.checked || checkList)) {
					item.checked = !item.checked;
					item.activateRipple();

					window.requestAnimationFrame(() => {
						item.deactivateRipple();
					});
				}
			}
		}
	}

	function getOrderedList() {
		if (element == null) {
			return [];
		}

		return [...getElement().children].map(element => itemAccessorMap.get(element)).filter(accessor => accessor && accessor._smui_list_item_accessor);
	}

	function focusItemAtIndex(index) {
		const accessor = getOrderedList()[index];
		accessor && 'focus' in accessor.element && accessor.element.focus();
	}

	function listItemAtIndexHasClass(index, className) {
		var _a;
		const accessor = getOrderedList()[index];

		return (_a = accessor && accessor.hasClass(className)) !== null && _a !== void 0
		? _a
		: false;
	}

	function addClassForElementIndex(index, className) {
		const accessor = getOrderedList()[index];
		accessor && accessor.addClass(className);
	}

	function removeClassForElementIndex(index, className) {
		const accessor = getOrderedList()[index];
		accessor && accessor.removeClass(className);
	}

	function setAttributeForElementIndex(index, name, value) {
		const accessor = getOrderedList()[index];
		accessor && accessor.addAttr(name, value);
	}

	function removeAttributeForElementIndex(index, name) {
		const accessor = getOrderedList()[index];
		accessor && accessor.removeAttr(name);
	}

	function getAttributeFromElementIndex(index, name) {
		const accessor = getOrderedList()[index];

		if (accessor) {
			return accessor.getAttr(name);
		} else {
			return null;
		}
	}

	function getPrimaryTextAtIndex(index) {
		var _a;
		const accessor = getOrderedList()[index];

		return (_a = accessor && accessor.getPrimaryText()) !== null && _a !== void 0
		? _a
		: '';
	}

	function getListItemIndex(element) {
		const nearestParent = closest(element, '.mdc-deprecated-list-item, .mdc-deprecated-list');

		// Get the index of the element if it is a list item.
		if (nearestParent && matches(nearestParent, '.mdc-deprecated-list-item')) {
			return getOrderedList().map(item => item === null || item === void 0 ? void 0 : item.element).indexOf(nearestParent);
		}

		return -1;
	}

	function layout() {
		return instance.layout();
	}

	function setEnabled(itemIndex, isEnabled) {
		return instance.setEnabled(itemIndex, isEnabled);
	}

	function getTypeaheadInProgress() {
		return instance.isTypeaheadInProgress();
	}

	function getSelectedIndex() {
		return instance.getSelectedIndex();
	}

	function getFocusedItemIndex() {
		return instance.getFocusedItemIndex();
	}

	function getElement() {
		return element.getElement();
	}

	function switch_instance_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(14, element);
		});
	}

	const keydown_handler = event => instance && instance.handleKeydown(event, event.target.classList.contains('mdc-deprecated-list-item'), getListItemIndex(event.target));
	const focusin_handler = event => instance && instance.handleFocusIn(getListItemIndex(event.target));
	const focusout_handler = event => instance && instance.handleFocusOut(getListItemIndex(event.target));
	const click_handler = event => instance && instance.handleClick(getListItemIndex(event.target), !matches(event.target, 'input[type="checkbox"], input[type="radio"]'));

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(23, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(0, use = $$new_props.use);
		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
		if ('nonInteractive' in $$new_props) $$invalidate(2, nonInteractive = $$new_props.nonInteractive);
		if ('dense' in $$new_props) $$invalidate(3, dense = $$new_props.dense);
		if ('textualList' in $$new_props) $$invalidate(4, textualList = $$new_props.textualList);
		if ('avatarList' in $$new_props) $$invalidate(5, avatarList = $$new_props.avatarList);
		if ('iconList' in $$new_props) $$invalidate(6, iconList = $$new_props.iconList);
		if ('imageList' in $$new_props) $$invalidate(7, imageList = $$new_props.imageList);
		if ('thumbnailList' in $$new_props) $$invalidate(8, thumbnailList = $$new_props.thumbnailList);
		if ('videoList' in $$new_props) $$invalidate(9, videoList = $$new_props.videoList);
		if ('twoLine' in $$new_props) $$invalidate(10, twoLine = $$new_props.twoLine);
		if ('threeLine' in $$new_props) $$invalidate(11, threeLine = $$new_props.threeLine);
		if ('vertical' in $$new_props) $$invalidate(25, vertical = $$new_props.vertical);
		if ('wrapFocus' in $$new_props) $$invalidate(26, wrapFocus = $$new_props.wrapFocus);
		if ('singleSelection' in $$new_props) $$invalidate(27, singleSelection = $$new_props.singleSelection);
		if ('selectedIndex' in $$new_props) $$invalidate(24, selectedIndex = $$new_props.selectedIndex);
		if ('radioList' in $$new_props) $$invalidate(28, radioList = $$new_props.radioList);
		if ('checkList' in $$new_props) $$invalidate(29, checkList = $$new_props.checkList);
		if ('hasTypeahead' in $$new_props) $$invalidate(30, hasTypeahead = $$new_props.hasTypeahead);
		if ('component' in $$new_props) $$invalidate(12, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(43, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		_a,
		MDCListFoundation,
		ponyfill,
		onMount,
		onDestroy,
		getContext,
		setContext,
		get_current_component,
		forwardEventsBuilder,
		classMap,
		dispatch,
		Ul,
		Nav,
		closest,
		matches,
		forwardEvents,
		use,
		className,
		nonInteractive,
		dense,
		textualList,
		avatarList,
		iconList,
		imageList,
		thumbnailList,
		videoList,
		twoLine,
		threeLine,
		vertical,
		wrapFocus,
		singleSelection,
		selectedIndex,
		radioList,
		checkList,
		hasTypeahead,
		element,
		instance,
		items,
		role,
		nav,
		itemAccessorMap,
		selectionDialog,
		addLayoutListener,
		removeLayoutListener,
		component,
		handleItemMount,
		handleItemUnmount,
		handleAction,
		getOrderedList,
		focusItemAtIndex,
		listItemAtIndexHasClass,
		addClassForElementIndex,
		removeClassForElementIndex,
		setAttributeForElementIndex,
		removeAttributeForElementIndex,
		getAttributeFromElementIndex,
		getPrimaryTextAtIndex,
		getListItemIndex,
		layout,
		setEnabled,
		getTypeaheadInProgress,
		getSelectedIndex,
		getFocusedItemIndex,
		getElement
	});

	$$self.$inject_state = $$new_props => {
		if ('_a' in $$props) _a = $$new_props._a;
		if ('use' in $$props) $$invalidate(0, use = $$new_props.use);
		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
		if ('nonInteractive' in $$props) $$invalidate(2, nonInteractive = $$new_props.nonInteractive);
		if ('dense' in $$props) $$invalidate(3, dense = $$new_props.dense);
		if ('textualList' in $$props) $$invalidate(4, textualList = $$new_props.textualList);
		if ('avatarList' in $$props) $$invalidate(5, avatarList = $$new_props.avatarList);
		if ('iconList' in $$props) $$invalidate(6, iconList = $$new_props.iconList);
		if ('imageList' in $$props) $$invalidate(7, imageList = $$new_props.imageList);
		if ('thumbnailList' in $$props) $$invalidate(8, thumbnailList = $$new_props.thumbnailList);
		if ('videoList' in $$props) $$invalidate(9, videoList = $$new_props.videoList);
		if ('twoLine' in $$props) $$invalidate(10, twoLine = $$new_props.twoLine);
		if ('threeLine' in $$props) $$invalidate(11, threeLine = $$new_props.threeLine);
		if ('vertical' in $$props) $$invalidate(25, vertical = $$new_props.vertical);
		if ('wrapFocus' in $$props) $$invalidate(26, wrapFocus = $$new_props.wrapFocus);
		if ('singleSelection' in $$props) $$invalidate(27, singleSelection = $$new_props.singleSelection);
		if ('selectedIndex' in $$props) $$invalidate(24, selectedIndex = $$new_props.selectedIndex);
		if ('radioList' in $$props) $$invalidate(28, radioList = $$new_props.radioList);
		if ('checkList' in $$props) $$invalidate(29, checkList = $$new_props.checkList);
		if ('hasTypeahead' in $$props) $$invalidate(30, hasTypeahead = $$new_props.hasTypeahead);
		if ('element' in $$props) $$invalidate(14, element = $$new_props.element);
		if ('instance' in $$props) $$invalidate(13, instance = $$new_props.instance);
		if ('items' in $$props) items = $$new_props.items;
		if ('role' in $$props) $$invalidate(15, role = $$new_props.role);
		if ('nav' in $$props) nav = $$new_props.nav;
		if ('selectionDialog' in $$props) $$invalidate(18, selectionDialog = $$new_props.selectionDialog);
		if ('addLayoutListener' in $$props) addLayoutListener = $$new_props.addLayoutListener;
		if ('removeLayoutListener' in $$props) removeLayoutListener = $$new_props.removeLayoutListener;
		if ('component' in $$props) $$invalidate(12, component = $$new_props.component);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*instance, vertical*/ 33562624) {
			if (instance) {
				instance.setVerticalOrientation(vertical);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, wrapFocus*/ 67117056) {
			if (instance) {
				instance.setWrapFocus(wrapFocus);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, hasTypeahead*/ 1073750016) {
			if (instance) {
				instance.setHasTypeahead(hasTypeahead);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, singleSelection*/ 134225920) {
			if (instance) {
				instance.setSingleSelection(singleSelection);
			}
		}

		if ($$self.$$.dirty[0] & /*instance, singleSelection, selectedIndex*/ 151003136) {
			if (instance && singleSelection && getSelectedIndex() !== selectedIndex) {
				instance.setSelectedIndex(selectedIndex);
			}
		}
	};

	return [
		use,
		className,
		nonInteractive,
		dense,
		textualList,
		avatarList,
		iconList,
		imageList,
		thumbnailList,
		videoList,
		twoLine,
		threeLine,
		component,
		instance,
		element,
		role,
		matches,
		forwardEvents,
		selectionDialog,
		handleItemMount,
		handleItemUnmount,
		handleAction,
		getListItemIndex,
		$$restProps,
		selectedIndex,
		vertical,
		wrapFocus,
		singleSelection,
		radioList,
		checkList,
		hasTypeahead,
		layout,
		setEnabled,
		getTypeaheadInProgress,
		getSelectedIndex,
		getFocusedItemIndex,
		getElement,
		slots,
		switch_instance_binding,
		keydown_handler,
		focusin_handler,
		focusout_handler,
		click_handler,
		$$scope
	];
}

class List extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance_1,
			create_fragment$2,
			safe_not_equal,
			{
				use: 0,
				class: 1,
				nonInteractive: 2,
				dense: 3,
				textualList: 4,
				avatarList: 5,
				iconList: 6,
				imageList: 7,
				thumbnailList: 8,
				videoList: 9,
				twoLine: 10,
				threeLine: 11,
				vertical: 25,
				wrapFocus: 26,
				singleSelection: 27,
				selectedIndex: 24,
				radioList: 28,
				checkList: 29,
				hasTypeahead: 30,
				component: 12,
				layout: 31,
				setEnabled: 32,
				getTypeaheadInProgress: 33,
				getSelectedIndex: 34,
				getFocusedItemIndex: 35,
				getElement: 36
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "List",
			options,
			id: create_fragment$2.name
		});
	}

	get use() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get nonInteractive() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set nonInteractive(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get dense() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set dense(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get textualList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set textualList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get avatarList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set avatarList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get iconList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set iconList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get imageList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set imageList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get thumbnailList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set thumbnailList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get videoList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set videoList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get twoLine() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set twoLine(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get threeLine() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set threeLine(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get vertical() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set vertical(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get wrapFocus() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set wrapFocus(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get singleSelection() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set singleSelection(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selectedIndex() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selectedIndex(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get radioList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set radioList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkList() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkList(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hasTypeahead() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hasTypeahead(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get layout() {
		return this.$$.ctx[31];
	}

	set layout(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setEnabled() {
		return this.$$.ctx[32];
	}

	set setEnabled(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getTypeaheadInProgress() {
		return this.$$.ctx[33];
	}

	set getTypeaheadInProgress(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getSelectedIndex() {
		return this.$$.ctx[34];
	}

	set getSelectedIndex(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getFocusedItemIndex() {
		return this.$$.ctx[35];
	}

	set getFocusedItemIndex(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[36];
	}

	set getElement(value) {
		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

const { applyPassive } = events;
const { matches } = ponyfill;
function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve(), } = {}) {
    let instance;
    let addLayoutListener = getContext('SMUI:addLayoutListener');
    let removeLayoutListener;
    let oldActive = active;
    let oldEventTarget = eventTarget;
    let oldActiveTarget = activeTarget;
    function handleProps() {
        if (surface) {
            addClass('mdc-ripple-surface');
            if (color === 'primary') {
                addClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            else if (color === 'secondary') {
                removeClass('smui-ripple-surface--primary');
                addClass('smui-ripple-surface--secondary');
            }
            else {
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
        }
        else {
            removeClass('mdc-ripple-surface');
            removeClass('smui-ripple-surface--primary');
            removeClass('smui-ripple-surface--secondary');
        }
        // Handle activation first.
        if (instance && oldActive !== active) {
            oldActive = active;
            if (active) {
                instance.activate();
            }
            else if (active === false) {
                instance.deactivate();
            }
        }
        // Then create/destroy an instance.
        if (ripple && !instance) {
            instance = new MDCRippleFoundation({
                addClass,
                browserSupportsCssVars: () => supportsCssVariables(window),
                computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
                containsEventTarget: (target) => node.contains(target),
                deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
                deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
                deregisterResizeHandler: (handler) => window.removeEventListener('resize', handler),
                getWindowPageOffset: () => ({
                    x: window.pageXOffset,
                    y: window.pageYOffset,
                }),
                isSurfaceActive: () => active == null ? matches(activeTarget || node, ':active') : active,
                isSurfaceDisabled: () => !!disabled,
                isUnbounded: () => !!unbounded,
                registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
                registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
                registerResizeHandler: (handler) => window.addEventListener('resize', handler),
                removeClass,
                updateCssVariable: addStyle,
            });
            initPromise.then(() => {
                if (instance) {
                    instance.init();
                    instance.setUnbounded(unbounded);
                }
            });
        }
        else if (instance && !ripple) {
            initPromise.then(() => {
                if (instance) {
                    instance.destroy();
                    instance = undefined;
                }
            });
        }
        // Now handle event/active targets
        if (instance &&
            (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
            oldEventTarget = eventTarget;
            oldActiveTarget = activeTarget;
            instance.destroy();
            requestAnimationFrame(() => {
                if (instance) {
                    instance.init();
                    instance.setUnbounded(unbounded);
                }
            });
        }
        if (!ripple && unbounded) {
            addClass('mdc-ripple-upgraded--unbounded');
        }
    }
    handleProps();
    if (addLayoutListener) {
        removeLayoutListener = addLayoutListener(layout);
    }
    function layout() {
        if (instance) {
            instance.layout();
        }
    }
    return {
        update(props) {
            ({
                ripple,
                surface,
                unbounded,
                disabled,
                color,
                active,
                rippleElement,
                eventTarget,
                activeTarget,
                addClass,
                removeClass,
                addStyle,
                initPromise,
            } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: undefined, active: undefined, rippleElement: undefined, eventTarget: undefined, activeTarget: undefined, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
            handleProps();
        },
        destroy() {
            if (instance) {
                instance.destroy();
                instance = undefined;
                removeClass('mdc-ripple-surface');
                removeClass('smui-ripple-surface--primary');
                removeClass('smui-ripple-surface--secondary');
            }
            if (removeLayoutListener) {
                removeLayoutListener();
            }
        },
    };
}

/* node_modules/@smui/list/dist/Item.svelte generated by Svelte v3.46.6 */
const file$1 = "node_modules/@smui/list/dist/Item.svelte";

// (57:3) {#if ripple}
function create_if_block$1(ctx) {
	let span;

	const block = {
		c: function create() {
			span = element("span");
			attr_dev(span, "class", "mdc-deprecated-list-item__ripple");
			add_location(span, file$1, 56, 15, 1701);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(57:3) {#if ripple}",
		ctx
	});

	return block;
}

// (1:0) <svelte:component   this={component}   bind:this={element}   use={[     ...(nonInteractive       ? []       : [           [             Ripple,             {               ripple: !input,               unbounded: false,               color:                 (activated || selected) && color == null ? 'primary' : color,               disabled,               addClass,               removeClass,               addStyle,             },           ],         ]),     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-deprecated-list-item': true,     'mdc-deprecated-list-item--activated': activated,     'mdc-deprecated-list-item--selected': selected,     'mdc-deprecated-list-item--disabled': disabled,     'mdc-menu-item--selected': !nav && role === 'menuitem' && selected,     'smui-menu-item--non-interactive': nonInteractive,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...nav && activated ? { 'aria-current': 'page' } : {}}   {...!nav ? { role } : {}}   {...!nav && role === 'option'     ? { 'aria-selected': selected ? 'true' : 'false' }     : {}}   {...!nav && (role === 'radio' || role === 'checkbox')     ? { 'aria-checked': input && input.checked ? 'true' : 'false' }     : {}}   {...!nav ? { 'aria-disabled': disabled ? 'true' : 'false' } : {}}   data-menu-item-skip-restore-focus={skipRestoreFocus || undefined}   {tabindex}   on:click={action}   on:keydown={handleKeydown}   on:SMUIGenericInput:mount={handleInputMount}   on:SMUIGenericInput:unmount={() => (input = undefined)}   {href}   {...internalAttrs}   {...$$restProps}   >
function create_default_slot$1(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*ripple*/ ctx[7] && create_if_block$1(ctx);
	const default_slot_template = /*#slots*/ ctx[32].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[35], null);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
			if (default_slot) default_slot.c();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);

			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*ripple*/ ctx[7]) {
				if (if_block) ; else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (default_slot) {
				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 16)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[35],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[35])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[35], dirty, null),
						null
					);
				}
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
			if (default_slot) default_slot.d(detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot$1.name,
		type: "slot",
		source: "(1:0) <svelte:component   this={component}   bind:this={element}   use={[     ...(nonInteractive       ? []       : [           [             Ripple,             {               ripple: !input,               unbounded: false,               color:                 (activated || selected) && color == null ? 'primary' : color,               disabled,               addClass,               removeClass,               addStyle,             },           ],         ]),     forwardEvents,     ...use,   ]}   class={classMap({     [className]: true,     'mdc-deprecated-list-item': true,     'mdc-deprecated-list-item--activated': activated,     'mdc-deprecated-list-item--selected': selected,     'mdc-deprecated-list-item--disabled': disabled,     'mdc-menu-item--selected': !nav && role === 'menuitem' && selected,     'smui-menu-item--non-interactive': nonInteractive,     ...internalClasses,   })}   style={Object.entries(internalStyles)     .map(([name, value]) => `${name}: ${value};`)     .concat([style])     .join(' ')}   {...nav && activated ? { 'aria-current': 'page' } : {}}   {...!nav ? { role } : {}}   {...!nav && role === 'option'     ? { 'aria-selected': selected ? 'true' : 'false' }     : {}}   {...!nav && (role === 'radio' || role === 'checkbox')     ? { 'aria-checked': input && input.checked ? 'true' : 'false' }     : {}}   {...!nav ? { 'aria-disabled': disabled ? 'true' : 'false' } : {}}   data-menu-item-skip-restore-focus={skipRestoreFocus || undefined}   {tabindex}   on:click={action}   on:keydown={handleKeydown}   on:SMUIGenericInput:mount={handleInputMount}   on:SMUIGenericInput:unmount={() => (input = undefined)}   {href}   {...internalAttrs}   {...$$restProps}   >",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;

	const switch_instance_spread_levels = [
		{
			use: [
				.../*nonInteractive*/ ctx[6]
				? []
				: [
						[
							Ripple,
							{
								ripple: !/*input*/ ctx[14],
								unbounded: false,
								color: (/*activated*/ ctx[1] || /*selected*/ ctx[0]) && /*color*/ ctx[5] == null
								? 'primary'
								: /*color*/ ctx[5],
								disabled: /*disabled*/ ctx[9],
								addClass: /*addClass*/ ctx[22],
								removeClass: /*removeClass*/ ctx[23],
								addStyle: /*addStyle*/ ctx[24]
							}
						]
					],
				/*forwardEvents*/ ctx[20],
				.../*use*/ ctx[2]
			]
		},
		{
			class: classMap({
				[/*className*/ ctx[3]]: true,
				'mdc-deprecated-list-item': true,
				'mdc-deprecated-list-item--activated': /*activated*/ ctx[1],
				'mdc-deprecated-list-item--selected': /*selected*/ ctx[0],
				'mdc-deprecated-list-item--disabled': /*disabled*/ ctx[9],
				'mdc-menu-item--selected': !/*nav*/ ctx[21] && /*role*/ ctx[8] === 'menuitem' && /*selected*/ ctx[0],
				'smui-menu-item--non-interactive': /*nonInteractive*/ ctx[6],
				.../*internalClasses*/ ctx[16]
			})
		},
		{
			style: Object.entries(/*internalStyles*/ ctx[17]).map(func).concat([/*style*/ ctx[4]]).join(' ')
		},
		/*nav*/ ctx[21] && /*activated*/ ctx[1]
		? { 'aria-current': 'page' }
		: {},
		!/*nav*/ ctx[21] ? { role: /*role*/ ctx[8] } : {},
		!/*nav*/ ctx[21] && /*role*/ ctx[8] === 'option'
		? {
				'aria-selected': /*selected*/ ctx[0] ? 'true' : 'false'
			}
		: {},
		!/*nav*/ ctx[21] && (/*role*/ ctx[8] === 'radio' || /*role*/ ctx[8] === 'checkbox')
		? {
				'aria-checked': /*input*/ ctx[14] && /*input*/ ctx[14].checked
				? 'true'
				: 'false'
			}
		: {},
		!/*nav*/ ctx[21]
		? {
				'aria-disabled': /*disabled*/ ctx[9] ? 'true' : 'false'
			}
		: {},
		{
			"data-menu-item-skip-restore-focus": /*skipRestoreFocus*/ ctx[10] || undefined
		},
		{ tabindex: /*tabindex*/ ctx[19] },
		{ href: /*href*/ ctx[11] },
		/*internalAttrs*/ ctx[18],
		/*$$restProps*/ ctx[27]
	];

	var switch_value = /*component*/ ctx[12];

	function switch_props(ctx) {
		let switch_instance_props = {
			$$slots: { default: [create_default_slot$1] },
			$$scope: { ctx }
		};

		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
		}

		return {
			props: switch_instance_props,
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
		/*switch_instance_binding*/ ctx[33](switch_instance);
		switch_instance.$on("click", /*action*/ ctx[13]);
		switch_instance.$on("keydown", /*handleKeydown*/ ctx[25]);
		switch_instance.$on("SMUIGenericInput:mount", /*handleInputMount*/ ctx[26]);
		switch_instance.$on("SMUIGenericInput:unmount", /*SMUIGenericInput_unmount_handler*/ ctx[34]);
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = (dirty[0] & /*nonInteractive, input, activated, selected, color, disabled, addClass, removeClass, addStyle, forwardEvents, use, className, nav, role, internalClasses, internalStyles, style, skipRestoreFocus, tabindex, href, internalAttrs, $$restProps*/ 167726975)
			? get_spread_update(switch_instance_spread_levels, [
					dirty[0] & /*nonInteractive, input, activated, selected, color, disabled, addClass, removeClass, addStyle, forwardEvents, use*/ 30425703 && {
						use: [
							.../*nonInteractive*/ ctx[6]
							? []
							: [
									[
										Ripple,
										{
											ripple: !/*input*/ ctx[14],
											unbounded: false,
											color: (/*activated*/ ctx[1] || /*selected*/ ctx[0]) && /*color*/ ctx[5] == null
											? 'primary'
											: /*color*/ ctx[5],
											disabled: /*disabled*/ ctx[9],
											addClass: /*addClass*/ ctx[22],
											removeClass: /*removeClass*/ ctx[23],
											addStyle: /*addStyle*/ ctx[24]
										}
									]
								],
							/*forwardEvents*/ ctx[20],
							.../*use*/ ctx[2]
						]
					},
					dirty[0] & /*className, activated, selected, disabled, nav, role, nonInteractive, internalClasses*/ 2163531 && {
						class: classMap({
							[/*className*/ ctx[3]]: true,
							'mdc-deprecated-list-item': true,
							'mdc-deprecated-list-item--activated': /*activated*/ ctx[1],
							'mdc-deprecated-list-item--selected': /*selected*/ ctx[0],
							'mdc-deprecated-list-item--disabled': /*disabled*/ ctx[9],
							'mdc-menu-item--selected': !/*nav*/ ctx[21] && /*role*/ ctx[8] === 'menuitem' && /*selected*/ ctx[0],
							'smui-menu-item--non-interactive': /*nonInteractive*/ ctx[6],
							.../*internalClasses*/ ctx[16]
						})
					},
					dirty[0] & /*internalStyles, style*/ 131088 && {
						style: Object.entries(/*internalStyles*/ ctx[17]).map(func).concat([/*style*/ ctx[4]]).join(' ')
					},
					dirty[0] & /*nav, activated*/ 2097154 && get_spread_object(/*nav*/ ctx[21] && /*activated*/ ctx[1]
					? { 'aria-current': 'page' }
					: {}),
					dirty[0] & /*nav, role*/ 2097408 && get_spread_object(!/*nav*/ ctx[21] ? { role: /*role*/ ctx[8] } : {}),
					dirty[0] & /*nav, role, selected*/ 2097409 && get_spread_object(!/*nav*/ ctx[21] && /*role*/ ctx[8] === 'option'
					? {
							'aria-selected': /*selected*/ ctx[0] ? 'true' : 'false'
						}
					: {}),
					dirty[0] & /*nav, role, input*/ 2113792 && get_spread_object(!/*nav*/ ctx[21] && (/*role*/ ctx[8] === 'radio' || /*role*/ ctx[8] === 'checkbox')
					? {
							'aria-checked': /*input*/ ctx[14] && /*input*/ ctx[14].checked
							? 'true'
							: 'false'
						}
					: {}),
					dirty[0] & /*nav, disabled*/ 2097664 && get_spread_object(!/*nav*/ ctx[21]
					? {
							'aria-disabled': /*disabled*/ ctx[9] ? 'true' : 'false'
						}
					: {}),
					dirty[0] & /*skipRestoreFocus*/ 1024 && {
						"data-menu-item-skip-restore-focus": /*skipRestoreFocus*/ ctx[10] || undefined
					},
					dirty[0] & /*tabindex*/ 524288 && { tabindex: /*tabindex*/ ctx[19] },
					dirty[0] & /*href*/ 2048 && { href: /*href*/ ctx[11] },
					dirty[0] & /*internalAttrs*/ 262144 && get_spread_object(/*internalAttrs*/ ctx[18]),
					dirty[0] & /*$$restProps*/ 134217728 && get_spread_object(/*$$restProps*/ ctx[27])
				])
			: {};

			if (dirty[0] & /*ripple*/ 128 | dirty[1] & /*$$scope*/ 16) {
				switch_instance_changes.$$scope = { dirty, ctx };
			}

			if (switch_value !== (switch_value = /*component*/ ctx[12])) {
				if (switch_instance) {
					group_outros();
					const old_component = switch_instance;

					transition_out(old_component.$$.fragment, 1, 0, () => {
						destroy_component(old_component, 1);
					});

					check_outros();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));
					/*switch_instance_binding*/ ctx[33](switch_instance);
					switch_instance.$on("click", /*action*/ ctx[13]);
					switch_instance.$on("keydown", /*handleKeydown*/ ctx[25]);
					switch_instance.$on("SMUIGenericInput:mount", /*handleInputMount*/ ctx[26]);
					switch_instance.$on("SMUIGenericInput:unmount", /*SMUIGenericInput_unmount_handler*/ ctx[34]);
					create_component(switch_instance.$$.fragment);
					transition_in(switch_instance.$$.fragment, 1);
					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			} else if (switch_value) {
				switch_instance.$set(switch_instance_changes);
			}
		},
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			/*switch_instance_binding*/ ctx[33](null);
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}
let counter = 0;
const func = ([name, value]) => `${name}: ${value};`;

function instance$1($$self, $$props, $$invalidate) {
	let tabindex;

	const omit_props_names = [
		"use","class","style","color","nonInteractive","ripple","activated","role","selected","disabled","skipRestoreFocus","tabindex","inputId","href","component","action","getPrimaryText","getElement"
	];

	let $$restProps = compute_rest_props($$props, omit_props_names);
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Item', slots, ['default']);
	var _a;
	const forwardEvents = forwardEventsBuilder(get_current_component());

	let uninitializedValue = () => {
		
	};

	function isUninitializedValue(value) {
		return value === uninitializedValue;
	}

	let { use = [] } = $$props;
	let { class: className = '' } = $$props;
	let { style = '' } = $$props;
	let { color = undefined } = $$props;

	let { nonInteractive = (_a = getContext('SMUI:list:nonInteractive')) !== null && _a !== void 0
	? _a
	: false } = $$props;

	setContext('SMUI:list:nonInteractive', undefined);
	let { ripple = !nonInteractive } = $$props;
	let { activated = false } = $$props;
	let { role = getContext('SMUI:list:item:role') } = $$props;
	setContext('SMUI:list:item:role', undefined);
	let { selected = false } = $$props;
	let { disabled = false } = $$props;
	let { skipRestoreFocus = false } = $$props;
	let { tabindex: tabindexProp = uninitializedValue } = $$props;
	let { inputId = 'SMUI-form-field-list-' + counter++ } = $$props;
	let { href = undefined } = $$props;
	let element;
	let internalClasses = {};
	let internalStyles = {};
	let internalAttrs = {};
	let input;
	let addTabindexIfNoItemsSelectedRaf;
	let nav = getContext('SMUI:list:item:nav');
	let { component = nav ? href ? A : Span : Li } = $$props;
	setContext('SMUI:generic:input:props', { id: inputId });

	// Reset separator context, because we aren't directly under a list anymore.
	setContext('SMUI:separator:context', undefined);

	onMount(() => {
		// Tabindex needs to be '0' if this is the first non-disabled list item, and
		// no other item is selected.
		if (!selected && !nonInteractive) {
			let first = true;
			let el = element;

			while (el.previousSibling) {
				el = el.previousSibling;

				if (el.nodeType === 1 && el.classList.contains('mdc-deprecated-list-item') && !el.classList.contains('mdc-deprecated-list-item--disabled')) {
					first = false;
					break;
				}
			}

			if (first) {
				// This is first, so now set up a check that no other items are
				// selected.
				addTabindexIfNoItemsSelectedRaf = window.requestAnimationFrame(addTabindexIfNoItemsSelected);
			}
		}

		const accessor = {
			_smui_list_item_accessor: true,
			get element() {
				return getElement();
			},
			get selected() {
				return selected;
			},
			set selected(value) {
				$$invalidate(0, selected = value);
			},
			hasClass,
			addClass,
			removeClass,
			getAttr,
			addAttr,
			removeAttr,
			getPrimaryText,
			// For inputs within item.
			get checked() {
				var _a;

				return (_a = input && input.checked) !== null && _a !== void 0
				? _a
				: false;
			},
			set checked(value) {
				if (input) {
					$$invalidate(14, input.checked = !!value, input);
				}
			},
			get hasCheckbox() {
				return !!(input && '_smui_checkbox_accessor' in input);
			},
			get hasRadio() {
				return !!(input && '_smui_radio_accessor' in input);
			},
			activateRipple() {
				if (input) {
					input.activateRipple();
				}
			},
			deactivateRipple() {
				if (input) {
					input.deactivateRipple();
				}
			},
			// For select options.
			getValue() {
				return $$restProps.value;
			},
			// For autocomplete
			action,
			get tabindex() {
				return tabindex;
			},
			set tabindex(value) {
				$$invalidate(28, tabindexProp = value);
			},
			get disabled() {
				return disabled;
			},
			get activated() {
				return activated;
			},
			set activated(value) {
				$$invalidate(1, activated = value);
			}
		};

		dispatch(getElement(), 'SMUIListItem:mount', accessor);

		return () => {
			dispatch(getElement(), 'SMUIListItem:unmount', accessor);
		};
	});

	onDestroy(() => {
		if (addTabindexIfNoItemsSelectedRaf) {
			window.cancelAnimationFrame(addTabindexIfNoItemsSelectedRaf);
		}
	});

	function hasClass(className) {
		return className in internalClasses
		? internalClasses[className]
		: getElement().classList.contains(className);
	}

	function addClass(className) {
		if (!internalClasses[className]) {
			$$invalidate(16, internalClasses[className] = true, internalClasses);
		}
	}

	function removeClass(className) {
		if (!(className in internalClasses) || internalClasses[className]) {
			$$invalidate(16, internalClasses[className] = false, internalClasses);
		}
	}

	function addStyle(name, value) {
		if (internalStyles[name] != value) {
			if (value === '' || value == null) {
				delete internalStyles[name];
				$$invalidate(17, internalStyles);
			} else {
				$$invalidate(17, internalStyles[name] = value, internalStyles);
			}
		}
	}

	function getAttr(name) {
		var _a;

		return name in internalAttrs
		? (_a = internalAttrs[name]) !== null && _a !== void 0
			? _a
			: null
		: getElement().getAttribute(name);
	}

	function addAttr(name, value) {
		if (internalAttrs[name] !== value) {
			$$invalidate(18, internalAttrs[name] = value, internalAttrs);
		}
	}

	function removeAttr(name) {
		if (!(name in internalAttrs) || internalAttrs[name] != null) {
			$$invalidate(18, internalAttrs[name] = undefined, internalAttrs);
		}
	}

	function addTabindexIfNoItemsSelected() {
		// Look through next siblings to see if none of them are selected.
		let noneSelected = true;

		let el = element.getElement();

		while (el.nextElementSibling) {
			el = el.nextElementSibling;

			if (el.nodeType === 1 && el.classList.contains('mdc-deprecated-list-item')) {
				const tabindexAttr = el.attributes.getNamedItem('tabindex');

				if (tabindexAttr && tabindexAttr.value === '0') {
					noneSelected = false;
					break;
				}
			}
		}

		if (noneSelected) {
			// This is the first element, and no other element is selected, so the
			// tabindex should be '0'.
			$$invalidate(19, tabindex = 0);
		}
	}

	function handleKeydown(e) {
		const isEnter = e.key === 'Enter';
		const isSpace = e.key === 'Space';

		if (isEnter || isSpace) {
			action(e);
		}
	}

	function handleInputMount(e) {
		if ('_smui_checkbox_accessor' in e.detail || '_smui_radio_accessor' in e.detail) {
			$$invalidate(14, input = e.detail);
		}
	}

	function action(e) {
		if (!disabled) {
			dispatch(getElement(), 'SMUI:action', e);
		}
	}

	function getPrimaryText() {
		var _a, _b, _c;
		const element = getElement();
		const primaryText = element.querySelector('.mdc-deprecated-list-item__primary-text');

		if (primaryText) {
			return (_a = primaryText.textContent) !== null && _a !== void 0
			? _a
			: '';
		}

		const text = element.querySelector('.mdc-deprecated-list-item__text');

		if (text) {
			return (_b = text.textContent) !== null && _b !== void 0
			? _b
			: '';
		}

		return (_c = element.textContent) !== null && _c !== void 0
		? _c
		: '';
	}

	function getElement() {
		return element.getElement();
	}

	function switch_instance_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			element = $$value;
			$$invalidate(15, element);
		});
	}

	const SMUIGenericInput_unmount_handler = () => $$invalidate(14, input = undefined);

	$$self.$$set = $$new_props => {
		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
		$$invalidate(27, $$restProps = compute_rest_props($$props, omit_props_names));
		if ('use' in $$new_props) $$invalidate(2, use = $$new_props.use);
		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
		if ('color' in $$new_props) $$invalidate(5, color = $$new_props.color);
		if ('nonInteractive' in $$new_props) $$invalidate(6, nonInteractive = $$new_props.nonInteractive);
		if ('ripple' in $$new_props) $$invalidate(7, ripple = $$new_props.ripple);
		if ('activated' in $$new_props) $$invalidate(1, activated = $$new_props.activated);
		if ('role' in $$new_props) $$invalidate(8, role = $$new_props.role);
		if ('selected' in $$new_props) $$invalidate(0, selected = $$new_props.selected);
		if ('disabled' in $$new_props) $$invalidate(9, disabled = $$new_props.disabled);
		if ('skipRestoreFocus' in $$new_props) $$invalidate(10, skipRestoreFocus = $$new_props.skipRestoreFocus);
		if ('tabindex' in $$new_props) $$invalidate(28, tabindexProp = $$new_props.tabindex);
		if ('inputId' in $$new_props) $$invalidate(29, inputId = $$new_props.inputId);
		if ('href' in $$new_props) $$invalidate(11, href = $$new_props.href);
		if ('component' in $$new_props) $$invalidate(12, component = $$new_props.component);
		if ('$$scope' in $$new_props) $$invalidate(35, $$scope = $$new_props.$$scope);
	};

	$$self.$capture_state = () => ({
		counter,
		_a,
		onMount,
		onDestroy,
		getContext,
		setContext,
		get_current_component,
		forwardEventsBuilder,
		classMap,
		dispatch,
		Ripple,
		A,
		Span,
		Li,
		forwardEvents,
		uninitializedValue,
		isUninitializedValue,
		use,
		className,
		style,
		color,
		nonInteractive,
		ripple,
		activated,
		role,
		selected,
		disabled,
		skipRestoreFocus,
		tabindexProp,
		inputId,
		href,
		element,
		internalClasses,
		internalStyles,
		internalAttrs,
		input,
		addTabindexIfNoItemsSelectedRaf,
		nav,
		component,
		hasClass,
		addClass,
		removeClass,
		addStyle,
		getAttr,
		addAttr,
		removeAttr,
		addTabindexIfNoItemsSelected,
		handleKeydown,
		handleInputMount,
		action,
		getPrimaryText,
		getElement,
		tabindex
	});

	$$self.$inject_state = $$new_props => {
		if ('_a' in $$props) _a = $$new_props._a;
		if ('uninitializedValue' in $$props) uninitializedValue = $$new_props.uninitializedValue;
		if ('use' in $$props) $$invalidate(2, use = $$new_props.use);
		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
		if ('color' in $$props) $$invalidate(5, color = $$new_props.color);
		if ('nonInteractive' in $$props) $$invalidate(6, nonInteractive = $$new_props.nonInteractive);
		if ('ripple' in $$props) $$invalidate(7, ripple = $$new_props.ripple);
		if ('activated' in $$props) $$invalidate(1, activated = $$new_props.activated);
		if ('role' in $$props) $$invalidate(8, role = $$new_props.role);
		if ('selected' in $$props) $$invalidate(0, selected = $$new_props.selected);
		if ('disabled' in $$props) $$invalidate(9, disabled = $$new_props.disabled);
		if ('skipRestoreFocus' in $$props) $$invalidate(10, skipRestoreFocus = $$new_props.skipRestoreFocus);
		if ('tabindexProp' in $$props) $$invalidate(28, tabindexProp = $$new_props.tabindexProp);
		if ('inputId' in $$props) $$invalidate(29, inputId = $$new_props.inputId);
		if ('href' in $$props) $$invalidate(11, href = $$new_props.href);
		if ('element' in $$props) $$invalidate(15, element = $$new_props.element);
		if ('internalClasses' in $$props) $$invalidate(16, internalClasses = $$new_props.internalClasses);
		if ('internalStyles' in $$props) $$invalidate(17, internalStyles = $$new_props.internalStyles);
		if ('internalAttrs' in $$props) $$invalidate(18, internalAttrs = $$new_props.internalAttrs);
		if ('input' in $$props) $$invalidate(14, input = $$new_props.input);
		if ('addTabindexIfNoItemsSelectedRaf' in $$props) addTabindexIfNoItemsSelectedRaf = $$new_props.addTabindexIfNoItemsSelectedRaf;
		if ('nav' in $$props) $$invalidate(21, nav = $$new_props.nav);
		if ('component' in $$props) $$invalidate(12, component = $$new_props.component);
		if ('tabindex' in $$props) $$invalidate(19, tabindex = $$new_props.tabindex);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*tabindexProp, nonInteractive, disabled, selected, input*/ 268452417) {
			$$invalidate(19, tabindex = isUninitializedValue(tabindexProp)
			? !nonInteractive && !disabled && (selected || input && input.checked)
				? 0
				: -1
			: tabindexProp);
		}
	};

	return [
		selected,
		activated,
		use,
		className,
		style,
		color,
		nonInteractive,
		ripple,
		role,
		disabled,
		skipRestoreFocus,
		href,
		component,
		action,
		input,
		element,
		internalClasses,
		internalStyles,
		internalAttrs,
		tabindex,
		forwardEvents,
		nav,
		addClass,
		removeClass,
		addStyle,
		handleKeydown,
		handleInputMount,
		$$restProps,
		tabindexProp,
		inputId,
		getPrimaryText,
		getElement,
		slots,
		switch_instance_binding,
		SMUIGenericInput_unmount_handler,
		$$scope
	];
}

class Item$1 extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				use: 2,
				class: 3,
				style: 4,
				color: 5,
				nonInteractive: 6,
				ripple: 7,
				activated: 1,
				role: 8,
				selected: 0,
				disabled: 9,
				skipRestoreFocus: 10,
				tabindex: 28,
				inputId: 29,
				href: 11,
				component: 12,
				action: 13,
				getPrimaryText: 30,
				getElement: 31
			},
			null,
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Item",
			options,
			id: create_fragment$1.name
		});
	}

	get use() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set use(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get class() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set class(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get style() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set style(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get color() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set color(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get nonInteractive() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set nonInteractive(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get ripple() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set ripple(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get activated() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set activated(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get role() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set role(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selected() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selected(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get disabled() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set disabled(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get skipRestoreFocus() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set skipRestoreFocus(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get tabindex() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set tabindex(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inputId() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inputId(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get href() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set href(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get component() {
		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set component(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get action() {
		return this.$$.ctx[13];
	}

	set action(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getPrimaryText() {
		return this.$$.ctx[30];
	}

	set getPrimaryText(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getElement() {
		return this.$$.ctx[31];
	}

	set getElement(value) {
		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

var Text = classAdderBuilder({
    class: 'mdc-deprecated-list-item__text',
    component: Span,
});

classAdderBuilder({
    class: 'mdc-deprecated-list-item__primary-text',
    component: Span,
});

classAdderBuilder({
    class: 'mdc-deprecated-list-item__secondary-text',
    component: Span,
});

var Meta = classAdderBuilder({
    class: 'mdc-deprecated-list-item__meta',
    component: Span,
});

classAdderBuilder({
    class: 'mdc-deprecated-list-group',
    component: Div,
});

classAdderBuilder({
    class: 'mdc-deprecated-list-group__subheader',
    component: H3,
});

const Item = Item$1;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var es5 = {exports: {}};

(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=90)}({17:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=r(18),i=function(){function e(){}return e.getFirstMatch=function(e,t){var r=t.match(e);return r&&r.length>0&&r[1]||""},e.getSecondMatch=function(e,t){var r=t.match(e);return r&&r.length>1&&r[2]||""},e.matchAndReturnConst=function(e,t,r){if(e.test(t))return r},e.getWindowsVersionName=function(e){switch(e){case"NT":return "NT";case"XP":return "XP";case"NT 5.0":return "2000";case"NT 5.1":return "XP";case"NT 5.2":return "2003";case"NT 6.0":return "Vista";case"NT 6.1":return "7";case"NT 6.2":return "8";case"NT 6.3":return "8.1";case"NT 10.0":return "10";default:return}},e.getMacOSVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),10===t[0])switch(t[1]){case 5:return "Leopard";case 6:return "Snow Leopard";case 7:return "Lion";case 8:return "Mountain Lion";case 9:return "Mavericks";case 10:return "Yosemite";case 11:return "El Capitan";case 12:return "Sierra";case 13:return "High Sierra";case 14:return "Mojave";case 15:return "Catalina";default:return}},e.getAndroidVersionName=function(e){var t=e.split(".").splice(0,2).map((function(e){return parseInt(e,10)||0}));if(t.push(0),!(1===t[0]&&t[1]<5))return 1===t[0]&&t[1]<6?"Cupcake":1===t[0]&&t[1]>=6?"Donut":2===t[0]&&t[1]<2?"Eclair":2===t[0]&&2===t[1]?"Froyo":2===t[0]&&t[1]>2?"Gingerbread":3===t[0]?"Honeycomb":4===t[0]&&t[1]<1?"Ice Cream Sandwich":4===t[0]&&t[1]<4?"Jelly Bean":4===t[0]&&t[1]>=4?"KitKat":5===t[0]?"Lollipop":6===t[0]?"Marshmallow":7===t[0]?"Nougat":8===t[0]?"Oreo":9===t[0]?"Pie":void 0},e.getVersionPrecision=function(e){return e.split(".").length},e.compareVersions=function(t,r,n){void 0===n&&(n=!1);var i=e.getVersionPrecision(t),s=e.getVersionPrecision(r),a=Math.max(i,s),o=0,u=e.map([t,r],(function(t){var r=a-e.getVersionPrecision(t),n=t+new Array(r+1).join(".0");return e.map(n.split("."),(function(e){return new Array(20-e.length).join("0")+e})).reverse()}));for(n&&(o=a-Math.min(i,s)),a-=1;a>=o;){if(u[0][a]>u[1][a])return 1;if(u[0][a]===u[1][a]){if(a===o)return 0;a-=1;}else if(u[0][a]<u[1][a])return -1}},e.map=function(e,t){var r,n=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(r=0;r<e.length;r+=1)n.push(t(e[r]));return n},e.find=function(e,t){var r,n;if(Array.prototype.find)return Array.prototype.find.call(e,t);for(r=0,n=e.length;r<n;r+=1){var i=e[r];if(t(i,r))return i}},e.assign=function(e){for(var t,r,n=e,i=arguments.length,s=new Array(i>1?i-1:0),a=1;a<i;a++)s[a-1]=arguments[a];if(Object.assign)return Object.assign.apply(Object,[e].concat(s));var o=function(){var e=s[t];"object"==typeof e&&null!==e&&Object.keys(e).forEach((function(t){n[t]=e[t];}));};for(t=0,r=s.length;t<r;t+=1)o();return e},e.getBrowserAlias=function(e){return n.BROWSER_ALIASES_MAP[e]},e.getBrowserTypeByAlias=function(e){return n.BROWSER_MAP[e]||""},e}();t.default=i,e.exports=t.default;},18:function(e,t,r){t.__esModule=!0,t.ENGINE_MAP=t.OS_MAP=t.PLATFORMS_MAP=t.BROWSER_MAP=t.BROWSER_ALIASES_MAP=void 0;t.BROWSER_ALIASES_MAP={"Amazon Silk":"amazon_silk","Android Browser":"android",Bada:"bada",BlackBerry:"blackberry",Chrome:"chrome",Chromium:"chromium",Electron:"electron",Epiphany:"epiphany",Firefox:"firefox",Focus:"focus",Generic:"generic","Google Search":"google_search",Googlebot:"googlebot","Internet Explorer":"ie","K-Meleon":"k_meleon",Maxthon:"maxthon","Microsoft Edge":"edge","MZ Browser":"mz","NAVER Whale Browser":"naver",Opera:"opera","Opera Coast":"opera_coast",PhantomJS:"phantomjs",Puffin:"puffin",QupZilla:"qupzilla",QQ:"qq",QQLite:"qqlite",Safari:"safari",Sailfish:"sailfish","Samsung Internet for Android":"samsung_internet",SeaMonkey:"seamonkey",Sleipnir:"sleipnir",Swing:"swing",Tizen:"tizen","UC Browser":"uc",Vivaldi:"vivaldi","WebOS Browser":"webos",WeChat:"wechat","Yandex Browser":"yandex",Roku:"roku"};t.BROWSER_MAP={amazon_silk:"Amazon Silk",android:"Android Browser",bada:"Bada",blackberry:"BlackBerry",chrome:"Chrome",chromium:"Chromium",electron:"Electron",epiphany:"Epiphany",firefox:"Firefox",focus:"Focus",generic:"Generic",googlebot:"Googlebot",google_search:"Google Search",ie:"Internet Explorer",k_meleon:"K-Meleon",maxthon:"Maxthon",edge:"Microsoft Edge",mz:"MZ Browser",naver:"NAVER Whale Browser",opera:"Opera",opera_coast:"Opera Coast",phantomjs:"PhantomJS",puffin:"Puffin",qupzilla:"QupZilla",qq:"QQ Browser",qqlite:"QQ Browser Lite",safari:"Safari",sailfish:"Sailfish",samsung_internet:"Samsung Internet for Android",seamonkey:"SeaMonkey",sleipnir:"Sleipnir",swing:"Swing",tizen:"Tizen",uc:"UC Browser",vivaldi:"Vivaldi",webos:"WebOS Browser",wechat:"WeChat",yandex:"Yandex Browser"};t.PLATFORMS_MAP={tablet:"tablet",mobile:"mobile",desktop:"desktop",tv:"tv"};t.OS_MAP={WindowsPhone:"Windows Phone",Windows:"Windows",MacOS:"macOS",iOS:"iOS",Android:"Android",WebOS:"WebOS",BlackBerry:"BlackBerry",Bada:"Bada",Tizen:"Tizen",Linux:"Linux",ChromeOS:"Chrome OS",PlayStation4:"PlayStation 4",Roku:"Roku"};t.ENGINE_MAP={EdgeHTML:"EdgeHTML",Blink:"Blink",Trident:"Trident",Presto:"Presto",Gecko:"Gecko",WebKit:"WebKit"};},90:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(91))&&n.__esModule?n:{default:n},s=r(18);function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}var o=function(){function e(){}var t,r,n;return e.getParser=function(e,t){if(void 0===t&&(t=!1),"string"!=typeof e)throw new Error("UserAgent should be a string");return new i.default(e,t)},e.parse=function(e){return new i.default(e).getResult()},t=e,n=[{key:"BROWSER_MAP",get:function(){return s.BROWSER_MAP}},{key:"ENGINE_MAP",get:function(){return s.ENGINE_MAP}},{key:"OS_MAP",get:function(){return s.OS_MAP}},{key:"PLATFORMS_MAP",get:function(){return s.PLATFORMS_MAP}}],(r=null)&&a(t.prototype,r),n&&a(t,n),e}();t.default=o,e.exports=t.default;},91:function(e,t,r){t.__esModule=!0,t.default=void 0;var n=u(r(92)),i=u(r(93)),s=u(r(94)),a=u(r(95)),o=u(r(17));function u(e){return e&&e.__esModule?e:{default:e}}var d=function(){function e(e,t){if(void 0===t&&(t=!1),null==e||""===e)throw new Error("UserAgent parameter can't be empty");this._ua=e,this.parsedResult={},!0!==t&&this.parse();}var t=e.prototype;return t.getUA=function(){return this._ua},t.test=function(e){return e.test(this._ua)},t.parseBrowser=function(){var e=this;this.parsedResult.browser={};var t=o.default.find(n.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.browser=t.describe(this.getUA())),this.parsedResult.browser},t.getBrowser=function(){return this.parsedResult.browser?this.parsedResult.browser:this.parseBrowser()},t.getBrowserName=function(e){return e?String(this.getBrowser().name).toLowerCase()||"":this.getBrowser().name||""},t.getBrowserVersion=function(){return this.getBrowser().version},t.getOS=function(){return this.parsedResult.os?this.parsedResult.os:this.parseOS()},t.parseOS=function(){var e=this;this.parsedResult.os={};var t=o.default.find(i.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.os=t.describe(this.getUA())),this.parsedResult.os},t.getOSName=function(e){var t=this.getOS().name;return e?String(t).toLowerCase()||"":t||""},t.getOSVersion=function(){return this.getOS().version},t.getPlatform=function(){return this.parsedResult.platform?this.parsedResult.platform:this.parsePlatform()},t.getPlatformType=function(e){void 0===e&&(e=!1);var t=this.getPlatform().type;return e?String(t).toLowerCase()||"":t||""},t.parsePlatform=function(){var e=this;this.parsedResult.platform={};var t=o.default.find(s.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.platform=t.describe(this.getUA())),this.parsedResult.platform},t.getEngine=function(){return this.parsedResult.engine?this.parsedResult.engine:this.parseEngine()},t.getEngineName=function(e){return e?String(this.getEngine().name).toLowerCase()||"":this.getEngine().name||""},t.parseEngine=function(){var e=this;this.parsedResult.engine={};var t=o.default.find(a.default,(function(t){if("function"==typeof t.test)return t.test(e);if(t.test instanceof Array)return t.test.some((function(t){return e.test(t)}));throw new Error("Browser's test function is not valid")}));return t&&(this.parsedResult.engine=t.describe(this.getUA())),this.parsedResult.engine},t.parse=function(){return this.parseBrowser(),this.parseOS(),this.parsePlatform(),this.parseEngine(),this},t.getResult=function(){return o.default.assign({},this.parsedResult)},t.satisfies=function(e){var t=this,r={},n=0,i={},s=0;if(Object.keys(e).forEach((function(t){var a=e[t];"string"==typeof a?(i[t]=a,s+=1):"object"==typeof a&&(r[t]=a,n+=1);})),n>0){var a=Object.keys(r),u=o.default.find(a,(function(e){return t.isOS(e)}));if(u){var d=this.satisfies(r[u]);if(void 0!==d)return d}var c=o.default.find(a,(function(e){return t.isPlatform(e)}));if(c){var f=this.satisfies(r[c]);if(void 0!==f)return f}}if(s>0){var l=Object.keys(i),h=o.default.find(l,(function(e){return t.isBrowser(e,!0)}));if(void 0!==h)return this.compareVersion(i[h])}},t.isBrowser=function(e,t){void 0===t&&(t=!1);var r=this.getBrowserName().toLowerCase(),n=e.toLowerCase(),i=o.default.getBrowserTypeByAlias(n);return t&&i&&(n=i.toLowerCase()),n===r},t.compareVersion=function(e){var t=[0],r=e,n=!1,i=this.getBrowserVersion();if("string"==typeof i)return ">"===e[0]||"<"===e[0]?(r=e.substr(1),"="===e[1]?(n=!0,r=e.substr(2)):t=[],">"===e[0]?t.push(1):t.push(-1)):"="===e[0]?r=e.substr(1):"~"===e[0]&&(n=!0,r=e.substr(1)),t.indexOf(o.default.compareVersions(i,r,n))>-1},t.isOS=function(e){return this.getOSName(!0)===String(e).toLowerCase()},t.isPlatform=function(e){return this.getPlatformType(!0)===String(e).toLowerCase()},t.isEngine=function(e){return this.getEngineName(!0)===String(e).toLowerCase()},t.is=function(e,t){return void 0===t&&(t=!1),this.isBrowser(e,t)||this.isOS(e)||this.isPlatform(e)},t.some=function(e){var t=this;return void 0===e&&(e=[]),e.some((function(e){return t.is(e)}))},e}();t.default=d,e.exports=t.default;},92:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n};var s=/version\/(\d+(\.?_?\d+)+)/i,a=[{test:[/googlebot/i],describe:function(e){var t={name:"Googlebot"},r=i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/opera/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opr\/|opios/i],describe:function(e){var t={name:"Opera"},r=i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/SamsungBrowser/i],describe:function(e){var t={name:"Samsung Internet for Android"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Whale/i],describe:function(e){var t={name:"NAVER Whale Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MZBrowser/i],describe:function(e){var t={name:"MZ Browser"},r=i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/focus/i],describe:function(e){var t={name:"Focus"},r=i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/swing/i],describe:function(e){var t={name:"Swing"},r=i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/coast/i],describe:function(e){var t={name:"Opera Coast"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/opt\/\d+(?:.?_?\d+)+/i],describe:function(e){var t={name:"Opera Touch"},r=i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/yabrowser/i],describe:function(e){var t={name:"Yandex Browser"},r=i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/ucbrowser/i],describe:function(e){var t={name:"UC Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/Maxthon|mxios/i],describe:function(e){var t={name:"Maxthon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/epiphany/i],describe:function(e){var t={name:"Epiphany"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/puffin/i],describe:function(e){var t={name:"Puffin"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sleipnir/i],describe:function(e){var t={name:"Sleipnir"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/k-meleon/i],describe:function(e){var t={name:"K-Meleon"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/micromessenger/i],describe:function(e){var t={name:"WeChat"},r=i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qqbrowser/i],describe:function(e){var t={name:/qqbrowserlite/i.test(e)?"QQ Browser Lite":"QQ Browser"},r=i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/msie|trident/i],describe:function(e){var t={name:"Internet Explorer"},r=i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/\sedg\//i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/edg([ea]|ios)/i],describe:function(e){var t={name:"Microsoft Edge"},r=i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/vivaldi/i],describe:function(e){var t={name:"Vivaldi"},r=i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/seamonkey/i],describe:function(e){var t={name:"SeaMonkey"},r=i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/sailfish/i],describe:function(e){var t={name:"Sailfish"},r=i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i,e);return r&&(t.version=r),t}},{test:[/silk/i],describe:function(e){var t={name:"Amazon Silk"},r=i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/phantom/i],describe:function(e){var t={name:"PhantomJS"},r=i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/slimerjs/i],describe:function(e){var t={name:"SlimerJS"},r=i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t={name:"BlackBerry"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t={name:"WebOS Browser"},r=i.default.getFirstMatch(s,e)||i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/bada/i],describe:function(e){var t={name:"Bada"},r=i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/tizen/i],describe:function(e){var t={name:"Tizen"},r=i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/qupzilla/i],describe:function(e){var t={name:"QupZilla"},r=i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/firefox|iceweasel|fxios/i],describe:function(e){var t={name:"Firefox"},r=i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/electron/i],describe:function(e){var t={name:"Electron"},r=i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/MiuiBrowser/i],describe:function(e){var t={name:"Miui"},r=i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/chromium/i],describe:function(e){var t={name:"Chromium"},r=i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i,e)||i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/chrome|crios|crmo/i],describe:function(e){var t={name:"Chrome"},r=i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/GSA/i],describe:function(e){var t={name:"Google Search"},r=i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t={name:"Android Browser"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/playstation 4/i],describe:function(e){var t={name:"PlayStation 4"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/safari|applewebkit/i],describe:function(e){var t={name:"Safari"},r=i.default.getFirstMatch(s,e);return r&&(t.version=r),t}},{test:[/.*/i],describe:function(e){var t=-1!==e.search("\\(")?/^(.*)\/(.*)[ \t]\((.*)/:/^(.*)\/(.*) /;return {name:i.default.getFirstMatch(t,e),version:i.default.getSecondMatch(t,e)}}}];t.default=a,e.exports=t.default;},93:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/Roku\/DVP/],describe:function(e){var t=i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i,e);return {name:s.OS_MAP.Roku,version:t}}},{test:[/windows phone/i],describe:function(e){var t=i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.WindowsPhone,version:t}}},{test:[/windows /i],describe:function(e){var t=i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i,e),r=i.default.getWindowsVersionName(t);return {name:s.OS_MAP.Windows,version:t,versionName:r}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(e){var t={name:s.OS_MAP.iOS},r=i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/,e);return r&&(t.version=r),t}},{test:[/macintosh/i],describe:function(e){var t=i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i,e).replace(/[_\s]/g,"."),r=i.default.getMacOSVersionName(t),n={name:s.OS_MAP.MacOS,version:t};return r&&(n.versionName=r),n}},{test:[/(ipod|iphone|ipad)/i],describe:function(e){var t=i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i,e).replace(/[_\s]/g,".");return {name:s.OS_MAP.iOS,version:t}}},{test:function(e){var t=!e.test(/like android/i),r=e.test(/android/i);return t&&r},describe:function(e){var t=i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i,e),r=i.default.getAndroidVersionName(t),n={name:s.OS_MAP.Android,version:t};return r&&(n.versionName=r),n}},{test:[/(web|hpw)[o0]s/i],describe:function(e){var t=i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i,e),r={name:s.OS_MAP.WebOS};return t&&t.length&&(r.version=t),r}},{test:[/blackberry|\bbb\d+/i,/rim\stablet/i],describe:function(e){var t=i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i,e)||i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i,e)||i.default.getFirstMatch(/\bbb(\d+)/i,e);return {name:s.OS_MAP.BlackBerry,version:t}}},{test:[/bada/i],describe:function(e){var t=i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Bada,version:t}}},{test:[/tizen/i],describe:function(e){var t=i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.Tizen,version:t}}},{test:[/linux/i],describe:function(){return {name:s.OS_MAP.Linux}}},{test:[/CrOS/],describe:function(){return {name:s.OS_MAP.ChromeOS}}},{test:[/PlayStation 4/],describe:function(e){var t=i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i,e);return {name:s.OS_MAP.PlayStation4,version:t}}}];t.default=a,e.exports=t.default;},94:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:[/googlebot/i],describe:function(){return {type:"bot",vendor:"Google"}}},{test:[/huawei/i],describe:function(e){var t=i.default.getFirstMatch(/(can-l01)/i,e)&&"Nova",r={type:s.PLATFORMS_MAP.mobile,vendor:"Huawei"};return t&&(r.model=t),r}},{test:[/nexus\s*(?:7|8|9|10).*/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Nexus"}}},{test:[/ipad/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/Macintosh(.*?) FxiOS(.*?)\//],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Apple",model:"iPad"}}},{test:[/kftt build/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon",model:"Kindle Fire HD 7"}}},{test:[/silk/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet,vendor:"Amazon"}}},{test:[/tablet(?! pc)/i],describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){var t=e.test(/ipod|iphone/i),r=e.test(/like (ipod|iphone)/i);return t&&!r},describe:function(e){var t=i.default.getFirstMatch(/(ipod|iphone)/i,e);return {type:s.PLATFORMS_MAP.mobile,vendor:"Apple",model:t}}},{test:[/nexus\s*[0-6].*/i,/galaxy nexus/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Nexus"}}},{test:[/[^-]mobi/i],describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "blackberry"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"BlackBerry"}}},{test:function(e){return "bada"===e.getBrowserName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "windows phone"===e.getBrowserName()},describe:function(){return {type:s.PLATFORMS_MAP.mobile,vendor:"Microsoft"}}},{test:function(e){var t=Number(String(e.getOSVersion()).split(".")[0]);return "android"===e.getOSName(!0)&&t>=3},describe:function(){return {type:s.PLATFORMS_MAP.tablet}}},{test:function(e){return "android"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.mobile}}},{test:function(e){return "macos"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop,vendor:"Apple"}}},{test:function(e){return "windows"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "linux"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.desktop}}},{test:function(e){return "playstation 4"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}},{test:function(e){return "roku"===e.getOSName(!0)},describe:function(){return {type:s.PLATFORMS_MAP.tv}}}];t.default=a,e.exports=t.default;},95:function(e,t,r){t.__esModule=!0,t.default=void 0;var n,i=(n=r(17))&&n.__esModule?n:{default:n},s=r(18);var a=[{test:function(e){return "microsoft edge"===e.getBrowserName(!0)},describe:function(e){if(/\sedg\//i.test(e))return {name:s.ENGINE_MAP.Blink};var t=i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i,e);return {name:s.ENGINE_MAP.EdgeHTML,version:t}}},{test:[/trident/i],describe:function(e){var t={name:s.ENGINE_MAP.Trident},r=i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){return e.test(/presto/i)},describe:function(e){var t={name:s.ENGINE_MAP.Presto},r=i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:function(e){var t=e.test(/gecko/i),r=e.test(/like gecko/i);return t&&!r},describe:function(e){var t={name:s.ENGINE_MAP.Gecko},r=i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}},{test:[/(apple)?webkit\/537\.36/i],describe:function(){return {name:s.ENGINE_MAP.Blink}}},{test:[/(apple)?webkit/i],describe:function(e){var t={name:s.ENGINE_MAP.WebKit},r=i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i,e);return r&&(t.version=r),t}}];t.default=a,e.exports=t.default;}})}));
}(es5));

var Bowser = /*@__PURE__*/getDefaultExportFromCjs(es5.exports);

/* src/modal/Modal.svelte generated by Svelte v3.46.6 */

const { console: console_1 } = globals;
const file = "src/modal/Modal.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (52:0) {#if open}
function create_if_block(ctx) {
	let dialog;
	let updating_open;
	let current;

	function dialog_open_binding(value) {
		/*dialog_open_binding*/ ctx[9](value);
	}

	let dialog_props = {
		surface$style: "min-width: 30vw;",
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*open*/ ctx[3] !== void 0) {
		dialog_props.open = /*open*/ ctx[3];
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, 'open', dialog_open_binding));

	const block = {
		c: function create() {
			create_component(dialog.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(dialog, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const dialog_changes = {};

			if (dirty & /*$$scope, installed, callback, browser, open*/ 16399) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_open && dirty & /*open*/ 8) {
				updating_open = true;
				dialog_changes.open = /*open*/ ctx[3];
				add_flush_callback(() => updating_open = false);
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dialog, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(52:0) {#if open}",
		ctx
	});

	return block;
}

// (60:12) <Title>
function create_default_slot_8(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text(title);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_8.name,
		type: "slot",
		source: "(60:12) <Title>",
		ctx
	});

	return block;
}

// (54:8) <Header             style="                 display: flex;                 justify-content: space-between;                 align-items: end;             ">
function create_default_slot_7(ctx) {
	let title_1;
	let t;
	let img;
	let img_src_value;
	let current;
	let mounted;
	let dispose;

	title_1 = new Title({
			props: {
				$$slots: { default: [create_default_slot_8] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(title_1.$$.fragment);
			t = space();
			img = element("img");
			attr_dev(img, "alt", "Close");
			set_style(img, "margin-inline-end", "10px");
			set_style(img, "padding", "10px");
			set_style(img, "cursor", "pointer");
			if (!src_url_equal(img.src, img_src_value = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMiAxOSA2LjQxeiIvPjwvc3ZnPg==")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 60, 12, 1760);
		},
		m: function mount(target, anchor) {
			mount_component(title_1, target, anchor);
			insert_dev(target, t, anchor);
			insert_dev(target, img, anchor);
			current = true;

			if (!mounted) {
				dispose = listen_dev(img, "click", /*click_handler*/ ctx[7], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const title_1_changes = {};

			if (dirty & /*$$scope*/ 16384) {
				title_1_changes.$$scope = { dirty, ctx };
			}

			title_1.$set(title_1_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(title_1.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(title_1.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(title_1, detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_7.name,
		type: "slot",
		source: "(54:8) <Header             style=\\\"                 display: flex;                 justify-content: space-between;                 align-items: end;             \\\">",
		ctx
	});

	return block;
}

// (111:12) {:else}
function create_else_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `No compatible wallets found for ${/*browserName*/ ctx[4]}`;
			attr_dev(div, "class", "mdc-typography--headline6");
			add_location(div, file, 111, 16, 5266);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(111:12) {:else}",
		ctx
	});

	return block;
}

// (68:12) {#if unifiedWallets.length}
function create_if_block_1(ctx) {
	let list;
	let current;

	list = new List({
			props: {
				$$slots: { default: [create_default_slot_2] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(list.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(list, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const list_changes = {};

			if (dirty & /*$$scope, installed, callback, browser, open*/ 16399) {
				list_changes.$$scope = { dirty, ctx };
			}

			list.$set(list_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(list.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(list.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(list, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(68:12) {#if unifiedWallets.length}",
		ctx
	});

	return block;
}

// (90:28) <Text                                 >
function create_default_slot_6(ctx) {
	let t0_value = (/*idx*/ ctx[13] >= /*installed*/ ctx[1].length
	? "Install "
	: "") + "";

	let t0;
	let t1_value = (/*wallet*/ ctx[11].name || "Injected") + "";
	let t1;

	const block = {
		c: function create() {
			t0 = text(t0_value);
			t1 = text(t1_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, t1, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*installed*/ 2 && t0_value !== (t0_value = (/*idx*/ ctx[13] >= /*installed*/ ctx[1].length
			? "Install "
			: "") + "")) set_data_dev(t0, t0_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(t1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_6.name,
		type: "slot",
		source: "(90:28) <Text                                 >",
		ctx
	});

	return block;
}

// (101:28) {:else}
function create_else_block(ctx) {
	let meta;
	let current;

	meta = new Meta({
			props: {
				$$slots: { default: [create_default_slot_5] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(meta.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(meta, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const meta_changes = {};

			if (dirty & /*$$scope*/ 16384) {
				meta_changes.$$scope = { dirty, ctx };
			}

			meta.$set(meta_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(meta.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(meta.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(meta, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(101:28) {:else}",
		ctx
	});

	return block;
}

// (94:28) {#if !!wallet.icon}
function create_if_block_2(ctx) {
	let meta;
	let current;

	meta = new Meta({
			props: {
				$$slots: { default: [create_default_slot_4] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(meta.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(meta, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const meta_changes = {};

			if (dirty & /*$$scope*/ 16384) {
				meta_changes.$$scope = { dirty, ctx };
			}

			meta.$set(meta_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(meta.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(meta.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(meta, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(94:28) {#if !!wallet.icon}",
		ctx
	});

	return block;
}

// (102:32) <Meta>
function create_default_slot_5(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "alt", "" + ((/*wallet*/ ctx[11].name || 'Injected') + " logo"));
			if (!src_url_equal(img.src, img_src_value = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiMwMDAwMDAiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48cGF0aCBkPSJNMTEuMDcsMTIuODVjMC43Ny0xLjM5LDIuMjUtMi4yMSwzLjExLTMuNDRjMC45MS0xLjI5LDAuNC0zLjctMi4xOC0zLjdjLTEuNjksMC0yLjUyLDEuMjgtMi44NywyLjM0TDYuNTQsNi45NiBDNy4yNSw0LjgzLDkuMTgsMywxMS45OSwzYzIuMzUsMCwzLjk2LDEuMDcsNC43OCwyLjQxYzAuNywxLjE1LDEuMTEsMy4zLDAuMDMsNC45Yy0xLjIsMS43Ny0yLjM1LDIuMzEtMi45NywzLjQ1IGMtMC4yNSwwLjQ2LTAuMzUsMC43Ni0wLjM1LDIuMjRoLTIuODlDMTAuNTgsMTUuMjIsMTAuNDYsMTMuOTUsMTEuMDcsMTIuODV6IE0xNCwyMGMwLDEuMS0wLjksMi0yLDJzLTItMC45LTItMmMwLTEuMSwwLjktMiwyLTIgUzE0LDE4LjksMTQsMjB6Ii8+PC9nPjwvc3ZnPg==")) attr_dev(img, "src", img_src_value);
			add_location(img, file, 102, 36, 4152);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_5.name,
		type: "slot",
		source: "(102:32) <Meta>",
		ctx
	});

	return block;
}

// (95:32) <Meta>
function create_default_slot_4(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "width", "32px");
			if (!src_url_equal(img.src, img_src_value = /*wallet*/ ctx[11].icon)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", "" + (/*wallet*/ ctx[11].name + " logo"));
			add_location(img, file, 95, 36, 3817);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_4.name,
		type: "slot",
		source: "(95:32) <Meta>",
		ctx
	});

	return block;
}

// (72:24) <Item                             style="                                 border: 1px solid lightgrey;                                 /* use same border-radius as dialog's */                                 border-radius: var(--mdc-shape-medium, 4px);                                 height: 58px;                                 background: #edeef2;                                 margin-bottom: 10px;                             "                             on:click={() => {                                 if (idx < installed.length) {                                     callback(wallet);                                 } else {                                     window.open(wallet.downloads[browser], "_blank");                                     callback(undefined);                                 }                                 open = false;                             }}>
function create_default_slot_3(ctx) {
	let text_1;
	let t0;
	let current_block_type_index;
	let if_block;
	let t1;
	let current;

	text_1 = new Text({
			props: {
				$$slots: { default: [create_default_slot_6] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const if_block_creators = [create_if_block_2, create_else_block];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (!!/*wallet*/ ctx[11].icon) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			create_component(text_1.$$.fragment);
			t0 = space();
			if_block.c();
			t1 = space();
		},
		m: function mount(target, anchor) {
			mount_component(text_1, target, anchor);
			insert_dev(target, t0, anchor);
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, t1, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const text_1_changes = {};

			if (dirty & /*$$scope, installed*/ 16386) {
				text_1_changes.$$scope = { dirty, ctx };
			}

			text_1.$set(text_1_changes);
			if_block.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(text_1.$$.fragment, local);
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(text_1.$$.fragment, local);
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(text_1, detaching);
			if (detaching) detach_dev(t0);
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(t1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_3.name,
		type: "slot",
		source: "(72:24) <Item                             style=\\\"                                 border: 1px solid lightgrey;                                 /* use same border-radius as dialog's */                                 border-radius: var(--mdc-shape-medium, 4px);                                 height: 58px;                                 background: #edeef2;                                 margin-bottom: 10px;                             \\\"                             on:click={() => {                                 if (idx < installed.length) {                                     callback(wallet);                                 } else {                                     window.open(wallet.downloads[browser], \\\"_blank\\\");                                     callback(undefined);                                 }                                 open = false;                             }}>",
		ctx
	});

	return block;
}

// (70:20) {#each unifiedWallets as wallet, idx}
function create_each_block(ctx) {
	let item;
	let current;

	function click_handler_1() {
		return /*click_handler_1*/ ctx[8](/*idx*/ ctx[13], /*wallet*/ ctx[11]);
	}

	item = new Item({
			props: {
				style: "\n                                border: 1px solid lightgrey;\n                                /* use same border-radius as dialog's */\n                                border-radius: var(--mdc-shape-medium, 4px);\n                                height: 58px;\n                                background: #edeef2;\n                                margin-bottom: 10px;\n                            ",
				$$slots: { default: [create_default_slot_3] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	item.$on("click", click_handler_1);

	const block = {
		c: function create() {
			create_component(item.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(item, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const item_changes = {};

			if (dirty & /*$$scope, installed*/ 16386) {
				item_changes.$$scope = { dirty, ctx };
			}

			item.$set(item_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(item.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(item.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(item, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(70:20) {#each unifiedWallets as wallet, idx}",
		ctx
	});

	return block;
}

// (69:16) <List>
function create_default_slot_2(ctx) {
	let each_1_anchor;
	let current;
	let each_value = /*unifiedWallets*/ ctx[5];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*installed, callback, unifiedWallets, window, browser, undefined, open*/ 47) {
				each_value = /*unifiedWallets*/ ctx[5];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_2.name,
		type: "slot",
		source: "(69:16) <List>",
		ctx
	});

	return block;
}

// (67:8) <Content>
function create_default_slot_1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block_1, create_else_block_1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*unifiedWallets*/ ctx[5].length) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			if_block.p(ctx, dirty);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(67:8) <Content>",
		ctx
	});

	return block;
}

// (53:4) <Dialog bind:open surface$style="min-width: 30vw;">
function create_default_slot(ctx) {
	let header;
	let t;
	let content;
	let current;

	header = new Header({
			props: {
				style: "\n                display: flex;\n                justify-content: space-between;\n                align-items: end;\n            ",
				$$slots: { default: [create_default_slot_7] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	content = new Content({
			props: {
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(header.$$.fragment);
			t = space();
			create_component(content.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(header, target, anchor);
			insert_dev(target, t, anchor);
			mount_component(content, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const header_changes = {};

			if (dirty & /*$$scope, open*/ 16392) {
				header_changes.$$scope = { dirty, ctx };
			}

			header.$set(header_changes);
			const content_changes = {};

			if (dirty & /*$$scope, installed, callback, browser, open*/ 16399) {
				content_changes.$$scope = { dirty, ctx };
			}

			content.$set(content_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(header.$$.fragment, local);
			transition_in(content.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(header.$$.fragment, local);
			transition_out(content.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(header, detaching);
			if (detaching) detach_dev(t);
			destroy_component(content, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(53:4) <Dialog bind:open surface$style=\\\"min-width: 30vw;\\\">",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let link0;
	let link1;
	let link2;
	let t;
	let if_block_anchor;
	let current;
	let if_block = /*open*/ ctx[3] && create_if_block(ctx);

	const block = {
		c: function create() {
			link0 = element("link");
			link1 = element("link");
			link2 = element("link");
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr_dev(link0, "rel", "stylesheet");
			attr_dev(link0, "href", "https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700");
			add_location(link0, file, 38, 4, 1091);
			attr_dev(link1, "rel", "stylesheet");
			attr_dev(link1, "href", "https://unpkg.com/@material/typography@13.0.0/dist/mdc.typography.css");
			add_location(link1, file, 43, 4, 1245);
			attr_dev(link2, "rel", "stylesheet");
			attr_dev(link2, "href", "https://unpkg.com/svelte-material-ui/bare.css");
			add_location(link2, file, 48, 4, 1387);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			append_dev(document.head, link0);
			append_dev(document.head, link1);
			append_dev(document.head, link2);
			insert_dev(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*open*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*open*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			detach_dev(link0);
			detach_dev(link1);
			detach_dev(link2);
			if (detaching) detach_dev(t);
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

const title = "Connect a wallet";

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('Modal', slots, []);
	var _a;

	let { callback = () => {
		
	} } = $$props;

	let { installed = [] } = $$props;
	let { discovery = [] } = $$props;

	const browserName = (_a = Bowser.getParser(window.navigator.userAgent).getBrowser().name) === null || _a === void 0
	? void 0
	: _a.toLowerCase();

	let browser;

	switch (browserName) {
		case "chrome":
		case "chromium":
		case "electron":
		case "microsoft edge":
			browser = "chrome";
			break;
		case "firefox":
			browser = "firefox";
			break;
	}

	const unifiedWallets = browser
	? [
			// include installed 1st
			...installed,
			// discovery 2nd, and remove wallets with no support
			// for the current browser
			...discovery.filter(dw => !!dw.downloads[browser])
		]
	: installed;

	console.log("modal", {
		unifiedWallets,
		browser,
		installed,
		discovery
	});

	let open = true;
	const writable_props = ['callback', 'installed', 'discovery'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Modal> was created with unknown prop '${key}'`);
	});

	const click_handler = () => $$invalidate(3, open = false);

	const click_handler_1 = (idx, wallet) => {
		if (idx < installed.length) {
			callback(wallet);
		} else {
			window.open(wallet.downloads[browser], "_blank");
			callback(undefined);
		}

		$$invalidate(3, open = false);
	};

	function dialog_open_binding(value) {
		open = value;
		$$invalidate(3, open);
	}

	$$self.$$set = $$props => {
		if ('callback' in $$props) $$invalidate(0, callback = $$props.callback);
		if ('installed' in $$props) $$invalidate(1, installed = $$props.installed);
		if ('discovery' in $$props) $$invalidate(6, discovery = $$props.discovery);
	};

	$$self.$capture_state = () => ({
		_a,
		Dialog,
		Title,
		Content,
		Header,
		List,
		Item,
		Text,
		Meta,
		Bowser,
		callback,
		installed,
		discovery,
		title,
		browserName,
		browser,
		unifiedWallets,
		open
	});

	$$self.$inject_state = $$props => {
		if ('_a' in $$props) _a = $$props._a;
		if ('callback' in $$props) $$invalidate(0, callback = $$props.callback);
		if ('installed' in $$props) $$invalidate(1, installed = $$props.installed);
		if ('discovery' in $$props) $$invalidate(6, discovery = $$props.discovery);
		if ('browser' in $$props) $$invalidate(2, browser = $$props.browser);
		if ('open' in $$props) $$invalidate(3, open = $$props.open);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		callback,
		installed,
		browser,
		open,
		browserName,
		unifiedWallets,
		discovery,
		click_handler,
		click_handler_1,
		dialog_open_binding
	];
}

class Modal extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { callback: 0, installed: 1, discovery: 6 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Modal",
			options,
			id: create_fragment.name
		});
	}

	get callback() {
		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set callback(value) {
		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get installed() {
		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set installed(value) {
		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get discovery() {
		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set discovery(value) {
		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

function show(installed) {
    return __awaiter(this, void 0, void 0, function* () {
        const installedWalletIds = new Set(installed.map(w => w.id));
        // remove installed wallets from discovery
        const discovery = discoveryWallets.filter(dw => !installedWalletIds.has(dw.id));
        return new Promise(resolve => {
            const modal = new Modal({
                target: document.body,
                props: {
                    callback: (value) => {
                        modal.$destroy();
                        resolve(value);
                    },
                    installed,
                    discovery,
                },
            });
        });
    });
}

var _GetStarknetWallet_instances, _GetStarknetWallet_walletObjRef, _GetStarknetWallet_isConnected, _GetStarknetWallet_setCurrentWallet, _GetStarknetWallet_getInstalledWallets;
class GetStarknetWallet {
    constructor() {
        _GetStarknetWallet_instances.add(this);
        _GetStarknetWallet_walletObjRef.set(this, {});
        window.gsw = true;
        this.disconnect = this.disconnect.bind(this);
        this.connect = this.connect.bind(this);
        this.getStarknet = this.getStarknet.bind(this);
    }
    connect(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connected = __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_isConnected).call(this);
                console.log("connect", { connected });
                const installedWallets = yield __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_getInstalledWallets).call(this, options);
                // force showing the popup if
                // 1. we are called while connected
                // 2. we were explicitly told to show it
                // 3. user never selected from the popup
                const forcePopup = connected || (options === null || options === void 0 ? void 0 : options.showList) || !lastConnected.get();
                if (!forcePopup) {
                    // return user-set default wallet if available
                    const defaultWalletId = defaultWallet.get();
                    const defaultWalletObj = installedWallets.find(w => w.id === defaultWalletId);
                    if (defaultWalletObj) {
                        return __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_setCurrentWallet).call(this, defaultWalletObj);
                    }
                    else {
                        // remove prev-default wallet if not available anymore
                        defaultWallet.delete();
                    }
                    // no default but only one wallet - return that wallet
                    if (installedWallets.length === 1) {
                        return __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_setCurrentWallet).call(this, installedWallets[0]);
                    }
                }
                const wallet = yield show(installedWallets);
                return __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_setCurrentWallet).call(this, wallet);
            }
            catch (err) {
                console.error(err);
            }
            return undefined;
        });
    }
    disconnect() {
        const connected = __classPrivateFieldGet(this, _GetStarknetWallet_instances, "m", _GetStarknetWallet_isConnected).call(this);
        __classPrivateFieldGet(this, _GetStarknetWallet_walletObjRef, "f").current = undefined;
        // disconnected successfully if was connected before
        return connected;
    }
    getStarknet() {
        var _a;
        const self = this;
        return ((_a = __classPrivateFieldGet(this, _GetStarknetWallet_walletObjRef, "f").current) !== null && _a !== void 0 ? _a : new (class {
            constructor() {
                this.id = "disconnected";
                this.name = "Disconnected";
                this.icon = "";
                this.selectedAddress = undefined;
                this.provider = starknet.defaultProvider;
                this.isConnected = false;
                this.account = new starknet.Account(starknet.defaultProvider, "", {});
                this.version = "";
                this.isPreauthorized = () => __awaiter(this, void 0, void 0, function* () { return false; });
                this.off = () => { };
                this.on = () => {
                    throw new Error("can't register event on disconnected wallet");
                };
                this.request = () => {
                    throw new Error("can't request a disconnected wallet");
                };
            }
            enable(options) {
                return self.connect().then(wallet => { var _a; return (_a = wallet === null || wallet === void 0 ? void 0 : wallet.enable(options)) !== null && _a !== void 0 ? _a : []; });
            }
        })());
    }
}
_GetStarknetWallet_walletObjRef = new WeakMap(), _GetStarknetWallet_instances = new WeakSet(), _GetStarknetWallet_isConnected = function _GetStarknetWallet_isConnected() {
    return !!__classPrivateFieldGet(this, _GetStarknetWallet_walletObjRef, "f").current;
}, _GetStarknetWallet_setCurrentWallet = function _GetStarknetWallet_setCurrentWallet(wallet) {
    __classPrivateFieldGet(this, _GetStarknetWallet_walletObjRef, "f").current = wallet;
    if (wallet) {
        lastConnected.set(wallet.id);
    }
    return wallet;
}, _GetStarknetWallet_getInstalledWallets = function _GetStarknetWallet_getInstalledWallets(options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log("getInstalledWallets -> options", options);
        let installed = Object.keys(window).reduce((wallets, key) => {
            if (key.startsWith("starknet")) {
                const wallet = window[key];
                if (isWalletObj(key, wallet)) {
                    wallets.push(wallet);
                }
            }
            return wallets;
        }, []);
        console.log("pre options available wallets", installed);
        if ((_a = options === null || options === void 0 ? void 0 : options.include) === null || _a === void 0 ? void 0 : _a.length) {
            const included = new Set(options.include);
            installed = installed.filter(w => included.has(w.id));
        }
        if ((_b = options === null || options === void 0 ? void 0 : options.exclude) === null || _b === void 0 ? void 0 : _b.length) {
            const excluded = new Set(options.exclude);
            installed = installed.filter(w => !excluded.has(w.id));
        }
        if (options && Array.isArray(options.order)) {
            // skip default/preAuthorized priorities,
            // sort by client-specific order
            const order = [...options.order];
            installed.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
            const orderScope = installed.length - order.length;
            installed = [
                ...installed.slice(orderScope),
                // shuffle wallets which are outside `order` scope
                ...shuffle(installed.slice(0, orderScope)),
            ];
        }
        else {
            if (!(options === null || options === void 0 ? void 0 : options.order) || options.order === "random") {
                shuffle(installed);
            }
            else if ((options === null || options === void 0 ? void 0 : options.order) === "community") ;
            // if we have more than a single installed wallet we'll
            // need to prioritize default & preAuthorized wallets
            if (installed.length > 1) {
                // fetch & shuffle all preAuthorized
                const preAuthorized = shuffle(yield filterPreAuthorized(installed));
                // remove preAuthorized wallets from installed wallets list
                const preAuthorizedIds = new Set(preAuthorized.map(pa => pa.id));
                console.log("preAuthorizedIds", preAuthorizedIds);
                installed = installed.filter(w => !preAuthorizedIds.has(w.id));
                // put preAuthorized wallets first
                installed = [...preAuthorized, ...installed];
                // lookup default wallet
                const defaultWalletId = defaultWallet.get();
                if (defaultWalletId) {
                    // pop defaultWalletObj from installed
                    let defaultWalletObj = undefined;
                    installed = installed.filter(w => {
                        if (w.id === defaultWalletId) {
                            defaultWalletObj = w;
                            return false;
                        }
                        return true;
                    });
                    // and push it at the top
                    if (defaultWalletObj) {
                        installed.unshift(defaultWalletObj);
                    }
                    else {
                        // remove prev-default wallet if not available anymore
                        defaultWallet.delete();
                    }
                }
            }
        }
        console.log("post options available wallets", installed);
        return installed;
    });
};
const gsw = new GetStarknetWallet();
const getStarknet = gsw.getStarknet;
const connect = gsw.connect;
const disconnect = gsw.disconnect;

exports.connect = connect;
exports.disconnect = disconnect;
exports.getStarknet = getStarknet;
//# sourceMappingURL=index.js.map
