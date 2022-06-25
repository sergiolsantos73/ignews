import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { query as q } from "faunadb";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user",
          // scope: "openid your_custom_scope"
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      console.log('sessao: '+JSON.stringify(session))
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index("subscription_by_status"), 
                "active"
              ),
            ])
          )
        );
        
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (error){
        console.log('erro sessao: ');
        console.log(error);
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn({ user: User, account: Account, profile: Profile }) {
    //async signIn({ user, account, profile }) {
      console.log('usuario: '+JSON.stringify(User));
    // async signIn({ user }) {
      const { email } = User;
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), 
                q.Casefold(User.email))
              )
            ),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(
              q.Match(q.Index('user_by_email'), 
              q.Casefold(User.email))
            )
          )
        );
        return true;
      } catch (error){
        console.log('erro usuario: '+error);
        console.log(error);
        return false;
      }
    }
  }
});
