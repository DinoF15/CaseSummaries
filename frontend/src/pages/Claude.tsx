// src/pages/report/Claude.tsx
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { API } from 'aws-amplify';
import { invokeClaude } from '../dataCalls/invokeClaude';
import { toast } from 'react-toastify';
import styles from '../styles/Claude.module.scss';

import { CachedPrompt } from '../types/CachedPrompt';
import { Message } from '../types/Message'




/**
 * An array of cached prompts used for various purposes such as brainstorming,
 * technical analysis, financial reporting, and product development.
 * 
 * 
 * Provides a nice quick way to get started with the AI assistant.
 * 
 * Each prompt object contains:
 * - `title`: A brief title describing the purpose of the prompt.
 * - `prompt`: A detailed description or instruction for the prompt.
 * 
 * Example prompts include:
 * - Brainstorming business strategies
 * - Analyzing technical problems
 * - Summarizing financial reports
 * - Drafting product development roadmaps
 * 
 * @constant
 * @type {CachedPrompt[]}
 */
const CACHED_PROMPTS: CachedPrompt[] = [
  {
    title: "Brainstorm Business Strategy",
    prompt: "Help me generate innovative strategies for expanding our market reach."
  },
  {
    title: "Technical Problem Analysis",
    prompt: "Analyze potential technical challenges in our current project workflow."
  },
  {
    title: "Financial Report Summary",
    prompt: "Provide a concise summary of key financial metrics and insights."
  },
  {
    title: "Product Development Roadmap",
    prompt: "Draft a comprehensive product development roadmap for the next quarter."
  }
];

/**
 * LoadingOverlay component displays a loading spinner with a message indicating that a request is being processed.
 *
 * @returns {JSX.Element} A JSX element containing the loading overlay.
 */
const LoadingOverlay: React.FC = () => (
  <div className={styles.loadingOverlay}>
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <span>Processing your request...</span>
    </div>
  </div>
);

/**
 * Claude component represents an AI assistant chat interface.
 * 
 * @component
 * @returns {JSX.Element} The Claude AI Assistant chat interface.
 * 
 * @example
 * <Claude />
 * 
 * @remarks
 * This component maintains the state of messages, input, loading status, 
 * predictions, and selected model. It also handles sending messages, 
 * formatting messages, and managing predictions.
 * 
 * @function
 * @name Claude
 * 
 * @typedef {Object} Message
 * @property {string} role - The role of the message sender (e.g., 'user', 'assistant').
 * @property {string} content - The content of the message.
 * 
 * @typedef {Object} CachedPrompt
 * @property {string} prompt - The cached prompt text.
 * @property {string} title - The title of the cached prompt.
 * 
 * @state {Message[]} messages - The list of chat messages.
 * @state {string} input - The current input text.
 * @state {boolean} isLoading - The loading state for sending messages.
 * @state {boolean} showPredictions - The state to show or hide predictions.
 * @state {CachedPrompt[]} predictions - The list of prediction prompts.
 * @state {string} selectedModel - The selected AI model.
 * 
 * @ref {HTMLDivElement} messagesEndRef - Reference to the end of the messages container for auto-scrolling.
 * @ref {HTMLDivElement} chatContainerRef - Reference to the chat container for setting initial min-height.
 * @ref {HTMLTextAreaElement} inputRef - Reference to the input textarea for focusing.
 * 
 * @effect Sets the initial chat container min-height on component mount.
 * @effect Auto-scrolls to the bottom of the messages container on new messages.
 * 
 * @method formatMessage - Formats the message content into paragraphs, code blocks, or bullet lists.
 * @method handleSendMessage - Handles sending a message and updating the state.
 * @method handleInputChange - Handles input changes and updates predictions.
 * @method handlePredictionSelect - Handles selecting a prediction and updating the input.
 * @method handleCachedPromptSelect - Handles selecting a cached prompt and updating the input.
 * @method handleKeyPress - Handles key press events for sending messages on Enter key press.
 */
const Claude: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Claude, an AI assistant ready to help you with complex tasks and insights."
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPredictions, setShowPredictions] = useState<boolean>(true);
  const [predictions, setPredictions] = useState<CachedPrompt[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('haiku');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Set initial chat container min-height
  useEffect(() => {
    if (chatContainerRef.current) {
      const height = chatContainerRef.current.offsetHeight;
      chatContainerRef.current.style.minHeight = `${height}px`;
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessage = (content: string) => {
    const blocks = content.split('\n\n');
    return blocks.map((block, blockIndex) => {
      if (block.startsWith('```')) {
        return (
          <pre key={blockIndex} className={styles.codeBlock}>
            <code>{block.replace(/```/g, '')}</code>
          </pre>
        );
      }
      if (block.includes('\n* ') || block.startsWith('* ')) {
        const items = block.split('\n').filter(line => line.trim());
        return (
          <ul key={blockIndex} className={styles.bulletList}>
            {items.map((item, i) => (
              <li key={i}>{item.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return <p key={blockIndex} className={styles.paragraph}>{block}</p>;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setPredictions([]);

    try {
      const response = await invokeClaude(input);
      const assistantContent = response?.bedrock_context || "I apologize, but no additional context was provided.";
      const assistantMessage: Message = { role: 'assistant', content: assistantContent };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error invoking Claude Analysis:', error);
      const errorMessage: Message = { role: 'assistant', content: "I apologize, but there was an error processing your request." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (showPredictions && value.length > 2) {
      const predictionOptions = CACHED_PROMPTS.filter(
        prompt => prompt.prompt.toLowerCase().includes(value.toLowerCase())
      );
      setPredictions(predictionOptions);
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionSelect = (prediction: CachedPrompt) => {
    setInput(prediction.prompt);
    setPredictions([]);
    inputRef.current?.focus();
  };

  const handleCachedPromptSelect = (prompt: CachedPrompt) => {
    setInput(prompt.prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.claudeContainer}>
      <div className={styles.claudeHeader}>
        <h2>Claude AI Assistant</h2>
        <div className={styles.headerControls}>
          <div className={styles.modelSelection}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="model" 
                value="haiku"
                checked={selectedModel === 'haiku'}
                onChange={() => setSelectedModel('haiku')}
              />
              Haiku
            </label>
          </div>
          <div className={styles.togglePrediction}>
            <label className={styles.toggleLabel}>
              <input 
                type="checkbox" 
                checked={showPredictions}
                onChange={() => setShowPredictions(!showPredictions)}
              />
              Enable Predictive Text
            </label>
          </div>
        </div>
      </div>

      <div className={styles.chatWrapper} ref={chatContainerRef}>
        <div className={styles.cachedPrompts}>
          <h3>Quick Prompts</h3>
          {CACHED_PROMPTS.map((prompt, index) => (
            <button 
              key={index} 
              onClick={() => handleCachedPromptSelect(prompt)}
              className={styles.cachedPromptBtn}
            >
              {prompt.title}
            </button>
          ))}
        </div>

        <div className={styles.messagesContainer}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${msg.role}`}>
                {formatMessage(msg.content)}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {predictions.length > 0 && showPredictions && (
            <div className={styles.predictions}>
              {predictions.map((prediction, index) => (
                <div 
                  key={index} 
                  className={styles.predictionItem}
                  onClick={() => handlePredictionSelect(prediction)}
                >
                  {prediction.title}
                </div>
              ))}
            </div>
          )}

          <div className={styles.inputArea}>
            <textarea 
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or select a quick prompt..."
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </div>
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default Claude;
