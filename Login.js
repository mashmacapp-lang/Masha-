import React, { useState } from 'react';
import axios from 'axios';
const Login = () => {
  const [username, setUsername] = useState(''); const [password, setPassword] = useState('');
  const handleSubmit = async (event) => { event.preventDefault(); try { const response = await axios.post('http://localhost:5000/login', { username, password }); localStorage.setItem('token', response.data.token); alert('Login successful!'); } catch (error) { alert('Login failed.'); } };
  return <form onSubmit={handleSubmit}><input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" required /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required /><button type="submit">Login</button></form>;
};
export default Login;
