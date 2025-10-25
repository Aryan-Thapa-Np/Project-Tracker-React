import path from 'path';
import { fileURLToPath } from 'url';
import { app, BrowserWindow, Menu } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        title: "Project Tracker",
        icon: "fav.ico",
        minWidth: 800, 
        minHeight: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // Menu.setApplicationMenu(null);
    win.loadFile(path.join(__dirname, 'public', 'index.html'));
  
}

app.whenReady().then(createWindow);
