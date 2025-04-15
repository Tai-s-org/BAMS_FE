"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { MessageSquare, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import chatbotApi from "@/api/chatbot"
import { FaRobot } from "react-icons/fa"
import { IoChatboxEllipses } from "react-icons/io5";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const chatContainerRef = useRef(null)

    // Fake initial messages to demonstrate the UI
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: "1",
                    role: "assistant",
                    content: "Xin chào! Tôi là trợ lý ảo của CLB YHBT. Tôi có thể giúp gì cho bạn hôm nay?",
                },
            ])
        }
    }, [messages.length])

    const toggleChat = () => {
        setIsOpen(!isOpen)
    }

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!input.trim()) return

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            // Send request to API
            const response = await chatbotApi.sendMessage({ question: input })

            const data = response?.data.data

            // Add assistant message with the answer from the response
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.answer,
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error("Error:", error)
            // Add error message
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat toggle button */}
            <Button
                onClick={toggleChat}
                className={cn(
                    "rounded-full w-14 h-14 shadow-lg flex items-center justify-center hover:shadow-2xl hover:scale-105",
                    isOpen ? "bg-white text-[#BD2427] hover:bg-[#BD2427] hover:text-white" : "bg-[#BD2427] text-white hover:bg-white hover:text-[#BD2427]",
                )}
            >
                {isOpen ? <X size={24} /> : <IoChatboxEllipses size={24} />}
            </Button>

            {/* Chat container */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl flex flex-col border-2 border-gray-200">
                    {/* Chat header */}
                    <div className="bg-[#BD2427] text-white p-3 rounded-t-lg">
                        <h3 className="font-medium flex items-center gap-2">
                            <FaRobot className="inline" />
                            <span className="font-bold">Trợ lý ảo</span>
                        </h3>
                    </div>

                    {/* Chat messages */}
                    <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto max-h-[400px] min-h-[300px]">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "mb-3 max-w-[80%] p-3 rounded-lg",
                                    message.role === "user" ? "bg-[#BD2427] text-white ml-auto" : "bg-gray-100 text-gray-800",
                                )}
                            >
                                {message.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%] mb-3">
                                <div className="flex space-x-2">
                                    <div
                                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                        style={{ animationDelay: "0ms" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                        style={{ animationDelay: "150ms" }}
                                    ></div>
                                    <div
                                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                                        style={{ animationDelay: "300ms" }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat input */}
                    <div className="p-3 border-t border-gray-200">
                        <form onSubmit={handleSubmit} className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 focus-visible:ring-[#BD2427]"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={isLoading || !input.trim()}
                                className="bg-[#BD2427] hover:bg-[#a01e21] text-white"
                            >
                                <Send size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}