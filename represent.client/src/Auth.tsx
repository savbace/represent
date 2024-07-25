import { useContext, useEffect } from "react";
import { User, UserContext } from "./Context";
import ConnectWithStrava from "./assets/btn_strava_connectwith_orange.svg";

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
          <button className="shadow-md" type="submit">
            Sign out
          </button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <form method="POST" action="/auth/signin">
        <button type="submit" className="opacity-80 hover:opacity-100">
          <img src={ConnectWithStrava} />
        </button>
      </form>
    </section>
  );
}
