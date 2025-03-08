'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploadForm } from '@/components/file-upload/upload-form';
import { FlashcardViewer } from '@/components/flashcards/flashcard-viewer';
import { FlashcardEditor } from '@/components/flashcards/flashcard-editor';
import { QuizMode } from '@/components/flashcards/quiz-mode';
import axios from 'axios';

// Define API backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Flashcard and Flashcard Set types
type Flashcard = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  difficulty: number;
  lastReviewed: string | null;
  nextReview: string | null;
};

type FlashcardSet = {
  id: string;
  title: string;
  source: string;
  flashcards: Flashcard[];
};

type FlashcardSetSummary = {
  id: string;
  title: string;
  count: number;
};

type QuizResult = {
  cardId: string;
  correct: boolean;
  timeSpent: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('upload');
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSetSummary[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentView, setCurrentView] = useState<'view' | 'quiz'>('view');
  const [isEditing, setIsEditing] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch flashcard sets when the component mounts
  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/flashcards`);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFlashcardSet = async (setId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/flashcards/${setId}`);
      setSelectedSet(response.data);
      setActiveTab('study');
    } catch (error) {
      console.error('Error fetching flashcard set:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCard = (card: Flashcard) => {
    setCardToEdit(card);
    setIsEditing(true);
  };

  const handleSaveCard = async (updatedCard: Flashcard) => {
    if (!selectedSet) return;

    try {
      // Save to the backend using the correct endpoint
      const response = await axios.put(
        `${API_URL}/flashcards/${selectedSet.id}/cards/${updatedCard.id}`,
        updatedCard
      );

      if (response.data.success) {
        // Update the card locally
        const updatedFlashcards = selectedSet.flashcards.map(card => 
          card.id === updatedCard.id ? updatedCard : card
        );

        // Update the local state
        setSelectedSet({
          ...selectedSet,
          flashcards: updatedFlashcards
        });
      }
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleQuizComplete = (results: QuizResult[]) => {
    // Here you could implement functionality to update the spaced repetition
    // schedule based on quiz results, or store study statistics
    console.log('Quiz completed with results:', results);
    setCurrentView('view');
  };

  const exportFlashcards = () => {
    if (!selectedSet) return;
    
    // Create a JSON file for download
    const dataStr = JSON.stringify(selectedSet, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${selectedSet.title}-flashcards.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">AI Flashcards</h1>
          <p className="text-muted-foreground">
            Upload documents, generate flashcards, and start learning
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="library">My Flashcards</TabsTrigger>
            <TabsTrigger value="study" disabled={!selectedSet}>
              Study
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-6">
            <FileUploadForm />
          </TabsContent>
          
          <TabsContent value="library" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Flashcard Sets</CardTitle>
                <CardDescription>
                  Select a flashcard set to study or review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <p>Loading...</p>
                  </div>
                ) : flashcardSets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No flashcard sets yet. Upload a document to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {flashcardSets.map((set) => (
                      <Card key={set.id} className="cursor-pointer hover:bg-zinc-50" onClick={() => fetchFlashcardSet(set.id)}>
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{set.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {set.count} flashcards
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Select
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="study" className="mt-6">
            {selectedSet && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedSet.title}</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant={currentView === 'view' ? 'default' : 'outline'} 
                      onClick={() => setCurrentView('view')}
                    >
                      Review Mode
                    </Button>
                    <Button 
                      variant={currentView === 'quiz' ? 'default' : 'outline'}
                      onClick={() => setCurrentView('quiz')}
                    >
                      Quiz Mode
                    </Button>
                    <Button variant="outline" onClick={exportFlashcards}>
                      Export
                    </Button>
                  </div>
                </div>

                {currentView === 'view' ? (
                  <FlashcardViewer 
                    flashcards={selectedSet.flashcards}
                    setId={selectedSet.id}
                    onEditCard={handleEditCard}
                  />
                ) : (
                  <QuizMode 
                    flashcards={selectedSet.flashcards} 
                    onComplete={handleQuizComplete}
                  />
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Flashcard editor dialog */}
      {cardToEdit && (
        <FlashcardEditor
          card={cardToEdit}
          isOpen={isEditing}
          onClose={() => {
            setIsEditing(false);
            setCardToEdit(null);
          }}
          onSave={handleSaveCard}
        />
      )}
    </main>
  );
}
