import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Stories = ({ stories, onAddStory }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 overflow-hidden">
      <div className="flex space-x-4 overflow-x-auto">
        {/* Add Story */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddStory}
          className="flex-shrink-0 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 border-2 border-dashed border-gray-300">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600">Seu story</p>
        </motion.button>

        {/* Stories */}
        {stories.map((story) => (
          <motion.button
            key={story.id}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 text-center"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-500">
                <img
                  src={story.user.avatar}
                  alt={story.user.username}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              </div>
              {story.unread && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-2 truncate w-16">
              {story.user.username}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Stories;
