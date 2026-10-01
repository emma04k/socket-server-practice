# Ticket Socket Server

An Express and WebSocket server for managing a simple ticket queue. It exposes HTTP endpoints to create, assign, and complete tickets, and serves the static client from `public/`.

## Quick start

```bash
npm install
cp .env.template .env
npm run dev
```

The server starts at `http://localhost:3000` by default. Change `PORT` in `.env` to use another port.

## Use the queue UI

After starting the server, open the home page and choose a flow:

| URL | Purpose |
| --- | --- |
| `http://localhost:3000/` | Opens the queue home page. |
| `/new-ticket.html` | Creates new tickets. |
| `/desk.html?escritorio=A` | Lets desk `A` draw and complete tickets. |
| `/public.html` | Displays the four most recently assigned tickets. |

Open the public display and one or more desk pages in separate browser tabs to see updates as tickets are assigned.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Starts the TypeScript server with automatic restart. |
| `npm run build` | Compiles TypeScript into `dist/`. |
| `npm start` | Builds the project and runs the compiled server. |

## HTTP API

Base path: `/api/ticket`

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Lists all tickets. |
| `GET` | `/last` | Returns the latest ticket number. |
| `GET` | `/pending` | Lists tickets not assigned to a desk. |
| `POST` | `/` | Creates a new ticket. |
| `GET` | `/draw/:desk` | Assigns the next pending ticket to a desk. |
| `PUT` | `/done/:ticketId` | Marks a ticket as completed. |
| `GET` | `/working-on` | Returns up to four tickets currently being handled. |

### Example

```bash
# Create a ticket
curl -X POST http://localhost:3000/api/ticket

# Assign the next ticket to desk A
curl http://localhost:3000/api/ticket/draw/A
```

Tickets are kept in memory, so restarting the process restores the initial queue and discards tickets created while it was running.

## Real-time updates

The WebSocket server accepts connections at:

```
ws://localhost:3000/ws
```

Connected clients receive JSON messages when the queue changes:

| Event type | Payload | Trigger |
| --- | --- | --- |
| `on-ticket-count-changed` | Number of pending tickets | A ticket is created or assigned to a desk. |
| `on-working-changed` | Up to four assigned tickets | A desk draws a ticket. |

The browser UI reconnects automatically if the WebSocket connection closes.

## Project structure

```text
src/
├── app.ts                    # HTTP and WebSocket bootstrap
├── config/                   # Environment and UUID adapters
├── domain/                   # Ticket types
└── presentation/             # Express routes, controllers, and services
public/                       # Static client files
```

## Requirements

- Node.js (a current LTS release is recommended)
- npm

## License

ISC. See [LICENSE](LICENSE).
