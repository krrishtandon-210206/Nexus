import React, { useState, useEffect } from 'react';
import { StudyRoom, StudyRoomParticipant, StudyRoomMessage } from '../types';
import { sound } from '../utils/sound';
import { 
  Users, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Plus, 
  FileText, 
  Lock, 
  Flame, 
  Music, 
  CloudRain, 
  Coffee, 
  Radio, 
  CheckCircle2, 
  Copy,
  ChevronRight,
  MessageSquare,
  LogOut
} from 'lucide-react';

interface GroupStudyRoomsProps {
  rooms: StudyRoom[];
  onAwardXp: (amount: number, reason: string) => void;
  onCreateRoom: (room: StudyRoom) => void;
}

export const GroupStudyRooms: React.FC<GroupStudyRoomsProps> = ({
  rooms,
  onAwardXp,
  onCreateRoom,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string>(rooms[0]?.id || 'room-dsa');
  const [roomList, setRoomList] = useState<StudyRoom[]>(rooms);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // In-room interactive states
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [timerMode, setTimerMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [userMuted, setUserMuted] = useState<boolean>(false);
  const [userCam, setUserCam] = useState<boolean>(true);
  const [activeAmbient, setActiveAmbient] = useState<'lofi' | 'rain' | 'drone' | 'coffee' | 'none'>('lofi');
  const [chatInput, setChatInput] = useState<string>('');
  const [userStatusInput, setUserStatusInput] = useState<string>('Solving LeetCode Two-Pointers');
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const currentRoom = roomList.find((r) => r.id === activeRoomId) || roomList[0];

  // Timer Tick Engine
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      sound.playQuestComplete();
      if (timerMode === 'FOCUS') {
        setTimerMode('BREAK');
        setTimerSeconds(5 * 60); // 5 min break
        onAwardXp(35, `Group Focus Sprint in ${currentRoom?.name || 'Study Room'}`);
      } else {
        setTimerMode('FOCUS');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode, currentRoom, onAwardXp]);

  // Ambient sound handler
  const handleToggleAmbient = (type: 'lofi' | 'rain' | 'drone' | 'coffee' | 'none') => {
    sound.playClick();
    if (activeAmbient === type || type === 'none') {
      setActiveAmbient('none');
      sound.stopAmbientSound();
    } else {
      setActiveAmbient(type);
      sound.startAmbientSound(type);
    }
  };

  // Clean up ambient sound on unmount
  useEffect(() => {
    return () => {
      sound.stopAmbientSound();
    };
  }, []);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Send message in room chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentRoom) return;

    const newMsg: StudyRoomMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'Alex (You)',
      senderAvatar: '🧙‍♂️',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = roomList.map((r) => {
      if (r.id === currentRoom.id) {
        return { ...r, messages: [...r.messages, newMsg] };
      }
      return r;
    });

    setRoomList(updated);
    setChatInput('');
    sound.playClick();
  };

  // Update room notes
  const handleNotesChange = (text: string) => {
    if (!currentRoom) return;
    const updated = roomList.map((r) => {
      if (r.id === currentRoom.id) {
        return { ...r, sharedNotes: text };
      }
      return r;
    });
    setRoomList(updated);
  };

  // Update user status
  const handleUpdateStatus = () => {
    if (!currentRoom) return;
    const updated = roomList.map((r) => {
      if (r.id === currentRoom.id) {
        const updatedParticipants = r.participants.map((p) => {
          if (p.isUser) {
            return { ...p, status: userStatusInput };
          }
          return p;
        });
        return { ...r, participants: updatedParticipants };
      }
      return r;
    });
    setRoomList(updated);
    setIsEditingStatus(false);
    sound.playClick();
  };

  // Create Room Form state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<StudyRoom['category']>('DSA & CODING');
  const [newRoomTimer, setNewRoomTimer] = useState(25);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      topic: newRoomTopic.trim() || 'Collaborative Deep Focus',
      category: newRoomCategory,
      membersCount: 1,
      maxMembers: 8,
      activeTimerMinutes: newRoomTimer,
      timerMode: 'FOCUS',
      isTimerRunning: true,
      ambientSound: 'lofi',
      isPrivate: false,
      sharedNotes: `// Room: ${newRoomName}\n// Topic: ${newRoomTopic}\n// Let's crush this study block!`,
      participants: [
        {
          id: `p-${Date.now()}`,
          name: 'Alex (You)',
          avatar: '🧙‍♂️',
          status: 'Setting up session goals',
          isUser: true,
          isMuted: false,
          isCameraOn: true,
          streakDays: 6,
          joinedAt: 'Just now',
        },
      ],
      messages: [
        {
          id: `m-${Date.now()}`,
          senderName: 'System Guild',
          senderAvatar: '🛡️',
          text: `Room "${newRoomName}" opened! Invite friends to study together for 1.5x XP multiplier.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: true,
        },
      ],
    };

    setRoomList([newRoom, ...roomList]);
    setActiveRoomId(newRoom.id);
    setShowCreateModal(false);
    setNewRoomName('');
    setNewRoomTopic('');
    onCreateRoom(newRoom);
    sound.playQuestComplete();
  };

  const categories = [
    'ALL',
    'DSA & CODING',
    'EXAM CRAM',
    'SILENT POMODORO',
    'PROJECT SQUAD',
  ];

  const filteredRooms = roomList.filter((r) => {
    if (activeCategory === 'ALL') return true;
    return r.category === activeCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-950 p-6 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              GUILD STUDY HALLS • MULTIPLAYER PRODUCTIVITY
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users className="h-7 w-7 text-cyan-400" />
            ONLINE GROUP STUDY ROOMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Join synchronized Pomodoro rooms, study alongside peers with ambient lo-fi soundscapes, share live notes, and unlock +1.5x Study Synergy XP.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all self-start md:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Create Study Room</span>
        </button>
      </div>

      {/* Room Directory Selector Pills */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat);
              }}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Room list quick switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {filteredRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => {
                sound.playClick();
                setActiveRoomId(room.id);
                setTimerSeconds(room.activeTimerMinutes * 60);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeRoomId === room.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>{room.name.split(' ')[1] || room.name.slice(0, 10)}</span>
              <span className="text-[10px] text-slate-400 font-mono">({room.participants.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Active Room Stage (Grid Layout) */}
      {currentRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left Stage: Room Participants & Focus Timer (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Bar: Room Header & Synchronized Pomodoro Timer */}
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/30 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800 font-mono">
                      {currentRoom.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      {currentRoom.participants.length}/{currentRoom.maxMembers} Students Active
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {currentRoom.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Topic: <strong>{currentRoom.topic}</strong>
                  </p>
                </div>

                {/* Big Pomodoro Display */}
                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      {timerMode} TIMER
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">
                      {formatTime(timerSeconds)}
                    </span>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsTimerRunning(!isTimerRunning);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95"
                      title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                    >
                      {isTimerRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-slate-950 ml-0.5" />}
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setTimerSeconds(currentRoom.activeTimerMinutes * 60);
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                      title="Reset Timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ambient Audio Synthesizer Bar */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">Ambient Focus Sound:</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'lofi', label: '🎧 Cyber Lofi', icon: Radio },
                    { id: 'rain', label: '🌧️ Campus Rain', icon: CloudRain },
                    { id: 'drone', label: '🚀 Cosmic Drone', icon: Sparkles },
                    { id: 'coffee', label: '☕ Cafe Ambience', icon: Coffee },
                  ].map((amb) => (
                    <button
                      key={amb.id}
                      onClick={() => handleToggleAmbient(amb.id as any)}
                      className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all flex items-center gap-1 ${
                        activeAmbient === amb.id
                          ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{amb.label}</span>
                    </button>
                  ))}
                  {activeAmbient !== 'none' && (
                    <button
                      onClick={() => handleToggleAmbient('none')}
                      className="rounded-xl px-2.5 py-1 text-xs font-bold bg-rose-950/60 border border-rose-800/60 text-rose-300"
                    >
                      <VolumeX className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Participants Grid (Live Study Avatars & Statuses) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  ROOM SCHOLARS & ACTIVE WORKING STATUS
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> +15 XP / 20m Study Synergy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentRoom.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`rounded-2xl border p-4 transition-all relative ${
                      participant.isUser
                        ? 'border-cyan-500/60 bg-cyan-950/20 shadow-lg shadow-cyan-500/5'
                        : 'border-slate-800 bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-2xl">
                          {participant.avatar}
                          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-extrabold text-white">
                              {participant.name}
                            </h4>
                            {participant.isUser && (
                              <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300 border border-cyan-800">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                            <span className="text-amber-400 flex items-center gap-0.5">
                              <Flame className="h-3 w-3 fill-amber-400" /> {participant.streakDays}d Streak
                            </span>
                            <span>• {participant.joinedAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mic / Cam Indicators */}
                      <div className="flex items-center gap-1 text-slate-400">
                        {participant.isMuted ? (
                          <MicOff className="h-3.5 w-3.5 text-rose-400" />
                        ) : (
                          <Mic className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        {participant.isCameraOn ? (
                          <Video className="h-3.5 w-3.5 text-cyan-400" />
                        ) : (
                          <VideoOff className="h-3.5 w-3.5 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="mt-3 rounded-xl bg-slate-950/80 border border-slate-800 p-2 text-xs text-slate-300 flex items-center justify-between">
                      <span className="truncate mr-2">
                        🎯 <strong className="text-slate-200">{participant.status}</strong>
                      </span>
                      {participant.isUser && (
                        <button
                          onClick={() => setIsEditingStatus(!isEditingStatus)}
                          className="text-[10px] text-cyan-400 hover:underline font-bold shrink-0"
                        >
                          {isEditingStatus ? 'Save' : 'Edit'}
                        </button>
                      )}
                    </div>

                    {/* Quick Edit Status Form for User */}
                    {participant.isUser && isEditingStatus && (
                      <div className="mt-2 flex gap-1.5 animate-in fade-in">
                        <input
                          type="text"
                          value={userStatusInput}
                          onChange={(e) => setUserStatusInput(e.target.value)}
                          placeholder="What are you working on right now?"
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateStatus();
                          }}
                        />
                        <button
                          onClick={handleUpdateStatus}
                          className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-bold text-slate-950 hover:brightness-110"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Room Scratchpad / Code Editor */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-200">
                    SHARED COLLABORATIVE SCRATCHPAD & CODE
                  </h3>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentRoom.sharedNotes);
                    setCopiedNotes(true);
                    setTimeout(() => setCopiedNotes(false), 2000);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedNotes ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedNotes ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Live scratchpad for problem formulations, pseudo-code, and shared test cases. Changes update locally for room members.
              </p>

              <textarea
                value={currentRoom.sharedNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                rows={6}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs sm:text-sm text-cyan-300 font-mono focus:border-cyan-500 focus:outline-none leading-relaxed"
                placeholder="// Write code or shared study notes here..."
              />
            </div>
          </div>

          {/* Right Stage: Room Live Chat & Member Controls (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 min-h-[580px]">
            {/* Chat Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs sm:text-sm font-extrabold text-white">
                    ROOM STUDY CHAT
                  </h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ● LIVE
                </span>
              </div>

              {/* Chat Message Stream */}
              <div className="mt-3 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {currentRoom.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      msg.isSystem
                        ? 'bg-indigo-950/40 border border-indigo-900/50 text-indigo-300'
                        : 'bg-slate-950/70 border border-slate-800/80 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1">
                      <span className="font-bold text-slate-300 flex items-center gap-1">
                        <span>{msg.senderAvatar}</span> {msg.senderName}
                      </span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="mt-1 text-slate-200 text-xs">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input & User Mic/Cam Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Bottom Quick Toggle Toolbar */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setUserMuted(!userMuted);
                    }}
                    className={`rounded-lg p-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                      userMuted
                        ? 'bg-rose-950 border border-rose-800 text-rose-300'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                    title={userMuted ? 'Unmute Mic' : 'Mute Mic'}
                  >
                    {userMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    <span>{userMuted ? 'Muted' : 'Mic On'}</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setUserCam(!userCam);
                    }}
                    className={`rounded-lg p-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                      !userCam
                        ? 'bg-slate-800 border border-slate-700 text-slate-400'
                        : 'bg-cyan-950 border border-cyan-800 text-cyan-300'
                    }`}
                    title={userCam ? 'Turn Off Cam' : 'Turn On Cam'}
                  >
                    {userCam ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                    <span>{userCam ? 'Cam On' : 'Cam Off'}</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  Room: {currentRoom.id}
                </span>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Share question or update..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 p-2 text-slate-950 hover:brightness-110 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Study Room */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">
                  HOST NEW GROUP STUDY ROOM
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Set up a synchronized focus hall with a shared Pomodoro cycle, ambient background audio, and live scratchpad.
            </p>

            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Room Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ Operating Systems Final Sprint"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Focus Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deadlocks, Banker Algorithm & Page Replacement"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Room Category
                  </label>
                  <select
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="DSA & CODING">DSA & Coding</option>
                    <option value="EXAM CRAM">Exam Cram</option>
                    <option value="SILENT POMODORO">Silent Pomodoro</option>
                    <option value="PROJECT SQUAD">Project Squad</option>
                    <option value="GENERAL STUDY">General Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Focus Interval
                  </label>
                  <select
                    value={newRoomTimer}
                    onChange={(e) => setNewRoomTimer(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={25}>25 min (Standard Pomodoro)</option>
                    <option value={45}>45 min (Mid Sprint)</option>
                    <option value={50}>50 min (Deep Work 50/10)</option>
                    <option value={60}>60 min (Marathon Block)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  <span>Launch Study Hall</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
