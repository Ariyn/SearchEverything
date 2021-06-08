const { shell } = require('electron')

function Chrome(config) {
    let app = null;

    commands = {
        "timer": () => {
            shell.openExternal('https://vclock.kr/timer/')
            return "return"
        },
        "regexp101":() => {
            shell.openExternal("https://regex101.com/")
            return "return"
        },
        "github": () => {
            shell.openExternal("https://github.com/")
            return "return"
        }
    }

    function bind(_app) {
        app = _app;
    }

    function searchBoxInput(value) {
        console.log(value)

        results = []
        for(i in commands) {
            results.push({
                "title":i,
                "body": "",
            })
        }

        app.setSearchedResult(results);
    }

    function searchBoxCommand(event) {
        console.log(event, app.text)
        if(event.key == "Enter") {
            value = app.text;

            if(app.focusedIndex != -1) {
                value = app.searchedResult[app.focusedIndex]["title"]
                console.log(value);
            }
            
            if(commands.hasOwnProperty(value)) {
                return commands[value]()
            }
        }
    }

    function executeCommands(command) {

    }

    return {
        keyword: "chrome",
        bind,
        searchBoxInput,
        searchBoxCommand,
        config: {},
        useKeyword: true,
        showSearchedResult: function() {
            return true
        },
        showTextArea: function() {
            return false
        },
        commands: {
            ".+": executeCommands,
        }
    }
}