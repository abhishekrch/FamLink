import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import AddUserForm from './AddUserForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchUsers } from '../lib/api';
import { useNavigate } from 'react-router-dom';

function Dashboard({ user, onLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await searchUsers(search, typeFilter);
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            if (err.response && err.response.status === 401) {
              onLogout();
              navigate('/login')
            }
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchUsers();
  }, [search, typeFilter]);

    const handleAddUserSuccess = (newUser) => {
      setUsers([...users, newUser]);
      setShowAddUserForm(false);
    }

      const handleLogoutLocal = () => {
        onLogout();
        navigate("/login");

      }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user.name} ({user.type})</span>
           <Button onClick={handleLogoutLocal} variant="destructive">
                Logout
           </Button>
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={() => setShowAddUserForm(true)}>Add User</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="child">Child</SelectItem>
            <SelectItem value="mother">Mother</SelectItem>
            <SelectItem value="father">Father</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showAddUserForm && (
        <AddUserForm onAddUserSuccess={handleAddUserSuccess} onClose={() => setShowAddUserForm(false)} />
      )}

      {error && <p className="text-red-500">{error}</p>}
      {loading ? <p>Loading users...</p> : <UserTable users={users} />}
    </div>
  );
}

export default Dashboard;