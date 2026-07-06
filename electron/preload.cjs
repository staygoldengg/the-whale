const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('theWhaleDesktop', {
  platform: process.platform,
  isDesktop: true,
});
