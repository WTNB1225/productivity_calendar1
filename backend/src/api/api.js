"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getUsersAllRepos = exports.extractLinesOfCode = exports.extractShaId = void 0;
const axios_1 = __importDefault(require("axios"));
const url = 'https://api.github.com';
function extractShaId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, reposName, access_token, id }) {
        const url = 'https://api.github.com/repos/' + username + '/' + reposName + '/commits';
        const shaData = [];
        try {
            const response = yield axios_1.default.get(url, {
                data: { access_token: access_token },
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + access_token
                }
            });
            const dataLen = response.data.length;
            for (let i = 0; i < dataLen; i++) {
                shaData.push(response.data[i].sha);
            }
            const shaDataWithRepoName = { reposName: reposName, sha: shaData, username: username, access_token: access_token, id: id };
            return shaDataWithRepoName;
        }
        catch (e) {
            console.error(e);
            return;
        }
    });
}
exports.extractShaId = extractShaId;
function extractLinesOfCode(shaObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'https://api.github.com/repos/' + shaObj.username + '/' + shaObj.reposName + '/commits/';
        const promises = shaObj.sha.map((sha) => __awaiter(this, void 0, void 0, function* () {
            const url = baseUrl + sha;
            try {
                const response = yield axios_1.default.get(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + shaObj.access_token,
                    },
                    data: { access_token: shaObj.access_token }
                });
                const linesOfCode = response.data.stats.total;
                return linesOfCode;
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        }));
        return Promise.all(promises);
    });
}
exports.extractLinesOfCode = extractLinesOfCode;
function getUsersAllRepos(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { access_token: access_token };
        try {
            const response = yield axios_1.default.get(url + '/user/repos', {
                data: data,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/vnd.github.v3+json',
                }
            });
            return { repos: response.data, access_token: access_token };
        }
        catch (error) {
            console.error(error.response);
            return { repos: [], access_token: '' };
        }
    });
}
exports.getUsersAllRepos = getUsersAllRepos;
function getUserInfo(access_token) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { access_token: access_token };
        try {
            const response = yield axios_1.default.get(url + '/user', {
                data: data,
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/vnd.github.v3+json',
                }
            });
            return (response.data);
        }
        catch (e) {
            return;
        }
    });
}
exports.getUserInfo = getUserInfo;
