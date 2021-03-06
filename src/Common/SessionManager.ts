import {RedisCaching} from "./RedisCaching";
import {ReturnCode} from "./ReturnCode";
import {UtilsTS} from "./UtilsTS";
/**
 * Created by NguyenTrung on 28/2/17.
 */


export class SessionManager {
    private static _instance: SessionManager = null;

    constructor() {

    }

    static getInstance() {
        if (this._instance == null) {
            this._instance = new SessionManager();
        }

        return this._instance;
    }

    async getSessionID(username) {
        return new Promise((resolve, reject) => {
            let sessionID = username + "-123-ABC"
            UtilsTS.encrypt(sessionID).then((encryptedSessionID) => {
                RedisCaching.getInstance().setCache(encryptedSessionID, username, UtilsTS.SESSION_TTL_IN_SECOND);
                resolve(encryptedSessionID);
            });
        });
    }

    async checkSessionID(sessionId, mobilePhone) {
        return new Promise((resolve, reject) => {
            RedisCaching.getInstance().getCache(sessionId, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    if (value == null) {
                        resolve(ReturnCode.SESSION_TIMEOUT);
                    } else if (value == mobilePhone) {
                        resolve(ReturnCode.SUCCEEDED);
                    } else {
                        resolve(ReturnCode.SESSION_INVALID);
                    }
                }
            })
        })
    }
}