# Project Plan: Cross-Platform React Native Note-Taking Application

## I. Project Structure:

```
NotesApp/
├── app/             # React Native app entry point and routing
├── components/      # Reusable UI components
│   ├── NoteItem.tsx       # Individual note display component
│   ├── NoteList.tsx       # List of notes component
│   └── ...
├── constants/       # Constant values (e.g., database configuration)
│   └── database.ts
├── data/            # Data access layer (SQLite database interactions)
│   ├── database.ts    # Database initialization and connection
│   ├── note.ts        # Note data access functions (CRUD operations)
│   └── category.ts    # Category data access functions
├── hooks/           # Custom React hooks
│   └── useNotes.ts    # Hook for managing notes data
├── models/          # Data models/interfaces
│   ├── Note.ts        # Note data model
│   └── Category.ts    # Category data model
├── screens/         # App screens/views
│   ├── HomeScreen.tsx   # Main screen displaying the note list
│   ├── NoteScreen.tsx   # Screen for viewing/editing a single note
│   ├── LoginScreen.tsx  # Screen for Google login
│   └── ...
├── services/        # Services for authentication and data synchronization
│   ├── auth.ts        # Authentication service (Google login)
│   └── sync.ts        # Data synchronization service
├── styles/          # Global styles and theming
│   └── global.ts      # Global styles
├── utils/           # Utility functions
│   └── helpers.ts     # Helper functions
├── tailwind.config.js # Tailwind CSS configuration
├── App.tsx          # Root component
├── package.json     # Project dependencies
├── tsconfig.json    # TypeScript configuration
└── ...
```

## II. Dependencies:

*   **React Native:** JavaScript framework for writing cross-platform mobile applications.
    *   `"react-native": "0.72.6"` (example version)
*   **Expo:** Platform for building and deploying React Native applications.
    *   `"expo": "~49.0.13"` (example version)
*   **NativeWind:** Use Tailwind CSS in React Native.
    *   `"nativewind": "^2.0.11"` (example version)
*   **tailwindcss:** CSS framework.
    *   `"tailwindcss": "^3.3.2"` (example version)
*   **react-native-sqlite-storage:** SQLite database for local data storage.
    *   `"react-native-sqlite-storage": "^6.0.1"` (example version)
*   **react-navigation:** Routing and navigation for React Native apps.
    *   `"@react-navigation/native": "^6.1.7"` (example version)
    *   `"@react-navigation/stack": "^6.3.17"` (example version)
*   **expo-splash-screen:**  To keep the splash screen visible while the app loads
    *   `"expo-splash-screen": "~0.20.5"` (example version)
*   **expo-status-bar:**  To manage the status bar
    *   `"expo-status-bar": "~1.6.0"` (example version)
*   **react-native-safe-area-context:**  To handle safe area insets
    *   `"react-native-safe-area-context": "4.6.3"` (example version)
*   **react-native-screens:**  To configure the screens of the app
    *   `"react-native-screens": "~3.22.0"` (example version)
*   **react-native-vector-icons:** For icons
    *   `"react-native-vector-icons": "^10.0.0"` (example version)
*   **expo-notifications:** For handling local notifications
    *   `"expo-notifications": "~0.20.1"` (example version)
*   **@react-native-google-signin/google-signin:** Google Sign-in for React Native.
    *   `"@react-native-google-signin/google-signin": "^9.0.2"` (example version)
*   **firebase:** Backend service for authentication and data storage.
    *   `"firebase": "^10.8.0"` (example version)
*   **Other dependencies:**
    *   `typescript`, `@types/react`, `@types/react-native` (for TypeScript support)

## III. Data Storage (SQLite & Firebase):

*   **Local Database (SQLite):**
    *   `notes` table:
        *   `id` INTEGER PRIMARY KEY AUTOINCREMENT
        *   `title` TEXT NOT NULL
        *   `content` TEXT
        *   `category_id` INTEGER (foreign key to `categories` table)
        *   `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        *   `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        *   `reminder_time` DATETIME (for reminders)
        *   `user_id` TEXT (foreign key to `users` collection in Firebase)
    *   `categories` table:
        *   `id` INTEGER PRIMARY KEY AUTOINCREMENT
        *   `name` TEXT NOT NULL
*   **Cloud Database (Firebase):**
    *   `users` collection:
        *   `uid` (user ID from Google Sign-in)
        *   `email`
        *   `displayName`
    *   `notes` collection (per user):
        *   `noteId` (unique ID for the note)
        *   `title`
        *   `content`
        *   `category_id`
        *   `created_at`
        *   `updated_at`
        *   `reminder_time`

*   **Data Access Layer:**
    *   `data/database.ts`: Initialize the SQLite database connection.
    *   `data/note.ts`: Implement CRUD operations for notes (create, read, update, delete), including setting and retrieving reminders.
    *   `data/category.ts`: Implement CRUD operations for categories.

## IV. Note Management:

*   **Components:**
    *   `components/NoteItem.tsx`: Display individual notes in a list.
    *   `components/NoteList.tsx`: Display a list of notes.
*   **Screens:**
    *   `screens/HomeScreen.tsx`: Display the main note list and search bar.
    *   `screens/NoteScreen.tsx`: Display a single note and allow editing, including setting reminders.
*   **Hooks:**
    *   `hooks/useNotes.ts`: Fetch and manage notes data from the SQLite database.

## V. Organization (Categories/Tags):**

*   Implement a category selection feature in the `NoteScreen.tsx` to assign categories to notes.
*   Display categories in the `NoteItem.tsx` and `NoteList.tsx`.
*   Allow users to create, edit, and delete categories.

## VI. Search Functionality (Full-Text Search):**

*   Use SQLite's full-text search capabilities (FTS5) to index the `notes` table.
*   Implement a search bar in the `HomeScreen.tsx` to allow users to search for notes.
*   Update the `useNotes.ts` hook to fetch notes based on the search query.

## VII. Reminders/Notifications:**

*   Use `expo-notifications` to schedule local notifications for note reminders.
*   Allow users to set a reminder time for each note in the `NoteScreen.tsx`.
*   Store the reminder time in the `notes` table in the SQLite database.
*   Schedule a local notification when the reminder time is reached.

## VIII. Cloud Synchronization (Google Login & Firebase):

*   **Authentication:**
    *   Implement Google Login using `@react-native-google-signin/google-signin` in the `LoginScreen.tsx`.
    *   Use Firebase Authentication to manage user accounts.
*   **Data Synchronization:**
    *   When a user logs in, synchronize their local SQLite data with their Firebase data.
    *   Implement conflict resolution strategies (e.g., last write wins).
    *   Use Firebase Realtime Database or Cloud Firestore to store user data in the cloud.
    *   Implement background synchronization to keep local and cloud data in sync.
*   **Services:**
    *   `services/auth.ts`: Handle Google Login and Firebase Authentication.
    *   `services/sync.ts`: Handle data synchronization between SQLite and Firebase.

## IX. Mermaid Diagram

```mermaid
graph LR
    A[HomeScreen] --> B(NoteList);
    B --> C(NoteItem);
    A --> D{SearchBar};
    C --> E(NoteScreen);
    E --> F{Category Selection};
    F --> G(Categories Table);
    E --> K{Reminder Time};
    K --> L(Notifications);
    B --> H{useNotes Hook};
    H --> I(SQLite Database);
    I --> J(Notes Table);
    J --> G;
    J --> L;
    M[LoginScreen] --> N{Google Sign-in};
    N --> O(Firebase Authentication);
    O --> P{Data Synchronization};
    P --> I;
    P --> Q(Firebase Database);