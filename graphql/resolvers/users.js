const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../utils/validators");

module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { name, username, email, password, passwordConfirm } }
    ) => {
      try {
        const { errors, valid } = validateRegisterInput(
          name,
          username,
          email,
          password,
          passwordConfirm
        );
        if (!valid) {
          throw new UserInputError("Error", { errors });
        }

        const userWithEmail = User.findOne({ email });
        const userWithUsername = User.findOne({ username });

        const [userEmail, userUsername] = await Promise.all([
          userWithEmail,
          userWithUsername,
        ]);
        if (userEmail) {
          throw new UserInputError(
            "This email address already exist. Choose another",
            {
              errors: {
                email: "This email address already exist. Choose another",
              },
            }
          );
        }

        if (userUsername) {
          throw new UserInputError(
            "This username has been being taken. Choose another",
            {
              errors: {
                username: "This username has been being taken. Choose another",
              },
            }
          );
        }

        const user = await User.create({
          name,
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        });

        const token = user.generateAuthToken();

        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } catch (err) {
        throw err;
      }
    },
    login: async (_, { email, password }) => {
      try {
        const { errors, valid } = validateLoginInput(email, password);
        if (!valid) {
          throw new UserInputError("Errors", { errors });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.correctPassword(password, user.password))) {
          errors.global = "Incorrect email or password";
          throw new UserInputError("Incorrect email or password", { errors });
        }

        const token = user.generateAuthToken();

        return {
          ...user._doc,
          id: user._id,
          token,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
