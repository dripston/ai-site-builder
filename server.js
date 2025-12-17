import express from 'express';
import ngrok from '@ngrok/ngrok';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);
const app = express();
const PORT = 3003;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Variable to store the current HTML content
let currentHtmlContent = '';
let ngrokUrl = null;
let ngrokListener = null;

// Serve the current HTML content at the root route
app.get('/', (req, res) => {
  if (currentHtmlContent) {
    res.setHeader('Content-Type', 'text/html');
    res.send(currentHtmlContent);
  } else {
    res.status(404).send('<h1>No HTML content hosted yet</h1><p>Please host some HTML content first.</p>');
  }
});

// Function to kill all ngrok processes
async function killAllNgrokProcesses() {
  try {
    // Kill ngrok on Windows
    await execAsync('taskkill /f /im ngrok.exe 2>nul');
    console.log('✅ Killed ngrok processes');
  } catch (error) {
    // Ignore if no processes were found
  }
}

// Function to kill process on a specific port
async function killProcessOnPort(port) {
  try {
    console.log(`🔍 Checking for processes on port ${port}...`);
    
    // Find process using the port
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (stdout) {
      // Extract PIDs from netstat output
      const lines = stdout.trim().split('\n');
      const pids = new Set();
      
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      }
      
      // Kill each process
      for (const pid of pids) {
        try {
          await execAsync(`taskkill /PID ${pid} /F`);
          console.log(`✅ Killed process ${pid} on port ${port}`);
        } catch (err) {
          // Process might have already ended
        }
      }
      
      // Wait a moment for port to be released
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`✅ Port ${port} is free`);
    }
  } catch (error) {
    // No process found on port, which is fine
    console.log(`✅ Port ${port} is free`);
  }
}

// Function to start ngrok tunnel (@ngrok/ngrok API)
async function startNgrokTunnel() {
  try {
    // Kill any existing ngrok processes first
    await killAllNgrokProcesses();
    
    // Wait for cleanup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔄 Attempting to start ngrok tunnel (@ngrok/ngrok)...');
    
    // Get authtoken from environment or use hardcoded
    const authtoken = process.env.NGROK_AUTHTOKEN || '2uB3n9lMMGrHsTJJ9JVBjv64HnS_8ajrjhkjJjehkyHHTUmqn';
    
    // Create ngrok listener with the official package
    const listener = await ngrok.connect({
      addr: PORT,
      authtoken: authtoken,
    });
    
    // Store listener for cleanup
    ngrokListener = listener;
    
    // Get the URL
    const url = listener.url();
    
    console.log(`✅ Ngrok tunnel started: ${url}`);
    return url;
  } catch (error) {
    console.error('❌ Failed to start ngrok tunnel:', error.message);
    throw new Error('Ngrok connection failed. Using local URL instead.');
  }
}

// Endpoint to receive HTML content from the frontend
app.post('/host-html', async (req, res) => {
  try {
    const { htmlContent } = req.body;
    
    if (!htmlContent) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    // Store the HTML content
    currentHtmlContent = htmlContent;
    
    let urlToReturn;
    
    try {
      if (!ngrokUrl) {
        ngrokUrl = await startNgrokTunnel();
      }
      urlToReturn = ngrokUrl;
    } catch (ngrokError) {
      console.log('⚠️  Ngrok failed, using local URL');
      urlToReturn = `http://localhost:${PORT}`;
    }
    
    console.log(`🌐 Hosting HTML content at: ${urlToReturn}`);
    res.json({ 
      success: true, 
      url: urlToReturn,
      message: 'HTML content hosted successfully'
    });
  } catch (error) {
    console.error('❌ Error hosting HTML:', error);
    res.status(500).json({ error: 'Failed to host HTML content' });
  }
});

// Endpoint to get the current URL
app.get('/current-url', (req, res) => {
  res.json({ 
    url: ngrokUrl || `http://localhost:${PORT}`,
    type: ngrokUrl ? 'ngrok' : 'local'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    port: PORT,
    localUrl: `http://localhost:${PORT}`,
    ngrokActive: !!ngrokUrl,
    ngrokUrl: ngrokUrl
  });
});

// Test HTML endpoint (for manual testing)
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Page</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>✅ Server is working!</h1>
      <p>This is a test HTML page served from the server.</p>
      <p>Port: ${PORT}</p>
      <p>Ngrok URL: ${ngrokUrl || 'Not active'}</p>
      <p>Local URL: http://localhost:${PORT}</p>
    </body>
    </html>
  `);
});

// Start the server
const startServer = async () => {
  // Kill any process using the port first
  await killProcessOnPort(PORT);
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/test`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`\n📝 To host HTML content, make a POST request to http://localhost:${PORT}/host-html`);
    console.log(`📝 Or use the frontend interface to host your website.\n`);
  });
};

// Start the server
startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  try {
    // Close ngrok listener
    if (ngrokListener) {
      await ngrokListener.close();
      console.log('✅ Ngrok listener closed');
    }
    await killAllNgrokProcesses();
    console.log('✅ Ngrok processes stopped');
  } catch (error) {
    console.error('❌ Error stopping ngrok:', error);
  }
  process.exit(0);
});