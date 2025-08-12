import bcrypt from 'bcryptjs';
import { config } from '../../config/wawita.config.js';

import authToken from '../helpers/authToken.helper.js';
import usersModel from '../models/users.model.js';
import userProfilesModel from '../models/userProfiles.model.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.info(`Logging in user: ${email}`);
    const user = await usersModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = authToken.generate(user);

    res.status(200).json({
      message: 'Login successful!',
      data: {
        accessToken,
        refreshToken,
        profileId: user.profile_id,
      },
    });
  } catch (error) {
    console.error(
      'Internal server error occurred during authentication:',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    console.info(`Registering user: ${email}`);
    const user = await usersModel.findByEmail(email);
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const { auth: authConfig } = config;
    const hashedPassword = await bcrypt.hash(password, authConfig.saltRounds);
    const newUser = {
      email,
      hashedPassword,
    };

    const createdUser = await usersModel.create(newUser);
    if (!createdUser) {
      return res.status(500).json({ message: 'Failed to create user' });
    }

    const userProfile = {
      userId: createdUser.id,
      fullname: name,
    };
    const createdUserProfile = await userProfilesModel.create(userProfile);
    if (!createdUserProfile) {
      return res.status(500).json({ message: 'Failed to create user profile' });
    }

    const { accessToken, refreshToken } = authToken.generate(createdUser);

    res.status(201).json({
      message: 'User registered successfully',
      data: {
        accessToken,
        refreshToken,
        profileId: createdUserProfile.id,
      },
    });
  } catch (error) {
    console.error(
      'Internal server error occurred during user registration:',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    console.info(`Refreshing token: ${refreshToken}`);
    const user = authToken.decode(refreshToken, true);
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const { accessToken } = authToken.generate(user);

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (error) {
    console.error(
      'Internal server error occurred while refreshing token:',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { login, register, refreshToken };
