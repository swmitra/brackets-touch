/*
 * @author Swagatam Mitra
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4,
maxerr: 50, browser: true */
/*global define, brackets */

define(function (require, exports, module) {
    "use strict";

    var AppInit              = brackets.getModule("utils/AppInit"),
        TouchShim            = require("TouchToMouseEmulator");

    AppInit.appReady(function () {
        TouchShim.initTouchShim();
    });

});
