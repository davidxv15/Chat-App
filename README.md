# Real-Time Chat Application in React + TypeScript + Vite

How to Use the App?

**Sign Up:**

If you do not have an account, use the "Register" button to create an account. You will need to provide a username and password to get started.

**Login:**

Once you have an account, log in by clicking on the "Login" button. After logging in, you'll be directed to the chat room selection page.

**Select a Chat Room:**

Choose a chat room from the list to join. Different rooms are available (e.g., General, Movies, Tech), and each room functions independently, so your conversations are unique to each room.

**Chat:**

Once inside a room, simply start typing in the message input area at the bottom of the chat window and press "Send." Your message will appear in the chat in real time. You'll also see other users typing and sending messages.

### Additional Features:

Typing Indicator: See when others are typing a message in real time.
Active User List: See who is currently active in the chat room.
Sound and Dark Mode Toggle: Adjust your settings using the toggles for sound notifications and dark mode.
Emoji Picker: Add emojis to your messages using the emoji picker button.
Inactivity Timer:
If you're inactive for a prolonged period, you'll receive a warning before being automatically logged out. Stay active to avoid being logged out automatically.

Bulletin:
The app features a bulletin section where quotes or important messages appear. These are randomly selected from a custom collection of admin-updated quotes.

Logout:
You can log out at any time using the "Logout" button in the top-right corner. Closing the browser window or being inactive for 4 hours will also log you out automatically.

Technology Used:
Frontend:
React: The app is built using React for responsive and real-time updates.
TypeScript: Ensures type safety and scalability across the codebase.
Tailwind CSS: Provides a clean, mobile-friendly interface.
Vite: Development environment for fast builds and server-side rendering.
Backend:
Node.js & Express.js: Handles server-side logic and APIs.
MongoDB: Stores user information, messages, and session data.
WebSocket: Real-time two-way communication for sending and receiving messages in chat rooms.
Other:
JWT: Used for user authentication and secure session handling.
Bcrypt: Ensures secure password storage.
CAPTCHA: Protects against spam registrations.
Custom JSON: Displays rotating quotes in the bulletin section for a dynamic user experience.
Future Features:
Admin Bulletin Management:
Enable admins to update the bulletin directly from the app instead of manually editing JSON files.

Push Notifications:
Allow users to receive notifications of new messages or activity when not on the app.

Chat Room Permissions:
Create private rooms or password-protected rooms for departments, making this app ideal for workplace collaboration.

Enhanced User Profile:
Add the ability for users to customize their profiles with avatars, status messages, and more.

File Sharing:
Allow users to send files and images through the chat interface.

Performance Upgrades:
Improve the app to handle larger volumes of users and messages without impacting performance.

Use Case:
The goal of this project is to create a lightweight, real-time chat app that can be used in workplaces. This app can be utilized by businesses for internal communication, allowing different departments to have their own chat rooms. The login process can even serve as an unofficial "clock-in" for employees, helping track work hours and participation. With built-in features like dark mode, sound notifications, and typing indicators, this chat app is designed for ease of use and maximum productivity.

How to Run Locally:
Clone the repository.
Run npm install to install dependencies.
Start the development server with npm run dev.
Open http://localhost:3003 in your browser to view the app.
Deployment:
This app will be deployed using [Heroku/AWS]. Upon deployment, you will be able to access it through the provided URL. 
Stay tuned for the live link!