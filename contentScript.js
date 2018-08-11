(function() {
    browser.runtime.sendMessage(document.title)
    .then((result)=>{
        document.title = result;
    });

    const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (treeWalker.nextNode()) {
        let node = treeWalker.currentNode;
        if (node.nodeValue.length){
            browser.runtime.sendMessage(node.nodeValue)
                .then((result)=>{
                    node.nodeValue = result;
                });
        }
    }
})();
