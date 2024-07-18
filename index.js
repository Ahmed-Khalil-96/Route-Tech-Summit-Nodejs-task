import express from 'express';
import { initiateApp } from './src/modules/initiateApp.js';


const app = express();

initiateApp(app,express);