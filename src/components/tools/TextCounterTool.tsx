
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const TextCounterTool = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0
  });

  const countTextStats = () => {
    // Count characters
    const characters = text.length;
    
    // Count characters without spaces
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Count words
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    // Count sentences (this is a simplified approach)
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    
    // Count paragraphs
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs
    });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-bold">Text Counter Tool</h2>
        <p className="text-muted-foreground">Enter your text below to analyze it.</p>
        
        <Textarea 
          className="min-h-[200px]" 
          placeholder="Type or paste your text here..." 
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <Button onClick={countTextStats}>Analyze Text</Button>
        
        {stats.characters > 0 && (
          <div className="mt-4 border rounded-lg p-4 bg-secondary/10">
            <h3 className="text-lg font-medium mb-2">Text Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Characters</p>
                <p className="text-xl font-bold">{stats.characters}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
                <p className="text-xl font-bold">{stats.charactersNoSpaces}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Words</p>
                <p className="text-xl font-bold">{stats.words}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sentences</p>
                <p className="text-xl font-bold">{stats.sentences}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
                <p className="text-xl font-bold">{stats.paragraphs}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextCounterTool;
