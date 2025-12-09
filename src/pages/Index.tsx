import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const MOCK_CHATS = [
  { id: 1, name: 'Алексей Иванов', username: '@alexiv', status: 'online', lastMessage: 'Привет! Как дела?', time: '14:32', unread: 2, avatar: '' },
  { id: 2, name: 'Дизайн команда', username: null, status: 'group', lastMessage: 'Маша: Отправила макеты', time: '13:15', unread: 0, avatar: '', isGroup: true },
  { id: 3, name: 'Мария Петрова', username: '@mariapetro', altUsername: '!марияпетро', status: 'online', lastMessage: 'Спасибо за помощь!', time: '12:48', unread: 5, avatar: '' },
  { id: 4, name: 'Разработка', username: null, status: 'group', lastMessage: 'Антон: Пушу на прод', time: 'Вчера', unread: 0, avatar: '', isGroup: true },
  { id: 5, name: 'Дмитрий Соколов', username: '@dmitrysok', status: 'offline', lastMessage: 'Созвонимся завтра?', time: 'Вчера', unread: 0, avatar: '' },
];

const MOCK_MESSAGES = [
  { id: 1, sender: 'Алексей Иванов', text: 'Привет! Как проект?', time: '14:28', isOwn: false, reactions: ['👍', '🔥'] },
  { id: 2, sender: 'Вы', text: 'Всё отлично, заканчиваю дизайн', time: '14:30', isOwn: true, reactions: [] },
  { id: 3, sender: 'Алексей Иванов', text: 'Супер! Скинь потом скрины', time: '14:32', isOwn: false, reactions: ['👀'] },
  { id: 4, sender: 'Вы', text: 'Конечно, через час покажу', time: '14:33', isOwn: true, reactions: [] },
];

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👀', '✨'];

export default function Index() {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

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
                          <div className="flex gap-2 mt-1">
                            <Input placeholder="+7 (999) 123-45-67" />
                            <Button variant="outline">Подтвердить SMS</Button>
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
                        <div className="flex items-center justify-between">
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
                        <div className="flex items-center justify-between">
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
                            <p className="text-xs text-muted-foreground">Полностью отключить голосовые и видео звонки</p>
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
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 pb-4">
            {MOCK_CHATS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer smooth-transition
                  ${selectedChat.id === chat.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'}
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
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 h-5 min-w-[20px] rounded-full bg-primary text-primary-foreground">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col animate-fade-in">
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
                {selectedChat.status === 'online' ? '🟢 В сети' : selectedChat.status === 'group' ? '256 участников' : 'Был(а) недавно'}
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
          <div className="max-w-4xl mx-auto space-y-4">
            {MOCK_MESSAGES.map((message) => (
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
                      setMessageInput('');
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
              <Button className="px-6 hover-scale">
                <Icon name="Send" size={18} />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              {EMOJI_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className="text-lg hover-scale smooth-transition opacity-70 hover:opacity-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
