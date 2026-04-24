import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Bot, User, Trash2, Plus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useListOpenaiConversations,
  useCreateOpenaiConversation,
  useGetOpenaiConversation,
  useDeleteOpenaiConversation,
  getListOpenaiConversationsQueryKey,
  getGetOpenaiConversationQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface LocalMessage {
  id: number | string;
  role: string;
  content: string;
}

export default function Chatbot() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [streamingMessage, setStreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: loadingConversations } = useListOpenaiConversations();
  const createConversation = useCreateOpenaiConversation();
  const deleteConversation = useDeleteOpenaiConversation();

  const { data: activeConversation, isLoading: loadingMessages } = useGetOpenaiConversation(
    activeConversationId as number,
    { query: { enabled: !!activeConversationId, queryKey: getGetOpenaiConversationQueryKey(activeConversationId as number) } }
  );

  // Auto-create conversation if none exists
  useEffect(() => {
    if (conversations !== undefined) {
      if (conversations.length === 0 && !createConversation.isPending && !activeConversationId) {
        handleNewConversation();
      } else if (conversations.length > 0 && !activeConversationId) {
        setActiveConversationId(conversations[0].id);
      }
    }
  }, [conversations, activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, streamingMessage]);

  const handleNewConversation = () => {
    createConversation.mutate(
      { data: { title: "مشاوره جدید املاک" } },
      {
        onSuccess: (newConv) => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          setActiveConversationId(newConv.id);
        }
      }
    );
  };

  const handleDeleteConversation = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListOpenaiConversationsQueryKey() });
          if (activeConversationId === id) {
            setActiveConversationId(null);
          }
          toast({ title: "گفتگو حذف شد" });
        }
      }
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId || isStreaming) return;

    const messageText = inputMessage;
    setInputMessage("");
    setIsStreaming(true);
    setStreamingMessage("");

    // Optimistically update UI
    queryClient.setQueryData(
      getGetOpenaiConversationQueryKey(activeConversationId),
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          messages: [
            ...(old.messages || []),
            { id: Date.now(), role: "user", content: messageText, createdAt: new Date().toISOString() }
          ]
        };
      }
    );

    try {
      const response = await fetch(`/api/openai/conversations/${activeConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageText })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n').filter(l => l.startsWith('data: '));
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) break;
            if (data.content) {
              fullResponse += data.content;
              setStreamingMessage(fullResponse);
            }
          } catch (e) {
            // Ignore parse errors on incomplete chunks
          }
        }
      }

      // Invalidate to get the final complete message from server
      queryClient.invalidateQueries({ queryKey: getGetOpenaiConversationQueryKey(activeConversationId) });

    } catch (error) {
      toast({ 
        title: "خطا در ارسال پیام", 
        description: "لطفاً اتصال اینترنت خود را بررسی کنید.",
        variant: "destructive"
      });
    } finally {
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  return (
    <div className="container py-8 max-w-6xl h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
        {/* Sidebar */}
        <Card className="md:col-span-1 h-full flex flex-col hidden md:flex border-secondary/20">
          <CardHeader className="p-4 border-b">
            <Button onClick={handleNewConversation} className="w-full flex gap-2" variant="secondary">
              <Plus className="h-4 w-4" />
              مشاوره جدید
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {loadingConversations ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : conversations?.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-4 border-b cursor-pointer transition-colors flex justify-between items-center group
                    ${activeConversationId === conv.id ? 'bg-secondary/10 border-l-4 border-l-secondary' : 'hover:bg-muted'}`}
                >
                  <div className="truncate pr-2">
                    <p className="font-medium text-sm truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conv.createdAt).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3 h-full flex flex-col border-secondary/20 shadow-md">
          <CardHeader className="border-b bg-muted/30 p-4 flex flex-row items-center gap-3">
            <div className="bg-secondary/20 p-2 rounded-full text-secondary">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">مشاور هوشمند املاک AI</CardTitle>
              <p className="text-sm text-muted-foreground">پاسخگوی سوالات ملکی شما در تهران، کرج و مشهد</p>
            </div>
            
            {/* Mobile menu trigger for conversations */}
            <div className="mr-auto md:hidden">
               <Button onClick={handleNewConversation} size="sm" variant="outline" className="flex gap-2">
                  <Plus className="h-4 w-4" />
                  جدید
               </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden relative flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
            {loadingMessages && activeConversationId ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : !activeConversationId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                <MessageSquare className="h-16 w-16 opacity-20" />
                <p className="text-lg">یک گفتگو انتخاب کنید یا گفتگوی جدیدی بسازید.</p>
              </div>
            ) : (
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-6"
              >
                {activeConversation?.messages?.length === 0 && !streamingMessage && (
                  <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="bg-secondary/10 p-4 rounded-full text-secondary">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-lg">چگونه می‌توانم کمک کنم؟</h3>
                    <p className="text-muted-foreground max-w-md">
                      می‌توانید درباره قیمت روز مناطق مختلف، قوانین خرید و فروش، یا محله‌های مناسب برای سرمایه‌گذاری بپرسید.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                      <Button variant="outline" size="sm" onClick={() => setInputMessage("قیمت آپارتمان نوساز در پونک چقدر است؟")}>
                        قیمت آپارتمان در پونک
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInputMessage("بهترین مناطق تهران برای سرمایه گذاری کدامند؟")}>
                        مناطق مناسب سرمایه‌گذاری
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setInputMessage("هزینه کمیسیون املاک چطور محاسبه می شود؟")}>
                        محاسبه کمیسیون املاک
                      </Button>
                    </div>
                  </div>
                )}

                {activeConversation?.messages?.map((msg: LocalMessage) => (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}>
                    <div className={`shrink-0 rounded-full h-8 w-8 flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border shadow-sm rounded-tl-none'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {streamingMessage && (
                  <div className="flex gap-3 max-w-[85%] ml-auto">
                    <div className="shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-card border shadow-sm rounded-tl-none">
                      <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base font-medium">{streamingMessage}</p>
                    </div>
                  </div>
                )}
                
                {isStreaming && !streamingMessage && (
                  <div className="flex gap-3 max-w-[85%] ml-auto">
                    <div className="shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-secondary text-secondary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-4 rounded-2xl bg-card border shadow-sm rounded-tl-none flex items-center gap-2">
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="p-4 border-t bg-background">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="سوال خود را درباره بازار املاک بپرسید..."
                  className="flex-1"
                  disabled={!activeConversationId || isStreaming}
                />
                <Button type="submit" disabled={!activeConversationId || !inputMessage.trim() || isStreaming} className="shrink-0">
                  <Send className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                  ارسال
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}