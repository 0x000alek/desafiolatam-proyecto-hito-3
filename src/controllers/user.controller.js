import userProfilesModel from '../models/userProfiles.model.js';

const findUserProfileById = async (req, res) => {
  try {
    const { profileId } = req.params;

    console.info(`Fetching profile for ID: ${profileId}`);
    const userProfile = await userProfilesModel.findById(profileId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({
      message: 'User profile fetched successfully!',
      data: userProfile,
    });
  } catch (error) {
    console.error(
      'Internal server error occurred while fetching user profile:',
      error
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { findUserProfileById };
