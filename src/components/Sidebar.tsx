import { useState } from 'react';
import { Plus, Folder, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Board {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  boards: Board[];
  activeBoard: string | null;
  onBoardSelect: (boardId: string) => void;
  onBoardCreate: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ 
  boards, 
  activeBoard, 
  onBoardSelect, 
  onBoardCreate, 
  isCollapsed, 
  onToggle 
}: SidebarProps) {
  return (
    <div className={`
      relative bg-gradient-dark border-r border-border transition-all duration-300 ease-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TaskTrackr
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover-glow-primary p-2"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-4">
        {/* Create Board Button */}
        <Button
          onClick={onBoardCreate}
          className={`
            w-full bg-gradient-primary hover:glow-primary transition-all duration-300
            ${isCollapsed ? 'px-2' : 'px-4'}
          `}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">New Board</span>}
        </Button>

        {/* Boards List */}
        <div className="space-y-2">
          {!isCollapsed && (
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Boards
            </h3>
          )}
          {boards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardSelect(board.id)}
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                hover:bg-muted hover-lift group
                ${activeBoard === board.id 
                  ? 'bg-primary/10 border border-primary/20 glow-primary' 
                  : 'hover:bg-muted/50'
                }
              `}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  activeBoard === board.id ? 'animate-glow-pulse' : ''
                }`}
                style={{ backgroundColor: board.color }}
              />
              {!isCollapsed && (
                <span className={`text-sm font-medium truncate ${
                  activeBoard === board.id ? 'text-primary' : 'text-foreground'
                }`}>
                  {board.name}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="ghost" className="w-full justify-start hover-glow-primary">
            <Settings className="h-4 w-4" />
            <span className="ml-2">Settings</span>
          </Button>
        </div>
      )}
    </div>
  );
}