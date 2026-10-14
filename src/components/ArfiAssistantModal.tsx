import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Lightbulb, 
  ShieldAlert, 
  Smartphone, 
  MessageSquareShare 
} from 'lucide-react';

interface ArfiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArfiAssistantModal: React.FC<ArfiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    arfiMessages, 
    isArfiLoading, 
    sendArfiMessage, 
    clearArfiChat, 
    currentUser, 
    getArfiRecommendations 
  } = useApp();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [arfiMessages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isArfiLoading) return;
    sendArfiMessage(text);
    if (!textToSend) setInput('');
  };

  const handleQuickRecommendation = async () => {
    await sendArfiMessage('Dame 3 recomendaciones de última hora para cerrar ventas y optimizar cobranzas hoy.');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPills = [
    { label: '💡 Recomendación de Hoy', action: () => handleQuickRecommendation() },
    { label: '📱 Pitch Miniapp Starter', action: () => handleSend('¿Cuál es el mejor speech de 30 segundos para vender Miniapp Starter?') },
    { label: '🛡️ Objeción: "Es caro"', action: () => handleSend('Un cliente me dice "me parece caro". ¿Cómo le respondo?') },
    { label: '🚨 Aviso de Mantenimiento', action: () => handleSend('Dame un mensaje empático para cobrar el mantenimiento vencido por WhatsApp.') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-hidden">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[750px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-900/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Arfi</h3>
                <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gemini 3.8 Flash Conectado
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Coach y Asistente Comercial Integrado de Arfa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearArfiChat}
              title="Reiniciar chat"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={pill.action}
              className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 shrink-0"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {arfiMessages.map((msg) => {
            const isArfi = msg.sender === 'arfi';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isArfi ? 'justify-start' : 'justify-end'}`}
              >
                {isArfi && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-300" />
                  </div>
                )}
                <div
                  className={`relative group max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isArfi
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-md'
                      : 'bg-indigo-600 text-white rounded-tr-none'
                  }`}
                >
                  {/* Copy button for scripts */}
                  {isArfi && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copiar texto para WhatsApp"
                      className="absolute top-2 right-2 p-1 rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.text}
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors text-left"
                        >
                          → {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span
                    className={`block mt-1 text-[10px] ${
                      isArfi ? 'text-slate-400' : 'text-indigo-200'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isArfiLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-purple-300" />
              </div>
              <div className="bg-slate-800/90 rounded-2xl p-4 text-xs border border-slate-700/80 flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                <span>Arfi está analizando tus datos y redactando la recomendación...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input */}
        <div className="p-3 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Pregúntale a Arfi: objeciones, tácticas, Miniapp, cobranzas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isArfiLoading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isArfiLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-md shadow-purple-600/20 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
            <span>Operando con el perfil de: <strong className="text-slate-300">{currentUser.name}</strong></span>
            <span>Consejo: Puedes copiar cualquier respuesta directo a WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
