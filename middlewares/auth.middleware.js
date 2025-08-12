import authToken from '../src/helpers/authToken.helper.js';
import usersModel from '../src/models/users.model.js';

const verifyToken = () => (req, res, next) => {
  console.info('Verifying token...');
  try {
    const authorization = req.header('Authorization');
    const token = authorization.split('Bearer ')[1];
    if (!token) {
      console.warn('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const { email } = authToken.decode(token);
    if (!email) {
      console.warn('Invalid token: no user id found');
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = { email };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyProfileAccess = () => async (req, res, next) => {
  console.info('Verifying profile access...');
  try {
    const { profileId } = req.params;
    const { profile_id: userProfileId } = await usersModel.findByEmail(
      req.user.email
    );

    if (!profileId || userProfileId !== profileId) {
      console.warn('Unauthorized access to profile');
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  } catch (error) {
    console.error('Error verifying profile access:', error);
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export default { verifyToken, verifyProfileAccess };
