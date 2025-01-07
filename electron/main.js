const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';
const port = 3000;
let mainWindow;
let lastWindowedBounds = null;

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Remove o menu
    mainWindow.setMenu(null);

    // Salva o tamanho inicial da janela
    lastWindowedBounds = mainWindow.getBounds();

    // Carrega o arquivo index.html
    if (isDev) {
        mainWindow.loadURL('http://localhost:'+port);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    // Eventos da janela
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Registra atalho F11 para fullscreen
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F11') {
            // Envia mensagem para o frontend lidar com o fullscreen
            mainWindow.webContents.executeJavaScript(`
                const elem = document.documentElement;
                if (!document.fullscreenElement) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            `);
            event.preventDefault();
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC handlers para controle da janela
ipcMain.on('get-screen-size', (event) => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    event.reply('screen-size', { width, height });
});

ipcMain.on('set-window-size', (event, { width, height }) => {
    if (!mainWindow) return;
    
    // Centraliza a janela
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const x = Math.floor((screenWidth - width) / 2);
    const y = Math.floor((screenHeight - height) / 2);
    
    // Atualiza o tamanho e posição
    const newBounds = { x, y, width, height };
    mainWindow.setBounds(newBounds);
    lastWindowedBounds = newBounds;
});
