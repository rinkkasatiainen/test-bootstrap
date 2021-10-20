import {startServer} from './src/server'

interface EnvVariables { PORT: number }

const envVars: EnvVariables = {
    PORT: 7777,
}

void startServer(envVars)
