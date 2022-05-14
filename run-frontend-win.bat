::print node version
FOR /F %%F IN ('node.exe --version') DO set NODE_VERSION=%%F
echo Using Node version: %NODE_VERSION% (should be v15 or higher)

::check if dependencies are installed
IF NOT EXIST frontend\node_modules\ (
    call npm install --prefix .\frontend\ package.json
)

::run react app
npm start --prefix frontend