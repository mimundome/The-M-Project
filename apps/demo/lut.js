// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: �2010 M-Way Solutions GmbH. All rights reserved.
// Creator:   Dominik
// Date:      27.10.2010
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================


M.EventDispatcher.lookupTable = {

    "button_001" : {
        "click" : {
            "target" : Demo.LoginController.doClick
        },
        "mouseover" : {
            "target" : "Demo.LoginController",
            "action" : "doMouse"
        }
    },
    "button_002" : {
        "click" : {
            "target" : Demo.LoginController.doClick2
        },
        "mouseover" : {
            "target" : "Demo.LoginController",
            "action" : "doMouse"
        }
    }

}