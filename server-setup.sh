#!/bin/bash
# ============================================================================
# YOUAREDEV GPU Server Setup Script
# Server: 148.251.178.28 (RTX 4000 SFF Ada 20GB)
# Model: DeepSeek R1 7B (GGUF)
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting YOUAREDEV AI Server Setup..."

# ============================================================================
# 1. Install Dependencies
# ============================================================================
echo "📦 Installing system dependencies..."
sudo apt update
sudo apt install -y curl git python3 python3-pip build-essential cmake

# Install uvicorn for Python API server (if needed)
pip3 install uvicorn fastapi

# ============================================================================
# 2. Install llama.cpp with CUDA support
# ============================================================================
echo "🔧 Building llama.cpp with GPU support..."
cd ~
if [ ! -d "llama.cpp" ]; then
  git clone https://github.com/ggerganov/llama.cpp.git
fi
cd llama.cpp

# Build with CUDA support
make clean
make LLAMA_CUBLAS=1 -j$(nproc)

echo "✅ llama.cpp built successfully with CUDA support"

# ============================================================================
# 3. Create model directory and download DeepSeek R1 7B
# ============================================================================
echo "📥 Setting up model directory..."
sudo mkdir -p /models/deepseek-r1-7b
sudo chown -R $USER:$USER /models

cd /models/deepseek-r1-7b

# Download DeepSeek R1 7B GGUF (Q4_K_M quantization for balance)
if [ ! -f "deepseek-r1-7b.Q4_K_M.gguf" ]; then
  echo "⬇️  Downloading DeepSeek R1 7B model (this may take a while)..."
  wget https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-GGUF/resolve/main/DeepSeek-R1-Distill-Llama-8B-Q4_K_M.gguf \
    -O deepseek-r1-7b.Q4_K_M.gguf
  echo "✅ Model downloaded"
else
  echo "✅ Model already exists"
fi

# ============================================================================
# 4. Create start script
# ============================================================================
echo "📝 Creating AI server start script..."
cat > /models/start-ai-server.sh << 'EOF'
#!/bin/bash
# Start llama.cpp server with OpenAI-compatible API

MODEL_PATH="/models/deepseek-r1-7b/deepseek-r1-7b.Q4_K_M.gguf"
LLAMA_CPP_PATH="$HOME/llama.cpp"

cd "$LLAMA_CPP_PATH"

# Start server with GPU acceleration
./server \
  --model "$MODEL_PATH" \
  --host 0.0.0.0 \
  --port 8000 \
  --n-gpu-layers 35 \
  --ctx-size 4096 \
  --threads $(nproc) \
  --metrics \
  --log-format text \
  --api-key youaredev-local
EOF

chmod +x /models/start-ai-server.sh

# ============================================================================
# 5. Create systemd service
# ============================================================================
echo "⚙️  Creating systemd service..."
sudo tee /etc/systemd/system/ai-server.service > /dev/null << EOF
[Unit]
Description=YOUAREDEV AI Server (DeepSeek R1 7B)
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/llama.cpp
ExecStart=/models/start-ai-server.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Resource limits
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# ============================================================================
# 6. Configure firewall
# ============================================================================
echo "🔥 Configuring firewall..."
sudo ufw allow 8000/tcp
sudo ufw --force enable

# ============================================================================
# 7. Enable and start service
# ============================================================================
echo "🎬 Starting AI server..."
sudo systemctl daemon-reload
sudo systemctl enable ai-server.service
sudo systemctl start ai-server.service

# ============================================================================
# 8. Verify setup
# ============================================================================
echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Server Status:"
sudo systemctl status ai-server.service --no-pager

echo ""
echo "🔍 Testing API endpoint..."
sleep 10  # Wait for server to start

curl -X POST http://148.251.178.28:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer youaredev-local" \
  -d '{
    "model": "deepseek-r1-7b",
    "messages": [{"role": "user", "content": "Say hello"}],
    "temperature": 0.7,
    "max_tokens": 50
  }' || echo "⚠️  API test failed - server may still be starting"

echo ""
echo "🎉 YOUAREDEV AI Server is ready!"
echo "   Endpoint: http://148.251.178.28:8000"
echo "   API Key: youaredev-local"
echo "   Model: DeepSeek R1 7B"
echo ""
echo "📝 Useful commands:"
echo "   Status:  sudo systemctl status ai-server"
echo "   Logs:    sudo journalctl -u ai-server -f"
echo "   Restart: sudo systemctl restart ai-server"
echo "   Stop:    sudo systemctl stop ai-server"
