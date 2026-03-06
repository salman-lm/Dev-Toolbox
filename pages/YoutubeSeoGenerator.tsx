
import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import BackButton from "../components/BackButton";

const YOUTUBE_CATEGORIES = [
  "Education", "Entertainment", "Gaming", "Howto & Style",
  "Music", "News & Politics", "Science & Technology",
  "Sports", "Travel & Events", "People & Blogs", "Film & Animation"
];

const TARGET_AUDIENCES = [
  "General", "Beginners", "Professionals", "Teens", "Parents", "Entrepreneurs"
];

const YoutubeSeoGenerator: React.FC = () => {
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Education");
  const [audience, setAudience] = useState("General");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    const apiKey = (process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY);
    
    if (!apiKey) {
      setError("API Key is missing. Please ensure GEMINI_API_KEY is set in your environment.");
      setLoading(false);
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a YouTube SEO expert. Based on the following video script or idea, generate optimized YouTube content.

Video Script/Idea: "${input}"
Category: ${category}
Target Audience: ${audience}

Return a JSON object with this exact structure:
{
  "titles": ["title1", "title2", "title3"],
  "description": "A full SEO-rich YouTube description (minimum 200 words). Include a hook, overview of what viewers will learn, timestamps placeholder section, relevant keywords naturally woven in, call to action, and social links placeholder. Use line breaks for readability.",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8", "#tag9", "#tag10", "#tag11", "#tag12", "#tag13", "#tag14", "#tag15"],
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8", "keyword9", "keyword10"],
  "seoTips": ["tip1", "tip2", "tip3"]
}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response from AI");
      }
      
      const parsed = JSON.parse(text);
      setResult(parsed);
    } catch (err: any) {
      console.error("Gemini Error:", err);
      setError(err.message || "Something went wrong with the AI generation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copyToClipboard(text, id)}
      className={`px-3 py-1 rounded text-[11px] font-mono tracking-wider transition-all duration-200 whitespace-nowrap border ${
        copiedKey === id 
          ? "bg-green-500 border-green-600 text-white" 
          : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
      }`}
    >
      {copiedKey === id ? "✓ COPIED" : "COPY"}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0] font-sans selection:bg-orange-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[80%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[20%] w-[60%] h-[40%] bg-orange-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 pb-24">
        <BackButton />

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-semibold text-orange-500 tracking-wider uppercase">▶ YouTube SEO Generator</span>
          </div>
          <h1 className="text-7xl sm:text-8xl font-black leading-[0.9] tracking-tight mb-6 bg-gradient-to-br from-white via-orange-500 to-amber-500 bg-clip-text text-transparent uppercase">
            Rank<br />Higher.
          </h1>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed">
            Paste your video script or idea — get titles, hashtags, and an SEO-rich description in seconds.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 mb-6 backdrop-blur-sm">
          <label className="block text-[10px] font-mono font-bold tracking-[0.2em] text-orange-500 uppercase mb-3">
            Video Script or Idea
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your full video script, a brief idea, or bullet points of what your video covers..."
            rows={6}
            className="w-full bg-black/40 border border-white/10 rounded-xl text-sm leading-relaxed p-4 outline-none focus:border-orange-500/40 transition-colors placeholder:text-gray-600 resize-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl text-sm p-3 outline-none cursor-pointer hover:bg-black/70 transition-colors"
              >
                {YOUTUBE_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold tracking-wider text-gray-500 uppercase mb-2">Target Audience</label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl text-sm p-3 outline-none cursor-pointer hover:bg-black/70 transition-colors"
              >
                {TARGET_AUDIENCES.map(a => <option key={a} value={a} className="bg-[#0a0a0f]">{a}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className={`w-full py-4 rounded-2xl font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-orange-600/10 ${
            loading || !input.trim() 
              ? "bg-orange-600/20 text-white/30 cursor-not-allowed" 
              : "bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-orange-600/20"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              GENERATING...
            </>
          ) : "▶ GENERATE SEO CONTENT"}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Titles */}
            <ResultCard title="Titles" accentColor="text-orange-500" accentBg="bg-orange-500">
              <div className="space-y-3">
                {result.titles?.map((t: string, i: number) => (
                  <div key={i} className="flex items-start justify-between gap-4 bg-black/30 rounded-xl p-4 border border-white/5">
                    <div className="flex gap-3">
                      <span className="text-[10px] font-mono text-orange-500/60 mt-1">0{i + 1}</span>
                      <p className="text-sm leading-relaxed">{t}</p>
                    </div>
                    <CopyBtn text={t} id={`title-${i}`} />
                  </div>
                ))}
              </div>
            </ResultCard>

            {/* Description */}
            <ResultCard title="SEO Description" accentColor="text-amber-500" accentBg="bg-amber-500">
              <div className="relative">
                <div className="bg-black/30 rounded-xl p-5 text-sm leading-relaxed text-gray-400 whitespace-pre-wrap max-h-80 overflow-y-auto border border-white/5">
                  {result.description}
                </div>
                <div className="mt-4 flex justify-end">
                  <CopyBtn text={result.description} id="desc" />
                </div>
              </div>
            </ResultCard>

            {/* Hashtags */}
            <ResultCard title="Hashtags" accentColor="text-purple-400" accentBg="bg-purple-400">
              <div className="flex flex-wrap gap-2 mb-4">
                {result.hashtags?.map((h: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(h, `h-${i}`)}
                    className="bg-purple-400/10 border border-purple-400/20 text-purple-400 rounded-full px-3 py-1 text-xs font-medium hover:bg-purple-400/20 transition-colors"
                  >
                    {copiedKey === `h-${i}` ? "✓" : h}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <CopyBtn text={result.hashtags?.join(" ")} id="all-hashtags" />
              </div>
            </ResultCard>

            {/* Tags */}
            <ResultCard title="Video Tags" accentColor="text-emerald-400" accentBg="bg-emerald-400">
              <div className="flex flex-wrap gap-2 mb-4">
                {result.tags?.map((t: string, i: number) => (
                  <span key={i} className="bg-emerald-400/5 border border-emerald-400/10 text-emerald-400 rounded-lg px-3 py-1.5 text-[11px] font-mono">
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex justify-end">
                <CopyBtn text={result.tags?.join(", ")} id="all-tags" />
              </div>
            </ResultCard>

            {/* SEO Tips */}
            <ResultCard title="SEO Tips" accentColor="text-blue-400" accentBg="bg-blue-400">
              <div className="space-y-4">
                {result.seoTips?.map((tip: string, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-400/10 text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400">{tip}</p>
                  </div>
                ))}
              </div>
            </ResultCard>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ title, accentColor, accentBg, children }: { title: string; accentColor: string; accentBg: string; children: React.ReactNode }) => (
  <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
    <div className="flex items-center gap-2 mb-6">
      <div className={`w-1 h-4 rounded-full ${accentBg}`} />
      <h3 className={`text-[10px] font-mono font-bold tracking-widest uppercase ${accentColor}`}>{title}</h3>
    </div>
    {children}
  </div>
);

export default YoutubeSeoGenerator;
