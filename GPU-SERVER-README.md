# YOUAREDEV GPU Server Setup

This guide covers the configuration of the dedicated GPU server for YOUAREDEV AI backend.

## Server Specifications

- **IP**: 148.251.178.28
- **OS**: Ubuntu 24.04
- **GPU**: RTX 4000 SFF Ada (20GB VRAM)
- **Runtime**: Ollama
- **Models**: llama3.1:70b, llama3.1:8b
- **Primary Model**: llama3.1:70b
- **Purpose**: AI inference for YOUAREDEV editor and applications

---

## Current Setup

The server is already configured and running with:

- NVIDIA drivers installed and working
- Ollama installed as systemd service
- Public access enabled via `OLLAMA_HOST=0.0.0.0`
- API accessible at: http://148.251.178.28:11434
- No API key required (Ollama is keyless)

---

## Ollama Service Status

Check if Ollama is running:

```bash
systemctl status ollama
```

Expected output:
```
● ollama.service - Ollama Service
     Loaded: loaded
     Active: active (running)
```

---

## Supabase Configuration

In your Supabase project, set these environment variables for the edge function:

1. Go to: **Project Settings → Edge Functions → Environment Variables**

2. Add the following variables:

```
GPU_SERVER_URL=http://148.251.178.28:11434
GPU_MODEL=llama3.1:70b
```

Note: `GPU_API_KEY` is not required (Ollama doesn't use authentication).

3. The edge function will auto-deploy with the next code push.

---

## Testing

### Test Ollama API directly

```bash
curl http://148.251.178.28:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:70b",
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Write a hello world function in Python"}
    ],
    "stream": false
  }'
```

### List available models

```bash
curl http://148.251.178.28:11434/api/tags
```

### Test from YOUAREDEV

Once configured in Supabase, test from your YOUAREDEV application by sending a message in the AI chat.

---

## System Management

### Check Ollama status

```bash
systemctl status ollama
```

### View Ollama logs

```bash
journalctl -u ollama -f
```

### Restart Ollama

```bash
systemctl restart ollama
```

### Stop Ollama

```bash
systemctl stop ollama
```

### Pull new models

```bash
ollama pull llama3.1:8b
ollama pull llama3.1:70b
```

---

## Performance Tuning

### Monitor GPU usage

```bash
watch -n 1 nvidia-smi
```

### Adjust Ollama GPU settings

Edit Ollama service environment:

```bash
sudo systemctl edit ollama
```

Add GPU memory settings:

```
[Service]
Environment="OLLAMA_NUM_PARALLEL=2"
Environment="OLLAMA_MAX_LOADED_MODELS=1"
```

### Switch models

To use the smaller/faster model:

```bash
# In Supabase environment variables, change:
GPU_MODEL=llama3.1:8b
```

---

## Troubleshooting

### Ollama not responding

```bash
# Check if Ollama is running
systemctl status ollama

# Check if port is accessible
curl http://148.251.178.28:11434/api/tags

# Check firewall
sudo ufw status | grep 11434
```

### Connection refused from YOUAREDEV

1. Verify Ollama is listening on 0.0.0.0:
```bash
sudo netstat -tulpn | grep 11434
```

2. Check if `OLLAMA_HOST=0.0.0.0` is set:
```bash
systemctl show ollama | grep Environment
```

3. Restart Ollama:
```bash
systemctl restart ollama
```

### Slow responses

- Switch to llama3.1:8b (faster, less capable)
- Check GPU utilization: `nvidia-smi`
- Ensure GPU acceleration is active (check logs)

### Model not found

```bash
# List installed models
ollama list

# Pull missing model
ollama pull llama3.1:70b
```

---

## Architecture

```
YOUAREDEV Frontend (Browser)
          ↓
Supabase Edge Function (/functions/v1/ai)
          ↓
GPU Server (148.251.178.28:11434)
          ↓
Ollama Runtime
          ↓
llama3.1:70b Model
          ↓
RTX 4000 Ada GPU (20GB VRAM)
```

**Flow**:
1. User types in YOUAREDEV chat
2. Frontend calls Supabase edge function
3. Edge function forwards to Ollama server
4. Ollama processes with GPU acceleration
5. Response streams back to user

**Security**:
- No API key required (Ollama is keyless)
- Ollama accepts requests from any IP (public access enabled)
- Consider adding firewall rules or nginx proxy in production

---

## Next Steps

1. ✅ GPU server setup complete
2. ✅ Ollama installed and running
3. ✅ Models deployed (llama3.1:70b, llama3.1:8b)
4. ✅ API publicly accessible
5. ✅ Edge function updated to use Ollama
6. ⬜ Configure Supabase environment variables (GPU_SERVER_URL, GPU_MODEL)
7. ⬜ Test from YOUAREDEV application
8. ⬜ Monitor performance and adjust settings
9. ⬜ Set up monitoring/alerts (optional)
10. ⬜ Configure firewall rules or nginx proxy (production hardening)

---

## Support

For issues:
1. Check Ollama logs: `journalctl -u ollama -f`
2. Verify GPU: `nvidia-smi`
3. Test API: `curl http://148.251.178.28:11434/api/tags`
4. List models: `ollama list`
5. Review this README

---

**Last Updated**: 2025
**Primary Model**: llama3.1:70b
**Runtime**: Ollama with CUDA
**GPU**: RTX 4000 SFF Ada (20GB VRAM)
