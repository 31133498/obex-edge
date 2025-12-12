# FRPC Camera Streaming Setup Guide

## Overview
This React Native Android app enables remote access to local RTSP IP cameras using FRPC (Fast Reverse Proxy Client) tunneling. Users can view their cameras from anywhere in the world without being on the same WiFi network.

## Architecture
```
Local Camera (192.168.1.100:554) 
    ↓
FRPC on Android (creates tunnel) 
    ↓
FRPS Server on VPS (public gateway) 
    ↓
React Native VLC Player (anywhere in world)
    streams: rtsp://my-server.com:7001
```

## Installation Steps

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Install Additional Required Packages
```bash
npm install react-native-network-info react-native-device-info
# or
yarn add react-native-network-info react-native-device-info
```

### 3. Android Setup
The native Android modules are already configured. Just build the project:

```bash
npx expo run:android
# or
cd android && ./gradlew assembleDebug
```

### 4. FRPC Binary
The FRPC binary is already included in `android/app/src/main/assets/frpc`. This is the ARM64 version compatible with most Android devices.

## Usage Flow

### 1. Initial Setup
1. Open the app and navigate to "Server Setup"
2. Configure your FRPS server details:
   - **Server Address**: Your VPS domain or IP (e.g., `my-server.com`)
   - **Server Port**: FRPS port (default: `7000`)
   - **Token**: Authentication token matching your FRPS server

### 2. Add Cameras
1. Go to "Camera Management"
2. Either:
   - **Auto-discover**: Tap "Scan Network" to find RTSP cameras
   - **Manual add**: Enter camera details manually
3. For each camera, configure:
   - **Name**: Friendly name (e.g., "Living Room")
   - **Local IP**: Camera's IP address (e.g., `192.168.1.100`)
   - **Local Port**: RTSP port (usually `554`)
   - **Remote Port**: Unique port for external access (e.g., `7001`, `7002`)

### 3. Start Tunnel
1. Go to "My Cameras"
2. Tap "Start Tunnel"
3. The app will:
   - Install FRPC binary
   - Generate configuration
   - Start foreground service
   - Create tunnels to your FRPS server

### 4. View Cameras
1. Once tunnel is active, tap any camera to view
2. The VLC player will stream: `rtsp://your-server.com:7001`
3. Works from anywhere with internet connection

## FRPS Server Setup

You need to set up an FRPS server on your VPS/cloud server:

### 1. Download FRPS
```bash
wget https://github.com/fatedier/frp/releases/download/v0.65.0/frp_0.65.0_linux_amd64.tar.gz
tar -xzf frp_0.65.0_linux_amd64.tar.gz
cd frp_0.65.0_linux_amd64
```

### 2. Configure FRPS (frps.toml)
```toml
bindPort = 7000
token = "your_secure_token_123"

[webServer]
addr = "0.0.0.0"
port = 7500
user = "admin"
password = "admin"
```

### 3. Run FRPS
```bash
./frps -c frps.toml
```

### 4. Firewall Configuration
Open these ports on your VPS:
- `7000` - FRPS control port
- `7001-8000` - Camera stream ports
- `7500` - Web dashboard (optional)

## Port Management

### Port Assignment Rules
- **Control Port**: `7000` (FRPS server)
- **Camera Ports**: `7001-8000` (user assigns manually)
- Each camera needs a unique remote port
- App validates no duplicate ports

### Example Configuration
```ini
[common]
server_addr = my-server.com
server_port = 7000
token = your_secure_token_123

[camera_living_room]
type = tcp
local_ip = 192.168.1.100
local_port = 554
remote_port = 7001

[camera_front_door]
type = tcp
local_ip = 192.168.1.101
local_port = 554
remote_port = 7002
```

## Troubleshooting

### Common Issues

1. **FRPC Won't Start**
   - Check FRPS server is running
   - Verify server address and token
   - Ensure network connectivity

2. **Camera Stream Fails**
   - Verify camera IP and port
   - Check camera is accessible locally
   - Ensure tunnel is active

3. **Service Stops**
   - Disable battery optimization for the app
   - Check Android background app restrictions
   - Verify foreground service notification

4. **Network Discovery Fails**
   - Ensure app has network permissions
   - Check WiFi connection
   - Some networks block port scanning

### Logs and Debugging
- FRPC logs are captured and displayed in the app
- Check Android logcat for native module logs:
```bash
adb logcat | grep FRPC
```

## Security Considerations

1. **Token Security**
   - Use strong, unique tokens
   - Don't share tokens publicly
   - Consider token rotation

2. **Network Security**
   - Use VPN for additional security
   - Limit FRPS server access
   - Monitor connection logs

3. **Camera Security**
   - Change default camera passwords
   - Use camera authentication
   - Limit camera network access

## Performance Tips

1. **Battery Optimization**
   - Disable battery optimization for the app
   - Use "Don't optimize" setting

2. **Network Performance**
   - Use wired connection for cameras when possible
   - Ensure good WiFi signal strength
   - Consider camera resolution settings

3. **Server Performance**
   - Use VPS with good bandwidth
   - Monitor server resource usage
   - Consider CDN for multiple users

## File Structure

```
android/
├── app/src/main/
│   ├── assets/frpc                    # FRPC binary
│   ├── java/com/anonymous/obexedge/frpc/
│   │   ├── FRPCModule.kt             # Native module
│   │   ├── FRPCPackage.kt            # React Native package
│   │   └── FRPCService.kt            # Foreground service
│   └── AndroidManifest.xml           # Permissions & service

src/
├── services/
│   ├── CameraTunnelService.js        # Main service wrapper
│   └── StorageService.js             # AsyncStorage wrapper
├── screens/
│   ├── ServerSetupScreen.js          # FRPS configuration
│   ├── CameraManagementScreen.js     # Add/edit cameras
│   ├── CameraListScreen.js           # View all cameras
│   └── CameraStreamScreen.js         # Live stream viewer
└── components/
    └── CameraStream.js               # Navigation component
```

## API Reference

### CameraTunnelService Methods

```javascript
// Server configuration
await CameraTunnelService.saveFRPSConfig(serverAddr, serverPort, token)
await CameraTunnelService.loadFRPSConfig()

// Camera management
await CameraTunnelService.addCamera(name, localIP, localPort, remotePort)
await CameraTunnelService.updateCamera(cameraId, updates)
await CameraTunnelService.removeCamera(cameraId)
await CameraTunnelService.getCameras()

// Tunnel control
await CameraTunnelService.setupAndStart()
await CameraTunnelService.stopTunnel()
await CameraTunnelService.getTunnelStatus()

// Utilities
await CameraTunnelService.discoverCameras()
CameraTunnelService.getCameraStreamURL(camera)
CameraTunnelService.validatePort(port, existingCameras)
```

### Native Module Methods

```javascript
import { NativeModules } from 'react-native';
const { FRPCModule } = NativeModules;

// Binary management
await FRPCModule.installFRPCBinary()
await FRPCModule.generateConfig(cameras, serverAddr, serverPort, token)

// Process control
await FRPCModule.startFRPC(configPath)
await FRPCModule.stopFRPC()
await FRPCModule.isFRPCRunning()

// Service control
await FRPCModule.startForegroundService()
await FRPCModule.stopForegroundService()

// Network discovery
await FRPCModule.scanNetwork()
```

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Android logcat output
3. Verify FRPS server configuration
4. Test camera connectivity locally first

## License

This implementation is provided as-is for educational and development purposes.