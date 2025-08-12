import jwt from 'jsonwebtoken';
import { config } from '../../config/wawita.config.js';

const decode = (token, isRefreshToken = false) => {
  try {
    const { jwt: jwtConfig } = config;
    const secretKey = isRefreshToken
      ? jwtConfig.refreshSecret
      : jwtConfig.secret;
    const decoded = jwt.verify(token, secretKey);

    return {
      id: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    console.error('Invalid or expired token:', error);
    return null;
  }
};

const generate = (user) => {
  try {
    const { jwt: jwtConfig } = config;

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(tokenPayload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = jwt.sign(tokenPayload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    return null;
  }
};

export default { decode, generate };
