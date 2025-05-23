# hanafuda-auto-grow-and-draw

![Screenshot_56](https://github.com/user-attachments/assets/9ae6da5c-bd8b-4713-bccb-2c4e9a1fa9f4)

# Features
- Auto draw single & all
- Auto grow single & all

# Requirement
- VS Code
- Node.js 18+ / Bun

# How to get refresh token
- Open hanafuda website and login with Google Account
- Inspect Element (F12)
- Go to Application -> Session storage -> Click "stsTokenManager" -> copy value of "refreshToken" start with AMf-xxxxx

# How to run
- Open VS Code and fill accessToken.txt with your all refresh token (separate every one line)
- Open terminal
- Command:
  > npm install

  > node index
- Done
