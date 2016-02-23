/**
 * @author Swagatam Mitra
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document, console, brackets, $, Mustache */

define(function (require, exports, module) {
    "use strict";
    
    var _cachedClientX,
        _cachedClientY;
    
    var LATENCY_CORRECTION_TIMER,
        LATENCY_CORRECTION_TIME = 500;
    
    function _detectClick(touchPoint) {
        return (_cachedClientX === touchPoint.clientX && _cachedClientY === touchPoint.clientY);
        
    }
    
    function _triggerContextMenu(originalEvent, touchPoint) {
        var simulatedEvent = document.createEvent("MouseEvent");
        // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //                screenX, screenY, clientX, clientY, ctrlKey, 
        //                altKey, shiftKey, metaKey, button, relatedTarget);
        simulatedEvent.initMouseEvent("contextmenu", true, true, window, 1,
                                      touchPoint.screenX, touchPoint.screenY,
                                      touchPoint.clientX, touchPoint.clientY, originalEvent.ctrlKey,
                                      originalEvent.altKey, originalEvent.shiftKey, originalEvent.metaKey, 0, null);
        
        touchPoint.target.dispatchEvent(simulatedEvent);
    }
    
    function _triggerEvent(type, originalEvent, touchPoint) {
        var simulatedEvent = document.createEvent("MouseEvent");
        // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
        //                screenX, screenY, clientX, clientY, ctrlKey, 
        //                altKey, shiftKey, metaKey, button, relatedTarget);
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                      touchPoint.screenX, touchPoint.screenY,
                                      touchPoint.clientX, touchPoint.clientY, originalEvent.ctrlKey,
                                      originalEvent.altKey, originalEvent.shiftKey, originalEvent.metaKey, 0, null);
        
        touchPoint.target.dispatchEvent(simulatedEvent);
    }
    
    function _isMultiTouch(event) {
        return event.changedTouches.length > 1;
    }
    
    function _simulate(event) {
        var touches = event.changedTouches,
            touchPoint = touches[0],
            type = "";
    
        switch (event.type) {
        case "touchstart":
            type = "mousedown";
            break;
        case "touchmove":
            type = "mousemove";
            break;
        case "touchend":
            type = "mouseup";
            break;
        default:
            return;
        }

        _triggerEvent(type, event, touchPoint);

        if (_detectClick(touchPoint) && !LATENCY_CORRECTION_TIMER) {
            _triggerEvent("click", event, touchPoint);
            _cachedClientX = -1;
            _cachedClientY = -1;
            LATENCY_CORRECTION_TIMER = setTimeout(function () {
                clearTimeout(LATENCY_CORRECTION_TIMER);
                LATENCY_CORRECTION_TIMER = null;
            }, LATENCY_CORRECTION_TIME);
        } else {
            _cachedClientX = touchPoint.clientX;
            _cachedClientY = touchPoint.clientY;
        }
    }
        
    function touchHandler(event) {
        if (!_isMultiTouch(event) && !event.altKey) {
            _simulate(event);
            event.preventDefault();
        } else {
            return;
        }
    }

    function _init() {
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
    }
    
    exports.initTouchShim = _init;
    
});