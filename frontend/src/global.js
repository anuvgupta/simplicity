// globals

import axios from 'axios';
import hash from 'hash.js';

global.config = {
    // api_url: 'http://localhost:5000/api',
    api_url: `${window.location.protocol}//${window.location.host}/api`,
    home_url: `${window.location.protocol}//${window.location.host}`,
    api_token: null,
};

global.api = {
    authenticate: resolve => {
        var token = global.util.cookie('token');
        if (token && token.trim().length > 0) {
            var handleResponse = response => {
                if (response && response.hasOwnProperty('success')) {
                    if (response.success === true) {
                        if (response.hasOwnProperty('data') && response.data.hasOwnProperty('username') && typeof response.data.username === 'string') {
                            return resolve({ username: response.data.username, token: token });
                        } else resolve(false);
                    } else {
                        if (response.hasOwnProperty('message') && typeof response.message === 'string') {
                            console.log(response.message);
                        }
                        resolve(false);
                    }
                } else resolve(false);
            };
            axios.get(`${global.config.api_url}/auth`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => {
                var resp_data = null;
                if (response && response.data)
                    resp_data = response.data;
                handleResponse(resp_data);
            }).catch(error => {
                if (error) {
                    var resp_data = null;
                    if (error.response && error.response.data)
                        resp_data = error.response.data;
                    handleResponse(resp_data);
                }
            });
        } else resolve(false);
    },
    logout: (redirect = true) => {
        global.util.delete_cookie('token');
        if (redirect) window.location = `${global.config.home_url}/`;
    },
    login: (accessToken, redirect = true) => {
        global.util.delete_cookie('token');
        global.util.cookie('token', accessToken);
        if (redirect) window.location = `${global.config.home_url}/home`;
    },
    get_token: _ => {
        var cookie = global.util.cookie('token');
        if (cookie) return cookie;
        return null;
    }
};

global.util = {
    cookie: (id, val, date) => {
        if (global.util.is.unset(val))
            document.cookie.split('; ').forEach(cookie => {
                if (cookie.substring(0, id.length) == id)
                    val = cookie.substring(id.length + 1);
            });
        else {
            if (date == '__indefinite__')
                date = 'Fri, 31 Dec 9999 23:59:59 GMT';
            document.cookie =
                id +
                '=' +
                val +
                (global.util.is.set(date) ? '; expires=' + date : '');
        }
        return global.util.is.unset(val) ? null : val;
    },
    delete_cookie: id => {
        global.util.cookie(id, '', 'Thu, 01 Jan 1970 00:00:00 GMT');
    },
    sha256: value => {
        return hash.sha256().update(`${value}`).digest('hex');
    },
    is: { // match types
        null: function (v) { return (v == null); },
        eqnull: function (v) { return (v === null); },
        undef: function (v) { return (v == undefined); },
        set: function (v) { return (v != undefined && v !== null); },
        unset: function (v) { return (v == undefined || v === null); },
        str: function (v) { return (v !== null && v != undefined && (typeof v === 'string' || v instanceof String)); },
        func: function (v) { return (v !== null && v != undefined && (typeof v === 'function' || v instanceof Function)); },
        node: function (v) { return (v !== null && v != undefined && (typeof v === 'object' || v instanceof Object) && v instanceof Node); },
        elem: function (v) { return (v !== null && v != undefined && (typeof v === 'object' || v instanceof Object) && v instanceof Node && v instanceof Element); },
        arr: function (v) { return (v !== null && v != undefined && (/*typeof v === 'array' ||*/ v instanceof Array)); },
        obj: function (v) { return (v !== null && v != undefined && (typeof v === 'object' || v instanceof Object)); },
        int: function (v) { return (v !== null && v != undefined && (v === parseInt(v, 10) && !isNaN(v))); },
        type: function (v, t) { return (typeof v === t); }
    },
    validateAlphanumeric: (value) => {
        var alphaNumerics = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var v in value) {
            if (!alphaNumerics.includes(value[v])) {
                return false;
            }
        }
        return true;
    },
    hashPassword: (value) => {
        // const hashSalt = bcryptjs.genSaltSync();
        // const hashPassword = bcryptjs.hashSync(value, hashSalt);
        // return hashPassword;
        return global.util.sha256(value);
    },
    resizeQueries: [],
    resizeQueriesInit: false,
    resizeQueryInterval: 15,
    resizeQueryLastCalled: 0,
    resizeQueryListener: _ => {
        var now = Date.now();
        var diff = now - global.util.resizeQueryLastCalled;
        if (diff > global.util.resizeQueryInterval) {
            global.util.resizeQuery();
        }
    },
    resizeQuery: (callback = null) => {
        if (!global.util.resizeQueriesInit) {
            global.util.resizeQueriesInit = true;
            window.addEventListener('resize', global.util.resizeQueryListener);
        }
        if (callback) {
            global.util.resizeQueries.push(callback);
        } else {
            for (var i in global.util.resizeQueries)
                global.util.resizeQueries[i]();
        }
    },
    resizeSchedule: (ms_delay) => {
        setTimeout(_ => {
            global.util.resizeQuery();
        }, ms_delay);
    }
};