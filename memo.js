function Memo() {
    var memoMode = {
        Search: 1,
        Edit: 2,
    }
    var app = null;
    var mode = memoMode.Search;

    var focusedItem = null;
    var focusedIndex = -1;
    
    function bind(_app) {
        app = _app;
    }

    function searchBoxInput(value) {
        items = ipcRenderer.sendSync("memo-request", "search", value)
        app.setSearchedResult(items)
    }

    function searchBoxCommand(event) {
        if (mode == memoMode.Search && event.key == "Enter" && focusedItem != null) {
            console.log(mode)
            mode = memoMode.Edit;
            
            app.input = "memo " + focusedItem.title;
            app.showTextArea();

            if(focusedIndex != -1) {
                app.textAreaText = focusedItem.body
            }
        } else if (mode == memoMode.Search && event.key == "Escape") {
            console.log("return")
            return "return"
        } else if (mode == memoMode.Edit && event.key == "Escape") {
            mode = memoMode.Search;
            app.hideTextArea();
            app.textAreaText = "";
        } else if (mode == memoMode.Edit && event.key == "Enter" && event.ctrlKey) {
            console.log("ctrl + enter input!")
            title = app.input.replace("memo ", "")
            console.log(title, app.textAreaText)
            
            const result = ipcRenderer.sendSync('memo-request', "save", title, app.textAreaText)
            console.log(result)

            app.hideTextArea();
            mode = memoMode.Search;

            // update memo search code
            items = ipcRenderer.sendSync("memo-request", "search", title)
            console.log(items)
            app.setSearchedResult(items)
        }
    }

    function changedFocusedResult(index, item) {
        focusedIndex = index;
        focusedItem = item;
    }

    function showSearchedResult() {
        return mode == memoMode.Search;
    }

    function showTextArea() {
        return mode == memoMode.Edit;
    }

    return {
        keyword: "memo",
        config:{
            searchBox: {
                deleteKeyword: true,
            },
        },
        useKeyword: true,
        bind,
        searchBoxInput,
        searchBoxCommand,
        changedFocusedResult,
        showSearchedResult,
        showTextArea,
    }
}