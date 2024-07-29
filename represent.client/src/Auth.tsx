import { useContext, useEffect } from "react";
import { User, UserContext } from "./Context";
import ConnectWithStrava from "./assets/btn_strava_connectwith_orange.svg";
import { Button } from "@nextui-org/react";

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
          <Button type="submit" color="warning">
            Sign out
          </Button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <form method="POST" action="/auth/signin">
        <Button type="submit" variant="solid" radius="none" className="h-fit w-fit bg-inherit p-0">
          <img src={ConnectWithStrava} />
        </Button>
      </form>
    </section>
  );
}
