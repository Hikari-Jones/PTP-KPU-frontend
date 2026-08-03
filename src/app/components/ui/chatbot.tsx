import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Bot, User, Minimize2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { Avatar, AvatarFallback } from "./avatar"

interface Message {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: string
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Saya Antigravity Assistant KPU. Ada yang bisa saya bantu terkait operasional, surat menyurat, atau DPT?",
      timestamp: "09:00",
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputMessage.trim()) return

    const userText = inputMessage
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: timeStr,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputMessage("")

    // Simulated Bot Response
    setTimeout(() => {
      let botReply = "Terima kasih atas pertanyaannya. Informasi tersebut sedang dalam proses koordinasi dengan tim teknis."
      const lower = userText.toLowerCase()

      if (lower.includes("surat") || lower.includes("masuk")) {
        botReply = "Saat ini terdapat 12 Surat Masuk Aktif dan 3 diantaranya memerlukan respon mendesak."
      } else if (lower.includes("dpt") || lower.includes("pemilih")) {
        botReply = "Data DPT Kab. Minahasa & Sangihe telah diperbarui hari ini per 21 Juni 2026."
      } else if (lower.includes("arsip") || lower.includes("dokumen")) {
        botReply = "Total arsip tersimpan adalah 248 dokumen dengan 6 dokumen baru diunggah bulan ini."
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReply,
        timestamp: timeStr,
      }
      setMessages((prev) => [...prev, botMsg])
    }, 800)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 h-[460px] shadow-2xl border-[#1e293b] bg-[#0c1220]/95 flex flex-col backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <CardHeader className="p-3.5 border-b border-[#1e293b] flex flex-row items-center justify-between bg-[#11192b]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-1.5">
                  AI Assistant KPU
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </CardTitle>
                <p className="text-[10px] text-gray-400">Online | Siap Membantu</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e293b]"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="p-3 flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback
                        className={
                          msg.sender === "user"
                            ? "bg-red-600 text-white text-[10px]"
                            : "bg-[#1e293b] text-red-400 text-[10px]"
                        }
                      >
                        {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`max-w-[78%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-red-600 text-white rounded-tr-none"
                          : "bg-[#162032] text-gray-200 border border-[#1e293b] rounded-tl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span
                        className={`text-[9px] block mt-1 text-right ${
                          msg.sender === "user" ? "text-red-200" : "text-gray-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <CardFooter className="p-3 border-t border-[#1e293b] bg-[#0c1220]">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan..."
                className="text-xs bg-[#131b2e] border-[#1e293b] focus:border-red-500"
              />
              <Button type="submit" size="icon" className="shrink-0 bg-red-600 hover:bg-red-700">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-950/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-red-500/30 flex items-center justify-center cursor-pointer"
          title="Buka Chatbot"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-gray-950 rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-[#080c14]">
            AI
          </span>
        </button>
      )}
    </div>
  )
}
