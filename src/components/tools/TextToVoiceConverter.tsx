import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TextToVoiceConverter = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = () => {
    if (text.trim() === "") return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    synth.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const pauseResume = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
      } else {
        synth.pause();
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Text Input</label>
            <Input
              placeholder="Type text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="border rounded p-1 bg-transparent"
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Rate</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Pitch</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
            />
          </div>

          <div className="flex gap-4">
            <Button onClick={speak} disabled={isSpeaking} className="w-full">
              Speak
            </Button>
            <Button onClick={pauseResume} className="w-full">
              {window.speechSynthesis.paused ? "Resume" : "Pause"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TextToVoiceConverter; 