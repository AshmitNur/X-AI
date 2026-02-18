import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Bot, User, Power, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversation } from '@elevenlabs/react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ELEVENLABS_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

interface ChatRoomProps {
    onLogout: () => void;
}

export default function ChatRoom({ onLogout }: ChatRoomProps) {
    const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'bot' }[]>([
        { text: "Hello! I am your Motorbike Specialist. Ask me about any bike's price, specs, or engine details in Bangladesh.", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ElevenLabs Hook
    const conversation = useConversation({
        onConnect: () => console.log('Connected to ElevenLabs'),
        onDisconnect: () => console.log('Disconnected from ElevenLabs'),
        onMessage: (message: any) => console.log('Message:', message),
        onError: (error: any) => console.error('Error:', error),
    });

    const conversationStatus = conversation.status; // 'connected', 'connecting', 'disconnected'

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: 'user' as const }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const systemPrompt = `You are an expert motorcycle consultant specialized in the Bangladesh market. 
            When a user asks about a motorbike (e.g., "Yamaha R15 V3"), provide:
            1. The current market price in Bangladesh (BDT).
            2. Key specifications (Engine, Power, Torque, Mileage).
            3. A brief mechanical insight into its engine or build quality.
            Keep the tone professional yet conversational. If you don't know the exact current price, estimate based on last known data and mention it.`;

            const fullPrompt = `${systemPrompt}\nUser: ${input}\nKey Specs & Price in BD:`;

            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            const text = response.text();

            setMessages([...newMessages, { text: text, sender: 'bot' }]);
        } catch (error: any) {
            console.error("Gemini API Error:", error);
            const errorMsg = error?.message || "Unknown error";
            setMessages([...newMessages, { text: `Error: ${errorMsg}`, sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleVoice = async () => {
        if (conversationStatus === 'connected') {
            await conversation.endSession();
        } else {
            await conversation.startSession({ agentId: ELEVENLABS_AGENT_ID, connectionType: 'websocket' });
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20
        }}>
            {/* Header */}
            <div style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bot size={24} color="white" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>BUSINESS <span className="logo-x-glow">X</span> AI</h3>
                        <div style={{ fontSize: '0.8rem', color: '#00ff88', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%' }}></span>
                            Motorbike Specialist
                        </div>
                    </div>
                </div>
                <Power color="#ff4444" cursor="pointer" onClick={onLogout} size={24} />
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                padding: '2rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                gap: '10px',
                                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                            }}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: msg.sender === 'user' ? '#ffffff' : '#333',
                                color: msg.sender === 'user' ? 'black' : 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                            </div>
                            <div style={{
                                background: msg.sender === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                color: 'white',
                                lineHeight: '1.5',
                                fontSize: '0.95rem'
                            }}>
                                <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                    >
                        <div style={{ width: '32px', height: '32px', background: '#333', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={18} color="white" />
                        </div>
                        <div style={{ color: '#888', fontStyle: 'italic' }}>Analyzing specs...</div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{
                padding: '2rem',
                maxWidth: '900px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    padding: '0.5rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about a motorbike (e.g. Yamaha R15M)..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            padding: '1rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />

                    {/* Voice Button */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Glowing pulse rings when connected */}
                        {conversationStatus === 'connected' && (
                            <>
                                <motion.div
                                    animate={{ scale: [1, 1.8, 2.2], opacity: [0.6, 0.2, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: '2px solid #ff4444',
                                        pointerEvents: 'none'
                                    }}
                                />
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.4, 0.15, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: '2px solid #ff6666',
                                        pointerEvents: 'none'
                                    }}
                                />
                            </>
                        )}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            animate={conversationStatus === 'connected' ? { boxShadow: ['0 0 8px #ff4444', '0 0 20px #ff4444', '0 0 8px #ff4444'] } : { boxShadow: '0 0 0px transparent' }}
                            transition={conversationStatus === 'connected' ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
                            onClick={toggleVoice}
                            style={{
                                background: conversationStatus === 'connected' ? '#ff4444' : 'rgba(255,255,255,0.15)',
                                border: conversationStatus === 'connected' ? '2px solid #ff6666' : '2px solid rgba(255,255,255,0.2)',
                                padding: 0,
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            <Mic size={20} color="white" strokeWidth={2.5} />
                        </motion.button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        style={{
                            background: 'white',
                            border: '2px solid rgba(255,255,255,0.3)',
                            padding: 0,
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            opacity: loading ? 0.5 : 1
                        }}
                    >
                        <Send size={18} color="black" strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
}
