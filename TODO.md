# Socket.io connection fixes

## Plan
1. Fix Socket.io CORS in `backend/server.js` so it allows the actual frontend origins (Render + Vercel + localhost).
2. Fix socket lifecycle: stop disconnecting the singleton socket on `Mainpage` unmount (`frontend/src/components/mainpage.jsx`).
3. Ensure `chat.jsx` only emits/join after socket is connected; add a connection-ready guard if needed.

## Progress
- [x] Step 1: Update `backend/server.js` Socket.io CORS
- [x] Step 2: Update `frontend/src/components/mainpage.jsx` remove/adjust `socket.disconnect()`
- [x] Step 3: Update `frontend/src/components/chat.jsx` (guard + cleanup)




