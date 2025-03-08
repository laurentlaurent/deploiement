'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define API backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  difficulty: number;
  lastReviewed: string | null;
  nextReview: string | null;
};

type UploadError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
};

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (_data: Record<string, unknown>) => {
    if (_data) {
      console.log("_data: ", _data);
    }

    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFlashcards(response.data.flashcards.map((fc: Flashcard) => ({
        ...fc,
        tags: fc.tags ?? [],
      })));
      setUploadStatus({
        type: 'success',
        message: 'File uploaded and processed successfully!',
      });
    } catch (err) {
      const error = err as UploadError;
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.response?.data?.error || 'Failed to upload file.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Check if file type is allowed (PDF, PNG, JPG, JPEG)
      const fileType = selectedFile.type;
      if (
        fileType === 'application/pdf' ||
        fileType === 'image/png' ||
        fileType === 'image/jpeg' ||
        fileType === 'image/jpg'
      ) {
        setFile(selectedFile);
        setUploadStatus({ type: null, message: '' });
      } else {
        setFile(null);
        setUploadStatus({
          type: 'error',
          message: 'Please upload a PDF or image (PNG, JPG, JPEG) file.',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Study Material</CardTitle>
          <CardDescription>
            Upload PDFs or images to automatically generate flashcards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="flex flex-col gap-2">
              <Input
                id="file"
                type="file"
                {...register('file', { required: true })}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
                className="cursor-pointer"
                disabled={isUploading}
              />
              {errors.file && (
                <span className="text-sm text-red-500">File is required</span>
              )}
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </p>
              )}
            </div>

            {uploadStatus.type && (
              <Alert variant={uploadStatus.type === 'error' ? 'destructive' : 'default'}>
                <AlertTitle>
                  {uploadStatus.type === 'error' ? 'Error' : 'Success'}
                </AlertTitle>
                <AlertDescription>{uploadStatus.message}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!file || isUploading}>
            {isUploading ? 'Processing...' : 'Generate Flashcards'}
          </Button>
        </CardFooter>
      </Card>

      {/* Preview of generated flashcards */}
      {flashcards.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Generated Flashcards</h3>
          <div className="grid gap-4">
            {flashcards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle className="text-base">{card.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{card.answer}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    {card.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Difficulty: {card.difficulty}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}