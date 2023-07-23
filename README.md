# Getting Started with DashGetPaid

### DashGetPaid uses the following dependencies:
  
+ Bootstrap
+ Dash (You may need to 'npm install dash' to get latest working version)
+ React
+ localForage

You can verify in the package.json file

## Install

+ Ensure you have node 16 installed, node 18 will not work. (This may have changed)
+ "git clone" the repository from Github

### `npm install`

This should install the necessary dependancies for the project.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

#### Important DashMoney Caveat for `npm run build` 

There is one alteration to the webpack.json file to allow the Dash SDK to work. There may have been a correction since this README was written. In the App directory `node_modules/react-scripts/config/webpack.config.js` `minimize` needs to be set to false per this article. [https://stackoverflow.com/questions/55165466/how-to-build-a-production-version-of-react-without-minification](https://stackoverflow.com/questions/55165466/how-to-build-a-production-version-of-react-without-minification)
