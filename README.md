# Hardware Input Mapper

An Electron App to configure Arduino inputs to keyboard and mouse functions

### Linux Setup
`npm i`  
To fix serialport I had to rebuild electron:
`./node_modules/.bin/electron-rebuild`  
`npm start`

### MacOS Setup
`sudo rm -rf $(xcode-select -print-path)`  
`xcode-select --install`  
`brew install yarn`  
`npm i`  
`/node_modules/.bin/electron-rebuild`  
`npm start`  

### Making a build
I have only tried this on Linux and it doesn't work yet - there are some issues with setting up buttons on the Arduino board  

`npm run make` - if you get an rpm error run `sudo apt install rpm`