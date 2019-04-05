'use strict'

const { validate } = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class LoginController {
  async login({request, auth, response}) {
    const email = request.input("email", "");
    const password = request.input("password", "")
    const remember = request.input("remember", "")

    const rules = {
      email: "required|email:users,email",
      password: "required"
    };

    const validation = await validate(request.all(), rules)
    if (validation.fails()) {
        return response.status(400).send(validation.messages())
    }

    const user = await User.query()
      .where('email', email)
      .where('isActive', true)
      .first()

    if (user) {
      const passwordVerified = await Hash.verify(password, user.password)

      if (passwordVerified) {
        const token = await auth.generate(user)
        const permissions = await user.getPermissions()

        return response.status(200).send({
          user: {
            name: user.username,
            email: user.email,
            id: user.id,
            created: user.created_at,
            updated: user.updated_at
          },
          token,
          permissions
        })
      } else {
        return response.status(412).send({message: 'Password is not valid'});
      }
    }
  }

  async logout({response, auth}) {
    await auth
      .authenticator('jwt')
      .revokeTokens(auth.current.user, [auth.getAuthHeader()])

    return response.status(200).json({message: 'Logout success'})
  }
}

module.exports = LoginController
