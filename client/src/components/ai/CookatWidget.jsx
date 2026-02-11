import { useState, useRef, useEffect } from "react";
import { LuMessageCircle, LuX, LuSend, LuLoader } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithCookat } from "../../api/ai.api";

function CookatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hello! I'm Cookat 🐱. Ask me anything about cooking!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await chatWithCookat(input, historyForApi);
      const botMessage = { role: "assistant", content: res.data.reply };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Oops! I'm having trouble connecting to the kitchen. Try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div
        className={`bg-white shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col
          fixed inset-0 z-[60] h-[100dvh] w-full rounded-none
          sm:absolute sm:inset-auto sm:bottom-[calc(100%+16px)] sm:right-0 sm:w-96 sm:h-[500px] sm:rounded-2xl sm:z-auto
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-10 pointer-events-none"
          }
        `}
      >
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 p-1">
              <img
                src="/avatars/assistantAvatar.png"
                alt="Cookat"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-bold">Cookat</h3>
              <p className="text-xs text-white/80">Your AI Chef Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 min-h-0">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p {...props} className="mb-2 last:mb-0" />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="list-disc pl-4 mb-2" />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol {...props} className="list-decimal pl-4 mb-2" />
                    ),
                    li: ({ node, ...props }) => (
                      <li {...props} className="mb-1" />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong {...props} className="font-bold" />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex items-center gap-1">
                <LuLoader className="w-4 h-4 animate-spin text-gray-400" />
                <span className="text-xs text-gray-400">
                  Cookat is thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for a recipe or tip..."
              className="w-full pr-10 pl-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all resize-none text-sm"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <LuSend className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-gray-200 text-gray-600 rotate-90"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {isOpen ? (
          <LuX className="w-6 h-6" />
        ) : (
          <LuMessageCircle className="w-7 h-7" />
        )}

        {/* Tooltip hint if closed */}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with Cookat
          </span>
        )}
      </button>
    </div>
  );
}

export default CookatWidget;
