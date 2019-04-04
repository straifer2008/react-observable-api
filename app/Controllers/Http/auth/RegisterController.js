'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')
const randomstring = require("randomstring");

class RegisterController {
  async register({ request, response }) {
    const email = request.input("email", "");
    const password = request.input("password", "");

    const rules = {
      email: "required|email|unique:users,email",
      password: "required"
    };

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
        return response.status(400).send(validation.messages());
    }

    const user = await User.create({
      email,
      password,
      token: randomstring.generate({ length: 25 }),
      registrationToken: randomstring.generate({ length: 25 })
    });

    await Mail.send("emails.confirm_email", user.toJSON(), message => {
      message
        .from("myTest@email.com")
        .to(user.email)
        .subject("Email confirmation");
    });

    return response.status(200).send('Register complete, please confirm your email')
  }

  async confirmEmail({ request, response }) {
      const registrationToken = request.input('registrationToken', '')

      if (!registrationToken) {
          return response.status(400)
      }

      const user = await User.findBy('registrationToken', registrationToken)

      if (user) {
          try {
              user.registrationToken = null
              user.isActive = true

              await user.save()

              return response.status(200).send(user.token)
          } catch (error) {
              return response.status(400).send(error)
          }
      }
  }
}

module.exports = RegisterController
