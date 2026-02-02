import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Sidebar } from './components/layout/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { TimelineView } from './components/timeline/TimelineView';
import { StoryView } from './components/stories/StoryView';
import { AddPersonModal } from './components/modals/AddPersonModal';
import { getPersons, addPerson, updatePerson, deletePerson } from './utils/api';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);

  const [persons, setPersons] = useState([]);
  useEffect(() => {
    getPersons().then(data => {
      setPersons(data.map(p => ({
        ...p,
        avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
        lastSeen: 'Just now',
      })));
    }).catch(() => setPersons([]));
  }, []);

  const currentPerson = persons.find(p => p.id === selectedPerson);

  const handleAddPerson = async (personData) => {
    try {
      const newPerson = await addPerson({
        name: personData.name,
        relationship: personData.relationship || 'Friend',
        preferred_language: 'english',
        speaking_style: personData.tone || 'neutral',
        voice_profile_path: null
      });
      setPersons(prev => ([...prev, {
        ...newPerson,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newPerson.name}`,
        lastSeen: 'Just now',
      }]));
      setSelectedPerson(newPerson.id);
      setActiveTab('chat');
    } catch {}
  };

  const handleUpdatePerson = async (id, newName) => {
    try {
      const updated = await updatePerson(id, { name: newName });
      setPersons(persons.map(p => p.id === id ? { ...p, name: updated.name } : p));
    } catch {}
  };

  const handleDeletePerson = async (id, e) => {
    e.stopPropagation();
    try {
      await deletePerson(id);
      setPersons(persons.filter(p => p.id !== id));
      if (selectedPerson === id) setSelectedPerson(null);
    } catch {}
  };

  const renderContent = () => {
    if (selectedPerson && currentPerson) {
      return <ChatWindow type="person" person={currentPerson} />;
    }

    switch (activeTab) {
      case 'chat':
        return <ChatWindow type="general" />;
      case 'timeline':
        return <TimelineView />;
      case 'stories':
        return <StoryView />;
      case 'settings':
        return <div className="flex items-center justify-center h-full">Settings</div>;
      default:
        return <ChatWindow type="general" />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        persons={persons}
        onAddPerson={() => setIsAddPersonModalOpen(true)}
        onDeletePerson={handleDeletePerson}
        onUpdatePerson={handleUpdatePerson}
      />
      <main className="flex-1 overflow-hidden relative">
        <AddPersonModal
          isOpen={isAddPersonModalOpen}
          onClose={() => setIsAddPersonModalOpen(false)}
          onAdd={handleAddPerson}
        />
        {/* Background for main area as well if needed */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px]" />
        </div>

        <div className="relative z-10 h-full p-4 md:p-6">
          <div className="h-full rounded-3xl glass overflow-hidden border border-white/40 shadow-sm relative">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
