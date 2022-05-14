# check node version
export NODE_VERSION=$(node --version)
echo Using Node version: $NODE_VERSION

if [[ ${NODE_VERSION:1:2} -lt 15 ]]
    then echo 'You should run Node version 15 or higher!'
fi

# check if dependencies are installed
if [[ ! -d frontend/node_modules ]]
    then npm install --prefix frontend package.json
fi

# set env variables
export HOST='0.0.0.0'

# start react app
npm start --prefix frontend