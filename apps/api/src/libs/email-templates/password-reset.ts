export const passwordResetTemplate = ({ resetLink }: { resetLink: string }) => {
  return `Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour. `;
};
