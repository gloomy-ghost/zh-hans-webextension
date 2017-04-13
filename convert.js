/**
 *  Copyright © 2017 ghost
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';
function convert(content){
    const characters = new Set(content);
    for (let character of characters){
        const hans = HansDict[character];
        if (hans)
            content = content.replace(RegExp(character, 'gm'), hans);
    }
    return content;
}

browser.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
        const title = convert(message.title),
              html = convert(message.html);

        sendResponse({
            title,
            html
        });
    }
)

const contentScript = '\
    browser.runtime.sendMessage({\
        title: document.title,\
        html: document.body.innerHTML\
    })\
    .then((result) => {\
        document.title = result.title;\
        document.body.innerHTML = result.html;\
    });\
'

browser.browserAction.onClicked.addListener(
    () => {
        browser.tabs.executeScript(
            {code: contentScript}
        )
    }
)
