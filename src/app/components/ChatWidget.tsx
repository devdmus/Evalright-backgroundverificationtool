/*
import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi there! How can we help you today?", isUser: false },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const newMsg = { text: message, isUser: true };
    setMessages((prev) => [...prev, newMsg]);
    setMessage("");

    // Simulate agent reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for reaching out! Our support team will respond shortly.", isUser: false },
      ]);
    }, 1000);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, fontFamily: "Segoe UI, Arial, sans-serif" }}>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "65px",
            right: "0",
            width: "300px",
            height: "380px",
            background: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <div
            style={{
              background: "#1B365D",
              color: "#FFFFFF",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#10B981",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.4)",
                }}
              />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>EvalRight Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#FFFFFF",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                opacity: 0.8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.isUser ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: msg.isUser ? "#1B365D" : "#E5E7EB",
                  color: msg.isUser ? "#FFFFFF" : "#1F2937",
                  padding: "8px 12px",
                  borderRadius: msg.isUser ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  fontSize: "12px",
                  lineHeight: "1.4",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            style={{
              padding: "12px",
              background: "#FFFFFF",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: "1px solid #D1D5DB",
                borderRadius: "20px",
                padding: "8px 14px",
                fontSize: "12px",
                outline: "none",
                fontFamily: "Segoe UI, Arial, sans-serif",
              }}
            />
            <button
              type="submit"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#1B365D",
                color: "#FFFFFF",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#132743")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1B365D")}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: "#1B365D",
          color: "#FFFFFF",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(27, 54, 93, 0.35)",
          transition: "transform 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.background = "#132743";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.background = "#1B365D";
        }}
      >
        <MessageSquare size={22} fill="#FFFFFF" color="#FFFFFF" />
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
*/

// Export a dummy component to prevent import resolve issues if imported elsewhere
export function ChatWidget() {
  return null;
}
