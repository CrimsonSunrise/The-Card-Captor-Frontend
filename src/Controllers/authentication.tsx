import React from "react";
import axios from "axios";
import { IP_ADDRESS } from "../connection";

export const login = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                IP_ADDRESS + "/login",
                { email: email, password: password },
                { headers: { "content-type": "application/json" } }
            )
            .then((res) => {
                if (res.status === 200) {
                    // console.log(res.data)
                    // setToken(res.data.user.token)
                    document.cookie = "token=" + res.data.user.token;
                    resolve(res.data.user);
                    // console.log(res.data.token)
                } else {
                    reject(404);
                }
            });
    });
};

export const register = (nickname: string, email: string, password: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                IP_ADDRESS + "/register",
                { nickname: nickname, email: email, password: password },
                { headers: { "content-type": "application/json" } }
            )
            .then((res) => {
                if (res.status === 200) {
                    // console.log(res.data)
                    // setToken(res.data.user.token)
                    // document.cookie = "token=" + res.data.user.token;
                    resolve(200);
                    // console.log(res.data.token)
                } else {
                    reject(res.status);
                }
            });
    });
};

export const getUser = (token: any) => {
    return new Promise((resolve, reject) => {
        axios
            .get(IP_ADDRESS + "/user", { headers: { authorization: token } })
            .then((res) => {
                if (res.data != null) {
                    resolve(res.data);
                } else {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    reject("error");
                }
            })
            .catch((err) => {
                reject("error");
            });
    });
};

// const getUserPromise = new Promise(getUser(resolve, reject) => {

// })

export const logout = () => {
    return new Promise((resolve, reject) => {
        document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        resolve("logout");
    });
};

export function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
