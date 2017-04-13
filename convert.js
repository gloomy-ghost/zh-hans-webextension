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

function getJSON(url){
    let data,
        request = new XMLHttpRequest();
    request.open('GET', url, false);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400)
        data = JSON.parse(this.response);
    };

    request.send();
    return data;
}

const HansDict = getJSON('/dict/hans.json'),
      WordDict = getJSON('/dict/word.json');

const wordCache = new Set();
for (const word in WordDict){
    wordCache.add(word[0]);
}
Object.assign(HansDict, WordDict);


function convert(content){
    const arr = content.split(''),
          converted = new Set();

    for (let index = 0; index < arr.length; index++){
        const character = arr[index];
        if (converted.has(character)){
            continue;
        }

        let from = character,
            to = HansDict[character];

        if (wordCache.has(character)){
            let word = character;
            for (let offset = 1; offset < 8; offset++){
                word += arr[index+offset];
                const hans = HansDict[word];
                if (hans){
                    from = word;
                    to = hans;
                    break;
                }
            }
        }

        if (to){
            content = content.replace(RegExp(from, 'gm'), to);
            converted.add(from);
        }
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
