import json
import os

settings_path = os.path.expanduser('~/.config/Code - Insiders/User/settings.json')

# Read existing settings
with open(settings_path, 'r') as f:
    content = f.read()
    # Remove any trailing commas before closing braces
    content = content.rstrip()
    if content.endswith(','):
        content = content[:-1]
    settings = json.loads(content)

# Add MCP configuration
settings['mcp'] = {
    "inputs": [
        {
            "type": "promptString",
            "id": "merchant_token",
            "description": "Razorpay Merchant Token",
            "password": True
        }
    ],
    "servers": {
        "razorpay-remote": {
            "command": "npx",
            "args": [
                "mcp-remote",
                "https://mcp.razorpay.com/mcp",
                "--header",
                "Authorization: Basic ${input:merchant_token}"
            ]
        }
    }
}

# Write back with proper formatting
with open(settings_path, 'w') as f:
    json.dump(settings, f, indent=4)

print("✅ Razorpay MCP configuration added successfully!")
print("\n📝 Configuration added:")
print(json.dumps(settings['mcp'], indent=2))
