const UserList = ({ users, selectedUser, onUserSelect }) => {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Never';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return lastSeenDate.toLocaleDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {users.length === 0 ? (
        <div className="p-4 text-center text-gray-300">
          <p>No users found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-600">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user)}
              className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedUser?._id === user._id ? 'bg-gray-700 border-r-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-50 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-300">
                      {formatLastSeen(user.lastSeen)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-300 truncate">
                    @{user.username}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
