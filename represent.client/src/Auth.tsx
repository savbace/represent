import { useContext, useEffect } from "react";
import { User, UserContext } from "./Context";

interface AuthProps {
  onSignin(user: User): void;
}

export default function Auth({ onSignin }: AuthProps) {
  const user = useContext(UserContext);

  useEffect(() => {
    fetchUserInfo();

    async function fetchUserInfo() {
      const response = await fetch("/api/user");
      const data = await response.json();
      onSignin(data);
    }
  }, []);

  if (user) {
    return (
      <section>
        <p>
          Hello, <b>{user.name}</b>!
        </p>
        <form method="POST" action="/auth/signout">
          <button type="submit">Sign out</button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <form method="POST" action="/auth/signin">
        <button type="submit">Sign in</button>
      </form>
    </section>
  );
}
