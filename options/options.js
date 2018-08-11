'use strict';
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton'),
    removeButton = document.getElementById('removeButton'),
    autoconvert = document.getElementById('autoconvert'),
    newWhitelistDomain = document.getElementById('newWhitelistDomain'),
    excludedDomainsBox = document.getElementById('excludedDomainsBox');

    function appendToListBox(boxId, text) {
        const elt = new Option();
        elt.text = text;
        elt.value = text;
        document.getElementById(boxId).appendChild(elt);
    }
    function removeFromListBox(boxId, text) {
        let list = document.getElementById(boxId);
        for (let i = 0; i < list.length; i++)
            if (list.options[i].value === text)
                list.remove(i--);
    }

    // existing state
    for (let i = 0 ; i < localStorage.length; i++){
        const domain = localStorage.key(i);
        if (Number(localStorage.getItem(domain)) === 1)
            appendToListBox('excludedDomainsBox', domain);
    }
    autoconvert.value = localStorage.getItem("ask_permission");

    // click listener
    addButton.addEventListener('click', function () {
        localStorage[newWhitelistDomain.value] = 1;
        appendToListBox('excludedDomainsBox', newWhitelistDomain.value);
        newWhitelistDomain.value = '';
    });

    removeButton.addEventListener('click', function () {
        for (const domain of excludedDomainsBox.options){
            if (domain.selected){
                localStorage.removeItem(domain.value);
                removeFromListBox('excludedDomainsBox', domain.value);
            }
        }
    });

    autoconvert.addEventListener('click', () => {
        localStorage["ask_permission"] = autoconvert.checked;
    });
});
