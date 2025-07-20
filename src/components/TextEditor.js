import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' }, { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' }, { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' }, { value: 'csharp', label: 'C#' },
    { value: 'html', label: 'HTML' }, { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' }, { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' }, { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }, { value: 'php', label: 'PHP' }
];

const EDITOR_OPTIONS = {
    minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on',
    automaticLayout: true, tabSize: 2, wordWrap: 'on', folding: true
};

const TextEditor = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConnected, setIsConnected] = useState(true);
    const [language, setLanguage] = useState('javascript');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const editorRef = useRef(null);
    const codeRef = useRef('');
    const isUpdatingFromFirestore = useRef(false);
    const saveTimeoutRef = useRef(null);

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `position: fixed; top: 20px; right: 20px; background: #2a9d8f; color: white; padding: 12px 20px; border-radius: 25px; z-index: 10000; font-weight: 600;`;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 2000);
    };

    useEffect(() => { codeRef.current = code; }, [code]);

    useEffect(() => {
        const loadDocument = async () => {
            try {
                const docRef = doc(db, 'docs', documentId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCode(data.code || '');
                    setLanguage(data.language || 'javascript');
                } else {
                    setError('Document not found');
                }
            } catch (err) {
                setError('Error loading document: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        const setupListener = () => {
            const docRef = doc(db, 'docs', documentId);
            return onSnapshot(docRef, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const newCode = data.code || '';
                    const newLanguage = data.language || 'javascript';
                    const currentCode = codeRef.current;
                    if (newCode !== currentCode && !isUpdatingFromFirestore.current) {
                        isUpdatingFromFirestore.current = true;
                        setCode(newCode);
                        setLanguage(newLanguage);
                        setTimeout(() => { isUpdatingFromFirestore.current = false; }, 100);
                    }
                    setIsConnected(true);
                }
            }, () => setIsConnected(false));
        };

        loadDocument();
        const unsubscribe = setupListener();
        return () => unsubscribe();
    }, [documentId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.language-selector-wrapper')) {
                setIsLanguageDropdownOpen(false);
            }
        };
        if (isLanguageDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isLanguageDropdownOpen]);

    const saveToFirestore = async (newCode, newLanguage = language) => {
        if (isUpdatingFromFirestore.current) return;
        try {
            const docRef = doc(db, 'docs', documentId);
            await updateDoc(docRef, { code: newCode, language: newLanguage, lastModified: new Date().toISOString() });
            setIsConnected(true);
        } catch (err) {
            setIsConnected(false);
        }
    };

    const handleEditorChange = (value) => {
        setCode(value || '');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => saveToFirestore(value || ''), 500);
    };

    const handleLanguageChange = (newLanguage) => {
        setLanguage(newLanguage);
        saveToFirestore(code, newLanguage);
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.editor.setTheme('vs-dark');
    };

    const copyDocumentLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => showNotification('Link copied to clipboard!'))
            .catch(() => alert('Failed to copy link'));
    };

    if (isLoading) return (
        <div className="text-editor-container">
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading document...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="text-editor-container">
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Back Home</button>
            </div>
        </div>
    );

    return (
        <div className="codeshare-editor-container">
            <header className="codeshare-header">
                <div className="codeshare-top-bar">
                    <div className="top-bar-left">
                        <div className="brand-section">
                            <img src="/logo192.png" alt="CodeShare Logo" className="brand-logo" />
                            <h1 className="brand-title">codeshare</h1>
                        </div>
                    </div>
                    <div className="top-bar-right">
                        <div className="action-controls">
                            <button onClick={copyDocumentLink} className="save-btn" title="Save and share this code">
                                Save Codeshare
                            </button>
                            <button onClick={copyDocumentLink} className="share-btn" title="Share this code with others">
                                <span className="share-icon">Share</span>
                            </button>
                            <div className="language-selector-wrapper">
                                <button className="language-selector-btn" onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)} title="Select programming language">
                                    <span className="language-icon">{ }</span>
                                    <span className="language-text">
                                        {LANGUAGES.find(lang => lang.value === language)?.label || 'JavaScript'}
                                    </span>
                                    <span className={`dropdown-arrow ${isLanguageDropdownOpen ? 'open' : ''}`}>▼</span>
                                </button>
                                {isLanguageDropdownOpen && (
                                    <div className="language-dropdown">
                                        {LANGUAGES.map(lang => (
                                            <button key={lang.value} className={`language-option ${language === lang.value ? 'active' : ''}`} onClick={() => { handleLanguageChange(lang.value); setIsLanguageDropdownOpen(false); }}>
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => navigate('/')} className="home-btn" title="Go back to home">Home</button>
                        </div>
                    </div>
                </div>
                <div className="instructions-bar">
                    <div className="line-number">1</div>
                    <div className="instruction-text">Write or paste code here then share. Anyone you share with will see code as it is typed!</div>
                </div>
                <div className="status-bar-top">
                    <div className="connection-indicator">
                        <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
                        <span className="status-text">{isConnected ? 'Real-time sync enabled' : 'Connection lost'}</span>
                    </div>
                    <div className="document-info">
                        <span>Document: {documentId}</span>
                    </div>
                </div>
            </header>
            <div className="codeshare-editor-wrapper">
                <div className="main-editor">
                    <Editor height="100%" language={language} value={code} onChange={handleEditorChange} onMount={handleEditorDidMount} options={{ ...EDITOR_OPTIONS, fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace', fontSize: 14, lineHeight: 22, padding: { top: 20, bottom: 20 } }} theme="vs-dark" />
                </div>
            </div>
        </div>
    );
};

export default TextEditor;
