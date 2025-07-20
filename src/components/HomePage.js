import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ModalContent = ({ modalType, documentId, setDocumentId, error, isLoading, handleDocumentAction, closeModal }) => (
    <div className="modal-overlay">
        <div className="modal">
            <h2>{modalType === 'create' ? 'Create a Document Reference' : 'Enter Document Reference'}</h2>
            <p>{modalType === 'create' ? 'Create a document reference to save and fetch the code from database' : 'Type the document reference to look for'}</p>
            <input type="text" placeholder="Enter document reference" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="modal-input" onKeyPress={(e) => e.key === 'Enter' && handleDocumentAction(modalType === 'create')} autoFocus />
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
                <button onClick={() => handleDocumentAction(modalType === 'create')} disabled={isLoading} className="modal-btn primary">
                    {isLoading ? 'Loading...' : modalType === 'create' ? 'Create' : 'Search'}
                </button>
                <button onClick={closeModal} className="modal-btn secondary">Cancel</button>
            </div>
        </div>
    </div>
);

const HomePage = () => {
    const [documentId, setDocumentId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const resetState = () => { setDocumentId(''); setError(''); };
    const openModal = (type) => { setModalType(type); setShowModal(true); resetState(); };
    const closeModal = () => { setShowModal(false); resetState(); };

    const handleDocumentAction = async (isCreateMode = true) => {
        if (!documentId.trim()) { setError('Please enter a document reference'); return; }
        setIsLoading(true);
        try {
            const docRef = doc(db, 'docs', documentId);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                if (isCreateMode) {
                    await setDoc(docRef, { code: '' });
                } else {
                    setError('Document not found');
                    setIsLoading(false);
                    return;
                }
            }
            navigate(`/editor/${documentId}`);
        } catch (err) {
            setError(`Error ${isCreateMode ? 'creating' : 'searching'} document: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDirectSearch = () => {
        if (!documentId.trim()) return;
        setIsLoading(true);
        handleDocumentAction(true);
    };

    const navItems = [
        { text: 'About', action: () => alert('About CodeShare - Real-time collaborative code editor') },
        { text: 'Contact', action: () => alert('Contact us at: support@codeshare.io') },
        { text: 'Help', action: () => alert('Help: Create or search for documents to start coding together!') }
    ];

    const actionButtons = [
        { text: '📤 Share Code', type: 'create', className: 'action-btn create-btn' },
        { text: '🔎 Search Code', type: 'search', className: 'action-btn search-btn' }
    ];

    const renderButton = ({ text, action, className = '', type = null, onClick = null }) => (
        <button key={text} className={className || 'nav-btn'} onClick={onClick || action || (() => openModal(type))}>{text}</button>
    );

    return (
        <div className="homepage">
            <div className="homepage-container">
                <div className="desktop-layout">
                    <header className="header">
                        <div className="logo-container">
                            <img src="/logo192.png" alt="CodeShare Logo" className="logo" />
                            <h1 className="brand-name">code_share</h1>
                        </div>
                        <nav className="nav-buttons">{navItems.map(renderButton)}</nav>
                    </header>
                    <main className="main-content">
                        <div className="intro-section">
                            <h1 className="main-title">Share Code With Other Devs, in Real-Time</h1>
                            <p className="subtitle">An Online code editor for interviews, troubleshooting, teaching, & more.....</p>
                            <div className="action-buttons">{actionButtons.map(renderButton)}</div>
                        </div>
                    </main>
                </div>
                <div className="mobile-layout">
                    <header className="mobile-header">
                        <h1 className="mobile-brand">code_share</h1>
                    </header>
                    <main className="mobile-main">
                        <img src="/logo192.png" alt="CodeShare Logo" className="mobile-logo" />
                        <div className="mobile-search">
                            <input type="text" placeholder="Type the document reference to look for or create" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="mobile-input" onKeyPress={(e) => e.key === 'Enter' && handleDirectSearch()} />
                            <button className="mobile-search-btn" onClick={handleDirectSearch} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Search'}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
            {showModal && <ModalContent modalType={modalType} documentId={documentId} setDocumentId={setDocumentId} error={error} isLoading={isLoading} handleDocumentAction={handleDocumentAction} closeModal={closeModal} />}
        </div>
    );
};

export default HomePage;
