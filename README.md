# CodeShare

A real-time collaborative code editor built with React and Firebase. Share code snippets, collaborate with others, and edit documents in real-time across multiple programming languages.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Multi-language Support**: Supports 14 programming languages including JavaScript, Python, Java, C++, and more
- **Monaco Editor**: Powered by Microsoft's Monaco Editor (the same editor used in VS Code)
- **Document Management**: Create and access documents using unique document references
- **Anonymous Authentication**: No sign-up required - uses Firebase anonymous authentication
- **Auto-save**: Changes are automatically saved to Firebase Firestore
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Syntax Highlighting**: Full syntax highlighting and code formatting for all supported languages

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0, React Router DOM
- **Code Editor**: Monaco Editor React
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Custom CSS
- **Build Tool**: Create React App

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 14 or higher)
- npm or yarn package manager
- A Firebase project with Firestore enabled

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeshare
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication with Anonymous sign-in
   - Update the Firebase configuration in `src/firebase.js` with your project credentials

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

To create a production build:

```bash
npm run build
```

This builds the app for production to the `build` folder and optimizes it for the best performance.

## 📖 How to Use

### Creating a New Document

1. Navigate to the home page
2. Click "Create Document"
3. Enter a unique document reference/ID
4. Click "Create" to create and open the document

### Accessing an Existing Document

1. Navigate to the home page
2. Click "Open Document"
3. Enter the document reference/ID
4. Click "Search" to open the document

### Using the Editor

- **Language Selection**: Use the dropdown in the top-left to select your programming language
- **Auto-save**: Your changes are automatically saved as you type
- **Real-time Collaboration**: Share the document ID with others to collaborate in real-time
- **Home Button**: Click the home icon to return to the main page

## 🏗️ Project Structure

```
src/
├── components/
│   ├── HomePage.js          # Landing page with document creation/access
│   └── TextEditor.js        # Main code editor component
├── App.js                   # Main app component with routing
├── firebase.js              # Firebase configuration and utilities
├── index.js                 # App entry point
└── styles.css              # Global styles
```

## 🔧 Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

## 🌐 Supported Languages

The editor supports syntax highlighting and features for:

- JavaScript
- TypeScript  
- Python
- Java
- C++
- C#
- HTML
- CSS
- JSON
- Markdown
- SQL
- Go
- Rust
- PHP

## 🔐 Security Notes

- The project uses Firebase anonymous authentication
- Firestore security rules should be properly configured for production use
- Consider implementing proper access controls for sensitive documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- Document IDs are case-sensitive
- Large documents may experience performance issues
- Real-time sync may have occasional delays

## 🔮 Future Enhancements

- User authentication and private documents
- Document versioning and history
- Code execution capabilities
- File upload/download functionality
- Themes and customization options
- Voice/video chat integration

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---
Website : [https://codeshare2-8a470.web.app/](https://codeshare2-8a470.web.app/)
