const button = document.getElementById('button')
const inputter = document.getElementById('inputter')
const netWorthContainer = document.getElementById('net-worth')
const type = document.getElementsByName('type')
const value = document.getElementById('value')


/*
    Function to display information about the Neutralino app.
    This function updates the content of the 'info' element in the HTML
    with details regarding the running Neutralino application, including
    its ID, port, operating system, and version information.
*/
function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT} inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `
}

/*
    Function to set up a system tray menu with options specific to the window mode.
    This function checks if the application is running in window mode, and if so,
    it defines the tray menu items and sets up the tray accordingly.
*/
function setTray() {
    // Tray menu is only available in window mode
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.")
        return
    }

    // Define tray menu items
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    }

    // Set the tray menu
    Neutralino.os.setTray(tray)
}

/*
    Function to handle click events on the tray menu items.
    This function performs different actions based on the clicked item's ID,
    such as displaying version information or exiting the application.
*/
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            // Display version information
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`)
            break
        case "QUIT":
            // Exit the application
            Neutralino.app.exit()
            break
    }
}

/*
    Function to handle the window close event by gracefully exiting the Neutralino application.
*/
function onWindowClose() {
    Neutralino.app.exit()
}


/**
 * @description Updates the net worth of the user.
 */
async function updateNetWorth() {
    const content = await Neutralino.filesystem.readFile('./data.json')
    let data = JSON.parse(content)
    let netWorth = 0
    data.assets.forEach(asset => netWorth += +asset)
    data.liabilities.forEach(liability => netWorth -= +liability)
    
    console.log(netWorth, data)
    netWorthContainer.innerHTML = `Net Worth: ${netWorth}`
}


/**
 * @description Verifies that data.json exists, and creates it if it doesn't.
 */
async function verifyDataFile() {
    try {
        const content = await Neutralino.filesystem.readFile('./data.json')
        if (!content) {
            await Neutralino.filesystem.writeFile('./data.json', JSON.stringify({assets: [], liabilities: []}, null, 2))
        }
    } catch (error) {
        if (error.code === 'NE_FS_FILRDER') {
            // File doesn't exist, create it with initial data
            await Neutralino.filesystem.writeFile('./data.json', JSON.stringify({assets: [], liabilities: []}, null, 2))
        } else {
            console.error('Error in verifyDataFile:', error)
        }
    }
}

/* ****************** */

// Initialize Neutralino
Neutralino.init()

// Register event listeners
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked)
Neutralino.events.on("windowClose", onWindowClose)

// Conditional initialization: Set up system tray if not running on macOS
if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray()
}

// Display app information
showInfo()

// Verify that data.json exists
verifyDataFile()
updateNetWorth()


inputter.addEventListener('submit', async(e) => {
    e.preventDefault()
    let inputValue = value.value
    let inputType = type.value

    try {
        // Check if the value is a number
        if (isNaN(value.value)) {
            alert('Please enter a valid number')
            return
        }

        // Check if a type is selected
        if (!document.querySelector('input[name="type"]:checked')) {
            alert('Please select either Asset or Liability')
            return
        }

        // Get the input values
        inputValue = value.value
        inputType = document.querySelector('input[name="type"]:checked').value
        
        // Open and update the JSON file
        const content = await Neutralino.filesystem.readFile('./data.json')
        // Parse the JSON content
        let data = JSON.parse(content)
        
        // Update the data based on input type
        if (inputType === 'asset') {
            if (!data.assets) data.assets = []
            data.assets.push(inputValue)
        } else if (inputType === 'liability') {
            if (!data.liabilities) data.liabilities = []
            data.liabilities.push(inputValue)
        }
        
        // Write the updated data back to the file
        await Neutralino.filesystem.writeFile('./data.json', JSON.stringify(data, null, 2))
        value.value = '' // Clear the input field

        updateNetWorth()
    } catch (error) {
        console.error('Error handling file:', error)
        // Create the file if it doesn't exist
        if (error.code === 'NE_FS_FILRDER') {
            const initialData = {}
            if (inputType === 'asset') {
                initialData.assets = [inputValue]
                initialData.liabilities = []
            } else {
                initialData.assets = []
                initialData.liabilities = [inputValue]
            }
            await Neutralino.filesystem.writeFile('./data.json', JSON.stringify(initialData, null, 2))
            value.value = '' // Clear the input field
        }
    }
    return false
})
