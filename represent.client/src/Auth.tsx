import { useEffect, useState } from "react";

export default function Auth() {
  const [user, setUser] = useState<object>();

  useEffect(() => {
    fetchUserInfo();

    async function fetchUserInfo() {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUser(data);
    }
  }, []);

  if (user) {
    return (
      <section>
        <form method="POST" action="/auth/signout">
        <button type="submit">Sign out</button>
      </form>
        <pre>{JSON.stringify(user, null, 2)}</pre>
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
