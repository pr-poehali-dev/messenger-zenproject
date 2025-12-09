import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👀', '✨'];

interface Chat {
  id: number;
  name: string;
  username?: string;
  altUsername?: string;
  status: 'online' | 'offline' | 'group';
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  reactions: string[];
}

export default function Index() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isNewChatGroup, setIsNewChatGroup] = useState(false);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'Вы',
      text: messageInput,
      time,
      isOwn: true,
      reactions: []
    }]);
    
    setMessageInput('');
  };

  const handleCreateChat = () => {
    if (!newChatName.trim()) return;

    const newChat: Chat = {
      id: Date.now(),
      name: newChatName,
      username: isNewChatGroup ? undefined : `@${newChatName.toLowerCase().replace(/\s/g, '')}`,
      status: isNewChatGroup ? 'group' : 'offline',
      lastMessage: '',
      time: 'Новый',
      unread: 0,
      isGroup: isNewChatGroup
    };

    setChats([newChat, ...chats]);
    setNewChatName('');
    setNewChatOpen(false);
    setSelectedChat(newChat);
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-background dark">
      <aside className="w-[320px] bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-sidebar-foreground">Messenger</h1>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent">
                <Icon name="Search" size={18} />
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-sidebar-foreground hover:bg-sidebar-accent">
                    <Icon name="Settings" size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Настройки</DialogTitle>
                  </DialogHeader>
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="profile">Профиль</TabsTrigger>
                      <TabsTrigger value="privacy">Приватность</TabsTrigger>
                      <TabsTrigger value="appearance">Оформление</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4 pt-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">ВЫ</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Изменить фото</Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>Номер телефона</Label>
                          <div className="flex flex-col sm:flex-row gap-2 mt-1">
                            <Input placeholder="+7 (999) 123-45-67" />
                            <Button variant="outline" className="whitespace-nowrap">Подтвердить SMS</Button>
                          </div>
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input placeholder="example@mail.com" className="mt-1" />
                        </div>
                        <div>
                          <Label>Username (@)</Label>
                          <Input placeholder="@yourusername" className="mt-1" />
                        </div>
                        <div>
                          <Label>Альтернативный username (!)</Label>
                          <Input placeholder="!вашникнейм" className="mt-1" />
                          <p className="text-xs text-muted-foreground mt-1">Можно использовать кириллицу</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="privacy" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <Label>Кто может писать</Label>
                            <p className="text-xs text-muted-foreground">Ограничить входящие сообщения</p>
                          </div>
                          <select className="px-3 py-2 rounded-md border bg-background">
                            <option>Все</option>
                            <option>Контакты</option>
                            <option>Никто</option>
                          </select>
                        </div>
                        <Separator />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <Label>Кто может звонить</Label>
                            <p className="text-xs text-muted-foreground">Ограничить входящие звонки</p>
                          </div>
                          <select className="px-3 py-2 rounded-md border bg-background">
                            <option>Все</option>
                            <option>Контакты</option>
                            <option>Никто</option>
                          </select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Отключить звонки</Label>
                            <p className="text-xs text-muted-foreground">Полностью отключить звонки</p>
                          </div>
                          <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Статус онлайн</Label>
                            <p className="text-xs text-muted-foreground">Показывать когда вы в сети</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="appearance" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Тема</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-4 rounded-lg border-2 border-primary bg-background cursor-pointer hover-scale">
                              <div className="h-12 rounded bg-gradient-to-br from-gray-900 to-gray-800 mb-2" />
                              <p className="text-sm text-center">Тёмная</p>
                            </div>
                            <div className="p-4 rounded-lg border cursor-pointer hover-scale">
                              <div className="h-12 rounded bg-gradient-to-br from-gray-100 to-white mb-2" />
                              <p className="text-sm text-center">Светлая</p>
                            </div>
                            <div className="p-4 rounded-lg border cursor-pointer hover-scale">
                              <div className="h-12 rounded bg-gradient-to-br from-blue-500 to-purple-500 mb-2" />
                              <p className="text-sm text-center">Авто</p>
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label className="mb-2 block">Акцентный цвет</Label>
                          <div className="grid grid-cols-6 gap-2">
                            {['#9b87f5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                              <div
                                key={color}
                                className="h-10 rounded-lg cursor-pointer hover-scale border-2 border-transparent hover:border-foreground"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <Label>Размер текста</Label>
                          <select className="px-3 py-2 rounded-md border bg-background">
                            <option>Маленький</option>
                            <option>Средний</option>
                            <option>Большой</option>
                          </select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск"
              className="pl-9 bg-sidebar-accent border-0 text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-sidebar-primary hover:bg-sidebar-accent">
              <Icon name="MessageSquare" size={16} className="mr-1" />
              Все
            </Button>
            <Button variant="ghost" size="sm" className="text-sidebar-foreground hover:bg-sidebar-accent">
              <Icon name="Users" size={16} className="mr-1" />
              Группы
            </Button>
          </div>

          <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <Icon name="Plus" size={18} className="mr-2" />
                Новый чат
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Создать новый чат</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="Введите имя или название группы"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="group-mode"
                    checked={isNewChatGroup}
                    onCheckedChange={setIsNewChatGroup}
                  />
                  <Label htmlFor="group-mode">Создать группу</Label>
                </div>
                <Button onClick={handleCreateChat} className="w-full">
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {chats.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <div className="text-center px-4">
                  <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Нет чатов</p>
                  <p className="text-xs mt-1">Создайте новый чат выше</p>
                </div>
              </div>
            ) : (
              chats
                .filter((chat) =>
                  chat.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setMessages([]);
                    }}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer smooth-transition
                      ${selectedChat?.id === chat.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'}
                    `}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className={chat.isGroup ? 'bg-sidebar-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}>
                          {chat.isGroup ? <Icon name="Users" size={20} /> : chat.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {chat.status === 'online' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-sidebar-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-sidebar-foreground truncate">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage || 'Начните переписку'}</p>
                        {chat.unread > 0 && (
                          <Badge className="ml-2 h-5 min-w-[20px] rounded-full bg-primary text-primary-foreground">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col animate-fade-in">
        {!selectedChat ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-primary rounded-full p-6">
                  <Icon name="MessageCircle" size={64} className="text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">Messenger</h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Выберите чат из списка или создайте новый для начала общения
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => setNewChatOpen(true)}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать чат
              </Button>
              <Button size="lg" variant="outline" onClick={() => setSettingsOpen(true)}>
                <Icon name="Settings" size={20} className="mr-2" />
                Настройки
              </Button>
            </div>
          </div>
        ) : (
          <>
            <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={selectedChat.isGroup ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}>
                    {selectedChat.isGroup ? <Icon name="Users" size={18} /> : selectedChat.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.status === 'online' ? '🟢 В сети' : selectedChat.status === 'group' ? 'Группа' : 'Не в сети'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover-scale">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover-scale">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="hover-scale">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6 bg-background">
              <div className="max-w-4xl mx-auto">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <Icon name="MessagesSquare" size={64} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">Пока нет сообщений</p>
                      <p className="text-sm mt-2">Отправьте первое сообщение ниже</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : ''}`}>
                          {!message.isOwn && (
                            <p className="text-xs text-muted-foreground mb-1 ml-2">{message.sender}</p>
                          )}
                          <div
                            className={`
                              relative group px-4 py-2.5 rounded-2xl smooth-transition
                              ${message.isOwn
                                ? 'bg-primary text-primary-foreground rounded-br-sm'
                                : 'bg-card border border-border rounded-bl-sm'
                              }
                            `}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <span className={`text-[10px] mt-1 block ${message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {message.time}
                            </span>
                            
                            {message.reactions.length > 0 && (
                              <div className="absolute -bottom-3 left-2 flex gap-1">
                                {message.reactions.map((emoji, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-card border border-border rounded-full px-1.5 py-0.5 text-xs hover-scale cursor-pointer"
                                  >
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 smooth-transition">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Icon name="SmilePlus" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-border p-4 bg-card">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <Icon name="Paperclip" size={20} />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Написать сообщение..."
                      className="pr-20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Smile" size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Mic" size={18} />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} className="px-6 hover-scale">
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  {EMOJI_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-lg hover-scale smooth-transition opacity-70 hover:opacity-100"
                      onClick={() => setMessageInput(messageInput + emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
