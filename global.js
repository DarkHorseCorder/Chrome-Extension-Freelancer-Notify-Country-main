/*!
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 */
function fooTest(a) {
    alert(a)
}
function setCookie(a, b, c) {
    var d = new Date;
    d.setDate(d.getDate() + c), document.cookie = a + '=' + b + (c == null ? '' : ';expires=' + d.toUTCString()) + '; path=/; secure'
}
function setArrayCookie(a, b, c) {
    typeof b == 'object' && (b = JSON.stringify(b)), setCookie(a, b, c)
}
function setCookieToBrowser(a, b, c, d, e) {
    var f = new Date;
    f.setDate(f.getDate() + c), document.cookie = a + '=' + escape(b) + (f ? ';expires=' + f.toUTCString() : '') + (d ? ';path=' + d : '') + (e ? ';domain=' + e : '') + ';secure'
}
function getCookie(a) {
    var b = document.cookie;
    if (b.length > 0) {
        var c = b.indexOf(a + '=');
        if (c != -1) {
            c = c + a.length + 1;
            var d = b.indexOf(';', c);
            return d == -1 && (d = b.length), b.substring(c, d)
        }
    }
    return ''
}
function getArrayCookie(a) {
    var b = getCookie(a);
    return b ? JSON.parse(b) : []
}
function getCookieNameLikes(a) {
    if (document.cookie.length > 0) {
        var b = [], c = document.cookie.indexOf(a, 0);
        while (c != -1) {
            var d = document.cookie.indexOf('=', c + a.length + 1);
            if (d == -1)break;
            b.push(document.cookie.substring(c, d).replace('_savedsearch_', '')), c = document.cookie.indexOf(a, d)
        }
        return b
    }
    return ''
}
function getCookies(a) {
    var b = getCookieNameLikes(a), c, d = [];
    for (c = 0; c < b.length; c++) {
        var e = {};
        e.name = b[c], e.value = getCookie(b[c]), d.push(e)
    }
    return d
}
function getUserIdfromCookie() {
    return getCookie(getCookieBase() + '_USER_ID')
}
function lib_datetime_synchronise_time() {
    jQuery.ajax({
        url: '/ajax/timestamp.php', success: function (a) {
            var b = parseInt(a);
            if (!isNaN(b)) {
                var c = new Date;
                lib_datetime_timestamp_difference = 1e3 * b - c.getTime()
            }
        }
    })
}
function lib_datetime_relative_within_time(a) {
    var b = new Date, c = b.getTime();
    typeof lib_datetime_timestamp_difference == 'number' && (c += lib_datetime_timestamp_difference);
    if (parseInt(a) < 0)return !1;
    var d = parseInt(c / 1e3) - parseInt(a);
    return d > 0 ? !1 : (d = Math.abs(d), d < 60 ? d == 1 ? T_('1 second') : T_('<%= num %> seconds', {num: d}) : d < 3600 ? (d = parseInt(d / 60), d == 1 ? T_('1 minute') : T_('<%= num %> minutes', {num: d})) : d < 86400 ? (d = parseInt(d / 3600), d == 1 ? T_('1 hour') : T_('<%= num %> hours', {num: d})) : (d = parseInt(d / 86400), d == 1 ? T_('1 day') : T_('<%= num %> days', {num: d})))
}
function lib_datetime_relative_within_hours(a) {
    var b = new Date, c = b.getTime();
    typeof lib_datetime_timestamp_difference == 'number' && (c += lib_datetime_timestamp_difference);
    if (parseInt(a) < 0)return !1;
    var d = parseInt(c / 1e3) - parseInt(a), e;
    return d > 0 ? !1 : (d = Math.abs(d), e = parseInt(d % 3600 / 60), d = parseInt(d / 3600), d < 1 ? e < 2 ? T_('in less than 1 hour') : T_('in <%- diff %> hour, <%- min %> minutes', {
        diff: d,
        min: e
    }) : e < 2 ? T_('in <%- diff %> hours', {diff: d}) : T_('in <%- diff %> hours, <%- min %> minutes', {
        diff: d,
        min: e
    }))
}
function lib_datetime_relative_date(a) {
    var b = new Date, c = b.getTime();
    typeof lib_datetime_timestamp_difference == 'number' && (c += lib_datetime_timestamp_difference);
    if (!a || !parseInt(a) || parseInt(a) < 0)return T_('Just now');
    var d = parseInt(c / 1e3) - parseInt(a);
    if (!(d >= 0)) {
        d = Math.abs(d);
        if (d < 30)return T_('Just now');
        if (d < 60)return T_('<%- diff %> seconds left', {diff: d});
        if (d < 3600)return d = parseInt(d / 60), d == 1 ? T_('1 minute left') : T_('<%- diff %> minutes left', {diff: d});
        if (d < 86400) {
            var e = d % 3600;
            return e = parseInt(e / 60), d = parseInt(d / 3600), d == 1 ? e == 1 ? T_('1 hour, 1 minute left') : e == 0 ? T_('1 hour left') : T_('1 hour, <%- minutes %> minutes left', {minutes: e}) : e == 1 ? T_('<%- diff %> hours, 1 minute left', {diff: d}) : e == 0 ? T_('<%- diff %> hours left', {diff: d}) : T_('<%- diff %> hours, <%- minutes %> minutes left', {
                diff: d,
                minutes: e
            })
        }
        if (d < 1209600) {
            var f = d % 86400;
            return f = parseInt(f / 3600), d = parseInt(d / 86400), d == 1 ? f == 1 ? T_('1 day, 1 hour left') : f == 0 ? T_('1 day left') : T_('1 day, <%- hours %> hours left', {hours: f}) : f == 1 ? T_('<%- diff %> days, 1 hour left', {diff: d}) : f == 0 ? T_('<%- diff %> days left', {diff: d}) : T_('<%- diff %> days, <%- hours %> hours left', {
                diff: d,
                hours: f
            })
        }
        return T_('more than 2 weeks')
    }
    if (d < 30)return T_('Just now');
    if (d < 60)return T_('<%- diff %> seconds ago', {diff: d});
    if (d < 3600)return d = parseInt(d / 60), d == 1 ? T_('1 minute ago') : T_('<%- diff %> minutes ago', {diff: d});
    if (d < 86400)return d = parseInt(d / 3600), d == 1 ? T_('1 hour ago') : T_('<%- diff %> hours ago', {diff: d});
    if (d < 604800)return d = parseInt(d / 86400), d == 1 ? T_('Yesterday') : T_('<%- diff %> days ago', {diff: d});
    if (d < 2600640)return d = parseInt(d / 86400 / 7), d == 1 ? T_('Last week') : T_('<%- diff %> weeks ago', {diff: d});
    if (d < 31536e3)return d = parseInt(d / 86400 / 30), d == 1 ? T_('1 month ago') : T_('<%- diff %> months ago', {diff: d});
    if (d < 252288e3)return d = parseInt(d / 86400 / 365), d == 1 ? T_('1 year ago') : T_('<%- diff %> years ago', {diff: d})
}
function lib_datetime_relative_date_widget(a) {
    var b = new Date, c = b.getTime();
    typeof lib_datetime_timestamp_difference == 'number' && (c += lib_datetime_timestamp_difference);
    if (parseInt(a) < 0)return T_('Just now');
    var d = parseInt(c / 1e3) - parseInt(a);
    if (d >= 0)return lib_datetime_relative_date(a);
    d = Math.abs(d);
    if (d < 60)return T_('Ends in <%- diff %> seconds', {diff: d});
    if (d < 3600)return d = parseInt(d / 60), d == 1 ? T_('Ends in 1 minute') : T_('Ends in <%- diff %> minutes', {diff: d});
    if (d < 86400)return d = parseInt(d / 3600), d == 1 ? T_('Ends in an hour') : T_('Ends in <%- diff %> hours', {diff: d});
    if (d < 1209600)return d = parseInt(d / 86400), d == 1 ? T_('Ends in 1 day') : T_('Ends in <%- diff %> days', {diff: d});
    if (d < 2600640)return d = parseInt(d / 86400 / 7), T_('Ends in <%- diff %> weeks', {diff: d});
    if (d < 31536e3)return d = parseInt(d / 86400 / 30), d == 1 ? T_('Ends in 1 month') : T_('Ends in <%- diff %> months', {diff: d});
    if (d < 252288e3)return d = parseInt(d / 86400 / 365), d == 1 ? T_('Ends in 1 year') : T_('Ends in <%- diff %> years', {diff: d})
}
function convert_to_south_asian_currency(a) {
    a = String(a);
    var b = a.split('.'), c = b[0], d = /(\d+)(\d{3})/, e = 0, f = String(c).length, g = parseInt(f / 2 - 1);
    while (d.test(c)) {
        e > 0 ? c = c.replace(d, '$1,$2') : (c = c.replace(d, '$1,$2'), d = /(\d+)(\d{2})/), e++, g--;
        if (g == 0)break
    }
    return c
}
function rpt(a, b, c, d) {
    typeof d != 'function' && (d = addCommas);
    var e = jQuery(a).html();
    if (e == null)return;
    var f = e.replace(/[^0-9]/g, ''), g = Math.ceil(Math.random() * parseInt(b)), h = (parseInt(f) || 0) + parseInt(c), i = d(h);
    jQuery(a).text(i), setTimeout(function () {
        rpt(a, b, c, d)
    }, g)
}
function convert_to_south_asian_currency(a) {
    a = String(a);
    var b = a.split('.'), c = b[0], d = /(\d+)(\d{3})/, e = 0, f = String(c).length, g = parseInt(f / 2 - 1);
    while (d.test(c)) {
        e > 0 ? c = c.replace(d, '$1,$2') : (c = c.replace(d, '$1,$2'), d = /(\d+)(\d{2})/), e++, g--;
        if (g == 0)break
    }
    return c
}
function update_default_value(a, b) {
    jQuery(a).attr('placeholder', b)
}
function addCommas(a) {
    a += '';
    var b = a.split('.'), c = b[0], d = b.length > 1 ? '.' + b[1] : '', e = /(\d+)(\d{3})/;
    while (e.test(c))c = c.replace(e, '$1,$2');
    return c + d
}
function isObjectEmpty(a) {
    for (var b in a)return !1;
    return !0
}
function isInputInt(a) {
    return /^[1-9][0-9]*$/.test(a) ? !0 : !1
}
function is_float_format(a) {
    return /^\d+$/.test(a) || /^\d+\.\d+$/.test(a) ? !0 : !1
}
function isInputAmount(a) {
    return /^[0-9]{1,7}\.?[0-9]{0,2}$/.test(a) ? !0 : !1
}
function ordinal_num(a) {
    var b = ['th', 'st', 'nd', 'rd', 'th'], c = a < 21 ? a < 4 ? b[a] : b[0] : a % 10 > 4 ? b[0] : b[a % 10];
    return a + c
}
function format_money(a) {
    if (!/^\d+(\.)?\d*$/.test(a))return 'wrong format';
    var b = new Number(a);
    return b = b.toFixed(2), b
}
function roundOff(a, b) {
    if (typeof b == 'undefined')b = 2; else if (isNaN(b) || b < 0)b = 0;
    var c = parseFloat(a) || 0, d = Math.pow(10, b);
    return Math.round(c * d) / d
}
function format_int(a, b) {
    return format_float(a, 0, b)
}
function format_float(a, b, c) {
    if (!is_float_format(a))return 'wrong format: ' + a;
    a = new Number(a), a = a.toFixed(b);
    if (!c)return a;
    var d = a.length;
    b > 0 && (d = a.indexOf('.'));
    var e = '';
    for (var f = a.length - 1; f >= 0; f--) {
        e = e.insertAt(0, a.charAt(f));
        if (d != null && f >= d)continue;
        (d - f) % 3 == 0 && f != 0 && (e = e.insertAt(0, c))
    }
    return e
}
function returnProtocol() {
    return window.location.protocol
}
function format_num_in_mil(a) {
    a = new Number(a), a /= 1e6;
    var b = a.toFixed(1) == parseInt(a).toFixed(1) ? parseInt(a) : a.toFixed(1);
    return T_('<%- rounded_value %> million', {rounded_value: b})
}
function format_num_in_bil(a) {
    a = new Number(a), a /= 1e9;
    var b = a.toFixed(1) == parseInt(a).toFixed(1) ? parseInt(a) : a.toFixed(1);
    return T_('<%- rounded_value %> billion', {rounded_value: b})
}
function loading_html() {
    return '<div class="loadingImage"><img src="' + cdn_url('/img/ajax-loader.gif?v=62d3d0c60d4c33ef23dcefb9bc63e3a2&amp;m=6', '//') + '"></div>'
}
function loading_html_horizontal() {
    return '<div class="loadingImageHorizontal"><img src="' + cdn_url('/img/throbber_horizontal.gif?v=08f7300613ae8d915afe466794522e62&amp;m=6', '//') + '"></div>'
}
function T_(a, b) {
    if (typeof b == 'undefined' || !b)return a;
    var c = _.template(a, b), d = _.templateSettings;
    return _.templateSettings = {
        evaluate: /<\[([\s\S]+?)\]>/g,
        interpolate: /<\[=([\s\S]+?)\]>/g,
        escape: /<\[-([\s\S]+?)\]>/g
    }, c = _.template(c, b), _.templateSettings = d, c
}
function bookmarkToggle(a, b) {
    a == 'on' ? jQuery(b).addClass('selected').data('action', 'off') : jQuery(b).removeClass('selected').data('action', 'on')
}
function bookmarkFail(a, b) {
    a == 'on' ? jQuery(b).removeClass('selected').data('action', 'on') : jQuery(b).addClass('selected').data('action', 'off')
}
function followToggle(a, b) {
    jQuery(b).removeClass('btn-danger'), a == 'on' ? (jQuery(b).addClass('ns_on').data('action', 'off'), jQuery(b).addClass('btn-success'), jQuery(b).children('span').html('Following'), jQuery(b).children('i').addClass('fl-icon-ok-sign').removeClass('fl-icon-plus-sign fl-icon-remove-sign')) : (jQuery(b).removeClass('ns_on').removeClass('ns_off').data('action', 'on'), jQuery(b).removeClass('btn-success'), jQuery(b).children('span').html('Follow'), jQuery(b).children('i').addClass('fl-icon-plus-sign').removeClass('fl-icon-ok-sign fl-icon-remove-sign'))
}
function followFail(a, b) {
    jQuery(b).removeClass('btn-danger'), a == 'on' ? (jQuery(b).removeClass('ns_on').data('action', 'on'), jQuery(b).removeClass('btn-success'), jQuery(b).children('span').html('Follow'), jQuery(b).children('i').addClass('icon-plus-sign').removeClass('fl-icon-ok-sign fl-icon-remove-sign')) : (jQuery(b).addClass('ns_on').data('action', 'off'), jQuery(b).addClass('btn-success'), jQuery(b).children('span').html('Following'), jQuery(b).children('i').addClass('fl-icon-ok-sign').removeClass('icon-plus-sign fl-icon-remove-sign'))
}
function inlineError(a) {
    var b = splitMsg(a), c = jq('#inlineFollowErrors');
    if (!c.length)return;
    c.html('<p>' + b + '</p>'), c.show().delay(15e3).slideToggle()
}
function splitMsg(a) {
    var b = '';
    return a instanceof Array ? jQuery.each(a, function (a, c) {
        b += (a == 0 ? '' : '<br>') + c
    }) : b = a, b
}
function bookmarkError(a, b) {
    var c = jQuery(a).offset(), d = parseInt(c.top), e = parseInt(c.left), f = splitMsg(b), a = jQuery('<div class="bubble error"><p>' + f + '</p></div>').insertAfter(a).offset({
        top: d - 15,
        left: e - 320
    });
    setTimeout(function () {
        jQuery(a).fadeOut(1e3, function () {
            jQuery(this).remove()
        })
    }, 3e3)
}
function contestBookmarkError(a, b) {
    var c = jQuery(a).offset(), d = parseInt(c.top), e = parseInt(c.left), f = splitMsg(b), a = jQuery('<div class="alert alert-danger contest-bookmarked-error"><p>' + f + '</p></div>').insertAfter(a).offset({
        top: d - 15,
        left: e - 320
    });
    setTimeout(function () {
        jQuery(a).fadeOut(1e3, function () {
            jQuery(this).remove()
        })
    }, 3e3)
}
function cdn_url(a, b) {
    b = 'https://';
    var c = flns.config.cdn_urls[Math.abs(crc32(a)) % flns.config.cdn_urls.length];
    return b + c + a
}
function getQueryStringValueByName(a) {
    a = a.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var b = '[\\?&]' + a + '=([^&#]*)', c = new RegExp(b), d = c.exec(window.location.href);
    return d == null ? '' : decodeURIComponent(d[1].replace(/\+/g, ' '))
}
function updateQueryStringParam(a, b, c, d) {
    d || (d = window.location.href);
    var e = d.split('#'), f = e[0] || d;
    if (typeof a != 'undefined' && a) {
        var g = new RegExp('([\\?&])' + a + '=.*?(&|$)', 'gi');
        if (g.test(e[0]))typeof b != 'undefined' && b !== null ? f = e[0].replace(g, '$1' + a + '=' + b + '$2') : f = e[0].replace(g, '$1').replace(/(&|\?)$/, ''); else if (typeof b != 'undefined' && b !== null) {
            var h = e[0].indexOf('?') !== -1 ? '&' : '?';
            f = e[0] + h + a + '=' + b
        }
    }
    return typeof c != 'undefined' && c && (e[1] = c), e[1] && (f += '#' + e[1]), f
}
function applyNotificationActions(a) {
}
function isBrowserOSMobile() {
    var a = navigator.userAgent.toLowerCase();
    return a.search('android') > -1 ? !0 : a.search('iphone') > -1 || a.search('ipad') > -1 || a.search('ipod') > -1 || a.search('ios') > -1 ? !0 : a.search('webos') > -1 ? !0 : a.search('series40') > -1 || a.search('series60') > -1 ? !0 : a.search('symbian') > -1 ? !0 : a.search('blackberry') > -1 ? !0 : a.search('windows phone') > -1 || a.search('windows ce') > -1 ? !0 : a.search('nokia') > -1 ? !0 : a.search('sumsung') > -1 ? !0 : a.search('firefox os') > -1 ? !0 : a.search('bada') > -1 ? !0 : !1
}
function getURLParameter(a) {
    return unescape((RegExp(a + '=' + '(.+?)(&|$)').exec(location.search) || [, ''])[1])
}
function getURLDomain(a) {
    var b = a.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i);
    return b && b[1]
}
function isReferrerExternal(a) {
    typeof a == 'undefined' && (a = !1);
    var b = document.referrer, c = getURLDomain(document.referrer);
    if (b != null && b != '' && c != document.domain) {
        var d = jQuery('link[rel^="alternate"]').map(function () {
            return getURLDomain(jQuery(this).attr('href'))
        });
        for (var e = 0; e < d.length; e++)if (c == d[e])return !1;
        return !0
    }
    return b === '' && !a ? !0 : !1
}
function loadSvg(a) {
    var b = new XMLHttpRequest, c = '/static/icons/' + a + '.svg';
    b.open('GET', c, !0), b.send();
    var d = document.createElement('SPAN');
    return d.className = 'async-' + a, b.onload = function (a) {
        var c = document.getElementsByClassName(d.className);
        for (i = 0; i < c.length; i++)b.status === 200 ? c[i].outerHTML = b.responseText : c[i].parentNode && c[i].parentNode.removeChild(c[i])
    }, d.outerHTML
}
function setReferralCookie() {
    var a = document.referrer, b = jQuery('link[rel^="alternate"]').map(function () {
        return getURLDomain(jQuery(this).attr('href'))
    });
    for (var c = 0; c < b.length; c++)getCookie(flns.config.cookie_base + '_REFERRAL_URL') != '' && getURLDomain(getCookie(flns.config.cookie_base + '_REFERRAL_URL')) === b[c] && setCookieToBrowser(flns.config.cookie_base + '_REFERRAL_URL', a, -45, '/', flns.config.cookie_domain);
    isReferrerExternal(!0) && setCookieToBrowser(flns.config.cookie_base + '_REFERRAL_URL', a, 365, '/', flns.config.cookie_domain)
}
function getAuthHeader() {
    var a = getCookie(flns.config.cookie_base + '_AUTH_HASH_V2'), b = getUserIdfromCookie();
    return {'Freelancer-Auth-V2': b + ';' + a}
}
function trackDeadCode(a, b) {
    _t.push(['user_action', {section: 'CheckJS', label: a, name: 'file_name', value: b}])
}
function generateRandomString(a, b) {
    var c = '';
    for (var d = a; d > 0; --d)c += b[Math.round(Math.random() * (b.length - 1))];
    return c
}
function getCSRFToken() {
    var a = getCookie('XSRF-TOKEN');
    return a || (a = generateRandomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), setCookie('XSRF-TOKEN', a, 7)), a
}
function pushTtrefOpenProjectCard(a) {
    window._ttref.push(['_clearEntrypoint', 'ProjectAward']), window._ttref.push(['_setCookie', 'ProjectAward_RecentProjectsCard']), window._ttref.push(['_trackEvent', 'ProjectAward', 'PVPRedirect', a, 'project_id', a])
}
jQuery.fn.navHover = function () {
    jQuery(this).mouseover(function () {
        jQuery(this).addClass('over')
    }).mouseout(function () {
        jQuery(this).removeClass('over')
    })
}, String.prototype.insertAt = function (a, b) {
    var c = this.substring(0, a), d = this.substring(a);
    return c + b + d
}, jQuery(document).ready(function () {
    jQuery('.nav-secondary .login-dropdown').click(function () {
        jQuery('.nav-secondary .user-dropdown').is(':visible') ? (jQuery(this).removeClass('active'), jQuery('.nav-secondary .user-dropdown').hide()) : (jQuery(this).addClass('active'), jQuery('.nav-secondary .user-dropdown').show())
    }), jQuery('body').on('click', function (a) {
        jQuery(a.target).hasClass('login-dropdown') || (jQuery('.nav-secondary .user-dropdown').hide(), jQuery('.nav-secondary .login-dropdown').removeClass('active'))
    });
    var a;
    jQuery('.logo-drop').hover(function () {
        a = setTimeout(function () {
            jQuery('.site-dropdown').show()
        }, 400)
    }, function () {
        clearTimeout(a), jQuery('.site-dropdown').hide()
    }), jQuery.getJSON('/ajax/count-24h.php', function (a) {
        var b = a.user_count_24h, c = 864e5 / b, d = a.project_count_24h, e = 864e5 / d;
        rpt('.totalFp', c, 1), rpt('.totalPJ', e, 1)
    }), jQuery('body').on('click', '.country', function () {
        jQuery('#box-country').toggle()
    }), jQuery('#search_projects').click(function () {
        return jQuery('.search form').attr('action', '/search/search.php'), jQuery('.search form').attr('method', 'POST'), update_default_value('#searchbox', 'Search Projects'), jQuery('#searchbox').attr('name', 'keyword'), jQuery('#searchbox').val() != '' && jQuery('.search form').submit(), !1
    }), jQuery('#search_users').click(function () {
        return jQuery('.search form').attr('action', '/users/search/'), jQuery('.search form').attr('method', 'POST'), jQuery('.search form').append('<input type="hidden" name="search" value=1>'), update_default_value('#searchbox', 'Search Users'), jQuery('#searchbox').attr('name', 'username'), jQuery('#searchbox').val() != '' && jQuery('.search form').submit(), !1
    }), jQuery('.dropdown-menu input').click(function () {
        return !1
    }), jQuery.getJSON('/ajax/_general_vars.php', function (a) {
        jQuery('.stat .totalFp, .site-stat .totalFp, #findPageIndexLandingTotalFp').html(format_int(a.user_count, ',')), jQuery('.stat .currency-sign').html(a.currency_sign), jQuery('.stat .currency-code').html(a.currency_code), jQuery('.stat .totalPJ, .site-stat .totalPJ, #findPageIndexLandingTotalPJ').html(format_int(a.project_count, ',')), jQuery('.txt-user-in-million').html(format_num_in_mil(a.user_count)), jQuery('.txt-project-in-million').html(format_num_in_mil(a.project_count)), jQuery('.COUNT-REGISTERED-USER').html(format_int(a.user_count, ',')), jQuery('.COUNT-PROJECT').html(a.project_count), jQuery('.COUNT-ONLINE-USER').html(format_int(a.onlineusercount, ','))
    }), jQuery('#domain-switcher-template').length > 0 && jQuery.getJSON('/ajax/getDomainSwitcherDomains.php', function (a) {
        var b = 0;
        for (var c = 0; c < a.regions.length; c++)b < a.regions[c].domains.length && (b = a.regions[c].domains.length);
        var d = [], e = null;
        for (var c = 0; c < a.regions.length; c++) {
            e !== null && (e.numCountries + a.regions[c].domains.length < b ? (e.regions.push(a.regions[c]), e.numCountries += a.regions[c].domains.length) : (d.push(e), e = null)), e === null && (e = {
                regions: [a.regions[c]],
                numCountries: a.regions[c].domains.length
            });
            for (var f = 0; f < a.regions[c].domains.length; f++)a.regions[c].domains[f].current == 1 && (jQuery('.country-drop-down .selected-country').text(a.regions[c].domains[f].name), jQuery('.countries.selected-flag').addClass('icon-flag-' + a.regions[c].domains[f].short_name))
        }
        e !== null && d.push(e), jQuery('#country-list .country-list').html(jQuery(_.template(jQuery('#domain-switcher-template').html(), {cols: d})))
    }), jQuery('.selector.country').click(function () {
        jQuery('#country-list').toggle()
    }), jQuery('body').on('click', function (a) {
        jQuery('.nav-menu-dropdown:visible').parent().find(jQuery(a.target)).length == 0 && jQuery('.nav-menu-dropdown').hide();
        if (!jQuery('#country-list').is(':visible'))return;
        var b = jQuery(a.target);
        b.closest('.country-drop-down').length == 0 && jQuery('#country-list').hide()
    }), jQuery('#tabmanager_help .open_tab, .loggedout_header .help .open_tab').click(function () {
        jQuery(this).siblings('.help.nav-menu-dropdown').toggle(), jQuery('#realtime-notification, #message-notification').hide()
    });
    var b = jQuery('#nav-sub-wrap'), c = jQuery('#nav-fixed'), d;
    b.length > 0 && c.length > 0 && (d = b.offset().top);
    var e = jQuery('#nav-main'), f = jQuery('#main-nav-fixed');
    if (e.length > 0 && f.length > 0)var g = e.offset().top;
    jQuery(window).scroll(function () {
        d && (jQuery(window).scrollTop() > d ? (b.hide(), jQuery('#tabmanager_pmbs').insertBefore(jQuery('#userInfo')), jQuery('#tabmanager_notify').insertBefore(jQuery('#userInfo')), jQuery('#tabmanager_live').insertBefore(jQuery('#userInfo')), c.show()) : (c.hide(), jQuery('#tabmanager_pmbs').insertBefore(jQuery('#tabmanager_help')), jQuery('#tabmanager_notify').insertBefore(jQuery('#tabmanager_help')), jQuery('#tabmanager_live').insertBefore(jQuery('#tabmanager_help')), b.show())), g && (jQuery(window).scrollTop() > g ? (e.hide(), f.show()) : (f.hide(), e.show())), jQuery(window).scrollTop() > 0 ? jQuery('#to-top').show() : jQuery('#to-top').hide()
    }), jQuery('#to-top').click(function () {
        return jQuery('html,body').animate({scrollTop: '0px'}, 1500), !1
    }), jQuery(document).ready(function () {
        jQuery(window).width() >= 1250 ? jQuery('.feature-corner').show() : jQuery(window).width() <= 1250 && jQuery('.feature-corner').hide(), jQuery(window).resize(function () {
            jQuery(window).width() >= 1250 ? jQuery('.feature-corner').show() : jQuery(window).width() <= 1250 && jQuery('.feature-corner').hide()
        }), jQuery('#myCarousel').carousel(), jQuery('#myCarousel').bind('slid', function () {
            var a = jQuery('.carousel-inner').find('.item.active').index(), b = jQuery('.carousel-indicators-lp li');
            b.eq(a - 1).removeClass('active'), b.eq(a + 1).removeClass('active'), b.eq(a).addClass('active');
            if (jQuery('.carousel-inner').find('.item.active').is(':last-child')) {
                var c = jQuery('.carousel-inner div');
                c.delay(4500).queue(function (a) {
                    jQuery('#myCarousel').carousel(0), a()
                })
            }
        })
    }), jQuery('.carousel-control').click(function () {
        var a = jQuery('.carousel-inner').find('.item.active').index(), b = jQuery(this).attr('data-slide'), c = jQuery('.carousel-inner').find('div').length, d = jQuery('.carousel-indicators-lp li');
        b == 'next' && a < c && (d.eq(a).removeClass('active'), d.eq(a + 1).addClass('active')), b == 'prev' && a > 0 && (d.eq(a).removeClass('active'), d.eq(a - 1).addClass('active'))
    }), jQuery('body').on('click', '.bookmark-btn', function () {
        var a = this, b = jQuery(this).data('action');
        jQuery.ajax({
            url: '/projects/watch.php',
            type: 'post',
            data: {project_id: jQuery(a).data('project-id'), action: b},
            dataType: 'json',
            cache: !1,
            timeout: 1e4,
            tryCount: 0,
            retryLimit: 5,
            beforeSend: function () {
                bookmarkToggle(b, a)
            },
            success: function (c) {
                if (c == null)bookmarkError(a, 'Oops! There seems to be a server problem, please try again later.'); else {
                    if (c['status'] == 'success')return;
                    bookmarkError(a, c.errors)
                }
                bookmarkFail(b, a)
            },
            error: function (c, d, e) {
                if (d == 'timeout' || c.status == 502) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        jQuery.ajax(this);
                        return
                    }
                    bookmarkError(a, 'Seem we lost connection to server somehow')
                }
                c.status == 500 ? bookmarkError(a, 'Oops! There seems to be a server problem, please try again later.') : bookmarkError(a, 'Oops! There was a problem, sorry.'), bookmarkFail(b, a)
            }
        })
    }), jQuery('body').on('click', '.contest-bookmark-btn', function () {
        var a = this, b = jQuery(this).data('action');
        jQuery.ajax({
            url: '/contest/watch.php',
            type: 'post',
            data: {contest_id: jQuery(a).data('contest-id'), action: b},
            dataType: 'json',
            cache: !1,
            timeout: 1e4,
            tryCount: 0,
            retryLimit: 5,
            beforeSend: function () {
                bookmarkToggle(b, a)
            },
            success: function (c) {
                if (c == null)contestBookmarkError(a, T_('Oops! There seems to be a server problem, please try again later.')); else {
                    if (c['status'] == 'success')return;
                    contestBookmarkError(a, c.errors)
                }
                bookmarkFail(b, a)
            },
            error: function (c, d, e) {
                if (d == 'timeout' || c.status == 502) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        jQuery.ajax(this);
                        return
                    }
                    contestBookmarkError(a, T_('Seem we lost connection to server somehow'))
                }
                c.status == 500 ? contestBookmarkError(a, T_('Oops! There seems to be a server problem, please try again later.')) : contestBookmarkError(a, T_('Oops! There was a problem, sorry.')), bookmarkFail(b, a)
            }
        })
    }), jQuery('body').on('click', '.follow-btn', function () {
        var a = this, b = jQuery(this).data('action');
        jQuery.ajax({
            url: '/users/watch.php',
            type: 'post',
            data: {user_id: jQuery(a).data('user-id'), action: b},
            dataType: 'json',
            cache: !1,
            timeout: 1e4,
            tryCount: 0,
            retryLimit: 5,
            beforeSend: function () {
                jQuery(a).attr('style', '-khtml-opacity:0.3;opacity:0.3'), jQuery(a).removeClass('follow-btn')
            },
            success: function (c) {
                if (c == null)bookmarkError(a, 'Oops! There seems to be a server problem, please try again later.'), jQuery(a).attr('style', ''), jQuery(a).addClass('follow-btn'); else {
                    if (c['status'] == 'success') {
                        jQuery(a).attr('style', ''), jQuery(a).addClass('follow-btn'), followToggle(b, a);
                        return
                    }
                    inlineError(c.errors)
                }
                followFail(b, a)
            },
            error: function (c, d, e) {
                jQuery(a).attr('style', ''), jQuery(a).addClass('follow-btn');
                if (d == 'timeout' || c.status == 502) {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        jQuery.ajax(this);
                        return
                    }
                    bookmarkError(a, 'Seem we lost connection to server somehow')
                }
                c.status == 500 ? bookmarkError(a, 'Oops! There seems to be a server problem, please try again later.') : bookmarkError(a, 'Oops! There was a problem, sorry.'), followFail(b, a)
            }
        })
    }), jQuery('.follow-btn').hover(function () {
        jQuery(this).hasClass('ns_on') && (jQuery(this).removeClass('ns_on').addClass('ns_off'), jQuery(this).children('span').html(T_('Unfollow'))), jQuery(this).hasClass('btn-success') && (jQuery(this).removeClass('btn-success').addClass('btn-danger'), jQuery(this).children('span').html(T_('Unfollow')), jQuery(this).children('i').addClass('fl-icon-remove-sign').removeClass('fl-icon-plus-sign, fl-icon-ok-sign'))
    }, function () {
        jQuery(this).hasClass('ns_off') && (jQuery(this).addClass('ns_on').removeClass('ns_off'), jQuery(this).children('span').html(T_('Following'))), jQuery(this).hasClass('btn-danger') && (jQuery(this).addClass('btn-success').removeClass('btn-danger'), jQuery(this).children('span').html(T_('Following')), jQuery(this).children('i').addClass('fl-icon-ok-sign').removeClass('fl-icon-plus-sign, fl-icon-remove-sign'))
    }), jQuery('#btn-post-first-project-fixed').click(function () {
        jQuery('#post-fixed').submit()
    }), jQuery('#skill_category-fixed').change(function () {
        jQuery('.nav-fixed-cta .inner').width('220px'), jQuery('#skill_category-fixed').width('200px'), jQuery('#skill_subcategory-fixed').width('310px'), jQuery('#skill_subcategory-fixed').css('margin-left', '0px'), jQuery('#skill_subcategory-fixed').show(), jQuery('#skill_subcategory-fixed').attr('disabled'), jQuery('#skill_subcategory-fixed').css('background', '#CCC'), jQuery('#skill_subcategory-fixed').css('display', 'inline'), jQuery.getJSON('/ajax/skill-bundle.php', {category: jQuery('#skill_category-fixed').val()}, function (a) {
            var b = '';
            for (var c = 0; c < a.length; c++)b += '<option value="' + a[c].id + '">' + a[c].name + '</option>';
            jQuery('#skill_subcategory-fixed').removeAttr('disabled'), jQuery('#skill_subcategory-fixed').css('background', '#FFF'), jQuery('#skill_subcategory-fixed').html(b)
        })
    }), setReferralCookie(), function (a) {
        a('.myProjectTab').on('mouseenter', function () {
            var b = a('#myproject_navbar_projectelement_template').html(), c = a('#myproject_navbar_contestelement_template').html();
            if (b != null && c != null) {
                var d = _.template(b), e = _.template(c);
                a('.myProjectBar .ajaxLoader').length > 0 && !a('.myProjectBar .ajaxLoader').is(':visible') && a.ajax({
                    type: 'get',
                    url: '/ajax/dashboard/projects.php?category=active&sort=latest&type=all&num=3',
                    data: [],
                    dataType: 'json',
                    beforeSend: function () {
                        a('.myProjectBar').find('.ajaxLoader').show()
                    },
                    complete: function () {
                        a('.myProjectBar .ajaxLoader').length > 0 && a('.myProjectBar').find('.ajaxLoader').remove()
                    },
                    success: function (b) {
                        a('.myProjectBar').find('.ajaxLoader').remove();
                        if (b.length > 0 && b.length < 4)for (var c = b.length - 1; c >= 0; c--)b[c].type == 'project' ? (b[c].name.length > 77 && (b[c].name = b[c].name.substr(0, 75) + '...'), a('.myProjectBar').prepend(d(b[c]))) : (b[c].contestName.length > 48 && (b[c].contestName = b[c].contestName.substr(0, 45) + '...'), a('.myProjectBar').prepend(e(b[c])))
                    },
                    error: function () {
                        a('.myProjectBar').find('.ajaxLoader').remove()
                    }
                })
            }
        })
    }(jQuery.noConflict())
}), function () {
    var a = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
    crc32 = function (b, c) {
        c == window.undefined && (c = 0);
        var d = 0, e = 0;
        c ^= -1;
        for (var f = 0, g = b.length; f < g; f++)d = (c ^ b.charCodeAt(f)) & 255, e = '0x' + a.substr(d * 9, 8), c = c >>> 8 ^ e;
        return c ^ -1
    }
}(), 'map'in Array.prototype || (Array.prototype.map = function (a, b) {
    var c = new Array(this.length);
    for (var d = 0, e = this.length; d < e; d++)d in this && (c[d] = a.call(b, this[d], d, this));
    return c
}), Object.keys || (Object.keys = function () {
    var a = Object.prototype.hasOwnProperty, b = !{toString: null}.propertyIsEnumerable('toString'), c = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'], d = c.length;
    return function (e) {
        if (typeof e != 'object' && typeof e != 'function' || e === null)throw new TypeError('Object.keys called on non-object');
        var f = [];
        for (var g in e)a.call(e, g) && f.push(g);
        if (b)for (var h = 0; h < d; h++)a.call(e, c[h]) && f.push(c[h]);
        return f
    }
}()), jQuery.extend({
    parseQueryString: function () {
        var a = {}, b = window.location.search.replace('?', ''), c = b.split('&');
        return jQuery.each(c, function (b, c) {
            var d = c.split('=');
            a[d[0]] = d[1]
        }), a
    }
}), function (a) {
    a.fn.hoverIntent = function (b, c, d) {
        var e = {interval: 100, sensitivity: 7, timeout: 0};
        typeof b == 'object' ? e = a.extend(e, b) : a.isFunction(c) ? e = a.extend(e, {
            over: b,
            out: c,
            selector: d
        }) : e = a.extend(e, {over: b, out: b, selector: c});
        var f, g, h, i, j = function (a) {
            f = a.pageX, g = a.pageY
        }, k = function (b, c) {
            c.hoverIntent_t = clearTimeout(c.hoverIntent_t);
            if (Math.abs(h - f) + Math.abs(i - g) < e.sensitivity)return a(c).off('mousemove.hoverIntent', j), c.hoverIntent_s = 1, e.over.apply(c, [b]);
            h = f, i = g, c.hoverIntent_t = setTimeout(function () {
                k(b, c)
            }, e.interval)
        }, l = function (a, b) {
            return b.hoverIntent_t = clearTimeout(b.hoverIntent_t), b.hoverIntent_s = 0, e.out.apply(b, [a])
        }, m = function (b) {
            var c = jQuery.extend({}, b), d = this;
            d.hoverIntent_t && (d.hoverIntent_t = clearTimeout(d.hoverIntent_t)), b.type == 'mouseenter' ? (h = c.pageX, i = c.pageY, a(d).on('mousemove.hoverIntent', j), d.hoverIntent_s != 1 && (d.hoverIntent_t = setTimeout(function () {
                k(c, d)
            }, e.interval))) : (a(d).off('mousemove.hoverIntent', j), d.hoverIntent_s == 1 && (d.hoverIntent_t = setTimeout(function () {
                l(c, d)
            }, e.timeout)))
        };
        return this.on({'mouseenter.hoverIntent': m, 'mouseleave.hoverIntent': m}, e.selector)
    }
}(jQuery), jQuery.ajaxPrefilter(function (a, b, c) {
    var d = getCSRFToken();
    c.setRequestHeader('X-XSRF-TOKEN', d)
})