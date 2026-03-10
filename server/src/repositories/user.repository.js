import User from '../models/user.model.js';

function mapUserDocument(userDocument) {
  if (!userDocument) {
    return null;
  }

  const plainUser = userDocument.toObject ? userDocument.toObject() : userDocument;

  return {
    id: String(plainUser._id),
    name: plainUser.name,
    email: plainUser.email,
    password: plainUser.password,
    resetTokenHash: plainUser.resetTokenHash,
    resetTokenExpiresAt: plainUser.resetTokenExpiresAt,
  };
}

export async function findUserByEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  return mapUserDocument(user);
}

export async function findUserByResetTokenHash(resetTokenHash) {
  const user = await User.findOne({ resetTokenHash });
  return mapUserDocument(user);
}

export async function updateUserById(userId, updates) {
  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return null;
  }

  return mapUserDocument(updatedUser);
}
