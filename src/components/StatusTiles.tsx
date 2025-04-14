
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Inbox, 
  AlertCircle 
} from 'lucide-react';
import { StatusTile } from '@/types';

interface StatusTilesProps {
  tiles: StatusTile[];
  onClick?: (status: string) => void;
}

const StatusTiles: React.FC<StatusTilesProps> = ({ tiles, onClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'inbox':
        return <Inbox className="h-6 w-6 text-blue-500" />;
      case 'check-circle':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'clock':
        return <Clock className="h-6 w-6 text-amber-500" />;
      case 'x-circle':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-l-4 border-l-blue-500';
      case 'green':
        return 'border-l-4 border-l-green-500';
      case 'amber':
        return 'border-l-4 border-l-amber-500';
      case 'red':
        return 'border-l-4 border-l-red-500';
      default:
        return 'border-l-4 border-l-gray-300';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {tiles.map((tile) => (
        <div
          key={tile.status}
          className={`status-tile ${getBorderColor(tile.color)}`}
          onClick={() => onClick && onClick(tile.status)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{tile.status}</h3>
            {getIcon(tile.icon)}
          </div>
          <p className="text-3xl font-bold">{tile.count}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusTiles;
