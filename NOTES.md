# Ideas
- load discord user info from api to show profile picture & info in ui

# Page Layout
- Home Page
  - Show general stats: # of users, # of bots, # of logs, # of command runs
  - Show recent logs & commands (list view)
  - Show list of your own bots
- Bot Page
  - running/dead status
  - show stats # of total commands, # of logs, graph of commands & logs over time
  - show status of cpu usage, memory,... logs & commands
- Bot Settings
  - client ID
  - Token Show/Reset
  - 
- Settings
  - Theme?
  - delete account -> delete all bots & data


# DB Models
- Bot
  - name: string
  - clientId: string
  - clientSecret: string
  - owner: [User]
  - commands: [Command][]
  - logs: [Log][]
  - totalCommands: number
  - totalLogs: number
  - status: "running" | "dead"

- Log
  - message: string
  - type: "info" | "error" | "warn" | "debug"
  - timestamp: Date
  - bot: [Bot]

- Command
  - name: string
  - user: string
  - opts: object
  - timestamp: Date
  - bot: [Bot]


# API Routes

- websocket endpoint?
- token auth?

## Functions
- log
  - type: "info" | "error" | "warn" | "debug"
  - message: string
  - timestamp: Date
- command
  - name: string
  - user: User
  - opts: object
  - timestamp: Date