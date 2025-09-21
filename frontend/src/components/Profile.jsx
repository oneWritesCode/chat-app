import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize form with current user data
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      mobile: user.mobile || ''
    });
    console.log(user.mobile);
    
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.put('http://localhost:3000/api/users/profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Profile updated successfully!');
      // Update user context if needed
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setError('');

    try {
      await axios.delete('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Logout and redirect after successful deletion
      logout();
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white py-12 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex items-center justify-between mb-6">

            <button
              onClick={() => navigate('/chat')}
              className="text-gray-200 hover:text-gray-300"
              title="Back to Chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <div className="flex-1 text-center">
              <h2 className="text-3xl font-extrabold text-gray-50">
                Profile Settings
              </h2>
              <p className="mt-2 text-sm text-gray-50">
                Update your account information
              </p>
            </div>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium pl-2 pb-1 text-gray-50"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-50 bg-gray-700 rounded focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium pl-2 pb-1 text-gray-50"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-50 bg-gray-700 rounded focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium pl-2 pb-1 text-gray-50"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-50 bg-gray-700 rounded focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium pl-2 pb-1 text-gray-50"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-50 bg-gray-700 rounded focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-red-400 font-medium rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-center text-green-400 font-medium rounded">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="group relative w-full flex justify-center py-2 px-4 border border-red-500 text-sm font-medium rounded-md text-red-500 hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-50 mb-4">
                Delete Account
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 px-4 border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
