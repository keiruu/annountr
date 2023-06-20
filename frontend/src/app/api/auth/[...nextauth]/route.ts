import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import * as auth from '@/api/user'

export const authOptions : any = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
    
      credentials: {
        id: { label: "ID", type: "text" },
        email: { label: "Email", type: "text" },
        fullname: { label: "Full Name", type: "text" },
      },

      async authorize(credentials, req) {
        try {
          const currentUser : any = await auth.loginUser({credentials})
          const user = currentUser?.data.data.user;
          
          if (user) {
            // Any object returned will be saved in `user` property of the JWT
            return user
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          // Handle any login errors
          console.log(error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt: async ({ token , user } : { token : any, user : any}) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async (session : any, user : any) => {
      user && (session.user = user);
      return Promise.resolve(session);
    },
  },
  // secret: process.env.JWT_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }