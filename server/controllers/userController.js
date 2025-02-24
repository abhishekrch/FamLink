const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: '../.env'});


const registerUser = async (req, res) => {
try {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
    return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.createUser({
    name,
    email,
    password: hashedPassword,
    type,
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: '1h', 
    });

    res.status(201).json({ user: newUser, token });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
}
};


const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

    if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findUserByEmail(email);
    if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    });

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, type: user.type }, token });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
}
};

const getAllUsers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching users' });
    }
};

const searchUsers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const { search, type } = req.query;
        const users = await userModel.searchUsers(search, type);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during user search' });
    }
};

const addUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
         const token = authHeader.split(' ')[1];
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const { name, email, password, type } = req.body;

        if (!name || !email || !password || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.createUser({ name, email, password: hashedPassword, type });

        res.status(201).json(newUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while adding user' });
    }
};


module.exports = {
registerUser,
loginUser,
getAllUsers,
searchUsers,
addUser,
};