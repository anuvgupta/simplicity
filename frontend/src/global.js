// globals

global.config = {
    // api_url: 'http://localhost:5000/api',
    // api_url: 'http://localhost:30010/api',
    api_url: `${window.location.protocol}//${window.location.host}/api`
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
    }
};