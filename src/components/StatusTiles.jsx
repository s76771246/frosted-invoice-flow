
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Inbox
} from 'lucide-react';

const StatusTiles = ({ tiles, onClick }) => {
  // Filter tiles to only show Total Received, Approved, Pending, and Rejected
  const filteredTiles = tiles.filter(tile => 
    ['Received', 'Approved', 'Pending', 'Rejected'].includes(tile.status)
  );
  
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'inbox':
        return <Inbox className="h-7 w-7 text-purple-500" />;
      case 'check-circle':
        return <CheckCircle className="h-7 w-7 text-green-500" />;
      case 'clock':
        return <Clock className="h-7 w-7 text-amber-500" />;
      case 'x-circle':
        return <XCircle className="h-7 w-7 text-red-500" />;
      default:
        return <Inbox className="h-7 w-7 text-gray-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {filteredTiles.map((tile) => (
        <div
          key={tile.status}
          className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:bg-white/40 hover:shadow-xl"
          onClick={() => onClick && onClick(tile.status.toLowerCase())}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{tile.status}</h3>
            {getIcon(tile.icon)}
          </div>
          <p className="text-4xl font-bold text-gray-900">{tile.count}</p>
        </div>
      ))}
    </div>
  );
};

export default StatusTiles;
