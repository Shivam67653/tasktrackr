import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (board: { name: string; color: string }) => void;
}

const boardColors = [
  '#00bfff', // Electric blue
  '#9932cc', // Purple
  '#00ff7f', // Neon green  
  '#ff6347', // Orange red
  '#ffd700', // Gold
  '#ff1493', // Hot pink
  '#00ced1', // Dark turquoise
  '#ff4500'  // Orange
];

export function BoardModal({ isOpen, onClose, onSave }: BoardModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    color: boardColors[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      color: formData.color
    });

    setFormData({ name: '', color: boardColors[0] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border glow-primary">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            Create New Board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="boardName" className="text-sm font-medium">
              Board Name *
            </Label>
            <Input
              id="boardName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Marketing, Dev Sprint 1..."
              className="bg-input border-border focus:border-primary focus:ring-primary"
              required
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Board Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {boardColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`
                    w-12 h-12 rounded-lg border-2 transition-all duration-200 hover-lift
                    ${formData.color === color 
                      ? 'border-foreground scale-110' 
                      : 'border-border hover:border-muted-foreground'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:glow-primary"
              disabled={!formData.name.trim()}
            >
              Create Board
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}